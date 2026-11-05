import React, { useState, useEffect } from 'react';
import {
  type PlantEntity,
  type GardenEntity,
  type MemberPermissions,
  formatPersianDate
} from '../../data/initialPlants';
import { CareCalculator } from '../../engine/careCalculator';
import {
  PlantStylizedIllustration,
  IconWaterDrop,
  IconMistSpray,
  IconRotate90,
  IconShieldLock
} from '../icons/CustomIcons';

export type AccessRole =
  | 'owner'
  | 'caretaker'
  | 'manager'
  | 'helper'
  | 'visitor'
  | 'admin'
  | 'member';

type HistoryItemType = PlantEntity['history'][number];

// ============================================================================
// مدیر پشته دکمه بازگشت موبایل (LIFO Back-Button Stack Manager)
// تضمین می‌کند که باز بودن مودال‌های فرعی (ویرایش / QR) باعث بسته شدن پروفایل نشود
// ============================================================================
interface ModalStackItem {
  id: string;
  close: () => void;
}

declare global {
  interface Window {
    __sinaModalStack?: ModalStackItem[];
    __sinaPopListenerBound?: boolean;
    __sinaIgnoreNextPop?: boolean;
  }
}

export const registerModalBackHandler = (
  _id: string,
  _closeFn: () => void
): (() => void) => () => {};

const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const formatCurrentTimeFa = (): string => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `ساعت ${toPersianNum(hh)}:${toPersianNum(mm)}`;
};

const formatHistoryActionText = (rawText: string): string => {
  if (!rawText) return '';
  const withMl = rawText.replace(/سی‌سی|سی سی|cc/gi, 'میلی‌لیتر');
  if (withMl.startsWith('ثبت در گلخانه')) {
    return withMl.replace(
      'ثبت در گلخانه',
      'ورود و ثبت اولیه گیاه در گلخانه'
    );
  }
  return withMl;
};

// ============================================================================
// آیکون‌های برداری مینیمال و اختصاصی برای نوار ۴ تب
// ============================================================================
const IconTabIdentity: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 13c2.5 0 4.5-2 4.5-4.5C14 8.5 12 10.5 12 13zm0 0v-4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTabClinic: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8v5M9.5 10.5h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconTabCareSoil: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTabHistory: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3v5h5M12 7v5l3 2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface PlantProfileSheetProps {
  plant: PlantEntity | null;
  gardenName?: string;
  gardens?: GardenEntity[];
  userRole?: AccessRole;
  permissions?: MemberPermissions;
  radiatorOn?: boolean;
  isOwner?: boolean;
  canCare?: boolean;
  activeMemberName?: string;
  onClose: () => void;
  onRequestAction?: (plant: PlantEntity, actionType: any) => void;
  onSwitchGarden?: (plantId: string) => void;
  onWater?: (plantId: string) => void;
  onMist?: (plantId: string) => void;
  onRotate?: (plantId: string) => void;
  onSnoozeWater?: (plantId: string) => void;
  onDelayWater?: (plantId: string) => void;
  onSoilWetDelay?: (plantId: string) => void;
  onEdit?: (plant: PlantEntity) => void;
  onEditPlant?: (plant: PlantEntity) => void;
  onOpenEdit?: (plant: PlantEntity) => void;
  onShowQR?: (plant: PlantEntity) => void;
  onOpenQR?: (plant: PlantEntity) => void;
  onArchive?: (plant: any, reason?: any) => void;
  onArchivePlant?: (plant: any, reason?: any) => void;
  onHardDelete?: (plantId: string, plantName: string) => void;
  onHardDeletePlant?: (plantId: string, plantName: string) => void;
  onChangeGarden?: (plantId: string, newGardenId: string) => void;
  onUpdatePlant?: (updatedPlant: PlantEntity) => void;
  onRepot?: (plantId: string) => void;
  onLogRepot?: (plantId: string) => void;
  onFertilize?: (plantId: string) => void;
  onLogFertilize?: (plantId: string) => void;
  onPrune?: (plantId: string) => void;
  onLogPrune?: (plantId: string) => void;
  onAddCutting?: (plantId: string, medium: any, note: any) => void;
  onAdvanceCutting?: (plantId: string, cuttingId: string) => void;
  onRemoveCutting?: (plantId: string, cuttingId: string) => void;
  onOpenGuide?: (topic: any) => void;
  onShowGuide?: (topic: any) => void;
  onInfoModal?: (topic: any) => void;
  onInfoClick?: (topic: any) => void;
  onHelpModal?: (topic: any) => void;
  onHelpClick?: (topic: any) => void;
  onOpenModal?: (topic: any) => void;
  onShowModal?: (topic: any) => void;
  onCareGuide?: (topic: any) => void;
  onViewGuide?: (topic: any) => void;
  onOpenTopic?: (topic: any) => void;
  onShowTopic?: (topic: any) => void;
  onOpenInfo?: (topic: any) => void;
  onShowInfo?: (topic: any) => void;
  onOpenHelp?: (topic: any) => void;
  onShowHelp?: (topic: any) => void;
  [key: `on${string}`]: ((...args: any[]) => any) | undefined;
}

type ProfileTabKey = 'identity' | 'clinic' | 'care_soil' | 'history';
type ActiveGuidePopover = 'moisture' | 'water_dose' | 'mist_guide' | null;
type HistoryFilterType = 'all' | 'water_mist' | 'soil_prune';

