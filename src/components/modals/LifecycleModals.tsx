import React, { useState, useEffect } from 'react';
import {
  type PlantEntity,
  type PlantClinicItem,
  type GardenEntity,
  type PotShapeType,
  type PotColorType,
  formatPersianDate
} from '../../data/initialPlants';
import { CareCalculator } from '../../engine/careCalculator';
import {
  PlantStylizedIllustration,
  PotVectorGraphic,
  IconAddSprout,
  POT_MODELS_CATALOG,
  POT_COLOR_PALETTE
} from '../icons/CustomIcons';
import {
  generateSmartPlantProfile,
  searchPlantEncyclopedia,
  analyzePlantImageOptically,
  type PlantSearchSuggestion,
  type AIPlantProfileResult
} from '../../services/aiPlantService';
import { registerModalBackHandler } from '../profile/PlantProfileSheet';

const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const normalizeNumericInput = (raw: string): string =>
  raw
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/,/g, '.')
    .replace(/[^0-9.]/g, '');

const parsePositiveFloat = (val: string, fallback: number): number => {
  const num = parseFloat(normalizeNumericInput(val));
  return Number.isFinite(num) && num > 0 ? num : fallback;
};

const pickText = (...vals: Array<string | undefined | null>): string => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim().length > 0) {
      return v.trim();
    }
  }
  return '';
};

// دکمه بستن برداری یکپارچه برای هدر تمام مودال‌ها
const ModalCloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="بستن مودال"
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
);

// ۱. کاتالوگ ۲۰ مدل گلدان و ۲۰ رنگ و بافت سطحی (کاملاً متقارن)
export const POT_SHAPE_OPTIONS: Array<{
  id: PotShapeType;
  label: string;
  shortLabel: string;
  bestForDescription: string;
}> = Object.values(POT_MODELS_CATALOG).map((m) => ({
  id: m.id,
  label: m.nameFa,
  shortLabel: m.shortNameFa,
  bestForDescription: m.bestForDescription
}));

export const POT_COLOR_OPTIONS: Array<{
  id: PotColorType;
  label: string;
  shortLabel: string;
  hex: string;
  shadowHex: string;
  highlightHex: string;
  texture: string;
  styleNote: string;
}> = Object.values(POT_COLOR_PALETTE).map((c) => ({
  id: c.id,
  label: c.nameFa,
  shortLabel: c.shortNameFa,
  hex: c.baseHex,
  shadowHex: c.shadowHex,
  highlightHex: c.highlightHex,
  texture: c.texture,
  styleNote: c.styleNote
}));

// ۲. گروه‌بندی خالص واریته‌ها و رنگ‌های برگ در داخل یک گونه واحد
interface CultivarVariantOption {
  shape3D: string;
  shortLabel: string;
  fullName: string;
}

const CULTIVAR_FAMILY_GROUPS: Array<{
  matchKeywords: string[];
  exactShapes: string[];
  familyTitle: string;
  variants: CultivarVariantOption[];
}> = [
  {
    matchKeywords: ['آگلونما', 'اگلونما', 'aglaonema'],
    exactShapes: [
      'aglaonema_green',
      'aglaonema_silver',
      'aglaonema_snow',
      'aglaonema_dark',
      'aglaonema_red',
      'aglaonema_gold'
    ],
    familyTitle: 'رنگ برگ آگلونما',
    variants: [
      { shape3D: 'aglaonema_green', shortLabel: '🌿 سبز زمردی', fullName: 'آگلونما سبز زمردی' },
      { shape3D: 'aglaonema_silver', shortLabel: '🥈 نقره‌ای', fullName: 'آگلونما نقره‌ای' },
      { shape3D: 'aglaonema_snow', shortLabel: '❄️ برفی سفید', fullName: 'آگلونما برفی' },
      { shape3D: 'aglaonema_dark', shortLabel: '🌑 بلک (تیره)', fullName: 'آگلونما بلک' },
      { shape3D: 'aglaonema_red', shortLabel: '🌸 صورتی/سرخ', fullName: 'آگلونما صورتی' },
      { shape3D: 'aglaonema_gold', shortLabel: '✨ طلایی', fullName: 'آگلونما طلایی' }
    ]
  },
  {
    matchKeywords: ['فیکوس الاستیکا', 'فیکوس شرابی', 'فیکوس بلک', 'فیکوس سبز', 'کائوچو'],
    exactShapes: ['ficus_elastica_green', 'ficus_elastica_burgundy', 'ficus_elastica_black'],
    familyTitle: 'رنگ برگ فیکوس الاستیکا',
    variants: [
      { shape3D: 'ficus_elastica_green', shortLabel: '🌿 الاستیکا سبز', fullName: 'فیکوس الاستیکا' },
      { shape3D: 'ficus_elastica_burgundy', shortLabel: '🍷 الاستیکا شرابی', fullName: 'فیکوس شرابی' },
      { shape3D: 'ficus_elastica_black', shortLabel: '🖤 الاستیکا بلک', fullName: 'فیکوس بلک' }
    ]
  },
  {
    matchKeywords: ['سانسوریا شمشیری', 'سانسوریا سبز', 'سانسوریا مهتابی', 'سانسوریا بلک'],
    exactShapes: [
      'sansevieria_green',
      'sansevieria_sword_variegated',
      'sansevieria_moonshine',
      'sansevieria_black_gold'
    ],
    familyTitle: 'رنگ برگ سانسوریا شمشیری',
    variants: [
      { shape3D: 'sansevieria_green', shortLabel: '🌿 سبز زیلانیکا', fullName: 'سانسوریا سبز زیلانیکا' },
      { shape3D: 'sansevieria_sword_variegated', shortLabel: '✨ ابلق طلایی', fullName: 'سانسوریا شمشیری ابلق' },
      { shape3D: 'sansevieria_moonshine', shortLabel: '🌕 مهتابی نقره‌ای', fullName: 'سانسوریا مهتابی' },
      { shape3D: 'sansevieria_black_gold', shortLabel: '🖤 بلک‌گلد', fullName: 'سانسوریا بلک‌گلد' }
    ]
  },
  {
    matchKeywords: ['پتوس', 'پوتوس', 'pothos'],
    exactShapes: [
      'pothos_jade',
      'pothos_golden',
      'pothos_neon',
      'pothos_marble',
      'pothos_manjula',
      'pothos_njoy',
      'pothos_satin'
    ],
    familyTitle: 'رنگ و طرح برگ پتوس',
    variants: [
      { shape3D: 'pothos_jade', shortLabel: '🌿 سبز چرمی', fullName: 'پتوس چرمی سبز' },
      { shape3D: 'pothos_golden', shortLabel: '✨ ابلق طلایی', fullName: 'پتوس ابلق طلایی' },
      { shape3D: 'pothos_neon', shortLabel: '🍋 نئون لیمویی', fullName: 'پتوس نئون' },
      { shape3D: 'pothos_marble', shortLabel: '🤍 مرمری', fullName: 'پتوس مرمری' },
      { shape3D: 'pothos_manjula', shortLabel: '🌊 منجولا', fullName: 'پتوس منجولا' },
      { shape3D: 'pothos_njoy', shortLabel: '🐆 ببری ان‌جوی', fullName: 'پتوس ببری ان‌جوی' },
      { shape3D: 'pothos_satin', shortLabel: '🥈 نقره‌ای ساتین', fullName: 'پتوس نقره‌ای ساتین' }
    ]
  },
  {
    matchKeywords: ['زامیفولیا', 'زاموفیلیا', 'zz'],
    exactShapes: ['zz_green', 'zz_raven', 'zz_variegated'],
    familyTitle: 'رنگ برگ زامیفولیا',
    variants: [
      { shape3D: 'zz_green', shortLabel: '🌿 سبز براق', fullName: 'زامیفولیا سبز' },
      { shape3D: 'zz_raven', shortLabel: '🖤 بلک (ریون)', fullName: 'زامیفولیا بلک' },
      { shape3D: 'zz_variegated', shortLabel: '✨ ابلق طلایی', fullName: 'زامیفولیا ابلق' }
    ]
  },
  {
    matchKeywords: ['شفلرا', 'schefflera'],
    exactShapes: ['schefflera_green', 'schefflera_variegated'],
    familyTitle: 'رنگ برگ شفلرا',
    variants: [
      { shape3D: 'schefflera_green', shortLabel: '🌿 شفلرا سبز ساده', fullName: 'شفلرا سبز' },
      { shape3D: 'schefflera_variegated', shortLabel: '✨ شفلرا ابلق طلایی', fullName: 'شفلرا ابلق' }
    ]
  },
  {
    matchKeywords: ['دیفن باخیا', 'دیفن‌باخیا', 'dieffenbachia'],
    exactShapes: ['dieffenbachia_tropic', 'dieffenbachia_camilla'],
    familyTitle: 'طرح برگ دیفن‌باخیا',
    variants: [
      { shape3D: 'dieffenbachia_tropic', shortLabel: '🌿 ابلق خال‌دار', fullName: 'دیفن‌باخیا ابلق' },
      { shape3D: 'dieffenbachia_camilla', shortLabel: '🤍 کاملیا (متن کرم)', fullName: 'دیفن‌باخیا کاملیا' }
    ]
  },
  {
    matchKeywords: ['مانسترا دلیسیوزا', 'مانسترا ابلق', 'برگ انجیری', 'برگ‌انجیری'],
    exactShapes: ['monstera_deliciosa', 'monstera_thai'],
    familyTitle: 'طرح برگ مانسترا (برگ‌انجیری)',
    variants: [
      { shape3D: 'monstera_deliciosa', shortLabel: '🌿 برگ‌انجیری سبز', fullName: 'مانسترا دلیسیوزا' },
      { shape3D: 'monstera_thai', shortLabel: '✨ برگ‌انجیری ابلق', fullName: 'مانسترا ابلق تای‌کانستلیشن' }
    ]
  },
  {
    matchKeywords: ['فیلودندرون اسکاندنس', 'فیلودندرون برزیل', 'فیلودندرون میکانز', 'پتوس قلبی'],
    exactShapes: ['philo_scandens', 'philo_brasil', 'philo_micans'],
    familyTitle: 'رنگ برگ فیلودندرون قلبی',
    variants: [
      { shape3D: 'philo_scandens', shortLabel: '💚 اسکاندنس سبز', fullName: 'فیلودندرون اسکاندنس' },
      { shape3D: 'philo_brasil', shortLabel: '🇧🇷 برزیل دورنگ', fullName: 'فیلودندرون برزیل' },
      { shape3D: 'philo_micans', shortLabel: '🤎 میکانز مخملی', fullName: 'فیلودندرون میکانز مخملی' }
    ]
  },
  {
    matchKeywords: ['سینگونیوم', 'گوش گرگی', 'syngonium'],
    exactShapes: ['syngonium_green', 'syngonium_pink', 'syngonium_albo'],
    familyTitle: 'رنگ برگ سینگونیوم',
    variants: [
      { shape3D: 'syngonium_green', shortLabel: '🌿 سبز-نقره‌ای', fullName: 'سینگونیوم سبز' },
      { shape3D: 'syngonium_pink', shortLabel: '🌸 صورتی نئون', fullName: 'سینگونیوم صورتی' },
      { shape3D: 'syngonium_albo', shortLabel: '❄️ ابلق سفید', fullName: 'سینگونیوم ابلق' }
    ]
  },
  {
    matchKeywords: ['پپرومیا برگ قاشقی', 'پپرومیا برگ‌قاشقی', 'قاشقی'],
    exactShapes: ['peperomia_obtusifolia_green', 'peperomia_obtusifolia_variegated'],
    familyTitle: 'رنگ برگ پپرومیا قاشقی',
    variants: [
      { shape3D: 'peperomia_obtusifolia_green', shortLabel: '🌿 قاشقی سبز', fullName: 'پپرومیا برگ‌قاشقی سبز' },
      { shape3D: 'peperomia_obtusifolia_variegated', shortLabel: '✨ قاشقی ابلق', fullName: 'پپرومیا برگ‌قاشقی ابلق' }
    ]
  },
  {
    matchKeywords: ['گندمی', 'عنکبوتی', 'spider plant'],
    exactShapes: ['spider_plant_variegated', 'spider_plant_green'],
    familyTitle: 'طرح برگ گندمی',
    variants: [
      { shape3D: 'spider_plant_variegated', shortLabel: '✨ گندمی ابلق', fullName: 'گندمی ابلق' },
      { shape3D: 'spider_plant_green', shortLabel: '🌿 گندمی سبز ساده', fullName: 'گندمی سبز' }
    ]
  },
  {
    matchKeywords: ['فیتونیا', 'پوست ماری', 'پوست‌ماری', 'fittonia'],
    exactShapes: ['fittonia_red', 'fittonia_white'],
    familyTitle: 'رنگ رگبرگ فیتونیا',
    variants: [
      { shape3D: 'fittonia_red', shortLabel: '❤️ رگبرگ قرمز/صورتی', fullName: 'فیتونیا پوست‌ماری قرمز' },
      { shape3D: 'fittonia_white', shortLabel: '🤍 رگبرگ سفید', fullName: 'فیتونیا پوست‌ماری سفید' }
    ]
  }
];

