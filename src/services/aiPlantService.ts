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

// دریافت تمام گونه‌های موجود در بانک اطلاعاتی ۱۰ فازی بدون تکرار
export const getAllEncyclopediaEntries = (): PlantEncyclopediaEntry[] => {
  const seenNames = new Set<string>();
  return EXTERNAL_ENCYCLOPEDIA_PHASES.filter((item) => {
    if (!item || !item.data || !item.data.name) return false;
    const key = item.data.name.trim();
    if (seenNames.has(key)) return false;
    seenNames.add(key);
    return true;
  });
};

// فهرست پیشنهادی سریع برگرفته از بانک جامع
export const PRESET_SPECIES_SUGGESTIONS: Array<{
  label: string;
  shape3D: string;
  isCombo?: boolean;
}> = getAllEncyclopediaEntries().map((entry) => ({
  label: entry.data.name,
  shape3D: entry.data.shape3D,
  isCombo: entry.data.shape3D.startsWith('combo_')
}));

// موتور جستجوی زنده (Autocomplete) روی تمام ۲۰۰+ گونه، نام‌های بازاری و نام علمی
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
      .map((e) => ({
        name: e.data.name,
        sci: e.data.sci,
        family: e.data.family,
        nickname: e.data.nickname,
        shape3D: e.data.shape3D,
        waterCycleDays: e.data.waterCycleDays,
        isSucculentOrCactus: e.data.isSucculentOrCactus,
        recommendedPotShape: e.data.recommendedPotShape as PotShapeType,
        recommendedPotColor: e.data.recommendedPotColor as PotColorType,
        isCombo: e.data.shape3D.startsWith('combo_')
      }));
  }

  const scored = allEntries
    .map((entry) => {
      const nameLower = entry.data.name.toLowerCase();
      const sciLower = entry.data.sci.toLowerCase();
      const familyLower = entry.data.family.toLowerCase();
      const nickLower = entry.data.nickname.toLowerCase();
      let score = 0;

      if (nameLower === q) score += 120;
      else if (nameLower.startsWith(q)) score += 90;
      else if (nameLower.includes(q)) score += 65;

      if (entry.keywords.some((kw) => kw.toLowerCase() === q)) score += 100;
      else if (entry.keywords.some((kw) => kw.toLowerCase().startsWith(q))) score += 80;
      else if (entry.keywords.some((kw) => kw.toLowerCase().includes(q))) score += 55;

      if (sciLower.includes(q)) score += 50;
      if (nickLower.includes(q)) score += 30;
      if (familyLower.includes(q)) score += 20;

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ entry }) => ({
    name: entry.data.name,
    sci: entry.data.sci,
    family: entry.data.family,
    nickname: entry.data.nickname,
    shape3D: entry.data.shape3D,
    waterCycleDays: entry.data.waterCycleDays,
    isSucculentOrCactus: entry.data.isSucculentOrCactus,
    recommendedPotShape: entry.data.recommendedPotShape as PotShapeType,
    recommendedPotColor: entry.data.recommendedPotColor as PotColorType,
    isCombo: entry.data.shape3D.startsWith('combo_')
  }));
};