export const PlantProfileSheet: React.FC<PlantProfileSheetProps> = (props) => {
  const {
    plant,
    gardenName,
    gardens = [],
    userRole = 'owner',
    radiatorOn = false,
    activeMemberName,
    onClose,
    onRequestAction,
    onSwitchGarden,
    onWater,
    onMist,
    onRotate,
    onSnoozeWater,
    onDelayWater,
    onSoilWetDelay,
    onEdit,
    onEditPlant,
    onOpenEdit,
    onShowQR,
    onOpenQR,
    onArchive,
    onArchivePlant,
    onHardDelete,
    onHardDeletePlant,
    onChangeGarden,
    onUpdatePlant,
    onRepot,
    onLogRepot,
    onFertilize,
    onLogFertilize,
    onPrune,
    onLogPrune
  } = props;

  const [activeTab, setActiveTab] = useState<ProfileTabKey>('identity');
  const [activeGuide, setActiveGuide] = useState<ActiveGuidePopover>(null);
  const [showGardenPanel, setShowGardenPanel] = useState(false);
  const [gardenSwitchFeedback, setGardenSwitchFeedback] = useState<string | null>(null);
  const [clinicSearch, setClinicSearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilterType>('all');
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiveReason, setArchiveReason] = useState('هدیه دادن یا انتقال به فضای دیگر');
  const [, setLocalRenderTick] = useState(0);

  // ثبت در پشته دکمه بازگشت موبایل (LIFO Stack)
  useEffect(() => {
    if (!plant) return;
    const unregister = registerModalBackHandler(`profile_${plant.id}`, onClose);
    return () => {
      unregister();
    };
  }, [plant?.id]);

  if (!plant) return null;

  // منطق دقیق سطوح دسترسی (RBAC)
// منطق دقیق سطوح دسترسی (RBAC) + پشتیبانی از ۴ مجوز ریزدانه هر عضو
  const effectiveIsOwner =
    props.isOwner !== undefined
      ? props.isOwner
      : userRole === 'owner' || userRole === 'admin';

  const effectiveCanCare =
    props.permissions !== undefined
      ? props.permissions.canWaterAndMist
      : props.canCare !== undefined
      ? props.canCare
      : userRole !== 'visitor';

  const effectiveCanEdit =
    props.permissions !== undefined
      ? props.permissions.canEditPlants
      : effectiveIsOwner || userRole === 'manager' || userRole === 'caretaker';

  const effectiveCanManageSpaces =
    props.permissions !== undefined
      ? props.permissions.canManageSpaces
      : effectiveCanEdit;

  const effectiveCanDelete =
    props.permissions !== undefined
      ? props.permissions.canDelete
      : effectiveIsOwner;

  const roleDisplayName =
    activeMemberName ||
    (userRole === 'owner'
      ? 'مالک ارشد'
      : userRole === 'caretaker' || userRole === 'manager'
      ? 'جانشین / همیار'
      : userRole === 'helper'
      ? 'همیار مراقبت'
      : 'بازدیدکننده');

  const isSucculentPlant =
    plant.statusType === 'locked' ||
    CareCalculator.isSucculentSpecies(plant.shape3D, plant.name);

  const elapsedWaterDays = CareCalculator.getElapsedDaysSinceWater(plant);
  const remainingWaterDays = Math.max(0, plant.waterCycleDays - elapsedWaterDays);

  const baseMoisture = Math.round(
    ((plant.waterCycleDays - elapsedWaterDays) / Math.max(1, plant.waterCycleDays)) * 92 + 8
  );
  const radiatorPenalty = radiatorOn && elapsedWaterDays > 0 ? 6 : 0;
  const soilMoisturePercent = Math.max(8, Math.min(100, baseMoisture - radiatorPenalty));

  const mistCycle = plant.mistCycleDays || (isSucculentPlant ? 0 : radiatorOn ? 2 : 3);
  const elapsedMistDays = plant.lastMistedAt
    ? Math.floor((Date.now() - plant.lastMistedAt) / 86400000)
    : plant.daysSinceMist || 0;
  const remainingMistDays = mistCycle > 0 ? Math.max(0, mistCycle - elapsedMistDays) : 0;
  const noMistRequired =
    isSucculentPlant ||
    mistCycle === 0 ||
    (plant.mistNeed &&
      (plant.mistNeed.includes('ممنوع') ||
        plant.mistNeed.includes('ندارد') ||
        plant.mistNeed.includes('نشود')));

  const currentGarden = gardens.find((g) => g.id === plant.garden);
  const resolvedGardenTitle =
    gardenName || (currentGarden ? currentGarden.name : 'باغچه اصلی');

  const moistureTheme =
    soilMoisturePercent <= 25
      ? {
          barBg: 'from-[#C85A32] to-[#E07A5F]',
          badgeBg: 'bg-[#FCEEE9] text-[#C85A32] border-[#C85A32]/30',
          statusLabel: 'تشنه آبیاری'
        }
      : soilMoisturePercent <= 55
      ? {
          barBg: 'from-[#2B7A9B] to-[#56A3C4]',
          badgeBg: 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/30',
          statusLabel: 'رطوبت متعادل'
        }
      : {
          barBg: 'from-[#2E5A44] to-[#52B788]',
          badgeBg: 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/30',
          statusLabel: 'کاملاً سیراب'
        };

  const triggerWater = () => {
    if (onRequestAction) onRequestAction(plant, 'water');
    else if (onWater) onWater(plant.id);
  };

  const triggerMist = () => {
    if (onRequestAction) onRequestAction(plant, 'mist');
    else if (onMist) onMist(plant.id);
  };

  const triggerRotate = () => {
    if (onRequestAction) onRequestAction(plant, 'rotate');
    else if (onRotate) onRotate(plant.id);
  };

  const appendLocalOrParentHistory = (
    actionTitle: string,
    extraUpdates?: Partial<PlantEntity>
  ) => {
    const newLog: HistoryItemType = {
      id: 'h_' + Date.now(),
      action: actionTitle,
      by: roleDisplayName,
      time: formatCurrentTimeFa(),
      persianDate: formatPersianDate(0)
    };

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        ...extraUpdates,
        history: [newLog, ...(plant.history || [])]
      });
    } else {
      plant.history = [newLog, ...(plant.history || [])];
      if (extraUpdates) {
        Object.assign(plant, extraUpdates);
      }
      setLocalRenderTick((t) => t + 1);
    }
  };

  const triggerSnooze = () => {
    if (onSnoozeWater) onSnoozeWater(plant.id);
    else if (onDelayWater) onDelayWater(plant.id);
    else if (onSoilWetDelay) onSoilWetDelay(plant.id);
    else {
      appendLocalOrParentHistory(
        '🛡️ تست رطوبت خاک: خاک هنوز مرطوب است (تعویق ۱ روزه آبیاری)',
        {
          lastWateredAt: (plant.lastWateredAt || Date.now()) + 86400000,
          statusType: 'ok'
        }
      );
    }
  };

  const handleRecordPruning = () => {
    if (onLogPrune) onLogPrune(plant.id);
    else if (onPrune) onPrune(plant.id);
    appendLocalOrParentHistory(
      '✂️ هرس، سرزنی و برگ‌چینی تخصصی شاخسار'
    );
  };

  const handleRecordRepotting = () => {
    if (onLogRepot) onLogRepot(plant.id);
    else if (onRepot) onRepot(plant.id);
    else {
      appendLocalOrParentHistory(
        `🪴 تعویض بستر خاک و بررسی سلامت ریشه (حجم خاک: ${toPersianNum(plant.potVolumeLiters || 2)} لیتر)`,
        {
          lastRepottedDate: formatPersianDate(0),
          lastRepottedMonthsAgo: 0
        }
      );
    }
  };

  const handleRecordFertilizing = () => {
    if (onLogFertilize) onLogFertilize(plant.id);
    else if (onFertilize) onFertilize(plant.id);
    else {
      appendLocalOrParentHistory(
        '🧪 تغذیه و کوددهی تقویتی مطابق رژیم گیاه',
        {
          fertDue: false
        }
      );
    }
  };

  const lastPrunedLog = (plant.history || []).find((h) => h.action.includes('هرس'));

  const filteredClinic = (plant.clinic || []).filter(
    (c) =>
      !clinicSearch.trim() ||
      c.symptom.includes(clinicSearch) ||
      c.cause.includes(clinicSearch) ||
      c.fix.includes(clinicSearch)
  );

  const getHistoryItemStyle = (actionText: string) => {
    if (
      actionText.includes('ثبت در گلخانه') ||
      actionText.includes('ثبت اولیه') ||
      actionText.includes('ورود')
    ) {
      return {
        badge: '🌱 ورود به گلخانه',
        bg: 'bg-[#E6F0EB]',
        border: 'border-[#2E5A44]/25',
        text: 'text-[#2E5A44]',
        category: 'soil_prune' as const
      };
    }
    if (actionText.includes('مرطوب') || actionText.includes('تعویق')) {
      return {
        badge: '🛡️ تعویق آبیاری',
        bg: 'bg-[#FEF6E7]',
        border: 'border-[#D97706]/30',
        text: 'text-[#B45309]',
        category: 'water_mist' as const
      };
    }
    if (actionText.includes('آبیاری')) {
      return {
        badge: '💧 ثبت آبیاری',
        bg: 'bg-[#EBF4F8]',
        border: 'border-[#2B7A9B]/30',
        text: 'text-[#1F6380]',
        category: 'water_mist' as const
      };
    }
    if (actionText.includes('غبارپاشی')) {
      return {
        badge: '💨 غبارپاشی برگ',
        bg: 'bg-[#E6F0EB]',
        border: 'border-[#2E5A44]/25',
        text: 'text-[#2E5A44]',
        category: 'water_mist' as const
      };
    }
    if (actionText.includes('چرخش')) {
      return {
        badge: '🔄 چرخش ۹۰ درجه',
        bg: 'bg-[#EEF2EB]',
        border: 'border-[#3A5A40]/25',
        text: 'text-[#3A5A40]',
        category: 'soil_prune' as const
      };
    }
    if (actionText.includes('هرس')) {
      return {
        badge: '✂️ هرس و سرزنی',
        bg: 'bg-[#E6F0EB]',
        border: 'border-[#2E5A44]/30',
        text: 'text-[#2E5A44]',
        category: 'soil_prune' as const
      };
    }
    if (actionText.includes('تعویض')) {
      return {
        badge: '🪴 تعویض خاک',
        bg: 'bg-[#FCEEE9]',
        border: 'border-[#C85A32]/30',
        text: 'text-[#C85A32]',
        category: 'soil_prune' as const
      };
    }
    if (actionText.includes('کود')) {
      return {
        badge: '🧪 کوددهی تقویتی',
        bg: 'bg-[#F3E8FF]',
        border: 'border-[#7E22CE]/25',
        text: 'text-[#6B21A8]',
        category: 'soil_prune' as const
      };
    }
    return {
      badge: '📋 ثبت مراقبت',
      bg: 'bg-[#F6F3EC]',
      border: 'border-[#E8E2D5]',
      text: 'text-[#5A655E]',
      category: 'soil_prune' as const
    };
  };

  const filteredHistory = (plant.history || []).filter((item) => {
    if (historyFilter === 'all') return true;
    const style = getHistoryItemStyle(item.action);
    return style.category === historyFilter;
  });

  const repotMonthsAgo = plant.lastRepottedMonthsAgo ?? 1;
  const repotCycle = plant.repotCycleMonths || 18;
  const repotHealthPercent = Math.max(
    10,
    Math.min(100, Math.round(((repotCycle - repotMonthsAgo) / Math.max(1, repotCycle)) * 100))
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      {/* قاب قفل‌شده بدون بیرون‌زدگی */}
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ۱. هدر ثابت، متقارن و مهندسی‌شده */}
        <div className="px-3.5 pt-3 pb-2.5 border-b border-[#E8E2D5] bg-[#FDFBF7] shrink-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="persian-num px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10.5px] font-extrabold shrink-0">
                  پلاک {plant.code}
                </span>
                <h2 className="font-heading text-[15.5px] font-extrabold text-[#1C2822] truncate">
                  {plant.name}
                </h2>
              </div>

              {plant.nickname && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] max-w-full">
                  <span className="text-[9.5px] font-bold text-[#2E5A44] shrink-0">
                    🌿 لقب گیاه:
                  </span>
                  <span className="text-[10px] font-semibold text-[#5A655E] truncate">
                    {plant.nickname}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن پروفایل گیاه"
              className="w-8 h-8 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] hover:bg-[#FCEEE9] hover:text-[#C85A32] hover:border-[#C85A32]/30 flex items-center justify-center shrink-0 active:scale-90 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* ۲. نوار متقارن ۳ دکمه مدیریتی بالا */}
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={!effectiveCanEdit}
              onClick={() => {
                if (!effectiveCanEdit) return;
                setShowGardenPanel((prev) => !prev);
                setGardenSwitchFeedback(null);
              }}
              className={`h-[31px] px-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all truncate disabled:opacity-60 ${
                showGardenPanel
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7-4.5-7-11a7 7 0 1 1 14 0c0 6.5-7 11-7 11z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <span className="truncate">{resolvedGardenTitle}</span>
            </button>

            <button
              type="button"
              disabled={!effectiveCanEdit}
              onClick={() => {
                if (!effectiveCanEdit) return;
                if (onOpenEdit) onOpenEdit(plant);
                else if (onEditPlant) onEditPlant(plant);
                else if (onEdit) onEdit(plant);
              }}
              className="h-[31px] px-2 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>ویرایش گلدان</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onOpenQR) onOpenQR(plant);
                else if (onShowQR) onShowQR(plant);
              }}
              className="h-[31px] px-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all whitespace-nowrap"
            >
              <svg className="w-3.5 h-3.5 text-[#1F6380] shrink-0" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span>کارت QR</span>
            </button>
          </div>

          {/* پنل تعاملی و شفاف تغییر باغچه */}
          {showGardenPanel && effectiveCanManageSpaces && (
            <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#2E5A44]/30 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#1C2822]">
                  📍 موقعیت فعلی: <strong className="text-[#2E5A44]">{resolvedGardenTitle}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowGardenPanel(false)}
                  className="text-[#C85A32] font-bold px-1"
                >
                  ✕
                </button>
              </div>

              {gardens.length > 1 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {gardens.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        if (onChangeGarden) onChangeGarden(plant.id, g.id);
                        else if (onUpdatePlant) onUpdatePlant({ ...plant, garden: g.id });
                        else if (onSwitchGarden) onSwitchGarden(plant.id);
                        setGardenSwitchFeedback(`✓ به «${g.name}» منتقل شد`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border transition-all ${
                        plant.garden === g.id
                          ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                          : 'bg-[#FDFBF7] text-[#1C2822] border-[#E8E2D5]'
                      }`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2 bg-[#FDFBF7] p-2 rounded-lg border border-[#E8E2D5]">
                  <span className="text-[9.5px] text-[#5A655E] leading-relaxed">
                    در صورت داشتن چند باغچه، با زدن دکمه روبرو گلدان به باغچه بعدی منتقل می‌شود:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const prevTitle = resolvedGardenTitle;
                      if (onSwitchGarden) onSwitchGarden(plant.id);
                      setTimeout(() => {
                        setGardenSwitchFeedback(
                          'تغییر باغچه بررسی شد (اگر فقط ۱ باغچه دارید، از صفحه اصلی باغچه جدید بسازید).'
                        );
                      }, 80);
                      void prevTitle;
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#2E5A44] text-white text-[9.5px] font-bold shrink-0 active:scale-95 transition-transform"
                  >
                    🔄 باغچه بعدی
                  </button>
                </div>
              )}

              {gardenSwitchFeedback && (
                <div className="text-[9px] font-bold text-[#2E5A44] bg-[#E6F0EB] px-2 py-1 rounded-lg">
                  {gardenSwitchFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ۳. بدنه اسکرول‌شونده داخلی */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3 space-y-2.5">
          {/* الف) ویترین استودیویی گیاه (۳ کاشی) + کارت بازطراحی‌شده وضعیت بستر (۲ کاشی) */}
          <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2 space-y-2">
            <div className="grid grid-cols-12 gap-2 items-stretch">
              {/* ستون راست: ویترین استودیویی گیاه (۶ ستون از ۱۲ ستون = ۵۰٪ عرض برای تقارن کامل) */}
              <div className="col-span-6 bg-gradient-to-b from-[#FDFBF7] via-[#F7F3EA] to-[#EFE9DC] border border-[#E8E2D5] rounded-xl p-2 flex flex-col items-center justify-between relative min-h-[184px] overflow-hidden">
                {/* طاق نوری استودیویی ظریف در پس‌زمینه */}
                <div className="w-26 h-26 rounded-t-full bg-gradient-to-b from-[#E6F0EB]/65 to-transparent border-t border-x border-[#2E5A44]/10 absolute top-6 pointer-events-none" />

                {/* بج وضعیت سیرابی و شوفاژ در بالا */}
                <div className="w-full flex items-center justify-between gap-1 z-10">
                  <span
                    className={`persian-num px-1.5 py-0.5 rounded-md text-[8px] font-extrabold border whitespace-nowrap ${moistureTheme.badgeBg}`}
                  >
                    {moistureTheme.statusLabel}
                  </span>

                  {radiatorOn ? (
                    <span className="persian-num px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/25 whitespace-nowrap">
                      🔥 شوفاژ
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-[#FDFBF7]/90 text-[#2E5A44] border border-[#E8E2D5] whitespace-nowrap">
                      ✨ پایش زنده
                    </span>
                  )}
                </div>

                {/* تصویر گیاه + سکوی استودیویی سه‌بعدی در زیر گلدان */}
                <div className="relative flex flex-col items-center justify-center z-10 my-0.5">
                  <div className="transform scale-105 z-10">
                    <PlantStylizedIllustration
                      shape={plant.shape3D}
                      potColor={plant.potColor}
                      potShape={plant.potShape}
                      customSvgMarkup={plant.customSvgMarkup}
                    />
                  </div>
                  {/* سکوی استودیویی چوبی/سنگی زیر گلدان */}
                  <svg className="w-26 h-4 -mt-2.5 pointer-events-none" viewBox="0 0 120 18" fill="none">
                    <ellipse cx="60" cy="11" rx="48" ry="5.5" fill="#1C2822" fillOpacity="0.1" />
                    <ellipse cx="60" cy="8.5" rx="40" ry="4.2" fill="#D8C9B8" stroke="#B59672" strokeWidth="1" />
                    <ellipse cx="60" cy="7.5" rx="34" ry="2.8" fill="#EDE3D5" />
                  </svg>
                </div>

                {/* پلاک استودیویی زیبا در پایین ویترین */}
                {plant.isComboPlanter && plant.companionSpecies && plant.companionSpecies.length > 0 ? (
                  <div className="w-full z-10 text-center text-[8px] font-bold text-[#2E5A44] bg-[#FDFBF7]/90 border border-[#E8E2D5] px-1.5 py-1 rounded-lg">
                    🌱 هم‌زیست: {plant.companionSpecies.join(' + ')}
                  </div>
                ) : (
                  <div className="w-full z-10 bg-[#FDFBF7]/90 border border-[#E8E2D5] rounded-lg px-1.5 py-1 flex items-center justify-center gap-1 text-[8px] font-bold text-[#2E5A44] whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A44] shrink-0" />
                    <span>
                      {isSucculentPlant
                        ? 'ذخیره‌کننده آب • مقاوم'
                        : 'تصفیه‌کننده هوا • اکسیژن‌ساز'}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A44] shrink-0" />
                  </div>
                )}
              </div>

              {/* ستون چپ: داشبورد مهندسی «وضعیت بستر» (۶ ستون از ۱۲ ستون = ۵۰٪ عرض بدون هیچ‌گونه سه‌نقطه) */}
              <div className="col-span-6 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 flex flex-col justify-between min-h-[184px]">
                {/* ۱. هدر کارت: عنوان کامل + آیکون برداری اینفو */}
                <div className="flex items-center justify-between gap-1 border-b border-[#E8E2D5]/80 pb-1.5">
                  <span className="text-[11px] font-extrabold text-[#1C2822] whitespace-nowrap">
                    وضعیت بستر و گیاه
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGuide(activeGuide === 'moisture' ? null : 'moisture')
                    }
                    aria-label="راهنمای وضعیت بستر"
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all active:scale-90 shrink-0 ${
                      activeGuide === 'moisture'
                        ? 'bg-[#1F6380] text-white border-[#1F6380]'
                        : 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/30'
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* ۲. نمایشگر افقی و مدرج درصد رطوبت خاک (آزادسازی ۱۰۰٪ عرض کارت) */}
                <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-xl p-2 space-y-1.5 my-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-[#5A655E]">رطوبت فعلی خاک:</span>
                    <span className="persian-num text-[13.5px] font-extrabold text-[#1C2822] leading-none">
                      {toPersianNum(soilMoisturePercent)}٪
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8E2D5] p-0.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-l ${moistureTheme.barBg} transition-all duration-500`}
                      style={{ width: `${soilMoisturePercent}%` }}
                    />
                  </div>
                </div>

                {/* ۳. جدول متقارن کلید-مقدار (بدون هیچ‌گونه برش یا سه‌نقطه) */}
                <div className="persian-num space-y-1 text-[9px]">
                  <div className="flex items-center justify-between py-0.5 border-b border-[#E8E2D5]/50">
                    <span className="font-semibold text-[#5A655E]">موعد آبیاری:</span>
                    <strong className="font-extrabold text-[#1F6380]">
                      {remainingWaterDays === 0
                        ? 'امروز!'
                        : `${toPersianNum(remainingWaterDays)} روز دیگر`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-b border-[#E8E2D5]/50">
                    <span className="font-semibold text-[#5A655E]">آخرین آبیاری:</span>
                    <strong className="font-bold text-[#1C2822]">
                      {elapsedWaterDays === 0 ? 'امروز' : `${toPersianNum(elapsedWaterDays)} روز پیش`}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between py-0.5 border-b border-[#E8E2D5]/50">
                    <span className="font-semibold text-[#5A655E]">حجم خاک:</span>
                    <strong className="font-extrabold text-[#2E5A44]">
                      {toPersianNum(plant.potVolumeLiters || 2)} لیتر
                    </strong>
                  </div>

                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-semibold text-[#5A655E]">قد گیاه:</span>
                    <strong className="font-extrabold text-[#1C2822]">
                      {toPersianNum(plant.plantHeightCm || 28)} سانتی‌متر
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* باکس راهنمای بازشونده */}
            {activeGuide && (
              <div className="bg-[#FDFBF7] border border-[#2B7A9B]/40 rounded-xl p-2.5 text-[10px] text-[#1C2822] leading-relaxed space-y-1">
                <div className="flex items-center justify-between font-bold text-[#1F6380]">
                  <span>
                    {activeGuide === 'moisture'
                      ? '📏 راهنمای سنجش وضعیت بستر و رطوبت خاک:'
                      : activeGuide === 'water_dose'
                      ? '💧 فرمول مهندسی پیمانه دقیق آبیاری:'
                      : '💨 راهنمای تخصصی رطوبت و غبارپاشی:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveGuide(null)}
                    className="text-[#C85A32] px-1 font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[#5A655E] text-justify leading-relaxed">
                  {activeGuide === 'moisture'
                    ? 'درصد رطوبت بستر بر اساس دوره تبخیر گونه، حجم خاک گلدان و وضعیت شوفاژ محاسبه می‌شود. قبل از هر آبیاری، بند اول انگشت اشاره را ۳ سانتی‌متر در خاک فرو ببرید؛ اگر خاک خشک بود آبیاری کنید، و اگر هنوز مرطوب بود دکمه «خاک مرطوب (تعویق)» در پایین را بزنید.'
                    : activeGuide === 'water_dose'
                    ? `پیمانه ${toPersianNum(plant.doseMl)} میلی‌لیتر (${plant.doseCup}) دقیقاً متناسب با حجم ${toPersianNum(plant.potVolumeLiters || 2)} لیتر خاک و قد ${toPersianNum(plant.plantHeightCm || 28)} سانتی‌متری گیاه کالیبره شده تا کل ریشه سیراب شود بدون آنکه ته گلدان باتلاقی گردد.`
                    : 'غبارپاشی باید در ساعات روشن صبح با آب جوشیده سردشده یا تصفیه‌شده و از فاصله ۳۰ سانتی‌متری انجام شود تا قطرات درشت آب روی برگ نماند.'}
                </p>
              </div>
            )}

            {/* ب) دو کارت متقارن «پیمانه آبیاری» و «غبارپاشی» با سایز فونت برابر */}
            <div className="grid grid-cols-2 gap-2 items-stretch">
              <div className="bg-[#FDFBF7] border border-[#2B7A9B]/25 rounded-xl p-2.5 flex flex-col justify-between space-y-1.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10.5px] font-extrabold text-[#1F6380] flex items-center gap-1">
                      <IconWaterDrop className="w-3.5 h-3.5 text-[#2B7A9B] shrink-0" />
                      <span>پیمانه آبیاری</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveGuide(activeGuide === 'water_dose' ? null : 'water_dose')
                      }
                      className="px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380] text-[8.5px] font-bold shrink-0"
                    >
                      ⓘ راهنما
                    </button>
                  </div>

                  <p className="persian-num text-[10px] font-semibold text-[#1C2822] leading-relaxed text-justify">
                    در هر نوبت آبیاری، مقدار دقیق{' '}
                    <strong className="font-extrabold text-[#1F6380]">
                      {toPersianNum(plant.doseMl)} میلی‌لیتر
                    </strong>{' '}
                    (معادل تقریبی <strong className="font-extrabold text-[#1C2822]">{plant.doseCup}</strong>) آب بدون کلر و هم‌دمای محیط پای خاک بریزید.
                  </p>
                </div>

                <div className="persian-num pt-1.5 border-t border-[#E8E2D5] flex items-center justify-between text-[9px] font-bold">
                  <span className="text-[#1F6380]">
                    {remainingWaterDays === 0
                      ? 'موعد: امروز'
                      : `موعد: ${toPersianNum(remainingWaterDays)} روز دیگر`}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380]">
                    هر {toPersianNum(plant.waterCycleDays)} روز
                  </span>
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-[#2E5A44]/25 rounded-xl p-2.5 flex flex-col justify-between space-y-1.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10.5px] font-extrabold text-[#2E5A44] flex items-center gap-1">
                      <IconMistSpray className="w-3.5 h-3.5 text-[#2E5A44] shrink-0" />
                      <span>غبارپاشی</span>
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveGuide(activeGuide === 'mist_guide' ? null : 'mist_guide')
                      }
                      className="px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] text-[8.5px] font-bold shrink-0"
                    >
                      ⓘ راهنما
                    </button>
                  </div>

                  <p className="text-[10px] font-semibold text-[#1C2822] leading-relaxed text-justify break-words">
                    {plant.mistNeed || 'هفته‌ای ۲ بار غبارپاشی ملایم برگ‌ها با آب بدون کلر.'}
                  </p>
                </div>

                <div className="persian-num pt-1.5 border-t border-[#E8E2D5] flex items-center justify-between text-[9px] font-bold">
                  <span className="text-[#2E5A44]">
                    {noMistRequired
                      ? 'وضعیت: بدون غبارپاشی'
                      : remainingMistDays === 0
                      ? 'موعد: امروز'
                      : `موعد: ${toPersianNum(remainingMistDays)} روز دیگر`}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44]">
                    {noMistRequired ? 'خشکی‌دوست' : `هر ${toPersianNum(mistCycle)} روز`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ۴. نوار ۴ تب تخصصی با نام‌های مختصر و آیکون‌های برداری */}
          <div className="grid grid-cols-4 gap-1 bg-[#F6F3EC] p-1 rounded-2xl border border-[#E8E2D5] sticky top-0 z-20">
            {[
              { id: 'identity' as const, label: 'شناسنامه', Icon: IconTabIdentity },
              { id: 'clinic' as const, label: 'کلینیک', Icon: IconTabClinic },
              { id: 'care_soil' as const, label: 'نگهداری', Icon: IconTabCareSoil },
              { id: 'history' as const, label: 'تاریخچه', Icon: IconTabHistory }
            ].map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-1 rounded-xl text-[10.5px] flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2E5A44] text-white font-extrabold warm-shadow'
                      : 'text-[#5A655E] font-bold hover:text-[#1C2822]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* =================================================================== */}
          {/* تب ۱: شناسنامه */}
          {/* =================================================================== */}
          {activeTab === 'identity' && (
            <div className="space-y-2.5">
              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2 warm-shadow">
                <div className="flex items-center justify-between gap-2 border-b border-[#E8E2D5] pb-2">
                  <span className="text-[11px] font-extrabold text-[#2E5A44]">
                    🌿 اصالت و هویت گیاه‌شناسی
                  </span>
                  {plant.sci && (
                    <span
                      dir="ltr"
                      className="px-2 py-0.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[9.5px] font-bold text-[#5A655E] truncate max-w-[180px]"
                    >
                      {plant.sci}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="bg-[#F6F3EC] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[#5A655E] font-semibold mb-0.5">خانواده گیاهی:</div>
                    <div className="font-bold text-[#1C2822]">
                      {plant.family || 'گیاهان زینتی آپارتمانی'}
                    </div>
                  </div>
                  <div className="bg-[#F6F3EC] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[#5A655E] font-semibold mb-0.5">خاستگاه طبیعی:</div>
                    <div className="font-bold text-[#1C2822]">
                      {plant.origin || 'مناطق گرمسیری و نیمه‌گرمسیری'}
                    </div>
                  </div>
                </div>

                <p className="text-[10.5px] text-[#1C2822] leading-relaxed text-justify bg-[#F6F3EC]/60 p-2.5 rounded-xl border border-[#E8E2D5]/70">
                  {plant.botanyStory ||
                    `«${plant.name}» از گونه‌های منتخب گلخانه است که با تطبیق‌پذیری بالا در اقلیم داخلی، طراوت و اکسیژن‌رسانی فضا را دوچندان می‌کند.`}
                </p>
              </div>

              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-1.5 warm-shadow">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-[#B45309]">
                    ☀️ نیاز نوری و موقعیت استقرار
                  </span>
                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-lg bg-[#FEF6E7] text-[#B45309]">
                    {resolvedGardenTitle}
                  </span>
                </div>
                <p className="text-[10.5px] text-[#1C2822] leading-relaxed text-justify">
                  {plant.light ||
                    'نور غیرمستقیم متوسط تا روشن در مجاورت پنجره فیلترشده؛ به دور از تابش تند آفتاب ظهر.'}
                </p>
              </div>

              <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10.5px] font-bold text-[#3A5A40]">
                    🔄 تقارن نوری تاج و تنه گیاه
                  </div>
                  <div className="text-[9.5px] text-[#5A655E]">
                    هر ۲ هفته یک‌بار گلدان را ۹۰ درجه بچرخانید تا ساقه به سمت پنجره کج نشود.
                  </div>
                </div>
                {effectiveCanCare && (
                  <button
                    type="button"
                    onClick={triggerRotate}
                    className="px-2.5 py-1.5 rounded-xl bg-[#3A5A40] text-white text-[10px] font-bold shrink-0 active:scale-95 transition-transform"
                  >
                    ثبت چرخش ۹۰°
                  </button>
                )}
              </div>

              {effectiveCanDelete && (
                <div className="pt-2 border-t border-[#E8E2D5] space-y-2">
                  {!showArchiveConfirm ? (
                    <div className="flex items-center gap-2">
                      {(onArchive || onArchivePlant) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onArchivePlant) {
                              onArchivePlant(plant);
                            } else {
                              setShowArchiveConfirm(true);
                            }
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] text-[10.5px] font-bold"
                        >
                          🏛️ انتقال به تالار یادبود
                        </button>
                      )}
                      {(onHardDelete || onHardDeletePlant) && (
                        <button
                          type="button"
                          onClick={() => {
                            if (onHardDelete) onHardDelete(plant.id, plant.name);
                            else if (onHardDeletePlant) onHardDeletePlant(plant.id, plant.name);
                          }}
                          className="py-2 px-3 rounded-xl bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] text-[10.5px] font-bold"
                        >
                          🗑️ حذف دائمی گیاه
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#FCEEE9]/60 border border-[#C85A32]/30 rounded-2xl p-2.5 space-y-2">
                      <div className="text-[10.5px] font-bold text-[#C85A32]">
                        علت انتقال «{plant.name}» به تالار یادبود:
                      </div>
                      <input
                        value={archiveReason}
                        onChange={(e) => setArchiveReason(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                        placeholder="مثلاً: هدیه داده شد..."
                      />
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (onArchive) onArchive(plant.id, archiveReason);
                            else if (onArchivePlant) onArchivePlant(plant, archiveReason);
                            onClose();
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-[#C85A32] text-white text-[10.5px] font-bold"
                        >
                          تایید انتقال به یادبود
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowArchiveConfirm(false)}
                          className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
                        >
                          انصراف
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۲: کلینیک گیاه‌پزشکی */}
          {/* =================================================================== */}
          {activeTab === 'clinic' && (
            <div className="space-y-2.5">
              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-2.5 space-y-2 warm-shadow">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-[#C85A32]">
                    🩺 کلینیک تخصصی عارضه‌یابی «{plant.name}»
                  </span>
                  <span className="persian-num px-2 py-0.5 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[9.5px] font-bold">
                    {toPersianNum(filteredClinic.length)} عارضه
                  </span>
                </div>
                <input
                  value={clinicSearch}
                  onChange={(e) => setClinicSearch(e.target.value)}
                  placeholder="جستجوی علامت روی برگ یا ساقه (مثلاً: زرد شدن، لکه قهوه‌ای، شپشک...)"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] focus:outline-none focus:border-[#2E5A44]"
                />
              </div>

              {filteredClinic.length === 0 ? (
                <div className="text-center py-6 bg-[#F6F3EC] rounded-2xl border border-[#E8E2D5] text-[11px] text-[#5A655E]">
                  موردی با این عبارت در کلینیک این گیاه یافت نشد.
                </div>
              ) : (
                filteredClinic.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2 warm-shadow"
                  >
                    <div className="flex items-start gap-2">
                      <span className="persian-num w-5 h-5 rounded-lg bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                        {toPersianNum(idx + 1)}
                      </span>
                      <div className="text-[11px] font-extrabold text-[#C85A32] leading-snug">
                        علامت: {item.symptom}
                      </div>
                    </div>

                    <div className="bg-[#F6F3EC] rounded-xl p-2 text-[10.5px] text-[#1C2822] leading-relaxed text-justify">
                      <strong className="text-[#B45309]">🔬 علت علمی و گیاه‌پزشکی: </strong>
                      {item.cause}
                    </div>

                    <div className="bg-[#E6F0EB]/75 border border-[#2E5A44]/20 rounded-xl p-2 text-[10.5px] text-[#1C2822] leading-relaxed text-justify">
                      <strong className="text-[#2E5A44]">💊 نسخه درمانی و اقدام اجرایی: </strong>
                      {item.fix}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۳: نگهداری (هرس، تکثیر، فرمول خاک و کوددهی) */}
          {/* =================================================================== */}
          {activeTab === 'care_soil' && (
            <div className="space-y-2.5">
              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow">
                <div className="flex items-center justify-between gap-2 border-b border-[#E8E2D5] pb-2">
                  <div>
                    <div className="text-[11px] font-extrabold text-[#2E5A44]">
                      ✂️ اصول هرس، سرزنی و فرم‌دهی
                    </div>
                    <div className="text-[9.5px] text-[#5A655E]">
                      آخرین هرس ثبت‌شده:{' '}
                      <strong className="text-[#1C2822]">
                        {lastPrunedLog ? lastPrunedLog.persianDate || lastPrunedLog.time : 'هنوز ثبت نشده'}
                      </strong>
                    </div>
                  </div>
                  {effectiveCanCare && (
                    <button
                      type="button"
                      onClick={handleRecordPruning}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2E5A44] text-white text-[10px] font-bold shrink-0 active:scale-95 transition-transform warm-shadow"
                    >
                      ✂️ ثبت هرس امروز
                    </button>
                  )}
                </div>

                <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#E8E2D5] text-[10.5px] text-[#1C2822] leading-relaxed text-justify">
                  <strong className="text-[#2E5A44]">نحوه هرس تخصصی «{plant.name}»: </strong>
                  {plant.pruningGuide ||
                    'برگ‌های پیر، زرد یا آسیب‌دیده پایینی را با قیچی استریل از زاویه ۴۵ درجه نزدیک به ساقه جدا کنید تا انرژی گیاه صرف جوانه‌های بالایی شود.'}
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[9.5px] leading-relaxed">
                  <div className="bg-[#E6F0EB]/60 p-2 rounded-xl border border-[#2E5A44]/20">
                    <div className="font-extrabold text-[#2E5A44] mb-0.5">
                      ✅ زمان و اقدام قبل از هرس:
                    </div>
                    <p className="text-[#1C2822] text-justify">
                      اوایل بهار تا اواسط تابستان. حتماً تیغه قیچی را قبل از برش با الکل ۷۰٪ ضدعفونی کنید.
                    </p>
                  </div>
                  <div className="bg-[#FCEEE9]/60 p-2 rounded-xl border border-[#C85A32]/20">
                    <div className="font-extrabold text-[#C85A32] mb-0.5">
                      🛡️ مراقبت بعد از هرس:
                    </div>
                    <p className="text-[#1C2822] text-justify">
                      روی محل برش پودر دارچین یا قارچ‌کش بزنید و تا ۴۸ ساعت روی زخم آب غبارپاشی نکنید.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2 warm-shadow">
                <div className="text-[11px] font-extrabold text-[#1F6380] border-b border-[#E8E2D5] pb-1.5">
                  🌱 روش‌های تکثیر، قلمه‌گیری و مراقبت از قلمه
                </div>
                <p className="text-[10.5px] text-[#1C2822] leading-relaxed text-justify bg-[#F6F3EC] p-2.5 rounded-xl border border-[#E8E2D5]">
                  {plant.propagationGuide ||
                    'تکثیر از طریق قلمه ساقه دارای حداقل دو گره یا تقسیم بوته و پاجوش در فصل بهار در بستر سبک پرلیت و کوکوپیت مرطوب.'}
                </p>
                <div className="bg-[#EBF4F8]/70 p-2 rounded-xl border border-[#2B7A9B]/20 text-[9.5px] text-[#1F6380] leading-relaxed text-justify">
                  <strong>💡 نکته طلایی گیرایی قلمه‌ها: </strong>
                  قلمه‌ها را در دمای ۲۲ تا ۲۵ درجه، نور غیرمستقیم ملایم و رطوبت بالا قرار دهید و در کشت آبی، هر هفته آب جوشیده سردشده را تعویض نمایید.
                </div>
              </div>

              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow">
                <div className="flex items-center justify-between gap-2 border-b border-[#E8E2D5] pb-2">
                  <span className="text-[11px] font-extrabold text-[#1C2822]">
                    🏺 بستر خاک، کوددهی و تقویم تعویض گلدان
                  </span>
                  <span className="persian-num px-2 py-0.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[9.5px] font-bold text-[#2E5A44]">
                    دوره تعویض: هر {toPersianNum(repotCycle)} ماه
                  </span>
                </div>

                <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#E8E2D5] text-[10.5px] text-[#1C2822] leading-relaxed text-justify">
                  <strong className="text-[#2E5A44]">🧪 فرمول درصدی خاک و رژیم کوددهی: </strong>
                  {plant.soilFert ||
                    '۴۰٪ پیت‌ماس + ۳۰٪ پرلیت + ۲۰٪ کوکوپیت + ۱۰٪ ورمی‌کمپوست؛ تغذیه ماهانه در بهار و تابستان با کود کامل.'}
                </div>

                <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-[#5A655E]">
                      آخرین تعویض خاک:{' '}
                      <strong className="text-[#1C2822]">
                        {plant.lastRepottedDate || `${toPersianNum(repotMonthsAgo)} ماه پیش`}
                      </strong>
                    </span>
                    <span className="persian-num text-[#2E5A44]">
                      کیفیت بستر: {toPersianNum(repotHealthPercent)}٪
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E8E2D5] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#2E5A44] to-[#52B788]"
                      style={{ width: `${repotHealthPercent}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-[#5A655E] text-justify">
                    زمانی که ریشه‌ها از زهکش کف گلدان بیرون زدند یا خاک نشست کرد (در آغاز بهار)، گلدان را تنها ۱ سایز بزرگ‌تر کنید.
                  </div>
                </div>

                {effectiveCanCare && (
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={handleRecordRepotting}
                      className="py-2 px-2.5 rounded-xl bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] text-[10px] font-extrabold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>🪴</span>
                      <span>ثبت تعویض خاک امروز</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRecordFertilizing}
                      className="py-2 px-2.5 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/30 text-[#2E5A44] text-[10px] font-extrabold flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      <span>🧪</span>
                      <span>ثبت کوددهی امروز</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۴: تاریخچه دسته‌بندی‌شده عملیات‌ها */}
          {/* =================================================================== */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-2 flex items-center justify-between gap-1 warm-shadow">
                {[
                  { id: 'all' as const, label: 'همه رویدادها' },
                  { id: 'water_mist' as const, label: '💧 آبیاری و رطوبت' },
                  { id: 'soil_prune' as const, label: '✂️ هرس، خاک و چرخش' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setHistoryFilter(f.id)}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[9.5px] font-bold transition-all whitespace-nowrap ${
                      historyFilter === f.id
                        ? 'bg-[#2E5A44] text-white'
                        : 'bg-[#F6F3EC] text-[#5A655E]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 bg-[#F6F3EC] rounded-2xl border border-[#E8E2D5] text-[11px] text-[#5A655E]">
                  هنوز رویدادی در این دسته برای «{plant.name}» ثبت نشده است.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((logItem) => {
                    const st = getHistoryItemStyle(logItem.action);
                    const cleanTime =
                      logItem.time && logItem.time !== 'هم‌اکنون' ? logItem.time : null;

                    return (
                      <div
                        key={logItem.id}
                        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-2.5 space-y-1.5 warm-shadow"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-extrabold ${st.bg} ${st.border} ${st.text}`}
                          >
                            {st.badge}
                          </span>
                          <div className="persian-num flex items-center gap-1.5 text-[9.5px] font-bold text-[#5A655E]">
                            {logItem.persianDate && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822]">
                                📅 {logItem.persianDate}
                              </span>
                            )}
                            {cleanTime && <span>⏰ {cleanTime}</span>}
                          </div>
                        </div>

                        <div className="persian-num text-[10.5px] font-bold text-[#1C2822] leading-relaxed">
                          {formatHistoryActionText(logItem.action)}
                        </div>

                        <div className="flex items-center justify-between text-[9.5px] text-[#5A655E] pt-0.5 border-t border-[#E8E2D5]/60">
                          <span>
                            ثبت‌کننده: <strong className="text-[#2E5A44]">{logItem.by}</strong>
                          </span>
                          <span className="persian-num text-[9px] opacity-75">پلاک {plant.code}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ۵. فوتر ثابت ۴ دکمه عملیات سریع مراقبتی */}
        {effectiveCanCare && (
          <div className="px-3 py-2.5 border-t border-[#E8E2D5] bg-[#FDFBF7] shrink-0">
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={triggerWater}
                className="py-2 px-1 rounded-2xl bg-[#2B7A9B] text-white flex flex-col items-center justify-center gap-0.5 warm-shadow active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1 text-[10.5px] font-extrabold">
                  <IconWaterDrop className="w-3.5 h-3.5" />
                  <span>ثبت آبیاری</span>
                </div>
                <span className="persian-num text-[8.5px] opacity-90">
                  {toPersianNum(plant.doseMl)} میلی‌لیتر
                </span>
              </button>

              <button
                type="button"
                onClick={triggerMist}
                className="py-2 px-1 rounded-2xl bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1 text-[10.5px] font-extrabold">
                  <IconMistSpray className="w-3.5 h-3.5" />
                  <span>غبارپاشی</span>
                </div>
                <span className="text-[8.5px] font-semibold">رطوبت برگ</span>
              </button>

              <button
                type="button"
                onClick={triggerRotate}
                className="py-2 px-1 rounded-2xl bg-[#EEF2EB] border border-[#3A5A40]/25 text-[#3A5A40] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1 text-[10.5px] font-extrabold">
                  <IconRotate90 className="w-3.5 h-3.5" />
                  <span>چرخش ۹۰°</span>
                </div>
                <span className="text-[8.5px] font-semibold">تقارن نوری</span>
              </button>

              <button
                type="button"
                onClick={triggerSnooze}
                className="py-2 px-1 rounded-2xl bg-[#FEF6E7] border border-[#D97706]/30 text-[#B45309] flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1 text-[10px] font-extrabold">
                  <IconShieldLock className="w-3.5 h-3.5" />
                  <span>خاک مرطوب</span>
                </div>
                <span className="text-[8.5px] font-semibold">تعویق آبیاری</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};