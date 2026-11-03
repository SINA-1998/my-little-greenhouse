import React, { useId } from 'react';
import { type PotColorType, type PotShapeType } from '../../data/initialPlants';

// ============================================================================
// ۱. آیکون‌های رابط کاربری (UI Icons)
// ============================================================================

export const IconLeafLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21C12 21 19 16.5 19 9.5C19 5.35786 15.866 2 12 2C8.13401 2 5 5.35786 5 9.5C5 16.5 12 21 12 21Z"
      fill="#2E5A44"
      fillOpacity="0.18"
      stroke="#2E5A44"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 21V10M12 14L15.5 11M12 11L9 8.5"
      stroke="#2E5A44"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconAddSprout: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M7 20h10" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path d="M12 20v-8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    <path
      d="M12 13c-3.5 0-6-2.2-6-5.8 3.5 0 6 2.2 6 5.8Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M19 11v4M17 13h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

export const IconWaterDrop: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconMistSpray: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 14C4 11.7909 5.79086 10 8 10H15C17.2091 10 19 11.7909 19 14C19 16.2091 17.2091 18 15 18H8C5.79086 18 4 16.2091 4 14Z"
      fill="currentColor"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <circle cx="20" cy="7" r="1.2" fill="currentColor" />
    <circle cx="16" cy="5" r="1.2" fill="currentColor" />
    <circle cx="12" cy="6" r="1.2" fill="currentColor" />
  </svg>
);

export const IconShieldLock: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="11" r="2" fill="currentColor" />
  </svg>
);

export const IconRotate90: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 3v5h-5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IconBell: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
      fill="#2E5A44"
      fillOpacity="0.15"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const IconSettings: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="3.2"
      fill="#2E5A44"
      fillOpacity="0.2"
      stroke="currentColor"
      strokeWidth="1.75"
    />
    <path
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      stroke="currentColor"
      strokeWidth="1.75"
    />
  </svg>
);

// ============================================================================
// ۲. بانک ۱۷ رنگ و بافت گلدان + ۲۰ مدل هندسی گلدان (فاز ۱۱)
// ============================================================================

export type PotTextureType =
  | 'matte'
  | 'glossy'
  | 'porous_clay'
  | 'concrete_grain'
  | 'terrazzo_speckled'
  | 'wood_grain'
  | 'marble_veined';

export interface PotColorMetadata {
  id: PotColorType;
  nameFa: string;
  shortNameFa: string;
  nameEn: string;
  baseHex: string;
  shadowHex: string;
  highlightHex: string;
  rimHex: string;
  insideHex: string;
  texture: PotTextureType;
  heatAbsorption: 'low' | 'medium' | 'high';
  styleNote: string;
}

export interface PotModelMetadata {
  id: PotShapeType;
  nameFa: string;
  shortNameFa: string;
  nameEn: string;
  category: 'classic' | 'modern' | 'specialty' | 'hanging' | 'architectural';
  depthProfile: 'shallow' | 'medium' | 'deep';
  stabilityScore: number;
  moistureRetention: 'low' | 'medium' | 'high';
  bestForDescription: string;
  dimensionsRatio: { topWidth: number; bottomWidth: number; height: number };
}

// پالت متقارن ۲۰ رنگ و بافت سطحی گلدان (۲ ردیف ۱۰ تایی)
export const POT_COLOR_PALETTE: Record<string, PotColorMetadata> = {
  white: {
    id: 'white',
    nameFa: 'سفید مات سرامیکی',
    shortNameFa: 'سفید مات',
    nameEn: 'Matte Ceramic White',
    baseHex: '#F8FAFC',
    shadowHex: '#CBD5E1',
    highlightHex: '#FFFFFF',
    rimHex: '#F1F5F9',
    insideHex: '#94A3B8',
    texture: 'matte',
    heatAbsorption: 'low',
    styleNote: 'افزایش‌دهنده درخشش برگ‌های تیره، ابلق و مشکی در فضاهای مدرن'
  },
  marble_white: {
    id: 'marble_white',
    nameFa: 'سفید مرمری رگه‌دار (کارارا)',
    shortNameFa: 'مرمر سفید',
    nameEn: 'Carrara White Marble',
    baseHex: '#F3F4F6',
    shadowHex: '#D1D5DB',
    highlightHex: '#FFFFFF',
    rimHex: '#E5E7EB',
    insideHex: '#9CA3AF',
    texture: 'marble_veined',
    heatAbsorption: 'low',
    styleNote: 'سنگ مرمر طبیعی با رگه‌های خاکستری محو؛ ایده‌آل برای گیاهان لوکس و کلکسیونی'
  },
  cream: {
    id: 'cream',
    nameFa: 'کرم کاغذی گرم',
    shortNameFa: 'کرم گرم',
    nameEn: 'Warm Parchment Cream',
    baseHex: '#F5EFE6',
    shadowHex: '#D8C9B8',
    highlightHex: '#FAF7F2',
    rimHex: '#EDE3D5',
    insideHex: '#A89886',
    texture: 'matte',
    heatAbsorption: 'low',
    styleNote: 'ایجاد هارمونی ملایم با برگ‌های سبز زیتونی و دکوراسیون مینیمال گرم'
  },
  terrazzo_cream: {
    id: 'terrazzo_cream',
    nameFa: 'کرم سنگ‌ریزه (تراتزو)',
    shortNameFa: 'تراتزو',
    nameEn: 'Venetian Terrazzo Cream',
    baseHex: '#EFECE6',
    shadowHex: '#C7C0B5',
    highlightHex: '#FAF8F5',
    rimHex: '#E5E0D8',
    insideHex: '#9C9488',
    texture: 'terrazzo_speckled',
    heatAbsorption: 'low',
    styleNote: 'بافت دکوراتیو با دانه‌های رنگی مرمر و گرانیت؛ مناسب گیاهان مدرن رومیزی'
  },
  sand: {
    id: 'sand',
    nameFa: 'شنی بیابانی',
    shortNameFa: 'شنی',
    nameEn: 'Desert Dune Sand',
    baseHex: '#DEC5A6',
    shadowHex: '#B59672',
    highlightHex: '#EEDCC6',
    rimHex: '#E5CFB3',
    insideHex: '#8A6F4E',
    texture: 'concrete_grain',
    heatAbsorption: 'low',
    styleNote: 'الهام‌گرفته از زیستگاه طبیعی نخل‌ها، آگاو، لیتوپس و کاکتوس‌های مکزیکی'
  },
  khaki: {
    id: 'khaki',
    nameFa: 'خاکی و بژ سنگی',
    shortNameFa: 'بژ سنگی',
    nameEn: 'Earthy Travertine Khaki',
    baseHex: '#C2B29F',
    shadowHex: '#94836F',
    highlightHex: '#D9CBB9',
    rimHex: '#CCC0AE',
    insideHex: '#6E604F',
    texture: 'matte',
    heatAbsorption: 'medium',
    styleNote: 'هماهنگی طبیعی با تنه‌های چوبی، بونسای‌ها و گیاهان برگ‌چرمی'
  },
  mustard_ochre: {
    id: 'mustard_ochre',
    nameFa: 'خردلی و کهربایی گرم',
    shortNameFa: 'کهربایی',
    nameEn: 'Warm Mustard Ochre',
    baseHex: '#D99B26',
    shadowHex: '#A67112',
    highlightHex: '#F2BC57',
    rimHex: '#E5AB3C',
    insideHex: '#78500A',
    texture: 'glossy',
    heatAbsorption: 'medium',
    styleNote: 'ایجاد کنتراست گرم و پرانرژی با برگ‌های سبز تیره، بنفش و برگ‌انجیری'
  },
  terracotta_light: {
    id: 'terracotta_light',
    nameFa: 'سفالی روشن مدیترانه‌ای',
    shortNameFa: 'سفال روشن',
    nameEn: 'Light Tuscan Clay',
    baseHex: '#DDA185',
    shadowHex: '#B27256',
    highlightHex: '#EBB9A2',
    rimHex: '#E3AC92',
    insideHex: '#8C543C',
    texture: 'porous_clay',
    heatAbsorption: 'low',
    styleNote: 'بافت سفالی تنفس‌پذیر با تناژ روشن برای گیاهان مدیترانه‌ای، اسطوخودوس و رزماری'
  },
  terracotta: {
    id: 'terracotta',
    nameFa: 'سفالی اخرایی اصیل',
    shortNameFa: 'سفالی اصیل',
    nameEn: 'Classic Ochre Terracotta',
    baseHex: '#C86D51',
    shadowHex: '#8F432C',
    highlightHex: '#DF8A6F',
    rimHex: '#D4795D',
    insideHex: '#6E321F',
    texture: 'porous_clay',
    heatAbsorption: 'medium',
    styleNote: 'دارای تخلخل تنفسی بالا برای خروج رطوبت اضافی؛ ایده‌آل برای کاکتوس و ساکولنت'
  },
  copper_bronze: {
    id: 'copper_bronze',
    nameFa: 'مسی و برنزی پتینه',
    shortNameFa: 'مسی برنزی',
    nameEn: 'Patina Brushed Copper',
    baseHex: '#AD5D45',
    shadowHex: '#7A3B28',
    highlightHex: '#CD7F67',
    rimHex: '#BC6B52',
    insideHex: '#542719',
    texture: 'glossy',
    heatAbsorption: 'medium',
    styleNote: 'جلای گرم فلزی و دست‌ساز؛ فوق‌العاده برای گیاهان کلکسیونی مانند فیکوس شرابی و زامیفولیا'
  },
  blush: {
    id: 'blush',
    nameFa: 'صورتی خاکی پاستلی',
    shortNameFa: 'صورتی خاکی',
    nameEn: 'Dusty Terracotta Blush',
    baseHex: '#E2B4B1',
    shadowHex: '#B88380',
    highlightHex: '#F2D2CF',
    rimHex: '#EAC1BE',
    insideHex: '#8F5D5A',
    texture: 'matte',
    heatAbsorption: 'low',
    styleNote: 'هم‌خانواده رنگی با برگ‌های سرخابی، صورتی و بنفش مانند کالاتیا اورانتا و فیتونیا'
  },
  wood_brown: {
    id: 'wood_brown',
    nameFa: 'قهوه‌ای چوب گردو و بلوط',
    shortNameFa: 'چوب گردو',
    nameEn: 'Walnut & Teak Wood',
    baseHex: '#8B5A2B',
    shadowHex: '#5C3A1B',
    highlightHex: '#A87442',
    rimHex: '#996535',
    insideHex: '#3D2510',
    texture: 'wood_grain',
    heatAbsorption: 'medium',
    styleNote: 'عایق حرارتی طبیعی برای ریشه در برابر سرما و گرما؛ عالی برای سرخس‌ها و ارکیده‌ها'
  },
  mint: {
    id: 'mint',
    nameFa: 'سبز مریم‌گلی و نعنایی',
    shortNameFa: 'سبز نعنایی',
    nameEn: 'Sage & Mint Pastel',
    baseHex: '#A7C4B5',
    shadowHex: '#739584',
    highlightHex: '#C5DDD0',
    rimHex: '#B4CFC1',
    insideHex: '#567364',
    texture: 'matte',
    heatAbsorption: 'low',
    styleNote: 'مکمل فوق‌العاده برای گیاهان دارای رگه‌های صورتی، سفید و نقره‌ای مانند سینگونیوم و کالاتیا'
  },
  olive: {
    id: 'olive',
    nameFa: 'زیتونی تیره مدیترانه‌ای',
    shortNameFa: 'زیتونی',
    nameEn: 'Mediterranean Olive Green',
    baseHex: '#6B7A53',
    shadowHex: '#485436',
    highlightHex: '#8B9B70',
    rimHex: '#798960',
    insideHex: '#333C26',
    texture: 'matte',
    heatAbsorption: 'medium',
    styleNote: 'پس‌زمینه طبیعی جنگلی برای گیاهان ابلق کرم‌رنگ مانند دیفن‌باخیا و پتوس مرمری'
  },
  forest_green: {
    id: 'forest_green',
    nameFa: 'سبز جنگلی لعاب‌دار',
    shortNameFa: 'سبز جنگلی',
    nameEn: 'Glazed Forest Emerald',
    baseHex: '#2D5A4C',
    shadowHex: '#18382E',
    highlightHex: '#467B6A',
    rimHex: '#366858',
    insideHex: '#122A23',
    texture: 'glossy',
    heatAbsorption: 'high',
    styleNote: 'جلوه اشرافی و کلاسیک برای گیاهان برگ‌طلایی، نئونی و گیاهان گلدار سفید و قرمز'
  },
  cobalt: {
    id: 'cobalt',
    nameFa: 'آبی کبالت سلطنتی',
    shortNameFa: 'آبی کبالت',
    nameEn: 'Imperial Cobalt Glaze',
    baseHex: '#1E40AF',
    shadowHex: '#1E3A8A',
    highlightHex: '#3B82F6',
    rimHex: '#2563EB',
    insideHex: '#172554',
    texture: 'glossy',
    heatAbsorption: 'medium',
    styleNote: 'رنگ سنتی سینی‌های بونسای شرقی و گلدان‌های سرامیکی لعاب‌دار برای مرکبات و گل‌ها'
  },
  grey: {
    id: 'grey',
    nameFa: 'طوسی سنگی خنثی',
    shortNameFa: 'طوسی سنگی',
    nameEn: 'Neutral Stone Grey',
    baseHex: '#94A3B8',
    shadowHex: '#64748B',
    highlightHex: '#CBD5E1',
    rimHex: '#B0BECF',
    insideHex: '#475569',
    texture: 'matte',
    heatAbsorption: 'medium',
    styleNote: 'رنگ خنثی که تمرکز بصری را ۱۰۰٪ روی فرم هندسی برگ‌های گیاه نگه می‌دارد'
  },
  concrete: {
    id: 'concrete',
    nameFa: 'طوسی بتنی بافت‌دار',
    shortNameFa: 'طوسی بتنی',
    nameEn: 'Architectural Raw Concrete',
    baseHex: '#8A9199',
    shadowHex: '#5B6168',
    highlightHex: '#ADB4BC',
    rimHex: '#989FA7',
    insideHex: '#43484E',
    texture: 'concrete_grain',
    heatAbsorption: 'medium',
    styleNote: 'بافت منفذدار سیمانی و سنگین برای پایداری بالای گیاهان ستونی، یوکا و سانسوریا'
  },
  charcoal: {
    id: 'charcoal',
    nameFa: 'ذغالی مات مدرن',
    shortNameFa: 'ذغالی مات',
    nameEn: 'Matte Anthracite Charcoal',
    baseHex: '#334155',
    shadowHex: '#1E293B',
    highlightHex: '#475569',
    rimHex: '#3E4C63',
    insideHex: '#0F172A',
    texture: 'matte',
    heatAbsorption: 'high',
    styleNote: 'ایجاد بالاترین کنتراست نوری برای گیاهان نئونی، ابلق سفید، طلایی و بونسای‌ها'
  },
  black: {
    id: 'black',
    nameFa: 'مشکی مات اونیکس',
    shortNameFa: 'مشکی مات',
    nameEn: 'Matte Onyx Black',
    baseHex: '#1E2024',
    shadowHex: '#0B0C0E',
    highlightHex: '#383C42',
    rimHex: '#282B30',
    insideHex: '#050607',
    texture: 'matte',
    heatAbsorption: 'high',
    styleNote: 'جذب گرمای محیط برای گرم نگه داشتن ریشه گیاهان استوایی کلکسیونی در داخل خانه'
  }
};

// کاتالوگ ۲۰ مدل گلدان با نام‌های کوتاه کالیبره‌شده برای گرید ۴ ستونه موبایل
export const POT_MODELS_CATALOG: Record<string, PotModelMetadata> = {
  round_smooth: {
    id: 'round_smooth',
    nameFa: 'گرد ساده کلاسیک',
    shortNameFa: 'گرد ساده',
    nameEn: 'Classic Smooth Round',
    category: 'classic',
    depthProfile: 'medium',
    stabilityScore: 8,
    moistureRetention: 'medium',
    bestForDescription: 'مناسب برای ۸۰٪ گیاهان آپارتمانی بوته‌ای با ریشه متوسط مانند آگلونما، شفلرا و شمعدانی',
    dimensionsRatio: { topWidth: 38, bottomWidth: 26, height: 32 }
  },
  round_ribbed: {
    id: 'round_ribbed',
    nameFa: 'گرد شیاردار عمودی',
    shortNameFa: 'گرد شیاردار',
    nameEn: 'Fluted Ribbed Round',
    category: 'modern',
    depthProfile: 'medium',
    stabilityScore: 8,
    moistureRetention: 'medium',
    bestForDescription: 'ایجاد خطای دید عمودی و زیبایی بصری برای گیاهان برگ‌پهن مثل فیکوس بلک، پپرومیا و برگ‌عبایی',
    dimensionsRatio: { topWidth: 38, bottomWidth: 28, height: 32 }
  },
  cylinder_modern: {
    id: 'cylinder_modern',
    nameFa: 'استوانه‌ای مدرن با زیرگلدانی',
    shortNameFa: 'استوانه‌ای',
    nameEn: 'Architectural Cylinder',
    category: 'modern',
    depthProfile: 'deep',
    stabilityScore: 9,
    moistureRetention: 'high',
    bestForDescription: 'تکیه‌گاه عالی برای گیاهان عمودی و کشیده مانند سانسوریا، مانسترا، آلوکازیا و دراسنا',
    dimensionsRatio: { topWidth: 34, bottomWidth: 34, height: 34 }
  },
  bowl_saucer: {
    id: 'bowl_saucer',
    nameFa: 'کاسه‌ای کم‌عمق (دیش‌گاردن)',
    shortNameFa: 'کاسه‌ای',
    nameEn: 'Shallow Pan Bowl',
    category: 'specialty',
    depthProfile: 'shallow',
    stabilityScore: 10,
    moistureRetention: 'low',
    bestForDescription: 'خشک شدن سریع بستر برای گیاهان دارای ریشه سطحی مثل ساکولنت‌ها، بنفشه آفریقایی و فیتونیا',
    dimensionsRatio: { topWidth: 44, bottomWidth: 28, height: 22 }
  },
  conical_tall: {
    id: 'conical_tall',
    nameFa: 'مخروطی بلند لابی',
    shortNameFa: 'مخروطی',
    nameEn: 'Tall Tapered Conical',
    category: 'architectural',
    depthProfile: 'deep',
    stabilityScore: 8,
    moistureRetention: 'medium',
    bestForDescription: 'مناسب گیاهان دارای ریشه عمیق و غده‌ای مانند زامیفولیا، یوکا، نخل اریکا و فیکوس الاستیکا',
    dimensionsRatio: { topWidth: 36, bottomWidth: 22, height: 36 }
  },
  square_minimal: {
    id: 'square_minimal',
    nameFa: 'چهارگوش مکعبی مینیمال',
    shortNameFa: 'مکعب ساده',
    nameEn: 'Minimalist Cube',
    category: 'modern',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'high',
    bestForDescription: 'حجم خاک ۲۰٪ بیشتر نسبت به گلدان گرد هم‌عرض و پایداری کامل برای شمشاد و هاورتیا',
    dimensionsRatio: { topWidth: 36, bottomWidth: 32, height: 32 }
  },
  square_patterned: {
    id: 'square_patterned',
    nameFa: 'چهارگوش طرح‌دار برجسته',
    shortNameFa: 'مکعب نقش',
    nameEn: 'Embossed Geometric Square',
    category: 'classic',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'high',
    bestForDescription: 'مناسب تراس‌ها و ورودی‌ها برای کاشت رز درختچه‌ای، کامکوات و درختچه‌های زینتی',
    dimensionsRatio: { topWidth: 38, bottomWidth: 30, height: 33 }
  },
  faceted_gem: {
    id: 'faceted_gem',
    nameFa: 'الماسی چندوجهی هندسی',
    shortNameFa: 'الماسی',
    nameEn: 'Origami Faceted Gem',
    category: 'modern',
    depthProfile: 'medium',
    stabilityScore: 9,
    moistureRetention: 'medium',
    bestForDescription: 'طراحی اوریگامی شکسته‌کننده نور، ایده‌آل برای گیاهان کلکسیونی خاص مانند زامیفولیا ابلق و آستروفیتوم',
    dimensionsRatio: { topWidth: 36, bottomWidth: 24, height: 32 }
  },
  chalice_urn: {
    id: 'chalice_urn',
    nameFa: 'جامی پایه‌دار سلطنتی',
    shortNameFa: 'جام پایه‌دار',
    nameEn: 'Pedestal Chalice Urn',
    category: 'classic',
    depthProfile: 'medium',
    stabilityScore: 8,
    moistureRetention: 'medium',
    bestForDescription: 'بالا بردن ارتفاع نمایشی تاج گیاه برای فیکوس لیراتا، نخل کنتیا، گل رز و گاردنیا',
    dimensionsRatio: { topWidth: 40, bottomWidth: 26, height: 36 }
  },
  trough_fluted: {
    id: 'trough_fluted',
    nameFa: 'مستطیلی کشیده (فلاورباکس)',
    shortNameFa: 'مستطیلی',
    nameEn: 'Fluted Rectangular Trough',
    category: 'architectural',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'high',
    bestForDescription: 'ایجاد دیوار سبز با گیاهان رونده، دیش‌گاردن ساکولنت، رز رونده و سبزیجات معطر',
    dimensionsRatio: { topWidth: 52, bottomWidth: 46, height: 28 }
  },
  hanging_basket: {
    id: 'hanging_basket',
    nameFa: 'سبد آویز با بند مکرمه',
    shortNameFa: 'سبد آویز',
    nameEn: 'Suspended Hanging Planter',
    category: 'hanging',
    depthProfile: 'medium',
    stabilityScore: 9,
    moistureRetention: 'low',
    bestForDescription: 'آزادسازی فضای رشد آبشاری برای پتوس، برگ‌بیدی، سرخس بوستون، رشته مروارید و اطلسی',
    dimensionsRatio: { topWidth: 38, bottomWidth: 22, height: 26 }
  },
  bonsai_tray: {
    id: 'bonsai_tray',
    nameFa: 'سینی بونسای پایه‌دار شرقی',
    shortNameFa: 'سینی بونسای',
    nameEn: 'Traditional Bonsai Tray',
    category: 'specialty',
    depthProfile: 'shallow',
    stabilityScore: 10,
    moistureRetention: 'low',
    bestForDescription: 'کنترل رشد طولی ریشه و نمایش ریشه‌های هوایی برای انواع بونسای، سیکاس، لیندا و آدنیوم',
    dimensionsRatio: { topWidth: 48, bottomWidth: 42, height: 18 }
  },
  amphora_clay: {
    id: 'amphora_clay',
    nameFa: 'خمره‌ای سفالی شکم‌دار',
    shortNameFa: 'خمره‌ای',
    nameEn: 'Mediterranean Belly Amphora',
    category: 'classic',
    depthProfile: 'deep',
    stabilityScore: 9,
    moistureRetention: 'medium',
    bestForDescription: 'حفظ خنکی ریشه در بخش شکم‌دار میانی؛ عالی برای کراسولا، شفلرا و فلفل زینتی',
    dimensionsRatio: { topWidth: 32, bottomWidth: 24, height: 34 }
  },
  hexagon_concrete: {
    id: 'hexagon_concrete',
    nameFa: 'شش‌ضلعی بتنی مدرن',
    shortNameFa: 'شش‌ضلعی',
    nameEn: 'Hexagonal Brutalist Planter',
    category: 'architectural',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'medium',
    bestForDescription: 'فرم لانه‌زنبوری سنگین و ضدواژگونی برای کاکتوس‌های ستونی، آگاو و سانسوریا لوله‌ای',
    dimensionsRatio: { topWidth: 38, bottomWidth: 32, height: 32 }
  },
  wood_stand_modern: {
    id: 'wood_stand_modern',
    nameFa: 'استوانه‌ای پایه‌دار چوبی',
    shortNameFa: 'پایه چوبی',
    nameEn: 'Mid-Century Wood Stand Planter',
    category: 'modern',
    depthProfile: 'medium',
    stabilityScore: 8,
    moistureRetention: 'high',
    bestForDescription: 'دور کردن کف گلدان از سرمای سنگ در زمستان؛ ایده‌آل برای برگ‌انجیری، فیلودندرون و کالاتیا',
    dimensionsRatio: { topWidth: 34, bottomWidth: 34, height: 36 }
  },
  egg_planter: {
    id: 'egg_planter',
    nameFa: 'تخم‌مرغی منحنی مدرن',
    shortNameFa: 'تخم‌مرغی',
    nameEn: 'Curved Ovoid Egg Planter',
    category: 'modern',
    depthProfile: 'deep',
    stabilityScore: 8,
    moistureRetention: 'high',
    bestForDescription: 'جلوگیری از شکستن ریشه‌های چرخشی در گوشه‌ها؛ مناسب نخل شامادورا، اسپاتی‌فیلوم و آلوکازیا',
    dimensionsRatio: { topWidth: 34, bottomWidth: 22, height: 34 }
  },
  footed_cauldron: {
    id: 'footed_cauldron',
    nameFa: 'دیگی سه‌پایه مینیاتوری',
    shortNameFa: 'سه‌پایه دیگی',
    nameEn: 'Tripod Footed Cauldron',
    category: 'specialty',
    depthProfile: 'shallow',
    stabilityScore: 9,
    moistureRetention: 'medium',
    bestForDescription: 'تخلیه عالی آب از زهکش به لطف پایه‌های یکپارچه؛ مناسب هاورتیا، پپرومیا و برگ‌خونین',
    dimensionsRatio: { topWidth: 36, bottomWidth: 28, height: 28 }
  },
  lotus_scalloped: {
    id: 'lotus_scalloped',
    nameFa: 'نیلوفری کنگره‌دار',
    shortNameFa: 'نیلوفری',
    nameEn: 'Scalloped Lotus Bowl',
    category: 'classic',
    depthProfile: 'medium',
    stabilityScore: 8,
    moistureRetention: 'medium',
    bestForDescription: 'لبه‌های دالبری گلبرگ‌مانند که با گیاهان گلدار و رزت مانند سیکلامن، گلوکسینیا و اچوریا هماهنگ می‌شود',
    dimensionsRatio: { topWidth: 40, bottomWidth: 24, height: 30 }
  },
  tiered_pagoda: {
    id: 'tiered_pagoda',
    nameFa: 'پله‌ای طبقاتی مدرن',
    shortNameFa: 'پله‌ای',
    nameEn: 'Stepped Architectural Tier',
    category: 'architectural',
    depthProfile: 'medium',
    stabilityScore: 9,
    moistureRetention: 'medium',
    bestForDescription: 'فرم پله‌ای مدرن برای گیاهان دارای ساختار هندسی مانند کراسولا معبد بودا، افوربیا و بامبو',
    dimensionsRatio: { topWidth: 38, bottomWidth: 24, height: 34 }
  },
  woven_belly: {
    id: 'woven_belly',
    nameFa: 'حصیری شکم‌دار بوهو',
    shortNameFa: 'حصیری بوهو',
    nameEn: 'Boho Woven Seagrass Belly',
    category: 'specialty',
    depthProfile: 'deep',
    stabilityScore: 8,
    moistureRetention: 'low',
    bestForDescription: 'کاور دکوراتیو سبک بوهمین با تهویه هوای عالی برای نخل راپیس، باباآدم، فیکوس الاستیکا و شفلرا',
    dimensionsRatio: { topWidth: 34, bottomWidth: 28, height: 32 }
  }
};

