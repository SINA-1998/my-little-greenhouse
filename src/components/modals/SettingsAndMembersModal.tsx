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
  sendTelegramToTargets,
  setupTelegramBotCommands,
  requestBrowserPushPermission
} from '../../services/cloudSyncService';
import { getGeminiApiKey, saveGeminiApiKey } from '../../services/aiPlantService';

const toPersianNum = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

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
  const [activeTab, setActiveTab] = useState<'members' | 'spaces' | 'telegram'>('members');

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

  // استیت باز کردن کشوی ویرایش دسترسی برای هر عضو در لیست
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

  const [geminiKey, setGeminiKey] = useState<string>(() => getGeminiApiKey());

  const [testStatus, setTestStatus] = useState<{
    loading: boolean;
    message: string | null;
    isError: boolean;
  }>({ loading: false, message: null, isError: false });

  useEffect(() => {
    if (!isOpen) return;
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
          `🎉 عالی! تلگرام ${toPersianNum(autoBoundCount)} عضو جدید به صورت خودکار از طریق لینک دعوت متصل شد!`
        );
      }
    });
  }, [isOpen]);

  if (!isOpen) return null;

  const visibleMembers = isSuperAdmin
    ? members
    : members.filter((m) => m.assignedSpaces.includes(currentSpace.id));

  const spaceGardens = gardens.filter((g) => (g.spaceId || 'office') === currentSpace.id);

  // باغچه‌های مربوط به فضاهای انتخاب‌شده هنگام تعریف عضو جدید
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
    const roleMode =
      member.role === 'super_admin' || member.role === 'space_admin'
        ? 'admin'
        : member.role === 'viewer'
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
    setActiveInviteMember(newMember);
    setCopiedFlag(null);
  };

  // بروزرسانی مجوزها، نقش، پین‌کد یا باغچه‌های یک عضو موجود
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
    handleUpdateExistingMember(member.id, { assignedSpaces: nextSpaces });
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

    let currentUname = (botUsername || cloudConfig.telegramBotUsername || '').replace('@', '').trim();
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
        // اگر کاربر پنجره را بست
      }
    }
    await copyTextSafe(`${text}\n${url}`);
    alert('✅ لینک در حافظه کپی شد!');
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
        '⚠️ هنوز پیامی در ربات یافت نشد. روی دکمه «🤖 دعوت به ربات» کنار نام عضو بزنید و لینک را برایش بفرستید تا در تلگرام Start بزند!'
      );
    } else {
      setSubFeedback(
        `🔍 ${toPersianNum(list.length)} کاربر در ربات یافت شد. از لیست زیر می‌توانید آیدی را به عضو مورد نظر متصل کنید.`
      );
    }
  };

  const handleToggleMemberActive = (id: string) => {
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
      { id: 'g_' + Date.now(), spaceId: newSpaceId, name: `باغچه اصلی ${trimmed}`, lightLevel: 'high' }
    ]);
    setNewSpaceName('');
  };

  const handleSaveSpaceEdit = (spaceId: string) => {
    if (!editingSpaceName.trim()) return;
    onUpdateSpaces(
      spaces.map((s) => (s.id === spaceId ? { ...s, name: editingSpaceName.trim() } : s))
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
      version: 7,
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
    a.download = `greenhouse-backup-${new Date().toISOString().slice(0, 10)}.json`;
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
    setTestStatus({ loading: true, message: '⏳ در حال ارسال گزارش تعاملی به تلگرام...', isError: false });
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
        message: `✅ گزارش هوشمند «${currentSpace.name}» به همراه دکمه‌های شیشه‌ای آبیاری به ${toPersianNum(
          res.sentCount
        )} گیرنده ارسال شد!`,
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

  const handleInstallBotKeyboardAndMenu = async () => {
    setTestStatus({
      loading: true,
      message: '⏳ در حال نصب منوی دستورات و کیبورد فارسی در ربات تلگرام...',
      isError: false
    });

    await setupTelegramBotCommands(cloudConfig.telegramBotToken);

    const activeChatIds = members
      .filter((m) => m.active && m.telegramChatId?.trim())
      .map((m) => m.telegramChatId.trim());

    const res = await sendTelegramToTargets(
      `ارتقای ربات هوشمند گلخانه کوچک من 🤖✨`,
      [
        `<blockquote>🎉 <b>کیبورد هوشمند فارسی</b> و <b>دکمه‌های شیشه‌ای مدیریت گلخانه</b> برای حساب شما فعال شد!</blockquote>`,
        `✅ از این پس می‌توانید بدون نیاز به باز کردن مرورگر، مستقیماً از طریق دکمه‌های پایین صفحه تلگرام:`,
        `• وضعیت لحظه‌ای گلخانه‌ها را ببینید (<b>📊 وضعیت گلخانه‌ها</b>)`,
        `• آبیاری، غبارپاشی و چرخش گلدان‌ها را با یک لمس ثبت کنید`,
        `• شوفاژ گلخانه را از راه دور روشن یا خاموش نمایید`
      ].join('\n'),
      activeChatIds.length > 0 ? activeChatIds : undefined,
      undefined,
      true
    );

    if (res.ok) {
      setTestStatus({
        loading: false,
        message: `✅ منوی دستورات و کیبورد فارسی با موفقیت در تلگرام فعال شد!`,
        isError: false
      });
    } else {
      setTestStatus({
        loading: false,
        message: `❌ ${res.errorMsg || 'ابتدا توکن و Chat ID را بررسی کنید.'}`,
        isError: true
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-4 space-y-3.5 max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
          <div className="min-w-0">
            <h3 className="font-heading text-[15.5px] font-extrabold text-[#1C2822] truncate">
              ⚙️ مرکز مدیریت گلخانه‌ها و اعضا
            </h3>
            <p className="text-[10.5px] text-[#5A655E] truncate mt-0.5">
              {isSuperAdmin
                ? 'دسترسی مالک ارشد (مدیریت کل گلخانه‌ها، باغچه‌ها، مجوزهای اعضا و تلگرام)'
                : `مدیریت اختصاصی «${currentSpace.name}»`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1.5 bg-[#F6F3EC] p-1 rounded-2xl border border-[#E8E2D5] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`py-2 rounded-xl text-[11px] transition-all whitespace-nowrap ${
              activeTab === 'members'
                ? 'font-bold bg-[#FDFBF7] text-[#1C2822] warm-shadow'
                : 'font-semibold text-[#5A655E]'
            }`}
          >
            👥 اعضا و دسترسی
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spaces')}
            className={`py-2 rounded-xl text-[11px] transition-all whitespace-nowrap ${
              activeTab === 'spaces'
                ? 'font-bold bg-[#FDFBF7] text-[#1C2822] warm-shadow'
                : 'font-semibold text-[#5A655E]'
            }`}
          >
            🪴 باغچه‌ها و فضا
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telegram')}
            className={`py-2 rounded-xl text-[11px] transition-all whitespace-nowrap ${
              activeTab === 'telegram'
                ? 'font-bold bg-[#FDFBF7] text-[#1C2822] warm-shadow'
                : 'font-semibold text-[#5A655E]'
            }`}
          >
            📲 تلگرام و بکاپ
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 space-y-3.5 pr-0.5">
          {/* ================= تب ۱: مدیریت اعضا، مجوزهای ریزدانه و دعوت به ربات ================= */}
          {activeTab === 'members' && (
            <div className="space-y-3.5">
              {activeInviteMember && (
                <div className="bg-[#E6F0EB] border-2 border-[#2E5A44] rounded-2xl p-3 space-y-2.5 warm-shadow">
                  <div className="flex items-center justify-between">
                    <div className="text-[12.5px] font-bold text-[#1C2822]">
                      🎁 کارت دعوت و لینک‌های «{activeInviteMember.name}»
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveInviteMember(null)}
                      className="text-[11px] font-bold text-[#5A655E] px-1.5"
                    >
                      ✕ بستن
                    </button>
                  </div>

                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#2B7A9B]">
                        🤖 ۱. لینک اتصال خودکار به ربات تلگرام:
                      </span>
                      {copiedFlag === 'bot' && (
                        <span className="text-[10px] font-bold text-[#2E5A44]">✅ کپی شد!</span>
                      )}
                    </div>

                    {!botUsername.trim() ? (
                      <div className="space-y-1.5">
                        <p className="text-[10.5px] text-[#C85A32]">
                          برای ساخت لینک دعوت ربات، آیدی ربات تلگرام خود را وارد کنید (مثلاً: SinaGreenhouse_bot):
                        </p>
                        <div className="flex gap-1.5">
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
                            className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          dir="ltr"
                          className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-mono text-[#1C2822] break-all select-all"
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
                            className="py-1.5 px-2 rounded-lg bg-[#2B7A9B] text-white text-[11px] font-bold"
                          >
                            {copiedFlag === 'bot' ? '✅ لینک ربات کپی شد' : '📋 کپی لینک ربات'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleShareViaTelegramApp(
                                buildMemberBotInviteUrl(activeInviteMember),
                                `سلام ${activeInviteMember.name} عزیز 🌱؛ لطفاً روی این لینک بزن و در ربات گلخانه دکمه Start را فشار بده تا کیبورد هوشمند و نوتیفیکیشن‌های گلخانه برایت فعال شود:`
                              )
                            }
                            className="py-1.5 px-2 rounded-lg bg-[#2E5A44] text-white text-[11px] font-bold"
                          >
                            ✈️ ارسال مستقیم در تلگرام
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#2E5A44]">
                        🔗 ۲. لینک ورود «{activeInviteMember.name}» به محیط برنامه:
                      </span>
                      {copiedFlag === 'app' && (
                        <span className="text-[10px] font-bold text-[#2E5A44]">✅ کپی شد!</span>
                      )}
                    </div>
                    <div
                      dir="ltr"
                      className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-mono text-[#1C2822] break-all select-all"
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
                        className="py-1.5 px-2 rounded-lg bg-[#2E5A44] text-white text-[10.5px] font-bold"
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
                        className="py-1.5 px-2 rounded-lg bg-[#2B7A9B] text-white text-[10.5px] font-bold"
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
                        className="py-1.5 px-2 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] text-[10.5px] font-bold"
                      >
                        📤 اشتراک
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* فرم تعریف عضو جدید همراه با مجوزهای ریزدانه و پین‌کد */}
              <form
                onSubmit={handleAddMember}
                className="bg-[#F6F3EC]/90 border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5"
              >
                <div className="text-[12px] font-bold text-[#1C2822]">
                  ➕ تعریف عضو جدید و تنظیم دقیق مجوزها
                </div>

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5 min-w-0">
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                      نام شخص *
                    </label>
                    <input
                      required
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="مثلاً: مادر، برادر..."
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px]"
                    />
                  </div>

                  <div className="col-span-4 min-w-0">
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                      نقش پایه
                    </label>
                    <select
                      value={memberRole}
                      onChange={(e) => handleRoleChangeForNewMember(e.target.value as MemberRole)}
                      disabled={!isSuperAdmin}
                      className="w-full min-w-0 px-1.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
                    >
                      <option value="caretaker">🤝 همیار مراقبت</option>
                      <option value="viewer">👁️ بازدیدکننده</option>
                      <option value="space_admin">🏡 مدیر گلخانه</option>
                      {isSuperAdmin && <option value="super_admin">👑 مالک ارشد</option>}
                    </select>
                  </div>

                  <div className="col-span-3 min-w-0">
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                      پین (اختیاری)
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={memberPinCode}
                      onChange={(e) => setMemberPinCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="1234"
                      dir="ltr"
                      className="w-full min-w-0 px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] text-center font-mono"
                    />
                  </div>
                </div>

                {isSuperAdmin && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[10.5px] font-bold text-[#5A655E] mb-1">
                        ۱. دسترسی به کدام گلخانه‌ها؟
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {spaces.map((sp) => {
                          const selected = memberSpaces.includes(sp.id);
                          return (
                            <button
                              key={sp.id}
                              type="button"
                              onClick={() => toggleSpaceSelection(sp.id)}
                              className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border transition-all ${
                                selected
                                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                  : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
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
                        <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                          ۲. محدودسازی به باغچه‌های خاص (انتخاب نکردن = دسترسی به همه باغچه‌ها):
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {candidateGardensForNewMember.map((g) => {
                            const selected = memberGardens.includes(g.id);
                            return (
                              <button
                                key={g.id}
                                type="button"
                                onClick={() => toggleGardenSelectionForNewMember(g.id)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition-all ${
                                  selected
                                    ? 'bg-[#2B7A9B] text-white border-[#2B7A9B]'
                                    : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
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

                {/* ۴ مجوز ریزدانه برای عضو جدید */}
                <div className="bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5] space-y-1.5">
                  <div className="text-[10px] font-bold text-[#1C2822]">
                    🛡️ مجوزهای عملیاتی این عضو در گلخانه:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {[
                      { key: 'canWaterAndMist', label: '💧 ثبت آبیاری و غبار' },
                      { key: 'canEditPlants', label: '🌱 افزودن/ویرایش گیاه' },
                      { key: 'canManageSpaces', label: '🔥 شوفاژ و باغچه‌ها' },
                      { key: 'canDelete', label: '🗑️ مجوز حذف گلدان' }
                    ].map((permItem) => {
                      const k = permItem.key as keyof MemberPermissions;
                      const isChecked = memberPermissions[k];
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() =>
                            setMemberPermissions((prev) => ({ ...prev, [k]: !prev[k] }))
                          }
                          className={`py-1 px-2 rounded-lg border text-right font-bold flex items-center justify-between transition-all ${
                            isChecked
                              ? 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/30'
                              : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                          }`}
                        >
                          <span className="truncate">{permItem.label}</span>
                          <span>{isChecked ? '✓' : '✕'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-0.5 text-[11px] font-semibold text-[#1C2822]">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyAlerts}
                      onChange={(e) => setNotifyAlerts(e.target.checked)}
                      className="accent-[#2E5A44]"
                    />
                    <span>ارسال هشدار تشنگی</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyActions}
                      onChange={(e) => setNotifyActions(e.target.checked)}
                      className="accent-[#2E5A44]"
                    />
                    <span>ارسال گزارش عملیات</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-[#2E5A44] text-white text-[12px] font-bold warm-shadow active:scale-[0.99] transition-transform"
                >
                  + افزودن عضو و نمایش لینک دعوت اختصاصی
                </button>
              </form>

              <div className="bg-[#E8F4F8] border border-[#2B7A9B]/30 rounded-2xl p-2.5 flex items-center justify-between gap-2">
                <div className="text-[10.5px] text-[#1C2822] leading-snug">
                  💡 پس از اینکه عضو لینک دعوت را باز کرد و در ربات <strong>Start</strong> زد، دکمه روبرو را بزنید:
                </div>
                <button
                  type="button"
                  onClick={handleDetectTelegramUsers}
                  className="px-2.5 py-1.5 rounded-xl bg-[#2B7A9B] text-white text-[10.5px] font-bold shrink-0 whitespace-nowrap"
                >
                  {loadingSubs ? '⏳ بررسی...' : '🔄 اتصال خودکار آیدی'}
                </button>
              </div>

              {subFeedback && (
                <div className="p-2.5 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/30 text-[11px] font-bold text-[#2E5A44]">
                  {subFeedback}
                </div>
              )}

              {botSubscribers.length > 0 && (
                <div className="bg-[#FDFBF7] border border-[#2B7A9B]/30 rounded-2xl p-2.5 space-y-1.5">
                  <div className="text-[10.5px] font-bold text-[#2B7A9B]">
                    👥 افرادی که اخیراً در ربات تلگرام شما Start زده‌اند:
                  </div>
                  {botSubscribers.map((sub) => (
                    <div
                      key={sub.chatId}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] text-[11px] flex items-center justify-between gap-2"
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
                          setSubFeedback(`✅ آیدی تلگرام با موفقیت متصل شد!`);
                        }}
                        className="px-2 py-1 rounded-lg bg-white border border-[#E8E2D5] text-[10px] font-bold text-[#2E5A44] shrink-0"
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

              <div className="space-y-2">
                <div className="text-[12px] font-bold text-[#1C2822]">
                  📋 لیست اعضا و مدیریت دسترسی‌ها ({toPersianNum(visibleMembers.length)} نفر)
                </div>

                {visibleMembers.map((m) => {
                  const roleBadge =
                    m.role === 'super_admin'
                      ? '👑 مالک ارشد'
                      : m.role === 'space_admin'
                      ? '🏡 مدیر گلخانه'
                      : m.role === 'viewer'
                      ? '👁️ بازدیدکننده'
                      : '🤝 همیار مراقبت';

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

                  return (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border transition-all space-y-2 ${
                        m.active
                          ? 'bg-[#FDFBF7] border-[#E8E2D5]'
                          : 'bg-[#F6F3EC]/60 border-[#E8E2D5] opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-bold text-[#1C2822] flex flex-wrap items-center gap-1.5">
                            <span>{m.name}</span>
                            <span className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold">
                              {roleBadge}
                            </span>
                            {m.pinCode && (
                              <span className="px-1.5 py-0.5 rounded-md bg-[#FEF6E7] text-[#B47B26] text-[9.5px] font-bold">
                                🔒 پین فعال
                              </span>
                            )}
                          </div>
                          <div className="text-[10.5px] text-[#5A655E] mt-0.5">
                            گلخانه: <strong className="text-[#1C2822]">{spaceNames}</strong>
                            {' • '}
                            باغچه: <strong className="text-[#2E5A44]">{assignedGardenNames}</strong>
                          </div>
                          <div className="text-[10.5px] mt-0.5">
                            وضعیت تلگرام:{' '}
                            {m.telegramChatId ? (
                              <span className="text-[#2E5A44] font-bold">
                                ✅ متصل ({m.telegramChatId})
                              </span>
                            ) : (
                              <span className="text-[#C85A32] font-semibold">
                                ⏳ منتظر ورود با لینک دعوت ربات
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
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                isPermExpanded
                                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                                  : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                              }`}
                            >
                              🛡️ دسترسی‌ها
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleMemberActive(m.id)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              m.active
                                ? 'bg-[#E6F0EB] text-[#2E5A44]'
                                : 'bg-[#FCEEE9] text-[#C85A32]'
                            }`}
                          >
                            {m.active ? 'فعال ✓' : 'غیرفعال'}
                          </button>
                          {m.id !== 'm_owner_sina' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m.id)}
                              className="px-2 py-1 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10px] font-bold"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>

                      {/* کشوی ویرایش زنده دسترسی‌ها، باغچه‌ها و پین‌کد برای این عضو */}
                      {isPermExpanded && isSuperAdmin && (
                        <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2 text-[10.5px]">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                                تغییر نقش پایه:
                              </label>
                              <select
                                value={m.role}
                                disabled={m.id === 'm_owner_sina'}
                                onChange={(e) => {
                                  const nextRole = e.target.value as MemberRole;
                                  handleUpdateExistingMember(m.id, {
                                    role: nextRole,
                                    permissions: getDefaultMemberPermissions(nextRole)
                                  });
                                }}
                                className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
                              >
                                <option value="super_admin">👑 مالک ارشد</option>
                                <option value="space_admin">🏡 مدیر گلخانه</option>
                                <option value="caretaker">🤝 همیار مراقبت</option>
                                <option value="viewer">👁️ بازدیدکننده</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                                پین‌کد ۴ رقمی (جهت قفل):
                              </label>
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={4}
                                value={m.pinCode || ''}
                                onChange={(e) =>
                                  handleUpdateExistingMember(m.id, {
                                    pinCode: e.target.value.replace(/\D/g, '').slice(0, 4) || undefined
                                  })
                                }
                                placeholder="بدون پین"
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
                                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
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

                          {/* تغییر باغچه‌های مجاز */}
                          {memberCandidateGardens.length > 1 && (
                            <div>
                              <div className="text-[9.5px] font-bold text-[#5A655E] mb-1">
                                فیلتر باغچه‌ها (خالی = دسترسی به همه باغچه‌ها):
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {memberCandidateGardens.map((g) => {
                                  const hasG = (m.assignedGardens || []).includes(g.id);
                                  return (
                                    <button
                                      key={g.id}
                                      type="button"
                                      onClick={() => handleToggleExistingMemberGarden(m, g.id)}
                                      className={`px-2 py-0.5 rounded-lg text-[9.5px] font-semibold border ${
                                        hasG
                                          ? 'bg-[#2B7A9B] text-white border-[#2B7A9B]'
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
                            {[
                              { key: 'canWaterAndMist', label: '💧 آبیاری و غبارپاشی' },
                              { key: 'canEditPlants', label: '🌱 افزودن/ویرایش گیاه' },
                              { key: 'canManageSpaces', label: '🔥 شوفاژ و باغچه‌ها' },
                              { key: 'canDelete', label: '🗑️ مجوز حذف گلدان' }
                            ].map((item) => {
                              const k = item.key as keyof MemberPermissions;
                              const on = effectivePerms[k];
                              return (
                                <button
                                  key={k}
                                  type="button"
                                  disabled={m.id === 'm_owner_sina'}
                                  onClick={() => handleToggleExistingMemberPerm(m, k)}
                                  className={`py-1 px-2 rounded-lg border text-[10px] font-bold flex items-center justify-between ${
                                    on
                                      ? 'bg-[#E6F0EB] text-[#2E5A44] border-[#2E5A44]/30'
                                      : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                                  }`}
                                >
                                  <span>{item.label}</span>
                                  <span>{on ? '✓' : '✕'}</span>
                                </button>
                              );
                            })}
                          </div>

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
                            className="w-full py-1.5 rounded-lg bg-[#2B7A9B] text-white text-[10.5px] font-bold"
                          >
                            👤 پیش‌نمایش برنامه از دید «{m.name}»
                          </button>
                        </div>
                      )}

                      <div className="pt-1.5 border-t border-[#E8E2D5]/80 flex flex-wrap items-center justify-between gap-1.5 text-[10.5px]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleMemberAlertType(m.id, 'notifyAlerts')}
                            className={`px-2 py-0.5 rounded-md border ${
                              m.notifyAlerts
                                ? 'bg-[#FEF6E7] text-[#B47B26] border-[#B47B26]/30 font-bold'
                                : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                            }`}
                          >
                            {m.notifyAlerts ? '🔔 هشدار' : '🔕 بی‌صدا'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMemberAlertType(m.id, 'notifyActions')}
                            className={`px-2 py-0.5 rounded-md border ${
                              m.notifyActions
                                ? 'bg-[#E8F4F8] text-[#2B7A9B] border-[#2B7A9B]/30 font-bold'
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
                            className="px-2 py-1 rounded-lg bg-[#2B7A9B] text-white font-bold whitespace-nowrap active:scale-95 transition-transform"
                          >
                            🤖 دعوت به ربات
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

          {/* ================= تب ۲: باغچه‌ها و فضاها ================= */}
          {activeTab === 'spaces' && (
            <div className="space-y-4">
              <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5 overflow-hidden">
                <div className="text-[12.5px] font-bold text-[#1C2822]">
                  🪴 مدیریت باغچه‌های «{currentSpace.name}»
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
                        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              value={editingGardenName}
                              onChange={(e) => setEditingGardenName(e.target.value)}
                              className="w-full min-w-0 px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[12px] font-bold"
                            />
                            <div className="flex items-center justify-between gap-1.5">
                              <select
                                value={editingGardenLight}
                                onChange={(e) =>
                                  setEditingGardenLight(
                                    e.target.value as 'high' | 'medium' | 'low'
                                  )
                                }
                                className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                              >
                                <option value="high">نور زیاد ☀️</option>
                                <option value="medium">نور متوسط ⛅</option>
                                <option value="low">نور کم 🌥️</option>
                              </select>
                              <button
                                type="button"
                                onClick={() => handleSaveGardenEdit(g.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#2E5A44] text-white text-[11px] font-bold shrink-0"
                              >
                                ذخیره ✓
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingGardenId(null)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] text-[#5A655E] text-[11px] shrink-0"
                              >
                                انصراف
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[12.5px] font-bold text-[#1C2822] truncate">
                                {g.name}
                              </div>
                              <div className="persian-num text-[10.5px] text-[#5A655E]">
                                نور:{' '}
                                {g.lightLevel === 'high'
                                  ? 'زیاد ☀️'
                                  : g.lightLevel === 'medium'
                                  ? 'متوسط ⛅'
                                  : 'کم 🌥️'}{' '}
                                • {toPersianNum(plantCount)} گلدان
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
                                className="px-2.5 py-1 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10.5px] font-bold"
                              >
                                ✏️ ویرایش
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteGarden(g.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10.5px] font-bold"
                              >
                                🗑️ حذف
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2 mt-1">
                  <div className="text-[11px] font-bold text-[#1C2822]">
                    ➕ افزودن باغچه جدید به «{currentSpace.name}»:
                  </div>
                  <input
                    type="text"
                    value={newGardenName}
                    onChange={(e) => setNewGardenName(e.target.value)}
                    placeholder="نام باغچه جدید (مثلاً: باغچه روی میز)..."
                    className="w-full min-w-0 px-3 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] focus:outline-none focus:border-[#2E5A44]"
                  />
                  <div className="grid grid-cols-12 gap-2">
                    <select
                      value={newGardenLight}
                      onChange={(e) => setNewGardenLight(e.target.value as 'high' | 'medium' | 'low')}
                      className="col-span-7 min-w-0 px-2.5 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold"
                    >
                      <option value="high">☀️ نور محیط: زیاد</option>
                      <option value="medium">⛅ نور محیط: متوسط</option>
                      <option value="low">🌥️ نور محیط: کم</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddGarden}
                      className="col-span-5 py-2 px-3 rounded-xl bg-[#2E5A44] text-white text-[11.5px] font-bold whitespace-nowrap warm-shadow"
                    >
                      + ساخت باغچه
                    </button>
                  </div>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5 overflow-hidden">
                  <div className="text-[12.5px] font-bold text-[#1C2822]">
                    🏢🏡 مدیریت گلخانه‌ها (فضاهای اصلی)
                  </div>
                  <div className="space-y-2">
                    {spaces.map((sp) => {
                      const isEditingSp = editingSpaceId === sp.id;
                      return (
                        <div
                          key={sp.id}
                          className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 flex items-center justify-between gap-2"
                        >
                          {isEditingSp ? (
                            <div className="flex items-center gap-1.5 w-full">
                              <input
                                value={editingSpaceName}
                                onChange={(e) => setEditingSpaceName(e.target.value)}
                                className="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[12px] font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveSpaceEdit(sp.id)}
                                className="px-2.5 py-1 rounded-lg bg-[#2E5A44] text-white text-[11px] font-bold shrink-0"
                              >
                                ذخیره
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-[12px] font-bold text-[#1C2822] truncate">
                                {sp.icon} {sp.name}
                              </span>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSpaceId(sp.id);
                                    setEditingSpaceName(sp.name);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold"
                                >
                                  ✏️ تغییر نام
                                </button>
                                {spaces.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => onDeleteSpace(sp.id)}
                                    className="px-2 py-1 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10px] font-bold"
                                  >
                                    🗑️ حذف
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5] space-y-2 mt-1">
                    <div className="text-[11px] font-bold text-[#1C2822]">
                      ➕ افزودن فضای گلخانه جدید:
                    </div>
                    <div className="grid grid-cols-12 gap-1.5 items-center">
                      <select
                        value={newSpaceIcon}
                        onChange={(e) => setNewSpaceIcon(e.target.value)}
                        className="col-span-3 px-1.5 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[13px] text-center"
                      >
                        <option value="🏡">🏡</option>
                        <option value="🏢">🏢</option>
                        <option value="🌿">🌿</option>
                        <option value="☀️">☀️</option>
                      </select>
                      <input
                        type="text"
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="نام گلخانه جدید..."
                        className="col-span-6 min-w-0 px-2.5 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px]"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpace}
                        className="col-span-3 py-2 px-2 rounded-xl bg-[#2E5A44] text-white text-[11.5px] font-bold whitespace-nowrap"
                      >
                        + ساخت
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#E8F4F8]/70 p-3 rounded-2xl border border-[#2B7A9B]/25 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#1C2822]">
                    👁️ پیش‌نمایش حالت نمایشگاهی (بازدیدکننده)
                  </div>
                  <div className="text-[10.5px] text-[#5A655E]">
                    مشاهده شناسنامه گیاهان بدون دکمه‌های مدیریتی و آبیاری
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSwitchPreviewRole('visitor');
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#2B7A9B] text-white text-[11px] font-bold shrink-0"
                >
                  تست بازدیدکننده
                </button>
              </div>
            </div>
          )}

          {/* ================= تب ۳: تلگرام دوطرفه، بکاپ، کلود و شروع از صفر ================= */}
          {activeTab === 'telegram' && (
            <div className="space-y-3.5">
              <div className="bg-[#E6F0EB]/70 p-3 rounded-2xl border border-[#2E5A44]/20 space-y-2">
                <div className="text-[12px] font-bold text-[#1C2822]">
                  🤖 مرکز فرماندهی دوطرفه ربات تلگرام «{currentSpace.name}»
                </div>
                <p className="text-[10.5px] text-[#5A655E] leading-relaxed">
                  گزارش‌ها شامل <strong>دکمه‌های شیشه‌ای ثبت آبیاری، غبارپاشی و چرخش</strong> هستند تا مستقیم از داخل تلگرام بتوانید عملیات را ثبت کنید:
                </p>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <button
                    type="button"
                    disabled={testStatus.loading}
                    onClick={() => handleManualTelegramReport('morning')}
                    className="py-2.5 px-2 rounded-xl bg-[#2E5A44] text-white text-[11px] font-bold warm-shadow disabled:opacity-50"
                  >
                    ☀️ ارسال پنل تعاملی صبح
                  </button>
                  <button
                    type="button"
                    disabled={testStatus.loading}
                    onClick={() => handleManualTelegramReport('noon_escalation')}
                    className="py-2.5 px-2 rounded-xl bg-[#C85A32] text-white text-[11px] font-bold warm-shadow disabled:opacity-50"
                  >
                    ⚠️ ارسال یادآور پیگیری ظهر
                  </button>
                </div>

                <button
                  type="button"
                  disabled={testStatus.loading}
                  onClick={handleInstallBotKeyboardAndMenu}
                  className="w-full py-2 px-3 rounded-xl bg-[#2B7A9B] text-white text-[11px] font-bold warm-shadow disabled:opacity-50"
                >
                  🎛️ نصب منوی دستورات و ارسال کیبورد فارسی به تلگرام اعضا
                </button>

                {testStatus.message && (
                  <div
                    className={`mt-2 p-2.5 rounded-xl text-[11px] font-bold ${
                      testStatus.isError
                        ? 'bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/30'
                        : 'bg-[#FDFBF7] text-[#2E5A44] border border-[#2E5A44]/30'
                    }`}
                  >
                    {testStatus.message}
                  </div>
                )}
              </div>

              <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2">
                <div className="text-[12px] font-bold text-[#1C2822]">
                  💾 پشتیبان‌گیری و حفاظت از اطلاعات گلخانه
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="py-2 px-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[#1C2822] text-[11px] font-bold warm-shadow"
                  >
                    📥 دانلود فایل پشتیبان
                  </button>
                  <label className="py-2 px-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[#2B7A9B] text-[11px] font-bold text-center cursor-pointer warm-shadow">
                    📤 بازیابی از فایل پشتیبان
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {isSuperAdmin && onResetGreenhouse && (
                <div className="bg-[#FCEEE9]/60 p-3 rounded-2xl border border-[#C85A32]/30 space-y-2">
                  <div className="text-[12px] font-bold text-[#C85A32]">
                    🧹 پاکسازی داده‌های پیش‌فرض و شروع از صفر (Zero-State)
                  </div>
                  <p className="text-[10.5px] text-[#5A655E] leading-relaxed">
                    می‌توانید فقط گلدان‌های پیش‌فرض را خالی کنید (با حفظ فضاها و باغچه‌ها) یا کل گلخانه را به یک فضای خام اولیه بازنشانی نمایید:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            '⚠️ آیا تمام گلدان‌های فعلی پاک شوند تا ثبت گلدان‌ها را از کد #۰۱ شروع کنید؟ (گلخانه‌ها و باغچه‌ها حفظ می‌شوند)'
                          )
                        ) {
                          onResetGreenhouse('plants_only');
                        }
                      }}
                      className="py-2 px-2 rounded-xl bg-[#FDFBF7] border border-[#C85A32]/40 text-[#C85A32] text-[10.5px] font-bold warm-shadow"
                    >
                      🪴 فقط حذف همه گلدان‌ها
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
                      className="py-2 px-2 rounded-xl bg-[#C85A32] text-white text-[10.5px] font-bold warm-shadow"
                    >
                      🔄 شروع ۱۰۰٪ خام از صفر
                    </button>
                  </div>
                </div>
              )}

              {isSuperAdmin && (
                <div className="bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[12px] font-bold text-[#1C2822]">
                      ☁️ تنظیمات ربات تلگرام، Supabase و هوش مصنوعی
                    </label>
                    <button
                      type="button"
                      onClick={async () => {
                        const granted = await requestBrowserPushPermission();
                        onUpdateCloudConfig({ ...cloudConfig, browserPushEnabled: granted });
                      }}
                      className="text-[10.5px] font-bold text-[#2B7A9B] underline"
                    >
                      {cloudConfig.browserPushEnabled ? '🔔 اعلان مرورگر فعال' : 'فعالسازی اعلان مرورگر'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cloudConfig.telegramBotToken}
                      onChange={(e) =>
                        onUpdateCloudConfig({ ...cloudConfig, telegramBotToken: e.target.value })
                      }
                      placeholder="Telegram Bot Token"
                      dir="ltr"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                    />
                    <input
                      type="text"
                      value={botUsername}
                      onChange={(e) => {
                        const clean = e.target.value.replace('@', '').trim();
                        setBotUsername(clean);
                        onUpdateCloudConfig({ ...cloudConfig, telegramBotUsername: clean });
                      }}
                      placeholder="Bot Username (بدون @)"
                      dir="ltr"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                    />
                  </div>

                  <input
                    type="text"
                    value={cloudConfig.telegramChatId}
                    onChange={(e) =>
                      onUpdateCloudConfig({ ...cloudConfig, telegramChatId: e.target.value })
                    }
                    placeholder="Default Chat ID"
                    dir="ltr"
                    className="w-full min-w-0 px-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={cloudConfig.supabaseUrl}
                      onChange={(e) =>
                        onUpdateCloudConfig({ ...cloudConfig, supabaseUrl: e.target.value })
                      }
                      placeholder="Supabase URL (اختیاری)"
                      dir="ltr"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                    />
                    <input
                      type="password"
                      value={cloudConfig.supabaseAnonKey}
                      onChange={(e) =>
                        onUpdateCloudConfig({ ...cloudConfig, supabaseAnonKey: e.target.value })
                      }
                      placeholder="Supabase Anon Key"
                      dir="ltr"
                      className="w-full min-w-0 px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                    />
                  </div>

                  <input
                    type="password"
                    value={geminiKey}
                    onChange={(e) => {
                      setGeminiKey(e.target.value);
                      saveGeminiApiKey(e.target.value);
                    }}
                    placeholder="Gemini API Key (اختیاری - جهت تشخیص عکس و تولید SVG)"
                    dir="ltr"
                    className="w-full min-w-0 px-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13px] shrink-0 warm-shadow"
        >
          ذخیره و بازگشت به گلخانه ✓
        </button>
      </div>
    </div>
  );
};