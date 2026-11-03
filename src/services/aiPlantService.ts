import {
  type PlantClinicItem,
  type PotShapeType,
  type PotColorType
} from '../data/initialPlants';
import {
  EXTERNAL_ENCYCLOPEDIA_PHASES,
  type PlantEncyclopediaEntry
} from '../data/encyclopediaData';
import { CareCalculator } from '../engine/careCalculator';

export interface AIPlantProfileResult {
  name: string;
  sci: string;
  family: string;
  origin: string;
  nickname: string;
  botanyStory: string;
  shape3D: string;
  recommendedPotShape?: PotShapeType;
  recommendedPotColor?: PotColorType;
  isSucculentOrCactus: boolean;
  waterCycleDays: number;
  mistCycleDays: number;
  doseMl: number;
  doseCup: string;
  mistNeed: string;
  light: string;
  soilFert: string;
  pruningGuide: string;
  propagationGuide: string;
  repotCycleMonths: number;
  clinic: PlantClinicItem[];
  customSvgMarkup?: string;
  visionConfidence?: 'ai_exact' | 'optical_match';
  visionCandidates?: PlantSearchSuggestion[];
}

export interface PlantSearchSuggestion {
  name: string;
  sci: string;
  family: string;
  nickname: string;
  shape3D: string;
  waterCycleDays: number;
  isSucculentOrCactus: boolean;
  recommendedPotShape?: PotShapeType;
  recommendedPotColor?: PotColorType;
  isCombo?: boolean;
  matchReason?: string;
}

export interface OpticalImageAnalysisResult {
  dominantFoliageClass:
    | 'emerald_green'
    | 'silver_green'
    | 'white_variegated'
    | 'gold_variegated'
    | 'dark_black'
    | 'pink_red'
    | 'purple_violet'
    | 'blue_succulent';
  inferredPotColor: PotColorType;
  extractedPalette: {
    outerHex: string;
    innerHex: string;
    veinHex: string;
  };
  candidates: PlantSearchSuggestion[];
}

const GEMINI_KEY_STORAGE = 'sina_greenhouse_gemini_key_v1';

export const getGeminiApiKey = (): string => {
  const local = localStorage.getItem(GEMINI_KEY_STORAGE);
  if (local && local.trim().length > 0) return local.trim();
  const envKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  return envKey ? envKey.trim() : '';
};

export const saveGeminiApiKey = (key: string): void => {
  localStorage.setItem(GEMINI_KEY_STORAGE, key.trim());
};

