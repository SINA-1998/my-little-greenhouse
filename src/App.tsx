import { useState, useEffect, useRef } from 'react';
import {
  initialPlantsData,
  initialGardensData,
  initialSpacesData,
  initialMembersData,
  formatPersianDate,
  type PlantEntity,
  type GardenEntity,
  type SpaceEntity,
  type MemberEntity
} from './data/initialPlants';
import { CareCalculator } from './engine/careCalculator';
import {
  IconLeafLogo,
  IconAddSprout,
  IconBell,
  IconSettings,
  IconWaterDrop,
  IconMistSpray,
  IconShieldLock,
  IconRotate90,
  PlantStylizedIllustration
} from './components/icons/CustomIcons';

import { PlantProfileSheet, type AccessRole } from './components/profile/PlantProfileSheet';
import {
  AddPlantModal,
  EditPlantModal,
  MemorialModal,
  QRCodeModal
} from './components/modals/LifecycleModals';
import { SettingsAndMembersModal } from './components/modals/SettingsAndMembersModal';
import {
  getCloudConfig,
  saveCloudConfig,
  fetchGreenhouseFromCloud,
  pushGreenhouseToCloud,
  sendInstantNotification,
  sendCareActionTelegramReport,
  sendScheduledEscalationReport,
  setupTelegramBotCommands,
  type CloudConfig,
  type CareActionType
} from './services/cloudSyncService';

const toPersianNum = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const PLANTS_STORAGE_KEY = 'sina_greenhouse_plants_v8';
const SPACES_STORAGE_KEY = 'sina_greenhouse_spaces_v8';
const GARDENS_STORAGE_KEY = 'sina_greenhouse_gardens_v8';
const MEMBERS_STORAGE_KEY = 'sina_greenhouse_members_v8';

export type ThirstySubFilterType =
  | 'all_due'
  | 'water_only'
  | 'mist_only'
  | 'rotate_only'
  | 'fert_repot';

