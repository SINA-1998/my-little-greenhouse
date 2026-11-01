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
      d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
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
  | 'wood_grain';

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
  terracotta_light: {
    id: 'terracotta_light',
    nameFa: 'سفالی روشن مدیترانه‌ای',
    shortNameFa: 'سفالی روشن',
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
    shortNameFa: 'بتنی',
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
    shortNameFa: 'ذغالی',
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
    shortNameFa: 'مخروطی بلند',
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
    shortNameFa: 'چهارگوش ساده',
    nameEn: 'Minimalist Cube',
    category: 'modern',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'high',
    bestForDescription: 'حجم خاک ۲۰٪ بیشتر نسبت به گلدان گرد هم‌عرض و پایداری کامل برای شمشاد و هاورتیا',
    dimensionsRatio: { topWidth: 36, bottomWidth: 32, height: 32 }
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
  square_patterned: {
    id: 'square_patterned',
    nameFa: 'چهارگوش طرح‌دار برجسته',
    shortNameFa: 'چهارگوش طرح‌دار',
    nameEn: 'Embossed Geometric Square',
    category: 'classic',
    depthProfile: 'medium',
    stabilityScore: 10,
    moistureRetention: 'high',
    bestForDescription: 'مناسب تراس‌ها و ورودی‌ها برای کاشت رز درختچه‌ای، کامکوات و درختچه‌های زینتی',
    dimensionsRatio: { topWidth: 38, bottomWidth: 30, height: 33 }
  },
  chalice_urn: {
    id: 'chalice_urn',
    nameFa: 'جامی پایه‌دار سلطنتی',
    shortNameFa: 'جامی پایه‌دار',
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
    shortNameFa: 'پایه‌دار چوبی',
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
    shortNameFa: 'دیگی سه‌پایه',
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

// تشخیص هوشمند مدل گلدان در صورت عدم تعیین مستقیم
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
            <ellipse cx="50" cy="54" rx="19" ry="3.8" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="17.5" ry="3" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="17" ry="3.2" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="15.8" ry="2.6" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="22" ry="4.2" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.6" rx="20.5" ry="3.4" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="18" ry="3.4" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="16.5" ry="2.8" fill="#3E2723" />
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
            <polygon points="32,54 50,50.5 68,54 50,57.5" fill={palette.insideHex} />
            <polygon points="34,54 50,51.2 66,54 50,56.8" fill="#3E2723" />
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
            <polygon points="31,54 50,50.5 69,54 50,57.5" fill={palette.insideHex} />
            <polygon points="33,54 50,51.2 67,54 50,56.8" fill="#3E2723" />
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
            <polygon points="32,54 42,51 58,51 68,54 58,57 42,57" fill={palette.insideHex} />
            <polygon points="34,54 43,51.6 57,51.6 66,54 57,56.4 43,56.4" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="20" ry="3.8" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.6" rx="18.2" ry="3" fill="#3E2723" />
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
            <polygon points="24,54 30,51 76,51 72,56.5 24,56.5" fill={palette.insideHex} />
            <polygon points="26,54.2 31,51.8 74,51.8 70,56 26,56" fill="#3E2723" />
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
            <g stroke="#A89886" strokeWidth="1.1" opacity="0.85">
              <line x1="50" y1="4" x2="31" y2="54" />
              <line x1="50" y1="4" x2="69" y2="54" />
              <line x1="50" y1="4" x2="45" y2="56" />
            </g>
            <circle cx="50" cy="4" r="2.2" fill="none" stroke="#786856" strokeWidth="1.3" />
            <ellipse cx="50" cy="54" rx="19.5" ry="3.8" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="18" ry="3" fill="#3E2723" />
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
            <polygon points="25,54 31,50.5 75,50.5 69,56.5 25,56.5" fill={palette.insideHex} />
            <ellipse cx="50" cy="54" rx="21" ry="3.2" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="16" ry="3.2" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="14.5" ry="2.6" fill="#3E2723" />
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
            <polygon points="31,54 40,51 60,51 69,54 60,57 40,57" fill={palette.insideHex} />
            <polygon points="33,54 41,51.6 59,51.6 67,54 59,56.4 41,56.4" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="16.5" ry="3.2" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="15.2" ry="2.5" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="17" ry="3.4" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="15.5" ry="2.7" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="18" ry="3.5" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="16.5" ry="2.8" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="20" ry="3.8" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.6" rx="18.2" ry="3" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="19" ry="3.5" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="17.5" ry="2.8" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="17" ry="3.4" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="15.5" ry="2.7" fill="#3E2723" />
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
            <ellipse cx="50" cy="54" rx="19" ry="3.8" fill={palette.insideHex} />
            <ellipse cx="50" cy="54.5" rx="17.5" ry="3" fill="#3E2723" />
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
// ۴. موتور گرافیکی شاخ‌وبرگ گیاهان (پشتیبانی کامل از تمام کلیدهای فاز ۱ تا ۱۲)
// ============================================================================

export const PlantStylizedIllustration: React.FC<{
  shape: string;
  potColor: PotColorType | string;
  potShape?: PotShapeType | string;
  plantName?: string;
  customSvgMarkup?: string;
}> = ({ shape, potColor, potShape, customSvgMarkup }) => {
  const effectivePotShape = resolveEffectivePotShape(shape, potShape);

  if (customSvgMarkup && customSvgMarkup.trim().startsWith('<svg')) {
    return (
      <div
        className="w-24 h-24 flex items-center justify-center drop-shadow-xs"
        dangerouslySetInnerHTML={{ __html: customSvgMarkup }}
      />
    );
  }

  const renderPlantFoliage = () => {
    switch (shape) {
      // --- دیش‌گاردن‌های ترکیبی ---
      case 'combo_trough':
      case 'dish_garden_succulent':
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

      case 'combo_trough_2':
        return (
          <g>
            <path d="M35 53L28 37L34 44L36 33L39 44L44 37L35 53Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1" />
            <rect x="49" y="33" width="5" height="20" rx="2.2" fill="#40916C" stroke="#1B4332" strokeWidth="1" />
            <circle cx="64" cy="45" r="7" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
            <circle cx="64" cy="45" r="3.8" fill="#74C69D" />
          </g>
        );

      // --- فاز ۱: سانسوریاها و زامیفولیاها ---
      case 'sansevieria':
      case 'sansevieria_sword_variegated':
        return (
          <g>
            <path d="M50,54 L44,14 C43.5,12 45,10 47,12 L51,54 Z" fill="#2E7D32" stroke="#FBC02D" strokeWidth="1.2" />
            <path d="M50,54 L56,10 C56.5,8 58,9 58.5,12 L53,54 Z" fill="#388E3C" stroke="#FBC02D" strokeWidth="1.2" />
            <path d="M48,54 L38,20 C37,18 39,16 41,18 L49,54 Z" fill="#1B5E20" stroke="#FBC02D" strokeWidth="1" />
            <path d="M52,54 L62,18 C63,16 64,18 63,20 L53,54 Z" fill="#2E7D32" stroke="#FBC02D" strokeWidth="1" />
            <path d="M46,54 L32,28 C31,26 33,24 35,26 L47,54 Z" fill="#1B5E20" />
            <path d="M54,54 L68,26 C69,24 71,26 69,28 L53,54 Z" fill="#388E3C" />
          </g>
        );
      case 'sansevieria_moonshine':
        return (
          <g>
            <path d="M50,54 L42,12 C41,10 44,8 46,11 L51,54 Z" fill="#90A4AE" stroke="#37474F" strokeWidth="0.8" />
            <path d="M50,54 L58,11 C59,9 61,11 60,13 L51,54 Z" fill="#B0BEC5" stroke="#37474F" strokeWidth="0.8" />
            <path d="M48,54 L36,18 C35,16 38,15 40,17 L49,54 Z" fill="#78909C" />
            <path d="M52,54 L64,17 C65,15 67,17 65,19 L52,54 Z" fill="#90A4AE" />
            <path d="M46,54 L30,26 C29,24 32,23 34,25 L47,54 Z" fill="#607D8B" />
          </g>
        );
      case 'sansevieria_black_gold':
        return (
          <g>
            <path d="M50,54 L44,11 C43.5,9 45,8 46.5,10 L51,54 Z" fill="#112218" stroke="#FFD700" strokeWidth="1.4" />
            <path d="M50,54 L56,9 C56.5,7 58,8 58.5,10 L52,54 Z" fill="#0B1911" stroke="#FFD700" strokeWidth="1.4" />
            <path d="M48,54 L37,17 C36,15 38,14 40,16 L49,54 Z" fill="#183022" stroke="#FFD700" strokeWidth="1.2" />
            <path d="M52,54 L63,16 C64,14 65,16 64,18 L53,54 Z" fill="#0B1911" stroke="#FFD700" strokeWidth="1.2" />
            <path d="M46,54 L31,25 C30,23 32,22 34,24 L47,54 Z" fill="#112218" />
          </g>
        );
      case 'sansevieria_hahnii':
        return (
          <g>
            <path d="M50,54 C40,54 35,40 38,30 C41,20 48,25 50,32 C52,25 59,20 62,30 C65,40 60,54 50,54 Z" fill="#2E7D32" stroke="#A3E635" strokeWidth="0.9" />
            <path d="M50,54 C45,54 40,42 43,33 C46,24 51,28 50,35 C49,28 54,24 57,33 C60,42 55,54 50,54 Z" fill="#388E3C" />
            <path d="M50,54 C48,54 44,45 46,38 C48,31 51,34 50,38 C49,34 52,31 54,38 C56,45 52,54 50,54 Z" fill="#1B5E20" />
          </g>
        );
      case 'sansevieria_cylindrica':
        return (
          <g>
            <path d="M50,54 L40,15 C39,13 41,12 42,14 L49,54 Z" fill="#33691E" stroke="#558B2F" strokeWidth="2" />
            <path d="M50,54 L60,13 C61,11 63,12 62,14 L52,54 Z" fill="#33691E" stroke="#558B2F" strokeWidth="2" />
            <path d="M49,54 L50,8 C50,6 52,6 53,8 L51,54 Z" fill="#558B2F" stroke="#33691E" strokeWidth="2" />
            <path d="M48,54 L30,22 C29,20 31,19 33,21 L48,54 Z" fill="#2E7D32" stroke="#558B2F" strokeWidth="2" />
            <path d="M52,54 L70,21 C71,19 69,18 68,20 L53,54 Z" fill="#2E7D32" stroke="#558B2F" strokeWidth="2" />
          </g>
        );
      case 'sansevieria_fernwood':
        return (
          <g>
            <path d="M50,54 L36,18 C35,16 38,15 40,17 L49,54 Z" fill="#558B2F" />
            <path d="M50,54 L64,17 C65,15 63,14 61,16 L52,54 Z" fill="#33691E" />
            <path d="M50,54 L44,12 C43,10 46,9 47,11 L51,54 Z" fill="#689F38" />
            <path d="M50,54 L56,11 C57,9 55,8 54,10 L50,54 Z" fill="#558B2F" />
            <path d="M49,54 L26,28 C25,26 28,25 30,27 L48,54 Z" fill="#33691E" />
            <path d="M51,54 L74,27 C75,25 72,24 70,26 L52,54 Z" fill="#558B2F" />
          </g>
        );
      case 'zz':
      case 'zz_green':
        return (
          <g>
            <path d="M46 54L36 16M54 54L64 14" stroke="#2B5E3F" strokeWidth="2.5" strokeLinecap="round" />
            {[22, 32, 42, 49].map((y, i) => (
              <g key={i}>
                <ellipse cx={33 - i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(-25 ${33 - i * 1.2} ${y})`} fill="#2E6F4E" stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={43 - i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(25 ${43 - i * 1.2} ${y - 2})`} fill="#3E8E63" stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={57 + i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(-25 ${57 + i * 1.2} ${y - 2})`} fill="#52B788" stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={67 + i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(25 ${67 + i * 1.2} ${y})`} fill="#40916C" stroke="#18422C" strokeWidth="1.1" />
              </g>
            ))}
          </g>
        );
      case 'zz_raven':
        return (
          <g>
            <path d="M46 54L36 16M54 54L64 14" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" />
            {[22, 32, 42, 49].map((y, i) => (
              <g key={i}>
                <ellipse cx={33 - i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(-25 ${33 - i * 1.2} ${y})`} fill="#1F2937" stroke="#030712" strokeWidth="1.1" />
                <ellipse cx={43 - i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(25 ${43 - i * 1.2} ${y - 2})`} fill="#111827" stroke="#030712" strokeWidth="1.1" />
                <ellipse cx={57 + i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(-25 ${57 + i * 1.2} ${y - 2})`} fill="#374151" stroke="#030712" strokeWidth="1.1" />
                <ellipse cx={67 + i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(25 ${67 + i * 1.2} ${y})`} fill="#111827" stroke="#030712" strokeWidth="1.1" />
              </g>
            ))}
          </g>
        );
      case 'zz_variegated':
        return (
          <g>
            <path d="M46 54L36 16M54 54L64 14" stroke="#2B5E3F" strokeWidth="2.5" strokeLinecap="round" />
            {[22, 32, 42, 49].map((y, i) => (
              <g key={i}>
                <ellipse cx={33 - i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(-25 ${33 - i * 1.2} ${y})`} fill={i % 2 === 0 ? '#FEF08A' : '#2E6F4E'} stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={43 - i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(25 ${43 - i * 1.2} ${y - 2})`} fill="#3E8E63" stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={57 + i * 1.2} cy={y - 2} rx="6.2" ry="3.3" transform={`rotate(-25 ${57 + i * 1.2} ${y - 2})`} fill={i % 2 === 1 ? '#FEF9C3' : '#52B788'} stroke="#18422C" strokeWidth="1.1" />
                <ellipse cx={67 + i * 1.2} cy={y} rx="6.2" ry="3.3" transform={`rotate(25 ${67 + i * 1.2} ${y})`} fill="#40916C" stroke="#18422C" strokeWidth="1.1" />
              </g>
            ))}
          </g>
        );
      case 'aglaonema':
      case 'aglaonema_silver':
        return (
          <g>
            <path d="M50,54 C35,50 20,35 22,20 C24,10 38,15 50,32 C62,15 76,10 78,20 C80,35 65,50 50,54 Z" fill="#2D6A4F" />
            <path d="M50,54 C42,48 32,38 35,28 C37,20 44,24 50,35 C56,24 63,20 65,28 C68,38 58,48 50,54 Z" fill="#B7E4C7" />
          </g>
        );
      case 'aglaonema_snow':
        return (
          <g>
            <path d="M50,54 C35,50 20,35 22,20 C24,10 38,15 50,32 C62,15 76,10 78,20 C80,35 65,50 50,54 Z" fill="#4CAF50" />
            <path d="M50,54 C42,48 32,38 35,28 C37,20 44,24 50,35 C56,24 63,20 65,28 C68,38 58,48 50,54 Z" fill="#FFFFFF" />
          </g>
        );
      case 'aglaonema_dark':
      case 'aspidistra_cast_iron':
        return (
          <g>
            <path d="M50,54 C30,50 15,30 18,15 C20,8 35,12 50,28 C65,12 80,8 82,15 C85,30 70,50 50,54 Z" fill="#14532D" />
            <path d="M50,54 C40,50 25,35 30,22 C33,15 42,20 50,32 C58,20 67,15 70,22 C75,35 60,50 50,54 Z" fill="#166534" />
          </g>
        );
      case 'aglaonema_red':
        return (
          <g>
            <path d="M50,54 C35,50 20,35 22,20 C24,10 38,15 50,32 C62,15 76,10 78,20 C80,35 65,50 50,54 Z" fill="#14532D" />
            <path d="M50,54 C42,48 32,38 35,28 C37,20 44,24 50,35 C56,24 63,20 65,28 C68,38 58,48 50,54 Z" fill="#E11D48" />
          </g>
        );
      case 'aglaonema_gold':
        return (
          <g>
            <path d="M50,54 C35,50 20,35 22,20 C24,10 38,15 50,32 C62,15 76,10 78,20 C80,35 65,50 50,54 Z" fill="#166534" />
            <path d="M50,54 C42,48 32,38 35,28 C37,20 44,24 50,35 C56,24 63,20 65,28 C68,38 58,48 50,54 Z" fill="#FACC15" />
          </g>
        );
      case 'dieffenbachia':
      case 'dieffenbachia_tropic':
      case 'dieffenbachia_camilla':
        return (
          <g>
            <path d="M50,54 C35,48 18,32 20,16 C22,8 36,12 50,28 C64,12 78,8 80,16 C82,32 65,48 50,54 Z" fill="#166534" />
            <path d="M50,54 C42,45 28,32 32,22 C35,15 43,18 50,30 C57,18 65,15 68,22 C72,32 58,45 50,54 Z" fill="#FEF08A" />
          </g>
        );
      case 'schefflera':
      case 'schefflera_variegated':
      case 'schefflera_green':
        return (
          <g>
            <path d="M50 54V22M50 40L33 29M50 36L67 28" stroke="#4A6B53" strokeWidth="2.4" strokeLinecap="round" />
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="33" cy="22" rx="3" ry="7.5" transform={`rotate(${deg} 33 29)`} fill="#2D6A4F" stroke="#1B4332" strokeWidth="0.8" />
            ))}
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="67" cy="21" rx="3" ry="7.5" transform={`rotate(${deg} 67 28)`} fill="#40916C" stroke="#1B4332" strokeWidth="0.8" />
            ))}
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="50" cy="13" rx="3.2" ry="8" transform={`rotate(${deg} 50 21)`} fill={shape === 'schefflera_variegated' ? '#A3E635' : '#52B788'} stroke="#1B4332" strokeWidth="0.8" />
            ))}
          </g>
        );
      case 'ficus':
      case 'ficus_elastica_green':
        return (
          <g>
            <path d="M50,54 C35,50 15,35 20,18 C23,8 40,12 50,30 C60,12 77,8 80,18 C85,35 65,50 50,54 Z" fill="#14532D" />
            <path d="M50,54 C40,46 25,30 30,20 C34,12 43,16 50,28 C57,16 66,12 70,20 C75,30 60,46 50,54 Z" fill="#166534" />
          </g>
        );
      case 'ficus_elastica_burgundy':
        return (
          <g>
            <path d="M50,54 C35,50 15,35 20,18 C23,8 40,12 50,30 C60,12 77,8 80,18 C85,35 65,50 50,54 Z" fill="#4A0404" />
            <path d="M50,54 C40,46 25,30 30,20 C34,12 43,16 50,28 C57,16 66,12 70,20 C75,30 60,46 50,54 Z" fill="#7F1D1D" />
          </g>
        );
      case 'ficus_elastica_black':
        return (
          <g>
            <path d="M50,54 C35,50 15,35 20,18 C23,8 40,12 50,30 C60,12 77,8 80,18 C85,35 65,50 50,54 Z" fill="#030712" />
            <path d="M50,54 C40,46 25,30 30,20 C34,12 43,16 50,28 C57,16 66,12 70,20 C75,30 60,46 50,54 Z" fill="#1F2937" />
          </g>
        );
      case 'fiddle_leaf':
      case 'ficus_lyrata':
        return (
          <g>
            <path d="M50,54 C30,50 12,30 18,12 C22,2 38,6 50,24 C62,6 78,2 82,12 C88,30 70,50 50,54 Z" fill="#166534" />
            <path d="M50,54 C38,44 22,28 26,16 C30,8 42,12 50,24 C58,12 70,8 74,16 C78,28 62,44 50,54 Z" fill="#15803D" />
          </g>
        );
      case 'ficus_benjamina':
        return (
          <g>
            <path d="M50,54 C38,45 20,35 15,20 C12,12 25,10 40,25 C30,15 45,5 50,18 C55,5 70,15 60,25 C75,10 88,12 85,20 C80,35 62,45 50,54 Z" fill="#15803D" />
            <path d="M50,54 C42,42 28,30 25,18 C22,10 32,8 45,22 C48,15 52,15 55,22 C68,8 78,10 75,18 C72,30 58,42 50,54 Z" fill="#22C55E" />
          </g>
        );
      case 'ficus_ginseng':
      case 'bonsai_ginseng':
        return (
          <g>
            <ellipse cx="50" cy="50" rx="14" ry="8" fill="#7C2D12" />
            <path d="M50,42 C35,35 20,20 25,10 C30,2 45,5 50,15 C55,5 70,2 75,10 C80,20 65,35 50,42 Z" fill="#15803D" />
          </g>
        );

      // --- فاز ۲: پتوس‌ها و فیلودندرون‌ها ---
      case 'pothos':
      case 'pothos_golden':
      case 'pothos_jade':
      case 'pothos_satin':
        return (
          <g>
            <path d="M50,54 C38,45 22,32 25,18 C27,10 38,12 50,26 C62,12 73,10 75,18 C78,32 62,45 50,54 Z" fill="#22C55E" />
            <path d="M50,70 C30,68 15,50 18,35 C20,25 32,28 45,45 C35,50 35,60 50,70 Z" fill="#166534" />
            <path d="M50,80 C70,78 85,60 82,45 C80,35 68,28 55,45 C65,50 65,60 50,80 Z" fill="#15803D" />
          </g>
        );
      case 'pothos_neon':
        return (
          <g>
            <path d="M50,54 C38,45 22,32 25,18 C27,10 38,12 50,26 C62,12 73,10 75,18 C78,32 62,45 50,54 Z" fill="#84CC16" />
            <path d="M50,70 C30,68 15,50 18,35 C20,25 32,28 45,45 C35,50 35,60 50,70 Z" fill="#A3E635" />
            <path d="M50,80 C70,78 85,60 82,45 C80,35 68,28 55,45 C65,50 65,60 50,80 Z" fill="#65A30D" />
          </g>
        );
      case 'pothos_marble':
      case 'pothos_manjula':
      case 'pothos_njoy':
        return (
          <g>
            <path d="M50,54 C38,45 22,32 25,18 C27,10 38,12 50,26 C62,12 73,10 75,18 C78,32 62,45 50,54 Z" fill="#FFFFFF" stroke="#166534" strokeWidth="1" />
            <path d="M50,70 C30,68 15,50 18,35 C20,25 32,28 45,45 C35,50 35,60 50,70 Z" fill="#E2E8F0" />
            <path d="M50,80 C70,78 85,60 82,45 C80,35 68,28 55,45 C65,50 65,60 50,80 Z" fill="#166534" />
          </g>
        );
      case 'monstera':
      case 'monstera_adansonii':
      case 'monstera_deliciosa':
      case 'monstera_thai':
        return (
          <g>
            <path d="M50,54 C30,50 10,30 15,12 C18,2 38,5 50,22 C62,5 82,2 85,12 C90,30 70,50 50,54 Z" fill="#166534" />
            <circle cx="35" cy="25" r="4" fill={shape === 'monstera_thai' ? '#FEF9C3' : '#F6F3EC'} />
            <circle cx="65" cy="25" r="4" fill={shape === 'monstera_thai' ? '#FEF9C3' : '#F6F3EC'} />
            <circle cx="50" cy="35" r="5" fill="#F6F3EC" />
          </g>
        );
      case 'philo_scandens':
      case 'philo_brasil':
      case 'philo_birkin':
      case 'philo_orange':
      case 'philo_pink_princess':
      case 'philo_xanadu':
      case 'philo_elephant_ear':
      case 'philo_micans':
        return (
          <g>
            <path
              d="M50,54 C35,50 15,35 20,15 C23,5 40,8 50,25 C60,8 77,5 80,15 C85,35 65,50 50,54 Z"
              fill={
                shape === 'philo_orange'
                  ? '#EA580C'
                  : shape === 'philo_pink_princess'
                  ? '#9D174D'
                  : '#15803D'
              }
            />
            <path d="M50,72 C25,70 10,50 15,35 C18,25 32,28 45,48 C35,55 35,65 50,72 Z" fill="#166534" />
          </g>
        );
      case 'syngonium_green':
      case 'syngonium_pink':
      case 'syngonium_albo':
        return (
          <g>
            <path
              d="M50,54 L35,25 L50,12 L65,25 Z"
              fill={shape === 'syngonium_pink' ? '#F472B6' : shape === 'syngonium_albo' ? '#F8FAFC' : '#22C55E'}
              stroke="#166534"
              strokeWidth="0.8"
            />
            <path d="M50,54 L20,38 L30,22 Z" fill="#166534" />
            <path d="M50,54 L80,38 L70,22 Z" fill="#15803D" />
          </g>
        );
      case 'alocasia_giant':
      case 'alocasia_polly':
      case 'alocasia_black_velvet':
      case 'alocasia_zebrina':
        return (
          <g>
            <path d="M50,54 C35,50 10,35 20,10 C25,2 45,5 50,20 C55,5 75,2 80,10 C90,35 65,50 50,54 Z" fill="#064E3B" stroke="#A7F3D0" strokeWidth="1.2" />
          </g>
        );

      // --- فاز ۳: دراسنا، بامبو و نخل‌ها ---
      case 'dracaena':
      case 'dracaena_compacta':
      case 'dracaena_marginata':
      case 'dracaena_massangeana':
      case 'dracaena_lemon_lime':
      case 'dracaena_reflexa':
      case 'cordyline_red':
        return (
          <g>
            <path d="M50,54 L48,15 C48,10 52,10 52,15 L50,54 Z" fill="#3D2817" />
            <path d="M50,20 L30,10 L48,22 Z" fill={shape === 'cordyline_red' ? '#BE123C' : '#15803D'} />
            <path d="M50,20 L70,10 L52,22 Z" fill="#166534" />
            <path d="M50,18 L25,25 L49,25 Z" fill="#166534" />
            <path d="M50,18 L75,25 L51,25 Z" fill={shape === 'cordyline_red' ? '#E11D48' : '#15803D'} />
          </g>
        );
      case 'lucky_bamboo':
        return (
          <g>
            <path d="M48,54 Q44,40 52,30 Q60,20 50,10" stroke="#166534" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M52,25 L40,20 Z" fill="#22C55E" />
            <path d="M50,15 L62,12 Z" fill="#22C55E" />
          </g>
        );
      case 'yucca_cane':
        return (
          <g>
            <rect x="46" y="25" width="8" height="29" fill="#5C4033" rx="2" />
            <path d="M50,25 L30,12 L48,26 Z" fill="#15803D" />
            <path d="M50,25 L70,12 L52,26 Z" fill="#166534" />
            <path d="M50,22 L20,20 L49,27 Z" fill="#166534" />
            <path d="M50,22 L80,20 L51,27 Z" fill="#15803D" />
          </g>
        );
      case 'chamaedorea':
      case 'pachypodium':
      case 'palm_chamaedorea':
      case 'palm_areca':
      case 'palm_kentia':
      case 'palm_cyperus':
      case 'palm_madagascar':
      case 'palm_fan':
      case 'palm_rhapis':
      case 'cycas_revoluta':
      case 'ponytail_linda':
        return (
          <g>
            <path d="M50,54 L48,22 C48,18 52,18 52,22 L50,54 Z" fill="#4B3621" />
            <path d="M50,22 Q30,5 15,10 Q25,25 50,22 Z" fill="#15803D" />
            <path d="M50,22 Q70,5 85,10 Q75,25 50,22 Z" fill="#166534" />
            <path d="M50,22 Q40,2 30,18 Q45,28 50,22 Z" fill="#22C55E" />
            <path d="M50,22 Q60,2 70,18 Q55,28 50,22 Z" fill="#15803D" />
          </g>
        );
      case 'pine':
      case 'pine_norfolk':
      case 'pine_nana':
      case 'cypress_goldcrest':
        return (
          <g>
            <path
              d="M50 9L25 48H75L50 9Z"
              fill={shape === 'cypress_goldcrest' ? '#84CC16' : '#2F6648'}
              stroke="#1E4430"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M50 16L30 43H70L50 16Z"
              fill={shape === 'cypress_goldcrest' ? '#A3E635' : '#43825F'}
            />
            <path
              d="M50 23L36 38H64L50 23Z"
              fill={shape === 'cypress_goldcrest' ? '#BEF264' : '#5CA37B'}
            />
          </g>
        );

      // --- فاز ۴: کالاتیا، مارانتا، پپرومیا و سرخس‌ها ---
      case 'calathea':
      case 'calathea_ornata':
      case 'calathea_zebrina':
      case 'calathea_medallion':
      case 'calathea_lancifolia':
      case 'calathea_orbifolia':
      case 'maranta_erythroneura':
      case 'maranta_lemon_lime':
      case 'stromanthe_triostar':
        return (
          <g>
            <path d="M50,54 C35,45 15,35 25,15 C32,5 48,12 50,28 C52,12 68,5 75,15 C85,35 65,45 50,54 Z" fill="#14532D" />
            <path d="M50,54 C42,42 28,30 35,20 C40,12 46,18 50,30 C54,18 60,12 65,20 C72,30 58,42 50,54 Z" fill="#EC4899" />
          </g>
        );
      case 'peperomia':
      case 'peperomia_obtusifolia_green':
      case 'peperomia_obtusifolia_variegated':
      case 'peperomia_watermelon':
      case 'peperomia_caperata':
      case 'peperomia_raindrop':
        return (
          <g>
            <circle cx="42" cy="38" r="10" fill="#15803D" />
            <circle cx="58" cy="38" r="10" fill="#166534" />
            <circle cx="50" cy="26" r="12" fill="#22C55E" />
            <circle cx="32" cy="45" r="9" fill="#14532D" />
            <circle cx="68" cy="45" r="9" fill="#15803D" />
          </g>
        );
      case 'fern_boston':
      case 'fern_fluffy':
      case 'fern_staghorn':
      case 'fern_maidenhair':
        return (
          <g>
            <path d="M50,54 Q35,40 20,45 Q15,30 35,32 Q25,15 45,25 Q50,10 55,25 Q75,15 65,32 Q85,30 80,45 Q65,40 50,54 Z" fill="#15803D" />
            <path d="M50,54 Q40,48 30,50 Q28,40 40,42 Q35,30 48,38 Q50,25 52,38 Q65,30 60,42 Q72,40 70,50 Q60,48 50,54 Z" fill="#22C55E" />
          </g>
        );
      case 'hypoestes':
      case 'fittonia_red':
      case 'fittonia_white':
      case 'hypoestes_polka':
        return (
          <g>
            <ellipse cx="40" cy="42" rx="12" ry="8" fill="#14532D" />
            <ellipse cx="60" cy="42" rx="12" ry="8" fill="#15803D" />
            <ellipse cx="50" cy="30" rx="14" ry="9" fill="#EF4444" />
          </g>
        );

      // --- فاز ۵: گیاهان گلدار ---
      case 'peace_lily':
      case 'spathiphyllum_peace':
      case 'anthurium_red':
      case 'anthurium_pink':
      case 'orchid_phalaenopsis':
      case 'african_violet':
      case 'gloxinia_velvet':
      case 'cyclamen_persicum':
      case 'azalea_bloom':
      case 'campanula_bell':
      case 'begonia_rex':
      case 'begonia_maculata':
      case 'begonia_wax':
      case 'kalanchoe':
      case 'kalanchoe_bloom':
      case 'coleus_colorful':
      case 'geranium_zonal':
      case 'geranium_ivy':
      case 'geranium_scented':
      case 'fuchsia_hanging':
      case 'jasmine_star':
      case 'gardenia_bloom':
        return (
          <g>
            <path d="M50,54 C35,48 18,35 25,20 C30,10 45,15 50,30 C55,15 70,10 75,20 C82,35 65,48 50,54 Z" fill="#15803D" />
            <circle
              cx="42"
              cy="28"
              r="7"
              fill={shape === 'spathiphyllum_peace' || shape === 'peace_lily' || shape === 'gardenia_bloom' ? '#FFFFFF' : '#F43F5E'}
            />
            <circle
              cx="58"
              cy="28"
              r="7"
              fill={shape === 'african_violet' ? '#7E22CE' : '#FB7185'}
            />
            <circle cx="50" cy="18" r="8" fill="#FFF1F2" />
          </g>
        );

      // --- فاز ۶: رزها و گیاهان تراس و فضای باز ---
      case 'rose_bush':
      case 'climbing_rose':
      case 'rose_dutch':
      case 'rose_miniature':
      case 'rose_climbing':
      case 'rose_dog_nastaran':
      case 'rose_damask':
      case 'rose_shrub':
      case 'lantana_camara':
      case 'hibiscus_chinese':
      case 'bougainvillea_paper':
      case 'jasmine_sambac':
      case 'honeysuckle_jasmine':
      case 'cestrum_night':
      case 'chrysanthemum_mum':
      case 'dahlia_bloom':
      case 'petunia_hanging':
      case 'passiflora_clock':
      case 'lonicera_vine':
      case 'euonymus_boxwood':
      case 'lavender_herb':
      case 'rosemary_herb':
        return (
          <g>
            <path d="M50,54 C38,45 20,35 25,18 C30,8 45,12 50,28 C55,12 70,8 75,18 C80,35 62,45 50,54 Z" fill="#166534" />
            <circle cx="40" cy="25" r="8.5" fill={shape === 'lavender_herb' ? '#7E22CE' : '#E11D48'} />
            <circle cx="60" cy="25" r="8.5" fill={shape === 'lavender_herb' ? '#9333EA' : '#F43F5E'} />
            <circle cx="50" cy="15" r="9.5" fill="#FDA4AF" />
          </g>
        );

      // --- فاز ۷: گیاهان رونده و آویز ---
      case 'spider_plant':
      case 'purple_heart':
      case 'tradescantia':
      case 'spider_plant_variegated':
      case 'spider_plant_green':
      case 'tradescantia_pallida':
      case 'tradescantia_zebrina':
      case 'callisia_green':
      case 'callisia_pink':
      case 'moses_in_cradle':
      case 'ivy_hedera':
      case 'cissus_grape_ivy':
      case 'hoya_carnosa':
      case 'hoya_kerrii_heart':
      case 'string_of_pearls':
      case 'string_of_hearts':
      case 'sedum_burros_tail':
      case 'swedish_ivy_plectranthus':
        return (
          <g>
            <path
              d="M50,54 C40,48 25,35 28,20 C30,12 42,15 50,30 C58,15 70,12 72,20 C75,35 60,48 50,54 Z"
              fill={shape === 'tradescantia_pallida' || shape === 'purple_heart' ? '#6B21A8' : '#15803D'}
            />
            <path d="M30,54 Q15,65 20,80" stroke="#166534" strokeWidth="2.5" fill="none" />
            <path d="M70,54 Q85,65 80,80" stroke="#15803D" strokeWidth="2.5" fill="none" />
            <circle cx="20" cy="80" r="4" fill="#22C55E" />
            <circle cx="80" cy="80" r="4" fill="#22C55E" />
            <circle cx="25" cy="70" r="3" fill="#166534" />
            <circle cx="75" cy="70" r="3" fill="#15803D" />
          </g>
        );

      // --- فاز ۸: ساکولنت‌ها ---
      case 'echeveria':
      case 'haworthia':
      case 'sedum':
      case 'aloe':
      case 'adenium':
      case 'echeveria_elegans':
      case 'echeveria_black_prince':
      case 'echeveria_perle':
      case 'aeonium_zwartkop':
      case 'aeonium_kiwi':
      case 'haworthia_fasciata':
      case 'haworthia_cooperi':
      case 'haworthia_limifolia':
      case 'crassula_ovata':
      case 'crassula_gollum':
      case 'crassula_buddha':
      case 'crassula_campfire':
      case 'portulacaria_afra':
      case 'sedum_turf':
      case 'aloe_vera':
      case 'aloe_variegata':
      case 'agave_variegated':
      case 'senecio_blue':
      case 'lithops_stone':
      case 'adenium_obesum':
      case 'haworthia_limifolia_var':
      case 'echeveria_agavoides':
      case 'crassula_muscosa':
      case 'sedum_palmeri':
        return (
          <g>
            <ellipse cx="50" cy="45" rx="15" ry="9" fill="#15803D" />
            <ellipse cx="40" cy="38" rx="10" ry="7" fill="#166534" transform="rotate(-30 40 38)" />
            <ellipse cx="60" cy="38" rx="10" ry="7" fill="#22C55E" transform="rotate(30 60 38)" />
            <ellipse cx="50" cy="30" rx="12" ry="8" fill="#4ADE80" />
          </g>
        );

      // --- فاز ۹: کاکتوس‌ها و افوربیاها ---
      case 'cactus':
      case 'opuntia':
      case 'christmas_cactus':
      case 'cactus_mammillaria_hahniana':
      case 'cactus_mammillaria_gracilis':
      case 'cactus_mammillaria_plumosa':
      case 'cactus_golden_barrel':
      case 'cactus_echinopsis':
      case 'cactus_astrophytum_star':
      case 'cactus_gymnocalycium':
      case 'cactus_moon_grafted':
      case 'cactus_opuntia_paddle':
      case 'cactus_bunny_ears':
      case 'cactus_cereus_column':
      case 'cactus_rock_monstrosus':
      case 'cactus_old_man':
      case 'cactus_foxtail_hanging':
      case 'cactus_christmas_zygocactus':
      case 'cactus_eves_needle':
      case 'euphorbia_pencil':
      case 'euphorbia_trigona':
      case 'euphorbia_coral_lactea':
      case 'euphorbia_milii_crown':
        return (
          <g>
            <ellipse cx="50" cy="38" rx="14" ry="16" fill="#15803D" />
            <path d="M36,38 L64,38" stroke="#FEF08A" strokeWidth="1" />
            <path d="M50,22 L50,54" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="50" cy="22" r="3" fill="#F43F5E" />
          </g>
        );

      // --- فاز ۱۰: گیاهان دارویی، معطر و بونسای‌ها ---
      case 'bonsai_elm':
      case 'bonsai_carmona':
      case 'bonsai_schefflera':
      case 'bonsai_podocarpus':
      case 'bonsai_maple':
      case 'herb_peppermint':
      case 'herb_basil':
      case 'herb_thyme':
      case 'herb_lemon_verbena':
      case 'citrus_calamondin':
      case 'citrus_kumquat':
      case 'citrus_lemon':
      case 'ornamental_pepper':
      case 'potted_strawberry':
        return (
          <g>
            <path d="M48,54 L47,40 C46,35 54,35 53,40 L52,54 Z" fill="#5C4033" />
            <circle cx="50" cy="26" r="16" fill={shape === 'bonsai_maple' ? '#B91C1C' : '#15803D'} />
            <circle cx="38" cy="32" r="11" fill={shape === 'bonsai_maple' ? '#991B1B' : '#166534'} />
            <circle cx="62" cy="32" r="11" fill={shape === 'bonsai_maple' ? '#DC2626' : '#22C55E'} />
          </g>
        );

      default:
        return (
          <g>
            <path d="M50,54 C40,45 25,30 30,15 C33,8 45,12 50,28 C55,12 67,8 70,15 C75,30 60,45 50,54 Z" fill="#15803D" />
          </g>
        );
    }
  };

  return (
    <svg className="w-23 h-23 drop-shadow-xs" viewBox="0 0 100 90" fill="none">
      {/* ۱. رندر گلدان سه‌بعدی و بافت سطحی از فاز ۱۱ */}
      <PotVectorGraphic shape={effectivePotShape} color={potColor} />
      {/* ۲. رندر شاخ‌وبرگ گیاه از فاز ۱۲ */}
      {renderPlantFoliage()}
    </svg>
  );
};