// گونه‌های مکمل (از جمله آگلونما سبز زمردی و سانسوریا سبز ساده) که مستقیم به بانک اضافه می‌شوند
const SUPPLEMENTARY_VARIETIES: PlantEncyclopediaEntry[] = [
  {
    keywords: [
      'آگلونما سبز',
      'اگلونما سبز',
      'آگلونما پاتایا',
      'آگلونما کریسپوم',
      'آگلونما مداستوم سبز',
      'آگلونما معمولی سبز',
      'aglaonema green',
      'aglaonema modestum',
      'chinese evergreen green'
    ],
    data: {
      name: 'آگلونما سبز زمردی',
      sci: 'Aglaonema modestum (Green Chinese Evergreen)',
      family: 'شیپوریان (Araceae)',
      origin: 'جنگل‌های بارانی جنوب چین، لائوس و فیلیپین',
      nickname: 'زمرد همیشه سبز • برگ‌های پهن، براق و یکدست سبز با بالاترین قدرت تصفیه هوا',
      botanyStory:
        'آگلونما سبز اصیل‌ترین گونه آگلونما در طبیعت است که برگ‌های نیزه‌ای پهن، براق و کاملاً سبز زمردی با رگبرگ‌های برجسته دارد. به دلیل پوشش ۱۰۰ درصدی کلروفیل در سطح پهنک، این گونه مقاوم‌ترین آگلونما در برابر محیط‌های کم‌نور آپارتمانی بوده و در فهرست ناسا جزو برترین تصفیه‌کنندگان فرمالدهید و بنزن هواست. دمای ایده‌آل آن ۱۸ تا ۲۸ درجه سانتی‌گراد است.',
      shape3D: 'aglaonema_green',
      recommendedPotShape: 'round_smooth',
      recommendedPotColor: 'white',
      isSucculentOrCactus: false,
      waterCycleDays: 7,
      mistNeed:
        'غبارپاشی ۲ بار در هفته با آب بدون کلر و پاک کردن سطح برگ‌های سبز با دستمال مرطوب؛ آبیاری پس از خشک شدن ۴ سانتی‌متر سطح خاک.',
      light:
        'نور غیرمستقیم ملایم تا متوسط (پنجره شمالی یا ۲ تا ۳ متری پنجره شرقی/جنوبی)؛ بسیار مقاوم به سایه است و آفتاب مستقیم برگ‌های سبز آن را زرد و سوخته می‌کند.',
      soilFert:
        '۴۰٪ پیت‌ماس + ۲۵٪ پرلیت + ۲۰٪ کوکوپیت + ۱۵٪ خاک برگ و ورمی‌کمپوست؛ کود NPK 20-20-20 به همراه کلات آهن هر ماه یک‌بار در بهار و تابستان.',
      pruningGuide:
        'برگ‌های پیر پایینی را با قیچی استریل از نزدیک ساقه ببرید و غنچه‌های گل شیپوری را در بدو ظهور حذف کنید تا انرژی گیاه صرف تولید برگ‌های درشت و سبز شود.',
      propagationGuide:
        'از طریق تقسیم پاجوش‌های ریشه‌دار در بهار یا قلمه ساقه‌های ۱۰ تا ۱۵ سانتی‌متری در آب جوشیده سردشده یا بستر پرلیت.',
      repotCycleMonths: 18,
      clinic: [
        {
          symptom: 'زرد شدن برگ‌های پایینی و نرم شدن دمبرگ',
          cause: 'آبیاری بیش از حد و خیس ماندن دائمی بستر کاشت.',
          fix: 'اجازه دهید نیمی از خاک گلدان بین دو آبیاری خشک شود و آب زیرگلدانی را تخلیه کنید.'
        },
        {
          symptom: 'قهوه‌ای و خشک شدن نوک برگ‌های سبز',
          cause: 'کلر و فلوراید آب لوله‌کشی یا خشکی هوای محیط در مجاورت شوفاژ.',
          fix: 'از آب تصفیه یا ۲۴ ساعت مانده استفاده کرده و رطوبت محیط را با غبارپاشی یا جزیره افزایش دهید.'
        },
        {
          symptom: 'لوله شدن برگ‌های جوان و باز نشدن کامل غلاف',
          cause: 'نوسان رطوبت خاک یا کمبود عناصر ریزمغذی در زمان باز شدن برگ.',
          fix: 'آبیاری را منظم کرده و اطراف برگ لوله‌شده را با آب ولرم غبارپاشی کنید.'
        },
        {
          symptom: 'کمرنگ شدن و زردی عمومی برگ‌ها در حالی که سفت هستند',
          cause: 'تابش نور شدید یا کمبود نیتروژن و آهن در خاک قدیمی.',
          fix: 'گلدان را به نیم‌سایه منتقل کرده و یک نوبت کود آهن و NPK کامل بدهید.'
        },
        {
          symptom: 'توده‌های سفید پنبه‌ای در لای غلاف برگ‌ها',
          cause: 'تجمع آفت شپشک آردآلود در درز دمبرگ‌ها.',
          fix: 'با گوش‌پاک‌کن آغشته به الکل تمیز کرده و با سم ایمیداکلوپراید سم‌پاشی کنید.'
        }
      ]
    }
  },
  {
    keywords: [
      'سانسوریا سبز',
      'سانسوریا سبز ساده',
      'سانسوریا زیلانیکا',
      'شمشیری سبز',
      'sansevieria zeylanica',
      'green snake plant'
    ],
    data: {
      name: 'سانسوریا سبز زیلانیکا',
      sci: 'Dracaena zeylanica',
      family: 'مارچوبگان (Asparagaceae)',
      origin: 'سریلانکا و مناطق گرمسیری جنوب آسیا',
      nickname: 'شمشیر زمردین • برگ‌های شمشیری بلند با خطوط موج‌دار سبز تیره و نقره‌ای بدون حاشیه زرد',
      botanyStory:
        'سانسوریا سبز (زیلانیکا) گونه اصیل و بدون حاشیه زرد سانسوریا است که برگ‌های شاقولی آن با امواج افقی سبز یشمی تیره و سبز مه‌آلود نقاشی شده‌اند. به دلیل نداشتن جهش ابلق، حتی از طریق قلمه برگ نیز دقیقاً شبیه به گیاه مادر تکثیر می‌شود و در سایه مقاومت فوق‌العاده‌ای دارد.',
      shape3D: 'sansevieria_green',
      recommendedPotShape: 'cylinder_modern',
      recommendedPotColor: 'white',
      isSucculentOrCactus: true,
      waterCycleDays: 14,
      mistNeed: 'بدون نیاز به غبارپاشی؛ آبیاری فقط پس از خشک شدن کامل عمق خاک از کنار گلدان.',
      light: 'نور غیرمستقیم کم تا زیاد؛ مقاوم‌ترین نوع سانسوریا در محیط‌های کم‌نور.',
      soilFert: '۵۰٪ خاک کاکتوس + ۳۰٪ پرلیت + ۲۰٪ کوکوپیت و ورمی‌کمپوست؛ کود NPK 10-10-10 هر ۴۵ روز در بهار و تابستان.',
      pruningGuide: 'حذف برگ‌های آسیب‌دیده از سطح خاک با تیغ ضدعفونی‌شده.',
      propagationGuide: 'تکثیر آسان هم از طریق پاجوش و هم از طریق قلمه برگ ۱۰ سانتی‌متری در پرلیت یا آب.',
      repotCycleMonths: 24,
      clinic: [
        {
          symptom: 'نرم و آبکی شدن قاعده برگ‌ها',
          cause: 'پوسیدگی ریشه و طوقه در اثر آبیاری زودهنگام.',
          fix: 'تا خشکی ۱۰۰٪ عمق خاک آبیاری نکنید و زهکش گلدان را بررسی نمایید.'
        },
        {
          symptom: 'چروکیدگی و ایجاد خطوط طولی روی برگ',
          cause: 'تشنگی شدید طولانی‌مدت.',
          fix: 'گلدان را به صورت کامل سیراب کنید.'
        },
        {
          symptom: 'خم شدن برگ‌های بلند از وسط',
          cause: 'نور بسیار کم به همراه آبیاری زیاد.',
          fix: 'نور غیرمستقیم را تقویت کرده و آبیاری را کاهش دهید.'
        },
        {
          symptom: 'لکه‌های قهوه‌ای زنگاری روی پهنک برگ',
          cause: 'بیماری قارچی ناشی از رطوبت بالا و عدم تهویه.',
          fix: 'عدم غبارپاشی و سم‌پاشی با قارچ‌کش مانکوزب.'
        },
        {
          symptom: 'خشک شدن نوک تیز برگ',
          cause: 'برخورد فیزیکی یا املاح آب.',
          fix: 'آبیاری با آب بدون کلر.'
        }
      ]
    }
  }
];