// تحلیلگر تصویر محلی در صورت آپلود عکس بدون کلید API
const analyzePlantImageLocally = async (
  imageBase64: string
): Promise<{ inferredShape: string; inferredName: string }> => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 48;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ inferredShape: 'aglaonema_silver', inferredName: 'آگلونما نقره‌ای' });
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let purplePixels = 0;
        let pinkRedPixels = 0;
        let darkGreenPixels = 0;
        let lightVariegatedPixels = 0;
        let plantPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          if (r > 70 && b > 70 && g < r * 0.85 && Math.abs(r - b) < 65) {
            purplePixels++;
            plantPixels++;
          } else if (r > 150 && g < 110 && b < 130) {
            pinkRedPixels++;
            plantPixels++;
          } else if (g > r + 12 && g > b + 12) {
            plantPixels++;
            if (g < 115) darkGreenPixels++;
            else if (r > 140 && g > 165) lightVariegatedPixels++;
          }
        }

        const total = Math.max(1, plantPixels);
        if (purplePixels / total > 0.22) {
          resolve({ inferredShape: 'purple_heart', inferredName: 'برگ‌بیدی بنفش' });
        } else if (pinkRedPixels / total > 0.14) {
          resolve({ inferredShape: 'aglaonema_red', inferredName: 'آگلونما صورتی' });
        } else if (lightVariegatedPixels / total > 0.28) {
          resolve({ inferredShape: 'pothos_marble', inferredName: 'پتوس مرمری' });
        } else if (darkGreenPixels / total > 0.55) {
          resolve({ inferredShape: 'zz_green', inferredName: 'زامیفولیا سبز' });
        } else {
          resolve({ inferredShape: 'pothos_golden', inferredName: 'پتوس ابلق طلایی' });
        }
      };
      img.onerror = () =>
        resolve({ inferredShape: 'aglaonema_silver', inferredName: 'آگلونما نقره‌ای' });
      img.src = imageBase64;
    } catch {
      resolve({ inferredShape: 'aglaonema_silver', inferredName: 'آگلونما نقره‌ای' });
    }
  });
};

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
  const searchSuggestions = searchPlantEncyclopedia(
    `${cleanInput} ${companionListText || ''}`,
    isComboPlanter,
    1
  );

  // ۱. جستجوی دقیق در بانک ۲۰۰+ گیاه
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

  // ۲. اگر تصویر آپلود شده است
  if (imageBase64) {
    const imgMatch = await analyzePlantImageLocally(imageBase64);
    const foundByImg = allEntries.find(
      (e) =>
        e.data.shape3D === imgMatch.inferredShape ||
        e.data.name.includes(imgMatch.inferredName)
    );
    if (foundByImg) {
      const base = foundByImg.data;
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
        recommendedPotShape: base.recommendedPotShape as PotShapeType,
        recommendedPotColor: base.recommendedPotColor as PotColorType,
        waterCycleDays: calc.adjustedCycleDays,
        mistCycleDays: calc.mistCycleDays,
        doseMl: calc.doseMl,
        doseCup: calc.doseCup
      };
    }
  }

  // ۳. حالت پشتیبان برای نام‌های کاملاً سفارشی
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
    name: cleanInput || (defaultEntry ? defaultEntry.name : 'پتوس ابلق طلایی'),
    sci: 'Botanical Species',
    family: 'گیاهان زینتی (Botanical)',
    origin: 'مناطق گرمسیری و نیمه‌گرمسیری',
    nickname: `گونه منتخب گلخانه (${cleanInput || 'سبز'})`,
    botanyStory: `«${cleanInput || 'این گیاه'}» با تطبیق‌پذیری بالا در اقلیم گلخانه، طراوت طبیعی فضا را دوچندان می‌کند و برنامه آبیاری آن بر اساس حجم خاک و نور باغچه کالیبره شده است.`,
    shape3D: isComboPlanter ? 'combo_trough' : 'pothos_golden',
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
    soilFert: '۴۰٪ پیت‌ماس + ۳۰٪ پرلیت + ۲۰٪ کوکوپیت + ۱۰٪ ورمی‌کمپوست؛ کود NPK 20-20-20 هر ماه در بهار و تابستان.',
    pruningGuide: 'حذف برگ‌های پیر یا آسیب‌دیده از پایه با قیچی استریل.',
    propagationGuide: 'تکثیر از طریق قلمه ساقه یا تقسیم بوته در فصل بهار.',
    repotCycleMonths: 18,
    clinic: defaultEntry
      ? defaultEntry.clinic
      : [
          {
            symptom: 'زرد شدن برگ‌های پایینی',
            cause: 'آبیاری بیش از حد و عدم تنفس ریشه',
            fix: 'اجازه دهید سطح خاک بین دو آبیاری خشک شود.'
          }
        ]
  };
};