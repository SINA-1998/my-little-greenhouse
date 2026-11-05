import React, { useState, useEffect } from 'react';
import {
  type SpaceEntity,
  type GardenEntity,
  type MemberEntity,
  type MemberRole,
  type MemberPermissions,
  type PlantEntity,
  getDefaultMemberPermissions
} from '../../data/initialPlants';
import {
  type CloudConfig,
  type TelegramBotSubscriber,
  copyTextSafe,
  fetchRecentBotSubscribers,
  fetchTelegramBotUsername,
  sendScheduledEscalationReport,
  requestBrowserPushPermission
} from '../../services/cloudSyncService';
import { getGeminiApiKey, saveGeminiApiKey } from '../../services/aiPlantService';

const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// ============================================================================
// آیکون‌های برداری مینیمال و اختصاصی برای هدر و ۴ تب مرکز مدیریت
// ============================================================================
const IconTabMembers: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTabGardens: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 22V12h6v10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTabTelegram: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconTabSystem: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <ellipse cx="12" cy="5" rx="9" ry="3" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const SPACE_ICON_OPTIONS = ['🏡', '🏢', '🌿', '☀️', '🪴', '🌸', '🌵', '🌳'];

const ROLE_OPTIONS: Array<{
  id: MemberRole;
  label: string;
  shortDesc: string;
  badgeClass: string;
}> = [
  {
    id: 'caretaker',
    label: '🤝 همیار مراقبت',
    shortDesc: 'ثبت آبیاری، غبارپاشی و چرخش',
    badgeClass: 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/25'
  },
  {
    id: 'viewer',
    label: '👁️ بازدیدکننده',
    shortDesc: 'مشاهده شناسنامه (فقط خواندنی)',
    badgeClass: 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/25'
  },
  {
    id: 'space_admin',
    label: '🏡 مدیر گلخانه',
    shortDesc: 'مدیریت کامل گیاهان و باغچه‌ها',
    badgeClass: 'bg-[#EEF2EB] text-[#3A5A40] border-[#3A5A40]/25'
  },
  {
    id: 'super_admin',
    label: '👑 مالک ارشد',
    shortDesc: 'دسترسی کامل به کل سیستم و اعضا',
    badgeClass: 'bg-[#FEF6E7] text-[#B45309] border-[#D97706]/30'
  }
];

const LIGHT_OPTIONS: Array<{
  id: 'high' | 'medium' | 'low';
  label: string;
  sub: string;
}> = [
  { id: 'high', label: '☀️ نور زیاد', sub: 'پنجره آفتاب‌گیر' },
  { id: 'medium', label: '⛅ نور متوسط', sub: 'روشنایی فیلترشده' },
  { id: 'low', label: '🌥️ نور کم', sub: 'سایه و فاصله از پنجره' }
];

const PERMISSION_ITEMS: Array<{
  key: keyof MemberPermissions;
  label: string;
}> = [
  { key: 'canWaterAndMist', label: '💧 ثبت آبیاری و غبار' },
  { key: 'canEditPlants', label: '🌱 افزودن/ویرایش گیاه' },
  { key: 'canManageSpaces', label: '🔥 شوفاژ و باغچه‌ها' },
  { key: 'canDelete', label: '🗑️ مجوز حذف گلدان' }
];

interface SettingsAndMembersModalProps {
  isOpen: boolean;
  isSuperAdmin: boolean;
  currentSpace: SpaceEntity;
  spaces: SpaceEntity[];
  gardens: GardenEntity[];
  members: MemberEntity[];
  plants: PlantEntity[];
  cloudConfig: CloudConfig;
  onClose: () => void;
  onUpdateSpaces: (spaces: SpaceEntity[]) => void;
  onDeleteSpace: (spaceId: string) => void;
  onUpdateGardens: (gardens: GardenEntity[]) => void;
  onDeleteGarden: (gardenId: string) => void;
  onUpdateMembers: (members: MemberEntity[]) => void;
  onUpdateCloudConfig: (cfg: CloudConfig) => void;
  onRestoreBackup: (data: {
    spaces: SpaceEntity[];
    gardens: GardenEntity[];
    plants: PlantEntity[];
    members: MemberEntity[];
  }) => void;
  onResetGreenhouse?: (mode: 'plants_only' | 'full_zero') => void;
  onSwitchPreviewRole: (role: 'owner' | 'caretaker' | 'visitor', memberId?: string) => void;
}

type ManagementTabKey = 'members' | 'spaces' | 'telegram' | 'system';