// دریافت تمام گونه‌های بانک اطلاعاتی به همراه گونه‌های مکمل
export const getAllEncyclopediaEntries = (): PlantEncyclopediaEntry[] => {
  const combined = [...SUPPLEMENTARY_VARIETIES, ...EXTERNAL_ENCYCLOPEDIA_PHASES];
  const seenNames = new Set<string>();
  return combined.filter((item) => {
    if (!item || !item.data || !item.data.name) return false;
    const key = item.data.name.trim();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
};

export const PRESET_SPECIES_SUGGESTIONS: Array<{
  label: string;
  shape3D: string;
  isCombo?: boolean;
}> = getAllEncyclopediaEntries().map((entry) => ({
  label: entry.data.name,
  shape3D: entry.data.shape3D,
  isCombo: entry.data.shape3D.startsWith('combo_')
}));

const entryToSuggestion = (
  entry: PlantEncyclopediaEntry,
  matchReason?: string
): PlantSearchSuggestion => ({
  name: entry.data.name,
  sci: entry.data.sci,
  family: entry.data.family,
  nickname: entry.data.nickname,
  shape3D: entry.data.shape3D,
  waterCycleDays: entry.data.waterCycleDays,
  isSucculentOrCactus: entry.data.isSucculentOrCactus,
  recommendedPotShape: entry.data.recommendedPotShape as PotShapeType,
  recommendedPotColor: entry.data.recommendedPotColor as PotColorType,
  isCombo: entry.data.shape3D.startsWith('combo_'),
  matchReason
});

// موتور جستجوی زنده (Autocomplete) با فیلتر دقیق نام اصلی و حذف القاب فرعی گمراه‌کننده
export const searchPlantEncyclopedia = (
  rawQuery: string,
  isComboPlanter: boolean = false,
  limit: number = 12
): PlantSearchSuggestion[] => {
  const allEntries = getAllEncyclopediaEntries();
  const q = rawQuery.trim().toLowerCase();

  if (!q) {
    return allEntries
      .filter((e) =>
        isComboPlanter
          ? e.data.shape3D.startsWith('combo_') || e.data.isSucculentOrCactus
          : true
      )
      .slice(0, limit)
      .map((e) => entryToSuggestion(e));
  }

  const scored = allEntries
    .map((entry) => {
      const nameLower = entry.data.name.toLowerCase();
      const sciLower = entry.data.sci.toLowerCase();
      let score = 0;
      let isPrimaryNameMatch = false;

      // ۱. تطابق مستقیم در نام اصلی فارسی یا نام علمی گیاه (بالاترین اولویت)
      if (nameLower === q) {
        score += 200;
        isPrimaryNameMatch = true;
      } else if (nameLower.startsWith(q)) {
        score += 150;
        isPrimaryNameMatch = true;
      } else if (nameLower.includes(q)) {
        score += 110;
        isPrimaryNameMatch = true;
      } else if (sciLower.includes(q)) {
        score += 90;
        isPrimaryNameMatch = true;
      }

      // ۲. تطابق در کلیدواژه‌های مترادف (فقط در صورتی که لقب فرعی یک جنس دیگر نباشد)
      if (!isPrimaryNameMatch) {
        const exactKw = entry.keywords.some((kw) => kw.toLowerCase() === q);
        const startKw = entry.keywords.some((kw) => kw.toLowerCase().startsWith(q));
        const incKw = entry.keywords.some((kw) => kw.toLowerCase().includes(q));

        if (exactKw) score += 85;
        else if (startKw) score += 60;
        else if (incKw) score += 35;
      }

      return { entry, score, isPrimaryNameMatch };
    })
    .filter((item) => item.score > 0);

  // اگر حداقل ۲ گیاه وجود دارند که نام اصلی‌شان حاوی عبارت جستجوشده است،
  // نتایج فرعی و کم‌امتیاز (مثل «فیکوس مینیاتوری» برای پپرومیا قاشقی) را حذف کن
  const primaryCount = scored.filter((item) => item.isPrimaryNameMatch).length;
  const filteredScored =
    primaryCount >= 2
      ? scored.filter((item) => item.isPrimaryNameMatch || item.score >= 85)
      : scored;

  return filteredScored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entryToSuggestion(entry));
};

// تبدیل RGB به Hex
const rgbToHex = (r: number, g: number, b: number): string =>
  '#' +
  [r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
    .join('');

// ============================================================================
// ۱. اسکنر طیف‌سنج نوری روی دستگاه (تحلیل پیکسل‌های برگ و گلدان از روی عکس واقعی)
// ============================================================================
export const analyzePlantImageOptically = async (
  imageBase64: string,
  hintQuery: string = ''
): Promise<OpticalImageAnalysisResult> => {
  const allEntries = getAllEncyclopediaEntries();

  return new Promise((resolve) => {
    const defaultResult = (): OpticalImageAnalysisResult => ({
      dominantFoliageClass: 'emerald_green',
      inferredPotColor: 'white',
      extractedPalette: {
        outerHex: '#15803D',
        innerHex: '#22C55E',
        veinHex: '#86EFAC'
      },
      candidates: allEntries.slice(0, 4).map((e) => entryToSuggestion(e, 'پیشنهاد جایگزین'))
    });

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(defaultResult());
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let emeraldGreen = 0;
        let silverGreyGreen = 0;
        let whiteCreamVar = 0;
        let yellowGoldVar = 0;
        let darkBlackGreen = 0;
        let pinkRed = 0;
        let purpleViolet = 0;
        let blueSucculent = 0;
        let foliagePixels = 0;

        let sumLeafR = 0,
          sumLeafG = 0,
          sumLeafB = 0,
          leafSampleCount = 0;

        let sumPotR = 0,
          sumPotG = 0,
          sumPotB = 0,
          potSampleCount = 0;

        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            // تمرکز روی ستون میانی تصویر (حذف حاشیه‌های پرت پس‌زمینه اتاق)
            if (x < 8 || x > 56) continue;
            const idx = (y * size + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // تحلیل ۳۰٪ پایینی تصویر برای تشخیص رنگ گلدان
            if (y >= 46 && x >= 18 && x <= 46) {
              sumPotR += r;
              sumPotG += g;
              sumPotB += b;
              potSampleCount++;
              continue;
            }

            // تحلیل ۷۰٪ بالایی تصویر برای تشخیص طیف برگ و گل
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const sat = max === 0 ? 0 : (max - min) / max;

            // نادیده گرفتن دیوار سفید یا پس‌زمینه بسیار روشن/تیره مطلق
            if (r > 235 && g > 235 && b > 235) continue;
            if (r < 18 && g < 18 && b < 18) continue;

            // ۱. بنفش و ارغوانی
            if (r > 65 && b > 70 && g < r * 0.85 && Math.abs(r - b) < 65) {
              purpleViolet++;
              foliagePixels++;
            }
            // ۲. صورتی، سرخابی و قرمز (آگلونما صورتی، رز، برگ‌خونین، کالانکوئه)
            else if (r > 145 && g < 115 && b < 135 && r - g > 40) {
              pinkRed++;
              foliagePixels++;
            }
            // ۳. طیف‌های سبز و ابلق گیاهی
            else if (g >= r - 10 && g >= b - 5) {
              foliagePixels++;
              sumLeafR += r;
              sumLeafG += g;
              sumLeafB += b;
              leafSampleCount++;

              if (g < 85 && r < 65 && b < 65) {
                darkBlackGreen++;
              } else if (r > 165 && g > 175 && b < 120) {
                yellowGoldVar++;
              } else if (r > 170 && g > 185 && b > 165 && sat < 0.22) {
                whiteCreamVar++;
              } else if (sat < 0.28 && g > 110 && b > 95) {
                silverGreyGreen++;
              } else if (b > r + 15 && g > 110) {
                blueSucculent++;
              } else if (g > r + 18 && g > b + 15) {
                emeraldGreen++;
              }
            }
          }
        }

        const total = Math.max(1, foliagePixels);
        const avgLeafR = leafSampleCount > 0 ? sumLeafR / leafSampleCount : 25;
        const avgLeafG = leafSampleCount > 0 ? sumLeafG / leafSampleCount : 120;
        const avgLeafB = leafSampleCount > 0 ? sumLeafB / leafSampleCount : 60;

        // استخراج پالت رنگی واقعی برگ عکس
        const outerHex = rgbToHex(avgLeafR * 0.75, avgLeafG * 0.82, avgLeafB * 0.75);
        const innerHex = rgbToHex(
          Math.min(250, avgLeafR * 1.15),
          Math.min(250, avgLeafG * 1.15),
          Math.min(250, avgLeafB * 1.1)
        );
        const veinHex = rgbToHex(
          Math.min(255, avgLeafR * 1.35 + 30),
          Math.min(255, avgLeafG * 1.35 + 30),
          Math.min(255, avgLeafB * 1.25 + 20)
        );

        // تشخیص رنگ گلدان از پایین عکس
        let inferredPotColor: PotColorType = 'white';
        if (potSampleCount > 0) {
          const pr = sumPotR / potSampleCount;
          const pg = sumPotG / potSampleCount;
          const pb = sumPotB / potSampleCount;
          if (pr > 140 && pg < 115 && pb < 95 && pr - pb > 45) {
            inferredPotColor = 'terracotta';
          } else if (pr < 65 && pg < 65 && pb < 70) {
            inferredPotColor = 'black';
          } else if (pr < 105 && pg < 110 && pb < 115) {
            inferredPotColor = 'charcoal';
          } else if (pg > pr + 10 && pg > pb) {
            inferredPotColor = 'mint';
          } else if (pr > 195 && pg > 180 && pb < 165) {
            inferredPotColor = 'cream';
          } else if (Math.abs(pr - pg) < 15 && pr >= 110 && pr <= 175) {
            inferredPotColor = 'grey';
          }
        }

        // تعیین کلاس ظاهری غالب برگ‌ها در تصویر
        let dominantFoliageClass: OpticalImageAnalysisResult['dominantFoliageClass'] =
          'emerald_green';
        let targetShapes: string[] = [];
        let reasonLabel = 'تشخیص برگ سبز زمردی';

        if (purpleViolet / total > 0.2) {
          dominantFoliageClass = 'purple_violet';
          reasonLabel = 'تشخیص طیف بنفش و ارغوانی برگ';
          targetShapes = [
            'tradescantia_pallida',
            'purple_heart',
            'aeonium_zwartkop',
            'african_violet',
            'oxalis',
            'peperomia_caperata'
          ];
        } else if (pinkRed / total > 0.13) {
          dominantFoliageClass = 'pink_red';
          reasonLabel = 'تشخیص رنگدانه‌های سرخ و صورتی';
          targetShapes = [
            'aglaonema_red',
            'syngonium_pink',
            'philo_pink_princess',
            'rose_dutch',
            'geranium_zonal',
            'cordyline_red',
            'hypoestes_polka',
            'coleus_colorful'
          ];
        } else if (yellowGoldVar / total > 0.16) {
          dominantFoliageClass = 'gold_variegated';
          reasonLabel = 'تشخیص رگه‌های ابلق طلایی و لیمویی';
          targetShapes = [
            'pothos_golden',
            'sansevieria_sword_variegated',
            'aglaonema_gold',
            'schefflera_variegated',
            'philo_brasil',
            'dracaena_lemon_lime',
            'pothos_neon'
          ];
        } else if (whiteCreamVar / total > 0.16) {
          dominantFoliageClass = 'white_variegated';
          reasonLabel = 'تشخیص نقوش ابلق سفید و کرم';
          targetShapes = [
            'aglaonema_snow',
            'dieffenbachia_tropic',
            'dieffenbachia_camilla',
            'pothos_marble',
            'pothos_manjula',
            'syngonium_albo',
            'spider_plant_variegated',
            'philo_birkin'
          ];
        } else if (silverGreyGreen / total > 0.25) {
          dominantFoliageClass = 'silver_green';
          reasonLabel = 'تشخیص بافت نقره‌ای-سبز پهنک برگ';
          targetShapes = [
            'aglaonema_silver',
            'sansevieria_moonshine',
            'pothos_satin',
            'peperomia_watermelon',
            'calathea_medallion'
          ];
        } else if (darkBlackGreen / total > 0.42) {
          dominantFoliageClass = 'dark_black';
          reasonLabel = 'تشخیص برگ‌های چرمی سبز بسیار تیره/بلک';
          targetShapes = [
            'aglaonema_dark',
            'zz_raven',
            'ficus_elastica_black',
            'ficus_elastica_burgundy',
            'dracaena_compacta',
            'alocasia_black_velvet'
          ];
        } else if (blueSucculent / total > 0.25) {
          dominantFoliageClass = 'blue_succulent';
          reasonLabel = 'تشخیص بافت گوشتی سبز-آبی';
          targetShapes = [
            'echeveria_elegans',
            'aloe_vera',
            'senecio_blue',
            'sedum_burros_tail',
            'cactus_cereus_column'
          ];
        } else {
          dominantFoliageClass = 'emerald_green';
          reasonLabel = 'تشخیص برگ‌های سبز زمردی یکدست';
          targetShapes = [
            'aglaonema_green',
            'zz_green',
            'pothos_jade',
            'ficus_elastica_green',
            'schefflera_green',
            'spathiphyllum_peace',
            'monstera_deliciosa',
            'sansevieria_green',
            'palm_chamaedorea'
          ];
        }

        // اگر کاربر کلمه‌ای هم در باکس نام نوشته بود (مثلاً «آگلونما»)، اولویت را به گونه‌های همان خانواده بده
        const cleanHint = hintQuery.trim().toLowerCase();
        let matchedEntries: PlantEncyclopediaEntry[] = [];

        if (cleanHint.length >= 2) {
          const hintFiltered = allEntries.filter(
            (e) =>
              e.data.name.toLowerCase().includes(cleanHint) ||
              e.keywords.some((k) => k.toLowerCase().includes(cleanHint))
          );
          // مرتب‌سازی گونه‌های هم‌خانواده بر اساس شباهت به طیف رنگی عکس
          hintFiltered.sort((a, b) => {
            const aIdx = targetShapes.indexOf(a.data.shape3D);
            const bIdx = targetShapes.indexOf(b.data.shape3D);
            return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
          });
          matchedEntries.push(...hintFiltered);
        }

        for (const sh of targetShapes) {
          const found = allEntries.find((e) => e.data.shape3D === sh);
          if (found && !matchedEntries.some((m) => m.data.name === found.data.name)) {
            matchedEntries.push(found);
          }
        }

        const candidates = matchedEntries
          .slice(0, 5)
          .map((e) => entryToSuggestion(e, reasonLabel));

        resolve({
          dominantFoliageClass,
          inferredPotColor,
          extractedPalette: { outerHex, innerHex, veinHex },
          candidates:
            candidates.length > 0
              ? candidates
              : allEntries.slice(0, 4).map((e) => entryToSuggestion(e, reasonLabel))
        });
      };
      img.onerror = () => resolve(defaultResult());
      img.src = imageBase64;
    } catch {
      resolve(defaultResult());
    }
  });
};