const resolveEffectivePotShape = (
  shape: string,
  explicitPotShape?: PotShapeType | string
): PotShapeType => {
  if (explicitPotShape) {
    if (explicitPotShape === 'round') return 'round_smooth';
    if (explicitPotShape === 'hex') return 'faceted_gem';
    if (explicitPotShape === 'trough') return 'trough_fluted';
    return explicitPotShape as PotShapeType;
  }
  if (shape === 'combo_trough' || shape === 'combo_trough_2' || shape === 'dish_garden_succulent') {
    return 'trough_fluted';
  }
  if (shape.startsWith('bonsai_') || shape === 'ficus_ginseng' || shape === 'pine_nana') {
    return 'bonsai_tray';
  }
  if (shape.startsWith('pothos_') || shape.startsWith('string_of_')) {
    return 'hanging_basket';
  }
  if (shape.startsWith('sansevieria_') || shape.startsWith('zz_') || shape.startsWith('alocasia_')) {
    return 'cylinder_modern';
  }
  return 'round_smooth';
};

// ============================================================================
// ۳. رندرکننده برداری ۲۰ مدل گلدان و ۶ بافت سطحی (PotVectorGraphic)
// ============================================================================

export const PotVectorGraphic: React.FC<{
  shape: PotShapeType | string;
  color: PotColorType | string;
}> = ({ shape, color }) => {
  const uid = useId().replace(/:/g, '');
  const palette = POT_COLOR_PALETTE[color] || POT_COLOR_PALETTE.white;
  const gradId = `pot-grad-${uid}`;
  const rimGradId = `rim-grad-${uid}`;

  const renderTextureOverlay = () => {
    switch (palette.texture) {
      case 'terrazzo_speckled':
        return (
          <g opacity="0.65" pointerEvents="none">
            <polygon points="38,62 41,60 42,63" fill="#C86D51" />
            <polygon points="58,66 61,65 60,68" fill="#64748B" />
            <polygon points="46,72 49,71 48,74" fill="#94A3B8" />
            <polygon points="53,59 55,61 52,62" fill="#B59672" />
            <polygon points="42,78 45,77 44,80" fill="#475569" />
            <polygon points="56,76 59,75 58,79" fill="#C86D51" />
            <circle cx="48" cy="65" r="1.2" fill="#739584" />
            <circle cx="62" cy="72" r="1" fill="#B59672" />
            <circle cx="36" cy="71" r="1.1" fill="#64748B" />
          </g>
        );
        
      case 'concrete_grain':
        return (
          <g opacity="0.28" pointerEvents="none">
            <circle cx="39" cy="63" r="0.7" fill={palette.shadowHex} />
            <circle cx="44" cy="75" r="0.9" fill={palette.shadowHex} />
            <circle cx="57" cy="68" r="0.6" fill={palette.shadowHex} />
            <circle cx="61" cy="77" r="0.8" fill={palette.shadowHex} />
            <circle cx="49" cy="61" r="0.5" fill={palette.highlightHex} />
            <circle cx="53" cy="79" r="0.7" fill={palette.shadowHex} />
            <path d="M36,70 Q42,71 45,69" stroke={palette.shadowHex} strokeWidth="0.4" fill="none" />
          </g>
        );
      case 'marble_veined':
        return (
          <g opacity="0.38" pointerEvents="none" stroke="#9CA3AF" strokeWidth="0.7" fill="none">
            <path d="M35,58 Q45,65 42,74 Q40,79 48,83" />
            <path d="M58,57 Q52,66 61,73 Q64,77 59,82" />
            <path d="M44,64 L51,68" strokeWidth="0.45" />
          </g>
        );
      case 'porous_clay':
        return (
          <g opacity="0.18" pointerEvents="none">
            <path d="M35,64 Q50,66 65,64" stroke={palette.highlightHex} strokeWidth="0.6" fill="none" />
            <path d="M37,74 Q50,76 63,74" stroke={palette.shadowHex} strokeWidth="0.5" fill="none" />
          </g>
        );
      case 'wood_grain':
        return (
          <g opacity="0.25" pointerEvents="none" stroke={palette.shadowHex} strokeWidth="0.7" fill="none">
            <path d="M36,58 Q39,70 37,82" />
            <path d="M45,58 Q48,68 44,82" />
            <path d="M55,58 Q52,71 56,82" />
            <path d="M63,58 Q60,69 62,82" />
          </g>
        );
      case 'glossy':
        return (
          <path
            d="M36,59 Q34,70 38,81"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.38"
            pointerEvents="none"
          />
        );
      default:
        return null;
    }
  };

  const renderPotGeometry = () => {
    switch (shape) {
      case 'round_ribbed':
        return (
          <g>
            <ellipse cx="50" cy="85" rx="16" ry="2.5" fill="rgba(0,0,0,0.16)" />
            <path
              d="M31,54 C31,67 34,79 36,84 C38,85.8 62,85.8 64,84 C66,79 69,67 69,54 Z"
              fill={`url(#${gradId})`}
            />
            <g stroke={palette.shadowHex} strokeWidth="0.85" opacity="0.55" fill="none">
              <path d="M35,55.5 L38.5,84.2" />
              <path d="M39,56.2 L41.5,84.8" />
              <path d="M43,56.8 L44.5,85.1" />
              <path d="M47,57.1 L47.8,85.3" />
              <path d="M50,57.2 L50,85.4" />
              <path d="M53,57.1 L52.2,85.3" />
              <path d="M57,56.8 L55.5,85.1" />
              <path d="M61,56.2 L58.5,84.8" />
              <path d="M65,55.5 L61.5,84.2" />
            </g>
            {renderTextureOverlay()}
            <path
              d="M30.5,54 A19.5,3.6 0 0,0 69.5,54 L69.5,55.8 A19.5,3.6 0 0,1 30.5,55.8 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'cylinder_modern':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="18" ry="2.5" fill="rgba(0,0,0,0.18)" />
            <path
              d="M33,54 L33,82.5 A17,2.8 0 0,0 67,82.5 L67,54 A17,3.2 0 0,1 33,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M32.5,81.5 L32.5,84.2 A17.5,2.8 0 0,0 67.5,84.2 L67.5,81.5 A17.5,2.8 0 0,1 32.5,81.5 Z"
              fill={palette.shadowHex}
            />
            <path
              d="M33,54 A17,3.2 0 0,0 67,54 L67,55.4 A17,3.2 0 0,1 33,55.4 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'bowl_saucer':
        return (
          <g>
            <ellipse cx="50" cy="76.5" rx="17" ry="2.2" fill="rgba(0,0,0,0.16)" />
            <path
              d="M28,54 C28,65 34,73 39,75.5 C42,76.8 58,76.8 61,75.5 C66,73 72,65 72,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M27.5,54 A22.5,4.2 0 0,0 72.5,54 L72.5,56 A22.5,4.2 0 0,1 27.5,56 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'conical_tall':
        return (
          <g>
            <ellipse cx="50" cy="87" rx="13" ry="2" fill="rgba(0,0,0,0.18)" />
            <path
              d="M32,54 L39,85.5 C41,87 59,87 61,85.5 L68,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M31.5,54 A18.5,3.4 0 0,0 68.5,54 L68.5,55.8 A18.5,3.4 0 0,1 31.5,55.8 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'square_minimal':
        return (
          <g>
            <polygon points="33,84 50,87.5 67,84 50,81" fill="rgba(0,0,0,0.18)" />
            <polygon points="32,54 50,57.5 50,86 34,82.5" fill={palette.baseHex} />
            <polygon points="68,54 50,57.5 50,86 66,82.5" fill={palette.shadowHex} />
            {renderTextureOverlay()}
            <polyline
              points="32,54 50,57.5 68,54"
              stroke={palette.highlightHex}
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        );

      case 'square_patterned':
        return (
          <g>
            <polygon points="33,84 50,87.5 67,84 50,81" fill="rgba(0,0,0,0.18)" />
            <polygon points="31,54 50,57.5 50,86 34,82.5" fill={palette.baseHex} />
            <polygon points="69,54 50,57.5 50,86 66,82.5" fill={palette.shadowHex} />
            <polygon
              points="35,61 47,63.5 47,79 36.5,76.5"
              fill="none"
              stroke={palette.shadowHex}
              strokeWidth="1"
            />
            <polygon
              points="65,61 53,63.5 53,79 63.5,76.5"
              fill="none"
              stroke={palette.baseHex}
              strokeWidth="1"
              opacity="0.6"
            />
            {renderTextureOverlay()}
            <polygon points="30,53.5 50,57.2 70,53.5 70,55.5 50,59.2 30,55.5" fill={`url(#${rimGradId})`} />
          </g>
        );

      case 'faceted_gem':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="14" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <polygon points="32,54 42,57 38,70 30,68" fill={palette.highlightHex} />
            <polygon points="42,57 58,57 50,72" fill={palette.baseHex} />
            <polygon points="58,57 68,54 70,68 62,70" fill={palette.shadowHex} />
            <polygon points="42,57 50,72 38,70" fill={palette.baseHex} opacity="0.9" />
            <polygon points="58,57 62,70 50,72" fill={palette.shadowHex} opacity="0.85" />
            <polygon points="30,68 38,70 38,84" fill={palette.baseHex} />
            <polygon points="38,70 50,72 50,85.5 38,84" fill={palette.highlightHex} opacity="0.92" />
            <polygon points="50,72 62,70 62,84 50,85.5" fill={palette.baseHex} />
            <polygon points="62,70 70,68 62,84" fill={palette.shadowHex} />
            {renderTextureOverlay()}
          </g>
        );

      case 'chalice_urn':
        return (
          <g>
            <ellipse cx="50" cy="86.5" rx="15" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path
              d="M30,54 C30,66 37,72 45,74 L46,81 L37,84 L37,86.5 L63,86.5 L63,84 L54,81 L55,74 C63,72 70,66 70,54 Z"
              fill={`url(#${gradId})`}
            />
            <ellipse cx="50" cy="74.5" rx="6.5" ry="1.6" fill={palette.shadowHex} />
            {renderTextureOverlay()}
            <path
              d="M29,54 A21,3.8 0 0,0 71,54 L71,56.4 A21,3.8 0 0,1 29,56.4 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'trough_fluted':
        return (
          <g>
            <ellipse cx="50" cy="83.5" rx="26" ry="2.5" fill="rgba(0,0,0,0.16)" />
            <polygon points="24,55 71,55 69,82.5 26,82.5" fill={`url(#${gradId})`} />
            <polygon points="71,55 76,51.5 74,79 69,82.5" fill={palette.shadowHex} />
            <g stroke={palette.shadowHex} strokeWidth="0.8" opacity="0.5">
              <line x1="32" y1="56" x2="33" y2="82" />
              <line x1="40" y1="56" x2="40.5" y2="82" />
              <line x1="48" y1="56" x2="48" y2="82" />
              <line x1="56" y1="56" x2="55.5" y2="82" />
              <line x1="64" y1="56" x2="63" y2="82" />
            </g>
            {renderTextureOverlay()}
            <rect x="23.5" y="53.8" width="48" height="2.4" rx="0.8" fill={`url(#${rimGradId})`} />
          </g>
        );

      case 'hanging_basket':
        return (
          <g>
            <path
              d="M30.5,54 C30.5,68 38,77 50,77 C62,77 69.5,68 69.5,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M30,54 A20,3.8 0 0,0 70,54 L70,56 A20,3.8 0 0,1 30,56 Z"
              fill={`url(#${rimGradId})`}
            />
            <path d="M47,77 L50,84 L53,77 Z" fill="#A89886" />
          </g>
        );

      case 'bonsai_tray':
        return (
          <g>
            <ellipse cx="50" cy="73" rx="23" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path d="M25,54.5 L28,67.5 L72,67.5 L75,54.5 Z" fill={`url(#${gradId})`} />
            <path d="M30,67.5 L31,72 L36,72 L37,67.5 Z" fill={palette.shadowHex} />
            <path d="M63,67.5 L64,72 L69,72 L70,67.5 Z" fill={palette.shadowHex} />
            {renderTextureOverlay()}
            <rect x="24" y="53.5" width="52" height="2.3" rx="0.8" fill={`url(#${rimGradId})`} />
          </g>
        );

      case 'amphora_clay':
        return (
          <g>
            <ellipse cx="50" cy="86" rx="14" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path
              d="M34,54 C26,63 27,76 38,85 C41,86.5 59,86.5 62,85 C73,76 74,63 66,54 Z"
              fill={`url(#${gradId})`}
            />
            <path
              d="M33,57 C29,57 29,64 32,65"
              stroke={palette.shadowHex}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M67,57 C71,57 71,64 68,65"
              stroke={palette.shadowHex}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            {renderTextureOverlay()}
            <path
              d="M33,54 A17,3.2 0 0,0 67,54 L67,56.2 A17,3.2 0 0,1 33,56.2 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'hexagon_concrete':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="16" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <polygon points="31,54 40,57 41,84.5 34,81.5" fill={palette.highlightHex} />
            <polygon points="40,57 60,57 59,84.5 41,84.5" fill={palette.baseHex} />
            <polygon points="60,57 69,54 66,81.5 59,84.5" fill={palette.shadowHex} />
            {renderTextureOverlay()}
          </g>
        );

      case 'wood_stand_modern':
        return (
          <g>
            <ellipse cx="50" cy="87" rx="17" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <rect x="33" y="65" width="3.2" height="21.5" rx="1.2" fill="#7C4D25" />
            <rect x="63.8" y="65" width="3.2" height="21.5" rx="1.2" fill="#5C3818" />
            <rect x="48.5" y="75" width="3" height="12" rx="1" fill="#4A2C11" />
            <rect x="34" y="76" width="32" height="2.8" fill="#6E421F" />
            <path
              d="M33.5,54 L33.5,77.5 A16.5,2.8 0 0,0 66.5,77.5 L66.5,54 A16.5,3.2 0 0,1 33.5,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
          </g>
        );

      case 'egg_planter':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="13" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path
              d="M33,54 C29,66 33,80 41,85 C44,86.5 56,86.5 59,85 C67,80 71,66 67,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M33,54 A17,3.4 0 0,0 67,54 L67,55.5 A17,3.4 0 0,1 33,55.5 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'footed_cauldron':
        return (
          <g>
            <ellipse cx="50" cy="84.5" rx="15" ry="2.2" fill="rgba(0,0,0,0.16)" />
            <path d="M37,76 L35,84 L39,84 L41,77 Z" fill={palette.shadowHex} />
            <path d="M63,76 L65,84 L61,84 L59,77 Z" fill={palette.shadowHex} />
            <path d="M48.5,78 L48.5,84.5 L51.5,84.5 L51.5,78 Z" fill={palette.shadowHex} />
            <path
              d="M32,54 C30,66 35,78 50,78 C65,78 70,66 68,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M31.5,54 A18.5,3.5 0 0,0 68.5,54 L68.5,55.6 A18.5,3.5 0 0,1 31.5,55.6 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'lotus_scalloped':
        return (
          <g>
            <ellipse cx="50" cy="85" rx="14" ry="2.2" fill="rgba(0,0,0,0.16)" />
            <path
              d="M30,54 C31,68 35,79 39,84 C42,85.5 58,85.5 61,84 C65,79 69,68 70,54 Q65,57.5 60,54.5 Q55,58 50,55 Q45,58 40,54.5 Q35,57.5 30,54 Z"
              fill={`url(#${gradId})`}
            />
            <g stroke={palette.shadowHex} strokeWidth="0.7" opacity="0.45" fill="none">
              <path d="M40,55 Q41,70 43,84.5" />
              <path d="M50,55.5 L50,85" />
              <path d="M60,55 Q59,70 57,84.5" />
            </g>
            {renderTextureOverlay()}
          </g>
        );

      case 'tiered_pagoda':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="14" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path d="M31,54 L32.5,64 L67.5,64 L69,54 Z" fill={`url(#${gradId})`} />
            <path d="M34.5,64 L36,74.5 L64,74.5 L65.5,64 Z" fill={`url(#${gradId})`} />
            <path d="M38,74.5 L39.5,85 L60.5,85 L62,74.5 Z" fill={`url(#${gradId})`} />
            <line x1="32.5" y1="64" x2="67.5" y2="64" stroke={palette.shadowHex} strokeWidth="1.2" />
            <line x1="36" y1="74.5" x2="64" y2="74.5" stroke={palette.shadowHex} strokeWidth="1.2" />
            {renderTextureOverlay()}
            <path
              d="M30.5,54 A19.5,3.5 0 0,0 69.5,54 L69.5,55.6 A19.5,3.5 0 0,1 30.5,55.6 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );

      case 'woven_belly':
        return (
          <g>
            <ellipse cx="50" cy="85.5" rx="15" ry="2.2" fill="rgba(0,0,0,0.18)" />
            <path
              d="M33,54 L28,69 L36,84.5 C39,86 61,86 64,84.5 L72,69 L67,54 Z"
              fill={`url(#${gradId})`}
            />
            <line x1="28" y1="69" x2="72" y2="69" stroke={palette.shadowHex} strokeWidth="1.1" opacity="0.7" />
            <g stroke={palette.shadowHex} strokeWidth="0.65" opacity="0.45" fill="none">
              <path d="M32,59 L68,59" />
              <path d="M30,64 L70,64" />
              <path d="M31,74 L69,74" />
              <path d="M34,79 L66,79" />
              <path d="M38,55 L34,69 L39,84" />
              <path d="M46,55 L44,69 L46,85" />
              <path d="M54,55 L56,69 L54,85" />
              <path d="M62,55 L66,69 L61,84" />
            </g>
            <path d="M32,54 C29,50 35,49 36,54" stroke={palette.shadowHex} strokeWidth="1.4" fill="none" />
            <path d="M68,54 C71,50 65,49 64,54" stroke={palette.shadowHex} strokeWidth="1.4" fill="none" />
          </g>
        );

      case 'round_smooth':
      default:
        return (
          <g>
            <ellipse cx="50" cy="85" rx="16" ry="2.5" fill="rgba(0,0,0,0.16)" />
            <path
              d="M31,54 C31,66 34,78 37,84 C39,85.8 61,85.8 63,84 C66,78 69,66 69,54 Z"
              fill={`url(#${gradId})`}
            />
            {renderTextureOverlay()}
            <path
              d="M30,54 A20,3.8 0 0,0 70,54 L70,56.2 A20,3.8 0 0,1 30,56.2 Z"
              fill={`url(#${rimGradId})`}
            />
          </g>
        );
    }
  };

  return (
    <g>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="15%">
          <stop offset="0%" stopColor={palette.highlightHex} />
          <stop offset="35%" stopColor={palette.baseHex} />
          <stop offset="100%" stopColor={palette.shadowHex} />
        </linearGradient>
        <linearGradient id={rimGradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={palette.highlightHex} />
          <stop offset="50%" stopColor={palette.rimHex} />
          <stop offset="100%" stopColor={palette.shadowHex} />
        </linearGradient>
      </defs>
      {renderPotGeometry()}
    </g>
  );
};

// ============================================================================
// ۴. توابع کمکی آناتومی گیاه‌شناسی (Anatomical Helpers)
// ============================================================================

// الف) سازنده برگ نیزه‌ای/بیضی نوک‌تیز طبیعی
const renderPointedBlade = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rot: number,
  outerFill: string,
  strokeColor: string,
  innerFill?: string,
  veinColor?: string,
  patternType?: 'silver_queen' | 'snow_dots' | 'red_edge' | 'pinstripe' | 'feather' | 'none'
) => (
  <g key={`${cx}_${cy}_${rot}`} transform={`rotate(${rot} ${cx} ${cy})`}>
    <path
      d={`M ${cx} ${cy - ry} C ${cx + rx * 1.25} ${cy - ry * 0.45}, ${cx + rx * 1.15} ${cy + ry * 0.55}, ${cx} ${cy + ry} C ${cx - rx * 1.15} ${cy + ry * 0.55}, ${cx - rx * 1.25} ${cy - ry * 0.45}, ${cx} ${cy - ry} Z`}
      fill={outerFill}
      stroke={strokeColor}
      strokeWidth="0.9"
    />
    {innerFill && (
      <path
        d={`M ${cx} ${cy - ry * 0.78} C ${cx + rx * 0.78} ${cy - ry * 0.3}, ${cx + rx * 0.72} ${cy + ry * 0.45}, ${cx} ${cy + ry * 0.8} C ${cx - rx * 0.72} ${cy + ry * 0.45}, ${cx - rx * 0.78} ${cy - ry * 0.3}, ${cx} ${cy - ry * 0.78} Z`}
        fill={innerFill}
        opacity="0.9"
      />
    )}
    {patternType === 'pinstripe' && (
      <g stroke="#F472B6" strokeWidth="0.85" strokeLinecap="round">
        <path d={`M ${cx - 1} ${cy - ry * 0.35} L ${cx - rx * 0.75} ${cy - ry * 0.55}`} />
        <path d={`M ${cx + 1} ${cy - ry * 0.35} L ${cx + rx * 0.75} ${cy - ry * 0.55}`} />
        <path d={`M ${cx - 1} ${cy + ry * 0.05} L ${cx - rx * 0.8} ${cy - ry * 0.15}`} />
        <path d={`M ${cx + 1} ${cy + ry * 0.05} L ${cx + rx * 0.8} ${cy - ry * 0.15}`} />
        <path d={`M ${cx - 1} ${cy + ry * 0.4} L ${cx - rx * 0.65} ${cy + ry * 0.2}`} />
        <path d={`M ${cx + 1} ${cy + ry * 0.4} L ${cx + rx * 0.65} ${cy + ry * 0.2}`} />
      </g>
    )}
    {patternType === 'feather' && (
      <g stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        <path d={`M ${cx} ${cy - ry * 0.3} L ${cx - rx * 0.7} ${cy - ry * 0.5}`} />
        <path d={`M ${cx} ${cy - ry * 0.3} L ${cx + rx * 0.7} ${cy - ry * 0.5}`} />
        <path d={`M ${cx} ${cy + ry * 0.1} L ${cx - rx * 0.75} ${cy - ry * 0.1}`} />
        <path d={`M ${cx} ${cy + ry * 0.1} L ${cx + rx * 0.75} ${cy - ry * 0.1}`} />
        <path d={`M ${cx} ${cy + ry * 0.45} L ${cx - rx * 0.6} ${cy + ry * 0.25}`} />
        <path d={`M ${cx} ${cy + ry * 0.45} L ${cx + rx * 0.6} ${cy + ry * 0.25}`} />
      </g>
    )}
    {patternType === 'snow_dots' && (
      <g fill={veinColor || '#FFFFFF'} opacity="0.85">
        <circle cx={cx - rx * 0.35} cy={cy - ry * 0.25} r="1.2" />
        <circle cx={cx + rx * 0.4} cy={cy - ry * 0.1} r="1.4" />
        <circle cx={cx - rx * 0.3} cy={cy + ry * 0.2} r="1.3" />
        <circle cx={cx + rx * 0.3} cy={cy + ry * 0.35} r="1.1" />
      </g>
    )}
    {veinColor && (
      <line
        x1={cx}
        y1={cy - ry * 0.75}
        x2={cx}
        y2={cy + ry * 0.88}
        stroke={veinColor}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
    )}
  </g>
);

// ب) سازنده برگ قلبی طبیعی
const renderHeartLeaf = (
  cx: number,
  cy: number,
  scale: number,
  rot: number,
  fill: string,
  stroke: string,
  variegationColor?: string,
  variegationType?: 'golden_streaks' | 'marble_half' | 'brasil_center' | 'birkin_lines' | 'pink_splash'
) => (
  <g key={`h_${cx}_${cy}_${rot}`} transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`}>
    <path
      d="M 0 -5 C 5 -11, 12 -4, 9 3 C 6 9, 2 12, 0 15 C -2 12, -6 9, -9 3 C -12 -4, -5 -11, 0 -5 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.05"
    />
    {variegationType === 'golden_streaks' && variegationColor && (
      <path
        d="M -4 -3 C -2 1, -3 6, -1 10 M 3 -2 C 5 2, 3 6, 1 9"
        stroke={variegationColor}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.88"
      />
    )}
    {variegationType === 'marble_half' && variegationColor && (
      <path
        d="M 0 -5 C 5 -11, 12 -4, 9 3 C 6 9, 2 12, 0 15 Z"
        fill={variegationColor}
        opacity="0.88"
      />
    )}
    {variegationType === 'brasil_center' && variegationColor && (
      <path d="M 0 -5 L 2.8 4 L 0 14 L -2.8 4 Z" fill={variegationColor} />
    )}
    {variegationType === 'birkin_lines' && variegationColor && (
      <g stroke={variegationColor} strokeWidth="0.9" strokeLinecap="round">
        <path d="M 0 -4V13M0 -1L-6 -4M0 -1L6 -4M0 3L-7 0M0 3L7 0M0 7L-5 5M0 7L5 5" />
      </g>
    )}
    {variegationType === 'pink_splash' && variegationColor && (
      <path
        d="M 0 -5 C -5 -11, -12 -4, -9 3 C -6 9, -2 12, 0 15 Z"
        fill={variegationColor}
        opacity="0.92"
      />
    )}
    <path d="M 0 -4 V 12" stroke={stroke} strokeWidth="0.8" opacity="0.55" />
  </g>
);

// ج) سازنده گل رز چندلایه و مارپیچی واقعی (همراه با کاسبرگ سبز، گلبرگ‌های بیرونی و غنچه مارپیچ مرکزی)
const renderLayeredRoseBloom = (
  cx: number,
  cy: number,
  scale: number,
  outerColor: string,
  midColor: string,
  innerColor: string,
  strokeColor: string
) => (
  <g key={`rose_${cx}_${cy}`} transform={`translate(${cx}, ${cy}) scale(${scale})`}>
    {/* کاسبرگ‌های سبز زیر گل رز */}
    <path d="M -5 4 L -8 7 M 5 4 L 8 7 M 0 5 V 8" stroke="#1B4332" strokeWidth="1.4" strokeLinecap="round" />
    {/* گلبرگ‌های باز بیرونی */}
    <path
      d="M 0 -7 C 6 -8, 9 -2, 6 4 C 3 7, -3 7, -6 4 C -9 -2, -6 -8, 0 -7 Z"
      fill={outerColor}
      stroke={strokeColor}
      strokeWidth="0.9"
    />
    <path
      d="M -6 -2 C -8 -6, -2 -9, 2 -6 C 7 -8, 9 -2, 5 2 C 2 6, -4 5, -6 -2 Z"
      fill={midColor}
      stroke={strokeColor}
      strokeWidth="0.75"
    />
    {/* گلبرگ‌های جامی میانی */}
    <ellipse cx="0" cy="-1" rx="4.2" ry="3.4" fill={innerColor} stroke={strokeColor} strokeWidth="0.7" />
    {/* مارپیچ غنچه مرکزی رز */}
    <path
      d="M -2.2 -1.2 C -1 -3, 2 -3, 2.2 -0.8 C 2.2 1, -1.5 1.5, -1.5 -0.4 C -1.2 -1.5, 0.8 -1.5, 0.8 -0.3"
      stroke={strokeColor}
      strokeWidth="0.95"
      strokeLinecap="round"
      fill="none"
    />
  </g>
);

// د) سازنده برگ مرکب دندانه‌دار گل رز (۳ تا ۵ برگچه با رگبرگ)
const renderCompoundRoseLeaf = (cx: number, cy: number, rot: number, scale: number = 1) => (
  <g key={`rlf_${cx}_${cy}`} transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`}>
    <line x1="0" y1="6" x2="0" y2="-6" stroke="#1B4332" strokeWidth="1.1" />
    {/* برگچه انتهایی */}
    <path d="M 0 -7 C 3.5 -5, 3.5 0, 0 2 C -3.5 0, -3.5 -5, 0 -7 Z" fill="#2D6A4F" stroke="#143325" strokeWidth="0.8" />
    {/* جفت برگچه کناری */}
    <path d="M -1 0 C -5 -2, -7 1, -3 4 C -1 3, 0 2, -1 0 Z" fill="#40916C" stroke="#143325" strokeWidth="0.8" />
    <path d="M 1 0 C 5 -2, 7 1, 3 4 C 1 3, 0 2, 1 0 Z" fill="#40916C" stroke="#143325" strokeWidth="0.8" />
  </g>
);

// هـ) سازنده چتر برگچه‌های شفلرا (۷ برگچه شعاعی متصل به یک مرکز)
const renderScheffleraUmbrella = (
  cx: number,
  cy: number,
  scale: number,
  isVariegated: boolean
) => (
  <g key={`sch_${cx}_${cy}`} transform={`translate(${cx}, ${cy}) scale(${scale})`}>
    {[0, 51, 102, 153, 204, 255, 306].map((deg, idx) => (
      <g key={deg} transform={`rotate(${deg})`}>
        <line x1="0" y1="0" x2="0" y2="-4" stroke="#52B788" strokeWidth="0.9" />
        <path
          d="M 0 -3.5 C 3.2 -6, 3.4 -12, 0 -14.5 C -3.4 -12, -3.2 -6, 0 -3.5 Z"
          fill={idx % 2 === 0 ? '#2D6A4F' : '#40916C'}
          stroke="#143325"
          strokeWidth="0.85"
        />
        {isVariegated && idx % 2 === 0 && (
          <path
            d="M 0 -5 C 2 -7, 2.2 -11, 0 -13 C -1.2 -10, -0.5 -7, 0 -5 Z"
            fill="#FEF08A"
            opacity="0.92"
          />
        )}
      </g>
    ))}
    <circle cx="0" cy="0" r="1.4" fill="#A3E635" stroke="#1B4332" strokeWidth="0.6" />
  </g>
);

// و) سازنده برگ گرد کنگره‌دار شمعدانی (همراه با حلقه تیره نعل‌اسبی در مرکز برگ)
const renderGeraniumZonalLeaf = (cx: number, cy: number, scale: number, rot: number) => (
  <g key={`ger_lf_${cx}_${cy}`} transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`}>
    <path
      d="M 0 2 C -3 6, -9 5, -10 0 C -12 -4, -9 -9, -4 -10 C 0 -12, 4 -10, 4 -10 C 9 -9, 12 -4, 10 0 C 9 5, 3 6, 0 2 Z"
      fill="#388E3C"
      stroke="#1B4332"
      strokeWidth="0.95"
    />
    {/* حلقه نعل‌اسبی تیره مشخصه اصلی برگ شمعدانی */}
    <path
      d="M -5.5 -1 C -6 -5, -3 -7.5, 0 -7.5 C 3 -7.5, 6 -5, 5.5 -1"
      stroke="#1B4332"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.65"
    />
    <path d="M 0 1 L -5 -4 M 0 1 V -6 M 0 1 L 5 -4" stroke="#86EFAC" strokeWidth="0.7" opacity="0.7" />
  </g>
);

// ز) سازنده گل‌آذین چتری و توپی شمعدانی (مجموعه‌ای از گلچه‌های ۵ پر)
const renderGeraniumUmbelCluster = (
  cx: number,
  cy: number,
  mainColor: string,
  lightColor: string
) => (
  <g key={`umbel_${cx}_${cy}`} transform={`translate(${cx}, ${cy})`}>
    {[
      [-5, 2], [5, 2], [-6, -3], [6, -3], [-2, -6], [3, -6], [0, 3], [0, -2]
    ].map(([fx, fy], i) => (
      <g key={i} transform={`translate(${fx}, ${fy})`}>
        <circle cx="-1.6" cy="-1.2" r="2.1" fill={mainColor} />
        <circle cx="1.6" cy="-1.2" r="2.1" fill={mainColor} />
        <circle cx="-2" cy="1.2" r="2.1" fill={lightColor} />
        <circle cx="2" cy="1.2" r="2.1" fill={lightColor} />
        <circle cx="0" cy="-2.2" r="2.1" fill={lightColor} />
        <circle cx="0" cy="0" r="0.8" fill="#FFF1F2" />
      </g>
    ))}
  </g>
);

export const PlantStylizedIllustration: React.FC<{
  shape: string;
  potColor: PotColorType | string;
  potShape?: PotShapeType | string;
  plantName?: string;
  customSvgMarkup?: string;
}> = ({ shape, potColor, potShape, customSvgMarkup }) => {
  const effectivePotShape = resolveEffectivePotShape(shape, potShape);
  const palette = POT_COLOR_PALETTE[potColor] || POT_COLOR_PALETTE.white;

  if (customSvgMarkup && customSvgMarkup.trim().startsWith('data:image/')) {
    return (
      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#E8E2D5] bg-[#F6F3EC] shadow-xs flex items-center justify-center">
        <img
          src={customSvgMarkup}
          alt="plant studio"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
      </div>
    );
  }

  if (customSvgMarkup && customSvgMarkup.trim().startsWith('<svg')) {
    return (
      <div
        className="w-24 h-24 flex items-center justify-center drop-shadow-xs"
        dangerouslySetInnerHTML={{ __html: customSvgMarkup }}
      />
    );
  }

  // لایه ۱: دهانه پشتی گلدان و بستر خاک تیره
  const renderBackRimAndSoil = () => {
    if (effectivePotShape === 'trough_fluted') {
      return (
        <g>
          <polygon points="24,54 30,51 76,51 72,56.5 24,56.5" fill={palette.insideHex} />
          <polygon points="26,54.2 31,51.8 74,51.8 70,56 26,56" fill="#4A3525" />
        </g>
      );
    }
    if (effectivePotShape === 'bonsai_tray') {
      return (
        <g>
          <polygon points="25,54 31,50.5 75,50.5 69,56.5 25,56.5" fill={palette.insideHex} />
          <ellipse cx="50" cy="54" rx="21" ry="3.2" fill="#4A3525" />
        </g>
      );
    }
    const rx = effectivePotShape === 'bowl_saucer' ? 21.5 : 18;
    return (
      <g>
        {effectivePotShape === 'hanging_basket' && (
          <g stroke="#A89886" strokeWidth="1.1" opacity="0.85">
            <line x1="50" y1="4" x2="31" y2="54" />
            <line x1="50" y1="4" x2="69" y2="54" />
            <circle cx="50" cy="4" r="2" fill="none" stroke="#786856" strokeWidth="1.2" />
          </g>
        )}
        <ellipse cx="50" cy="54" rx={rx} ry="3.5" fill={palette.insideHex} />
        <ellipse cx="50" cy="54.5" rx={rx - 1.5} ry="2.8" fill="#4A3525" />
      </g>
    );
  };

  // لایه ۲: شاخ‌وبرگ اصلی گیاهان با تفکیک آناتومیک کامل
  const renderUprightFoliage = () => {
    // حالت اولیه پیش از انتخاب گیاه: گلدان انتخاب‌شده + جوانه کوچک دوبرگی
    if (shape === 'empty_pot_sprout') {
      return (
        <g>
          <circle
            cx="50"
            cy="32"
            r="14"
            stroke="#2E5A44"
            strokeWidth="0.9"
            strokeDasharray="2.5 2.5"
            fill="#E6F0EB"
            fillOpacity="0.35"
          />
          <path d="M50 55V39" stroke="#2E5A44" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M50 43C43 43 38 38 38 32C44 32 49 36 50 43Z"
            fill="#52B788"
            stroke="#1B4332"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path
            d="M50 40C50 33 55 28 62 28C62 34 57 39 50 40Z"
            fill="#74C69D"
            stroke="#1B4332"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </g>
      );
    }
    // ۱. خانواده آگلونماها (۶ واریته متمایز شامل آگلونما سبز زمردی خالص)
    if (shape === 'aglaonema' || shape.startsWith('aglaonema_')) {
      const cfg =
        shape === 'aglaonema_green'
          ? {
              outer: '#15803D',
              stroke: '#0F291E',
              inner: '#22C55E',
              vein: '#86EFAC',
              stem: '#4ADE80',
              pat: 'feather' as const
            }
          : shape === 'aglaonema_red'
          ? {
              outer: '#1B4332',
              stroke: '#0F291E',
              inner: '#E11D48',
              vein: '#FB7185',
              stem: '#FDA4AF',
              pat: 'none' as const
            }
          : shape === 'aglaonema_snow'
          ? {
              outer: '#2D6A4F',
              stroke: '#1B4332',
              inner: '#F8FAFC',
              vein: '#2D6A4F',
              stem: '#F1F5F9',
              pat: 'snow_dots' as const
            }
          : shape === 'aglaonema_gold'
          ? {
              outer: '#1E5631',
              stroke: '#143820',
              inner: '#FDE047',
              vein: '#CA8A04',
              stem: '#DCFCE7',
              pat: 'none' as const
            }
          : shape === 'aglaonema_dark'
          ? {
              outer: '#143825',
              stroke: '#0A2115',
              inner: '#2D6A4F',
              vein: '#52B788',
              stem: '#2D6A4F',
              pat: 'none' as const
            }
          : {
              outer: '#2D6A4F',
              stroke: '#1B4332',
              inner: '#CBD5E1',
              vein: '#2D6A4F',
              stem: '#95D5B2',
              pat: 'silver_queen' as const
            };

      return (
        <g>
          <path
            d="M46 55L32 34M54 55L68 34M48 55L38 25M52 55L62 25M50 55V20"
            stroke={cfg.stem}
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          {renderPointedBlade(29, 36, 6.8, 14.5, -38, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(71, 36, 6.8, 14.5, 38, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(37, 26, 7.4, 16, -20, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(63, 26, 7.4, 16, 20, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(44, 38, 6.5, 13, -12, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(56, 38, 6.5, 13, 12, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
          {renderPointedBlade(50, 21, 8, 17, 0, cfg.outer, cfg.stroke, cfg.inner, cfg.vein, cfg.pat)}
        </g>
      );
    }
    // ۲. خانواده شفلرا (سبز، ابلق و بونسای شفلرا با چترهای ۷ برگچه‌ای واقعی و تنه منشعب)
    if (shape === 'schefflera' || shape === 'schefflera_variegated' || shape === 'schefflera_green' || shape === 'bonsai_schefflera') {
      const isVar = shape === 'schefflera_variegated';
      const isBonsai = shape === 'bonsai_schefflera';
      return (
        <g>
          {/* تنه چوبی و دمبرگ‌های منشعب */}
          {isBonsai ? (
            <path d="M44 55 C44 43 48 38 50 32 C52 38 56 43 56 55" fill="#785A40" stroke="#4A3525" strokeWidth="1.5" />
          ) : (
            <path d="M50 55V26" stroke="#6E5039" strokeWidth="3.2" strokeLinecap="round" />
          )}
          <path d="M50 44L31 32M50 40L69 31M50 32L37 19M50 32L63 19M50 28V15" stroke="#40916C" strokeWidth="1.8" strokeLinecap="round" />
          {renderScheffleraUmbrella(30, 32, 0.78, isVar)}
          {renderScheffleraUmbrella(70, 31, 0.78, isVar)}
          {renderScheffleraUmbrella(37, 19, 0.85, isVar)}
          {renderScheffleraUmbrella(63, 19, 0.85, isVar)}
          {renderScheffleraUmbrella(50, 14, 0.95, isVar)}
        </g>
      );
    }

    // ========================================================================
    // ۲۸. خانواده بزرگ ساکولنت‌ها (فاز ۸ - تفکیک کامل آناتومیک ۲۳ گونه)
    // ========================================================================
    if (
      shape === 'echeveria' ||
      shape.startsWith('echeveria_') ||
      shape.startsWith('aeonium_') ||
      shape === 'haworthia' ||
      shape.startsWith('haworthia_') ||
      shape.startsWith('crassula_') ||
      shape === 'aloe' ||
      shape.startsWith('aloe_') ||
      shape === 'agave_variegated' ||
      shape === 'sedum' ||
      shape.startsWith('sedum_') ||
      shape === 'adenium' ||
      shape === 'adenium_obesum' ||
      shape === 'lithops_stone' ||
      shape === 'portulacaria_afra' ||
      shape === 'senecio_blue'
    ) {
      // ۱. لیتوپس (سنگ زنده - دو جفت لپه سنگی شکاف‌دار روی خاک با گل زرد/سفید)
      if (shape === 'lithops_stone') {
        return (
          <g>
            {/* جفت سنگ سمت چپ */}
            <path d="M29 54 C27 44, 34 39, 39 40 C39 46, 39 51, 39 54 Z" fill="#A89886" stroke="#6E604F" strokeWidth="1" />
            <path d="M40 54 C40 51, 40 46, 40 40 C45 39, 51 44, 49 54 Z" fill="#B59672" stroke="#6E604F" strokeWidth="1" />
            <ellipse cx="39.5" cy="41.5" rx="7.5" ry="2.5" fill="#8A6F4E" />
            <line x1="32" y1="41.5" x2="47" y2="41.5" stroke="#4A3525" strokeWidth="1.2" />
            <circle cx="35" cy="41" r="0.8" fill="#4A3525" />
            <circle cx="43" cy="42" r="0.8" fill="#4A3525" />
            {/* جفت سنگ سمت راست به همراه گل بابونه‌ای در شکاف */}
            <path d="M51 54 C49 42, 55 36, 60.5 37 C60.5 44, 60.5 50, 60.5 54 Z" fill="#94836F" stroke="#5C4D3C" strokeWidth="1" />
            <path d="M61.5 54 C61.5 50, 61.5 44, 61.5 37 C67 36, 73 42, 71 54 Z" fill="#A89886" stroke="#5C4D3C" strokeWidth="1" />
            <ellipse cx="61" cy="38.5" rx="8.5" ry="2.8" fill="#6E5A4F" />
            {/* گل بابونه‌ای زرد-سفید خارج‌شده از شکاف لیتوپس */}
            <g transform="translate(61, 34)">
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                <ellipse key={deg} cx="0" cy="-4.5" rx="1.2" ry="3.8" transform={`rotate(${deg})`} fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.4" />
              ))}
              <circle cx="0" cy="0" r="2.2" fill="#F59E0B" />
            </g>
          </g>
        );
      }

      // ۲. کراسولا گولوم (شاخ‌بزی / گوش شرک - برگ‌های لوله‌ای با دهانه گود قرمز)
      if (shape === 'crassula_gollum') {
        return (
          <g>
            <path d="M50 55V36M50 45L37 36M50 43L63 35" stroke="#8C6D53" strokeWidth="4.2" strokeLinecap="round" />
            {[
              { x1: 37, y1: 38, x2: 26, y2: 24, rx: 3.2 },
              { x1: 39, y1: 36, x2: 35, y2: 18, rx: 3.2 },
              { x1: 47, y1: 37, x2: 44, y2: 15, rx: 3.4 },
              { x1: 53, y1: 37, x2: 56, y2: 15, rx: 3.4 },
              { x1: 61, y1: 36, x2: 65, y2: 18, rx: 3.2 },
              { x1: 63, y1: 38, x2: 74, y2: 24, rx: 3.2 },
              { x1: 50, y1: 39, x2: 50, y2: 22, rx: 3.5 }
            ].map((tb, i) => (
              <g key={i}>
                <path
                  d={`M ${tb.x1 - 2} ${tb.y1} L ${tb.x2 - tb.rx} ${tb.y2} L ${tb.x2 + tb.rx} ${tb.y2} L ${tb.x1 + 2} ${tb.y1} Z`}
                  fill={i % 2 === 0 ? '#40916C' : '#52B788'}
                  stroke="#1B4332"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
                <ellipse cx={tb.x2} cy={tb.y2} rx={tb.rx} ry="1.6" fill="#E11D48" stroke="#881337" strokeWidth="0.7" />
                <ellipse cx={tb.x2} cy={tb.y2} rx={tb.rx * 0.5} ry="0.8" fill="#FACC15" opacity="0.7" />
              </g>
            ))}
          </g>
        );
      }

      // ۳. کراسولا معبد بودا (ستون هندسی پاگودایی از برگ‌های متراکم رو به بالا)
      if (shape === 'crassula_buddha') {
        return (
          <g>
            {[50, 46, 42, 38, 34, 30, 26, 22, 18, 14].map((y, idx) => {
              const w = idx < 8 ? 13 : 10;
              return (
                <path
                  key={y}
                  d={`M 50 ${y + 3} L ${50 - w} ${y - 3} L 50 ${y - 1} L ${50 + w} ${y - 3} Z`}
                  fill={idx % 2 === 0 ? '#739584' : '#94B49F'}
                  stroke="#3A5A40"
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
              );
            })}
            <circle cx="50" cy="11" r="2.5" fill="#B7E4C7" stroke="#3A5A40" strokeWidth="0.8" />
          </g>
        );
      }

      // ۴. کراسولا خرفه‌ای (درختچه یشم) و پورتولاکاریا (خرفه فیلی)
      if (shape === 'crassula_ovata' || shape === 'portulacaria_afra') {
        const isPort = shape === 'portulacaria_afra';
        return (
          <g>
            {/* تنه چوبی دوشاخه */}
            <path
              d="M50 55V32M50 42L34 28M50 38L66 26M34 28L27 19M66 26L73 18"
              stroke={isPort ? '#7F1D1D' : '#785A40'}
              strokeWidth={isPort ? '3' : '4.5'}
              strokeLinecap="round"
            />
            {[
              [27, 26, -20], [40, 30, 20], [60, 28, -20], [73, 25, 20],
              [24, 17, -15], [33, 16, 15], [65, 16, -15], [75, 17, 15],
              [44, 22, -12], [56, 22, 12], [50, 15, 0]
            ].map(([lx, ly, rot], i) => (
              <ellipse
                key={i}
                cx={lx}
                cy={ly}
                rx={isPort ? '4.5' : '6.8'}
                ry={isPort ? '3.8' : '4.4'}
                transform={`rotate(${rot} ${lx} ${ly})`}
                fill={i % 2 === 0 ? '#40916C' : '#52B788'}
                stroke={isPort ? '#1B4332' : '#E11D48'}
                strokeWidth="1"
              />
            ))}
          </g>
        );
      }

      // ۵. کراسولا آتشین (Campfire)
      if (shape === 'crassula_campfire') {
        return (
          <g>
            {[
              { cx: 32, cy: 42, r: -35, c: '#DC2626' },
              { cx: 68, cy: 42, r: 35, c: '#DC2626' },
              { cx: 36, cy: 31, r: -22, c: '#EA580C' },
              { cx: 64, cy: 31, r: 22, c: '#EA580C' },
              { cx: 43, cy: 23, r: -10, c: '#F59E0B' },
              { cx: 57, cy: 23, r: 10, c: '#F59E0B' },
              { cx: 50, cy: 32, r: 0, c: '#84CC16' },
              { cx: 50, cy: 17, r: 0, c: '#A3E635' }
            ].map((lf, i) => (
              <path
                key={i}
                d={`M ${lf.cx} ${lf.cy - 10} L ${lf.cx + 5.5} ${lf.cy + 2} L ${lf.cx} ${lf.cy + 9} L ${lf.cx - 5.5} ${lf.cy + 2} Z`}
                transform={`rotate(${lf.r} ${lf.cx} ${lf.cy})`}
                fill={lf.c}
                stroke="#7F1D1D"
                strokeWidth="0.9"
              />
            ))}
          </g>
        );
      }

      // ۶. کراسولا بندکفشی (Muscosa) و سنسیو آبی (Chalksticks)
      if (shape === 'crassula_muscosa' || shape === 'senecio_blue') {
        const isBlue = shape === 'senecio_blue';
        return (
          <g>
            {[
              { x1: 38, x2: 28, y2: 24 },
              { x1: 43, x2: 37, y2: 15 },
              { x1: 48, x2: 46, y2: 10 },
              { x1: 52, x2: 54, y2: 10 },
              { x1: 57, x2: 63, y2: 15 },
              { x1: 62, x2: 72, y2: 24 }
            ].map((sp, i) => (
              <path
                key={i}
                d={`M ${sp.x1} 54 L ${sp.x2} ${sp.y2}`}
                stroke={isBlue ? (i % 2 === 0 ? '#7DD3FC' : '#38BDF8') : i % 2 === 0 ? '#4D7C0F' : '#65A30D'}
                strokeWidth={isBlue ? '4.2' : '4.8'}
                strokeLinecap="round"
                strokeDasharray={isBlue ? undefined : '2.5 1.2'}
              />
            ))}
          </g>
        );
      }

      // ۷. سدوم چمن عروس و سدوم پالمری (با گل‌های ستاره‌ای طلایی)
      if (shape === 'sedum' || shape === 'sedum_turf' || shape === 'sedum_palmeri') {
        const isPalmeri = shape === 'sedum_palmeri';
        return (
          <g>
            {[
              [32, 49], [40, 47], [50, 48], [60, 47], [68, 49],
              [27, 43], [36, 41], [45, 40], [55, 40], [64, 41], [73, 43],
              [33, 35], [42, 33], [50, 32], [58, 33], [67, 35],
              [41, 26], [50, 25], [59, 26]
            ].map(([cx, cy], idx) => (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r="5.2"
                fill={idx % 2 === 0 ? '#65A30D' : '#A3E635'}
                stroke="#3F6212"
                strokeWidth="0.9"
              />
            ))}
            {isPalmeri && (
              <g>
                {[
                  [34, 25], [50, 18], [66, 25]
                ].map(([fx, fy], i) => (
                  <g key={i}>
                    <circle cx={fx} cy={fy} r="3.6" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
                    <circle cx={fx} cy={fy} r="1.2" fill="#EA580C" />
                  </g>
                ))}
              </g>
            )}
          </g>
        );
      }

      // ۸. آدنیوم (رز کویری - کودکس متورم و گل‌های شیپوری ۵ پر سرخابی با مرکز سفید)
      if (shape === 'adenium' || shape === 'adenium_obesum') {
        return (
          <g>
            {/* کودکس (تنه غده‌ای) */}
            <path
              d="M38 55 C35 42, 41 33, 45 29 C48 26, 52 26, 55 29 C59 33, 65 42, 62 55 Z"
              fill="#A89886"
              stroke="#5C4D3C"
              strokeWidth="1.5"
            />
            <path d="M45 30L35 19M55 30L65 19M50 28V15" stroke="#A89886" strokeWidth="3.8" strokeLinecap="round" />
            {/* برگ‌های چرمی سبز */}
            <ellipse cx="30" cy="22" rx="6" ry="2.8" transform="rotate(-20 30 22)" fill="#2D6A4F" stroke="#143325" strokeWidth="0.9" />
            <ellipse cx="70" cy="22" rx="6" ry="2.8" transform="rotate(20 70 22)" fill="#2D6A4F" stroke="#143325" strokeWidth="0.9" />
            <ellipse cx="43" cy="18" rx="5.5" ry="2.5" transform="rotate(-15 43 18)" fill="#40916C" />
            <ellipse cx="57" cy="18" rx="5.5" ry="2.5" transform="rotate(15 57 18)" fill="#40916C" />
            {/* ۳ گل شیپوری ۵ پر رز کویری */}
            {[
              [35, 16, 0.9], [65, 16, 0.9], [50, 11, 1.1]
            ].map(([fx, fy, sc], i) => (
              <g key={i} transform={`translate(${fx}, ${fy}) scale(${sc})`}>
                {[0, 72, 144, 216, 288].map((deg) => (
                  <ellipse key={deg} cx="0" cy="-3.5" rx="2.6" ry="3.8" transform={`rotate(${deg})`} fill="#E11D48" stroke="#881337" strokeWidth="0.6" />
                ))}
                <circle cx="0" cy="0" r="2.2" fill="#FFF1F2" />
                <circle cx="0" cy="0" r="0.9" fill="#FACC15" />
              </g>
            ))}
          </g>
        );
      }

      // ۹. هاورتیا شیشه‌ای کوپری (برگ‌های حبابی آبکی و نیمه‌شفاف)
      if (shape === 'haworthia_cooperi') {
        return (
          <g>
            {[
              [-36, 34, 44], [36, 66, 44], [-22, 38, 36], [22, 62, 36],
              [-10, 44, 31], [10, 56, 31], [0, 50, 28], [-15, 42, 43], [15, 58, 43]
            ].map(([rot, cx, cy], idx) => (
              <g key={idx} transform={`rotate(${rot} ${cx} ${cy})`}>
                <ellipse cx={cx} cy={cy} rx="5.2" ry="9" fill="#34D399" fillOpacity="0.82" stroke="#059669" strokeWidth="1" />
                {/* پنجره نوری شفاف در نوک برگ */}
                <ellipse cx={cx} cy={cy - 4.2} rx="3.4" ry="3.8" fill="#CCFBF1" fillOpacity="0.88" />
                <line x1={cx} y1={cy - 7.5} x2={cx} y2={cy - 1} stroke="#FFFFFF" strokeWidth="0.9" opacity="0.9" />
              </g>
            ))}
          </g>
        );
      }

      // ۱۰. هاورتیا گورخری، لیموفولیا، آلوئه‌ورا، آلوئه ببری و آگاو ابلق
      if (
        shape === 'haworthia' ||
        shape === 'haworthia_fasciata' ||
        shape === 'haworthia_limifolia' ||
        shape === 'haworthia_limifolia_var' ||
        shape === 'aloe' ||
        shape === 'aloe_vera' ||
        shape === 'aloe_variegata' ||
        shape === 'agave_variegated'
      ) {
        const isAgave = shape === 'agave_variegated';
        const isVarLim = shape === 'haworthia_limifolia_var';
        const isAloeVera = shape === 'aloe' || shape === 'aloe_vera';
        const bladeCol = isAloeVera ? '#52B788' : isAgave ? '#2D6A4F' : '#1B4332';
        const edgeCol = isAgave || isVarLim ? '#FACC15' : '#143325';

        return (
          <g>
            {[
              { d: 'M46 54C34 44 23 32 18 20C30 25 40 37 48 54Z' },
              { d: 'M54 54C66 44 77 32 82 20C70 25 60 37 52 54Z' },
              { d: 'M48 54C39 36 33 20 33 8C42 20 47 36 50 54Z' },
              { d: 'M52 54C61 36 67 20 67 8C58 20 53 36 50 54Z' },
              { d: 'M47 54C47 34 48 15 50 4C52 15 53 34 53 54Z' }
            ].map((item, idx) => (
              <path
                key={idx}
                d={item.d}
                fill={bladeCol}
                stroke={edgeCol}
                strokeWidth={isAgave || isVarLim ? '1.6' : '1.1'}
                strokeLinejoin="round"
              />
            ))}
            {!isAloeVera && !isAgave && (
              <path
                d="M44 22H56M37 30H63M31 38H69M42 45H58"
                stroke={isVarLim ? '#FEF08A' : '#F8FAFC'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="2.5 2.5"
              />
            )}
            {isAloeVera && (
              <g fill="#D8F3DC" opacity="0.85">
                <circle cx="49" cy="22" r="1" />
                <circle cx="51" cy="30" r="1" />
                <circle cx="40" cy="26" r="1" />
                <circle cx="60" cy="26" r="1" />
              </g>
            )}
          </g>
        );
      }

      // ۱۱. آئونیوم زوارتکپ (بنفش/مشکی) و آئونیوم کیوی (سه‌رنگ)
      if (shape === 'aeonium_zwartkop' || shape === 'aeonium_kiwi') {
        const isKiwi = shape === 'aeonium_kiwi';
        const outerCol = isKiwi ? '#E11D48' : '#2E1035';
        const midCol = isKiwi ? '#FEF08A' : '#4A154B';
        const centerCol = '#4ADE80';

        return (
          <g>
            <path d="M50 55V35M50 45L33 34M50 45L67 34" stroke="#785A40" strokeWidth="3.2" strokeLinecap="round" />
            {[
              { cx: 32, cy: 33, s: 0.65 },
              { cx: 68, cy: 33, s: 0.65 },
              { cx: 50, cy: 23, s: 0.95 }
            ].map((rs, i) => (
              <g key={i} transform={`translate(${rs.cx}, ${rs.cy}) scale(${rs.s})`}>
                {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                  <ellipse key={deg} cx="0" cy="-8" rx="3.8" ry="10.5" transform={`rotate(${deg})`} fill={outerCol} stroke="#1B0924" strokeWidth="0.8" />
                ))}
                {[18, 78, 138, 198, 258, 318].map((deg) => (
                  <ellipse key={deg} cx="0" cy="-5.5" rx="3" ry="7" transform={`rotate(${deg})`} fill={midCol} />
                ))}
                <circle cx="0" cy="0" r="3.8" fill={centerCol} />
              </g>
            ))}
          </g>
        );
      }

      // ۱۲. خانواده اچوریاها (الگانس، بلک پرنس، پرل فون نورنبرگ، آگاوویدس)
      const isBlackPrince = shape === 'echeveria_black_prince';
      const isPerle = shape === 'echeveria_perle';
      const isAgavoides = shape === 'echeveria_agavoides';

      const cOuter = isBlackPrince
        ? '#3B0764'
        : isPerle
        ? '#9D4EDD'
        : isAgavoides
        ? '#65A30D'
        : '#52B788';
      const cInner = isBlackPrince
        ? '#581C87'
        : isPerle
        ? '#E0AAFF'
        : isAgavoides
        ? '#84CC16'
        : '#95D5B2';
      const cStroke = isAgavoides ? '#E11D48' : isPerle ? '#7B2CBF' : '#1B4332';

      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="50"
              cy="33"
              rx="6.8"
              ry="13.8"
              transform={`rotate(${deg} 50 41)`}
              fill={cOuter}
              stroke={cStroke}
              strokeWidth="1.15"
            />
          ))}
          {[22, 82, 142, 202, 262, 322].map((deg) => (
            <ellipse
              key={deg}
              cx="50"
              cy="36"
              rx="4.8"
              ry="9.5"
              transform={`rotate(${deg} 50 41)`}
              fill={cInner}
              stroke={cStroke}
              strokeWidth="0.9"
            />
          ))}
          <circle cx="50" cy="41" r="4" fill={isBlackPrince ? '#84CC16' : isPerle ? '#FCE7F3' : '#D8F3DC'} />
        </g>
      );
    }

    // ========================================================================
    // ۲۹. خانواده کاکتوس‌ها و افوربیاها (فاز ۹ - تفکیک کامل آناتومیک ۲۰ گونه)
    // ========================================================================
    if (
      shape === 'cactus' ||
      shape === 'opuntia' ||
      shape === 'christmas_cactus' ||
      shape.startsWith('cactus_') ||
      shape.startsWith('euphorbia_')
    ) {
      // ۱. کاکتوس کریسمس (زیگوکاکتوس)
      if (shape === 'christmas_cactus' || shape === 'cactus_christmas_zygocactus') {
        return (
          <g>
            {[
              'M46 53 Q35 42 22 48',
              'M48 52 Q38 32 25 35',
              'M50 52 Q50 30 50 16',
              'M52 52 Q62 32 75 35',
              'M54 53 Q65 42 78 48'
            ].map((d, idx) => (
              <path key={idx} d={d} stroke="#40916C" strokeWidth="4.8" strokeLinecap="round" strokeDasharray="6.5 2" fill="none" />
            ))}
            {[
              [22, 48], [25, 35], [50, 15], [75, 35], [78, 48]
            ].map(([fx, fy], i) => (
              <g key={i}>
                <circle cx={fx} cy={fy} r="3.4" fill="#E11D48" />
                <circle cx={fx} cy={fy} r="1.5" fill="#FECDD3" />
              </g>
            ))}
          </g>
        );
      }

      // ۲. کاکتوس پیوندی رنگی (Moon Cactus - پایه سبز مثلثی + کلاهک کروی قرمز/زرد نئونی)
      if (shape === 'cactus_moon_grafted') {
        return (
          <g>
            {/* پایه سبز هیلوسرئوس */}
            <rect x="44" y="32" width="12" height="23" rx="2" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.3" />
            <line x1="50" y1="33" x2="50" y2="54" stroke="#52B788" strokeWidth="1.2" />
            {/* کلاهک کروی یاقوتی/نارنجی پیوندی */}
            <circle cx="50" cy="23" r="11.5" fill="#E11D48" stroke="#881337" strokeWidth="1.3" />
            <path d="M43 14C41 20 41 26 43 32M50 12V34M57 14C59 20 59 26 57 32" stroke="#FB7185" strokeWidth="1" fill="none" />
            {/* بچه‌کاکتوس‌های کوچک روی کلاهک */}
            <circle cx="38" cy="25" r="3.5" fill="#F43F5E" stroke="#881337" strokeWidth="0.9" />
            <circle cx="62" cy="22" r="3.8" fill="#F43F5E" stroke="#881337" strokeWidth="0.9" />
            <circle cx="43" cy="14" r="2.8" fill="#FDA4AF" />
          </g>
        );
      }

      // ۳. آستروفیتوم ستاره‌ای (کلاه اسقف بدون خار با خال‌های سفید و گل زرد ابریشمی)
      if (shape === 'cactus_astrophytum_star') {
        return (
          <g>
            <ellipse cx="50" cy="42" rx="17" ry="13" fill="#5F7A61" stroke="#2F3E30" strokeWidth="1.4" />
            {/* شیارهای ستاره‌ای آستروفیتوم */}
            <path d="M50 29V55M41 31C38 38 38 47 42 54M59 31C62 38 62 47 58 54M34 38L66 44" stroke="#2F3E30" strokeWidth="1.1" fill="none" />
            {/* آرئول‌های پشمی سفید و خال‌های نقره‌ای */}
            {[34, 39, 45, 50].map((y) => (
              <circle key={y} cx="50" cy={y} r="1.3" fill="#F8FAFC" />
            ))}
            <circle cx="42" cy="38" r="1" fill="#E2E8F0" />
            <circle cx="58" cy="38" r="1" fill="#E2E8F0" />
            <circle cx="40" cy="45" r="1" fill="#E2E8F0" />
            <circle cx="60" cy="45" r="1" fill="#E2E8F0" />
            {/* گل ستاره‌ای زرد با مرکز قرمز در تاج آستروفیتوم */}
            <g transform="translate(50, 27)">
              {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                <ellipse key={deg} cx="0" cy="-4.5" rx="1.4" ry="4.2" transform={`rotate(${deg})`} fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.5" />
              ))}
              <circle cx="0" cy="0" r="2.4" fill="#DC2626" />
            </g>
          </g>
        );
      }

      // ۴. کاکتوس توپ طلایی (اچینو گروزونی - کره بزرگ با خارهای طلایی درخشان)
      if (shape === 'cactus_golden_barrel') {
        return (
          <g>
            <circle cx="50" cy="39" r="16.5" fill="#3F7A4D" stroke="#1E4628" strokeWidth="1.5" />
            <path d="M39 26C36 35 36 44 39 53M45 23C43 34 43 44 45 55M50 22V55M55 23C57 34 57 44 55 55M61 26C64 35 64 44 61 53" stroke="#1E4628" strokeWidth="1" fill="none" />
            {/* تاج پشمی طلایی در راس */}
            <ellipse cx="50" cy="23.5" rx="6.5" ry="2.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
            {/* خارهای ستاره‌ای طلایی */}
            {[
              [40, 32], [50, 30], [60, 32], [38, 42], [46, 40], [54, 40], [62, 42], [43, 49], [57, 49]
            ].map(([sx, sy], i) => (
              <path
                key={i}
                d={`M ${sx - 2.5} ${sy - 2} L ${sx + 2.5} ${sy + 2} M ${sx + 2.5} ${sy - 2} L ${sx - 2.5} ${sy + 2}`}
                stroke="#FACC15"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      }

      // ۵. مامیلاریا پلوموزا (پر قو) و مامیلاریا گراسیلیس (بندانگشتی)
      if (shape === 'cactus_mammillaria_plumosa' || shape === 'cactus_mammillaria_gracilis') {
        const isPlumosa = shape === 'cactus_mammillaria_plumosa';
        return (
          <g>
            {[
              [34, 47, 7.5], [66, 47, 7.5], [42, 44, 8.5], [58, 44, 8.5],
              [38, 35, 7.5], [62, 35, 7.5], [50, 33, 9.5], [50, 46, 8.5]
            ].map(([cx, cy, r], i) => (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={isPlumosa ? '#F1F5F9' : '#40916C'}
                  stroke={isPlumosa ? '#CBD5E1' : '#F8FAFC'}
                  strokeWidth="1.3"
                  strokeDasharray={isPlumosa ? '2 1' : '1.5 1.5'}
                />
                <circle cx={cx} cy={cy} r={r * 0.45} fill="#E2E8F0" opacity="0.7" />
              </g>
            ))}
          </g>
        );
      }

      // ۶. کاکتوس پیرمرد (سفالوسرئوس با موهای سفید ابریشمی)، سرئوس ستونی، صخره‌ای و تیغ‌سگی
      if (
        shape === 'cactus_old_man' ||
        shape === 'cactus_cereus_column' ||
        shape === 'cactus_rock_monstrosus' ||
        shape === 'cactus_eves_needle'
      ) {
        if (shape === 'cactus_old_man') {
          return (
            <g>
              <rect x="42" y="14" width="16" height="41" rx="8" fill="#52796F" stroke="#354F52" strokeWidth="1.2" />
              {/* موهای سفید موج‌دار کاکتوس پیرمرد */}
              {[
                'M44 16 Q38 26 42 36 Q38 45 43 54',
                'M48 14 Q44 25 48 35 Q45 45 48 54',
                'M52 14 Q56 25 52 35 Q55 45 52 54',
                'M56 16 Q62 26 58 36 Q62 45 57 54'
              ].map((d, i) => (
                <path key={i} d={d} stroke="#F8FAFC" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9" />
              ))}
            </g>
          );
        }

        if (shape === 'cactus_rock_monstrosus') {
          return (
            <g>
              {[
                [38, 46, 7], [62, 46, 7], [45, 42, 8], [55, 42, 8],
                [42, 32, 7.5], [58, 32, 7.5], [48, 25, 8], [53, 18, 6.5]
              ].map(([cx, cy, r], i) => (
                <polygon
                  key={i}
                  points={`${cx - r},${cy + r} ${cx - r * 0.7},${cy - r} ${cx + r * 0.8},${cy - r * 0.6} ${cx + r},${cy + r}`}
                  fill={i % 2 === 0 ? '#3B7A57' : '#52796F'}
                  stroke="#1B4332"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          );
        }

        const isEves = shape === 'cactus_eves_needle';
        return (
          <g>
            {/* ۳ ستون سرئوس به رنگ سبز-آبی */}
            <rect x="34" y="25" width="8.5" height="30" rx="4.2" fill="#3B7A57" stroke="#1B4332" strokeWidth="1.2" />
            <rect x="57.5" y="21" width="8.5" height="34" rx="4.2" fill="#3B7A57" stroke="#1B4332" strokeWidth="1.2" />
            <rect x="45" y="11" width="10" height="44" rx="5" fill="#529471" stroke="#1B4332" strokeWidth="1.3" />
            <line x1="50" y1="12" x2="50" y2="54" stroke="#1B4332" strokeWidth="0.9" />
            {isEves && (
              <path d="M45 18L39 14M55 18L61 14M45 25L39 22M55 25L61 22" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
            )}
          </g>
        );
      }

      // ۷. اپونتیا راکتی و گوش‌خرگوشی (Bunny Ears)
      if (shape === 'opuntia' || shape === 'cactus_opuntia_paddle' || shape === 'cactus_bunny_ears') {
        const isBunny = shape === 'cactus_bunny_ears';
        return (
          <g>
            <ellipse cx="50" cy="41" rx="12.5" ry="14" fill="#40916C" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="36" cy="23" rx="7.2" ry="11" transform="rotate(-24 36 23)" fill="#52B788" stroke="#1B4332" strokeWidth="1.3" />
            <ellipse cx="64" cy="23" rx="7.2" ry="11" transform="rotate(24 64 23)" fill="#52B788" stroke="#1B4332" strokeWidth="1.3" />
            {/* خال‌های طلایی گلوکید گوش‌خرگوشی */}
            {[
              [45, 36], [55, 36], [50, 42], [45, 48], [55, 48],
              [34, 20], [38, 26], [66, 20], [62, 26]
            ].map(([gx, gy], i) => (
              <circle key={i} cx={gx} cy={gy} r={isBunny ? '1.6' : '1.1'} fill={isBunny ? '#FACC15' : '#FEF3C7'} />
            ))}
            {!isBunny && (
              <g fill="#E11D48" stroke="#881337" strokeWidth="0.8">
                <circle cx="31" cy="12" r="2.8" />
                <circle cx="69" cy="12" r="2.8" />
              </g>
            )}
          </g>
        );
      }

      // ۸. خانواده افوربیاها (مدادی آتشین، تریگونا، مرجان پیوندی لاکتئا و مرجان گلدار میلی)
      if (shape.startsWith('euphorbia_')) {
        if (shape === 'euphorbia_pencil') {
          return (
            <g>
              <path d="M50 55V30M48 45L32 22M52 45L68 22M46 36L38 12M54 36L62 12M50 32V8" stroke="#65A30D" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M32 22L26 13M38 12L35 5M50 16V6M62 12L65 5M68 22L74 13" stroke="#EA580C" strokeWidth="2.6" strokeLinecap="round" />
            </g>
          );
        }

        if (shape === 'euphorbia_coral_lactea') {
          return (
            <g>
              <rect x="46" y="34" width="8" height="21" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.2" />
              {/* تاج بادبزنی و موج‌دار مرجان پیوندی */}
              <path
                d="M 32 34 C 24 22, 34 10, 50 12 C 66 10, 76 22, 68 34 C 60 36, 40 36, 32 34 Z"
                fill="#A7F3D0"
                stroke="#F43F5E"
                strokeWidth="2.4"
              />
              <path d="M36 28 Q42 18 50 26 Q58 18 64 28" stroke="#2D6A4F" strokeWidth="1.5" fill="none" />
            </g>
          );
        }

        if (shape === 'euphorbia_milii_crown') {
          return (
            <g>
              <path d="M46 55L40 24M54 55L60 24M50 55V20" stroke="#786856" strokeWidth="3.2" strokeLinecap="round" />
              <ellipse cx="36" cy="26" rx="6" ry="3.2" fill="#40916C" stroke="#1B4332" strokeWidth="0.9" />
              <ellipse cx="64" cy="26" rx="6" ry="3.2" fill="#40916C" stroke="#1B4332" strokeWidth="0.9" />
              <ellipse cx="50" cy="22" rx="6.5" ry="3.4" fill="#52B788" stroke="#1B4332" strokeWidth="0.9" />
              {[
                [38, 17], [62, 17], [50, 12], [44, 21], [56, 21]
              ].map(([fx, fy], i) => (
                <g key={i}>
                  <circle cx={fx - 2} cy={fy} r="2.6" fill="#E11D48" />
                  <circle cx={fx + 2} cy={fy} r="2.6" fill="#E11D48" />
                  <circle cx={fx} cy={fy} r="1" fill="#FACC15" />
                </g>
              ))}
            </g>
          );
        }

        // افوربیا تریگونا (ستونی شمعدانی با برگچه‌های اشکی در کناره‌ها)
        return (
          <g>
            <rect x="46" y="10" width="8" height="45" rx="2" fill="#1B4332" stroke="#0F291E" strokeWidth="1.2" />
            <rect x="35" y="24" width="6.5" height="22" rx="2" fill="#2D6A4F" stroke="#0F291E" strokeWidth="1.1" />
            <rect x="58.5" y="20" width="6.5" height="26" rx="2" fill="#2D6A4F" stroke="#0F291E" strokeWidth="1.1" />
            {[15, 23, 31, 39].map((y) => (
              <g key={y} fill="#E11D48">
                <ellipse cx="43.5" cy={y} rx="2.5" ry="1.3" transform={`rotate(-25 43.5 ${y})`} />
                <ellipse cx="56.5" cy={y} rx="2.5" ry="1.3" transform={`rotate(25 56.5 ${y})`} />
              </g>
            ))}
          </g>
        );
      }

      // ۹. کاکتوس‌های کروی (مامیلاریا هانیا با تاج گل حلقه‌ای، اچینوپسیس و ژیمنوکالیسیوم)
      const isGymno = shape === 'cactus_gymnocalycium';
      const isEchinopsis = shape === 'cactus_echinopsis';
      const bodyCol = isGymno ? '#4A2545' : '#3D7A4F';

      return (
        <g>
          <circle cx="50" cy="40" r="15.5" fill={bodyCol} stroke="#1B4332" strokeWidth="1.5" />
          <path d="M43 25C41 35 41 45 43 55M50 24V55M57 25C59 35 59 45 57 55" stroke="#1B4332" strokeWidth="1.1" fill="none" />
          {isEchinopsis ? (
            // گل شیپوری بزرگ در کنار اچینوپسیس
            <g>
              <path d="M62 36 Q73 30 78 20" stroke="#785A40" strokeWidth="2.4" fill="none" />
              <circle cx="79" cy="18" r="6" fill="#F472B6" stroke="#9D174D" strokeWidth="0.9" />
              <circle cx="79" cy="18" r="2.2" fill="#FEF08A" />
            </g>
          ) : (
            // تاج حلقه‌ای گل‌های سرخابی مامیلاریا هانیا
            <g>
              {[41, 45.5, 50, 54.5, 59].map((fx, i) => (
                <circle key={i} cx={fx} cy={26 + Math.abs(50 - fx) * 0.22} r="2.4" fill="#EC4899" stroke="#831843" strokeWidth="0.6" />
              ))}
            </g>
          )}
        </g>
      );
    }

    // ۳. خانواده گل‌های رز (هلندی، مینیاتوری، رونده، محمدی، نسترن و درختچه‌ای با گلبرگ‌های مارپیچی و برگ مرکب)
    if (
      shape === 'rose_bush' ||
      shape === 'climbing_rose' ||
      shape === 'rose_dutch' ||
      shape === 'rose_miniature' ||
      shape === 'rose_climbing' ||
      shape === 'rose_dog_nastaran' ||
      shape === 'rose_damask' ||
      shape === 'rose_shrub'
    ) {
      // الف) رز رونده و نسترن (با قیم چوبی و شاخه کمانی پرگل)
      if (shape === 'climbing_rose' || shape === 'rose_climbing' || shape === 'rose_dog_nastaran') {
        const isNastaran = shape === 'rose_dog_nastaran';
        return (
          <g>
            {/* قیم چوبی شبکه دار */}
            <path d="M38 55L42 10M62 55L58 10M38 22H62M39 36H61" stroke="#B47B26" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
            {/* شاخه‌های کمانی و خاردار رز رونده */}
            <path d="M46 55 C40 38 36 22 48 11 C58 4 72 12 76 26" stroke="#1B4332" strokeWidth="2.3" fill="none" strokeLinecap="round" />
            <path d="M54 55 C60 40 64 26 52 16" stroke="#2D6A4F" strokeWidth="2" fill="none" strokeLinecap="round" />
            {renderCompoundRoseLeaf(34, 38, -40, 0.9)}
            {renderCompoundRoseLeaf(66, 36, 40, 0.9)}
            {renderCompoundRoseLeaf(36, 22, -25, 0.85)}
            {renderCompoundRoseLeaf(64, 20, 30, 0.85)}
            {isNastaran ? (
              // گل‌های ۵ پر سفید-صورتی نسترن با پرچم طلایی در مرکز
              <g>
                {[
                  [48, 11], [62, 14], [73, 24], [42, 27], [55, 28]
                ].map(([fx, fy], i) => (
                  <g key={i} transform={`translate(${fx}, ${fy})`}>
                    {[0, 72, 144, 216, 288].map((deg) => (
                      <ellipse key={deg} cx="0" cy="-3.2" rx="2.2" ry="3.2" transform={`rotate(${deg})`} fill="#FFE4E6" stroke="#F43F5E" strokeWidth="0.6" />
                    ))}
                    <circle cx="0" cy="0" r="1.8" fill="#FACC15" />
                  </g>
                ))}
              </g>
            ) : (
              <g>
                {renderLayeredRoseBloom(48, 11, 0.9, '#BE123C', '#E11D48', '#FDA4AF', '#881337')}
                {renderLayeredRoseBloom(63, 14, 0.85, '#BE123C', '#E11D48', '#FDA4AF', '#881337')}
                {renderLayeredRoseBloom(74, 25, 0.8, '#E11D48', '#F43F5E', '#FECDD3', '#881337')}
                {renderLayeredRoseBloom(41, 27, 0.85, '#BE123C', '#E11D48', '#FDA4AF', '#881337')}
                {renderLayeredRoseBloom(55, 29, 0.8, '#E11D48', '#F43F5E', '#FECDD3', '#881337')}
              </g>
            )}
          </g>
        );
      }

      

      // ب) رز هلندی، گل محمدی و رز مینیاتوری
      const isDamask = shape === 'rose_damask';
      const isMini = shape === 'rose_miniature';
      const cOuter = isDamask ? '#DB2777' : '#9F1239';
      const cMid = isDamask ? '#F472B6' : '#E11D48';
      const cInner = isDamask ? '#FBCFE8' : '#FDA4AF';
      const cStroke = isDamask ? '#831843' : '#4C0519';

      return (
        <g>
          {/* ساقه‌های خشبی و خاردار رز */}
          <path d="M50 55V16M48 46L32 27M52 46L68 27M49 36L39 18M51 36L61 18" stroke="#1B4332" strokeWidth="2.2" strokeLinecap="round" />
          {/* خارهای ظریف روی ساقه */}
          <path d="M50 42L47 40M50 32L53 30M40 36L37 35M60 36L63 35" stroke="#881337" strokeWidth="1.2" strokeLinecap="round" />
          {/* برگ‌های مرکب دندانه‌دار رز */}
          {renderCompoundRoseLeaf(28, 39, -50, 0.95)}
          {renderCompoundRoseLeaf(72, 39, 50, 0.95)}
          {renderCompoundRoseLeaf(38, 33, -25, 0.9)}
          {renderCompoundRoseLeaf(62, 33, 25, 0.9)}
          {renderCompoundRoseLeaf(46, 26, -12, 0.85)}
          {renderCompoundRoseLeaf(54, 26, 12, 0.85)}
          {/* گل‌های رز چندلایه و مارپیچی */}
          {renderLayeredRoseBloom(31, 25, isMini ? 0.82 : 0.98, cOuter, cMid, cInner, cStroke)}
          {renderLayeredRoseBloom(69, 25, isMini ? 0.82 : 0.98, cOuter, cMid, cInner, cStroke)}
          {renderLayeredRoseBloom(39, 16, isMini ? 0.78 : 0.9, cOuter, cMid, cInner, cStroke)}
          {renderLayeredRoseBloom(61, 16, isMini ? 0.78 : 0.9, cOuter, cMid, cInner, cStroke)}
          {renderLayeredRoseBloom(50, 12, isMini ? 0.92 : 1.15, cOuter, cMid, cInner, cStroke)}
        </g>
      );
    }

    // ۴. خانواده شمعدانی‌ها (معمولی، اژدر/پیچ و عطری با برگ‌های گرد نعل‌اسبی و گل‌آذین چتری توپی)
    if (shape === 'geranium_zonal' || shape === 'geranium_ivy' || shape === 'geranium_scented') {
      const isIvy = shape === 'geranium_ivy';
      const isScented = shape === 'geranium_scented';
      const mainFl = isIvy ? '#DB2777' : isScented ? '#C084FC' : '#EF4444';
      const lightFl = isIvy ? '#F472B6' : isScented ? '#E9D5FF' : '#FCA5A5';

      return (
        <g>
          {/* ساقه‌های بلند گل‌آذین شمعدانی که بالاتر از توده برگ‌ها می‌ایستند */}
          <path d="M46 42L35 19M54 42L65 20M50 40V13" stroke="#4D7C0F" strokeWidth="1.9" strokeLinecap="round" />
          {/* توده برگ‌های گرد کنگره‌دار با حلقه نعل‌اسبی تیره در پایین */}
          {renderGeraniumZonalLeaf(30, 44, 0.95, -28)}
          {renderGeraniumZonalLeaf(70, 44, 0.95, 28)}
          {renderGeraniumZonalLeaf(39, 38, 1.0, -12)}
          {renderGeraniumZonalLeaf(61, 38, 1.0, 12)}
          {renderGeraniumZonalLeaf(50, 43, 1.05, 0)}
          {/* ۳ چتر گل توپی پرپشت شمعدانی */}
          {renderGeraniumUmbelCluster(34, 17, mainFl, lightFl)}
          {renderGeraniumUmbelCluster(66, 18, mainFl, lightFl)}
          {renderGeraniumUmbelCluster(50, 11, mainFl, lightFl)}
        </g>
      );
    }

    // ۵. ارکیده فالانوپسیس (برگ‌های چرمی پایه + ریشه هوایی + شاخه کمانی و گل‌های پروانه‌ای)
    if (shape === 'orchid_phalaenopsis') {
      return (
        <g>
          {/* ریشه‌های هوایی نقره‌ای ارکیده روی لبه گلدان */}
          <path d="M42 54Q32 56 27 61M58 54Q68 57 72 62" stroke="#A7F3D0" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* برگ‌های گوشتی و پهن قاعده‌ای ارکیده */}
          <ellipse cx="36" cy="48" rx="13" ry="5" transform="rotate(-18 36 48)" fill="#1B4332" stroke="#0F291E" strokeWidth="1.1" />
          <ellipse cx="64" cy="48" rx="13" ry="5" transform="rotate(18 64 48)" fill="#1B4332" stroke="#0F291E" strokeWidth="1.1" />
          <ellipse cx="38" cy="42" rx="11" ry="4.5" transform="rotate(-8 38 42)" fill="#2D6A4F" stroke="#143325" strokeWidth="1" />
          <ellipse cx="62" cy="42" rx="11" ry="4.5" transform="rotate(8 62 42)" fill="#2D6A4F" stroke="#143325" strokeWidth="1" />
          {/* قیم و ساقه کمانی ارکیده */}
          <line x1="46" y1="53" x2="46" y2="16" stroke="#785A40" strokeWidth="1.5" />
          <path d="M50 48 C48 32 46 14 58 10 C67 7 75 13 77 22" stroke="#15803D" strokeWidth="2.1" fill="none" strokeLinecap="round" />
          {/* ۳ گل پروانه‌ای فالانوپسیس */}
          {[
            { x: 54, y: 12, s: 1.0 },
            { x: 67, y: 14, s: 0.92 },
            { x: 75, y: 23, s: 0.82 }
          ].map((fl, idx) => (
            <g key={idx} transform={`translate(${fl.x}, ${fl.y}) scale(${fl.s})`}>
              <ellipse cx="0" cy="-5" rx="3.2" ry="4.8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
              <ellipse cx="-5.5" cy="-1" rx="5.5" ry="4.2" transform="rotate(-15 -5.5 -1)" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
              <ellipse cx="5.5" cy="-1" rx="5.5" ry="4.2" transform="rotate(15 5.5 -1)" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
              <ellipse cx="-3" cy="4" rx="2.8" ry="4" transform="rotate(20 -3 4)" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.7" />
              <ellipse cx="3" cy="4" rx="2.8" ry="4" transform="rotate(-20 3 4)" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="0.7" />
              {/* لابلوم (لب) سرخابی و طلایی مرکز ارکیده */}
              <path d="M -2.5 0 L 2.5 0 L 3.5 4.5 L 0 6.5 L -3.5 4.5 Z" fill="#DB2777" />
              <circle cx="0" cy="1.2" r="1.4" fill="#FACC15" />
            </g>
          ))}
        </g>
      );
    }

    // ۶. بنفشه آفریقایی و گلوکسینیا (رزت برگ‌های مخملی گرد + دسته گل‌های بنفش با مرکز طلایی)
    if (shape === 'african_violet' || shape === 'gloxinia_velvet' || shape === 'campanula_bell') {
      return (
        <g>
          {/* رزت برگ‌های گرد و مخملی روی دهانه گلدان */}
          {[
            { cx: 29, cy: 46, r: -30 },
            { cx: 71, cy: 46, r: 30 },
            { cx: 34, cy: 38, r: -18 },
            { cx: 66, cy: 38, r: 18 },
            { cx: 42, cy: 48, r: -8 },
            { cx: 58, cy: 48, r: 8 }
          ].map((lf, i) => (
            <ellipse
              key={i}
              cx={lf.cx}
              cy={lf.cy}
              rx="9.5"
              ry="6.8"
              transform={`rotate(${lf.r} ${lf.cx} ${lf.cy})`}
              fill={i % 2 === 0 ? '#1B4332' : '#2D6A4F'}
              stroke="#0F291E"
              strokeWidth="1.1"
            />
          ))}
          {/* دسته‌های گل بنفش مخملی در مرکز رزت */}
          {[
            [43, 30], [57, 30], [50, 23], [46, 36], [54, 36]
          ].map(([fx, fy], idx) => (
            <g key={idx} transform={`translate(${fx}, ${fy})`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg} cx="0" cy="-3.5" rx="2.6" ry="3.6" transform={`rotate(${deg})`} fill="#7E22CE" stroke="#581C87" strokeWidth="0.7" />
              ))}
              <circle cx="-0.7" cy="-0.4" r="1.1" fill="#FACC15" />
              <circle cx="0.9" cy="0.4" r="1.1" fill="#FACC15" />
            </g>
          ))}
        </g>
      );
    }

    // ۷. سیکلامن (نگونسار - برگ‌های قلبی نقره‌کوب + گل‌های پروانه‌ای سر به پایین)
    if (shape === 'cyclamen_persicum') {
      return (
        <g>
          {/* ساقه‌های قوها (Swan-neck stems) */}
          <path d="M44 45 C42 28 38 14 35 18 M50 45 C50 25 48 10 46 15 M56 45 C58 28 63 14 66 18" stroke="#9D174D" strokeWidth="1.7" fill="none" strokeLinecap="round" />
          {/* برگ‌های قلبی با طرح نقره‌ای در پایه */}
          {renderHeartLeaf(32, 43, 0.95, -35, '#1B4332', '#0F291E', '#CBD5E1', 'birkin_lines')}
          {renderHeartLeaf(68, 43, 0.95, 35, '#1B4332', '#0F291E', '#CBD5E1', 'birkin_lines')}
          {renderHeartLeaf(43, 45, 0.9, -12, '#2D6A4F', '#0F291E', '#CBD5E1', 'birkin_lines')}
          {renderHeartLeaf(57, 45, 0.9, 12, '#2D6A4F', '#0F291E', '#CBD5E1', 'birkin_lines')}
          {/* گلبرگ‌های پروانه‌ای برگشته به بالا */}
          {[
            [35, 18], [48, 14], [65, 18]
          ].map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx}, ${fy})`}>
              <path d="M 0 2 C -5 -3, -7 -11, -2 -12 C 0 -9, 0 -3, 0 2 Z" fill="#F43F5E" stroke="#9F1239" strokeWidth="0.7" />
              <path d="M 0 2 C 5 -3, 7 -11, 2 -12 C 0 -9, 0 -3, 0 2 Z" fill="#FB7185" stroke="#9F1239" strokeWidth="0.7" />
              <path d="M 0 2 C -2 -4, -2 -13, 0 -14 C 2 -13, 2 -4, 0 2 Z" fill="#E11D48" stroke="#881337" strokeWidth="0.7" />
              <ellipse cx="0" cy="2.2" rx="2.2" ry="1.2" fill="#881337" />
            </g>
          ))}
        </g>
      );
    }

    // ۸. حسن یوسف (برگ‌های دندانه‌دار با مرکز سرخابی نئونی، میانه شرابی و حاشیه سبز فسفری)
    if (shape === 'coleus_colorful') {
      return (
        <g>
          <path d="M50 55V20M50 42L34 32M50 42L66 32" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" />
          {[
            { cx: 31, cy: 36, rot: -32, s: 0.95 },
            { cx: 69, cy: 36, rot: 32, s: 0.95 },
            { cx: 39, cy: 25, rot: -16, s: 1.0 },
            { cx: 61, cy: 25, rot: 16, s: 1.0 },
            { cx: 45, cy: 38, rot: -8, s: 0.88 },
            { cx: 55, cy: 38, rot: 8, s: 0.88 },
            { cx: 50, cy: 19, rot: 0, s: 1.08 }
          ].map((lf, i) => (
            <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.rot}) scale(${lf.s})`}>
              {/* حاشیه دندانه‌دار سبز فسفری */}
              <path
                d="M 0 -13 L 4 -10 L 8 -5 L 9 2 L 6 8 L 0 13 L -6 8 L -9 2 L -8 -5 L -4 -10 Z"
                fill="#A3E635"
                stroke="#3F6212"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
              {/* لایه میانی شرابی تیره */}
              <path
                d="M 0 -10 L 5.5 -4 L 6 2 L 4 6.5 L 0 10 L -4 6.5 L -6 2 L -5.5 -4 Z"
                fill="#4C0519"
              />
              {/* قلب سرخابی نئونی حسن یوسف */}
              <path
                d="M 0 -7 L 3 -2 L 3 3 L 0 7 L -3 3 L -3 -2 Z"
                fill="#F43F5E"
              />
              <line x1="0" y1="-8" x2="0" y2="9" stroke="#FDA4AF" strokeWidth="0.8" />
            </g>
          ))}
        </g>
      );
    }

    // ۹. بگونیا بال‌فرشته (خال‌دار)، بگونیا رکس و بگونیا عروس
    if (shape === 'begonia_maculata' || shape === 'begonia_rex' || shape === 'begonia_wax') {
      if (shape === 'begonia_maculata') {
        return (
          <g>
            <path d="M47 55L36 22M53 55L64 20M50 55V16" stroke="#9F1239" strokeWidth="2.3" strokeLinecap="round" />
            {[
              { cx: 33, cy: 35, r: -28 },
              { cx: 67, cy: 35, r: 28 },
              { cx: 40, cy: 21, r: -14 },
              { cx: 60, cy: 21, r: 14 },
              { cx: 50, cy: 28, r: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
                {/* برگ نامتقارن بال‌فرشته با پشت قرمز و روی سبز تیره */}
                <path
                  d="M 0 -13 C 8 -10, 10 2, 4 12 C 0 15, -6 10, -7 2 C -8 -6, -4 -12, 0 -13 Z"
                  fill="#14532D"
                  stroke="#881337"
                  strokeWidth="1.2"
                />
                {/* خال‌های نقره‌ای معروف بگونیا ماکولاتا */}
                <circle cx="-2" cy="-6" r="1.3" fill="#E2E8F0" />
                <circle cx="3" cy="-4" r="1.4" fill="#E2E8F0" />
                <circle cx="-3" cy="1" r="1.5" fill="#E2E8F0" />
                <circle cx="3" cy="2" r="1.3" fill="#E2E8F0" />
                <circle cx="0" cy="7" r="1.2" fill="#E2E8F0" />
              </g>
            ))}
          </g>
        );
      }

      // بگونیا رکس (طرح حلزونی نقره‌ای و یاقوتی)
      return (
        <g>
          {[
            { cx: 33, cy: 39, r: -25 },
            { cx: 67, cy: 39, r: 25 },
            { cx: 41, cy: 27, r: -10 },
            { cx: 59, cy: 27, r: 10 },
            { cx: 50, cy: 34, r: 0 }
          ].map((lf, i) => (
            <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
              <ellipse cx="0" cy="0" rx="9.5" ry="11.5" fill="#881337" stroke="#1B4332" strokeWidth="1.2" />
              <ellipse cx="0" cy="0" rx="6.5" ry="8" fill="#E2E8F0" opacity="0.88" />
              <ellipse cx="0" cy="1" rx="3" ry="4" fill="#4C0519" />
            </g>
          ))}
        </g>
      );
    }

    // ۱۰. گیاهان معطر و دارویی (اسطوخودوس/لاواندولا، رزماری، نعناع، ریحان، آویشن و بهارنارنج)
    if (
      shape === 'lavender_herb' ||
      shape === 'rosemary_herb' ||
      shape === 'herb_peppermint' ||
      shape === 'herb_basil' ||
      shape === 'herb_thyme' ||
      shape === 'herb_lemon_verbena'
    ) {
      if (shape === 'lavender_herb') {
        return (
          <g>
            {/* برگ‌های نقره‌ای-سبز باریک در پایه بوته اسطوخودوس */}
            {[
              'M50 55L30 42', 'M50 55L35 38', 'M50 55L70 42', 'M50 55L65 38', 'M45 55L38 45', 'M55 55L62 45'
            ].map((d, i) => (
              <path key={i} d={d} stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" />
            ))}
            {/* ساقه‌های بلند خوشه‌های بنفش اسطوخودوس */}
            {[
              { x1: 44, x2: 28, y2: 18 },
              { x1: 47, x2: 38, y2: 12 },
              { x1: 50, x2: 50, y2: 9 },
              { x1: 53, x2: 62, y2: 12 },
              { x1: 56, x2: 72, y2: 18 }
            ].map((st, i) => (
              <g key={i}>
                <line x1={st.x1} y1="53" x2={st.x2} y2={st.y2} stroke="#475569" strokeWidth="1.4" />
                {/* طبقات خوشه‌ای بنفش لاواندولا */}
                {[0, 4, 8, 12].map((dy) => (
                  <ellipse
                    key={dy}
                    cx={st.x2 + (st.x1 - st.x2) * (dy / 36)}
                    cy={st.y2 + dy}
                    rx="2.6"
                    ry="1.8"
                    fill={dy % 8 === 0 ? '#7E22CE' : '#A855F7'}
                  />
                ))}
              </g>
            ))}
          </g>
        );
      }

      if (shape === 'rosemary_herb' || shape === 'herb_thyme') {
        return (
          <g>
            {[
              { x1: 45, x2: 30, y2: 18 },
              { x1: 48, x2: 41, y2: 11 },
              { x1: 50, x2: 50, y2: 8 },
              { x1: 52, x2: 59, y2: 11 },
              { x1: 55, x2: 70, y2: 18 }
            ].map((br, i) => (
              <g key={i}>
                <line x1={br.x1} y1="54" x2={br.x2} y2={br.y2} stroke="#5C4033" strokeWidth="2" strokeLinecap="round" />
                {[0.2, 0.35, 0.5, 0.65, 0.8, 0.95].map((t, j) => {
                  const bx = br.x1 + (br.x2 - br.x1) * t;
                  const by = 54 + (br.y2 - 54) * t;
                  return (
                    <path
                      key={j}
                      d={`M ${bx} ${by} L ${bx - 4.5} ${by - 3.5} M ${bx} ${by} L ${bx + 4.5} ${by - 3.5}`}
                      stroke={j % 2 === 0 ? '#2D6A4F' : '#52B788'}
                      strokeWidth="1.9"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            ))}
          </g>
        );
      }

      // ریحان (سبز و بنفش) و نعناع فلفلی
      const isBasil = shape === 'herb_basil';
      return (
        <g>
          <path d="M45 55V20M55 55V22M50 55V14" stroke="#3F6212" strokeWidth="2.1" strokeLinecap="round" />
          {[
            { cx: 34, cy: 38, r: -28, col: '#2D6A4F' },
            { cx: 66, cy: 38, r: 28, col: isBasil ? '#581C87' : '#2D6A4F' },
            { cx: 39, cy: 26, r: -16, col: '#40916C' },
            { cx: 61, cy: 26, r: 16, col: isBasil ? '#7E22CE' : '#40916C' },
            { cx: 50, cy: 17, r: 0, col: '#52B788' },
            { cx: 48, cy: 32, r: -5, col: '#40916C' }
          ].map((lf, i) => (
            <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
              <ellipse cx="0" cy="0" rx="7.5" ry="10.5" fill={lf.col} stroke="#143325" strokeWidth="1" />
              <path d="M0 -8V8M0 -3L-4 -6M0 -3L4 -6M0 2L-4 -1M0 2L4 -1" stroke="#A7F3D0" strokeWidth="0.8" opacity="0.7" />
            </g>
          ))}
        </g>
      );
    }

    // ۱۱. مرکبات گلدانی (کامکوات، لیموترش، بهارنارنج)، فلفل زینتی و توت‌فرنگی
    if (
      shape === 'citrus_calamondin' ||
      shape === 'citrus_kumquat' ||
      shape === 'citrus_lemon' ||
      shape === 'ornamental_pepper' ||
      shape === 'potted_strawberry'
    ) {
      const isLemon = shape === 'citrus_lemon';
      const isPepper = shape === 'ornamental_pepper';
      const isStraw = shape === 'potted_strawberry';
      const fruitCol = isLemon ? '#FACC15' : isPepper || isStraw ? '#E11D48' : '#F97316';

      return (
        <g>
          <path d="M50 55V24M50 40L34 28M50 38L66 28" stroke="#5C4033" strokeWidth="2.8" strokeLinecap="round" />
          {[
            [32, 34, -25], [68, 34, 25], [38, 22, -15], [62, 22, 15], [50, 18, 0], [44, 30, -8], [56, 30, 8]
          ].map(([lx, ly, rot], i) => (
            <ellipse
              key={i}
              cx={lx}
              cy={ly}
              rx="8.5"
              ry="5.2"
              transform={`rotate(${rot} ${lx} ${ly})`}
              fill={i % 2 === 0 ? '#1B4332' : '#2D6A4F'}
              stroke="#0F291E"
              strokeWidth="1"
            />
          ))}
          {/* میوه‌های کامکوات / لیموترش / فلفل زینتی / توت‌فرنگی + شکوفه‌های سفید بهارنارنج */}
          {[
            [35, 29], [65, 29], [46, 21], [56, 23], [50, 35]
          ].map(([fx, fy], idx) => (
            <g key={idx}>
              {isPepper ? (
                <path d={`M ${fx} ${fy - 5} C ${fx + 3} ${fy - 2}, ${fx + 2} ${fy + 4}, ${fx} ${fy + 5} C ${fx - 2} ${fy + 4}, ${fx - 3} ${fy - 2}, ${fx} ${fy - 5} Z`} fill={idx % 2 === 0 ? '#E11D48' : '#F59E0B'} stroke="#881337" strokeWidth="0.7" />
              ) : (
                <ellipse cx={fx} cy={fy} rx="3.8" ry={isLemon ? '4.6' : '3.6'} fill={fruitCol} stroke="#9A3412" strokeWidth="0.8" />
              )}
              <circle cx={fx - 1.2} cy={fy - 1.2} r="0.9" fill="#FEF08A" opacity="0.8" />
            </g>
          ))}
          {/* دو شکوفه سفید معطر */}
          <circle cx="41" cy="16" r="2.2" fill="#FFFFFF" />
          <circle cx="41" cy="16" r="0.9" fill="#FACC15" />
          <circle cx="59" cy="16" r="2.2" fill="#FFFFFF" />
          <circle cx="59" cy="16" r="0.9" fill="#FACC15" />
        </g>
      );
    }

    // ۱۲. ختمی چینی، گل کاغذی، آزالیا، فوشیا، یاس، گاردنیا و کالانکوئه گلدار
    if (
      shape === 'hibiscus_chinese' ||
      shape === 'bougainvillea_paper' ||
      shape === 'azalea_bloom' ||
      shape === 'kalanchoe' ||
      shape === 'kalanchoe_bloom' ||
      shape === 'fuchsia_hanging' ||
      shape === 'jasmine_star' ||
      shape === 'jasmine_sambac' ||
      shape === 'honeysuckle_jasmine' ||
      shape === 'cestrum_night' ||
      shape === 'gardenia_bloom' ||
      shape === 'lantana_camara' ||
      shape === 'chrysanthemum_mum' ||
      shape === 'dahlia_bloom' ||
      shape === 'petunia_hanging' ||
      shape === 'passiflora_clock' ||
      shape === 'lonicera_vine' ||
      shape === 'euonymus_boxwood'
    ) {
      if (shape === 'euonymus_boxwood') {
        return (
          <g>
            <path d="M50 55V22M50 42L35 30M50 40L65 30" stroke="#5C4033" strokeWidth="2.4" />
            {[
              [34, 36], [66, 36], [42, 28], [58, 28], [38, 20], [62, 20], [50, 16], [50, 34]
            ].map(([lx, ly], i) => (
              <ellipse key={i} cx={lx} cy={ly} rx="7.5" ry="5" fill="#2D6A4F" stroke="#FACC15" strokeWidth="1.4" />
            ))}
          </g>
        );
      }

      const isWhiteJasmine =
        shape === 'jasmine_star' ||
        shape === 'jasmine_sambac' ||
        shape === 'gardenia_bloom' ||
        shape === 'cestrum_night';
      const isHibiscus = shape === 'hibiscus_chinese';
      const flColor = isWhiteJasmine ? '#FFFFFF' : shape === 'bougainvillea_paper' ? '#DB2777' : '#E11D48';

      return (
        <g>
          <path d="M50 55V20M50 42L33 28M50 40L67 28" stroke="#1B4332" strokeWidth="2.2" strokeLinecap="round" />
          {[
            [32, 38, -25], [68, 38, 25], [38, 27, -15], [62, 27, 15], [50, 32, 0]
          ].map(([lx, ly, r], i) => (
            <ellipse key={i} cx={lx} cy={ly} rx="8" ry="5" transform={`rotate(${r} ${lx} ${ly})`} fill="#2D6A4F" stroke="#143325" strokeWidth="1" />
          ))}
          {[
            [34, 24, 1], [66, 24, 1], [50, 15, 1.15]
          ].map(([fx, fy, sc], idx) => (
            <g key={idx} transform={`translate(${fx}, ${fy}) scale(${sc})`}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse
                  key={deg}
                  cx="0"
                  cy="-4.2"
                  rx="3.2"
                  ry="4.8"
                  transform={`rotate(${deg})`}
                  fill={flColor}
                  stroke={isWhiteJasmine ? '#CBD5E1' : '#881337'}
                  strokeWidth="0.7"
                />
              ))}
              <circle cx="0" cy="0" r="2" fill={isWhiteJasmine ? '#FACC15' : '#881337'} />
              {/* پرچم بلند بیرون‌زده مخصوص گل ختمی چینی */}
              {isHibiscus && (
                <g>
                  <line x1="0" y1="0" x2="5" y2="-6" stroke="#FACC15" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="5.5" cy="-6.5" r="1.3" fill="#FDE047" />
                </g>
              )}
            </g>
          ))}
        </g>
      );
    }

    // ۱۳. دیش‌گاردن‌های ترکیبی
    if (shape === 'combo_trough' || shape === 'dish_garden_succulent' || shape === 'combo_trough_2') {
      return (
        <g>
          <circle cx="33" cy="46" r="7.5" fill="#4D9057" stroke="#285932" strokeWidth="1.1" />
          <circle cx="33" cy="46" r="4.8" fill="#5FA86A" stroke="#367041" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M46 53V44" stroke="#8C6D53" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M46 45C42 41 41 36 42 32C44 32 45 38 46 44Z" fill="#40916C" stroke="#1B4332" strokeWidth="0.9" />
          <path d="M46 44C46 37 45 31 47 28C49 31 49 37 46 44Z" fill="#52B788" stroke="#1B4332" strokeWidth="0.9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse
              key={deg}
              cx="59"
              cy="38"
              rx="3"
              ry="8.5"
              transform={`rotate(${deg} 59 43)`}
              fill="#4A2545"
              stroke="#2D1429"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="59" cy="43" r="3.2" fill="#74C69D" />
        </g>
      );
    }

    // ۱۴. خانواده دراسنا، کوردیلین، یوکا و بامبو
    if (
      shape === 'dracaena' ||
      shape.startsWith('dracaena_') ||
      shape === 'cordyline_red' ||
      shape === 'yucca_cane'
    ) {
      if (shape === 'dracaena' || shape === 'dracaena_compacta') {
        return (
          <g>
            <path d="M47 55V35M53 55V38" stroke="#5A4634" strokeWidth="3.8" strokeLinecap="round" />
            {[
              { d: 'M48 44C34 42 22 35 19 25C32 26 42 33 48 44Z', fill: '#143825' },
              { d: 'M52 44C66 42 78 35 81 25C68 26 58 33 52 44Z', fill: '#1B4332' },
              { d: 'M48 37C36 32 26 23 25 13C37 16 44 26 48 37Z', fill: '#1B5E3A' },
              { d: 'M52 37C64 32 74 23 75 13C63 16 56 26 52 37Z', fill: '#237046' },
              { d: 'M49 32C41 24 36 14 38 6C45 12 48 21 49 32Z', fill: '#2D6A4F' },
              { d: 'M51 32C59 24 64 14 62 6C55 12 52 21 51 32Z', fill: '#379963' },
              { d: 'M50 28C46 18 46 9 50 3C54 9 54 18 50 28Z', fill: '#52B788' }
            ].map((lf, idx) => (
              <path key={idx} d={lf.d} fill={lf.fill} stroke="#0F291E" strokeWidth="1" strokeLinejoin="round" />
            ))}
          </g>
        );
      }

      const isMarginata = shape === 'dracaena_marginata';
      const isCordyline = shape === 'cordyline_red';
      const isLemon = shape === 'dracaena_lemon_lime';
      const isCorn = shape === 'dracaena_massangeana';

      const mainBlade = isCordyline ? '#881337' : '#1B4332';
      const stripeColor = isMarginata || isCordyline
        ? '#E11D48'
        : isLemon || isCorn
        ? '#FACC15'
        : '#74C69D';

      return (
        <g>
          <path d="M47 55 L45 27 M53 55 L56 33" stroke="#785A40" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M45 45H49M45 38H48M52 47H56M53 40H57" stroke="#523A24" strokeWidth="1" />
          {[
            'M45 28 Q28 24 14 36',
            'M45 27 Q26 16 14 20',
            'M45 26 Q34 10 26 7',
            'M45 26 Q45 10 47 4',
            'M45 27 Q58 12 66 9',
            'M56 34 Q72 28 86 40',
            'M56 33 Q74 20 85 24',
            'M56 32 Q66 16 76 13'
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={mainBlade} strokeWidth={isCorn ? '4.8' : '3.2'} strokeLinecap="round" fill="none" />
              <path d={d} stroke={stripeColor} strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </g>
          ))}
        </g>
      );
    }

    if (shape === 'lucky_bamboo') {
      return (
        <g>
          <path d="M45 55V16M51 55V20M57 55C57 42 52 35 58 26C63 18 56 14 56 8" stroke="#2D6A4F" strokeWidth="3.6" strokeLinecap="round" fill="none" />
          <path d="M43 44H47M43 34H47M43 24H47M49 46H53M49 36H53M49 26H53" stroke="#95D5B2" strokeWidth="1.1" />
          <path d="M45 20C36 16 30 18 26 23C33 24 40 23 45 20Z" fill="#52B788" stroke="#1B4332" strokeWidth="0.9" />
          <path d="M51 22C60 18 66 20 70 25C63 26 56 25 51 22Z" fill="#40916C" stroke="#1B4332" strokeWidth="0.9" />
          <path d="M56 12C48 7 41 8 36 13C44 15 50 14 56 12Z" fill="#74C69D" stroke="#1B4332" strokeWidth="0.9" />
        </g>
      );
    }

    // ۱۵. سانسوریاها
    if (shape === 'sansevieria' || shape.startsWith('sansevieria_')) {
      if (shape === 'sansevieria_hahnii') {
        return (
          <g>
            {[
              { d: 'M50 54 C36 52 24 42 22 30 C32 32 42 40 50 54Z', fill: '#2D6A4F' },
              { d: 'M50 54 C64 52 76 42 78 30 C68 32 58 40 50 54Z', fill: '#2D6A4F' },
              { d: 'M50 54 C40 46 32 34 34 22 C42 28 47 38 50 54Z', fill: '#40916C' },
              { d: 'M50 54 C60 46 68 34 66 22 C58 28 53 38 50 54Z', fill: '#40916C' },
              { d: 'M50 54 C46 40 46 28 50 19 C54 28 54 40 50 54Z', fill: '#52B788' }
            ].map((lf, i) => (
              <path key={i} d={lf.d} fill={lf.fill} stroke="#FACC15" strokeWidth="1.1" />
            ))}
          </g>
        );
      }

      if (shape === 'sansevieria_cylindrica') {
        return (
          <g>
            {[
              { x1: 37, y1: 55, x2: 29, y2: 19 },
              { x1: 43, y1: 55, x2: 39, y2: 11 },
              { x1: 50, y1: 55, x2: 50, y2: 6 },
              { x1: 57, y1: 55, x2: 61, y2: 11 },
              { x1: 63, y1: 55, x2: 71, y2: 19 }
            ].map((sp, i) => (
              <g key={i}>
                <path
                  d={`M ${sp.x1 - 2.6} ${sp.y1} L ${sp.x2} ${sp.y2} L ${sp.x1 + 2.6} ${sp.y1} Z`}
                  fill={i % 2 === 0 ? '#2D6A4F' : '#40916C'}
                  stroke="#1B4332"
                  strokeWidth="1"
                />
              </g>
            ))}
          </g>
        );
      }

      const isMoon = shape === 'sansevieria_moonshine';
      const isGreenSans = shape === 'sansevieria_green';
      const isBlackGold = shape === 'sansevieria_black_gold';
      const bladeFill1 = isMoon ? '#94B49F' : isBlackGold ? '#10281E' : '#2D6A4F';
      const bladeFill2 = isMoon ? '#B4CFB0' : isBlackGold ? '#183A2C' : '#40916C';
      const edgeStroke = isMoon || isGreenSans ? '#1B4332' : '#FACC15';

      return (
        <g>
          <path d="M41 55C38 38 36 22 39 7C43 20 45 36 46 55Z" fill={bladeFill1} stroke={edgeStroke} strokeWidth="1.3" />
          <path d="M59 55C62 38 64 20 61 6C57 20 55 36 54 55Z" fill={bladeFill1} stroke={edgeStroke} strokeWidth="1.3" />
          <path d="M47 55C46 35 47 15 50 3C53 15 54 35 53 55Z" fill={bladeFill2} stroke={edgeStroke} strokeWidth="1.4" />
          <path d="M35 55C32 42 31 30 33 18C37 28 39 41 41 55Z" fill={bladeFill1} stroke={edgeStroke} strokeWidth="1.1" />
          <path d="M65 55C68 42 69 29 66 17C62 28 60 41 59 55Z" fill={bladeFill2} stroke={edgeStroke} strokeWidth="1.1" />
        </g>
      );
    }

    // ۱۶. زامیفولیاها
    if (shape === 'zz' || shape.startsWith('zz_')) {
      const isRaven = shape === 'zz_raven';
      const isVar = shape === 'zz_variegated';
      const stemCol = isRaven ? '#1C1917' : '#2B5E3F';

      return (
        <g>
          <path d="M44 55L32 14M50 55V10M56 55L68 14" stroke={stemCol} strokeWidth="2.5" strokeLinecap="round" />
          {[18, 27, 36, 45].map((y, i) => {
            const lfCol1 = isRaven ? (i === 0 ? '#65A30D' : '#1F2937') : '#2E6F4E';
            const lfCol2 = isRaven ? '#111827' : isVar && i % 2 === 0 ? '#FEF08A' : '#40916C';
            const strokeCol = isRaven ? '#090D16' : '#18422C';
            return (
              <g key={i}>
                <ellipse cx={31 - i * 0.8} cy={y} rx="5.8" ry="3.1" transform={`rotate(-25 ${31 - i * 0.8} ${y})`} fill={lfCol1} stroke={strokeCol} strokeWidth="1" />
                <ellipse cx={41 - i * 0.6} cy={y - 1.5} rx="5.8" ry="3.1" transform={`rotate(25 ${41 - i * 0.6} ${y - 1.5})`} fill={lfCol2} stroke={strokeCol} strokeWidth="1" />
                <ellipse cx={59 + i * 0.6} cy={y - 1.5} rx="5.8" ry="3.1" transform={`rotate(-25 ${59 + i * 0.6} ${y - 1.5})`} fill={lfCol2} stroke={strokeCol} strokeWidth="1" />
                <ellipse cx={69 + i * 0.8} cy={y} rx="5.8" ry="3.1" transform={`rotate(25 ${69 + i * 0.8} ${y})`} fill={lfCol1} stroke={strokeCol} strokeWidth="1" />
              </g>
            );
          })}
        </g>
      );
    }

    // ۱۷. برگ‌عبایی و دیفن‌باخیا
    if (shape === 'aspidistra_cast_iron' || shape === 'dieffenbachia' || shape.startsWith('dieffenbachia_')) {
      const isAspidistra = shape === 'aspidistra_cast_iron';
      const isCamilla = shape === 'dieffenbachia_camilla';
      return (
        <g>
          <path d="M47 55L33 32M53 55L67 32M50 55V20" stroke="#40916C" strokeWidth="2.4" strokeLinecap="round" />
          {renderPointedBlade(31, 33, 8.5, 16, -24, '#1B4332', '#0F291E', isAspidistra ? undefined : '#ECFCCB', '#52B788', isAspidistra ? 'none' : 'snow_dots')}
          {renderPointedBlade(69, 33, 8.5, 16, 24, '#1B4332', '#0F291E', isAspidistra ? undefined : '#ECFCCB', '#52B788', isAspidistra ? 'none' : 'snow_dots')}
          {renderPointedBlade(40, 25, 9, 17, -10, '#2D6A4F', '#1B4332', isAspidistra ? undefined : isCamilla ? '#FEF9C3' : '#D9F99D', '#74C69D')}
          {renderPointedBlade(60, 25, 9, 17, 10, '#2D6A4F', '#1B4332', isAspidistra ? undefined : isCamilla ? '#FEF9C3' : '#D9F99D', '#74C69D')}
          {renderPointedBlade(50, 21, 9.5, 18, 0, '#40916C', '#1B4332', isAspidistra ? undefined : '#FEFCE8', '#2D6A4F')}
        </g>
      );
    }

    // ۱۸. فیکوس‌ها و بونسای‌ها
    if (shape === 'ficus' || shape === 'fiddle_leaf' || shape.startsWith('ficus_') || shape.startsWith('bonsai_')) {
      if (shape === 'fiddle_leaf' || shape === 'ficus_lyrata') {
        return (
          <g>
            <path d="M50 55V16" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" />
            {[
              { cx: 34, cy: 36, r: -26, s: 0.92, fill: '#1B4332' },
              { cx: 66, cy: 36, r: 26, s: 0.92, fill: '#1B4332' },
              { cx: 39, cy: 23, r: -14, s: 0.95, fill: '#2D6A4F' },
              { cx: 61, cy: 23, r: 14, s: 0.95, fill: '#2D6A4F' },
              { cx: 50, cy: 17, r: 0, s: 1.08, fill: '#40916C' }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r}) scale(${lf.s})`}>
                <path
                  d="M0 -13 C8.5 -13 10.5 -6 7 -1 C10.5 4 8.5 11 0 13 C-8.5 11 -10.5 4 -7 -1 C-10.5 -6 -8.5 -13 0 -13Z"
                  fill={lf.fill}
                  stroke="#0F291E"
                  strokeWidth="1.15"
                />
                <path d="M0 -10V11M0 -4L-5 -7M0 -4L5 -7M0 3L-5 0M0 3L5 0" stroke="#95D5B2" strokeWidth="1" strokeLinecap="round" />
              </g>
            ))}
          </g>
        );
      }

      if (shape === 'ficus_ginseng' || shape.startsWith('bonsai_')) {
        const isMaple = shape === 'bonsai_maple';
        return (
          <g>
            <path
              d="M39 55 C36 44 41 34 46 31 C48 29 52 29 54 31 C59 34 64 44 61 55 M45 55 C45 47 55 47 55 55"
              fill="#8C6D53"
              stroke="#523A24"
              strokeWidth="1.6"
            />
            <path d="M46 32L35 23M54 32L65 23M50 30V17" stroke="#523A24" strokeWidth="2.4" strokeLinecap="round" />
            {[
              [33, 22], [67, 22], [42, 16], [58, 16], [50, 12], [27, 26], [73, 26], [49, 21]
            ].map(([cx, cy], idx) => (
              <ellipse
                key={idx}
                cx={cx}
                cy={cy}
                rx="8"
                ry="5"
                fill={isMaple ? (idx % 2 === 0 ? '#B91C1C' : '#DC2626') : idx % 2 === 0 ? '#2D6A4F' : '#40916C'}
                stroke={isMaple ? '#7F1D1D' : '#1B4332'}
                strokeWidth="1"
              />
            ))}
          </g>
        );
      }

      const isBurgundy = shape === 'ficus_elastica_burgundy';
      const isBlack = shape === 'ficus_elastica_black';
      const lf1 = isBurgundy ? '#4A1525' : isBlack ? '#14211D' : '#1B4332';
      const lf2 = isBurgundy ? '#6B1D36' : isBlack ? '#1F332D' : '#2D6A4F';
      const vein = isBurgundy ? '#FB7185' : '#74C69D';

      return (
        <g>
          <path d="M50 55V18" stroke="#6E473B" strokeWidth="3.2" strokeLinecap="round" />
          {[
            { cx: 33, cy: 41, rot: -26, fill: lf1 },
            { cx: 67, cy: 40, rot: 26, fill: lf2 },
            { cx: 35, cy: 28, rot: -18, fill: lf2 },
            { cx: 65, cy: 27, rot: 18, fill: lf1 },
            { cx: 43, cy: 19, rot: -8, fill: lf2 },
            { cx: 57, cy: 19, rot: 8, fill: lf1 }
          ].map((lf, idx) => (
            <g key={idx} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
              <ellipse cx={lf.cx} cy={lf.cy} rx="11.5" ry="6.8" fill={lf.fill} stroke="#0F291E" strokeWidth="1.2" />
              <line x1={lf.cx - 8} y1={lf.cy} x2={lf.cx + 8} y2={lf.cy} stroke={vein} strokeWidth="1" opacity="0.8" />
            </g>
          ))}
          <path d="M50 20C52 7 56 6 53 20" fill="#E11D48" stroke="#881337" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    }

    // ۱۹. مانستراها
    if (shape === 'monstera' || shape.startsWith('monstera_')) {
      const isThai = shape === 'monstera_thai';
      const isAdansonii = shape === 'monstera_adansonii';
      return (
        <g>
          <path d="M50 55L34 31M50 55L66 31M50 55V20" stroke="#2D6A4F" strokeWidth="2.5" strokeLinecap="round" />
          {[
            { cx: 33, cy: 31, rot: -26, fill: '#1B4332' },
            { cx: 67, cy: 31, rot: 26, fill: '#2D6A4F' },
            { cx: 50, cy: 21, rot: 0, fill: '#40916C' }
          ].map((lf, i) => (
            <g key={i} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
              <ellipse cx={lf.cx} cy={lf.cy} rx="11.5" ry="14.5" fill={lf.fill} stroke="#143325" strokeWidth="1.2" />
              {isThai && (
                <path
                  d={`M ${lf.cx} ${lf.cy - 14} A 11.5 14.5 0 0 1 ${lf.cx + 11} ${lf.cy + 2} L ${lf.cx} ${lf.cy} Z`}
                  fill="#FEF9C3"
                  opacity="0.9"
                />
              )}
              {isAdansonii ? (
                <g fill="#F6F3EC">
                  <ellipse cx={lf.cx - 4.5} cy={lf.cy - 4} rx="2" ry="3.2" />
                  <ellipse cx={lf.cx + 4.5} cy={lf.cy - 4} rx="2" ry="3.2" />
                  <ellipse cx={lf.cx - 4.5} cy={lf.cy + 4} rx="2" ry="3.2" />
                  <ellipse cx={lf.cx + 4.5} cy={lf.cy + 4} rx="2" ry="3.2" />
                </g>
              ) : (
                <path
                  d={`M${lf.cx - 11} ${lf.cy - 4}H${lf.cx - 4}M${lf.cx + 4} ${lf.cy - 4}H${lf.cx + 11}M${lf.cx - 11} ${lf.cy + 3}H${lf.cx - 4}M${lf.cx + 4} ${lf.cy + 3}H${lf.cx + 11}`}
                  stroke="#F6F3EC"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              )}
            </g>
          ))}
        </g>
      );
    }

    // ۲۰. پتوس‌ها، فیلودندرون‌ها و سینگونیوم‌ها
    if (shape === 'pothos' || shape.startsWith('pothos_') || shape.startsWith('philo_') || shape.startsWith('syngonium_')) {
      const isNeon = shape === 'pothos_neon';
      const isMarble = shape === 'pothos_marble' || shape === 'pothos_manjula' || shape === 'pothos_njoy' || shape === 'syngonium_albo';
      const isSatin = shape === 'pothos_satin';
      const isBrasil = shape === 'philo_brasil';
      const isBirkin = shape === 'philo_birkin';
      const isOrange = shape === 'philo_orange';
      const isPink = shape === 'philo_pink_princess' || shape === 'syngonium_pink';

      const baseLeafCol = isNeon
        ? '#84CC16'
        : isOrange
        ? '#EA580C'
        : isPink
        ? '#F472B6'
        : isSatin
        ? '#1E4638'
        : '#2D6A4F';

      const varCol = isMarble || isBirkin
        ? '#F8FAFC'
        : isSatin
        ? '#CBD5E1'
        : isPink
        ? '#FB7185'
        : '#FACC15';

      const varType = isMarble
        ? ('marble_half' as const)
        : isBrasil
        ? ('brasil_center' as const)
        : isBirkin
        ? ('birkin_lines' as const)
        : isPink
        ? ('pink_splash' as const)
        : ('golden_streaks' as const);

      return (
        <g>
          <path d="M50 55Q38 38 26 42M50 55Q62 38 74 42M50 55Q42 26 35 19M50 55Q58 26 65 19" stroke="#1B4332" strokeWidth="2" fill="none" />
          {renderHeartLeaf(27, 40, 1.0, -32, baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(73, 40, 1.0, 32, baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(36, 22, 1.08, -16, isOrange ? '#F97316' : baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(64, 22, 1.08, 16, baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(43, 35, 0.95, -8, baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(57, 35, 0.95, 8, baseLeafCol, '#143325', varCol, varType)}
          {renderHeartLeaf(50, 18, 1.15, 0, isOrange ? '#FB923C' : baseLeafCol, '#143325', varCol, varType)}
        </g>
      );
    }

    // ۲۱. آلوکازیاها
    if (shape.startsWith('alocasia_')) {
      const isPolly = shape === 'alocasia_polly';
      const isBlackVelvet = shape === 'alocasia_black_velvet';
      const isZebrina = shape === 'alocasia_zebrina';
      const lfFill = isBlackVelvet ? '#18181B' : isPolly ? '#133829' : '#2D6A4F';
      const veinCol = isBlackVelvet || isPolly ? '#E2E8F0' : '#95D5B2';

      return (
        <g>
          <path d="M48 55L32 29M52 55L68 29M50 55V19" stroke={isZebrina ? '#FEF08A' : '#40916C'} strokeWidth="2.8" strokeLinecap="round" />
          {isZebrina && (
            <path d="M45 48H48M40 40H43M35 33H38M52 48H55M57 40H60M62 33H65M49 44H51M49 34H51M49 25H51" stroke="#1C1917" strokeWidth="1.6" />
          )}
          {[
            { cx: 31, cy: 29, rot: -28, s: 0.92 },
            { cx: 69, cy: 29, rot: 28, s: 0.92 },
            { cx: 50, cy: 19, rot: 0, s: 1.08 }
          ].map((lf, i) => (
            <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.rot}) scale(${lf.s})`}>
              <path
                d="M 0 -13 L 9 -5 L 7 4 L 0 14 L -7 4 L -9 -5 Z"
                fill={lfFill}
                stroke={veinCol}
                strokeWidth="1.15"
                strokeLinejoin="round"
              />
              <path d="M0 -11V12M0 -3L-7 -6M0 -3L7 -6M0 3L-6 1M0 3L6 1" stroke={veinCol} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    }

    // ۲۲. کالاتیا، مارانتا و استرمانته
    if (shape === 'calathea' || shape.startsWith('calathea_') || shape.startsWith('maranta_') || shape.startsWith('stromanthe_')) {
      const isOrnata = shape === 'calathea_ornata' || shape === 'maranta_erythroneura';
      const isTriostar = shape === 'stromanthe_triostar';
      return (
        <g>
          <path d="M47 55L33 34M53 55L67 34M50 55V22" stroke="#7F1D1D" strokeWidth="2.2" strokeLinecap="round" />
          {renderPointedBlade(31, 35, 8, 14, -28, '#143825', '#0A2115', isTriostar ? '#FBCFE8' : undefined, isOrnata ? '#F43F5E' : '#A7F3D0', isOrnata ? 'pinstripe' : 'feather')}
          {renderPointedBlade(69, 35, 8, 14, 28, '#143825', '#0A2115', isTriostar ? '#FBCFE8' : undefined, isOrnata ? '#F43F5E' : '#A7F3D0', isOrnata ? 'pinstripe' : 'feather')}
          {renderPointedBlade(40, 25, 8.5, 15, -12, '#1B4332', '#0F291E', isTriostar ? '#FCE7F3' : undefined, isOrnata ? '#F43F5E' : '#A7F3D0', isOrnata ? 'pinstripe' : 'feather')}
          {renderPointedBlade(60, 25, 8.5, 15, 12, '#1B4332', '#0F291E', isTriostar ? '#FCE7F3' : undefined, isOrnata ? '#F43F5E' : '#A7F3D0', isOrnata ? 'pinstripe' : 'feather')}
          {renderPointedBlade(50, 21, 9, 16, 0, '#143825', '#0A2115', isTriostar ? '#F9A8D4' : undefined, isOrnata ? '#F43F5E' : '#A7F3D0', isOrnata ? 'pinstripe' : 'feather')}
        </g>
      );
    }

    // ========================================================================
    // ۲۳. نخل‌ها، سیکاس، لیندا و سرخس‌ها (فاز ۳ و ۴ - تفکیک کامل آناتومیک)
    // ========================================================================
    if (
      shape === 'chamaedorea' ||
      shape === 'pachypodium' ||
      shape.startsWith('palm_') ||
      shape === 'cycas_revoluta' ||
      shape === 'ponytail_linda' ||
      shape.startsWith('fern_')
    ) {
      // ۱. سرخس شاخ‌گوزنی (Platycerium - سپر قاعده‌ای قهوه‌ای/سبز + برگ‌های شاخ‌گوزنی دوشاخه)
      if (shape === 'fern_staghorn') {
        return (
          <g>
            {/* برگ‌های شاخ‌گوزنی منشعب و دوشاخه */}
            <path
              d="M46 46 C38 34, 24 28, 16 18 C20 14, 26 20, 30 24 C28 16, 32 8, 36 10 C38 18, 42 30, 48 44 Z"
              fill="#52B788"
              stroke="#1B4332"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M54 46 C62 34, 76 28, 84 18 C80 14, 74 20, 70 24 C72 16, 68 8, 64 10 C62 18, 58 30, 52 44 Z"
              fill="#52B788"
              stroke="#1B4332"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            <path
              d="M50 44 C47 30, 43 16, 45 7 C48 9, 49 16, 50 22 C51 16, 52 9, 55 7 C57 16, 53 30, 50 44 Z"
              fill="#74C69D"
              stroke="#1B4332"
              strokeWidth="1"
            />
            {/* برگ سپری قاعده‌ای (Shield Frond) روی دهانه گلدان */}
            <ellipse cx="50" cy="49" rx="14" ry="6.5" fill="#A89886" stroke="#6E5A4F" strokeWidth="1.1" />
            <ellipse cx="50" cy="47.5" rx="9.5" ry="4.2" fill="#84A98C" />
          </g>
        );
      }

      // ۲. سرخس پرسیاوشان (Maidenhair - ساقه‌های سیمی مشکی براق + برگچه‌های بادبزنی ژینکو شکل)
      if (shape === 'fern_maidenhair') {
        return (
          <g>
            <path
              d="M48 55 Q36 36 22 26 M52 55 Q64 36 78 26 M49 55 Q42 28 35 12 M51 55 Q58 28 65 12 M50 55 V 10"
              stroke="#1C1917"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />
            {[
              [23, 26], [30, 32], [38, 38], [77, 26], [70, 32], [62, 38],
              [35, 13], [40, 22], [44, 30], [65, 13], [60, 22], [56, 30],
              [50, 10], [47, 18], [53, 18], [50, 26], [32, 20], [68, 20]
            ].map(([px, py], i) => (
              <path
                key={i}
                d={`M ${px} ${py + 3} L ${px - 4} ${py - 2} Q ${px} ${py - 4.5} ${px + 4} ${py - 2} Z`}
                fill={i % 2 === 0 ? '#4ADE80' : '#84CC16'}
                stroke="#15803D"
                strokeWidth="0.6"
              />
            ))}
          </g>
        );
      }

      // ۳. نخل مرداب / پنجه‌کلاغی (Cyperus - ساقه‌های بلند با چتر شعاعی برگ‌ها در بالا)
      if (shape === 'palm_cyperus') {
        return (
          <g>
            <path d="M46 55L32 22M54 55L68 22M50 55V13" stroke="#2D6A4F" strokeWidth="2.1" strokeLinecap="round" />
            {[
              { cx: 32, cy: 22, s: 0.78 },
              { cx: 68, cy: 22, s: 0.78 },
              { cx: 50, cy: 13, s: 0.95 }
            ].map((umb, idx) => (
              <g key={idx} transform={`translate(${umb.cx}, ${umb.cy}) scale(${umb.s})`}>
                {[-75, -50, -25, 0, 25, 50, 75, 105, 135, -105, -135].map((deg) => (
                  <path
                    key={deg}
                    d="M 0 0 Q 2 -8 0 -15"
                    transform={`rotate(${deg})`}
                    stroke="#40916C"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
                <circle cx="0" cy="0" r="2" fill="#84CC16" />
              </g>
            ))}
          </g>
        );
      }

      // ۴. نخل بادبزنی لیویستونا (پهنک گرد پلیسه‌دار و بادبزنی)
      if (shape === 'palm_fan') {
        return (
          <g>
            <path d="M47 55L32 34M53 55L68 34M50 55V21" stroke="#5C4033" strokeWidth="2.2" strokeLinecap="round" />
            {[
              { cx: 31, cy: 32, s: 0.82, r: -25 },
              { cx: 69, cy: 32, s: 0.82, r: 25 },
              { cx: 50, cy: 19, s: 1.0, r: 0 }
            ].map((fn, idx) => (
              <g key={idx} transform={`translate(${fn.cx}, ${fn.cy}) rotate(${fn.r}) scale(${fn.s})`}>
                <path
                  d="M 0 6 L -13 -2 A 14 14 0 1 1 13 -2 Z"
                  fill="#2D6A4F"
                  stroke="#143325"
                  strokeWidth="1"
                />
                {/* خطوط پلیسه‌دار بادبزن */}
                {[-55, -35, -18, 0, 18, 35, 55].map((deg) => (
                  <line
                    key={deg}
                    x1="0"
                    y1="5"
                    x2="0"
                    y2="-13"
                    transform={`rotate(${deg} 0 5)`}
                    stroke="#74C69D"
                    strokeWidth="0.9"
                  />
                ))}
              </g>
            ))}
          </g>
        );
      }

      // ۵. نخل راپیس (نخل بانو - تنه‌های الیافی قهوه‌ای + برگ‌های پنجه‌ای سرصاف)
      if (shape === 'palm_rhapis') {
        return (
          <g>
            <path d="M44 55V24M50 55V18M56 55V26" stroke="#5C3A1B" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="3 1" />
            {[
              { cx: 34, cy: 30, r: -25 },
              { cx: 66, cy: 30, r: 25 },
              { cx: 42, cy: 20, r: -10 },
              { cx: 58, cy: 20, r: 10 },
              { cx: 50, cy: 14, r: 0 }
            ].map((pl, idx) => (
              <g key={idx} transform={`translate(${pl.cx}, ${pl.cy}) rotate(${pl.r})`}>
                {[-44, -22, 0, 22, 44].map((deg) => (
                  <path
                    key={deg}
                    d="M 0 0 L -1.8 -11 L 1.8 -11 Z"
                    transform={`rotate(${deg})`}
                    fill="#1B4332"
                    stroke="#0F291E"
                    strokeWidth="0.6"
                  />
                ))}
              </g>
            ))}
          </g>
        );
      }

      // ۶. سیکاس و لیندا پافیلی
      if (shape === 'ponytail_linda' || shape === 'cycas_revoluta') {
        const isCycas = shape === 'cycas_revoluta';
        return (
          <g>
            <path
              d={isCycas ? 'M41 55L43 38H57L59 55Z' : 'M40 55C38 41 43 33 50 33C57 33 62 41 60 55Z'}
              fill="#785A40"
              stroke="#4A3525"
              strokeWidth="1.5"
            />
            {isCycas && (
              <path d="M43 42H57M42 47H58M42 51H58" stroke="#4A3525" strokeWidth="1.1" />
            )}
            {[
              'M48 35 Q28 18 14 38',
              'M49 35 Q30 10 18 22',
              'M50 34 Q40 6 32 10',
              'M50 34 Q60 6 68 10',
              'M51 35 Q70 10 82 22',
              'M52 35 Q72 18 86 38'
            ].map((d, i) => (
              <path
                key={i}
                d={d}
                stroke="#2D6A4F"
                strokeWidth={isCycas ? '3.4' : '2.2'}
                strokeDasharray={isCycas ? '2 1' : undefined}
                strokeLinecap="round"
                fill="none"
              />
            ))}
          </g>
        );
      }

      if (shape === 'pachypodium' || shape === 'palm_madagascar') {
        return (
          <g>
            <rect x="44" y="26" width="12" height="29" rx="5" fill="#9FA89B" stroke="#5A6257" strokeWidth="1.4" />
            <path d="M41 32L45 34M59 32L55 34M41 40L45 42M59 40L55 42M41 48L45 50M59 48L55 50" stroke="#4A5247" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M50 27C38 22 26 17 20 13C32 13 43 18 50 27Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1" />
            <path d="M50 27C62 22 74 17 80 13C68 13 57 18 50 27Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1" />
            <path d="M50 26C44 15 38 9 33 5C42 8 47 16 50 26Z" fill="#40916C" stroke="#1B4332" strokeWidth="1" />
            <path d="M50 26C56 15 62 9 67 5C58 8 53 16 50 26Z" fill="#40916C" stroke="#1B4332" strokeWidth="1" />
          </g>
        );
      }

      // ۷. نخل شامادورا، اریکا، کنتیا و سرخس بوستون/فر
      const isAreca = shape === 'palm_areca';
      const isCham = shape === 'palm_chamaedorea' || shape === 'chamaedorea';
      return (
        <g>
          <path
            d="M49 55Q34 34 15 22M51 55Q66 34 85 22M49 55Q43 26 32 8M51 55Q57 26 68 8M50 55V10"
            stroke={isAreca ? '#CA8A04' : '#2D6A4F'}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {[
            [21, 25, -42], [29, 31, -36], [37, 37, -30], [43, 43, -25],
            [79, 25, 42], [71, 31, 36], [63, 37, 30], [57, 43, 25],
            [35, 13, -20], [40, 21, -18], [44, 30, -15],
            [65, 13, 20], [60, 21, 18], [56, 30, 15],
            [50, 14, 0], [47, 22, -10], [53, 22, 10]
          ].map(([x, y, rot], idx) => (
            <ellipse
              key={idx}
              cx={x}
              cy={y}
              rx="2.3"
              ry="8.2"
              transform={`rotate(${rot} ${x} ${y})`}
              fill={idx % 2 === 0 ? '#2D6A4F' : '#52B788'}
            />
          ))}
          {/* دانه‌های کروی زرد گل شامادورا */}
          {isCham && (
            <g fill="#FACC15">
              <circle cx="44" cy="44" r="1.4" />
              <circle cx="41" cy="41" r="1.3" />
              <circle cx="56" cy="44" r="1.4" />
              <circle cx="59" cy="41" r="1.3" />
            </g>
          )}
        </g>
      );
    }

    // ۲۴. کاج مطبق، کاج نانا و سرو طلایی
    if (shape === 'pine' || shape.startsWith('pine_') || shape === 'cypress_goldcrest') {
      const isGold = shape === 'cypress_goldcrest';
      return (
        <g>
          <path d="M50 8L24 49H76L50 8Z" fill={isGold ? '#65A30D' : '#1E4D35'} stroke="#143325" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M50 15L29 43H71L50 15Z" fill={isGold ? '#84CC16' : '#2D6A4F'} />
          <path d="M50 22L35 37H65L50 22Z" fill={isGold ? '#A3E635' : '#40916C'} />
          <path d="M50 28L41 32H59L50 28Z" fill={isGold ? '#D9F99D' : '#74C69D'} />
        </g>
      );
    }

    // ========================================================================
    // ۲۵. پپرومیاها (هندوانه‌ای، چروک کاپراتا، قطره باران، قاشقی)، فیتونیا و برگ‌خونین
    // ========================================================================
    if (
      shape === 'peperomia' ||
      shape.startsWith('peperomia_') ||
      shape === 'hypoestes' ||
      shape === 'hypoestes_polka' ||
      shape.startsWith('fittonia_')
    ) {
      // ۱. پپرومیا هندوانه‌ای (دمبرگ سرخ + برگ گرد با خطوط نقره‌ای منحنی شبیه هندوانه)
      if (shape === 'peperomia_watermelon') {
        return (
          <g>
            <path d="M48 55L33 36M52 55L67 36M49 55L40 23M51 55L60 23M50 55V17" stroke="#9F1239" strokeWidth="2.2" strokeLinecap="round" />
            {[
              { cx: 32, cy: 35, r: -25 },
              { cx: 68, cy: 35, r: 25 },
              { cx: 40, cy: 23, r: -12 },
              { cx: 60, cy: 23, r: 12 },
              { cx: 50, cy: 17, r: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
                <path d="M 0 -9 C 7 -9, 9 0, 6 7 C 3 10, -3 10, -6 7 C -9 0, -7 -9, 0 -9 Z" fill="#1B4332" stroke="#0F291E" strokeWidth="1" />
                <path
                  d="M 0 3 C -5 1, -5 -5, 0 -8 M 0 3 C 5 1, 5 -5, 0 -8 M 0 3 V -8 M 0 3 C -3 6, 3 6, 0 3"
                  stroke="#CBD5E1"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="3" r="1.2" fill="#FDA4AF" />
              </g>
            ))}
          </g>
        );
      }

      // ۲. پپرومیا کاپراتا چروک (برگ‌های شیاردار زرشکی-سبز + سنبله‌های سفید دم‌موشی در بالا)
      if (shape === 'peperomia_caperata') {
        return (
          <g>
            {/* سنبله‌های سفید دم‌موشی (Rat-tail Inflorescences) */}
            <path d="M43 32 Q39 16 36 8 M50 30 V 5 M57 32 Q61 16 64 8" stroke="#F8FAFC" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M43 45L36 32M50 45V30M57 45L64 32" stroke="#881337" strokeWidth="1.6" />
            {[
              { cx: 32, cy: 42, r: -28 },
              { cx: 68, cy: 42, r: 28 },
              { cx: 41, cy: 34, r: -12 },
              { cx: 59, cy: 34, r: 12 },
              { cx: 50, cy: 39, r: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
                <path d="M 0 -6 C 5 -10, 10 -3, 7 4 C 4 8, 1 10, 0 12 C -1 10, -4 8, -7 4 C -10 -3, -5 -10, 0 -6 Z" fill="#3B0764" stroke="#14532D" strokeWidth="1.1" />
                <path d="M0 -5V10M-3 -5L-1 8M3 -5L1 8" stroke="#1B4332" strokeWidth="1.1" />
              </g>
            ))}
          </g>
        );
      }

      // ۳. پپرومیا قطره باران (Raindrop - برگ‌های اشکی براق با نقطه اتصال مرکزی روشن)
      if (shape === 'peperomia_raindrop') {
        return (
          <g>
            <path d="M47 55L32 35M53 55L68 35M49 55L40 22M51 55L60 22M50 55V16" stroke="#65A30D" strokeWidth="2.2" strokeLinecap="round" />
            {[
              { cx: 31, cy: 35, r: -22 },
              { cx: 69, cy: 35, r: 22 },
              { cx: 40, cy: 22, r: -10 },
              { cx: 60, cy: 22, r: 10 },
              { cx: 50, cy: 15, r: 0 },
              { cx: 50, cy: 34, r: 5 }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
                <path d="M 0 -10 C 7 -6, 9 3, 5 8 C 2 10, -2 10, -5 8 C -9 3, -7 -6, 0 -10 Z" fill="#22C55E" stroke="#15803D" strokeWidth="1" />
                <circle cx="0" cy="2.5" r="1.5" fill="#DCFCE7" />
              </g>
            ))}
          </g>
        );
      }

      // ۴. فیتونیا پوست‌ماری (قرمز و سفید) و برگ‌خونین خال‌دار
      if (shape.startsWith('fittonia_') || shape === 'hypoestes' || shape === 'hypoestes_polka') {
        const isWhiteNet = shape === 'fittonia_white';
        const isPolka = shape === 'hypoestes' || shape === 'hypoestes_polka';
        const netCol = isWhiteNet ? '#F8FAFC' : '#FB7185';

        return (
          <g>
            {[
              { cx: 32, cy: 42, r: -30 },
              { cx: 68, cy: 42, r: 30 },
              { cx: 39, cy: 31, r: -15 },
              { cx: 61, cy: 31, r: 15 },
              { cx: 50, cy: 39, r: 0 },
              { cx: 50, cy: 24, r: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`translate(${lf.cx}, ${lf.cy}) rotate(${lf.r})`}>
                <ellipse cx="0" cy="0" rx="8" ry="11" fill="#14532D" stroke="#064E3B" strokeWidth="1" />
                {isPolka ? (
                  <g fill="#F43F5E">
                    <circle cx="-3" cy="-4" r="2.2" />
                    <circle cx="3" cy="-2" r="2.5" />
                    <circle cx="-2" cy="3" r="2.6" />
                    <circle cx="3" cy="5" r="1.8" />
                    <circle cx="0" cy="-7" r="1.6" />
                  </g>
                ) : (
                  <path
                    d="M0 -9V9M0 -4L-6 -6M0 -4L6 -6M0 1L-6 -1M0 1L6 -1M0 5L-5 4M0 5L5 4M-3 -5L-4 3M3 -5L4 3"
                    stroke={netCol}
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                )}
              </g>
            ))}
          </g>
        );
      }

      // ۵. پپرومیا برگ‌قاشقی (سبز و ابلق)
      const isGreenPep = shape === 'peperomia_obtusifolia_green';
      return (
        <g>
          <path d="M50 55V20M50 42L36 33M50 36L64 28M50 28L40 20" stroke="#4D7C0F" strokeWidth="2.4" strokeLinecap="round" />
          {[
            { cx: 35, cy: 38, rot: -22 },
            { cx: 65, cy: 38, rot: 22 },
            { cx: 38, cy: 27, rot: -15 },
            { cx: 62, cy: 27, rot: 15 },
            { cx: 45, cy: 19, rot: -8 },
            { cx: 55, cy: 19, rot: 8 },
            { cx: 50, cy: 13, rot: 0 }
          ].map((lf, i) => (
            <g key={i} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
              <ellipse
                cx={lf.cx}
                cy={lf.cy}
                rx="7.2"
                ry="5.6"
                fill={isGreenPep ? '#15803D' : '#FEF9C3'}
                stroke="#1B4332"
                strokeWidth="1.1"
              />
              <ellipse cx={lf.cx} cy={lf.cy} rx="4.6" ry="3.6" fill="#2D6A4F" />
            </g>
          ))}
        </g>
      );
    }

    // ========================================================================
    // ۲۷. گندمی، برگ‌بیدی، موسی در گهواره، هویا قلبی و کارنوزا و گیاهان آویز فاز ۷
    // ========================================================================
    if (
      shape === 'spider_plant' ||
      shape.startsWith('spider_plant_') ||
      shape === 'purple_heart' ||
      shape.startsWith('tradescantia') ||
      shape === 'moses_in_cradle' ||
      shape.startsWith('callisia_') ||
      shape.startsWith('hoya_') ||
      shape.startsWith('string_of_') ||
      shape === 'sedum_burros_tail' ||
      shape === 'ivy_hedera' ||
      shape === 'cissus_grape_ivy' ||
      shape === 'swedish_ivy_plectranthus'
    ) {
      // ۱. هویا کِری قلبی (ولنتاین - تک‌برگ گوشتی قلبی کاشته‌شده در خاک)
      if (shape === 'hoya_kerrii_heart') {
        return (
          <g>
            {/* برگ قلبی کوچک کناری */}
            <path
              d="M 35 54 C 26 46, 22 35, 28 29 C 32 25, 36 29, 37 33 C 38 29, 43 25, 46 29 C 51 35, 44 46, 35 54 Z"
              fill="#2D6A4F"
              stroke="#1B4332"
              strokeWidth="1.2"
            />
            {/* برگ قلبی گوشتی و بزرگ اصلی */}
            <path
              d="M 53 55 C 39 42, 33 25, 42 16 C 47 11, 52 17, 53 22 C 54 17, 59 11, 64 16 C 73 25, 67 42, 53 55 Z"
              fill="#40916C"
              stroke="#FDE047"
              strokeWidth="1.8"
            />
            <path d="M50 28 C46 23, 43 24, 43 30" stroke="#74C69D" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </g>
        );
      }

      // ۲. هویا کارنوزا (پیچ مومی + چتر گل‌های ستاره‌ای چینی صورتی با مرکز یاقوتی)
      if (shape === 'hoya_carnosa') {
        return (
          <g>
            {/* حلقه قیم سیمی و ساقه پیچنده هویا */}
            <circle cx="50" cy="31" r="18" stroke="#785A40" strokeWidth="1.6" fill="none" />
            {[
              [32, 36, -35], [68, 36, 35], [35, 20, -15], [65, 20, 15], [50, 13, 0]
            ].map(([lx, ly, r], i) => (
              <ellipse key={i} cx={lx} cy={ly} rx="7.5" ry="4.2" transform={`rotate(${r} ${lx} ${ly})`} fill="#1B4332" stroke="#D8F3DC" strokeWidth="1" />
            ))}
            {/* چتر کروی گل‌های ستاره‌ای مومی هویا */}
            <g transform="translate(50, 29)">
              {[
                [-6, -3], [6, -3], [0, -7], [-5, 4], [5, 4], [0, 0], [0, 6]
              ].map(([fx, fy], idx) => (
                <g key={idx} transform={`translate(${fx}, ${fy})`}>
                  <circle cx="0" cy="0" r="3.4" fill="#FCE7F3" stroke="#F472B6" strokeWidth="0.6" />
                  <circle cx="0" cy="0" r="1.2" fill="#BE123C" />
                </g>
              ))}
            </g>
          </g>
        );
      }

      // ۳. گندمی ابلق و سبز
      if (shape === 'spider_plant' || shape.startsWith('spider_plant_')) {
        const isGreenSpider = shape === 'spider_plant_green';
        return (
          <g>
            {[
              'M50 55 Q34 36 14 48',
              'M50 55 Q38 24 22 24',
              'M50 55 Q46 22 44 10',
              'M50 55 Q54 22 58 10',
              'M50 55 Q62 24 78 24',
              'M50 55 Q66 36 86 48'
            ].map((d, i) => (
              <g key={i}>
                <path d={d} stroke="#2D6A4F" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                {!isGreenSpider && (
                  <path d={d} stroke="#FEF9C3" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                )}
              </g>
            ))}
          </g>
        );
      }

      // ۴. تاج بالایی رشته مروارید، رشته دل، سدوم دم‌موشی و پاپیتال
      if (
        shape.startsWith('string_of_') ||
        shape === 'sedum_burros_tail' ||
        shape === 'ivy_hedera' ||
        shape === 'cissus_grape_ivy' ||
        shape === 'swedish_ivy_plectranthus'
      ) {
        const isHearts = shape === 'string_of_hearts';
        const isBurro = shape === 'sedum_burros_tail';
        return (
          <g>
            {[34, 42, 50, 58, 66].map((cx, i) => (
              <circle
                key={i}
                cx={cx}
                cy={49 - (i % 2) * 3}
                r={isBurro ? '5.5' : '4.5'}
                fill={isHearts ? '#7E22CE' : isBurro ? '#74C69D' : '#2D6A4F'}
                stroke="#1B4332"
                strokeWidth="0.9"
              />
            ))}
          </g>
        );
      }

      // ۵. برگ‌بیدی بنفش، زبرینا، کالیسیا صورتی و موسی در گهواره
      const isZebrina = shape === 'tradescantia_zebrina';
      const isPinkCallisia = shape === 'callisia_pink';
      const isMoses = shape === 'moses_in_cradle';
      const isPurple = shape === 'purple_heart' || shape === 'tradescantia_pallida';

      return (
        <g>
          {[
            { cx: 33, cy: 41, rot: -35, fill: isPurple ? '#581C87' : isPinkCallisia ? '#F472B6' : '#9B2C62' },
            { cx: 67, cy: 41, rot: 35, fill: isPurple ? '#581C87' : isPinkCallisia ? '#F472B6' : '#9B2C62' },
            { cx: 38, cy: 30, rot: -20, fill: isPurple ? '#7E22CE' : isPinkCallisia ? '#FBCFE8' : '#2D6A4F' },
            { cx: 62, cy: 30, rot: 20, fill: isPurple ? '#6B21A8' : isPinkCallisia ? '#FBCFE8' : '#2D6A4F' },
            { cx: 50, cy: 23, rot: 0, fill: isPurple ? '#86198F' : isMoses ? '#40916C' : '#6B21A8' }
          ].map((lf, i) => (
            <g key={i} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
              <ellipse
                cx={lf.cx}
                cy={lf.cy}
                rx="5.5"
                ry="13.5"
                fill={lf.fill}
                stroke="#3B0764"
                strokeWidth="1"
              />
              {isZebrina && (
                <ellipse cx={lf.cx} cy={lf.cy} rx="2.6" ry="10.5" fill="#CBD5E1" opacity="0.85" />
              )}
            </g>
          ))}
          <circle cx="50" cy="18" r="2.4" fill="#F472B6" />
        </g>
      );
    }

    // ۲۸. ساکولنت‌ها
    if (
      shape === 'echeveria' ||
      shape.startsWith('echeveria_') ||
      shape.startsWith('aeonium_') ||
      shape === 'haworthia' ||
      shape.startsWith('haworthia_') ||
      shape.startsWith('crassula_') ||
      shape === 'aloe' ||
      shape.startsWith('aloe_') ||
      shape === 'agave_variegated' ||
      shape === 'sedum' ||
      shape.startsWith('sedum_') ||
      shape === 'adenium' ||
      shape === 'adenium_obesum' ||
      shape === 'lithops_stone' ||
      shape === 'portulacaria_afra' ||
      shape === 'senecio_blue'
    ) {
      if (shape === 'haworthia' || shape.startsWith('haworthia_') || shape === 'aloe' || shape.startsWith('aloe_') || shape === 'agave_variegated') {
        const isZebra = shape === 'haworthia' || shape === 'haworthia_fasciata' || shape === 'aloe_variegata';
        return (
          <g>
            <path d="M50 55L31 27L43 42L41 16L50 38L59 16L57 42L69 27L50 55Z" fill="#2D6A4F" stroke="#163625" strokeWidth="1.3" strokeLinejoin="round" />
            {isZebra && (
              <path d="M43 25H57M37 33H63M40 40H60M43 46H57" stroke="#F8FAFC" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2.5 2.5" />
            )}
          </g>
        );
      }

      if (shape === 'adenium' || shape === 'adenium_obesum') {
        return (
          <g>
            <path d="M40 55C38 42 43 34 46 30C48 27 52 27 54 30C57 34 62 42 60 55Z" fill="#A89886" stroke="#6E6254" strokeWidth="1.6" />
            <path d="M46 31L38 20M54 31L62 20M50 29V17" stroke="#A89886" strokeWidth="3.8" strokeLinecap="round" />
            <ellipse cx="36" cy="19" rx="5.5" ry="2.8" fill="#2D6A4F" />
            <ellipse cx="64" cy="19" rx="5.5" ry="2.8" fill="#2D6A4F" />
            <circle cx="50" cy="15" r="5" fill="#E11D48" stroke="#881337" strokeWidth="0.9" />
            <circle cx="50" cy="15" r="2" fill="#FFE4E6" />
          </g>
        );
      }

      const isDarkRosette = shape === 'echeveria_black_prince' || shape === 'aeonium_zwartkop';
      const rCol1 = isDarkRosette ? '#3B0764' : '#40916C';
      const rCol2 = isDarkRosette ? '#581C87' : '#74C69D';

      return (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={deg} cx="50" cy="34" rx="6.8" ry="13.5" transform={`rotate(${deg} 50 42)`} fill={rCol1} stroke="#1B4332" strokeWidth="1.1" />
          ))}
          {[22, 82, 142, 202, 262, 322].map((deg) => (
            <ellipse key={deg} cx="50" cy="37" rx="4.8" ry="9.5" transform={`rotate(${deg} 50 42)`} fill={rCol2} stroke="#1B4332" strokeWidth="0.9" />
          ))}
          <circle cx="50" cy="42" r="3.8" fill="#D8F3DC" />
        </g>
      );
    }

    // ۲۹. کاکتوس‌ها و افوربیاها
    if (
      shape === 'cactus' ||
      shape === 'opuntia' ||
      shape === 'christmas_cactus' ||
      shape.startsWith('cactus_') ||
      shape.startsWith('euphorbia_')
    ) {
      if (shape === 'christmas_cactus' || shape === 'cactus_christmas_zygocactus') {
        return (
          <g>
            {[
              'M46 53 Q35 42 24 48',
              'M48 52 Q38 34 27 36',
              'M50 52 Q50 32 50 18',
              'M52 52 Q62 34 73 36',
              'M54 53 Q65 42 76 48'
            ].map((d, idx) => (
              <path key={idx} d={d} stroke="#40916C" strokeWidth="4.6" strokeLinecap="round" strokeDasharray="6 2.2" fill="none" />
            ))}
            <circle cx="24" cy="48" r="3" fill="#E11D48" />
            <circle cx="76" cy="48" r="3" fill="#E11D48" />
            <circle cx="50" cy="17" r="3.2" fill="#F43F5E" />
          </g>
        );
      }

      if (shape === 'opuntia' || shape === 'cactus_opuntia_paddle' || shape === 'cactus_bunny_ears' || shape.startsWith('euphorbia_')) {
        return (
          <g>
            <ellipse cx="50" cy="41" rx="12.5" ry="14.5" fill="#40916C" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="37" cy="24" rx="7" ry="10.5" transform="rotate(-22 37 24)" fill="#52B788" stroke="#1B4332" strokeWidth="1.3" />
            <ellipse cx="63" cy="24" rx="7" ry="10.5" transform="rotate(22 63 24)" fill="#52B788" stroke="#1B4332" strokeWidth="1.3" />
            <circle cx="46" cy="38" r="1.2" fill="#FEF3C7" />
            <circle cx="54" cy="44" r="1.2" fill="#FEF3C7" />
            <circle cx="36" cy="22" r="1.2" fill="#FEF3C7" />
            <circle cx="64" cy="22" r="1.2" fill="#FEF3C7" />
          </g>
        );
      }

      const isGrafted = shape === 'cactus_moon_grafted';
      return (
        <g>
          <circle cx="50" cy="40" r="15.5" fill="#3D7A4F" stroke="#1B4332" strokeWidth="1.5" />
          <path d="M43 25C41 35 41 45 43 55M50 24V55M57 25C59 35 59 45 57 55" stroke="#1B4332" strokeWidth="1.1" />
          <path d="M43 31L40 29M43 41L39 41M57 31L60 29M57 41L61 41M50 33L52 31" stroke="#FDE68A" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="50" cy="23" r={isGrafted ? '7.5' : '3.8'} fill={isGrafted ? '#E11D48' : '#F43F5E'} stroke="#881337" strokeWidth="1" />
        </g>
      );
    }

    // حالت پیش‌فرض
    return (
      <g>
        <path d="M50 55V20M50 42L35 30M50 40L65 30" stroke="#1B4332" strokeWidth="2.2" strokeLinecap="round" />
        {renderPointedBlade(34, 34, 7, 13, -24, '#2D6A4F', '#143325')}
        {renderPointedBlade(66, 34, 7, 13, 24, '#2D6A4F', '#143325')}
        {renderPointedBlade(50, 22, 8, 15, 0, '#40916C', '#143325')}
      </g>
    );
  };

  // لایه ۴: شاخه‌های آبشاری و آویز که از روی لبه جلویی گلدان آویزان می‌شوند
  const renderForegroundTrailingVines = () => {
    // ۱. رشته دل (سروپژیا - ساقه‌های بنفش نازک با جفت برگ‌های قلبی نقره‌کوب متقابل)
    if (shape === 'string_of_hearts') {
      return (
        <g>
          {[35, 45, 55, 65].map((x, idx) => (
            <g key={idx}>
              <path d={`M ${x} 54 Q ${x + (idx % 2 === 0 ? -2 : 2)} 69 ${x} 84`} stroke="#701A75" strokeWidth="1" fill="none" />
              {[60, 68, 76].map((y, j) => (
                <g key={j} transform={`translate(${x}, ${y}) scale(0.38)`}>
                  <path
                    d="M 0 -5 C 5 -11, 12 -4, 9 3 C 6 9, 2 12, 0 15 C -2 12, -6 9, -9 3 C -12 -4, -5 -11, 0 -5 Z"
                    fill="#3B7A57"
                    stroke="#86198F"
                    strokeWidth="2"
                  />
                  <circle cx="-3" cy="1" r="2.5" fill="#E2E8F0" opacity="0.85" />
                  <circle cx="3" cy="1" r="2.5" fill="#E2E8F0" opacity="0.85" />
                </g>
              ))}
            </g>
          ))}
        </g>
      );
    }

    // ۲. سدوم دم‌موشی (گیس‌بافت متراکم آبی-سبز) و کاکتوس دم‌روباهی
    if (shape === 'sedum_burros_tail' || shape === 'cactus_foxtail_hanging') {
      const isFox = shape === 'cactus_foxtail_hanging';
      return (
        <g>
          {[36, 46, 56, 65].map((x, idx) => (
            <path
              key={idx}
              d={`M ${x} 55 Q ${x + (idx % 2 === 0 ? -4 : 4)} 68 ${x + (idx % 2 === 0 ? -2 : 2)} 82`}
              stroke={isFox ? '#FACC15' : '#74C69D'}
              strokeWidth={isFox ? '6' : '6.8'}
              strokeLinecap="round"
              strokeDasharray={isFox ? '1.5 1' : '3 1.5'}
              fill="none"
            />
          ))}
        </g>
      );
    }

    // ۳. رشته مروارید (دانه‌های کروی نخودی با خط شفاف نوری)
    if (shape === 'string_of_pearls') {
      return (
        <g>
          {[35, 44, 54, 64].map((x, idx) => (
            <g key={idx}>
              <path d={`M ${x} 54 Q ${x + (idx % 2 === 0 ? -3 : 3)} 68 ${x} 83`} stroke="#2D6A4F" strokeWidth="1.2" fill="none" />
              {[59, 65, 71, 77, 82].map((y, j) => (
                <g key={j}>
                  <circle cx={x + (j % 2 === 0 ? -1.2 : 1.2)} cy={y} r="2.8" fill="#52B788" stroke="#1B4332" strokeWidth="0.7" />
                  <circle cx={x + (j % 2 === 0 ? -2 : 0.4)} cy={y - 0.8} r="0.8" fill="#D8F3DC" />
                </g>
              ))}
            </g>
          ))}
        </g>
      );
    }

    // ۴. پاپیتال (عشقه انگلیسی با برگ‌های پنجه‌ستاره‌ای ابلق)
    if (shape === 'ivy_hedera') {
      return (
        <g>
          <path d="M34 55 Q23 64 20 79 M66 55 Q77 64 80 79" stroke="#1B4332" strokeWidth="1.6" fill="none" />
          {[
            [26, 61, -25], [21, 72, -10], [74, 61, 25], [79, 72, 10]
          ].map(([lx, ly, rot], i) => (
            <g key={i} transform={`translate(${lx}, ${ly}) rotate(${rot})`}>
              <path
                d="M 0 -5 L 2 -2 L 6 -2 L 3 1 L 4 5 L 0 3 L -4 5 L -3 1 L -6 -2 L -2 -2 Z"
                fill="#2D6A4F"
                stroke="#FEF08A"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
      );
    }

    // ۵. پتوس‌ها، فیلودندرون‌های رونده، سیسوس و پیچ سوئدی
    if (
      shape === 'pothos' ||
      shape.startsWith('pothos_') ||
      shape === 'philo_scandens' ||
      shape === 'philo_brasil' ||
      shape === 'philo_micans' ||
      shape === 'cissus_grape_ivy' ||
      shape === 'swedish_ivy_plectranthus'
    ) {
      const col = shape === 'pothos_neon' ? '#84CC16' : '#2D6A4F';
      return (
        <g>
          <path d="M35 55 Q24 63 22 76 M65 55 Q75 64 77 75" stroke="#1B4332" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {renderHeartLeaf(25, 63, 0.72, -35, col, '#143325', '#FACC15', 'golden_streaks')}
          {renderHeartLeaf(22, 74, 0.68, -15, col, '#143325')}
          {renderHeartLeaf(74, 64, 0.72, 35, col, '#143325', '#FACC15', 'golden_streaks')}
          {renderHeartLeaf(77, 74, 0.68, 15, col, '#143325')}
        </g>
      );
    }

    if (shape === 'spider_plant' || shape.startsWith('spider_plant_')) {
      return (
        <g>
          <path d="M42 55 Q28 66 25 81" stroke="#CA8A04" strokeWidth="1.4" fill="none" />
          <g transform="translate(25, 81)">
            <path d="M0 0L-5 4M0 0L5 4M0 0L-4 -4M0 0L4 -4M0 0V6" stroke="#2D6A4F" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.8" fill="#FEF08A" />
          </g>
        </g>
      );
    }

    return null;
  };

  return (
    <svg className="w-23 h-23 drop-shadow-xs" viewBox="0 0 100 90" fill="none">
      {/* ۱. لبه پشتی گلدان و سطح خاک تیره */}
      {renderBackRimAndSoil()}
      {/* ۲. تنه و برگ‌های گیاه که از داخل خاک گلدان می‌رویند */}
      {renderUprightFoliage()}
      {/* ۳. بدنه سه‌بعدی و لبه جلویی گلدان که روی پایه ساقه را می‌پوشاند */}
      <PotVectorGraphic shape={effectivePotShape} color={potColor} />
      {/* ۴. شاخه‌های آویز که از روی لبه جلویی گلدان آویزان می‌شوند */}
      {renderForegroundTrailingVines()}
    </svg>
  );
};