export default function App() {
  const [spaces, setSpaces] = useState<SpaceEntity[]>(() => {
    const saved = localStorage.getItem(SPACES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialSpacesData;
  });

  const [plants, setPlants] = useState<PlantEntity[]>(() => {
    const saved = localStorage.getItem(PLANTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialPlantsData;
  });

  const [gardens, setGardens] = useState<GardenEntity[]>(() => {
    const saved = localStorage.getItem(GARDENS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialGardensData;
  });

  const [members, setMembers] = useState<MemberEntity[]>(() => {
    const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialMembersData;
  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlMemberId = urlParams.get('member');
  const urlSpaceId = urlParams.get('space');
  const urlMode = urlParams.get('mode');
  const [previewMemberId, setPreviewMemberId] = useState<string | null>(urlMemberId);
  const activeMemberFromUrl =
    members.find((m) => m.id === (previewMemberId || urlMemberId)) || null;

  const [activeSpaceId, setActiveSpaceId] = useState<string>(() => {
    if (urlSpaceId) return urlSpaceId;
    if (activeMemberFromUrl && activeMemberFromUrl.assignedSpaces.length > 0) {
      return activeMemberFromUrl.assignedSpaces[0];
    }
    return 'office';
  });

  const [userRole, setUserRole] = useState<AccessRole>(() => {
    if (urlMode === 'visitor') return 'visitor';
    if (activeMemberFromUrl) {
      return activeMemberFromUrl.role === 'caretaker' ? 'caretaker' : 'owner';
    }
    if (urlMode === 'guest') return 'caretaker';
    return 'owner';
  });

  const isSuperAdmin =
    !activeMemberFromUrl || activeMemberFromUrl.role === 'super_admin';

  const accessibleSpaces = isSuperAdmin
    ? spaces
    : activeMemberFromUrl
    ? spaces.filter((s) => activeMemberFromUrl.assignedSpaces.includes(s.id))
    : spaces;

  const currentSpace =
    accessibleSpaces.find((s) => s.id === activeSpaceId) ||
    accessibleSpaces[0] ||
    spaces[0];

  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(() => getCloudConfig());
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [activeGarden, setActiveGarden] = useState<string>('all');
  const [thirstySubFilter, setThirstySubFilter] = useState<ThirstySubFilterType>('all_due');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(() =>
    urlParams.get('plant')
  );

  const [confirmState, setConfirmState] = useState<{
    plant: PlantEntity;
    actionType: CareActionType;
  } | null>(null);

  const [selectedActor, setSelectedActor] = useState<string>(
    activeMemberFromUrl?.name || 'سینا'
  );
  const [actionNote, setActionNote] = useState<string>('');
  const [undoSnapshot, setUndoSnapshot] = useState<PlantEntity[] | null>(null);
  const [undoMessage, setUndoMessage] = useState<string | null>(null);

  const [guideTopic, setGuideTopic] = useState<'watering' | 'misting' | 'moisture' | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addPlantOpen, setAddPlantOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<PlantEntity | null>(null);
  const [memorialOpen, setMemorialOpen] = useState(false);
  const [qrPlant, setQrPlant] = useState<PlantEntity | null>(null);

  const isOwner = userRole === 'owner';
  const isVisitor = userRole === 'visitor';

  const isAnyModalOpen = Boolean(
    selectedPlantId ||
      confirmState ||
      guideTopic ||
      settingsOpen ||
      addPlantOpen ||
      editingPlant ||
      memorialOpen ||
      qrPlant
  );

  // ۱. قفل اسکرول صفحه پشت مدال‌ها
  useEffect(() => {
    document.body.style.overflow = isAnyModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // ۲. مدیریت هوشمند دکمه Back گوشی موبایل (بستن پروفایل گیاه و مدال‌ها به جای خروج از برنامه!)
  const hasModalHistoryRef = useRef<boolean>(false);
  const modalStateRef = useRef({
    selectedPlantId,
    confirmState,
    guideTopic,
    settingsOpen,
    addPlantOpen,
    editingPlant,
    memorialOpen,
    qrPlant
  });
  modalStateRef.current = {
    selectedPlantId,
    confirmState,
    guideTopic,
    settingsOpen,
    addPlantOpen,
    editingPlant,
    memorialOpen,
    qrPlant
  };

  useEffect(() => {
    if (isAnyModalOpen && !hasModalHistoryRef.current) {
      window.history.pushState({ greenhouseModal: true }, '');
      hasModalHistoryRef.current = true;
    } else if (!isAnyModalOpen && hasModalHistoryRef.current) {
      hasModalHistoryRef.current = false;
      if (window.history.state?.greenhouseModal) {
        window.history.back();
      }
    }
  }, [isAnyModalOpen]);

  useEffect(() => {
    const handlePopState = () => {
      const m = modalStateRef.current;
      // اگر پنجره فرعی روی شیت گیاه باز است، فقط همان پنجره فرعی را ببند و شیت گیاه را نگه دار
      if (m.confirmState) {
        setConfirmState(null);
        window.history.pushState({ greenhouseModal: true }, '');
        return;
      }
      if (m.guideTopic) {
        setGuideTopic(null);
        window.history.pushState({ greenhouseModal: true }, '');
        return;
      }
      if (m.editingPlant) {
        setEditingPlant(null);
        window.history.pushState({ greenhouseModal: true }, '');
        return;
      }
      if (m.qrPlant) {
        setQrPlant(null);
        window.history.pushState({ greenhouseModal: true }, '');
        return;
      }

      // بستن شیت اصلی گیاه یا مدال‌های صفحه اول با زدن دکمه Back گوشی
      hasModalHistoryRef.current = false;
      setSelectedPlantId(null);
      setSettingsOpen(false);
      setAddPlantOpen(false);
      setMemorialOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isCloudHydratedRef = useRef<boolean>(false);

  // همگام‌سازی خودکار نقش، فضا و نام اقدام‌کننده از روی لینک دعوت
  useEffect(() => {
    if (!urlMemberId) return;
    const foundMember = members.find((m) => m.id === urlMemberId);
    if (foundMember) {
      setSelectedActor(foundMember.name);
      if (urlMode !== 'visitor') {
        setUserRole(foundMember.role === 'caretaker' ? 'caretaker' : 'owner');
      }
      if (!urlSpaceId && foundMember.assignedSpaces.length > 0) {
        setActiveSpaceId(foundMember.assignedSpaces[0]);
      }
    }
  }, [members, urlMemberId, urlSpaceId, urlMode]);

  // دریافت اولیه از کلود + ثبت منوی دستورات تلگرام
  useEffect(() => {
    setupTelegramBotCommands();
    const isZeroStateReset = localStorage.getItem('sina_greenhouse_zero_state_v7') === 'true';
    fetchGreenhouseFromCloud()
      .then((remote) => {
        if (!remote) return;
        if (Array.isArray(remote.plants) && (remote.plants.length > 0 || isZeroStateReset)) {
          setPlants(remote.plants);
          if (Array.isArray(remote.gardens) && remote.gardens.length > 0) {
            setGardens(remote.gardens);
          }
          if (Array.isArray(remote.spaces) && remote.spaces.length > 0) {
            setSpaces(remote.spaces);
          }
          if (Array.isArray(remote.members) && remote.members.length > 0) {
            setMembers(remote.members);
          }
          setCloudSynced(true);
        }
      })
      .finally(() => {
        isCloudHydratedRef.current = true;
      });
  }, []);

  // ذخیره خودکار تغییرات در حافظه محلی و فضای ابری Supabase
  useEffect(() => {
    if (isVisitor) return;
    localStorage.setItem(PLANTS_STORAGE_KEY, JSON.stringify(plants));
    localStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(spaces));
    localStorage.setItem(GARDENS_STORAGE_KEY, JSON.stringify(gardens));
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));

    if (!isCloudHydratedRef.current) return;

    pushGreenhouseToCloud({ spaces, plants, gardens, members }).then((ok) => {
      if (ok) setCloudSynced(true);
    });
  }, [spaces, plants, gardens, members, isVisitor]);

  // تابع مرکزی اجرای عملیات روی گیاه (مشترک بین رابط کاربری اپ و دکمه‌های شیشه‌ای ربات تلگرام)
  const executePlantCareAction = (
    targetPlantId: string,
    actionType: CareActionType,
    actorName: string,
    noteText?: string,
    fromTelegramBot: boolean = false
  ) => {
    const targetPlant = plants.find((p) => p.id === targetPlantId);
    if (!targetPlant) return;

    setUndoSnapshot(JSON.parse(JSON.stringify(plants)));

    let logLabel = '';
    let updatedPlantSnapshot: PlantEntity = targetPlant;
    const nowTimeStr = new Date().toLocaleTimeString('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const todayPersian = formatPersianDate(0);

    setPlants((prev) =>
      prev.map((item) => {
        if (item.id !== targetPlantId) return item;
        const updated = { ...item };

        if (actionType === 'water') {
          logLabel = item.fertDue
            ? `آبیاری + کود (${toPersianNum(item.doseMl)} سی‌سی)`
            : `آبیاری (${toPersianNum(item.doseMl)} سی‌سی)`;
          updated.daysSinceWater = 0;
          updated.lastWateredAt = Date.now();
          updated.waterCount += 1;
          if (updated.waterCount % 2 === 0) {
            updated.needsRotation = true;
          }
          updated.fertDue = false;
          const isSucculent = CareCalculator.isSucculentSpecies(item.shape3D, item.name);
          updated.statusType = isSucculent ? 'locked' : 'ok';
        } else if (actionType === 'mist') {
          logLabel = 'غبارپاشی برگ‌ها';
          updated.needsMistToday = false;
          updated.daysSinceMist = 0;
          updated.lastMistedAt = Date.now();
          if (updated.statusType === 'mist') updated.statusType = 'ok';
        } else if (actionType === 'rotate') {
          logLabel = 'چرخش ۹۰ درجه گلدان (تنظیم نور)';
          updated.needsRotation = false;
          updated.lastRotatedDate = todayPersian;
        } else if (actionType === 'prune') {
          logLabel = '✂️ هرس و فرم‌دهی شاخ‌وبرگ';
          updated.lastPrunedDate = todayPersian;
        } else if (actionType === 'repot') {
          logLabel = '🪴 تعویض خاک و بررسی ریشه';
          updated.lastRepottedDate = todayPersian;
          updated.lastRepottedMonthsAgo = 0;
        } else if (actionType === 'clean_leaves') {
          logLabel = '✨ غبارروبی و پاکسازی برگ‌ها';
        } else if (actionType === 'snooze') {
          logLabel = 'خاک مرطوب است (تعویق ۲ روزه)';
          const currentElapsed = CareCalculator.getElapsedDaysSinceWater(item);
          updated.daysSinceWater = Math.max(0, currentElapsed - 2);
          updated.lastWateredAt = Date.now() - updated.daysSinceWater * 86400000;
          updated.statusType = 'ok';
        }

        updated.history = [
          {
            id: 'log_' + Date.now(),
            action: logLabel,
            by: fromTelegramBot ? `${actorName} (تلگرام)` : actorName,
            time: `امروز • ساعت ${nowTimeStr}`,
            persianDate: todayPersian,
            note: noteText?.trim() || undefined
          },
          ...item.history
        ];

        updatedPlantSnapshot = updated;
        return updated;
      })
    );

    const plantSpace =
      spaces.find((s) => s.id === (targetPlant.spaceId || 'office')) || currentSpace;
    const gName =
      gardens.find((g) => g.id === targetPlant.garden)?.name || 'باغچه اصلی';

    sendCareActionTelegramReport({
      space: plantSpace,
      plant: updatedPlantSnapshot,
      gardenName: gName,
      actionType,
      actor: actorName,
      note: noteText?.trim() || undefined,
      members
    });

    setUndoMessage(
      `${logLabel} برای «${targetPlant.name}» توسط ${actorName} ثبت شد.`
    );
  };

  // نگهداری آخرین رفرنس استیت‌ها برای حلقه پایش سریع ربات تلگرام
  const latestStateRef = useRef({
    spaces,
    plants,
    gardens,
    members,
    executePlantCareAction
  });
  latestStateRef.current = {
    spaces,
    plants,
    gardens,
    members,
    executePlantCareAction
  };

  // ۳. حلقه فوق‌سریع ربات تلگرام (اجرای فوری در لحظه باز شدن + هر ۲.۵ ثانیه + هنگام بازگشت به صفحه)
  // ۳. همگام‌سازی زنده و خودکار با دیتابیس ابری (دریافت آنی تغییرات ثبت‌شده در ربات تلگرام و سایر گوشی‌ها)
  useEffect(() => {
    if (isVisitor) return;

    const syncFromCloud = () => {
      if (!isCloudHydratedRef.current) return;
      fetchGreenhouseFromCloud().then((remote) => {
        if (!remote) return;

        if (Array.isArray(remote.plants)) {
          setPlants((prev) =>
            JSON.stringify(prev) === JSON.stringify(remote.plants) ? prev : remote.plants
          );
        }
        if (Array.isArray(remote.spaces) && remote.spaces.length > 0) {
          const nextSpaces = remote.spaces;
          setSpaces((prev) =>
            JSON.stringify(prev) === JSON.stringify(nextSpaces) ? prev : nextSpaces
          );
        }
        if (Array.isArray(remote.gardens) && remote.gardens.length > 0) {
          const nextGardens = remote.gardens;
          setGardens((prev) =>
            JSON.stringify(prev) === JSON.stringify(nextGardens) ? prev : nextGardens
          );
        }
        if (Array.isArray(remote.members) && remote.members.length > 0) {
          const nextMembers = remote.members;
          setMembers((prev) =>
            JSON.stringify(prev) === JSON.stringify(nextMembers) ? prev : nextMembers
          );
        }
        setCloudSynced(true);
      });
    };

    const pollTimer = setInterval(syncFromCloud, 4000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncFromCloud();
      }
    };

    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      clearInterval(pollTimer);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, [isVisitor]);

  // پایشگر خودکار ساعت ۰۸:۳۰ صبح و ۱۲:۳۰ ظهر
  useEffect(() => {
    if (isVisitor) return;

    const checkScheduleAndNotify = () => {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      spaces.forEach((sp) => {
        const morningKey = `sina_morning_${sp.id}_${dayKey}`;
        if (
          currentMinutes >= 8 * 60 + 30 &&
          currentMinutes < 12 * 60 + 30 &&
          !localStorage.getItem(morningKey)
        ) {
          localStorage.setItem(morningKey, 'sent');
          sendScheduledEscalationReport({
            space: sp,
            plants,
            gardens,
            members,
            level: 'morning'
          });
        }

        const noonKey = `sina_noon_${sp.id}_${dayKey}`;
        if (
          currentMinutes >= 12 * 60 + 30 &&
          currentMinutes < 17 * 60 &&
          !localStorage.getItem(noonKey)
        ) {
          sendScheduledEscalationReport({
            space: sp,
            plants,
            gardens,
            members,
            level: 'noon_escalation'
          });
          localStorage.setItem(noonKey, 'sent');
        }
      });
    };

    checkScheduleAndNotify();
    const timer = setInterval(checkScheduleAndNotify, 60000);
    return () => clearInterval(timer);
  }, [spaces, plants, gardens, members, isVisitor]);

  const allowedGardenIds =
    activeMemberFromUrl?.assignedGardens && activeMemberFromUrl.assignedGardens.length > 0
      ? activeMemberFromUrl.assignedGardens
      : null;

  const spaceGardens = gardens.filter(
    (g) =>
      (g.spaceId || 'office') === currentSpace.id &&
      (!allowedGardenIds || allowedGardenIds.includes(g.id))
  );
  const spaceActivePlants = plants.filter(
    (p) =>
      !p.archived &&
      (p.spaceId || 'office') === currentSpace.id &&
      (!allowedGardenIds || allowedGardenIds.includes(p.garden))
  );
  const spaceArchivedPlants = plants.filter(
    (p) => p.archived && (p.spaceId || 'office') === currentSpace.id
  );
  const spaceMembers = members.filter(
    (m) => m.active && (m.role === 'super_admin' || m.assignedSpaces.includes(currentSpace.id))
  );

  const selectedPlant = plants.find((p) => p.id === selectedPlantId && !p.archived) || null;

  const getGardenName = (gardenId: string) =>
    gardens.find((g) => g.id === gardenId)?.name || spaceGardens[0]?.name || 'باغچه اصلی';

  const evaluatedPlants = spaceActivePlants.map((plant) => {
    const gObj = gardens.find((g) => g.id === plant.garden);
    return {
      plant,
      metrics: CareCalculator.evaluatePlant(plant, currentSpace.radiatorOn, new Date(), gObj)
    };
  });

  // شمارنده‌های تفکیک‌شده
  const thirstyCount = evaluatedPlants.filter(({ metrics }) => metrics.needsWateringNow).length;
  const mistCount = evaluatedPlants.filter(({ metrics }) => metrics.needsMistingNow).length;
  const rotateCount = evaluatedPlants.filter(({ metrics }) => metrics.needsQuarterTurn).length;
  const fertOrRepotCount = evaluatedPlants.filter(
    ({ metrics }) => metrics.needsFertilizerNow || metrics.needsRepottingSoon
  ).length;
  const totalAttentionPlantsCount = evaluatedPlants.filter(
    ({ metrics }) =>
      metrics.needsWateringNow ||
      metrics.needsMistingNow ||
      metrics.needsQuarterTurn ||
      metrics.needsRepottingSoon
  ).length;
  const weekendShiftCount = evaluatedPlants.filter(
    ({ metrics }) => metrics.isWeekendShifted
  ).length;

  // محاسبه مهندسی‌شده اقلیم، فصل خورشیدی، دمای محیط و شاخص رطوبت خاک
  const persianMonthNum = Number(
    new Intl.DateTimeFormat('fa-IR-u-ca-persian', { month: 'numeric' })
      .format(new Date())
      .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
  ) || 7;

  const seasonInfo =
    persianMonthNum <= 3
      ? { name: 'بهار', baseTemp: 22, seasonMoistureMod: 0, evapBase: 'ملایم' }
      : persianMonthNum <= 6
      ? { name: 'تابستان', baseTemp: 26, seasonMoistureMod: -5, evapBase: 'متوسط' }
      : persianMonthNum <= 9
      ? { name: 'پاییز', baseTemp: 21, seasonMoistureMod: -2, evapBase: 'متعادل' }
      : { name: 'زمستان', baseTemp: 19, seasonMoistureMod: -3, evapBase: 'کم' };

  const activeGardenObj =
    activeGarden !== 'all' && activeGarden !== 'thirsty'
      ? spaceGardens.find((g) => g.id === activeGarden) || null
      : null;

  const plantsForClimate =
    activeGardenObj
      ? evaluatedPlants.filter(({ plant }) => plant.garden === activeGardenObj.id)
      : evaluatedPlants;

  const rawSoilMoistureAvg =
    plantsForClimate.length > 0
      ? Math.round(
          plantsForClimate.reduce((acc, item) => acc + item.metrics.moisturePercent, 0) /
            plantsForClimate.length
        )
      : 100;

  const lightMoistureMod =
    activeGardenObj?.lightLevel === 'high'
      ? -4
      : activeGardenObj?.lightLevel === 'low'
      ? 3
      : 0;

  const lightTempMod =
    activeGardenObj?.lightLevel === 'high'
      ? 2
      : activeGardenObj?.lightLevel === 'low'
      ? -1
      : 0;

  const radiatorMoisturePenalty = currentSpace.radiatorOn ? -12 : 0;
  const radiatorTempBoost = currentSpace.radiatorOn ? 4 : 0;

  const averageMoisturePercent =
    plantsForClimate.length > 0
      ? Math.max(
          8,
          Math.min(
            100,
            rawSoilMoistureAvg +
              seasonInfo.seasonMoistureMod +
              lightMoistureMod +
              radiatorMoisturePenalty
          )
        )
      : 100;

  const estimatedRoomTemp = seasonInfo.baseTemp + lightTempMod + radiatorTempBoost;

  const climateRightStatus = currentSpace.radiatorOn
    ? 'هوای گرم و خشک'
    : activeGardenObj?.lightLevel === 'high'
    ? 'نور زیاد محیط'
    : activeGardenObj?.lightLevel === 'low'
    ? 'سایه و آرامش'
    : 'دمای متعادل';

  const climateLeftEvap = currentSpace.radiatorOn
    ? 'تبخیر بالا'
    : activeGardenObj?.lightLevel === 'high'
    ? 'تبخیر متوسط'
    : activeGardenObj?.lightLevel === 'low'
    ? 'تبخیر کم'
    : `تبخیر ${seasonInfo.evapBase}`;

  const filteredEvaluated = evaluatedPlants.filter(({ plant, metrics }) => {
    if (
      searchQuery.trim() &&
      !plant.name.includes(searchQuery.trim()) &&
      !plant.sci.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }
    if (activeGarden === 'all') return true;
    if (activeGarden === 'thirsty') {
      if (thirstySubFilter === 'water_only') return metrics.needsWateringNow;
      if (thirstySubFilter === 'mist_only') return metrics.needsMistingNow;
      if (thirstySubFilter === 'rotate_only') return metrics.needsQuarterTurn;
      if (thirstySubFilter === 'fert_repot') {
        return metrics.needsFertilizerNow || metrics.needsRepottingSoon;
      }
      return (
        metrics.needsWateringNow ||
        metrics.needsMistingNow ||
        metrics.needsQuarterTurn ||
        metrics.needsRepottingSoon
      );
    }
    return plant.garden === activeGarden;
  });

  const toggleSpaceRadiator = () => {
    setSpaces((prev) =>
      prev.map((sp) =>
        sp.id === currentSpace.id ? { ...sp, radiatorOn: !sp.radiatorOn } : sp
      )
    );
  };

  const handleConfirmExecute = () => {
    if (!confirmState || isVisitor) return;
    const { plant, actionType } = confirmState;
    executePlantCareAction(plant.id, actionType, selectedActor, actionNote, false);
    setConfirmState(null);
    setActionNote('');
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    setPlants(undoSnapshot);
    setUndoSnapshot(null);
    setUndoMessage(null);
    sendInstantNotification(
      '↩️ واگرد (لغو) عملیات',
      `آخرین عملیات ثبت‌شده توسط «${selectedActor}» در «${currentSpace.name}» لغو شد.`
    );
  };

  const handleSwitchGarden = (plantId: string) => {
    if (!isOwner || spaceGardens.length < 2) return;
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId) return p;
        const idx = spaceGardens.findIndex((g) => g.id === p.garden);
        const nextGarden = spaceGardens[(idx + 1) % spaceGardens.length];
        return { ...p, garden: nextGarden.id };
      })
    );
  };

  const handleHardDeletePlant = (plantId: string, plantName: string) => {
    if (!isOwner) return;
    const confirmed = window.confirm(
      `⚠️ آیا از حذف دائمی و کامل «${plantName}» از گلخانه مطمئن هستید؟`
    );
    if (!confirmed) return;

    setUndoSnapshot(JSON.parse(JSON.stringify(plants)));
    setPlants((prev) => prev.filter((p) => p.id !== plantId));
    setSelectedPlantId(null);
    setUndoMessage(`گلدان «${plantName}» به طور دائمی حذف شد.`);
  };

  const handleDeleteGarden = (gardenId: string) => {
    if (!isOwner) return;
    if (spaceGardens.length <= 1) {
      alert('⚠️ هر گلخانه باید حداقل یک باغچه فعال داشته باشد.');
      return;
    }

    const gardenObj = gardens.find((g) => g.id === gardenId);
    const fallbackGarden = spaceGardens.find((g) => g.id !== gardenId)!;
    const affectedCount = plants.filter((p) => p.garden === gardenId).length;

    const ok = window.confirm(
      affectedCount > 0
        ? `آیا از حذف «${gardenObj?.name}» مطمئن هستید؟ (${toPersianNum(
            affectedCount
          )} گلدان موجود در آن به صورت خودکار به «${fallbackGarden.name}» منتقل می‌شوند)`
        : `آیا از حذف باغچه «${gardenObj?.name}» مطمئن هستید؟`
    );
    if (!ok) return;

    setPlants((prev) =>
      prev.map((p) => (p.garden === gardenId ? { ...p, garden: fallbackGarden.id } : p))
    );
    setGardens((prev) => prev.filter((g) => g.id !== gardenId));
    if (activeGarden === gardenId) setActiveGarden('all');
  };

  const handleDeleteSpace = (spaceId: string) => {
    if (!isSuperAdmin || spaces.length <= 1) return;
    const sp = spaces.find((s) => s.id === spaceId);
    const ok = window.confirm(
      `⚠️ آیا از حذف کامل «${sp?.name}» و باغچه‌های داخل آن مطمئن هستید؟`
    );
    if (!ok) return;

    const remainingSpaces = spaces.filter((s) => s.id !== spaceId);
    setSpaces(remainingSpaces);
    setGardens((prev) => prev.filter((g) => g.spaceId !== spaceId));
    setPlants((prev) => prev.filter((p) => p.spaceId !== spaceId));
    if (activeSpaceId === spaceId) {
      setActiveSpaceId(remainingSpaces[0].id);
    }
  };

  const handleAddCutting = (
    plantId: string,
    medium: 'در آب' | 'در پرلیت و پیت‌ماس' | 'تقسیم ریشه/پاجوش',
    note: string
  ) => {
    const todayPersian = formatPersianDate(0);
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId) return p;
        const newCut = {
          id: 'cut_' + Date.now(),
          medium,
          startDate: todayPersian,
          note: note || undefined
        };
        return {
          ...p,
          cuttings: [newCut, ...(p.cuttings || [])],
          history: [
            {
              id: 'log_' + Date.now(),
              action: `🌱 ثبت قلمه جدید (${medium})`,
              by: activeMemberFromUrl?.name || 'سینا',
              time: 'هم‌اکنون',
              persianDate: todayPersian,
              note: note || undefined
            },
            ...p.history
          ]
        };
      })
    );
  };

  const handlePromoteCuttingToPlant = (motherPlant: PlantEntity, cuttingId: string) => {
    const nextIdx = spaceActivePlants.length + 1;
    const newCode = `#${toPersianNum(String(nextIdx).padStart(2, '0'))}`;
    const todayPersian = formatPersianDate(0);

    const newChildPlant: PlantEntity = {
      ...motherPlant,
      id: 'p_child_' + Date.now(),
      code: newCode,
      name: `${motherPlant.name} (قلمه کاشته‌شده)`,
      daysSinceWater: 0,
      lastWateredAt: Date.now(),
      waterCount: 1,
      needsRotation: false,
      statusType: 'ok',
      lastRepottedDate: todayPersian,
      lastRepottedMonthsAgo: 0,
      cuttings: [],
      history: [
        {
          id: 'h_' + Date.now(),
          action: `🪴 انتقال قلمه ریشه‌دار از گیاه مادر (${motherPlant.code}) به گلدان مستقل`,
          by: activeMemberFromUrl?.name || 'سینا',
          time: 'هم‌اکنون',
          persianDate: todayPersian
        }
      ]
    };

    setPlants((prev) => [
      ...prev.map((p) =>
        p.id === motherPlant.id
          ? { ...p, cuttings: (p.cuttings || []).filter((c) => c.id !== cuttingId) }
          : p
      ),
      newChildPlant
    ]);

    sendInstantNotification(
      `🎉 تولد گلدان جدید در ${currentSpace.name}`,
      `قلمه ریشه‌دار «${motherPlant.name}» به گلدان مستقل (${newCode}) منتقل شد.`
    );
    alert(`🌱 تبریک! قلمه ریشه‌دار به عنوان گلدان جدید (${newCode}) به «${currentSpace.name}» اضافه شد.`);
  };

  const handleRemoveCutting = (plantId: string, cuttingId: string) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === plantId
          ? { ...p, cuttings: (p.cuttings || []).filter((c) => c.id !== cuttingId) }
          : p
      )
    );
  };

  const handleArchivePlant = (plant: PlantEntity) => {
    if (!isOwner) return;
    const reason = window.prompt(
      `علت انتقال «${plant.name}» به تالار یادبود را بنویسید:`,
      'انتقال یا تغییر وضعیت'
    );
    if (reason === null) return;

    setPlants((prev) =>
      prev.map((p) =>
        p.id === plant.id
          ? {
              ...p,
              archived: true,
              archiveReason: reason || 'آرشیو شده',
              archiveDate: formatPersianDate(0)
            }
          : p
      )
    );
    setSelectedPlantId(null);
  };

  const handleRestorePlant = (plantId: string) => {
    if (!isOwner) return;
    setPlants((prev) =>
      prev.map((p) => (p.id === plantId ? { ...p, archived: false } : p))
    );
  };

  const handleDeleteHistory = (plantId: string, logId: string) => {
    if (!isOwner) return;
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id !== plantId) return p;
        return {
          ...p,
          daysSinceWater: p.waterCycleDays,
          statusType: 'thirsty',
          history: p.history.filter((h) => h.id !== logId)
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F6F3EC] text-[#1C2822] pb-24 select-none">
      {/* هدر کالیبره‌شده برای عرض 360px موبایل */}
      <header className="sticky top-0 z-30 bg-[#F6F3EC]/95 backdrop-blur-md border-b border-[#E8E2D5] px-3 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 flex items-center justify-center shrink-0 warm-shadow">
              <IconLeafLogo className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-[16px] font-extrabold text-[#1C2822] leading-none whitespace-nowrap">
                  {currentSpace.name}
                </h1>
                <span
                  title={cloudSynced ? 'متصل به فضای ابری' : 'ذخیره در حافظه دستگاه'}
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    cloudSynced ? 'bg-emerald-600' : 'bg-[#2B7A9B]'
                  }`}
                />
              </div>
              <p className="text-[10px] font-medium text-[#5A655E] whitespace-nowrap mt-1 leading-none">
                {isVisitor
                  ? 'نمای نمایشگاهی و شناسنامه گیاهان'
                  : activeMemberFromUrl
                  ? `ورود به عنوان: ${activeMemberFromUrl.name}`
                  : 'پایش هوشمند آبیاری و سلامت گیاهان'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isOwner && !urlMode && (
              <button
                onClick={() => {
                  const ownerMember = members.find((m) => m.role === 'super_admin');
                  if (ownerMember?.pinCode) {
                    const entered = window.prompt('🔒 پین‌کد ۴ رقمی مالک ارشد را وارد کنید:');
                    if (entered !== ownerMember.pinCode) {
                      alert('❌ پین‌کد واردشده صحیح نیست.');
                      return;
                    }
                  }
                  setPreviewMemberId(null);
                  setUserRole('owner');
                }}
                className="px-2 h-[36px] rounded-xl bg-[#3A5A40] text-white text-[10px] font-bold whitespace-nowrap"
              >
                بازگشت به مدیریت
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setAddPlantOpen(true)}
                title="افزودن گیاه جدید به گلخانه"
                className="font-heading pl-2.5 pr-1.5 h-[36px] rounded-xl bg-gradient-to-b from-[#2E5A44] to-[#234735] text-[#FDFBF7] text-[11px] font-bold flex items-center justify-center gap-1.5 border border-[#1C2822]/15 warm-shadow whitespace-nowrap active:scale-95 transition-all"
              >
                <span className="w-[22px] h-[22px] rounded-lg bg-[#FDFBF7]/15 border border-[#FDFBF7]/20 flex items-center justify-center shrink-0">
                  <IconAddSprout className="w-3.5 h-3.5 text-[#FDFBF7]" />
                </span>
                <span>گیاه</span>
              </button>
            )}

            {!isVisitor && (
              <button
                onClick={() => {
                  setActiveGarden(activeGarden === 'thirsty' ? 'all' : 'thirsty');
                  setThirstySubFilter('all_due');
                }}
                title="مشاهده تفکیک‌شده گیاهان نیازمند آبیاری، غبارپاشی و چرخش"
                className={`relative w-[36px] h-[36px] rounded-xl border flex items-center justify-center warm-shadow shrink-0 transition-all active:scale-95 ${
                  activeGarden === 'thirsty'
                    ? 'bg-[#1C2822] text-[#FDFBF7] border-[#1C2822] ring-2 ring-[#2E5A44]/25'
                    : 'bg-[#FDFBF7] text-[#2E5A44] border-[#E8E2D5] hover:border-[#2E5A44]/40'
                }`}
              >
                <IconBell className="w-[17px] h-[17px]" />
                <span
                  className={`persian-num absolute -top-1 -left-1 min-w-[17px] h-[17px] px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center border border-[#FDFBF7] transition-colors ${
                    activeGarden === 'thirsty'
                      ? 'bg-[#2E5A44] text-white'
                      : totalAttentionPlantsCount > 0
                      ? 'bg-[#2B7A9B] text-white'
                      : 'bg-[#E6F0EB] text-[#2E5A44]'
                  }`}
                >
                  {toPersianNum(totalAttentionPlantsCount)}
                </span>
              </button>
            )}

            {isOwner && (
              <button
                onClick={() => setSettingsOpen(true)}
                title="مرکز مدیریت گلخانه‌ها و اعضا"
                className="w-[36px] h-[36px] rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center text-[#1C2822] warm-shadow shrink-0 active:scale-95 transition-transform"
              >
                <IconSettings className="w-[17px] h-[17px]" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-3 pt-3 space-y-3">
        {/* نوار سوییچ بین گلخانه محل کار و گلخانه خانه */}
        {accessibleSpaces.length > 1 && (
          <section className="grid grid-cols-2 gap-1.5 bg-[#FDFBF7] p-1 rounded-2xl border border-[#E8E2D5] warm-shadow">
            {accessibleSpaces.map((sp) => {
              const active = sp.id === currentSpace.id;
              const spCount = plants.filter(
                (p) => !p.archived && (p.spaceId || 'office') === sp.id
              ).length;
              return (
                <button
                  key={sp.id}
                  onClick={() => {
                    setActiveSpaceId(sp.id);
                    setActiveGarden('all');
                  }}
                  className={`py-2 px-2.5 rounded-xl text-[12px] transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'font-heading font-bold bg-[#2E5A44] text-white warm-shadow'
                      : 'font-semibold text-[#5A655E]'
                  }`}
                >
                  <span>{sp.icon}</span>
                  <span>{sp.name}</span>
                  <span
                    className={`persian-num px-1.5 py-0.2 rounded-md text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-[#F6F3EC] text-[#5A655E]'
                    }`}
                  >
                    {toPersianNum(spCount)}
                  </span>
                </button>
              );
            })}
          </section>
        )}

        {/* کارت‌های وضعیت Bento (کالیبره‌شده برای Galaxy A54 بدون حتی یک سه‌نقطه) */}
        <section className="grid grid-cols-2 gap-2 items-stretch">
          {/* کارت ۱: مرکز رسیدگی */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-2 warm-shadow flex flex-col justify-between min-h-[110px]">
            {/* ردیف ۱ هدر (ارتفاع ۲۲ پیکسل) */}
            <div className="h-[22px] flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A44] shrink-0" />
                <span className="font-heading text-[10.5px] font-extrabold text-[#1C2822] whitespace-nowrap">
                  {isVisitor ? 'جمعیت گلخانه' : 'مرکز رسیدگی'}
                </span>
              </div>

              {!isVisitor && (
                activeGarden === 'thirsty' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveGarden('all');
                      setThirstySubFilter('all_due');
                    }}
                    className="h-[18px] px-1.5 rounded-md bg-[#1C2822] text-[#FDFBF7] text-[8px] font-bold flex items-center gap-0.5 shrink-0 whitespace-nowrap active:scale-95 transition-transform"
                  >
                    <span>همه</span>
                    <span>✕</span>
                  </button>
                ) : (
                  <span
                    className={`persian-num h-[18px] px-1.5 rounded-md text-[8px] font-bold flex items-center shrink-0 whitespace-nowrap border ${
                      totalAttentionPlantsCount > 0
                        ? 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/25'
                        : 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/20'
                    }`}
                  >
                    {totalAttentionPlantsCount > 0
                      ? `${toPersianNum(totalAttentionPlantsCount)} در نوبت`
                      : 'طراوت کامل'}
                  </span>
                )
              )}
            </div>

            {isVisitor ? (
              <div className="my-1.5 h-[46px] bg-[#F6F3EC]/80 border border-[#E8E2D5] rounded-xl px-2 flex flex-col justify-center">
                <div className="persian-num text-[11px] font-extrabold text-[#1C2822] whitespace-nowrap">
                  {toPersianNum(spaceActivePlants.length)} گونه گیاه طبیعی
                </div>
                <p className="text-[8.5px] text-[#2E5A44] font-semibold mt-0.5 whitespace-nowrap">
                  🌿 مشاهده شناسنامه گیاه
                </p>
              </div>
            ) : (
              /* ردیف ۲: سه کاشی عملیاتی (آبیاری، غبارپاشی، چرخش با پالت زیتونی-بوتانیکال) */
              <div className="grid grid-cols-3 gap-1 my-1.5 h-[46px]">
                {/* ۱. آبیاری (آبی معدنی) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeGarden === 'thirsty' && thirstySubFilter === 'water_only') {
                      setActiveGarden('all');
                    } else {
                      setActiveGarden('thirsty');
                      setThirstySubFilter('water_only');
                    }
                  }}
                  className={`h-full px-0.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                    activeGarden === 'thirsty' && thirstySubFilter === 'water_only'
                      ? 'bg-[#1F6380] text-[#FDFBF7] border-[#1F6380] shadow-xs'
                      : 'bg-[#EBF4F8]/90 text-[#1F6380] border-[#2B7A9B]/25'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5 leading-none">
                    <IconWaterDrop className="w-3 h-3 shrink-0" />
                    <span className="persian-num text-[10.5px] font-extrabold">
                      {toPersianNum(thirstyCount)}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold mt-1.5 leading-none whitespace-nowrap">
                    آبیاری
                  </div>
                </button>

                {/* ۲. غبارپاشی (سبز مریم‌گلی) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeGarden === 'thirsty' && thirstySubFilter === 'mist_only') {
                      setActiveGarden('all');
                    } else {
                      setActiveGarden('thirsty');
                      setThirstySubFilter('mist_only');
                    }
                  }}
                  className={`h-full px-0.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                    activeGarden === 'thirsty' && thirstySubFilter === 'mist_only'
                      ? 'bg-[#2E5A44] text-[#FDFBF7] border-[#2E5A44] shadow-xs'
                      : 'bg-[#E8F3EE]/95 text-[#26634C] border-[#2E5A44]/25'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5 leading-none">
                    <IconMistSpray className="w-3 h-3 shrink-0" />
                    <span className="persian-num text-[10.5px] font-extrabold">
                      {toPersianNum(mistCount)}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold mt-1.5 leading-none whitespace-nowrap">
                    غبارپاشی
                  </div>
                </button>

                {/* ۳. چرخش (سبز زیتونی و خزه‌ای لوکس - بدون تناژ قرمز/نارنجی) */}
                <button
                  type="button"
                  onClick={() => {
                    if (activeGarden === 'thirsty' && thirstySubFilter === 'rotate_only') {
                      setActiveGarden('all');
                    } else {
                      setActiveGarden('thirsty');
                      setThirstySubFilter('rotate_only');
                    }
                  }}
                  className={`h-full px-0.5 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                    activeGarden === 'thirsty' && thirstySubFilter === 'rotate_only'
                      ? 'bg-[#3A5A40] text-[#FDFBF7] border-[#3A5A40] shadow-xs'
                      : 'bg-[#EEF3EC] text-[#3A5A40] border-[#3A5A40]/25'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5 leading-none">
                    <IconRotate90 className="w-3 h-3 shrink-0" />
                    <span className="persian-num text-[10.5px] font-extrabold">
                      {toPersianNum(rotateCount)}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold mt-1.5 leading-none whitespace-nowrap">
                    چرخش
                  </div>
                </button>
              </div>
            )}

            {/* ردیف ۳ فوتر مرکز رسیدگی (بدون سه‌نقطه در تمام حالت‌ها) */}
            <div className="h-[23px] px-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5]/90 flex items-center justify-between gap-1 text-[8px] font-bold whitespace-nowrap">
              {activeGarden === 'thirsty' ? (
                <>
                  <span className="text-[#1C2822]">
                    {thirstySubFilter === 'water_only'
                      ? 'فیلتر: آبیاری'
                      : thirstySubFilter === 'mist_only'
                      ? 'فیلتر: غبارپاشی'
                      : thirstySubFilter === 'rotate_only'
                      ? 'فیلتر: چرخش'
                      : thirstySubFilter === 'fert_repot'
                      ? 'فیلتر: کود و خاک'
                      : 'فیلتر: نوبت رسیدگی'}
                  </span>
                  <span className="text-[#2E5A44]">فعال ✓</span>
                </>
              ) : weekendShiftCount > 0 ? (
                <>
                  <span className="persian-num text-[#1F6380]">
                    ⚡ {toPersianNum(weekendShiftCount)} نوبت تعطیلات
                  </span>
                  <span className="text-[#2E5A44]">تفکیک سریع</span>
                </>
              ) : totalAttentionPlantsCount === 0 ? (
                <>
                  <span className="text-[#2E5A44]">✓ همه سیراب و شاداب</span>
                  <span className="text-[#5A655E]">تفکیک سریع</span>
                </>
              ) : (
                <>
                  <span className="persian-num text-[#5A655E]">
                    سیراب:{' '}
                    <strong className="text-[#2E5A44]">
                      {toPersianNum(Math.max(0, spaceActivePlants.length - thirstyCount))}
                    </strong>{' '}
                    از {toPersianNum(spaceActivePlants.length)}
                  </span>
                  <span className="text-[#2E5A44]">تفکیک سریع</span>
                </>
              )}
            </div>
          </div>

          {/* کارت ۲: اقلیم گلخانه (کاملاً قرینه و بدون حتی یک سه‌نقطه) */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-2 warm-shadow flex flex-col justify-between min-h-[110px]">
            {/* ردیف ۱ هدر (عنوان کامل اقلیم گلخانه + درصد رطوبت) */}
            <div className="h-[22px] flex items-center justify-between gap-1">
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    currentSpace.radiatorOn ? 'bg-[#B47B26] animate-pulse' : 'bg-[#2B7A9B]'
                  }`}
                />
                <span className="font-heading text-[10.5px] font-extrabold text-[#1C2822] whitespace-nowrap">
                  اقلیم گلخانه
                </span>
              </div>

              <span
                title="میانگین وزنی رطوبت خاک گلدان‌ها با احتساب فصل، نور باغچه و وضعیت شوفاژ"
                className={`persian-num h-[18px] px-1.5 rounded-md text-[8px] font-extrabold flex items-center gap-0.5 shrink-0 whitespace-nowrap border ${
                  averageMoisturePercent < 40
                    ? 'bg-[#FDF5E6] text-[#9E681C] border-[#B47B26]/30'
                    : 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/25'
                }`}
              >
                <IconWaterDrop className="w-2.5 h-2.5 shrink-0" />
                <span>رطوبت: {toPersianNum(averageMoisturePercent)}٪</span>
              </span>
            </div>

            {/* ردیف ۲: دو کاشی متقارن (کاشی شوفاژ + کاشی فصل و دما به فارسی روان) */}
            {!isVisitor ? (
              <div className="grid grid-cols-2 gap-1.5 my-1.5 h-[46px]">
                {/* کاشی ۱: شوفاژ */}
                <button
                  type="button"
                  onClick={toggleSpaceRadiator}
                  className={`h-full px-1 rounded-xl border transition-all flex flex-col items-center justify-center active:scale-95 ${
                    currentSpace.radiatorOn
                      ? 'bg-[#FDF5E6] text-[#9E681C] border-[#B47B26]/40 shadow-xs'
                      : 'bg-[#E8F3EE]/95 text-[#26634C] border-[#2E5A44]/25'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 leading-none">
                    {currentSpace.radiatorOn ? (
                      <svg
                        className="w-3 h-3 text-[#B47B26] animate-pulse shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4Z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-3 h-3 text-[#2E5A44] shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                      </svg>
                    )}
                    <span className="text-[9.5px] font-extrabold whitespace-nowrap">
                      {currentSpace.radiatorOn ? 'روشن' : 'خاموش'}
                    </span>
                  </div>
                  <div className="text-[8px] font-bold mt-1.5 leading-none whitespace-nowrap">
                    گرمایش شوفاژ
                  </div>
                </button>

                {/* کاشی ۲: فصل و دمای محیط با نگارش ۱۰۰٪ فارسی */}
                <div className="h-full px-1 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-0.5 text-[9.5px] font-extrabold text-[#1C2822] leading-none whitespace-nowrap">
                    <svg
                      className="w-3 h-3 text-[#3A5A40] shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                    </svg>
                    <span>فصل {seasonInfo.name}</span>
                  </div>
                  <div className="persian-num text-[8px] font-bold text-[#5A655E] mt-1.5 leading-none whitespace-nowrap">
                    دما: {toPersianNum(estimatedRoomTemp)} درجه
                  </div>
                </div>
              </div>
            ) : (
              <div className="my-1.5 h-[46px] bg-[#F6F3EC]/80 border border-[#E8E2D5] rounded-xl px-2 flex flex-col justify-center">
                <div className="flex items-center justify-between text-[8.5px] font-bold text-[#1C2822] mb-1.5 whitespace-nowrap">
                  <span>فصل {seasonInfo.name}</span>
                  <span className="persian-num">دما: {toPersianNum(estimatedRoomTemp)} درجه</span>
                </div>
                <div className="w-full h-1.5 bg-[#FDFBF7] rounded-full overflow-hidden border border-[#E8E2D5]">
                  <div
                    className="h-full bg-gradient-to-l from-[#2E5A44] to-[#2B7A9B] rounded-full transition-all duration-500"
                    style={{ width: `${averageMoisturePercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* ردیف ۳ فوتر اقلیم گلخانه (قرینه با کارت اول و بدون سه‌نقطه) */}
            <div
              className={`h-[23px] px-1.5 rounded-lg border flex items-center justify-between gap-1 text-[8px] font-bold whitespace-nowrap transition-colors ${
                currentSpace.radiatorOn
                  ? 'bg-[#FDF5E6] border-[#B47B26]/30 text-[#9E681C]'
                  : 'bg-[#F6F3EC] border-[#E8E2D5]/90 text-[#5A655E]'
              }`}
            >
              <span className={currentSpace.radiatorOn ? 'text-[#9E681C]' : 'text-[#1C2822]'}>
                {climateRightStatus}
              </span>
              <span className={currentSpace.radiatorOn ? 'text-[#9E681C]' : 'text-[#2E5A44]'}>
                {climateLeftEvap}
              </span>
            </div>
          </div>
        </section>

        {/* نوار جستجوی سریع گیاهان */}
        {spaceActivePlants.length > 4 && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`🔍 جستجوی سریع در میان ${toPersianNum(
                spaceActivePlants.length
              )} گیاه «${currentSpace.name}»...`}
              className="w-full px-3.5 py-2 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D5] text-[12px] warm-shadow focus:outline-none focus:border-[#2E5A44]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-2 text-[#5A655E] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* فیلتر کپسولی باغچه‌ها */}
        <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveGarden('all')}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeGarden === 'all'
                ? 'bg-[#2E5A44] text-[#FDFBF7] warm-shadow'
                : 'bg-[#FDFBF7] text-[#1C2822] border border-[#E8E2D5]'
            }`}
          >
            <span>همه گیاهان</span>
            <span
              className={`persian-num px-1.5 py-0.2 rounded-md text-[10.5px] ${
                activeGarden === 'all' ? 'bg-white/20 text-white' : 'bg-[#F6F3EC] text-[#5A655E]'
              }`}
            >
              {toPersianNum(spaceActivePlants.length)}
            </span>
          </button>

          {!isVisitor && (
            <button
              onClick={() => {
                setActiveGarden('thirsty');
                setThirstySubFilter('all_due');
              }}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeGarden === 'thirsty'
                  ? 'bg-[#1C2822] text-[#FDFBF7] warm-shadow'
                  : 'bg-[#FDFBF7] text-[#2E5A44] border border-[#E8E2D5]'
              }`}
            >
              <span>🔔 نوبت رسیدگی</span>
              <span
                className={`persian-num px-1.5 py-0.2 rounded-md text-[10.5px] ${
                  activeGarden === 'thirsty'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#E6F0EB] text-[#2E5A44]'
                }`}
              >
                {toPersianNum(totalAttentionPlantsCount)}
              </span>
            </button>
          )}

          {spaceGardens.map((g) => {
            const count = spaceActivePlants.filter((p) => p.garden === g.id).length;
            const active = activeGarden === g.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGarden(g.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  active
                    ? 'bg-[#2E5A44] text-[#FDFBF7] warm-shadow'
                    : 'bg-[#FDFBF7] text-[#1C2822] border border-[#E8E2D5]'
                }`}
              >
                <span>{g.name}</span>
                <span
                  className={`persian-num px-1.5 py-0.2 rounded-md text-[10.5px] ${
                    active ? 'bg-white/20 text-white' : 'bg-[#F6F3EC] text-[#5A655E]'
                  }`}
                >
                  {toPersianNum(count)}
                </span>
              </button>
            );
          })}
        </section>

        {/* پنل تفکیک‌شده زنگوله بالای صفحه (با پالت یکدست بوتانیکال بدون رنگ قرمز تند) */}
        {activeGarden === 'thirsty' && !isVisitor && (
          <section className="bg-[#FDFBF7] border border-[#2E5A44]/30 rounded-2xl p-2.5 space-y-2 warm-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#1C2822]">
                🌿 تفکیک هوشمند گیاهان نیازمند رسیدگی در «{currentSpace.name}»:
              </span>
              <button
                onClick={() => setActiveGarden('all')}
                className="text-[10px] font-bold text-[#2E5A44] bg-[#E6F0EB] px-2 py-0.5 rounded-lg"
              >
                نمایش همه ✕
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                {
                  id: 'all_due',
                  label: 'همه نوبت‌ها',
                  count: totalAttentionPlantsCount,
                  activeClass: 'bg-[#1C2822] text-white border-[#1C2822]'
                },
                {
                  id: 'water_only',
                  label: '💧 نیازمند آبیاری',
                  count: thirstyCount,
                  activeClass: 'bg-[#1F6380] text-white border-[#1F6380]'
                },
                {
                  id: 'mist_only',
                  label: '💨 نیازمند غبارپاشی',
                  count: mistCount,
                  activeClass: 'bg-[#2E5A44] text-white border-[#2E5A44]'
                },
                {
                  id: 'rotate_only',
                  label: '🔄 چرخش ۹۰ درجه',
                  count: rotateCount,
                  activeClass: 'bg-[#3A5A40] text-white border-[#3A5A40]'
                },
                {
                  id: 'fert_repot',
                  label: '🧪 کود / تعویض خاک',
                  count: fertOrRepotCount,
                  activeClass: 'bg-[#2B7A9B] text-white border-[#2B7A9B]'
                }
              ].map((tab) => {
                const isSelected = thirstySubFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setThirstySubFilter(tab.id as ThirstySubFilterType)}
                    className={`py-1.5 px-2 rounded-xl border text-[10.5px] font-bold flex items-center justify-between gap-1 transition-all whitespace-nowrap ${
                      isSelected
                        ? tab.activeClass
                        : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`persian-num px-1.5 py-0.2 rounded-md text-[9.5px] ${
                        isSelected ? 'bg-white/25 text-white' : 'bg-[#FDFBF7] text-[#5A655E]'
                      }`}
                    >
                      {toPersianNum(tab.count)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* گرید کارت گیاهان */}
        {filteredEvaluated.length === 0 ? (
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl p-8 text-center space-y-3 warm-shadow">
            <div className="text-3xl">{currentSpace.icon}</div>
            <h3 className="font-heading text-[15px] font-bold text-[#1C2822]">
              {searchQuery
                ? 'گیاهی با این نام یافت نشد'
                : activeGarden === 'thirsty'
                ? '🎉 عالی! هیچ گیاهی در این دسته نیاز به رسیدگی فوری ندارد'
                : `هنوز گلدانی در این بخش از «${currentSpace.name}» ثبت نشده است`}
            </h3>
            {activeGarden === 'thirsty' && (
              <button
                onClick={() => setActiveGarden('all')}
                className="px-4 py-2 rounded-xl bg-[#2E5A44] text-white text-[12px] font-bold"
              >
                بازگشت به لیست همه گیاهان
              </button>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-2 gap-2.5 items-stretch">
            {filteredEvaluated.map(({ plant, metrics }) => {
              const cuttingsCount = plant.cuttings?.length || 0;
              return (
                <div
                  key={plant.id}
                  onClick={() => setSelectedPlantId(plant.id)}
                  className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-[20px] p-2.5 warm-shadow flex flex-col justify-between transition-transform active:scale-[0.98] cursor-pointer h-full"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-[#F6F3EC] text-[#5A655E] border border-[#E8E2D5] whitespace-nowrap truncate">
                        {getGardenName(plant.garden)}
                      </span>
                      <span className="persian-num text-[10.5px] font-bold text-[#5A655E] shrink-0">
                        {plant.code}
                      </span>
                    </div>

                    <div className="relative h-28 rounded-2xl bg-gradient-to-b from-[#F6F3EC]/75 to-[#FDFBF7] border border-[#E8E2D5]/80 flex flex-col items-center justify-center overflow-hidden mb-2">
                      {metrics.needsQuarterTurn && !isVisitor && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActor(
                              activeMemberFromUrl?.name || spaceMembers[0]?.name || 'سینا'
                            );
                            setConfirmState({ plant, actionType: 'rotate' });
                          }}
                          className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-lg bg-[#FEF6E7] hover:bg-[#B47B26] text-[#B47B26] hover:text-white border border-[#B47B26]/35 text-[9.5px] font-bold flex items-center gap-0.5 transition-colors"
                        >
                          <IconRotate90 className="w-3 h-3" />
                          <span className="persian-num">چرخش ۹۰°</span>
                        </button>
                      )}

                      {metrics.needsWateringNow && metrics.needsMistingNow && !isVisitor && (
                        <span className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-[#E8F4F8] text-[#2B7A9B] border border-[#2B7A9B]/30 text-[9px] font-bold">
                          +💦 غبارپاشی
                        </span>
                      )}

                      {cuttingsCount > 0 && (
                        <div className="persian-num absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] text-[9px] font-bold">
                          🌱 {toPersianNum(cuttingsCount)} قلمه
                        </div>
                      )}

                      {metrics.climateReducedDays > 0 && !isVisitor && (
                        <div className="persian-num absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-lg bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/25 text-[9px] font-bold">
                          🔥 -{toPersianNum(metrics.climateReducedDays)} روز
                        </div>
                      )}

                      <PlantStylizedIllustration
                        shape={plant.shape3D}
                        potColor={plant.potColor}
                        potShape={plant.potShape}
                        plantName={plant.name}
                        customSvgMarkup={plant.customSvgMarkup}
                      />
                      <div
                        className={`w-16 h-2 rounded-full -mt-1 ${
                          metrics.dynamicStatus === 'thirsty'
                            ? 'bg-[#C85A32]/30 animate-pulse'
                            : metrics.dynamicStatus === 'mist'
                            ? 'bg-[#2B7A9B]/30 animate-pulse'
                            : 'bg-[#2E5A44]/20'
                        }`}
                      />
                    </div>

                    <h3 className="font-heading text-[12.5px] font-bold text-[#1C2822] leading-snug min-h-[34px] flex items-center">
                      {plant.name}
                    </h3>

                    <div className="mt-1.5 bg-[#F6F3EC]/80 border border-[#E8E2D5] rounded-xl px-2 py-1 space-y-1">
                      <div className="flex items-center justify-between gap-1 text-[10px] whitespace-nowrap">
                        <span className="persian-num font-bold text-[#2B7A9B]">
                          💧 {toPersianNum(plant.doseMl)} سی‌سی
                        </span>
                        <span className="text-[#E8E2D5]">|</span>
                        <span className="persian-num text-[#5A655E] font-semibold truncate">
                          {plant.doseCup}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#E8E2D5]/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            metrics.dynamicStatus === 'thirsty' ? 'bg-[#C85A32]' : 'bg-[#2B7A9B]'
                          }`}
                          style={{ width: `${metrics.moisturePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E8E2D5]/80">
                    {metrics.dynamicStatus === 'thirsty' && (
                      <div className="w-full px-2 py-1.5 rounded-xl bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] text-[10.5px] font-bold flex items-center justify-between whitespace-nowrap">
                        <span>
                          {metrics.isWeekendShifted
                            ? '⚡ پیش از تعطیلات'
                            : plant.fertDue
                            ? 'آبیاری + کوددهی'
                            : 'تشنه • نیازمند آب'}
                        </span>
                        <IconWaterDrop className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    )}
                    {metrics.dynamicStatus === 'mist' && (
                      <div className="w-full px-2 py-1.5 rounded-xl bg-[#E8F4F8] border border-[#2B7A9B]/30 text-[#2B7A9B] text-[10.5px] font-bold flex items-center justify-between whitespace-nowrap">
                        <span>نیاز به غبارپاشی</span>
                        <IconMistSpray className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    )}
                    {metrics.dynamicStatus === 'locked' && (
                      <div className="w-full px-2 py-1.5 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 text-[#2E5A44] text-[10.5px] font-bold flex items-center justify-between whitespace-nowrap">
                        <span className="persian-num">
                          سیراب ({toPersianNum(metrics.daysRemaining)} روز مانده)
                        </span>
                        <IconShieldLock className="w-3.5 h-3.5 shrink-0" />
                      </div>
                    )}
                    {metrics.dynamicStatus === 'recovery' && (
                      <div className="w-full px-2 py-1.5 rounded-xl bg-[#FEF6E7] border border-[#B47B26]/30 text-[#B47B26] text-[10.5px] font-bold flex items-center justify-between whitespace-nowrap">
                        <span>نقاهت پس از هرس</span>
                        <span>🩺</span>
                      </div>
                    )}
                    {metrics.dynamicStatus === 'ok' && (
                      <div className="w-full px-2 py-1.5 rounded-xl bg-[#E6F0EB]/60 text-[#2E5A44] text-[10.5px] font-semibold flex items-center justify-between whitespace-nowrap">
                        <span className="persian-num">
                          سیراب ({toPersianNum(metrics.daysRemaining)} روز دیگر)
                        </span>
                        <span>✓</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {!isVisitor && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setMemorialOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D5] text-[12px] font-semibold text-[#5A655E] flex items-center gap-2 warm-shadow"
            >
              <span>🏛️ تالار یادبود و آرشیو «{currentSpace.name}»</span>
              <span className="persian-num px-2 py-0.5 rounded-lg bg-[#F6F3EC] text-[#1C2822] font-bold text-[11px]">
                {toPersianNum(spaceArchivedPlants.length)}
              </span>
            </button>
          </div>
        )}
      </main>

      <PlantProfileSheet
        plant={selectedPlant}
        gardenName={selectedPlant ? getGardenName(selectedPlant.garden) : ''}
        userRole={userRole}
        radiatorOn={currentSpace.radiatorOn}
        onClose={() => setSelectedPlantId(null)}
        onRequestAction={(plant, actionType) => {
          if (isVisitor) return;
          setSelectedActor(
            activeMemberFromUrl?.name || spaceMembers[0]?.name || 'سینا'
          );
          setConfirmState({ plant, actionType });
        }}
        onSwitchGarden={handleSwitchGarden}
        onEditPlant={(plant: PlantEntity) => setEditingPlant(plant)}
        onDeleteHistory={handleDeleteHistory}
        onReportHistoryError={(name) => {
          sendInstantNotification(
            `🚩 گزارش خطا در ${currentSpace.name}`,
            `درخواست بررسی و اصلاح تاریخچه برای گلدان «${name}» ثبت شد.`
          );
          alert(`گزارش خطای ثبت برای «${name}» ارسال شد.`);
        }}
        onOpenGuide={(topic) => setGuideTopic(topic)}
        onOpenQR={(plant) => setQrPlant(plant)}
        onArchivePlant={handleArchivePlant}
        onHardDeletePlant={handleHardDeletePlant}
        onAddCutting={handleAddCutting}
        onPromoteCuttingToPlant={handlePromoteCuttingToPlant}
        onRemoveCutting={handleRemoveCutting}
      />

      <AddPlantModal
        isOpen={addPlantOpen}
        gardens={spaceGardens}
        nextIndex={spaceActivePlants.length + 1}
        onClose={() => setAddPlantOpen(false)}
        onAdd={(newPlant) =>
          setPlants([...plants, { ...newPlant, spaceId: currentSpace.id }])
        }
      />

      <EditPlantModal
        plant={editingPlant}
        gardens={spaceGardens}
        onClose={() => setEditingPlant(null)}
        onSave={(updated) =>
          setPlants((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        }
      />

      <MemorialModal
        isOpen={memorialOpen}
        archivedPlants={spaceArchivedPlants}
        onClose={() => setMemorialOpen(false)}
        onRestore={handleRestorePlant}
        onHardDelete={handleHardDeletePlant}
      />

      <QRCodeModal plant={qrPlant} onClose={() => setQrPlant(null)} />

      <SettingsAndMembersModal
        isOpen={settingsOpen}
        isSuperAdmin={isSuperAdmin}
        currentSpace={currentSpace}
        spaces={spaces}
        gardens={gardens}
        members={members}
        plants={plants}
        cloudConfig={cloudConfig}
        onClose={() => setSettingsOpen(false)}
        onUpdateSpaces={setSpaces}
        onDeleteSpace={handleDeleteSpace}
        onUpdateGardens={setGardens}
        onDeleteGarden={handleDeleteGarden}
        onUpdateMembers={setMembers}
        onUpdateCloudConfig={(cfg) => {
          setCloudConfig(cfg);
          saveCloudConfig(cfg);
        }}
        onRestoreBackup={(backup) => {
          setSpaces(backup.spaces);
          setGardens(backup.gardens);
          setPlants(backup.plants);
          setMembers(backup.members);
        }}
        onResetGreenhouse={(mode) => {
          localStorage.setItem('sina_greenhouse_zero_state_v7', 'true');
          setUndoSnapshot(JSON.parse(JSON.stringify(plants)));
          if (mode === 'plants_only') {
            setPlants([]);
            setUndoMessage('تمام گلدان‌های پیش‌فرض پاک شدند؛ اکنون از کد #۰۱ ثبت کنید.');
          } else {
            const freshSpace: SpaceEntity = {
              id: 'office',
              name: 'گلخانه کوچک من',
              icon: '🌿',
              radiatorOn: false
            };
            const freshGarden: GardenEntity = {
              id: 'g_main',
              spaceId: 'office',
              name: 'باغچه اصلی',
              lightLevel: 'high'
            };
            setSpaces([freshSpace]);
            setGardens([freshGarden]);
            setPlants([]);
            setActiveSpaceId('office');
            setActiveGarden('all');
            setUndoMessage('گلخانه به حالت ۱۰۰٪ خام بازنشانی شد.');
          }
          setSettingsOpen(false);
        }}
        onSwitchPreviewRole={(role, memberId) => {
          setUserRole(role);
          setPreviewMemberId(memberId || null);
          if (memberId) {
            const targetM = members.find((m) => m.id === memberId);
            if (targetM && targetM.assignedSpaces.length > 0) {
              setActiveSpaceId(targetM.assignedSpaces[0]);
              setActiveGarden('all');
            }
          }
        }}
      />

      {confirmState && !isVisitor && (
        <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="font-heading text-[16px] font-bold text-[#1C2822]">
                {confirmState.actionType === 'water'
                  ? '💧 تایید ثبت آبیاری'
                  : confirmState.actionType === 'mist'
                  ? '💦 تایید ثبت غبارپاشی'
                  : confirmState.actionType === 'rotate'
                  ? '🔄 تایید چرخش ۹۰ درجه گلدان'
                  : confirmState.actionType === 'prune'
                  ? '✂️ تایید ثبت هرس و فرم‌دهی'
                  : confirmState.actionType === 'repot'
                  ? '🪴 تایید ثبت تعویض خاک و گلدان'
                  : confirmState.actionType === 'clean_leaves'
                  ? '✨ تایید غبارروبی و تمیز کردن برگ‌ها'
                  : '⏳ خاک مرطوب است (نیاز به آبیاری ندارد)'}
              </h3>
              <p className="persian-num text-[12px] text-[#5A655E] mt-0.5">
                {confirmState.plant.name} ({confirmState.plant.code}) • {currentSpace.name}
              </p>
            </div>

            <div className="persian-num text-[12.5px] text-[#1C2822] bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] leading-relaxed">
              {confirmState.actionType === 'water'
                ? `لطفاً به میزان ${toPersianNum(confirmState.plant.doseMl)} سی‌سی (معادل ${confirmState.plant.doseCup}) آب ولرم بدون کلر پای خاک بریزید.`
                : confirmState.actionType === 'mist'
                ? 'با اسپری دستی از فاصله ۳۰ سانتی‌متری روی برگ‌ها آب بدون املاح بپاشید.'
                : confirmState.actionType === 'rotate'
                ? 'گلدان را ۹۰ درجه بچرخانید تا تمام برگ‌ها به صورت متقارن نور دریافت کنند.'
                : confirmState.actionType === 'prune'
                ? 'برگ‌های زرد/مسن را با قیچی تمیز جدا کرده یا سرشاخه‌ها را فرم‌دهی نمایید.'
                : confirmState.actionType === 'repot'
                ? 'تعویض خاک و بررسی سلامت ریشه ثبت می‌شود (تا ۲ هفته پس از تعویض خاک کود ندهید).'
                : confirmState.actionType === 'clean_leaves'
                ? 'پاک کردن گردوغبار سطح برگ‌ها با دستمال مرطوب جهت باز شدن منافذ تنفسی ثبت می‌شود.'
                : 'از آنجایی که خاک هنوز نم‌دار است، گیاه نیازی به آب ندارد و نوبت آبیاری ۲ روز به تعویق می‌افتد.'}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#1C2822] mb-1.5">
                ثبت توسط کدام عضو «{currentSpace.name}»؟
              </label>
              <div className="flex flex-wrap gap-1.5">
                {spaceMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedActor(m.name)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all ${
                      selectedActor === m.name
                        ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                        : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
              placeholder="یادداشت اختیاری (در تاریخچه و تلگرام ثبت می‌شود)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[12.5px] focus:outline-none"
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleConfirmExecute}
                className="flex-1 py-3 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13.5px]"
              >
                بله، ثبت و ارسال گزارش ✓
              </button>
              <button
                onClick={() => setConfirmState(null)}
                className="px-5 py-3 rounded-2xl bg-[#F6F3EC] text-[#5A655E] font-semibold text-[13px]"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {undoMessage && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-50 bg-[#1C2822] text-[#FDFBF7] px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between">
          <span className="persian-num text-[12px] font-medium">{undoMessage}</span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleUndo}
              className="px-3 py-1 rounded-xl bg-[#B47B26] text-white text-[11.5px] font-bold"
            >
              ↩️ واگرد (لغو)
            </button>
            <button onClick={() => setUndoMessage(null)} className="text-white/60 text-xs px-1">
              ✕
            </button>
          </div>
        </div>
      )}

      {guideTopic && (
        <div className="fixed inset-0 z-50 bg-[#1C2822]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-sm w-full p-5 space-y-3">
            <h3 className="font-heading text-[15.5px] font-bold text-[#1C2822]">
              {guideTopic === 'misting'
                ? '💦 غبارپاشی چیست؟'
                : guideTopic === 'watering'
                ? '💧 راهنمای پیمانه آبیاری'
                : '🌱 روش تست رطوبت خاک'}
            </h3>
            <p className="persian-num text-[12.5px] text-[#5A655E] leading-relaxed">
              {guideTopic === 'misting'
                ? 'پاشیدن آب بدون املاح به صورت ذرات پودری با اسپری دستی از فاصله ۳۰ سانتی‌متری در هوای اطراف برگ‌ها تا رطوبت تامین شود بدون اینکه خاک خیس گردد.'
                : guideTopic === 'watering'
                ? 'یک لیوان معمولی پر معادل ۲۵۰ سی‌سی است. آب ولرم هم‌دمای اتاق را به آرامی از لبه گلدان روی خاک پخش کنید.'
                : 'نوک انگشت را ۲ تا ۳ سانتی‌متر وارد خاک کنید؛ اگر خاک خشک بود زمان آبیاری است و اگر هنوز خنک و نم‌دار بود دکمه «خاک مرطوب» را بزنید.'}
            </p>
            <button
              onClick={() => setGuideTopic(null)}
              className="w-full py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13px]"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </div>
  );
}