// ============================================================================
// ۲. اتصال به هوش مصنوعی Gemini 2.5 Flash Vision (در صورت وجود کلید API)
// ============================================================================
const callGeminiVisionBotanyAPI = async (params: {
  apiKey: string;
  rawInputName: string;
  isComboPlanter: boolean;
  companionListText?: string;
  imageBase64?: string;
}): Promise<Partial<AIPlantProfileResult> | null> => {
  const { apiKey, rawInputName, isComboPlanter, companionListText, imageBase64 } = params;
  if (!apiKey) return null;

  const allShapes = Array.from(
    new Set(getAllEncyclopediaEntries().map((e) => e.data.shape3D))
  );

  const promptText = `You are an expert botanist. Identify the exact plant species and cultivar from the attached image ${
    rawInputName ? `and user hint "${rawInputName}"` : ''
  } ${isComboPlanter ? `(Combo planter: ${companionListText || ''})` : ''}.
Pay special attention to cultivar differences (e.g., Green Aglaonema vs Silver Aglaonema vs Red Aglaonema, or Green Sansevieria vs Variegated).
Return ONLY valid JSON in fluent Persian matching this schema:
{
  "name": "نام دقیق گونه و واریته به فارسی (مثلاً آگلونما سبز زمردی)",
  "sci": "Scientific Latin Name",
  "family": "نام خانواده گیاهی",
  "origin": "خاستگاه طبیعی",
  "nickname": "لقب کوتاه • ویژگی شاخص",
  "botanyStory": "توضیح علمی ۲ تا ۳ جمله‌ای درباره ویژگی برگ‌ها و دمای ایده‌آل",
  "shape3D": "CLOSEST MATCH FROM: ${allShapes.join(', ')}",
  "isSucculentOrCactus": false,
  "waterCycleDays": 7,
  "mistNeed": "وضعیت غبارپاشی و نوع آب",
  "light": "نیاز نوری دقیق",
  "soilFert": "فرمول درصدی خاک و نوع کود",
  "pruningGuide": "اصول هرس",
  "propagationGuide": "روش تکثیر",
  "repotCycleMonths": 18,
  "clinic": [
    { "symptom": "علامت ۱", "cause": "علت ۱", "fix": "درمان ۱" },
    { "symptom": "علامت ۲", "cause": "علت ۲", "fix": "درمان ۲" },
    { "symptom": "علامت ۳", "cause": "علت ۳", "fix": "درمان ۳" },
    { "symptom": "علامت ۴", "cause": "علت ۴", "fix": "درمان ۴" },
    { "symptom": "علامت ۵", "cause": "علت ۵", "fix": "درمان ۵" }
  ]
}`;

  const parts: Array<Record<string, unknown>> = [{ text: promptText }];
  if (imageBase64 && imageBase64.includes('base64,')) {
    const [header, base64Data] = imageBase64.split('base64,');
    const mimeMatch = header.match(/data:(.*?);/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    parts.push({
      inlineData: {
        mimeType,
        data: base64Data
      }
    });
  }

  for (const modelName of ['gemini-2.5-flash', 'gemini-2.0-flash']) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );
      if (!response.ok) continue;
      const result = await response.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) continue;
      const parsed = JSON.parse(rawJson.replace(/```json|```/g, '').trim());
      if (parsed && typeof parsed.name === 'string') {
        return parsed;
      }
    } catch {
      // ادامه به مدل بعدی یا اسکنر نوری داخلی
    }
  }
  return null;
};