const findMatchingCultivarGroup = (rawName: string, currentShape: string) => {
  if (currentShape === 'empty_pot_sprout') return null;
  const q = rawName.trim().toLowerCase();
  return (
    CULTIVAR_FAMILY_GROUPS.find(
      (grp) =>
        grp.exactShapes.includes(currentShape) ||
        (q.length >= 3 && grp.matchKeywords.some((kw) => q.includes(kw)))
    ) || null
  );
};

export const ALL_2D_SHAPES: Array<{ id: string; label: string }> = [
  { id: 'aglaonema_green', label: 'آگلونما سبز زمردی' },
  { id: 'aglaonema_silver', label: 'آگلونما نقره‌ای' },
  { id: 'aglaonema_snow', label: 'آگلونما برفی' },
  { id: 'aglaonema_dark', label: 'آگلونما بلک' },
  { id: 'aglaonema_red', label: 'آگلونما صورتی' },
  { id: 'aglaonema_gold', label: 'آگلونما طلایی' },
  { id: 'sansevieria_green', label: 'سانسوریا سبز ساده' },
  { id: 'sansevieria_sword_variegated', label: 'سانسوریا شمشیری ابلق' },
  { id: 'sansevieria_moonshine', label: 'سانسوریا مهتابی' },
  { id: 'sansevieria_black_gold', label: 'سانسوریا بلک‌گلد' },
  { id: 'sansevieria_hahnii', label: 'سانسوریا کراواتی' },
  { id: 'sansevieria_cylindrica', label: 'سانسوریا لوله‌ای' },
  { id: 'pothos_golden', label: 'پتوس ابلق طلایی' },
  { id: 'pothos_jade', label: 'پتوس چرمی سبز' },
  { id: 'pothos_neon', label: 'پتوس نئون لیمویی' },
  { id: 'pothos_marble', label: 'پتوس مرمری' },
  { id: 'pothos_manjula', label: 'پتوس منجولا' },
  { id: 'pothos_satin', label: 'پتوس نقره‌ای ساتین' },
  { id: 'monstera_deliciosa', label: 'مانسترا برگ‌انجیری' },
  { id: 'monstera_thai', label: 'مانسترا ابلق' },
  { id: 'monstera_adansonii', label: 'پتوس حصیری' },
  { id: 'zz_green', label: 'زامیفولیا سبز' },
  { id: 'zz_raven', label: 'زامیفولیا بلک' },
  { id: 'zz_variegated', label: 'زامیفولیا ابلق' },
  { id: 'ficus_elastica_green', label: 'فیکوس الاستیکا سبز' },
  { id: 'ficus_elastica_burgundy', label: 'فیکوس شرابی' },
  { id: 'ficus_elastica_black', label: 'فیکوس بلک' },
  { id: 'ficus_lyrata', label: 'فیکوس لیراتا' },
  { id: 'ficus_benjamina', label: 'فیکوس بنجامین' },
  { id: 'ficus_ginseng', label: 'فیکوس جینسینگ' },
  { id: 'schefflera_green', label: 'شفلرا سبز' },
  { id: 'schefflera_variegated', label: 'شفلرا ابلق' },
  { id: 'dieffenbachia_tropic', label: 'دیفن‌باخیا ابلق' },
  { id: 'dieffenbachia_camilla', label: 'دیفن‌باخیا کاملیا' },
  { id: 'aspidistra_cast_iron', label: 'برگ عبایی' },
  { id: 'dracaena_compacta', label: 'دراسنا کامپکت' },
  { id: 'dracaena_marginata', label: 'دراسنا پرچمی' },
  { id: 'dracaena_massangeana', label: 'دراسنا بلالی' },
  { id: 'dracaena_lemon_lime', label: 'دراسنا لیمویی' },
  { id: 'cordyline_red', label: 'کوردیلین قرمز' },
  { id: 'lucky_bamboo', label: 'لاکی بامبو' },
  { id: 'yucca_cane', label: 'یوکا آپارتمانی' },
  { id: 'palm_chamaedorea', label: 'نخل شامادورا' },
  { id: 'palm_areca', label: 'نخل اریکا' },
  { id: 'palm_kentia', label: 'نخل کنتیا' },
  { id: 'palm_cyperus', label: 'نخل مرداب' },
  { id: 'palm_madagascar', label: 'نخل ماداگاسکار' },
  { id: 'palm_fan', label: 'نخل بادبزنی' },
  { id: 'palm_rhapis', label: 'نخل راپیس' },
  { id: 'cycas_revoluta', label: 'سیکاس' },
  { id: 'ponytail_linda', label: 'لیندا پافیلی' },
  { id: 'pine_norfolk', label: 'کاج مطبق' },
  { id: 'pine_nana', label: 'کاج نانا' },
  { id: 'cypress_goldcrest', label: 'سرو طلایی لاوسون' },
  { id: 'calathea_ornata', label: 'کالاتیا اورانتا' },
  { id: 'calathea_zebrina', label: 'کالاتیا گورخری' },
  { id: 'calathea_medallion', label: 'کالاتیا مدالیون' },
  { id: 'calathea_lancifolia', label: 'کالاتیا برگ‌مار' },
  { id: 'peperomia_obtusifolia_variegated', label: 'پپرومیا برگ‌قاشقی' },
  { id: 'peperomia_watermelon', label: 'پپرومیا هندوانه‌ای' },
  { id: 'peperomia_caperata', label: 'پپرومیا چروک' },
  { id: 'fern_boston', label: 'سرخس بوستون' },
  { id: 'fern_staghorn', label: 'سرخس شاخ‌گوزنی' },
  { id: 'fern_maidenhair', label: 'سرخس پرسیاوشان' },
  { id: 'fittonia_red', label: 'فیتونیا پوست‌ماری' },
  { id: 'hypoestes_polka', label: 'برگ‌خونین' },
  { id: 'spathiphyllum_peace', label: 'اسپاتی‌فیلوم' },
  { id: 'anthurium_red', label: 'آنتوریوم' },
  { id: 'orchid_phalaenopsis', label: 'ارکیده فالانوپسیس' },
  { id: 'african_violet', label: 'بنفشه آفریقایی' },
  { id: 'cyclamen_persicum', label: 'سیکلامن' },
  { id: 'begonia_maculata', label: 'بگونیا بال‌فرشته' },
  { id: 'begonia_rex', label: 'بگونیا رکس' },
  { id: 'coleus_colorful', label: 'حسن یوسف' },
  { id: 'geranium_zonal', label: 'شمعدانی' },
  { id: 'rose_dutch', label: 'گل رز هلندی' },
  { id: 'rose_miniature', label: 'گل رز مینیاتوری' },
  { id: 'rose_climbing', label: 'گل رز رونده' },
  { id: 'rose_dog_nastaran', label: 'گل نسترن' },
  { id: 'lavender_herb', label: 'اسطوخودوس' },
  { id: 'rosemary_herb', label: 'رزماری' },
  { id: 'spider_plant_variegated', label: 'گندمی ابلق' },
  { id: 'tradescantia_pallida', label: 'برگ‌بیدی بنفش' },
  { id: 'moses_in_cradle', label: 'موسی در گهواره' },
  { id: 'hoya_kerrii_heart', label: 'هویا قلبی' },
  { id: 'string_of_pearls', label: 'رشته مروارید' },
  { id: 'string_of_hearts', label: 'رشته دل' },
  { id: 'sedum_burros_tail', label: 'سدوم دم‌موشی' },
  { id: 'echeveria_elegans', label: 'ساکولنت اچوریا' },
  { id: 'aeonium_zwartkop', label: 'آئونیوم بنفش' },
  { id: 'haworthia_fasciata', label: 'هاورتیا گورخری' },
  { id: 'haworthia_cooperi', label: 'هاورتیا شیشه‌ای' },
  { id: 'crassula_ovata', label: 'کراسولا خرفه‌ای' },
  { id: 'crassula_gollum', label: 'کراسولا گولوم' },
  { id: 'crassula_buddha', label: 'معبد بودا' },
  { id: 'lithops_stone', label: 'لیتوپس (سنگ زنده)' },
  { id: 'adenium_obesum', label: 'آدنیوم (رز کویری)' },
  { id: 'aloe_vera', label: 'آلوئه‌ورا' },
  { id: 'cactus_mammillaria_hahniana', label: 'کاکتوس مامیلاریا' },
  { id: 'cactus_golden_barrel', label: 'کاکتوس توپ طلایی' },
  { id: 'cactus_astrophytum_star', label: 'کاکتوس آستروفیتوم' },
  { id: 'cactus_moon_grafted', label: 'کاکتوس پیوندی رنگی' },
  { id: 'cactus_opuntia_paddle', label: 'کاکتوس اپونتیا راکتی' },
  { id: 'cactus_old_man', label: 'کاکتوس پیرمرد' },
  { id: 'cactus_christmas_zygocactus', label: 'کاکتوس کریسمس' },
  { id: 'euphorbia_trigona', label: 'افوربیا ستونی' },
  { id: 'euphorbia_coral_lactea', label: 'افوربیا مرجان پیوندی' },
  { id: 'citrus_kumquat', label: 'کامکوات / مرکبات' },
  { id: 'ornamental_pepper', label: 'فلفل زینتی' },
  { id: 'combo_trough', label: 'دیش‌گاردن مستطیلی ۱' },
  { id: 'combo_trough_2', label: 'دیش‌گاردن مستطیلی ۲' }
];

const LAST_WATERED_OPTIONS = [
  { value: 0, label: 'امروز (کاملاً سیراب)' },
  { value: 1, label: 'دیروز (۱ روز پیش)' },
  { value: 2, label: '۲ روز پیش' },
  { value: 3, label: '۳ روز پیش' },
  { value: 4, label: '۴ روز پیش' },
  { value: 5, label: '۵ روز پیش' },
  { value: 7, label: '۱ هفته پیش (۷ روز)' },
  { value: 10, label: '۱۰ روز پیش' },
  { value: 14, label: '۲ هفته پیش (۱۴ روز)' },
  { value: 99, label: 'الان تشنه است (نوبت فوری)' }
];

const LAST_REPOTTED_OPTIONS = [
  { value: 0, label: 'تازه تعویض شده (همین ماه)' },
  { value: 1, label: '۱ ماه پیش' },
  { value: 3, label: '۳ ماه پیش (فصل قبل)' },
  { value: 6, label: '۶ ماه پیش (نیم سال)' },
  { value: 9, label: '۹ ماه پیش' },
  { value: 12, label: '۱ سال پیش (۱۲ ماه)' },
  { value: 18, label: 'بیش از ۱.۵ سال پیش (نیاز به بررسی)' }
];