export const SettingsAndMembersModal: React.FC<SettingsAndMembersModalProps> = ({
  isOpen,
  isSuperAdmin,
  currentSpace,
  spaces,
  gardens,
  members,
  plants,
  cloudConfig,
  onClose,
  onUpdateSpaces,
  onDeleteSpace,
  onUpdateGardens,
  onDeleteGarden,
  onUpdateMembers,
  onUpdateCloudConfig,
  onRestoreBackup,
  onResetGreenhouse,
  onSwitchPreviewRole
}) => {
  const [activeTab, setActiveTab] = useState<ManagementTabKey>('members');

  // استیت‌های فرم تعریف عضو جدید (به صورت کشوی بازشونده تمیز)
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState<MemberRole>('caretaker');
  const [memberSpaces, setMemberSpaces] = useState<string[]>([currentSpace.id]);
  const [memberGardens, setMemberGardens] = useState<string[]>([]);
  const [memberPinCode, setMemberPinCode] = useState('');
  const [memberPermissions, setMemberPermissions] = useState<MemberPermissions>(() =>
    getDefaultMemberPermissions('caretaker')
  );
  const [memberChatId, setMemberChatId] = useState('');
  const [notifyAlerts, setNotifyAlerts] = useState(true);
  const [notifyActions, setNotifyActions] = useState(true);

  const [expandedPermMemberId, setExpandedPermMemberId] = useState<string | null>(null);

  const [botUsername, setBotUsername] = useState<string>(
    cloudConfig.telegramBotUsername || ''
  );
  const [botSubscribers, setBotSubscribers] = useState<TelegramBotSubscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [subFeedback, setSubFeedback] = useState<string | null>(null);

  const [activeInviteMember, setActiveInviteMember] = useState<MemberEntity | null>(null);
  const [copiedFlag, setCopiedFlag] = useState<'bot' | 'app' | null>(null);

  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceIcon, setNewSpaceIcon] = useState('🏡');
  const [newGardenName, setNewGardenName] = useState('');
  const [newGardenLight, setNewGardenLight] = useState<'high' | 'medium' | 'low'>('high');

  const [editingGardenId, setEditingGardenId] = useState<string | null>(null);
  const [editingGardenName, setEditingGardenName] = useState('');
  const [editingGardenLight, setEditingGardenLight] = useState<'high' | 'medium' | 'low'>('high');

  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [editingSpaceName, setEditingSpaceName] = useState('');
  const [editingSpaceIcon, setEditingSpaceIcon] = useState('🌿');

  const [geminiKey, setGeminiKey] = useState<string>(() => getGeminiApiKey());

  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    message: string | null;
    isError: boolean;
  }>({ loading: false, message: null, isError: false });

  useEffect(() => {
    if (!isOpen) return;
    setMemberSpaces((prev) => (prev.length > 0 ? prev : [currentSpace.id]));

    fetchTelegramBotUsername(cloudConfig.telegramBotToken).then((uname) => {
      if (uname) {
        setBotUsername(uname);
        if (uname !== cloudConfig.telegramBotUsername) {
          onUpdateCloudConfig({ ...cloudConfig, telegramBotUsername: uname });
        }
      }
    });

    fetchRecentBotSubscribers(cloudConfig.telegramBotToken).then((subs) => {
      if (subs.length === 0) return;
      let autoBoundCount = 0;
      const updated = members.map((m) => {
        const matchedByInvite = subs.find((s) => s.invitedMemberId === m.id);
        if (matchedByInvite && m.telegramChatId !== matchedByInvite.chatId) {
          autoBoundCount++;
          return {
            ...m,
            telegramChatId: matchedByInvite.chatId,
            telegramUsername: matchedByInvite.username
          };
        }
        return m;
      });
      if (autoBoundCount > 0) {
        onUpdateMembers(updated);
        setSubFeedback(
          `🎉 تلگرام ${toPersianNum(autoBoundCount)} عضو جدید به صورت خودکار از طریق لینک دعوت متصل شد!`
        );
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const visibleMembers = isSuperAdmin
    ? members
    : members.filter((m) => m.assignedSpaces.includes(currentSpace.id));

  const spaceGardens = gardens.filter((g) => (g.spaceId || 'office') === currentSpace.id);

  const candidateGardensForNewMember = gardens.filter((g) =>
    memberSpaces.includes(g.spaceId || 'office')
  );

  const toggleSpaceSelection = (spaceId: string) => {
    if (memberSpaces.includes(spaceId)) {
      if (memberSpaces.length > 1) {
        const nextSpaces = memberSpaces.filter((id) => id !== spaceId);
        setMemberSpaces(nextSpaces);
        setMemberGardens((prev) =>
          prev.filter((gid) => {
            const gObj = gardens.find((x) => x.id === gid);
            return gObj && nextSpaces.includes(gObj.spaceId || 'office');
          })
        );
      }
    } else {
      setMemberSpaces([...memberSpaces, spaceId]);
    }
  };

  const toggleGardenSelectionForNewMember = (gardenId: string) => {
    if (memberGardens.includes(gardenId)) {
      setMemberGardens(memberGardens.filter((id) => id !== gardenId));
    } else {
      setMemberGardens([...memberGardens, gardenId]);
    }
  };

  const buildMemberAppUrl = (member: MemberEntity): string => {
    const targetSpace = member.assignedSpaces[0] || currentSpace.id;
    const effectivePerms = member.permissions || getDefaultMemberPermissions(member.role);
    const roleMode =
      member.role === 'super_admin' || member.role === 'space_admin'
        ? 'admin'
        : member.role === 'viewer' || !effectivePerms.canWaterAndMist
        ? 'visitor'
        : 'guest';
    return `${window.location.origin}${window.location.pathname}?space=${targetSpace}&member=${member.id}&mode=${roleMode}`;
  };

  const buildMemberBotInviteUrl = (member: MemberEntity): string => {
    const cleanUname = (botUsername || cloudConfig.telegramBotUsername || '')
      .replace('@', '')
      .trim();
    if (!cleanUname) return '';
    return `https://t.me/${cleanUname}?start=join_${member.id}`;
  };

  const handleRoleChangeForNewMember = (newRole: MemberRole) => {
    setMemberRole(newRole);
    setMemberPermissions(getDefaultMemberPermissions(newRole));
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const effectiveRole: MemberRole = isSuperAdmin ? memberRole : 'caretaker';
    const newMember: MemberEntity = {
      id: 'mem_' + Date.now(),
      name: memberName.trim(),
      role: effectiveRole,
      assignedSpaces: isSuperAdmin ? memberSpaces : [currentSpace.id],
      assignedGardens: memberGardens.length > 0 ? memberGardens : [],
      pinCode: memberPinCode.replace(/\D/g, '').slice(0, 4) || undefined,
      permissions: memberPermissions,
      telegramChatId: memberChatId.trim(),
      notifyAlerts,
      notifyActions,
      active: true
    };

    onUpdateMembers([...members, newMember]);
    setMemberName('');
    setMemberChatId('');
    setMemberPinCode('');
    setMemberGardens([]);
    setShowAddMemberForm(false);
    setActiveInviteMember(newMember);
    setCopiedFlag(null);
  };

  const handleUpdateExistingMember = (
    memberId: string,
    patch: Partial<MemberEntity>
  ) => {
    onUpdateMembers(
      members.map((m) => (m.id === memberId ? { ...m, ...patch } : m))
    );
  };

  const handleToggleExistingMemberPerm = (
    member: MemberEntity,
    permKey: keyof MemberPermissions
  ) => {
    if (member.id === 'm_owner_sina') return;
    const currentPerms = member.permissions || getDefaultMemberPermissions(member.role);
    const updatedPerms: MemberPermissions = {
      ...currentPerms,
      [permKey]: !currentPerms[permKey]
    };
    handleUpdateExistingMember(member.id, { permissions: updatedPerms });
  };

  const handleToggleExistingMemberSpace = (member: MemberEntity, spaceId: string) => {
    const hasSpace = member.assignedSpaces.includes(spaceId);
    if (hasSpace && member.assignedSpaces.length <= 1) return;
    const nextSpaces = hasSpace
      ? member.assignedSpaces.filter((id) => id !== spaceId)
      : [...member.assignedSpaces, spaceId];
    const validGardens = (member.assignedGardens || []).filter((gid) => {
      const gObj = gardens.find((x) => x.id === gid);
      return gObj && nextSpaces.includes(gObj.spaceId || 'office');
    });
    handleUpdateExistingMember(member.id, {
      assignedSpaces: nextSpaces,
      assignedGardens: validGardens
    });
  };

  const handleToggleExistingMemberGarden = (member: MemberEntity, gardenId: string) => {
    const currentGardens = member.assignedGardens || [];
    const nextGardens = currentGardens.includes(gardenId)
      ? currentGardens.filter((id) => id !== gardenId)
      : [...currentGardens, gardenId];
    handleUpdateExistingMember(member.id, { assignedGardens: nextGardens });
  };

  const handleOpenInviteSheet = async (member: MemberEntity, autoCopyType?: 'bot' | 'app') => {
    setActiveInviteMember(member);
    setCopiedFlag(null);

    let currentUname = (botUsername || cloudConfig.telegramBotUsername || '')
      .replace('@', '')
      .trim();
    if (!currentUname && cloudConfig.telegramBotToken) {
      const fetched = await fetchTelegramBotUsername(cloudConfig.telegramBotToken);
      if (fetched) {
        currentUname = fetched;
        setBotUsername(fetched);
        onUpdateCloudConfig({ ...cloudConfig, telegramBotUsername: fetched });
      }
    }

    if (autoCopyType === 'app') {
      const appUrl = buildMemberAppUrl(member);
      await copyTextSafe(appUrl);
      setCopiedFlag('app');
    } else if (autoCopyType === 'bot' && currentUname) {
      const botUrl = `https://t.me/${currentUname}?start=join_${member.id}`;
      await copyTextSafe(botUrl);
      setCopiedFlag('bot');
    }
  };

  const handleShareViaTelegramApp = (url: string, text: string) => {
    const tgShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    window.open(tgShareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeMobileShare = async (title: string, text: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // انصراف کاربر
      }
    }
    await copyTextSafe(`${text}\n${url}`);
    alert('✅ لینک دعوت در حافظه کپی شد!');
  };

  const handleDetectTelegramUsers = async () => {
    setLoadingSubs(true);
    setSubFeedback(null);
    const list = await fetchRecentBotSubscribers(cloudConfig.telegramBotToken);
    setLoadingSubs(false);
    setBotSubscribers(list);

    const boundNames: string[] = [];
    const updated = members.map((m) => {
      const matched = list.find((s) => s.invitedMemberId === m.id);
      if (matched && m.telegramChatId !== matched.chatId) {
        boundNames.push(m.name);
        return { ...m, telegramChatId: matched.chatId, telegramUsername: matched.username };
      }
      return m;
    });

    if (boundNames.length > 0) {
      onUpdateMembers(updated);
      setSubFeedback(
        `✅ آیدی تلگرام «${boundNames.join('، ')}» به صورت خودکار شناسایی و متصل شد!`
      );
    } else if (list.length === 0) {
      setSubFeedback(
        '⚠️ هنوز پیامی در ربات یافت نشد. روی «🤖 دعوت ربات» کنار نام عضو بزنید تا در تلگرام Start بزند.'
      );
    } else {
      setSubFeedback(
        `🔍 ${toPersianNum(list.length)} کاربر در ربات یافت شد. از لیست زیر آیدی را به عضو مورد نظر متصل کنید.`
      );
    }
  };

  const handleToggleMemberActive = (id: string) => {
    if (id === 'm_owner_sina') {
      alert('حساب مالک ارشد همواره فعال است.');
      return;
    }
    onUpdateMembers(members.map((m) => (m.id === id ? { ...m, active: !m.active } : m)));
  };

  const handleToggleMemberAlertType = (id: string, field: 'notifyAlerts' | 'notifyActions') => {
    onUpdateMembers(members.map((m) => (m.id === id ? { ...m, [field]: !m[field] } : m)));
  };

  const handleDeleteMember = (id: string) => {
    if (id === 'm_owner_sina') {
      alert('حساب مالک ارشد قابل حذف نیست.');
      return;
    }
    if (!window.confirm('آیا از حذف این عضو از گلخانه مطمئن هستید؟')) return;
    if (activeInviteMember?.id === id) setActiveInviteMember(null);
    onUpdateMembers(members.filter((m) => m.id !== id));
  };

  const handleAddSpace = () => {
    const trimmed = newSpaceName.trim();
    if (!trimmed) return;
    const newSpaceId = 'sp_' + Date.now();
    onUpdateSpaces([
      ...spaces,
      { id: newSpaceId, name: trimmed, icon: newSpaceIcon, radiatorOn: false }
    ]);
    onUpdateGardens([
      ...gardens,
      {
        id: 'g_' + Date.now(),
        spaceId: newSpaceId,
        name: `باغچه اصلی ${trimmed}`,
        lightLevel: 'high'
      }
    ]);
    // افزودن خودکار فضای جدید به دسترسی مالک ارشد
    onUpdateMembers(
      members.map((m) =>
        m.role === 'super_admin' && !m.assignedSpaces.includes(newSpaceId)
          ? { ...m, assignedSpaces: [...m.assignedSpaces, newSpaceId] }
          : m
      )
    );
    setNewSpaceName('');
  };

  const handleSaveSpaceEdit = (spaceId: string) => {
    if (!editingSpaceName.trim()) return;
    onUpdateSpaces(
      spaces.map((s) =>
        s.id === spaceId
          ? { ...s, name: editingSpaceName.trim(), icon: editingSpaceIcon }
          : s
      )
    );
    setEditingSpaceId(null);
  };

  const handleAddGarden = () => {
    const trimmed = newGardenName.trim();
    if (!trimmed) return;
    onUpdateGardens([
      ...gardens,
      {
        id: 'g_' + Date.now(),
        spaceId: currentSpace.id,
        name: trimmed,
        lightLevel: newGardenLight
      }
    ]);
    setNewGardenName('');
  };

  const handleSaveGardenEdit = (gardenId: string) => {
    if (!editingGardenName.trim()) return;
    onUpdateGardens(
      gardens.map((g) =>
        g.id === gardenId
          ? { ...g, name: editingGardenName.trim(), lightLevel: editingGardenLight }
          : g
      )
    );
    setEditingGardenId(null);
  };

  const handleExportBackup = () => {
    const backupPayload = {
      version: 8,
      exportedAt: new Date().toISOString(),
      spaces,
      gardens,
      plants,
      members
    };
    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `botanica-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (parsed.plants && parsed.gardens) {
          onRestoreBackup({
            spaces: parsed.spaces || spaces,
            gardens: parsed.gardens,
            plants: parsed.plants,
            members: parsed.members || members
          });
          alert('✅ فایل پشتیبان با موفقیت بازیابی شد!');
        }
      } catch {
        alert('❌ فایل انتخاب‌شده معتبر نیست.');
      }
    };
    reader.readAsText(file);
  };

  const handleManualTelegramReport = async (level: 'morning' | 'noon_escalation') => {
    setTestStatus({
      loading: true,
      message: '⏳ در حال ارسال گزارش تعاملی به تلگرام...',
      isError: false
    });
    const res = await sendScheduledEscalationReport({
      space: currentSpace,
      plants,
      gardens,
      members,
      level,
      forceSendEvenIfEmpty: true
    });

    if (res.ok) {
      setTestStatus({
        loading: false,
        message: `✅ گزارش هوشمند «${currentSpace.name}» همراه با دکمه‌های شیشه‌ای به ${toPersianNum(
          res.sentCount
        )} عضو ارسال شد!`,
        isError: false
      });
    } else {
      setTestStatus({
        loading: false,
        message: `❌ ${res.errorMsg || 'خطا در ارسال پیام'}`,
        isError: true
      });
    }
  };

  const activePlantsCount = plants.filter((p) => !p.archived).length;
  const archivedPlantsCount = plants.filter((p) => p.archived).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      {/* قاب قفل‌شده ۳ لایه بدون هیچ‌گونه بیرون‌زدگی در موبایل */}
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* ۱. هدر ثابت و متقارن */}
        <div className="px-3.5 pt-3 pb-2.5 border-b border-[#E8E2D5] bg-[#FDFBF7] shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 flex items-center justify-center text-[#2E5A44] shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.9" />
                  <path
                    d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-heading text-[15px] font-extrabold text-[#1C2822] truncate">
                    مرکز مدیریت گلخانه
                  </h3>
                  <span className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[9.5px] font-extrabold shrink-0">
                    {isSuperAdmin ? '👑 مالک ارشد' : '🏡 مدیر فضا'}
                  </span>
                </div>
                <p className="text-[10px] text-[#5A655E] truncate mt-0.5">
                  گلخانه فعال: <strong className="text-[#1C2822]">{currentSpace.name}</strong>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="بستن تنظیمات"
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

          {/* نوار ۴ تب یک‌کلمه‌ای و متقارن با آیکون‌های برداری اختصاصی */}
          <div className="grid grid-cols-4 gap-1 bg-[#F6F3EC] p-1 rounded-2xl border border-[#E8E2D5]">
            {[
              { id: 'members' as const, label: 'اعضا', Icon: IconTabMembers },
              { id: 'spaces' as const, label: 'باغچه‌ها', Icon: IconTabGardens },
              { id: 'telegram' as const, label: 'تلگرام', Icon: IconTabTelegram },
              { id: 'system' as const, label: 'سیستم', Icon: IconTabSystem }
            ].map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-1 rounded-xl text-[10.5px] flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
                    active
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
        </div>

        {/* ۲. بدنه اسکرول‌شونده داخلی */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 space-y-3">
          {/* =================================================================== */}
          {/* تب ۱: مدیریت اعضا، سطوح دسترسی ۴گانه، باغچه‌های مجاز و کارت دعوت */}
          {/* =================================================================== */}
          {activeTab === 'members' && (
            <div className="space-y-3">
              {/* نوار ابزار بالای تب اعضا: دکمه باز کردن فرم عضو جدید + اتصال خودکار تلگرام */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddMemberForm((prev) => !prev)}
                  className={`py-2 px-2.5 rounded-xl text-[10.5px] font-extrabold border flex items-center justify-center gap-1 transition-all active:scale-95 ${
                    showAddMemberForm
                      ? 'bg-[#1C2822] text-white border-[#1C2822]'
                      : 'bg-[#2E5A44] text-white border-[#2E5A44] warm-shadow'
                  }`}
                >
                  <span>{showAddMemberForm ? '✕ بستن فرم عضو جدید' : '➕ تعریف عضو جدید'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDetectTelegramUsers}
                  className="py-2 px-2.5 rounded-xl bg-[#EBF4F8] border border-[#2B7A9B]/30 text-[#1F6380] text-[10.5px] font-extrabold flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <span>{loadingSubs ? '⏳ در حال بررسی...' : '🔄 اتصال خودکار آیدی'}</span>
                </button>
              </div>

              {subFeedback && (
                <div className="p-2.5 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/30 text-[10.5px] font-bold text-[#2E5A44] leading-relaxed">
                  {subFeedback}
                </div>
              )}

              {/* لیست افرادی که اخیراً در ربات Start زده‌اند */}
              {botSubscribers.length > 0 && (
                <div className="bg-[#FDFBF7] border border-[#2B7A9B]/30 rounded-2xl p-2.5 space-y-1.5 warm-shadow">
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-[#1F6380]">
                    <span>👥 کاربران شناسایی‌شده در ربات تلگرام:</span>
                    <button
                      type="button"
                      onClick={() => setBotSubscribers([])}
                      className="text-[#C85A32]"
                    >
                      ✕
                    </button>
                  </div>
                  {botSubscribers.map((sub) => (
                    <div
                      key={sub.chatId}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] text-[10.5px] flex items-center justify-between gap-2"
                    >
                      <span className="font-bold text-[#1C2822] truncate">
                        👤 {sub.firstName} ({sub.chatId})
                      </span>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const targetMemberId = e.target.value;
                          if (!targetMemberId) return;
                          onUpdateMembers(
                            members.map((m) =>
                              m.id === targetMemberId ? { ...m, telegramChatId: sub.chatId } : m
                            )
                          );
                          setBotSubscribers([]);
                          setSubFeedback(`✅ آیدی تلگرام با موفقیت به عضو متصل شد!`);
                        }}
                        className="px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10px] font-bold text-[#2E5A44] shrink-0"
                      >
                        <option value="">اتصال به کدام عضو؟</option>
                        {visibleMembers.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}

              {/* کارت دعوت اختصاصی عضو (ربات تلگرام + لینک ورود مستقیم به اپ) */}
              {activeInviteMember && (
                <div className="bg-[#E6F0EB] border-2 border-[#2E5A44] rounded-2xl p-3 space-y-2.5 warm-shadow">
                  <div className="flex items-center justify-between">
                    <div className="text-[11.5px] font-extrabold text-[#1C2822]">
                      🎁 کارت دعوت اختصاصی «{activeInviteMember.name}»
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveInviteMember(null)}
                      className="text-[10.5px] font-bold text-[#C85A32] px-1.5"
                    >
                      ✕ بستن
                    </button>
                  </div>

                  {/* ۱. لینک ربات تلگرام */}
                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10.5px] font-extrabold text-[#1F6380]">
                        🤖 ۱. لینک اتصال خودکار به ربات تلگرام:
                      </span>
                      {copiedFlag === 'bot' && (
                        <span className="text-[9.5px] font-bold text-[#2E5A44]">✅ کپی شد!</span>
                      )}
                    </div>

                    {!botUsername.trim() ? (
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-[#C85A32]">
                          ابتدا نام کاربری ربات تلگرام خود را بدون @ وارد کنید:
                        </p>
                        <input
                          type="text"
                          dir="ltr"
                          placeholder="YourBotName_bot"
                          onChange={(e) => {
                            const clean = e.target.value.replace('@', '').trim();
                            setBotUsername(clean);
                            onUpdateCloudConfig({
                              ...cloudConfig,
                              telegramBotUsername: clean
                            });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px]"
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          dir="ltr"
                          className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-mono text-[#1C2822] break-all select-all"
                        >
                          {buildMemberBotInviteUrl(activeInviteMember)}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={async () => {
                              const url = buildMemberBotInviteUrl(activeInviteMember);
                              await copyTextSafe(url);
                              setCopiedFlag('bot');
                            }}
                            className="py-1.5 px-2 rounded-lg bg-[#1F6380] text-white text-[10px] font-bold"
                          >
                            {copiedFlag === 'bot' ? '✅ کپی شد' : '📋 کپی لینک ربات'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleShareViaTelegramApp(
                                buildMemberBotInviteUrl(activeInviteMember),
                                `سلام ${activeInviteMember.name} عزیز 🌱؛ روی این لینک بزن و در ربات گلخانه دکمه Start را فشار بده تا کیبورد هوشمند و اعلان‌ها برایت فعال شود:`
                              )
                            }
                            className="py-1.5 px-2 rounded-lg bg-[#2E5A44] text-white text-[10px] font-bold"
                          >
                            ✈️ ارسال در تلگرام
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* ۲. لینک ورود به وب‌اپلیکیشن با سطح دسترسی عضو */}
                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10.5px] font-extrabold text-[#2E5A44]">
                        🔗 ۲. لینک ورود «{activeInviteMember.name}» به برنامه:
                      </span>
                      {copiedFlag === 'app' && (
                        <span className="text-[9.5px] font-bold text-[#2E5A44]">✅ کپی شد!</span>
                      )}
                    </div>
                    <div
                      dir="ltr"
                      className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-mono text-[#1C2822] break-all select-all"
                    >
                      {buildMemberAppUrl(activeInviteMember)}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={async () => {
                          const url = buildMemberAppUrl(activeInviteMember);
                          await copyTextSafe(url);
                          setCopiedFlag('app');
                        }}
                        className="py-1.5 px-2 rounded-lg bg-[#2E5A44] text-white text-[10px] font-bold"
                      >
                        {copiedFlag === 'app' ? '✅ کپی شد' : '📋 کپی لینک'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleShareViaTelegramApp(
                            buildMemberAppUrl(activeInviteMember),
                            `سلام ${activeInviteMember.name} عزیز 🌿؛ از طریق این لینک اختصاصی می‌توانی وارد گلخانه شوی:`
                          )
                        }
                        className="py-1.5 px-2 rounded-lg bg-[#1F6380] text-white text-[10px] font-bold"
                      >
                        ✈️ تلگرام
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleNativeMobileShare(
                            'گلخانه کوچک من',
                            `لینک ورود اختصاصی ${activeInviteMember.name} به گلخانه:`,
                            buildMemberAppUrl(activeInviteMember)
                          )
                        }
                        className="py-1.5 px-2 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] text-[10px] font-bold"
                      >
                        📤 اشتراک
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* فرم تاشوی تعریف عضو جدید (با گرید متقارن ۲×۲ نقش‌ها و بدون دراپ‌داون مرورگر) */}
              {showAddMemberForm && (
                <form
                  onSubmit={handleAddMember}
                  className="bg-[#F6F3EC] border border-[#2E5A44]/30 rounded-2xl p-3 space-y-2.5 warm-shadow"
                >
                  <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-1.5">
                    <span className="text-[11.5px] font-extrabold text-[#1C2822]">
                      ➕ مشخصات و سطح دسترسی عضو جدید
                    </span>
                    <span className="text-[9.5px] font-bold text-[#2E5A44]">گام‌به‌گام</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-8">
                      <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                        نام عضو (الزامی):
                      </label>
                      <input
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="مثلاً: مادر، برادر، همکار..."
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold focus:outline-none focus:border-[#2E5A44]"
                      />
                    </div>
                    <div className="col-span-4">
                      <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                        پین ۴ رقمی:
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={memberPinCode}
                        onChange={(e) => setMemberPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="اختیاری"
                        dir="ltr"
                        className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] text-center font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* انتخاب نقش پایه در گرید متقارن ۲×۲ (بدون دراپ‌داون بومی مرورگر) */}
                  <div>
                    <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                      نقش پایه و سطح دسترسی پیش‌فرض:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ROLE_OPTIONS.filter((r) => isSuperAdmin || r.id !== 'super_admin').map(
                        (roleOpt) => {
                          const active = memberRole === roleOpt.id;
                          return (
                            <button
                              key={roleOpt.id}
                              type="button"
                              onClick={() => handleRoleChangeForNewMember(roleOpt.id)}
                              className={`p-2 rounded-xl border text-right transition-all ${
                                active
                                  ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-xs'
                                  : 'bg-[#FDFBF7] text-[#1C2822] border-[#E8E2D5]'
                              }`}
                            >
                              <div className="text-[10.5px] font-extrabold">{roleOpt.label}</div>
                              <div
                                className={`text-[8.5px] mt-0.5 ${
                                  active ? 'text-white/85' : 'text-[#5A655E]'
                                }`}
                              >
                                {roleOpt.shortDesc}
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {isSuperAdmin && (
                    <div className="space-y-2 bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5]">
                      <div>
                        <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                          ۱. گلخانه‌های مجاز برای این عضو:
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {spaces.map((sp) => {
                            const selected = memberSpaces.includes(sp.id);
                            return (
                              <button
                                key={sp.id}
                                type="button"
                                onClick={() => toggleSpaceSelection(sp.id)}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-all ${
                                  selected
                                    ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                    : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                                }`}
                              >
                                {sp.icon} {sp.name} {selected ? '✓' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {candidateGardensForNewMember.length > 1 && (
                        <div>
                          <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                            ۲. محدودسازی به باغچه‌های خاص (انتخاب نکردن = همه باغچه‌ها):
                          </label>
                          <div className="flex flex-wrap gap-1">
                            {candidateGardensForNewMember.map((g) => {
                              const selected = memberGardens.includes(g.id);
                              return (
                                <button
                                  key={g.id}
                                  type="button"
                                  onClick={() => toggleGardenSelectionForNewMember(g.id)}
                                  className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold border transition-all ${
                                    selected
                                      ? 'bg-[#1F6380] text-white border-[#1F6380]'
                                      : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                                  }`}
                                >
                                  🪴 {g.name} {selected ? '✓' : ''}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ۴ مجوز ریزدانه عملیاتی */}
                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-1.5">
                    <div className="text-[9.5px] font-bold text-[#1C2822]">
                      🛡️ تنظیم دقیق مجوزهای عملیاتی (قابل شخصی‌سازی):
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                      {PERMISSION_ITEMS.map(({ key, label }) => {
                        const isChecked = memberPermissions[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setMemberPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                            }
                            className={`py-1.5 px-2 rounded-lg border font-bold flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/30'
                                : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                            }`}
                          >
                            <span>{label}</span>
                            <span>{isChecked ? '✓' : '✕'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* تنظیمات اعلان تلگرام برای عضو جدید */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setNotifyAlerts((v) => !v)}
                      className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-between ${
                        notifyAlerts
                          ? 'bg-[#FEF6E7] text-[#B45309] border-[#D97706]/30'
                          : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                      }`}
                    >
                      <span>🔔 دریافت هشدار تشنگی</span>
                      <span>{notifyAlerts ? '✓' : '✕'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNotifyActions((v) => !v)}
                      className={`py-1.5 px-2 rounded-xl border font-bold flex items-center justify-between ${
                        notifyActions
                          ? 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/30'
                          : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                      }`}
                    >
                      <span>📝 دریافت گزارش آبیاری</span>
                      <span>{notifyActions ? '✓' : '✕'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#2E5A44] text-white text-[11.5px] font-extrabold warm-shadow active:scale-98 transition-transform"
                  >
                    ثبت عضو جدید و ساخت کارت دعوت ✓
                  </button>
                </form>
              )}

              {/* لیست اعضای ثبت‌شده در گلخانه */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[11px] font-extrabold text-[#1C2822]">
                    📋 اعضای گلخانه ({toPersianNum(visibleMembers.length)} نفر)
                  </span>
                  <span className="text-[9.5px] font-semibold text-[#5A655E]">
                    برای تغییر مجوزها روی «🛡️ دسترسی» بزنید
                  </span>
                </div>

                {visibleMembers.map((m) => {
                  const roleMeta =
                    ROLE_OPTIONS.find((r) => r.id === m.role) || ROLE_OPTIONS[0];
                  const effectivePerms =
                    m.permissions || getDefaultMemberPermissions(m.role);

                  const spaceNames = spaces
                    .filter((s) => m.assignedSpaces.includes(s.id))
                    .map((s) => `${s.icon} ${s.name}`)
                    .join(' ، ');

                  const memberCandidateGardens = gardens.filter((g) =>
                    m.assignedSpaces.includes(g.spaceId || 'office')
                  );

                  const assignedGardenNames =
                    m.assignedGardens && m.assignedGardens.length > 0
                      ? gardens
                          .filter((g) => m.assignedGardens?.includes(g.id))
                          .map((g) => g.name)
                          .join('، ')
                      : 'همه باغچه‌ها';

                  const isPermExpanded = expandedPermMemberId === m.id;
                  const isPrimaryOwner = m.id === 'm_owner_sina';

                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border transition-all space-y-2 warm-shadow ${
                        m.active
                          ? 'bg-[#FDFBF7] border-[#E8E2D5]'
                          : 'bg-[#F6F3EC]/70 border-[#E8E2D5] opacity-65'
                      }`}
                    >
                      {/* ردیف ۱: نام، بج نقش و دکمه‌های مدیریتی */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-heading text-[13px] font-extrabold text-[#1C2822]">
                              {m.name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-extrabold ${roleMeta.badgeClass}`}
                            >
                              {roleMeta.label}
                            </span>
                            {m.pinCode && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#FEF6E7] border border-[#D97706]/30 text-[#B45309] text-[9px] font-bold">
                                🔒 پین فعال
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] text-[#5A655E] leading-snug">
                            فضا: <strong className="text-[#1C2822]">{spaceNames}</strong>
                            {' • '}
                            باغچه: <strong className="text-[#2E5A44]">{assignedGardenNames}</strong>
                          </div>

                          <div className="text-[10px]">
                            تلگرام:{' '}
                            {m.telegramChatId ? (
                              <span className="text-[#2E5A44] font-bold">
                                ✅ متصل ({m.telegramChatId})
                              </span>
                            ) : (
                              <span className="text-[#C85A32] font-semibold">
                                ⏳ متصل نشده (دعوت ربات را بفرستید)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedPermMemberId(isPermExpanded ? null : m.id)
                              }
                              className={`px-2 py-1 rounded-xl text-[9.5px] font-bold border transition-all ${
                                isPermExpanded
                                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                  : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                              }`}
                            >
                              🛡️ دسترسی {isPermExpanded ? '▴' : '▾'}
                            </button>
                          )}

                          {!isPrimaryOwner && (
                            <button
                              type="button"
                              onClick={() => handleToggleMemberActive(m.id)}
                              className={`px-2 py-1 rounded-xl text-[9.5px] font-bold border ${
                                m.active
                                  ? 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/20'
                                  : 'bg-[#FCEEE9] text-[#C85A32] border-[#C85A32]/20'
                              }`}
                            >
                              {m.active ? 'فعال ✓' : 'معلق'}
                            </button>
                          )}

                          {!isPrimaryOwner && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m.id)}
                              className="w-7 h-7 rounded-xl bg-[#FCEEE9] border border-[#C85A32]/25 text-[#C85A32] text-[10px] font-bold flex items-center justify-center"
                              title="حذف عضو"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      {/* کشوی ویرایش زنده نقش، پین‌کد، باغچه‌ها و ۴ مجوز عضو */}
                      {isPermExpanded && isSuperAdmin && (
                        <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2.5 text-[10px]">
                          {/* تغییر نقش پایه با گرید دکمه‌ای متقارن */}
                          {!isPrimaryOwner && (
                            <div>
                              <label className="block text-[9.5px] font-bold text-[#5A655E] mb-1">
                                تغییر نقش پایه «{m.name}»:
                              </label>
                              <div className="grid grid-cols-2 gap-1">
                                {ROLE_OPTIONS.map((rOpt) => {
                                  const isCurrentRole = m.role === rOpt.id;
                                  return (
                                    <button
                                      key={rOpt.id}
                                      type="button"
                                      onClick={() =>
                                        handleUpdateExistingMember(m.id, {
                                          role: rOpt.id,
                                          permissions: getDefaultMemberPermissions(rOpt.id)
                                        })
                                      }
                                      className={`py-1.5 px-2 rounded-lg border text-[9.5px] font-bold text-right transition-all ${
                                        isCurrentRole
                                          ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                          : 'bg-[#FDFBF7] text-[#1C2822] border-[#E8E2D5]'
                                      }`}
                                    >
                                      {rOpt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* تنظیم پین‌کد ۴ رقمی و آیدی تلگرام دستی */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-[#5A655E] mb-0.5">
                                پین‌کد ۴ رقمی قفل:
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={m.pinCode || ''}
                                onChange={(e) =>
                                  handleUpdateExistingMember(m.id, {
                                    pinCode:
                                      e.target.value.replace(/\D/g, '').slice(0, 4) || undefined
                                  })
                                }
                                placeholder="بدون پین"
                                dir="ltr"
                                className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono text-center font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-[#5A655E] mb-0.5">
                                Chat ID تلگرام:
                              </label>
                              <input
                                type="text"
                                value={m.telegramChatId || ''}
                                onChange={(e) =>
                                  handleUpdateExistingMember(m.id, {
                                    telegramChatId: e.target.value.trim()
                                  })
                                }
                                placeholder="مثلاً 123456789"
                                dir="ltr"
                                className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono text-center"
                              />
                            </div>
                          </div>

                          {/* تغییر فضاهای مجاز */}
                          <div>
                            <div className="text-[9.5px] font-bold text-[#5A655E] mb-1">
                              گلخانه‌های مجاز:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {spaces.map((sp) => {
                                const hasSp = m.assignedSpaces.includes(sp.id);
                                return (
                                  <button
                                    key={sp.id}
                                    type="button"
                                    onClick={() => handleToggleExistingMemberSpace(m, sp.id)}
                                    className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold border ${
                                      hasSp
                                        ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                        : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                                    }`}
                                  >
                                    {sp.icon} {sp.name} {hasSp ? '✓' : ''}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* فیلتر باغچه‌های مجاز */}
                          {memberCandidateGardens.length > 1 && (
                            <div>
                              <div className="text-[9.5px] font-bold text-[#5A655E] mb-1">
                                محدودسازی به باغچه‌های خاص (خالی = همه باغچه‌ها):
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {memberCandidateGardens.map((g) => {
                                  const hasG = (m.assignedGardens || []).includes(g.id);
                                  return (
                                    <button
                                      key={g.id}
                                      type="button"
                                      onClick={() => handleToggleExistingMemberGarden(m, g.id)}
                                      className={`px-2 py-0.5 rounded-lg text-[9.5px] font-bold border ${
                                        hasG
                                          ? 'bg-[#1F6380] text-white border-[#1F6380]'
                                          : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                                      }`}
                                    >
                                      🪴 {g.name} {hasG ? '✓' : ''}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* ۴ کلید مجوز عملیاتی */}
                          <div className="grid grid-cols-2 gap-1 pt-0.5">
                            {PERMISSION_ITEMS.map(({ key, label }) => {
                              const on = effectivePerms[key];
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  disabled={isPrimaryOwner}
                                  onClick={() => handleToggleExistingMemberPerm(m, key)}
                                  className={`py-1 px-2 rounded-lg border text-[9.5px] font-bold flex items-center justify-between ${
                                    on
                                      ? 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/30'
                                      : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                                  }`}
                                >
                                  <span>{label}</span>
                                  <span>{on ? '✓' : '✕'}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* دکمه تست و پیش‌نمایش برنامه از دید این عضو */}
                          <button
                            type="button"
                            onClick={() => {
                              const previewRole =
                                m.role === 'super_admin' || m.role === 'space_admin'
                                  ? 'owner'
                                  : m.role === 'viewer' || !effectivePerms.canWaterAndMist
                                  ? 'visitor'
                                  : 'caretaker';
                              onSwitchPreviewRole(previewRole, m.id);
                              onClose();
                            }}
                            className="w-full py-1.5 rounded-xl bg-[#1F6380] text-white text-[10px] font-bold warm-shadow"
                          >
                            👁️ مشاهده و تست برنامه از دید «{m.name}»
                          </button>
                        </div>
                      )}

                      {/* ردیف پایین کارت عضو: سوییچ‌های هشدار/گزارش + دکمه‌های دعوت */}
                      <div className="pt-1.5 border-t border-[#E8E2D5]/80 flex items-center justify-between gap-1 text-[9.5px]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleMemberAlertType(m.id, 'notifyAlerts')}
                            className={`px-2 py-1 rounded-lg border font-bold ${
                              m.notifyAlerts
                                ? 'bg-[#FEF6E7] text-[#B45309] border-[#D97706]/30'
                                : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                            }`}
                          >
                            {m.notifyAlerts ? '🔔 هشدار' : '🔕 بی‌صدا'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMemberAlertType(m.id, 'notifyActions')}
                            className={`px-2 py-1 rounded-lg border font-bold ${
                              m.notifyActions
                                ? 'bg-[#EBF4F8] text-[#1F6380] border-[#2B7A9B]/30'
                                : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                            }`}
                          >
                            {m.notifyActions ? '📝 گزارش' : 'بدون گزارش'}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenInviteSheet(m, 'bot')}
                            className="px-2 py-1 rounded-lg bg-[#1F6380] text-white font-bold whitespace-nowrap active:scale-95 transition-transform"
                          >
                            🤖 دعوت ربات
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenInviteSheet(m, 'app')}
                            className="px-2 py-1 rounded-lg bg-[#2E5A44] text-white font-bold whitespace-nowrap active:scale-95 transition-transform"
                          >
                            🔗 لینک اپ
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۲: باغچه‌ها و فضاهای اصلی گلخانه (با انتخابگرهای دکمه‌ای متقارن) */}
          {/* =================================================================== */}
          {activeTab === 'spaces' && (
            <div className="space-y-3.5">
              {/* بخش ۱: مدیریت باغچه‌های فضای فعلی */}
              <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-extrabold text-[#1C2822]">
                    🪴 باغچه‌های «{currentSpace.name}»
                  </span>
                  <span className="persian-num px-2 py-0.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#2E5A44]">
                    {toPersianNum(spaceGardens.length)} باغچه فعال
                  </span>
                </div>

                <div className="space-y-2">
                  {spaceGardens.map((g) => {
                    const isEditing = editingGardenId === g.id;
                    const plantCount = plants.filter(
                      (p) => !p.archived && p.garden === g.id
                    ).length;

                    return (
                      <div
                        key={g.id}
                        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2 warm-shadow"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              value={editingGardenName}
                              onChange={(e) => setEditingGardenName(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold"
                              placeholder="نام باغچه..."
                            />
                            {/* گرید ۳ ستونه انتخاب نور باغچه */}
                            <div className="grid grid-cols-3 gap-1">
                              {LIGHT_OPTIONS.map((lOpt) => (
                                <button
                                  key={lOpt.id}
                                  type="button"
                                  onClick={() => setEditingGardenLight(lOpt.id)}
                                  className={`py-1.5 px-1 rounded-lg border text-[9.5px] font-bold transition-all ${
                                    editingGardenLight === lOpt.id
                                      ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                      : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                                  }`}
                                >
                                  {lOpt.label}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveGardenEdit(g.id)}
                                className="flex-1 py-1.5 rounded-lg bg-[#2E5A44] text-white text-[10.5px] font-bold"
                              >
                                ذخیره تغییرات ✓
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingGardenId(null)}
                                className="px-3 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] text-[10.5px] font-bold"
                              >
                                انصراف
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[12px] font-extrabold text-[#1C2822] truncate">
                                {g.name}
                              </div>
                              <div className="persian-num text-[10px] text-[#5A655E] mt-0.5 flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded-md bg-[#F6F3EC] border border-[#E8E2D5] font-bold text-[#1C2822]">
                                  {g.lightLevel === 'high'
                                    ? '☀️ نور زیاد'
                                    : g.lightLevel === 'medium'
                                    ? '⛅ نور متوسط'
                                    : '🌥️ نور کم'}
                                </span>
                                <span className="font-bold text-[#2E5A44]">
                                  {toPersianNum(plantCount)} گلدان
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingGardenId(g.id);
                                  setEditingGardenName(g.name);
                                  setEditingGardenLight(g.lightLevel);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold"
                              >
                                ✏️ ویرایش
                              </button>
                              {spaceGardens.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteGarden(g.id)}
                                  className="px-2 py-1 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10px] font-bold"
                                >
                                  🗑️
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* فرم ساخت باغچه جدید با گرید ۳ دکمه‌ای نور */}
                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                  <div className="text-[10.5px] font-extrabold text-[#2E5A44]">
                    ➕ افزودن باغچه جدید به «{currentSpace.name}»:
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={newGardenName}
                      onChange={(e) => setNewGardenName(e.target.value)}
                      placeholder="نام باغچه (مثلاً: کنار پنجره، تراس، روی میز)..."
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold focus:outline-none focus:border-[#2E5A44]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGarden}
                      className="px-3 py-1.5 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-extrabold shrink-0 warm-shadow active:scale-95 transition-transform"
                    >
                      + ساخت
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {LIGHT_OPTIONS.map((lOpt) => {
                      const active = newGardenLight === lOpt.id;
                      return (
                        <button
                          key={lOpt.id}
                          type="button"
                          onClick={() => setNewGardenLight(lOpt.id)}
                          className={`py-1.5 px-1 rounded-xl border text-center transition-all ${
                            active
                              ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-xs'
                              : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                          }`}
                        >
                          <div className="text-[9.5px] font-extrabold">{lOpt.label}</div>
                          <div
                            className={`text-[8px] ${
                              active ? 'text-white/85' : 'text-[#5A655E]'
                            }`}
                          >
                            {lOpt.sub}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* بخش ۲: مدیریت فضاهای اصلی (گلخانه محل کار / منزل و...) */}
              {isSuperAdmin && (
                <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-extrabold text-[#1C2822]">
                      🏢🏡 فضاهای اصلی گلخانه
                    </span>
                    <span className="persian-num px-2 py-0.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1F6380]">
                      {toPersianNum(spaces.length)} فضا
                    </span>
                  </div>

                  <div className="space-y-2">
                    {spaces.map((sp) => {
                      const isEditingSp = editingSpaceId === sp.id;
                      const spPlantCount = plants.filter(
                        (p) => !p.archived && (p.spaceId || 'office') === sp.id
                      ).length;
                      const spGardenCount = gardens.filter(
                        (g) => (g.spaceId || 'office') === sp.id
                      ).length;

                      return (
                        <div
                          key={sp.id}
                          className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2 warm-shadow"
                        >
                          {isEditingSp ? (
                            <div className="space-y-2">
                              <input
                                value={editingSpaceName}
                                onChange={(e) => setEditingSpaceName(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold"
                              />
                              <div className="grid grid-cols-8 gap-1">
                                {SPACE_ICON_OPTIONS.map((ic) => (
                                  <button
                                    key={ic}
                                    type="button"
                                    onClick={() => setEditingSpaceIcon(ic)}
                                    className={`h-7 rounded-lg border flex items-center justify-center text-[13px] ${
                                      editingSpaceIcon === ic
                                        ? 'bg-[#2E5A44] border-[#2E5A44]'
                                        : 'bg-[#F6F3EC] border-[#E8E2D5]'
                                    }`}
                                  >
                                    {ic}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveSpaceEdit(sp.id)}
                                  className="flex-1 py-1.5 rounded-lg bg-[#2E5A44] text-white text-[10.5px] font-bold"
                                >
                                  ذخیره ✓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSpaceId(null)}
                                  className="px-3 py-1.5 rounded-lg bg-[#F6F3EC] text-[#5A655E] text-[10.5px] font-bold"
                                >
                                  انصراف
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-[12px] font-extrabold text-[#1C2822] truncate">
                                  {sp.icon} {sp.name}
                                </div>
                                <div className="persian-num text-[9.5px] text-[#5A655E] mt-0.5">
                                  {toPersianNum(spGardenCount)} باغچه • {toPersianNum(spPlantCount)} گلدان فعال
                                </div>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSpaceId(sp.id);
                                    setEditingSpaceName(sp.name);
                                    setEditingSpaceIcon(sp.icon || '🌿');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold"
                                >
                                  ✏️ ویرایش
                                </button>
                                {spaces.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteSpace(sp.id)}
                                    className="px-2 py-1 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10px] font-bold"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* فرم ساخت گلخانه جدید با گرید ۸ تایی آیکون‌ها */}
                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="text-[10.5px] font-extrabold text-[#2E5A44]">
                      ➕ ساخت فضای گلخانه جدید:
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="نام فضا (مثلاً: گلخانه منزل، اتاق کار)..."
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpace}
                        className="px-3 py-1.5 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-extrabold shrink-0 warm-shadow"
                      >
                        + ساخت فضا
                      </button>
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {SPACE_ICON_OPTIONS.map((ic) => (
                        <button
                          key={ic}
                          type="button"
                          onClick={() => setNewSpaceIcon(ic)}
                          className={`h-7 rounded-lg border flex items-center justify-center text-[13px] transition-all ${
                            newSpaceIcon === ic
                              ? 'bg-[#2E5A44] border-[#2E5A44] scale-105 shadow-xs'
                              : 'bg-[#F6F3EC] border-[#E8E2D5]'
                          }`}
                        >
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* بخش ۳: پیش‌نمایش حالت نمایشگاهی (بازدیدکننده) */}
              <div className="bg-[#EBF4F8]/80 p-3 rounded-2xl border border-[#2B7A9B]/25 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[11.5px] font-extrabold text-[#1F6380]">
                    👁️ پیش‌نمایش حالت نمایشگاهی (بازدیدکننده)
                  </div>
                  <div className="text-[9.5px] text-[#5A655E] mt-0.5">
                    مشاهده شناسنامه گیاهان بدون دکمه‌های ویرایش و آبیاری
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSwitchPreviewRole('visitor');
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#1F6380] text-white text-[10.5px] font-bold shrink-0 active:scale-95 transition-transform"
                >
                  تست بازدیدکننده
                </button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۳: مرکز فرماندهی ربات تلگرام و اعلان‌ها */}
          {/* =================================================================== */}
          {activeTab === 'telegram' && (
            <div className="space-y-3">
              <div className="bg-[#E6F0EB]/70 p-3 rounded-2xl border border-[#2E5A44]/25 space-y-2.5 warm-shadow">
                <div className="text-[12px] font-extrabold text-[#1C2822]">
                  🤖 پنل تعاملی ربات تلگرام «{currentSpace.name}»
                </div>
                <p className="text-[10px] text-[#5A655E] leading-relaxed text-justify">
                  با ارسال پنل تعاملی، اعضای متصل به ربات می‌توانند مستقیماً از داخل تلگرام با زدن <strong>دکمه‌های شیشه‌ای</strong> آبیاری، غبارپاشی و چرخش را ثبت کنند و گزارش آنی در برنامه ثبت شود:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={testStatus.loading}
                    onClick={() => handleManualTelegramReport('morning')}
                    className="py-2.5 px-2 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-extrabold warm-shadow disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    ☀️ ارسال گزارش صبحگاهی
                  </button>
                  <button
                    type="button"
                    disabled={testStatus.loading}
                    onClick={() => handleManualTelegramReport('noon_escalation')}
                    className="py-2.5 px-2 rounded-xl bg-[#C85A32] text-white text-[10.5px] font-extrabold warm-shadow disabled:opacity-50 active:scale-95 transition-transform"
                  >
                    ⚠️ ارسال یادآور پیگیری ظهر
                  </button>
                </div>

                {testStatus.message && (
                  <div
                    className={`p-2.5 rounded-xl text-[10.5px] font-bold ${
                      testStatus.isError
                        ? 'bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/30'
                        : 'bg-[#FDFBF7] text-[#2E5A44] border border-[#2E5A44]/30'
                    }`}
                  >
                    {testStatus.message}
                  </div>
                )}
              </div>

              {isSuperAdmin && (
                <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-extrabold text-[#1C2822]">
                      🔑 تنظیمات توکن و شناسه ربات تلگرام
                    </span>
                    <button
                      type="button"
                      onClick={async () => {
                        const granted = await requestBrowserPushPermission();
                        onUpdateCloudConfig({ ...cloudConfig, browserPushEnabled: granted });
                      }}
                      className="px-2 py-0.5 rounded-lg bg-[#EBF4F8] text-[9.5px] font-bold text-[#1F6380]"
                    >
                      {cloudConfig.browserPushEnabled
                        ? '🔔 اعلان مرورگر فعال ✓'
                        : '🔔 فعال‌سازی اعلان مرورگر'}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                        توکن ربات تلگرام (Bot Token):
                      </label>
                      <input
                        type="password"
                        value={cloudConfig.telegramBotToken}
                        onChange={(e) =>
                          onUpdateCloudConfig({
                            ...cloudConfig,
                            telegramBotToken: e.target.value.trim()
                          })
                        }
                        placeholder="123456789:ABCdefGHIjklMNO..."
                        dir="ltr"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                          یوزرنیم ربات (بدون @):
                        </label>
                        <input
                          type="text"
                          value={botUsername}
                          onChange={(e) => {
                            const clean = e.target.value.replace('@', '').trim();
                            setBotUsername(clean);
                            onUpdateCloudConfig({
                              ...cloudConfig,
                              telegramBotUsername: clean
                            });
                          }}
                          placeholder="BotUsername_bot"
                          dir="ltr"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                          Chat ID پیش‌فرض مالک:
                        </label>
                        <input
                          type="text"
                          value={cloudConfig.telegramChatId}
                          onChange={(e) =>
                            onUpdateCloudConfig({
                              ...cloudConfig,
                              telegramChatId: e.target.value.trim()
                            })
                          }
                          placeholder="Chat ID"
                          dir="ltr"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* تب ۴: سیستم، فضای ابری، هوش مصنوعی، پشتیبان‌گیری و بازنشانی */}
          {/* =================================================================== */}
          {activeTab === 'system' && (
            <div className="space-y-3">
              {/* داشبورد خلاصه وضعیت سیستم */}
              <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-3 space-y-2">
                <div className="text-[11.5px] font-extrabold text-[#1C2822]">
                  📊 خلاصه وضعیت پایگاه داده گلخانه
                </div>
                <div className="persian-num grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[13px] font-extrabold text-[#2E5A44]">
                      {toPersianNum(spaces.length)}
                    </div>
                    <div className="text-[8.5px] font-bold text-[#5A655E]">گلخانه</div>
                  </div>
                  <div className="bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[13px] font-extrabold text-[#1F6380]">
                      {toPersianNum(gardens.length)}
                    </div>
                    <div className="text-[8.5px] font-bold text-[#5A655E]">باغچه</div>
                  </div>
                  <div className="bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[13px] font-extrabold text-[#2E5A44]">
                      {toPersianNum(activePlantsCount)}
                    </div>
                    <div className="text-[8.5px] font-bold text-[#5A655E]">گلدان فعال</div>
                  </div>
                  <div className="bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5]">
                    <div className="text-[13px] font-extrabold text-[#B45309]">
                      {toPersianNum(members.length)}
                    </div>
                    <div className="text-[8.5px] font-bold text-[#5A655E]">اعضا ({toPersianNum(archivedPlantsCount)} آرشیو)</div>
                  </div>
                </div>
              </div>

              {/* پشتیبان‌گیری و بازیابی اطلاعات */}
              <div className="bg-[#FDFBF7] p-3 rounded-2xl border border-[#E8E2D5] space-y-2 warm-shadow">
                <div className="text-[11.5px] font-extrabold text-[#1C2822]">
                  💾 پشتیبان‌گیری و بازیابی اطلاعات (نسخه ۸)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="py-2 px-2.5 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10.5px] font-extrabold active:scale-95 transition-transform"
                  >
                    📥 دانلود فایل پشتیبان
                  </button>
                  <label className="py-2 px-2.5 rounded-xl bg-[#EBF4F8] border border-[#2B7A9B]/25 text-[#1F6380] text-[10.5px] font-extrabold text-center cursor-pointer active:scale-95 transition-transform">
                    📤 بازیابی از فایل
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* تنظیمات دیتابیس ابری Supabase و کلید هوش مصنوعی Gemini */}
              {isSuperAdmin && (
                <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2">
                  <div className="text-[11.5px] font-extrabold text-[#1C2822]">
                    ☁️ پایگاه داده ابری (Supabase) و هوش مصنوعی (Gemini)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cloudConfig.supabaseUrl}
                      onChange={(e) =>
                        onUpdateCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value.trim() })
                      }
                      placeholder="Supabase URL"
                      dir="ltr"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                    />
                    <input
                      type="password"
                      value={cloudConfig.supabaseAnonKey}
                      onChange={(e) =>
                        onUpdateCloudConfig({
                          ...cloudConfig,
                          supabaseAnonKey: e.target.value.trim()
                        })
                      }
                      placeholder="Supabase Anon Key"
                      dir="ltr"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                      کلید هوش مصنوعی Gemini Vision (جهت اسکن و تشخیص دقیق برگ از عکس):
                    </label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={(e) => {
                        setGeminiKey(e.target.value);
                        saveGeminiApiKey(e.target.value);
                      }}
                      placeholder="AIzaSy..."
                      dir="ltr"
                      className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-mono"
                    />
                  </div>
                </div>
              )}

              {/* پاکسازی داده‌های پیش‌فرض و شروع از صفر */}
              {isSuperAdmin && onResetGreenhouse && (
                <div className="bg-[#FCEEE9]/65 p-3 rounded-2xl border border-[#C85A32]/30 space-y-2">
                  <div className="text-[11.5px] font-extrabold text-[#C85A32]">
                    🧹 بازنشانی و شروع از صفر (Zero-State)
                  </div>
                  <p className="text-[9.5px] text-[#5A655E] leading-relaxed text-justify">
                    می‌توانید فقط گلدان‌های پیش‌فرض را خالی کنید (با حفظ گلخانه‌ها و باغچه‌ها) یا کل سیستم را به حالت خام اولیه بازنشانی نمایید:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            '⚠️ آیا تمام گلدان‌های فعلی پاک شوند تا ثبت گلدان‌ها را از پلاک #۰۱ شروع کنید؟ (گلخانه‌ها و باغچه‌ها حفظ می‌شوند)'
                          )
                        ) {
                          onResetGreenhouse('plants_only');
                        }
                      }}
                      className="py-2 px-2 rounded-xl bg-[#FDFBF7] border border-[#C85A32]/40 text-[#C85A32] text-[10px] font-extrabold active:scale-95 transition-transform"
                    >
                      🪴 فقط حذف گلدان‌ها
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            '⚠️ آیا کل سیستم (گلخانه‌ها، باغچه‌ها و گلدان‌ها) به حالت ۱۰۰٪ خام اولیه بازنشانی شود؟'
                          )
                        ) {
                          onResetGreenhouse('full_zero');
                        }
                      }}
                      className="py-2 px-2 rounded-xl bg-[#C85A32] text-white text-[10px] font-extrabold active:scale-95 transition-transform"
                    >
                      🔄 شروع ۱۰۰٪ خام از صفر
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ۳. فوتر ثابت پایین */}
        <div className="px-4 py-3 border-t border-[#E8E2D5] bg-[#FDFBF7] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[12.5px] warm-shadow active:scale-[0.99] transition-transform"
          >
            ذخیره و بازگشت به گلخانه ✓
          </button>
        </div>
      </div>
    </div>
  );
};