// ============================================================================
// ۳. تابع اصلی تولید پروفایل هوشمند گیاه (ترکیب بانک ۲۲۰ گونه‌ای + بینایی ماشین)
// ============================================================================
export const generateSmartPlantProfile = async (params: {
  rawInputName: string;
  potVolumeLiters: number;
  plantHeightCm: number;
  potShape: PotShapeType;
  isComboPlanter: boolean;
  companionListText?: string;
  imageBase64?: string;
}): Promise<AIPlantProfileResult> => {
  const {
    rawInputName,
    potVolumeLiters,
    plantHeightCm,
    potShape,
    isComboPlanter,
    companionListText,
    imageBase64
  } = params;

  const allEntries = getAllEncyclopediaEntries();
  const cleanInput = rawInputName.trim();

  // الف) اگر عکس آپلود شده است، هم‌زمان اسکنر طیف‌سنج نوری (و در صورت وجود کلید، Gemini Vision) را اجرا کن
  if (imageBase64) {
    const optical = await analyzePlantImageOptically(imageBase64, cleanInput);
    const apiKey = getGeminiApiKey();

    if (apiKey) {
      const visionData = await callGeminiVisionBotanyAPI({
        apiKey,
        rawInputName: cleanInput,
        isComboPlanter,
        companionListText,
        imageBase64
      });

      if (visionData && visionData.name) {
        const isSucc = Boolean(
          visionData.isSucculentOrCactus ||
            CareCalculator.isSucculentSpecies(
              visionData.shape3D || 'aglaonema_green',
              visionData.name
            )
        );
        const calc = CareCalculator.calculateAgronomicPrescription({
          baseCycleDays: visionData.waterCycleDays || (isSucc ? 12 : 7),
          isSucculentOrCactus: isSucc,
          isComboPlanter,
          potVolumeLiters,
          plantHeightCm,
          potShape
        });

        return {
          name: cleanInput || visionData.name,
          sci: visionData.sci || 'Botanical Species',
          family: visionData.family || 'گیاهان زینتی آپارتمانی',
          origin: visionData.origin || 'مناطق گرمسیری',
          nickname: visionData.nickname || visionData.name,
          botanyStory: visionData.botanyStory || '',
          shape3D: isComboPlanter
            ? 'combo_trough'
            : visionData.shape3D || optical.candidates[0]?.shape3D || 'aglaonema_green',
          recommendedPotShape: isComboPlanter ? 'trough_fluted' : 'round_smooth',
          recommendedPotColor: optical.inferredPotColor || 'white',
          isSucculentOrCactus: isSucc,
          waterCycleDays: calc.adjustedCycleDays,
          mistCycleDays: calc.mistCycleDays,
          doseMl: calc.doseMl,
          doseCup: calc.doseCup,
          mistNeed: visionData.mistNeed || 'هفته‌ای ۲ بار غبارپاشی ملایم',
          light: visionData.light || 'نور غیرمستقیم متوسط تا روشن',
          soilFert: visionData.soilFert || 'خاک سبک با زهکشی مناسب',
          pruningGuide: visionData.pruningGuide || 'حذف برگ‌های زرد پایینی',
          propagationGuide: visionData.propagationGuide || 'قلمه ساقه یا تقسیم بوته',
          repotCycleMonths: visionData.repotCycleMonths || 18,
          clinic:
            Array.isArray(visionData.clinic) && visionData.clinic.length > 0
              ? visionData.clinic
              : allEntries[0].data.clinic,
          visionConfidence: 'ai_exact',
          visionCandidates: optical.candidates
        };
      }
    }

    // اگر کلید API نبود، از بهترین گزینه اسکنر نوری استفاده کن و ۵ پیشنهاد نزدیک را هم برگردان
    const bestCandidate = optical.candidates[0];
    const matchedEntry =
      allEntries.find((e) => e.data.name === bestCandidate?.name) || allEntries[0];
    const base = matchedEntry.data;

    const calc = CareCalculator.calculateAgronomicPrescription({
      baseCycleDays: base.waterCycleDays,
      isSucculentOrCactus: base.isSucculentOrCactus,
      isComboPlanter,
      potVolumeLiters,
      plantHeightCm,
      potShape
    });

    return {
      ...base,
      name: cleanInput || base.name,
      recommendedPotShape: (base.recommendedPotShape as PotShapeType) || 'round_smooth',
      recommendedPotColor:
        optical.inferredPotColor || (base.recommendedPotColor as PotColorType) || 'white',
      waterCycleDays: calc.adjustedCycleDays,
      mistCycleDays: calc.mistCycleDays,
      doseMl: calc.doseMl,
      doseCup: calc.doseCup,
      visionConfidence: 'optical_match',
      visionCandidates: optical.candidates
    };
  }

  // ب) جستجوی متنی در بانک ۲۲۰+ گیاه
  const searchSuggestions = searchPlantEncyclopedia(
    `${cleanInput} ${companionListText || ''}`,
    isComboPlanter,
    1
  );

  if (cleanInput && searchSuggestions.length > 0) {
    const topHit = allEntries.find((e) => e.data.name === searchSuggestions[0].name);
    if (topHit) {
      const base = topHit.data;
      const calc = CareCalculator.calculateAgronomicPrescription({
        baseCycleDays: base.waterCycleDays,
        isSucculentOrCactus: base.isSucculentOrCactus,
        isComboPlanter,
        potVolumeLiters,
        plantHeightCm,
        potShape
      });

      return {
        ...base,
        recommendedPotShape: base.recommendedPotShape as PotShapeType,
        recommendedPotColor: base.recommendedPotColor as PotColorType,
        waterCycleDays: calc.adjustedCycleDays,
        mistCycleDays: calc.mistCycleDays,
        doseMl: calc.doseMl,
        doseCup: calc.doseCup
      };
    }
  }

  // ج) حالت پشتیبان برای نام‌های کاملاً سفارشی
  const defaultEntry = allEntries[0]?.data;
  const isSucc = CareCalculator.isSucculentSpecies(cleanInput, cleanInput);
  const calc = CareCalculator.calculateAgronomicPrescription({
    baseCycleDays: isSucc ? 12 : 7,
    isSucculentOrCactus: isSucc,
    isComboPlanter,
    potVolumeLiters,
    plantHeightCm,
    potShape
  });

  return {
    name: cleanInput || (defaultEntry ? defaultEntry.name : 'آگلونما سبز زمردی'),
    sci: 'Botanical Species',
    family: 'گیاهان زینتی (Botanical)',
    origin: 'مناطق گرمسیری و نیمه‌گرمسیری',
    nickname: `گونه منتخب گلخانه (${cleanInput || 'سبز'})`,
    botanyStory: `«${cleanInput || 'این گیاه'}» با تطبیق‌پذیری بالا در اقلیم گلخانه، طراوت طبیعی فضا را دوچندان می‌کند و برنامه آبیاری آن بر اساس حجم خاک و نور باغچه کالیبره شده است.`,
    shape3D: isComboPlanter ? 'combo_trough' : 'aglaonema_green',
    recommendedPotShape: isComboPlanter ? 'trough_fluted' : 'round_smooth',
    recommendedPotColor: 'white',
    isSucculentOrCactus: isSucc,
    waterCycleDays: calc.adjustedCycleDays,
    mistCycleDays: calc.mistCycleDays,
    doseMl: calc.doseMl,
    doseCup: calc.doseCup,
    mistNeed: isSucc
      ? 'بدون نیاز به غبارپاشی'
      : 'هفته‌ای ۲ بار غبارپاشی ملایم با آب بدون کلر',
    light: 'نور غیرمستقیم متوسط تا روشن به دور از تابش تند آفتاب.',
    soilFert:
      '۴۰٪ پیت‌ماس + ۳۰٪ پرلیت + ۲۰٪ کوکوپیت + ۱۰٪ ورمی‌کمپوست؛ کود NPK 20-20-20 هر ماه در بهار و تابستان.',
    pruningGuide: 'حذف برگ‌های پیر یا آسیب‌دیده از پایه با قیچی استریل.',
    propagationGuide: 'تکثیر از طریق قلمه ساقه یا تقسیم بوته در فصل بهار.',
    repotCycleMonths: 18,
    clinic: defaultEntry ? defaultEntry.clinic : []
  };
};