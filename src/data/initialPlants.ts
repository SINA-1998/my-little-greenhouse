export interface PlantCareLog {
  id: string;
  action: string;
  by: string;
  time: string;
  persianDate: string;
  note?: string;
}

export interface PlantClinicItem {
  symptom: string;
  cause: string;
  fix: string;
}

export interface CuttingItem {
  id: string;
  medium: 'در آب' | 'در پرلیت و پیت‌ماس' | 'تقسیم ریشه/پاجوش';
  startDate: string;
  note?: string;
}

export interface SpaceEntity {
  id: string;
  name: string;
  icon: string;
  radiatorOn: boolean;
}

export interface GardenEntity {
  id: string;
  spaceId: string;
  name: string;
  lightLevel: 'high' | 'medium' | 'low';
}

export type MemberRole = 'super_admin' | 'space_admin' | 'caretaker' | 'viewer';

export interface MemberPermissions {
  canWaterAndMist: boolean;
  canEditPlants: boolean;
  canManageSpaces: boolean;
  canDelete: boolean;
}

export interface MemberEntity {
  id: string;
  name: string;
  role: MemberRole;
  assignedSpaces: string[];
  assignedGardens?: string[];
  pinCode?: string;
  permissions?: MemberPermissions;
  telegramChatId: string;
  telegramUsername?: string;
  notifyAlerts: boolean;
  notifyActions: boolean;
  active: boolean;
}

export const getDefaultMemberPermissions = (role: MemberRole): MemberPermissions => {
  switch (role) {
    case 'super_admin':
    case 'space_admin':
      return {
        canWaterAndMist: true,
        canEditPlants: true,
        canManageSpaces: true,
        canDelete: true
      };
    case 'caretaker':
      return {
        canWaterAndMist: true,
        canEditPlants: false,
        canManageSpaces: false,
        canDelete: false
      };
    case 'viewer':
    default:
      return {
        canWaterAndMist: false,
        canEditPlants: false,
        canManageSpaces: false,
        canDelete: false
      };
  }
};

export type PlantStatusType = 'ok' | 'thirsty' | 'mist' | 'locked' | 'recovery';

export type PotShapeType =
  | 'round'
  | 'hex'
  | 'trough'
  | 'round_smooth'
  | 'round_ribbed'
  | 'cylinder_modern'
  | 'bowl_saucer'
  | 'conical_tall'
  | 'square_minimal'
  | 'square_patterned'
  | 'faceted_gem'
  | 'chalice_urn'
  | 'trough_fluted'
  | 'hanging_basket'
  | 'bonsai_tray'
  | 'amphora_clay'
  | 'hexagon_concrete'
  | 'wood_stand_modern'
  | 'egg_planter'
  | 'footed_cauldron'
  | 'lotus_scalloped'
  | 'tiered_pagoda'
  | 'woven_belly';

export type PotColorType =
  | 'white'
  | 'marble_white'
  | 'cream'
  | 'terrazzo_cream'
  | 'sand'
  | 'khaki'
  | 'mustard_ochre'
  | 'terracotta_light'
  | 'terracotta'
  | 'copper_bronze'
  | 'blush'
  | 'wood_brown'
  | 'mint'
  | 'olive'
  | 'forest_green'
  | 'cobalt'
  | 'grey'
  | 'concrete'
  | 'charcoal'
  | 'black';

export interface PlantEntity {
  id: string;
  spaceId?: string;
  code: string;
  name: string;
  sci: string;
  family: string;
  origin: string;
  nickname: string;
  botanyStory: string;
  garden: string;
  shape3D: string;
  potColor: PotColorType;
  potVolumeLiters?: number;
  plantHeightCm?: number;
  potShape?: PotShapeType;
  isComboPlanter?: boolean;
  companionSpecies?: string[];
  customSvgMarkup?: string;
  waterCycleDays: number;
  daysSinceWater: number;
  lastWateredAt?: number;
  waterCount: number;
  needsRotation: boolean;
  lastRotatedDate?: string;
  doseMl: number;
  doseCup: string;
  mistNeed: string;
  mistCycleDays?: number;
  daysSinceMist?: number;
  lastMistedAt?: number;
  needsMistToday: boolean;
  fertDue: boolean;
  statusType: PlantStatusType;
  light: string;
  soilFert: string;
  pruningGuide?: string;
  propagationGuide?: string;
  repotCycleMonths?: number;
  lastRepottedDate?: string;
  lastRepottedMonthsAgo?: number;
  lastPrunedDate?: string;
  cuttings?: CuttingItem[];
  clinic: PlantClinicItem[];
  history: PlantCareLog[];
  archived?: boolean;
  archiveReason?: string;
  archiveDate?: string;
}

export const formatPersianDate = (daysAgo: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
};

export const initialSpacesData: SpaceEntity[] = [
  { id: 'office', name: 'گلخانه محل کار', icon: '🏢', radiatorOn: false },
  { id: 'home', name: 'گلخانه خانه', icon: '🏡', radiatorOn: false }
];

export const initialGardensData: GardenEntity[] = [
  { id: 'window', spaceId: 'office', name: 'باغچه کنار پنجره', lightLevel: 'high' },
  { id: 'lounge', spaceId: 'office', name: 'باغچه میز پذیرایی', lightLevel: 'medium' },
  { id: 'home_window', spaceId: 'home', name: 'لب پنجره داخل خانه', lightLevel: 'high' },
  { id: 'home_living', spaceId: 'home', name: 'کنار مبل پذیرایی', lightLevel: 'medium' },
  { id: 'home_cabinet', spaceId: 'home', name: 'روی کمد و استند تراس', lightLevel: 'medium' },
  { id: 'home_terrace', spaceId: 'home', name: 'حیاط و تراس (گل‌های رز)', lightLevel: 'high' }
];

const defaultChatId = (import.meta.env.VITE_TELEGRAM_CHAT_ID as string | undefined)
  ? String(import.meta.env.VITE_TELEGRAM_CHAT_ID)
  : '';

export const initialMembersData: MemberEntity[] = [
  {
    id: 'm_owner_sina',
    name: 'سینا (مالک ارشد)',
    role: 'super_admin',
    assignedSpaces: ['office', 'home'],
    telegramChatId: defaultChatId,
    notifyAlerts: true,
    notifyActions: true,
    active: true
  }
];

// شروع با گلخانه خام تا تمام گیاهان با ابعاد، حجم خاک و مشخصات واقعی توسط کاربر ثبت شوند
export const initialPlantsData: PlantEntity[] = [];