// کامپوننت مینی‌پالت ۲۰ رنگ و بافت گلدان (۱۰ ستون × ۲ ردیف کاملاً متقارن)
const PotColorSwatchGrid: React.FC<{
  selectedColor: PotColorType;
  onSelectColor: (c: PotColorType) => void;
}> = ({ selectedColor, onSelectColor }) => {
  const activeMeta = POT_COLOR_PALETTE[selectedColor] || POT_COLOR_PALETTE.white;
  const textureBadge =
    activeMeta.texture === 'porous_clay'
      ? 'بافت سفال تنفسی'
      : activeMeta.texture === 'terrazzo_speckled'
      ? 'بافت سنگ‌ریزه تراتزو'
      : activeMeta.texture === 'marble_veined'
      ? 'بافت سنگ مرمر رگه‌دار'
      : activeMeta.texture === 'wood_grain'
      ? 'بافت چوب طبیعی'
      : activeMeta.texture === 'concrete_grain'
      ? 'بافت بتن و شن'
      : activeMeta.texture === 'glossy'
      ? 'لعاب براق سرامیکی'
      : 'سرامیک مات';

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] font-bold text-[#5A655E]">
          رنگ و بافت گلدان (۲۰ طیف):
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#F6F3EC] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]">
          {activeMeta.nameFa} • <span className="text-[#2E5A44]">{textureBadge}</span>
        </span>
      </div>

      <div className="grid grid-cols-10 gap-1.5 bg-[#F6F3EC] p-2 rounded-xl border border-[#E8E2D5]">
        {POT_COLOR_OPTIONS.map((c) => {
          const isSelected = selectedColor === c.id;
          const isDark = [
            'black',
            'charcoal',
            'forest_green',
            'cobalt',
            'wood_brown',
            'terracotta',
            'copper_bronze',
            'olive'
          ].includes(c.id);

          return (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => onSelectColor(c.id)}
              className={`relative h-6 w-full rounded-lg border transition-all flex items-center justify-center active:scale-90 ${
                isSelected
                  ? 'border-[#2E5A44] ring-2 ring-[#2E5A44]/40 scale-105 z-10 shadow-xs'
                  : 'border-black/15 hover:border-[#2E5A44]/50'
              }`}
              style={{
                background: `linear-gradient(135deg, ${c.highlightHex} 0%, ${c.hex} 55%, ${c.shadowHex} 100%)`
              }}
            >
              {c.texture === 'terrazzo_speckled' && !isSelected && (
                <span className="w-1 h-1 rounded-full bg-[#C86D51] opacity-70" />
              )}
              {c.texture === 'marble_veined' && !isSelected && (
                <span className="w-2.5 h-[1px] bg-[#9CA3AF] rotate-45" />
              )}
              {isSelected && (
                <span
                  className={`text-[9.5px] font-extrabold leading-none ${
                    isDark ? 'text-white' : 'text-[#1C2822]'
                  }`}
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// کامپوننت شبکه تصویری ۲۰ مدل گلدان (۴ ستون × ۵ ردیف کاملاً متقارن)
const PotShapeVisualGrid: React.FC<{
  selectedShape: PotShapeType;
  selectedColor: PotColorType;
  onSelectShape: (s: PotShapeType) => void;
}> = ({ selectedShape, selectedColor, onSelectShape }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-[#5A655E]">
          مدل ظاهری گلدان (۲۰ مدل هندسی):
        </span>
        <span className="text-[9.5px] font-bold text-[#2E5A44]">
          {POT_MODELS_CATALOG[selectedShape]?.nameFa || 'گرد ساده کلاسیک'}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {POT_SHAPE_OPTIONS.map((opt) => {
          const isSelected = selectedShape === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectShape(opt.id)}
              className={`py-1.5 px-1 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 overflow-hidden ${
                isSelected
                  ? 'bg-[#E6F0EB] text-[#1C2822] border-[#2E5A44] ring-1 ring-[#2E5A44]/30 shadow-xs'
                  : 'bg-[#F6F3EC]/90 text-[#5A655E] border-[#E8E2D5] hover:border-[#2E5A44]/40'
              }`}
            >
              <svg viewBox="20 46 60 44" className="w-7 h-5 shrink-0">
                <PotVectorGraphic shape={opt.id} color={selectedColor} />
              </svg>
              <span
                className={`text-[8.5px] leading-tight whitespace-nowrap tracking-tight ${
                  isSelected ? 'font-extrabold text-[#2E5A44]' : 'font-bold text-[#1C2822]'
                }`}
              >
                {opt.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// ۱. مودال افزودن گیاه جدید
// ============================================================================
interface AddPlantModalProps {
  isOpen: boolean;
  gardens: GardenEntity[];
  nextIndex: number;
  onClose: () => void;
  onAdd: (newPlant: PlantEntity) => void;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  gardens,
  nextIndex,
  onClose,
  onAdd
}) => {
  const defaultGardenId = gardens[0] ? gardens[0].id : 'window';
  const [name, setName] = useState('');
  const [garden, setGarden] = useState(defaultGardenId);
  const [potColor, setPotColor] = useState<PotColorType>('white');
  const [potShape, setPotShape] = useState<PotShapeType>('round_smooth');

  const [isComboPlanter, setIsComboPlanter] = useState(false);
  const [companionText, setCompanionText] = useState('');

  const [potVolumeStr, setPotVolumeStr] = useState<string>('2');
  const [plantHeightStr, setPlantHeightStr] = useState<string>('28');
  const [showDimensionHelper, setShowDimensionHelper] = useState(false);
  const [dimWidthStr, setDimWidthStr] = useState<string>('18');
  const [dimHeightStr, setDimHeightStr] = useState<string>('16');

  const [initialDaysSinceWater, setInitialDaysSinceWater] = useState<number>(0);
  const [initialRepotMonthsAgo, setInitialRepotMonthsAgo] = useState<number>(1);

  const [generatedProfile, setGeneratedProfile] = useState<AIPlantProfileResult | null>(null);
  const [manualShapeOverride, setManualShapeOverride] = useState<string | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState<boolean>(false);
  const [cultivarPickerOpen, setCultivarPickerOpen] = useState<boolean>(false);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [useRealPhotoOnCard, setUseRealPhotoOnCard] = useState<boolean>(false);
  const [visionCandidates, setVisionCandidates] = useState<PlantSearchSuggestion[]>([]);

  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [cycleDaysStr, setCycleDaysStr] = useState<string>('7');
  const [doseMlStr, setDoseMlStr] = useState<string>('180');

  const potVolumeLiters = parsePositiveFloat(potVolumeStr, 2.0);
  const plantHeightCm = parsePositiveFloat(plantHeightStr, 28);

  // اتصال به پشته دکمه بازگشت موبایل
  useEffect(() => {
    if (!isOpen) return;
    const unregister = registerModalBackHandler('add_plant_modal', onClose);
    return () => {
      unregister();
    };
  }, [isOpen]);

  useEffect(() => {
    if (gardens.length > 0 && !gardens.some((g) => g.id === garden)) {
      setGarden(gardens[0].id);
    }
  }, [gardens, garden]);

  const selectedGardenObj = gardens.find((g) => g.id === garden);
  const gardenLight = selectedGardenObj ? selectedGardenObj.lightLevel : 'high';

  useEffect(() => {
    if (!generatedProfile) return;
    const recalc = CareCalculator.calculateAgronomicPrescription({
      baseCycleDays: generatedProfile.waterCycleDays,
      isSucculentOrCactus: generatedProfile.isSucculentOrCactus,
      isComboPlanter,
      potVolumeLiters,
      plantHeightCm,
      potShape,
      gardenLightLevel: gardenLight
    });
    setCycleDaysStr(String(recalc.adjustedCycleDays));
    setDoseMlStr(String(recalc.doseMl));
    setGeneratedProfile((prev) =>
      prev
        ? {
            ...prev,
            doseMl: recalc.doseMl,
            doseCup: recalc.doseCup,
            waterCycleDays: recalc.adjustedCycleDays,
            mistCycleDays: recalc.mistCycleDays
          }
        : null
    );
  }, [potVolumeLiters, plantHeightCm, potShape, isComboPlanter, gardenLight]);

  if (!isOpen) return null;

  const formattedCode = `#${toPersianNum(String(nextIndex).padStart(2, '0'))}`;
  const liveSuggestions: PlantSearchSuggestion[] = searchPlantEncyclopedia(
    name,
    isComboPlanter,
    10
  );

  const handleApplyDimensionEstimate = (wRaw: string, hRaw: string) => {
    setDimWidthStr(wRaw);
    setDimHeightStr(hRaw);
    const wCm = parsePositiveFloat(wRaw, 18);
    const hCm = parsePositiveFloat(hRaw, 16);
    const estimated = CareCalculator.estimateVolumeFromDimensionsCm(wCm, hCm, potShape);
    setPotVolumeStr(String(estimated));
  };

  const triggerAutoGenerate = async (overrideName?: string, overrideImage?: string) => {
    const targetName = overrideName !== undefined ? overrideName : name;
    const targetImage =
      overrideImage !== undefined ? overrideImage : uploadedPreview ? uploadedPreview : undefined;

    if (!targetName.trim() && !companionText.trim() && !targetImage) {
      alert('لطفاً نام گیاه را بنویسید، از لیست انتخاب کنید، یا عکس گیاه را بارگذاری نمایید.');
      return;
    }

    setAiLoading(true);
    try {
      const profile = await generateSmartPlantProfile({
        rawInputName: targetName,
        potVolumeLiters,
        plantHeightCm,
        potShape: isComboPlanter ? 'trough_fluted' : potShape,
        isComboPlanter,
        companionListText: companionText,
        imageBase64: targetImage
      });
      setGeneratedProfile(profile);
      setCycleDaysStr(String(profile.waterCycleDays));
      setDoseMlStr(String(profile.doseMl));
      setManualShapeOverride(profile.shape3D);

      if (profile.visionCandidates && profile.visionCandidates.length > 0) {
        setVisionCandidates(profile.visionCandidates);
      }
      if (profile.recommendedPotColor) {
        setPotColor(profile.recommendedPotColor);
      }
      if (!targetName.trim() && profile.name) {
        setName(profile.name);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectSuggestion = (item: PlantSearchSuggestion) => {
    setName(item.name);
    setManualShapeOverride(item.shape3D);
    if (item.isCombo) {
      setIsComboPlanter(true);
      setPotShape('trough_fluted');
    } else if (item.recommendedPotShape) {
      setPotShape(item.recommendedPotShape);
    }
    if (item.recommendedPotColor) {
      setPotColor(item.recommendedPotColor);
    }
    setSearchDropdownOpen(false);
    triggerAutoGenerate(item.name);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rawBase64 = reader.result as string;
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        const compressed = ctx
          ? (ctx.drawImage(img, 0, 0, canvas.width, canvas.height),
            canvas.toDataURL('image/jpeg', 0.82))
          : rawBase64;

        setUploadedPreview(compressed);
        setUseRealPhotoOnCard(false);

        const optical = await analyzePlantImageOptically(compressed, name);
        setVisionCandidates(optical.candidates);
        if (optical.inferredPotColor) {
          setPotColor(optical.inferredPotColor);
        }
        triggerAutoGenerate(name, compressed);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateClinicItem = (
    idx: number,
    field: keyof PlantClinicItem,
    value: string
  ) => {
    if (!generatedProfile) return;
    const updatedClinic = generatedProfile.clinic.map((c, i) =>
      i === idx ? { ...c, [field]: value } : c
    );
    setGeneratedProfile({ ...generatedProfile, clinic: updatedClinic });
  };

  const handleAddClinicItem = () => {
    if (!generatedProfile) return;
    setGeneratedProfile({
      ...generatedProfile,
      clinic: [
        ...generatedProfile.clinic,
        {
          symptom: 'عارضه جدید برگ یا ریشه',
          cause: 'علت بروز عارضه',
          fix: 'راهکار درمانی و مراقبتی'
        }
      ]
    });
  };

  const handleRemoveClinicItem = (idx: number) => {
    if (!generatedProfile) return;
    setGeneratedProfile({
      ...generatedProfile,
      clinic: generatedProfile.clinic.filter((_, i) => i !== idx)
    });
  };

  const hasPlantContext = Boolean(
    manualShapeOverride ||
      generatedProfile ||
      isComboPlanter ||
      name.trim().length >= 2 ||
      uploadedPreview
  );

  const previewShape = !hasPlantContext
    ? 'empty_pot_sprout'
    : manualShapeOverride ||
      (isComboPlanter
        ? 'combo_trough'
        : generatedProfile
        ? generatedProfile.shape3D
        : name.trim().length >= 2 && liveSuggestions.length > 0
        ? liveSuggestions[0].shape3D
        : 'aglaonema_green');

  const activeCultivarGroup = findMatchingCultivarGroup(
    pickText(name, generatedProfile?.name),
    previewShape
  );

  const currentShapeLabel =
    previewShape === 'empty_pot_sprout'
      ? 'در انتظار انتخاب گیاه...'
      : ALL_2D_SHAPES.find((s) => s.id === previewShape)?.label || 'انتخاب خودکار';

  const livePreviewCalc = CareCalculator.calculateAgronomicPrescription({
    baseCycleDays: generatedProfile?.waterCycleDays || 7,
    isSucculentOrCactus: CareCalculator.isSucculentSpecies(previewShape, name),
    isComboPlanter,
    potVolumeLiters,
    plantHeightCm,
    potShape,
    gardenLightLevel: gardenLight
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !companionText.trim() && !uploadedPreview) {
      alert('لطفاً ابتدا نام گیاه یا عکس آن را وارد کنید.');
      return;
    }

    let finalProfile = generatedProfile;
    if (!finalProfile) {
      setAiLoading(true);
      finalProfile = await generateSmartPlantProfile({
        rawInputName: name,
        potVolumeLiters,
        plantHeightCm,
        potShape: isComboPlanter ? 'trough_fluted' : potShape,
        isComboPlanter,
        companionListText: companionText,
        imageBase64: uploadedPreview ? uploadedPreview : undefined
      });
      setAiLoading(false);
    }

    const companionArr = companionText
      .split(/[,،+]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const finalWaterCycle = generatedProfile
      ? parsePositiveFloat(cycleDaysStr, finalProfile.waterCycleDays)
      : finalProfile.waterCycleDays;

    const finalDoseMl = generatedProfile
      ? parsePositiveFloat(doseMlStr, finalProfile.doseMl)
      : finalProfile.doseMl;

    const effectiveDaysAgo =
      initialDaysSinceWater === 99 ? finalWaterCycle : initialDaysSinceWater;
    const lastWateredTimestamp = Date.now() - effectiveDaysAgo * 86400000;
    const repotDaysAgo = initialRepotMonthsAgo * 30;

    const initialStatus =
      effectiveDaysAgo >= finalWaterCycle
        ? 'thirsty'
        : finalProfile.isSucculentOrCactus
        ? 'locked'
        : 'ok';

    const finalPlantName = pickText(name, finalProfile.name, 'گیاه جدید');
    const finalGardenId = pickText(garden, defaultGardenId);
    const chosenShape3D =
      manualShapeOverride || (isComboPlanter ? 'combo_trough' : finalProfile.shape3D);

    const now = new Date();
    const timeStr = `ساعت ${toPersianNum(String(now.getHours()).padStart(2, '0'))}:${toPersianNum(
      String(now.getMinutes()).padStart(2, '0')
    )}`;

    const newPlant: PlantEntity = {
      id: 'p_' + Date.now(),
      code: formattedCode,
      name: finalPlantName,
      sci: finalProfile.sci,
      family: finalProfile.family,
      origin: finalProfile.origin,
      nickname: finalProfile.nickname,
      botanyStory: finalProfile.botanyStory,
      garden: finalGardenId,
      shape3D: chosenShape3D,
      potColor,
      potVolumeLiters,
      plantHeightCm,
      potShape: isComboPlanter ? 'trough_fluted' : potShape,
      isComboPlanter,
      companionSpecies: companionArr.length > 0 ? companionArr : undefined,
      customSvgMarkup:
        useRealPhotoOnCard && uploadedPreview
          ? uploadedPreview
          : finalProfile.customSvgMarkup,
      waterCycleDays: Math.round(finalWaterCycle),
      daysSinceWater: effectiveDaysAgo,
      lastWateredAt: lastWateredTimestamp,
      waterCount: 1,
      needsRotation: false,
      doseMl: Math.round(finalDoseMl),
      doseCup: CareCalculator.formatDoseCup(Math.round(finalDoseMl)),
      mistNeed: finalProfile.mistNeed,
      mistCycleDays: finalProfile.mistCycleDays,
      daysSinceMist: 0,
      lastMistedAt: Date.now(),
      needsMistToday: false,
      fertDue: false,
      statusType: initialStatus,
      light: finalProfile.light,
      soilFert: finalProfile.soilFert,
      pruningGuide: finalProfile.pruningGuide,
      propagationGuide: finalProfile.propagationGuide,
      repotCycleMonths: finalProfile.repotCycleMonths,
      lastRepottedDate: formatPersianDate(repotDaysAgo),
      lastRepottedMonthsAgo: initialRepotMonthsAgo,
      cuttings: [],
      clinic: finalProfile.clinic,
      history: [
        {
          id: 'h_' + Date.now(),
          action: `ورود و ثبت اولیه گیاه در گلخانه (حجم خاک: ${toPersianNum(
            potVolumeLiters
          )} لیتر • پیمانه: ${toPersianNum(Math.round(finalDoseMl))} میلی‌لیتر)`,
          by: 'سیستم هوشمند',
          time: timeStr,
          persianDate: formatPersianDate(0)
        }
      ]
    };

    onAdd(newPlant);
    setName('');
    setCompanionText('');
    setGeneratedProfile(null);
    setManualShapeOverride(null);
    setIconPickerOpen(false);
    setCultivarPickerOpen(false);
    setUploadedPreview(null);
    setVisionCandidates([]);
    setUseRealPhotoOnCard(false);
    setShowFullEditor(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* ۱. هدر ثابت */}
        <div className="px-4 py-3 border-b border-[#E8E2D5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 flex items-center justify-center text-[#2E5A44] shrink-0">
              <IconAddSprout className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-heading text-[15px] font-extrabold text-[#1C2822] truncate">
                افزودن گیاه جدید
              </h3>
              <span className="persian-num px-2 py-0.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[#2E5A44] text-[10.5px] font-extrabold shrink-0">
                پلاک {formattedCode}
              </span>
            </div>
          </div>

          <ModalCloseButton onClick={onClose} />
        </div>

        {/* ۲. بدنه اسکرول‌شونده داخلی */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 space-y-3">
          {/* ویترین زنده گلدان و جوانه اولیه */}
          <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#E8E2D5]">
              <button
                type="button"
                onClick={() => {
                  setIsComboPlanter(false);
                  if (potShape === 'trough_fluted') setPotShape('round_smooth');
                }}
                className={`py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                  !isComboPlanter
                    ? 'font-bold bg-[#2E5A44] text-white warm-shadow'
                    : 'font-semibold text-[#5A655E]'
                }`}
              >
                🪴 گلدان تک‌گیاهی
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsComboPlanter(true);
                  setPotShape('trough_fluted');
                  setPotVolumeStr('2.5');
                  setPlantHeightStr('16');
                }}
                className={`py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                  isComboPlanter
                    ? 'font-bold bg-[#2E5A44] text-white warm-shadow'
                    : 'font-semibold text-[#5A655E]'
                }`}
              >
                🌵 گلدان ترکیبی / مستطیلی
              </button>
            </div>

            <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 flex items-center gap-3">
              <div className="w-18 h-18 rounded-xl bg-gradient-to-b from-[#F6F3EC] to-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center shrink-0 overflow-hidden">
                <PlantStylizedIllustration
                  shape={previewShape}
                  potColor={potColor}
                  potShape={isComboPlanter ? 'trough_fluted' : potShape}
                  customSvgMarkup={
                    useRealPhotoOnCard && uploadedPreview
                      ? uploadedPreview
                      : generatedProfile?.customSvgMarkup
                  }
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-heading text-[12.5px] font-bold text-[#1C2822] truncate">
                  {hasPlantContext
                    ? pickText(name, generatedProfile?.name, 'گیاه انتخاب‌شده')
                    : '🌱 گلدان آماده کاشت گیاه'}
                </div>
                <div className="persian-num flex flex-wrap items-center gap-1 text-[9.5px]">
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380] font-bold">
                    💧 {toPersianNum(generatedProfile ? doseMlStr : livePreviewCalc.doseMl)} میلی‌لیتر
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] font-bold">
                    هر {toPersianNum(generatedProfile ? cycleDaysStr : livePreviewCalc.adjustedCycleDays)} روز
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <span className="text-[9px] font-bold text-[#5A655E] truncate">
                    آیکون: <strong className="text-[#1C2822]">{currentShapeLabel}</strong>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {activeCultivarGroup && !isComboPlanter && (
                      <button
                        type="button"
                        onClick={() => {
                          setCultivarPickerOpen((prev) => !prev);
                          setIconPickerOpen(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all active:scale-95 ${
                          cultivarPickerOpen
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#FDFBF7] text-[#2E5A44] border-[#2E5A44]/30'
                        }`}
                      >
                        🎨 رنگ برگ {cultivarPickerOpen ? '▴' : '▾'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIconPickerOpen((prev) => !prev);
                        setCultivarPickerOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[9px] font-bold active:scale-95 transition-transform"
                    >
                      {iconPickerOpen ? 'بستن ▴' : 'آیکون‌ها ▾'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {iconPickerOpen && (
              <div className="bg-[#FDFBF7] border border-[#2E5A44]/30 rounded-xl p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold text-[#2E5A44]">
                  <span>🌿 انتخاب مستقیم آیکون گیاه از گالری:</span>
                  {manualShapeOverride && (
                    <button
                      type="button"
                      onClick={() => {
                        setManualShapeOverride(null);
                        setIconPickerOpen(false);
                      }}
                      className="text-[#C85A32] text-[9px]"
                    >
                      بازگشت به تشخیص خودکار ↺
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto pr-0.5">
                  {ALL_2D_SHAPES.map((sh) => {
                    const active = previewShape === sh.id;
                    return (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => {
                          setManualShapeOverride(sh.id);
                          setUseRealPhotoOnCard(false);
                          if (!name.trim()) setName(sh.label);
                          setIconPickerOpen(false);
                        }}
                        className={`p-1 rounded-lg border flex items-center gap-1 text-right transition-all ${
                          active
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-[#FDFBF7] flex items-center justify-center shrink-0 overflow-hidden">
                          <div className="transform scale-35">
                            <PlantStylizedIllustration
                              shape={sh.id}
                              potColor={potColor}
                              potShape={potShape}
                            />
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold truncate">{sh.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {cultivarPickerOpen && activeCultivarGroup && !isComboPlanter && (
              <div className="bg-[#FDFBF7] border border-[#2E5A44]/25 rounded-xl p-2 space-y-1.5">
                <div className="flex items-center justify-between text-[9.5px] font-bold text-[#2E5A44]">
                  <span>🎨 {activeCultivarGroup.familyTitle}:</span>
                  <button
                    type="button"
                    onClick={() => setCultivarPickerOpen(false)}
                    className="text-[#5A655E] text-[9px]"
                  >
                    بستن ✕
                  </button>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {activeCultivarGroup.variants.map((v) => {
                    const isSelected = previewShape === v.shape3D && !useRealPhotoOnCard;
                    return (
                      <button
                        key={v.shape3D}
                        type="button"
                        onClick={() => {
                          setManualShapeOverride(v.shape3D);
                          setName(v.fullName);
                          setUseRealPhotoOnCard(false);
                          setCultivarPickerOpen(false);
                          triggerAutoGenerate(v.fullName);
                        }}
                        className={`shrink-0 px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all whitespace-nowrap active:scale-95 ${
                          isSelected
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-xs'
                            : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                        }`}
                      >
                        {v.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* گام ۱: جستجوی زنده گیاه + تشخیص هوشمند از روی عکس */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow relative">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold text-[#1C2822]">
                ۱. نام گیاه یا تشخیص با عکس
              </span>
              <button
                type="button"
                onClick={() => setSearchDropdownOpen((prev) => !prev)}
                className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/20 text-[10px] font-bold text-[#2E5A44] flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span>🔍 بانک گونه‌ها</span>
                <span>{searchDropdownOpen ? '▴' : '▾'}</span>
              </button>
            </div>

            <div className="relative">
              <div className="flex gap-1.5">
                <div className="relative flex-1 min-w-0">
                  <input
                    value={name}
                    onFocus={() => setSearchDropdownOpen(true)}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSearchDropdownOpen(true);
                    }}
                    placeholder={
                      isComboPlanter
                        ? 'جستجو یا تایپ عنوان دیش‌گاردن...'
                        : 'جستجوی زنده (مثلاً: آگلونما سبز، سانسوریا، رز...)'
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-semibold focus:outline-none focus:border-[#2E5A44]"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => {
                        setName('');
                        setGeneratedProfile(null);
                        setManualShapeOverride(null);
                        setSearchDropdownOpen(true);
                      }}
                      className="absolute left-2.5 top-2 text-[#5A655E] text-[11px] font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <label className="px-2.5 py-2 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-bold cursor-pointer flex items-center justify-center gap-1 shrink-0 warm-shadow active:scale-95 transition-transform">
                  <span>📷</span>
                  <span>اسکن عکس</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {searchDropdownOpen && (
                <div className="mt-1.5 bg-[#FDFBF7] border-2 border-[#2E5A44]/30 rounded-2xl shadow-xl max-h-52 overflow-y-auto divide-y divide-[#E8E2D5]/70 z-30">
                  {liveSuggestions.length > 0 ? (
                    liveSuggestions.map((item) => (
                      <button
                        key={`${item.name}_${item.sci}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-2.5 py-1.5 flex items-center justify-between gap-2 hover:bg-[#E6F0EB]/50 active:bg-[#E6F0EB] transition-colors text-right"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] flex items-center justify-center shrink-0 overflow-hidden">
                            <div className="transform scale-45">
                              <PlantStylizedIllustration
                                shape={item.shape3D}
                                potColor={item.recommendedPotColor || 'white'}
                                potShape={item.recommendedPotShape || 'round_smooth'}
                              />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="font-heading text-[11.5px] font-bold text-[#1C2822] truncate">
                              {item.name}
                            </div>
                            <div className="text-[9.5px] text-[#5A655E] truncate" dir="ltr">
                              {item.sci}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 gap-0.5">
                          <span className="persian-num px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380] text-[9px] font-bold whitespace-nowrap">
                            💧 هر {toPersianNum(item.waterCycleDays)} روز
                          </span>
                          <span className="text-[8.5px] text-[#2E5A44] font-semibold whitespace-nowrap">
                            {item.isSucculentOrCactus ? '🌵 کم‌آب و مقاوم' : '🌿 آپارتمانی'}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-2.5 text-center space-y-1.5">
                      <div className="text-[10.5px] text-[#5A655E]">
                        «{name}» در لیست آماده نبود؛ با زدن دکمه زیر شناسنامه اختصاصی آن ساخته می‌شود:
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchDropdownOpen(false);
                          triggerAutoGenerate(name);
                        }}
                        className="px-3 py-1 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-bold"
                      >
                        ✨ ساخت هوشمند شناسنامه «{name}»
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {uploadedPreview && (
              <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#2E5A44]/30 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={uploadedPreview}
                      alt="preview"
                      className="w-11 h-11 rounded-lg object-cover border border-[#E8E2D5] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-[#1C2822] truncate">
                        نحوه نمایش روی کارت گلخانه:
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => setUseRealPhotoOnCard(false)}
                          className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold border transition-all ${
                            !useRealPhotoOnCard
                              ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                              : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                          }`}
                        >
                          🎨 آیکون بوتانیکال
                        </button>
                        <button
                          type="button"
                          onClick={() => setUseRealPhotoOnCard(true)}
                          className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold border transition-all ${
                            useRealPhotoOnCard
                              ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                              : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                          }`}
                        >
                          📸 قاب عکس واقعی
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedPreview(null);
                      setVisionCandidates([]);
                      setUseRealPhotoOnCard(false);
                    }}
                    className="text-[10px] text-[#C85A32] font-bold px-1.5 shrink-0"
                  >
                    حذف
                  </button>
                </div>

                {visionCandidates.length > 0 && (
                  <div className="pt-1.5 border-t border-[#E8E2D5] space-y-1.5">
                    <div className="text-[9.5px] font-bold text-[#1F6380]">
                      🔍 نزدیک‌ترین گونه‌های تشخیص‌داده‌شده از طیف برگ‌های عکس شما:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {visionCandidates.slice(0, 4).map((cand) => {
                        const isPicked = name === cand.name && previewShape === cand.shape3D;
                        return (
                          <button
                            key={cand.name}
                            type="button"
                            onClick={() => {
                              setName(cand.name);
                              setManualShapeOverride(cand.shape3D);
                              triggerAutoGenerate(cand.name, uploadedPreview);
                            }}
                            className={`p-1.5 rounded-xl border flex items-center gap-1.5 text-right transition-all active:scale-95 ${
                              isPicked
                                ? 'bg-[#E6F0EB] border-[#2E5A44] ring-1 ring-[#2E5A44]/30'
                                : 'bg-[#FDFBF7] border-[#E8E2D5]'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] flex items-center justify-center shrink-0 overflow-hidden">
                              <div className="transform scale-40">
                                <PlantStylizedIllustration
                                  shape={cand.shape3D}
                                  potColor={potColor}
                                  potShape={potShape}
                                />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] font-bold text-[#1C2822] truncate">
                                {cand.name}
                              </div>
                              <div className="text-[8.5px] text-[#2E5A44] font-semibold truncate">
                                {isPicked ? '✓ انتخاب‌شده' : 'انتخاب این گونه'}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isComboPlanter && (
              <div>
                <label className="block text-[10px] font-bold text-[#2E5A44] mb-1">
                  گونه‌های کاشته‌شده کنار هم (با + یا ویرگول جدا کنید):
                </label>
                <input
                  value={companionText}
                  onChange={(e) => setCompanionText(e.target.value)}
                  placeholder="مثلاً: کاکتوس مامیلاریا + کراسولا + آئونیوم"
                  className="w-full min-w-0 px-3 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                />
              </div>
            )}

            <div className="grid grid-cols-12 gap-1.5 items-center pt-0.5">
              <span className="col-span-4 text-[10.5px] font-bold text-[#5A655E]">
                📍 انتخاب باغچه:
              </span>
              <select
                value={garden}
                onChange={(e) => setGarden(e.target.value)}
                className="col-span-8 px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold text-[#1C2822]"
              >
                {gardens.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} (نور:{' '}
                    {g.lightLevel === 'high'
                      ? 'زیاد ☀️'
                      : g.lightLevel === 'medium'
                      ? 'متوسط ⛅'
                      : 'کم 🌥️'}
                    )
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* گام ۲: شکل (۲۰ مدل)، رنگ (۲۰ طیف) و اندازه گلدان */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-bold text-[#1C2822]">
                ۲. شکل، رنگ و اندازه گلدان
              </span>
              <button
                type="button"
                onClick={() => setShowDimensionHelper(!showDimensionHelper)}
                className="text-[10px] font-bold text-[#1F6380] bg-[#EBF4F8] px-2 py-0.5 rounded-lg"
              >
                {showDimensionHelper ? 'بستن خط‌کش وجبی ✕' : '📏 محاسبه با وجب دست'}
              </button>
            </div>

            <PotShapeVisualGrid
              selectedShape={potShape}
              selectedColor={potColor}
              onSelectShape={(s) => setPotShape(s)}
            />

            <PotColorSwatchGrid
              selectedColor={potColor}
              onSelectColor={(c) => setPotColor(c)}
            />

            <div className="bg-[#F6F3EC] px-2.5 py-1.5 rounded-xl border border-[#E8E2D5] text-[9.5px] text-[#5A655E] space-y-0.5 leading-relaxed">
              <div>
                <strong className="text-[#2E5A44]">
                  🏺 {POT_MODELS_CATALOG[potShape]?.nameFa || 'گرد ساده'}:
                </strong>{' '}
                {POT_MODELS_CATALOG[potShape]?.bestForDescription}
              </div>
              <div>
                <strong className="text-[#1F6380]">
                  🎨 {POT_COLOR_PALETTE[potColor]?.nameFa || 'سفید مات'}:
                </strong>{' '}
                {POT_COLOR_PALETTE[potColor]?.styleNote}
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1 pt-0.5">
              {[
                { label: 'مینی', liters: '0.4', height: '10' },
                { label: 'کوچک', liters: '1.2', height: '18' },
                { label: 'متوسط', liters: '2.5', height: '35' },
                { label: 'بزرگ', liters: '4.5', height: '55' },
                { label: 'سالنی', liters: '8.5', height: '90' }
              ].map((preset) => {
                const active = Math.abs(potVolumeLiters - Number(preset.liters)) < 0.35;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPotVolumeStr(preset.liters);
                      setPlantHeightStr(preset.height);
                    }}
                    className={`py-1 px-1 rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-[#1F6380] text-white border-[#1F6380] font-bold'
                        : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{preset.label}</div>
                    <div className="persian-num text-[8.5px] opacity-85">
                      {toPersianNum(preset.liters)} لیتر
                    </div>
                  </button>
                );
              })}
            </div>

            {showDimensionHelper && (
              <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#2B7A9B]/30 space-y-2">
                <div className="text-[10px] font-bold text-[#1F6380]">
                  🤚 دهانه گلدان را با وجب دست یا سانتی‌متر مشخص کنید:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('12', '11')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    نصف وجب (۱۲cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('20', '18')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    یک وجب (۲۰cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('30', '26')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    ۱.۵ وجب (۳۰cm)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#5A655E] mb-0.5">
                      قطر دهانه (سانتی‌متر)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      value={dimWidthStr}
                      onChange={(e) =>
                        handleApplyDimensionEstimate(
                          normalizeNumericInput(e.target.value),
                          dimHeightStr
                        )
                      }
                      placeholder="18"
                      className="w-full px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#5A655E] mb-0.5">
                      ارتفاع گلدان (سانتی‌متر)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      value={dimHeightStr}
                      onChange={(e) =>
                        handleApplyDimensionEstimate(
                          dimWidthStr,
                          normalizeNumericInput(e.target.value)
                        )
                      }
                      placeholder="16"
                      className="w-full px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  حجم خاک گلدان (لیتر)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  dir="ltr"
                  value={potVolumeStr}
                  onChange={(e) => setPotVolumeStr(normalizeNumericInput(e.target.value))}
                  placeholder="مثلاً 2.0"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold text-center focus:outline-none focus:border-[#2E5A44]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  قد گیاه (سانتی‌متر)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={plantHeightStr}
                  onChange={(e) => setPlantHeightStr(normalizeNumericInput(e.target.value))}
                  placeholder="مثلاً 28"
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold text-center focus:outline-none focus:border-[#2E5A44]"
                />
              </div>
            </div>
          </div>

          {/* گام ۳: وضعیت آخرین آبیاری و آخرین تعویض خاک */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2 warm-shadow">
            <span className="block text-[11.5px] font-bold text-[#1C2822]">
              ۳. وضعیت فعلی آبیاری و خاک
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                  💧 آخرین نوبت آبیاری:
                </label>
                <select
                  value={initialDaysSinceWater}
                  onChange={(e) => setInitialDaysSinceWater(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold text-[#1C2822]"
                >
                  {LAST_WATERED_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                  🌱 آخرین تعویض خاک:
                </label>
                <select
                  value={initialRepotMonthsAgo}
                  onChange={(e) => setInitialRepotMonthsAgo(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold text-[#1C2822]"
                >
                  {LAST_REPOTTED_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAutoGenerate()}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#EBF4F8] border border-[#2B7A9B]/30 text-[#1F6380] text-[11.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <span>✨</span>
            <span>
              {aiLoading
                ? 'در حال استخراج هوشمند شناسنامه و کلینیک گیاه‌پزشکی...'
                : generatedProfile
                ? 'بازتولید هوشمند شناسنامه و کلینیک'
                : 'تولید پیش‌نمایش شناسنامه جامع و کلینیک (اختیاری)'}
            </span>
          </button>

          {generatedProfile && (
            <div className="bg-[#F6F3EC] border border-[#2E5A44]/30 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#2E5A44] truncate">
                    ✓ شناسنامه «{pickText(name, generatedProfile.name)}» آماده شد
                  </div>
                  <div className="persian-num text-[10px] text-[#5A655E]">
                    شامل {toPersianNum(generatedProfile.clinic.length)} عارضه کلینیک و فرمول خاک
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullEditor(!showFullEditor)}
                  className="px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[#1C2822] text-[10px] font-bold shrink-0"
                >
                  {showFullEditor ? 'بستن جزئیات ▴' : 'ویرایش جزئیات ▾'}
                </button>
              </div>

              {showFullEditor && (
                <div className="space-y-2.5 pt-2 border-t border-[#E8E2D5]">
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block text-[9.5px] font-bold text-[#5A655E]">
                        دوره آبیاری (روز)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={cycleDaysStr}
                        onChange={(e) => setCycleDaysStr(normalizeNumericInput(e.target.value))}
                        className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-[#5A655E]">
                        پیمانه (میلی‌لیتر)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        dir="ltr"
                        value={doseMlStr}
                        onChange={(e) => {
                          const raw = normalizeNumericInput(e.target.value);
                          setDoseMlStr(raw);
                          const ml = parsePositiveFloat(raw, 150);
                          setGeneratedProfile({
                            ...generatedProfile,
                            doseMl: ml,
                            doseCup: CareCalculator.formatDoseCup(ml)
                          });
                        }}
                        className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-bold text-[#5A655E]">
                        معادل لیوانی
                      </label>
                      <input
                        value={generatedProfile.doseCup}
                        onChange={(e) =>
                          setGeneratedProfile({ ...generatedProfile, doseCup: e.target.value })
                        }
                        className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10px] font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                      هویت و داستان گیاه‌شناسی:
                    </label>
                    <textarea
                      rows={2}
                      value={generatedProfile.botanyStory}
                      onChange={(e) =>
                        setGeneratedProfile({ ...generatedProfile, botanyStory: e.target.value })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-bold text-[#1C2822]">
                        🩺 کلینیک عارضه‌یابی ({toPersianNum(generatedProfile.clinic.length)} مورد):
                      </span>
                      <button
                        type="button"
                        onClick={handleAddClinicItem}
                        className="px-2 py-0.5 rounded-lg bg-[#2E5A44] text-white text-[9.5px] font-bold"
                      >
                        + عارضه جدید
                      </button>
                    </div>

                    {generatedProfile.clinic.map((cItem, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <input
                            value={cItem.symptom}
                            onChange={(e) =>
                              handleUpdateClinicItem(idx, 'symptom', e.target.value)
                            }
                            placeholder="عنوان علامت..."
                            className="flex-1 px-2 py-1 rounded-md bg-[#F6F3EC] text-[10px] font-bold text-[#C85A32]"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveClinicItem(idx)}
                            className="px-1.5 py-0.5 text-[10px] text-[#C85A32] font-bold"
                          >
                            ✕
                          </button>
                        </div>
                        <input
                          value={cItem.cause}
                          onChange={(e) => handleUpdateClinicItem(idx, 'cause', e.target.value)}
                          placeholder="علت علمی..."
                          className="w-full px-2 py-1 rounded-md bg-[#F6F3EC] text-[9.5px]"
                        />
                        <input
                          value={cItem.fix}
                          onChange={(e) => handleUpdateClinicItem(idx, 'fix', e.target.value)}
                          placeholder="نسخه درمانی..."
                          className="w-full px-2 py-1 rounded-md bg-[#F6F3EC] text-[9.5px] text-[#2E5A44] font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ۳. فوتر ثابت */}
        <div className="px-4 py-3 border-t border-[#E8E2D5] bg-[#FDFBF7] flex items-center gap-2 shrink-0">
          <button
            type="submit"
            disabled={aiLoading}
            className="flex-1 py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[12.5px] warm-shadow active:scale-[0.99] transition-transform disabled:opacity-60"
          >
            {aiLoading
              ? '⏳ در حال ثبت...'
              : `ثبت در گلخانه (${formattedCode}) ✓`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold text-[12px]"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// ۲. مودال ویرایش کامل گلدان و گیاه (مجهز به تمام امکانات مودال افزودن + پشته Back)
// ============================================================================
interface EditPlantModalProps {
  plant: PlantEntity | null;
  gardens: GardenEntity[];
  onClose: () => void;
  onSave: (updatedPlant: PlantEntity) => void;
}

export const EditPlantModal: React.FC<EditPlantModalProps> = ({
  plant,
  gardens,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [sci, setSci] = useState('');
  const [nickname, setNickname] = useState('');
  const [botanyStory, setBotanyStory] = useState('');
  const [light, setLight] = useState('');
  const [soilFert, setSoilFert] = useState('');
  const [pruningGuide, setPruningGuide] = useState('');
  const [propagationGuide, setPropagationGuide] = useState('');
  const [garden, setGarden] = useState('');
  const [shape3D, setShape3D] = useState('aglaonema_green');
  const [potColor, setPotColor] = useState<PotColorType>('white');
  const [potShape, setPotShape] = useState<PotShapeType>('round_smooth');
  const [isComboPlanter, setIsComboPlanter] = useState(false);

  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [cultivarPickerOpen, setCultivarPickerOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [showDimensionHelper, setShowDimensionHelper] = useState(false);
  const [dimWidthStr, setDimWidthStr] = useState<string>('18');
  const [dimHeightStr, setDimHeightStr] = useState<string>('16');

  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [useRealPhotoOnCard, setUseRealPhotoOnCard] = useState<boolean>(false);

  const [potVolumeStr, setPotVolumeStr] = useState<string>('2');
  const [plantHeightStr, setPlantHeightStr] = useState<string>('28');
  const [waterCycleStr, setWaterCycleStr] = useState<string>('7');
  const [doseMlStr, setDoseMlStr] = useState<string>('150');

  const [doseCup, setDoseCup] = useState('۱ لیوان');
  const [mistNeed, setMistNeed] = useState('');
  const [daysSinceWater, setDaysSinceWater] = useState<number>(0);
  const [lastRepottedMonthsAgo, setLastRepottedMonthsAgo] = useState<number>(3);
  const [companionText, setCompanionText] = useState('');
  const [clinicItems, setClinicItems] = useState<PlantClinicItem[]>([]);
  const [showClinicEditor, setShowClinicEditor] = useState(false);

  // اتصال به پشته دکمه بازگشت موبایل (تا زدن دکمه Back فقط مودال ویرایش را ببندد و به پروفایل برگردد)
  useEffect(() => {
    if (!plant) return;
    const unregister = registerModalBackHandler(`edit_${plant.id}`, onClose);
    return () => {
      unregister();
    };
  }, [plant?.id]);

  useEffect(() => {
    if (plant) {
      setName(plant.name);
      setSci(plant.sci);
      setNickname(pickText(plant.nickname));
      setBotanyStory(pickText(plant.botanyStory));
      setLight(pickText(plant.light));
      setSoilFert(pickText(plant.soilFert));
      setPruningGuide(pickText(plant.pruningGuide));
      setPropagationGuide(pickText(plant.propagationGuide));
      setGarden(plant.garden);
      setShape3D(plant.shape3D);
      setPotColor(plant.potColor ? plant.potColor : 'white');
      setPotShape(plant.potShape ? plant.potShape : 'round_smooth');
      setIsComboPlanter(Boolean(plant.isComboPlanter));
      setPotVolumeStr(String(plant.potVolumeLiters ? plant.potVolumeLiters : 2.0));
      setPlantHeightStr(String(plant.plantHeightCm ? plant.plantHeightCm : 28));
      setWaterCycleStr(String(plant.waterCycleDays));
      setDoseMlStr(String(plant.doseMl));
      setDoseCup(plant.doseCup);
      setMistNeed(plant.mistNeed);
      setDaysSinceWater(CareCalculator.getElapsedDaysSinceWater(plant));
      setLastRepottedMonthsAgo(
        plant.lastRepottedMonthsAgo !== undefined ? plant.lastRepottedMonthsAgo : 3
      );
      setCompanionText(plant.companionSpecies ? plant.companionSpecies.join(' + ') : '');
      setClinicItems(plant.clinic ? plant.clinic : []);

      if (plant.customSvgMarkup && plant.customSvgMarkup.startsWith('data:image/')) {
        setUploadedPreview(plant.customSvgMarkup);
        setUseRealPhotoOnCard(true);
      } else {
        setUploadedPreview(null);
        setUseRealPhotoOnCard(false);
      }
    }
  }, [plant]);

  if (!plant) return null;

  const potVolumeLiters = parsePositiveFloat(potVolumeStr, 2.0);
  const plantHeightCm = parsePositiveFloat(plantHeightStr, 28);
  const waterCycleDays = Math.round(parsePositiveFloat(waterCycleStr, 7));
  const doseMl = Math.round(parsePositiveFloat(doseMlStr, 150));

  const editCultivarGroup = findMatchingCultivarGroup(name, shape3D);
  const currentShapeLabel =
    ALL_2D_SHAPES.find((s) => s.id === shape3D)?.label || 'آیکون اختصاصی';
  const liveSuggestions = searchPlantEncyclopedia(name, isComboPlanter, 8);

  const applySmartRecalculation = (
    newLiters: number,
    newHeight: number,
    newPotShape: PotShapeType,
    newGardenId: string,
    newShape3D: string
  ) => {
    const isSucculent = CareCalculator.isSucculentSpecies(newShape3D, name);
    const targetGarden = gardens.find((g) => g.id === newGardenId);
    const gLight = targetGarden ? targetGarden.lightLevel : 'high';
    const baseSpeciesCycle = isSucculent ? 13 : 6;
    const isCombo = isComboPlanter || newShape3D.startsWith('combo_');

    const calc = CareCalculator.calculateAgronomicPrescription({
      baseCycleDays: baseSpeciesCycle,
      isSucculentOrCactus: isSucculent,
      isComboPlanter: isCombo,
      potVolumeLiters: newLiters,
      plantHeightCm: newHeight,
      potShape: newPotShape,
      gardenLightLevel: gLight
    });

    setDoseMlStr(String(calc.doseMl));
    setDoseCup(calc.doseCup);
    setWaterCycleStr(String(calc.adjustedCycleDays));
  };

  const handleApplyDimensionEstimate = (wRaw: string, hRaw: string) => {
    setDimWidthStr(wRaw);
    setDimHeightStr(hRaw);
    const wCm = parsePositiveFloat(wRaw, 18);
    const hCm = parsePositiveFloat(hRaw, 16);
    const estimated = CareCalculator.estimateVolumeFromDimensionsCm(wCm, hCm, potShape);
    setPotVolumeStr(String(estimated));
    applySmartRecalculation(estimated, plantHeightCm, potShape, garden, shape3D);
  };

  const handleSelectEditSuggestion = async (item: PlantSearchSuggestion) => {
    setName(item.name);
    setSci(item.sci);
    setShape3D(item.shape3D);
    setSearchDropdownOpen(false);

    const profile = await generateSmartPlantProfile({
      rawInputName: item.name,
      potVolumeLiters,
      plantHeightCm,
      potShape,
      isComboPlanter,
      companionListText: companionText
    });

    setNickname(profile.nickname);
    setBotanyStory(profile.botanyStory);
    setLight(profile.light);
    setSoilFert(profile.soilFert);
    setPruningGuide(profile.pruningGuide);
    setPropagationGuide(profile.propagationGuide);
    setMistNeed(profile.mistNeed);
    setClinicItems(profile.clinic);
    setWaterCycleStr(String(profile.waterCycleDays));
    setDoseMlStr(String(profile.doseMl));
    setDoseCup(profile.doseCup);
  };

  const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rawBase64 = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        const compressed = ctx
          ? (ctx.drawImage(img, 0, 0, canvas.width, canvas.height),
            canvas.toDataURL('image/jpeg', 0.82))
          : rawBase64;
        setUploadedPreview(compressed);
        setUseRealPhotoOnCard(true);
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  const handleEditClinicItem = (
    idx: number,
    field: keyof PlantClinicItem,
    val: string
  ) => {
    setClinicItems((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: val } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const companionArr = companionText
      .split(/[,،+]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const effectiveDaysAgo =
      Number(daysSinceWater) === 99 ? waterCycleDays : Number(daysSinceWater);
    const newLastWateredAt = Date.now() - effectiveDaysAgo * 86400000;
    const repotDaysAgo = Number(lastRepottedMonthsAgo) * 30;
    const isSucculent = CareCalculator.isSucculentSpecies(shape3D, name);

    const updatedStatus =
      effectiveDaysAgo >= waterCycleDays
        ? 'thirsty'
        : isSucculent
        ? 'locked'
        : 'ok';

    onSave({
      ...plant,
      name: name.trim(),
      sci: sci.trim(),
      nickname: nickname.trim(),
      botanyStory: botanyStory.trim(),
      light: light.trim(),
      soilFert: soilFert.trim(),
      pruningGuide: pruningGuide.trim() || plant.pruningGuide,
      propagationGuide: propagationGuide.trim() || plant.propagationGuide,
      garden,
      shape3D,
      potColor,
      potShape: isComboPlanter ? 'trough_fluted' : potShape,
      isComboPlanter,
      potVolumeLiters,
      plantHeightCm,
      waterCycleDays,
      daysSinceWater: effectiveDaysAgo,
      lastWateredAt: newLastWateredAt,
      doseMl,
      doseCup: doseCup.trim(),
      mistNeed: mistNeed.trim(),
      statusType: updatedStatus,
      lastRepottedMonthsAgo: Number(lastRepottedMonthsAgo),
      lastRepottedDate: formatPersianDate(repotDaysAgo),
      companionSpecies: companionArr.length > 0 ? companionArr : undefined,
      customSvgMarkup:
        useRealPhotoOnCard && uploadedPreview ? uploadedPreview : undefined,
      clinic: clinicItems
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* ۱. هدر استاندارد با فونت یکان‌بخ، پلاک متقارن و دکمه ضربدر برداری */}
        <div className="px-4 py-3 border-b border-[#E8E2D5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 flex items-center justify-center text-[#2E5A44] shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="persian-num px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10.5px] font-extrabold shrink-0">
                پلاک {plant.code}
              </span>
              <h3 className="font-heading text-[15px] font-extrabold text-[#1C2822] truncate">
                ویرایش «{plant.name}»
              </h3>
            </div>
          </div>

          <ModalCloseButton onClick={onClose} />
        </div>

        {/* ۲. بدنه اسکرول‌شونده داخلی با تمام امکانات مودال افزودن گیاه */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 space-y-3">
          {/* ویترین زنده گلدان + سوییچ تک‌گیاهی/ترکیبی */}
          <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2.5 space-y-2">
            <div className="grid grid-cols-2 gap-1 bg-[#FDFBF7] p-1 rounded-xl border border-[#E8E2D5]">
              <button
                type="button"
                onClick={() => {
                  setIsComboPlanter(false);
                  if (potShape === 'trough_fluted') setPotShape('round_smooth');
                }}
                className={`py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                  !isComboPlanter
                    ? 'font-bold bg-[#2E5A44] text-white warm-shadow'
                    : 'font-semibold text-[#5A655E]'
                }`}
              >
                🪴 گلدان تک‌گیاهی
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsComboPlanter(true);
                  setPotShape('trough_fluted');
                }}
                className={`py-1.5 rounded-lg text-[11px] transition-all whitespace-nowrap ${
                  isComboPlanter
                    ? 'font-bold bg-[#2E5A44] text-white warm-shadow'
                    : 'font-semibold text-[#5A655E]'
                }`}
              >
                🌵 گلدان ترکیبی / مستطیلی
              </button>
            </div>

            <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 flex items-center gap-3">
              <div className="w-18 h-18 rounded-xl bg-gradient-to-b from-[#F6F3EC] to-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center shrink-0 overflow-hidden">
                <PlantStylizedIllustration
                  shape={shape3D}
                  potColor={potColor}
                  potShape={isComboPlanter ? 'trough_fluted' : potShape}
                  customSvgMarkup={
                    useRealPhotoOnCard && uploadedPreview ? uploadedPreview : undefined
                  }
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-heading text-[12.5px] font-bold text-[#1C2822] truncate">
                  {name || plant.name}
                </div>
                <div className="persian-num flex flex-wrap items-center gap-1 text-[9.5px]">
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380] font-bold">
                    💧 {toPersianNum(doseMlStr)} میلی‌لیتر
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] font-bold">
                    هر {toPersianNum(waterCycleStr)} روز
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <span className="text-[9px] font-bold text-[#5A655E] truncate">
                    آیکون: <strong className="text-[#1C2822]">{currentShapeLabel}</strong>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {editCultivarGroup && !isComboPlanter && (
                      <button
                        type="button"
                        onClick={() => {
                          setCultivarPickerOpen((prev) => !prev);
                          setIconPickerOpen(false);
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all ${
                          cultivarPickerOpen
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#FDFBF7] text-[#2E5A44] border-[#2E5A44]/30'
                        }`}
                      >
                        🎨 رنگ برگ {cultivarPickerOpen ? '▴' : '▾'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIconPickerOpen((prev) => !prev);
                        setCultivarPickerOpen(false);
                      }}
                      className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[9px] font-bold"
                    >
                      {iconPickerOpen ? 'بستن ▴' : 'آیکون‌ها ▾'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {iconPickerOpen && (
              <div className="bg-[#FDFBF7] border border-[#2E5A44]/30 rounded-xl p-2 space-y-1.5">
                <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto pr-0.5">
                  {ALL_2D_SHAPES.map((sh) => {
                    const active = shape3D === sh.id;
                    return (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => {
                          setShape3D(sh.id);
                          setUseRealPhotoOnCard(false);
                          applySmartRecalculation(potVolumeLiters, plantHeightCm, potShape, garden, sh.id);
                          setIconPickerOpen(false);
                        }}
                        className={`p-1 rounded-lg border flex items-center gap-1 text-right transition-all ${
                          active
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-[#FDFBF7] flex items-center justify-center shrink-0 overflow-hidden">
                          <div className="transform scale-35">
                            <PlantStylizedIllustration
                              shape={sh.id}
                              potColor={potColor}
                              potShape={potShape}
                            />
                          </div>
                        </div>
                        <span className="text-[8.5px] font-bold truncate">{sh.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {cultivarPickerOpen && editCultivarGroup && !isComboPlanter && (
              <div className="bg-[#FDFBF7] border border-[#2E5A44]/20 rounded-xl p-2 space-y-1">
                <div className="flex items-center justify-between text-[9.5px] font-bold text-[#2E5A44]">
                  <span>🎨 {editCultivarGroup.familyTitle}:</span>
                  <button
                    type="button"
                    onClick={() => setCultivarPickerOpen(false)}
                    className="text-[#5A655E] text-[9px]"
                  >
                    بستن ✕
                  </button>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5">
                  {editCultivarGroup.variants.map((v) => {
                    const active = shape3D === v.shape3D && !useRealPhotoOnCard;
                    return (
                      <button
                        key={v.shape3D}
                        type="button"
                        onClick={() => {
                          setShape3D(v.shape3D);
                          setName(v.fullName);
                          setUseRealPhotoOnCard(false);
                          setCultivarPickerOpen(false);
                        }}
                        className={`shrink-0 px-2 py-1 rounded-lg text-[9.5px] font-bold border transition-all whitespace-nowrap ${
                          active
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                        }`}
                      >
                        {v.shortLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* گام ۱: نام گیاه، جستجوی بانک گونه‌ها، عکس و باغچه */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold text-[#1C2822]">
                ۱. نام گیاه، تصویر و باغچه
              </span>
              <button
                type="button"
                onClick={() => setSearchDropdownOpen((prev) => !prev)}
                className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/20 text-[10px] font-bold text-[#2E5A44]"
              >
                🔍 تغییر از بانک گونه‌ها {searchDropdownOpen ? '▴' : '▾'}
              </button>
            </div>

            <div className="flex gap-1.5">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold focus:outline-none focus:border-[#2E5A44]"
                placeholder="نام گیاه..."
              />
              <label className="px-2.5 py-2 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-bold cursor-pointer flex items-center justify-center gap-1 shrink-0 warm-shadow active:scale-95 transition-transform">
                <span>📷</span>
                <span>عکس</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {searchDropdownOpen && (
              <div className="bg-[#FDFBF7] border-2 border-[#2E5A44]/30 rounded-2xl shadow-lg max-h-44 overflow-y-auto divide-y divide-[#E8E2D5]/70">
                {liveSuggestions.map((item) => (
                  <button
                    key={`${item.name}_${item.sci}`}
                    type="button"
                    onClick={() => handleSelectEditSuggestion(item)}
                    className="w-full px-2.5 py-1.5 flex items-center justify-between gap-2 hover:bg-[#E6F0EB]/50 text-right"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] flex items-center justify-center shrink-0 overflow-hidden">
                        <div className="transform scale-40">
                          <PlantStylizedIllustration
                            shape={item.shape3D}
                            potColor={potColor}
                            potShape={potShape}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-[#1C2822] truncate">
                          {item.name}
                        </div>
                        <div className="text-[9px] text-[#5A655E] truncate" dir="ltr">
                          {item.sci}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-bold text-[#2E5A44] shrink-0">
                      انتخاب ✓
                    </span>
                  </button>
                ))}
              </div>
            )}

            {uploadedPreview && (
              <div className="flex items-center justify-between bg-[#F6F3EC] p-2 rounded-xl border border-[#E8E2D5] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={uploadedPreview}
                    alt="preview"
                    className="w-10 h-10 rounded-lg object-cover border border-[#E8E2D5] shrink-0"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setUseRealPhotoOnCard(false)}
                      className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold border ${
                        !useRealPhotoOnCard
                          ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                          : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                      }`}
                    >
                      🎨 آیکون بوتانیکال
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseRealPhotoOnCard(true)}
                      className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold border ${
                        useRealPhotoOnCard
                          ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                          : 'bg-[#FDFBF7] text-[#5A655E] border-[#E8E2D5]'
                      }`}
                    >
                      📸 عکس واقعی
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedPreview(null);
                    setUseRealPhotoOnCard(false);
                  }}
                  className="text-[10px] text-[#C85A32] font-bold px-1.5"
                >
                  حذف
                </button>
              </div>
            )}

            {isComboPlanter && (
              <div>
                <label className="block text-[10px] font-bold text-[#2E5A44] mb-1">
                  گونه‌های هم‌زیست در گلدان ترکیبی:
                </label>
                <input
                  value={companionText}
                  onChange={(e) => setCompanionText(e.target.value)}
                  placeholder="مثلاً: کاکتوس مامیلاریا + کراسولا + آئونیوم"
                  className="w-full px-3 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                />
              </div>
            )}

            <div className="grid grid-cols-12 gap-1.5 items-center">
              <span className="col-span-4 text-[10.5px] font-bold text-[#5A655E]">
                📍 باغچه استقرار:
              </span>
              <select
                value={garden}
                onChange={(e) => {
                  const newG = e.target.value;
                  setGarden(newG);
                  applySmartRecalculation(potVolumeLiters, plantHeightCm, potShape, newG, shape3D);
                }}
                className="col-span-8 px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold text-[#1C2822]"
              >
                {gardens.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* گام ۲: شکل (۲۰ مدل)، رنگ (۲۰ طیف)، ۵ سایز آماده و خط‌کش وجبی */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow">
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] font-bold text-[#1C2822]">
                ۲. شکل، رنگ و اندازه گلدان
              </span>
              <button
                type="button"
                onClick={() => setShowDimensionHelper(!showDimensionHelper)}
                className="text-[10px] font-bold text-[#1F6380] bg-[#EBF4F8] px-2 py-0.5 rounded-lg"
              >
                {showDimensionHelper ? 'بستن خط‌کش وجبی ✕' : '📏 محاسبه با وجب دست'}
              </button>
            </div>

            <PotShapeVisualGrid
              selectedShape={potShape}
              selectedColor={potColor}
              onSelectShape={(newPs) => {
                setPotShape(newPs);
                applySmartRecalculation(potVolumeLiters, plantHeightCm, newPs, garden, shape3D);
              }}
            />

            <PotColorSwatchGrid
              selectedColor={potColor}
              onSelectColor={(c) => setPotColor(c)}
            />

            {/* ۵ سایز آماده گلدان در ویرایشگر */}
            <div className="grid grid-cols-5 gap-1 pt-0.5">
              {[
                { label: 'مینی', liters: '0.4', height: '10' },
                { label: 'کوچک', liters: '1.2', height: '18' },
                { label: 'متوسط', liters: '2.5', height: '35' },
                { label: 'بزرگ', liters: '4.5', height: '55' },
                { label: 'سالنی', liters: '8.5', height: '90' }
              ].map((preset) => {
                const active = Math.abs(potVolumeLiters - Number(preset.liters)) < 0.35;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPotVolumeStr(preset.liters);
                      setPlantHeightStr(preset.height);
                      applySmartRecalculation(
                        Number(preset.liters),
                        Number(preset.height),
                        potShape,
                        garden,
                        shape3D
                      );
                    }}
                    className={`py-1 px-1 rounded-xl border text-center transition-all ${
                      active
                        ? 'bg-[#1F6380] text-white border-[#1F6380] font-bold'
                        : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                    }`}
                  >
                    <div className="text-[10px] font-bold">{preset.label}</div>
                    <div className="persian-num text-[8.5px] opacity-85">
                      {toPersianNum(preset.liters)} لیتر
                    </div>
                  </button>
                );
              })}
            </div>

            {showDimensionHelper && (
              <div className="bg-[#F6F3EC] p-2.5 rounded-xl border border-[#2B7A9B]/30 space-y-2">
                <div className="text-[10px] font-bold text-[#1F6380]">
                  🤚 دهانه گلدان را با وجب دست یا سانتی‌متر مشخص کنید:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('12', '11')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    نصف وجب (۱۲cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('20', '18')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    یک وجب (۲۰cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDimensionEstimate('30', '26')}
                    className="py-1.5 px-1.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[9.5px] font-bold text-[#1C2822]"
                  >
                    ۱.۵ وجب (۳۰cm)
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#5A655E] mb-0.5">
                      قطر دهانه (سانتی‌متر)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      value={dimWidthStr}
                      onChange={(e) =>
                        handleApplyDimensionEstimate(
                          normalizeNumericInput(e.target.value),
                          dimHeightStr
                        )
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-semibold text-[#5A655E] mb-0.5">
                      ارتفاع گلدان (سانتی‌متر)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      value={dimHeightStr}
                      onChange={(e) =>
                        handleApplyDimensionEstimate(
                          dimWidthStr,
                          normalizeNumericInput(e.target.value)
                        )
                      }
                      className="w-full px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  حجم خاک گلدان (لیتر)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  dir="ltr"
                  value={potVolumeStr}
                  onChange={(e) => {
                    const clean = normalizeNumericInput(e.target.value);
                    setPotVolumeStr(clean);
                    const val = parsePositiveFloat(clean, 2.0);
                    applySmartRecalculation(val, plantHeightCm, potShape, garden, shape3D);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  قد گیاه (سانتی‌متر)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={plantHeightStr}
                  onChange={(e) => {
                    const clean = normalizeNumericInput(e.target.value);
                    setPlantHeightStr(clean);
                    const val = parsePositiveFloat(clean, 28);
                    applySmartRecalculation(potVolumeLiters, val, potShape, garden, shape3D);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-[#E8E2D5]">
              <div>
                <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                  دوره آبیاری (روز)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={waterCycleStr}
                  onChange={(e) => setWaterCycleStr(normalizeNumericInput(e.target.value))}
                  className="w-full px-2 py-1 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                  پیمانه (میلی‌لیتر)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={doseMlStr}
                  onChange={(e) => {
                    const clean = normalizeNumericInput(e.target.value);
                    setDoseMlStr(clean);
                    const ml = parsePositiveFloat(clean, 150);
                    setDoseCup(CareCalculator.formatDoseCup(ml));
                  }}
                  className="w-full px-2 py-1 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                  معادل لیوانی
                </label>
                <input
                  value={doseCup}
                  onChange={(e) => setDoseCup(e.target.value)}
                  className="w-full px-2 py-1 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* گام ۳: آخرین آبیاری و تعویض خاک */}
          <div className="bg-[#FDFBF7] p-3 rounded-2xl border border-[#E8E2D5] grid grid-cols-2 gap-2 warm-shadow">
            <div>
              <label className="block text-[10px] font-bold text-[#1C2822] mb-1">
                💧 آخرین نوبت آبیاری:
              </label>
              <select
                value={daysSinceWater}
                onChange={(e) => setDaysSinceWater(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold"
              >
                {LAST_WATERED_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#1C2822] mb-1">
                🌱 آخرین تعویض خاک:
              </label>
              <select
                value={lastRepottedMonthsAgo}
                onChange={(e) => setLastRepottedMonthsAgo(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold"
              >
                {LAST_REPOTTED_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowClinicEditor(!showClinicEditor)}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] text-[11px] font-bold flex items-center justify-between"
          >
            <span>
              🩺 ویرایش شناسنامه، لقب و عارضه‌های کلینیک ({toPersianNum(clinicItems.length)} مورد)
            </span>
            <span>{showClinicEditor ? '▴ بستن' : '▾ باز کردن'}</span>
          </button>

          {showClinicEditor && (
            <div className="space-y-2.5 bg-[#F6F3EC]/70 p-2.5 rounded-2xl border border-[#E8E2D5]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                    لقب گیاه:
                  </label>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                    نام علمی (Latin):
                  </label>
                  <input
                    dir="ltr"
                    value={sci}
                    onChange={(e) => setSci(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  داستان و هویت گیاه‌شناسی:
                </label>
                <textarea
                  rows={2}
                  value={botanyStory}
                  onChange={(e) => setBotanyStory(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  نیاز نوری:
                </label>
                <input
                  value={light}
                  onChange={(e) => setLight(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  ترکیب خاک و کود:
                </label>
                <input
                  value={soilFert}
                  onChange={(e) => setSoilFert(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-bold text-[#C85A32]">عارضه‌های کلینیک:</span>
                <button
                  type="button"
                  onClick={() =>
                    setClinicItems([
                      ...clinicItems,
                      { symptom: 'عارضه جدید', cause: 'علت', fix: 'درمان' }
                    ])
                  }
                  className="px-2 py-0.5 rounded-lg bg-[#2E5A44] text-white text-[10px] font-bold"
                >
                  + افزودن عارضه
                </button>
              </div>

              {clinicItems.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1">
                    <input
                      value={c.symptom}
                      onChange={(e) => handleEditClinicItem(idx, 'symptom', e.target.value)}
                      className="flex-1 px-2 py-1 rounded-md bg-[#F6F3EC] text-[10.5px] font-bold text-[#C85A32]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setClinicItems(clinicItems.filter((_, i) => i !== idx))
                      }
                      className="text-[10px] text-[#C85A32] px-1"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    value={c.cause}
                    onChange={(e) => handleEditClinicItem(idx, 'cause', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-[#F6F3EC] text-[10px]"
                  />
                  <input
                    value={c.fix}
                    onChange={(e) => handleEditClinicItem(idx, 'fix', e.target.value)}
                    className="w-full px-2 py-1 rounded-md bg-[#F6F3EC] text-[10px] text-[#2E5A44] font-semibold"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ۳. فوتر ثابت */}
        <div className="px-4 py-3 border-t border-[#E8E2D5] bg-[#FDFBF7] flex items-center gap-2 shrink-0">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[12.5px] warm-shadow active:scale-[0.99] transition-transform"
          >
            ذخیره تغییرات ({plant.code}) ✓
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold text-[12px]"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// ۳. مودال تالار یادبود
// ============================================================================
interface MemorialModalProps {
  isOpen: boolean;
  archivedPlants: PlantEntity[];
  onClose: () => void;
  onRestore: (plantId: string) => void;
  onHardDelete: (plantId: string, plantName: string) => void;
}

export const MemorialModal: React.FC<MemorialModalProps> = ({
  isOpen,
  archivedPlants,
  onClose,
  onRestore,
  onHardDelete
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const unregister = registerModalBackHandler('memorial_modal', onClose);
    return () => {
      unregister();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-4 space-y-3.5 max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5 shrink-0">
          <div>
            <h3 className="font-heading text-[15.5px] font-extrabold text-[#1C2822]">
              🏛️ تالار یادبود و آرشیو گلخانه
            </h3>
            <p className="text-[10.5px] text-[#5A655E]">
              امکان بازگردانی به گلخانه یا حذف دائمی از سیستم
            </p>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 space-y-2.5 py-1">
          {archivedPlants.length === 0 ? (
            <div className="text-center py-8 text-[12px] text-[#5A655E] bg-[#F6F3EC]/60 rounded-2xl border border-[#E8E2D5]">
              🌿 تمام گیاهان شما در گلخانه فعال و شاداب هستند.
            </div>
          ) : (
            archivedPlants.map((plant) => {
              const reasonText = pickText(plant.archiveReason, 'منتقل شده');
              return (
                <div
                  key={plant.id}
                  className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center opacity-75 shrink-0">
                      <PlantStylizedIllustration
                        shape={plant.shape3D}
                        potColor={plant.potColor}
                        potShape={plant.potShape}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-bold text-[#1C2822] truncate">
                        {plant.name}{' '}
                        <span className="text-[10.5px] text-[#5A655E]">({plant.code})</span>
                      </div>
                      <div className="text-[10.5px] text-[#C85A32] font-medium truncate">
                        علت: {reasonText}
                      </div>
                      <div className="text-[10px] text-[#5A655E]">{plant.archiveDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRestore(plant.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2E5A44] text-white text-[10.5px] font-bold"
                    >
                      بازگردانی
                    </button>
                    <button
                      onClick={() => onHardDelete(plant.id, plant.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/25 text-[10.5px] font-bold"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ۴. مودال شناسنامه هوشمند گلدان (کارت QR با قابلیت دانلود تصویر برچسب، کپی لینک و چاپ)
// ============================================================================
interface QRCodeModalProps {
  plant: PlantEntity | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ plant, onClose }) => {
  const [qrStatusMsg, setQrStatusMsg] = useState<string | null>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);

  // اتصال به پشته دکمه بازگشت موبایل (تا زدن دکمه Back فقط کارت QR را ببندد و به پروفایل برگردد)
  useEffect(() => {
    if (!plant) return;
    const unregister = registerModalBackHandler(`qr_${plant.id}`, onClose);
    return () => {
      unregister();
    };
  }, [plant?.id]);

  if (!plant) return null;

  const spId = pickText(plant.spaceId, 'office');
  const directPlantUrl = `${window.location.origin}${window.location.pathname}?space=${spId}&plant=${plant.id}&mode=visitor`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&color=1C2822&bgcolor=FDFBF7&data=${encodeURIComponent(
    directPlantUrl
  )}`;

  // ساخت و دانلود تصویر کارت شناسنامه هوشمند به صورت PNG با HTML5 Canvas
  const handleDownloadSmartLabelImage = async () => {
    setDownloadingCard(true);
    setQrStatusMsg(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 820;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // پس‌زمینه کرم کاغذی و قاب دوجداره بوتانیکال
      ctx.fillStyle = '#F6F3EC';
      ctx.fillRect(0, 0, 640, 820);

      ctx.fillStyle = '#FDFBF7';
      ctx.strokeStyle = '#2E5A44';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(28, 28, 584, 764, 32);
      ctx.fill();
      ctx.stroke();

      // هدر سبز جنگلی بالا
      ctx.fillStyle = '#2E5A44';
      ctx.beginPath();
      ctx.roundRect(52, 52, 536, 78, 20);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 26px Tahoma, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`شناسنامه هوشمند گلخانه • پلاک ${plant.code}`, 320, 100);

      // بارگذاری تصویر کد QR
      const qrImg = new Image();
      qrImg.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        qrImg.onload = () => resolve();
        qrImg.onerror = () => reject(new Error('QR load failed'));
        qrImg.src = qrImageUrl;
      });

      // قاب دور QR
      ctx.fillStyle = '#F6F3EC';
      ctx.strokeStyle = '#E8E2D5';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(170, 160, 300, 300, 24);
      ctx.fill();
      ctx.stroke();
      ctx.drawImage(qrImg, 185, 175, 270, 270);

      // نام گیاه و نام علمی
      ctx.fillStyle = '#1C2822';
      ctx.font = 'bold 34px Tahoma, sans-serif';
      ctx.fillText(plant.name, 320, 515);

      if (plant.sci) {
        ctx.fillStyle = '#5A655E';
        ctx.font = 'italic 20px sans-serif';
        ctx.fillText(plant.sci, 320, 550);
      }

      // کادر مشخصات آبیاری و بستر
      ctx.fillStyle = '#E6F0EB';
      ctx.beginPath();
      ctx.roundRect(64, 580, 512, 115, 20);
      ctx.fill();

      ctx.fillStyle = '#2E5A44';
      ctx.font = 'bold 22px Tahoma, sans-serif';
      ctx.fillText(
        `💧 پیمانه دقیق آبیاری: ${toPersianNum(plant.doseMl)} میلی‌لیتر (${plant.doseCup})`,
        320,
        625
      );
      ctx.fillStyle = '#1F6380';
      ctx.font = 'bold 20px Tahoma, sans-serif';
      ctx.fillText(
        `📅 دوره آبیاری: هر ${toPersianNum(plant.waterCycleDays)} روز یک‌بار • حجم خاک: ${toPersianNum(
          plant.potVolumeLiters || 2
        )} لیتر`,
        320,
        668
      );

      // پانویس
      ctx.fillStyle = '#5A655E';
      ctx.font = '17px Tahoma, sans-serif';
      ctx.fillText(
        'با اسکن این کد، شناسنامه زنده و وضعیت رطوبت این گلدان باز می‌شود.',
        320,
        748
      );

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Botanica-${plant.code.replace('#', '')}-${plant.name}.png`;
      link.href = dataUrl;
      link.click();
      setQrStatusMsg('✓ تصویر شناسنامه هوشمند با کیفیت بالا دانلود شد');
    } catch {
      window.open(qrImageUrl, '_blank');
      setQrStatusMsg('✓ تصویر کد QR در تب جدید باز شد');
    } finally {
      setDownloadingCard(false);
    }
  };

  // باز کردن پنجره چاپ اختصاصی برچسب گلدان
  const handlePrintDedicatedLabel = () => {
    const printWin = window.open('', '_blank', 'width=460,height=640');
    if (!printWin) {
      window.print();
      return;
    }
    printWin.document.write(`<!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8" />
        <title>چاپ برچسب گلدان ${plant.name}</title>
        <style>
          body { font-family: Tahoma, sans-serif; background: #FDFBF7; margin: 0; padding: 24px; display: flex; justify-content: center; }
          .card { border: 3px solid #2E5A44; border-radius: 24px; padding: 20px; width: 300px; text-align: center; background: #FFFFFF; }
          .badge { background: #2E5A44; color: #FFF; padding: 6px 14px; border-radius: 10px; font-weight: bold; font-size: 14px; display: inline-block; margin-bottom: 12px; }
          img { width: 190px; height: 190px; border: 2px solid #E8E2D5; border-radius: 16px; padding: 8px; }
          h2 { margin: 12px 0 4px; color: #1C2822; font-size: 20px; }
          .sci { color: #5A655E; font-size: 12px; margin-bottom: 12px; dir: ltr; }
          .info { background: #F6F3EC; border: 1px solid #E8E2D5; border-radius: 12px; padding: 10px; font-size: 13px; font-weight: bold; color: #2E5A44; line-height: 1.8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge">پلاک ${plant.code} • گلخانه کوچک من</div>
          <br/>
          <img src="${qrImageUrl}" onload="setTimeout(() => { window.print(); window.close(); }, 300);" />
          <h2>${plant.name}</h2>
          <div class="sci">${plant.sci || ''}</div>
          <div class="info">
            💧 پیمانه آب: ${toPersianNum(plant.doseMl)} میلی‌لیتر (${plant.doseCup})<br/>
            📅 دوره آبیاری: هر ${toPersianNum(plant.waterCycleDays)} روز یک‌بار
          </div>
        </div>
      </body>
      </html>`);
    printWin.document.close();
  };

  const handleCopyVisitorLink = async () => {
    try {
      await navigator.clipboard.writeText(directPlantUrl);
      setQrStatusMsg('✓ لینک مستقیم شناسنامه گلدان کپی شد');
    } catch {
      setQrStatusMsg(directPlantUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-xs w-full p-4 text-center space-y-3 shadow-2xl overflow-hidden">
        {/* هدر متقارن با پلاک و دکمه ضربدر برداری */}
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="persian-num px-2 py-0.5 rounded-lg bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10.5px] font-extrabold">
              پلاک {plant.code}
            </span>
            <span className="font-heading text-[13.5px] font-extrabold text-[#1C2822]">
              شناسنامه هوشمند گلدان
            </span>
          </div>
          <ModalCloseButton onClick={onClose} />
        </div>

        {/* کارت ویترین QR و مشخصات آبیاری به میلی‌لیتر */}
        <div className="bg-[#F6F3EC] p-3.5 rounded-2xl border border-[#E8E2D5] flex flex-col items-center space-y-2">
          <div className="relative p-2 bg-[#FDFBF7] rounded-2xl border border-[#E8E2D5] shadow-xs">
            <img
              src={qrImageUrl}
              alt={plant.name}
              className="w-38 h-38 rounded-xl object-contain"
            />
          </div>

          <div className="space-y-0.5">
            <h4 className="font-heading text-[15px] font-extrabold text-[#1C2822]">
              {plant.name}
            </h4>
            {plant.sci && (
              <div className="text-[10px] font-semibold text-[#5A655E]" dir="ltr">
                {plant.sci}
              </div>
            )}
          </div>

          <div className="w-full bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2 space-y-1 text-[10px]">
            <div className="persian-num font-extrabold text-[#1F6380]">
              💧 پیمانه آبیاری: {toPersianNum(plant.doseMl)} میلی‌لیتر ({plant.doseCup})
            </div>
            <div className="persian-num font-bold text-[#2E5A44]">
              📅 دوره آبیاری: هر {toPersianNum(plant.waterCycleDays)} روز • خاک:{' '}
              {toPersianNum(plant.potVolumeLiters || 2)} لیتر
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-[#5A655E] leading-relaxed">
          با اسکن این کد QR توسط دوربین گوشی، نمای نمایشگاهی و شناسنامه زنده این گلدان باز می‌شود.
        </p>

        {qrStatusMsg && (
          <div className="bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] text-[10px] font-bold py-1.5 px-2.5 rounded-xl">
            {qrStatusMsg}
          </div>
        )}

        {/* دکمه‌های عملیاتی دانلود تصویر، چاپ برچسب و کپی لینک */}
        <div className="space-y-1.5 pt-0.5">
          <button
            type="button"
            disabled={downloadingCard}
            onClick={handleDownloadSmartLabelImage}
            className="w-full py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[12px] warm-shadow active:scale-98 transition-transform disabled:opacity-60"
          >
            {downloadingCard
              ? '⏳ در حال ساخت تصویر کارت...'
              : '📥 دانلود تصویر شناسنامه (PNG)'}
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={handlePrintDedicatedLabel}
              className="py-2 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] font-bold text-[10.5px] active:scale-95 transition-transform"
            >
              🖨️ چاپ برچسب گلدان
            </button>
            <button
              type="button"
              onClick={handleCopyVisitorLink}
              className="py-2 rounded-xl bg-[#EBF4F8] border border-[#2B7A9B]/25 text-[#1F6380] font-bold text-[10.5px] active:scale-95 transition-transform"
            >
              🔗 کپی لینک مستقیم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};