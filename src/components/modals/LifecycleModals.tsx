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
  IconAddSprout,
  POT_MODELS_CATALOG,
  POT_COLOR_PALETTE
} from '../icons/CustomIcons';
import {
  generateSmartPlantProfile,
  searchPlantEncyclopedia,
  type PlantSearchSuggestion,
  type AIPlantProfileResult
} from '../../services/aiPlantService';



const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// تبدیل اعداد فارسی/عربی کیبورد موبایل به انگلیسی برای محاسبات دقیق بدون گیر کردن روی صفر
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

// تشخیص سریع آیکون گیاه از روی نام تایپ‌شده برای پیش‌نمایش زنده
const inferShapeFromTypedName = (rawName: string, isCombo: boolean): string => {
  if (isCombo) return 'combo_trough';
  const t = rawName.trim().toLowerCase();
  if (!t) return 'aglaonema';
  if (t.includes('پتوس') || t.includes('پوتوس') || t.includes('pothos')) return 'pothos';
  if (t.includes('لیراتا') || t.includes('ویولن') || t.includes('fiddle')) return 'fiddle_leaf';
  if (t.includes('کالاتیا') || t.includes('مارانتا') || t.includes('calathea')) return 'calathea';
  if (t.includes('شامادورا') || t.includes('اریکا') || t.includes('کنتیا')) return 'chamaedorea';
  if (t.includes('اسپاتی') || t.includes('چمچه') || t.includes('peace')) return 'peace_lily';
  if (t.includes('آلوئه') || t.includes('آلوورا') || t.includes('aloe')) return 'aloe';
  if (t.includes('آگلونما') || t.includes('اگلونما')) return 'aglaonema';
  if (t.includes('دراسنا') || t.includes('کامپکت')) return 'dracaena';
  if (t.includes('فیکوس')) return 'ficus';
  if (t.includes('دیفن')) return 'dieffenbachia';
  if (t.includes('کاج') || t.includes('نانا') || t.includes('بونسای')) return 'pine';
  if (t.includes('موسی') || t.includes('گهواره')) return 'tradescantia';
  if (t.includes('شفلرا')) return 'schefflera';
  if (t.includes('ماداگاسکار')) return 'pachypodium';
  if (t.includes('کریسمس') || t.includes('زیگو')) return 'christmas_cactus';
  if (t.includes('اپونتیا') || t.includes('افوربیا')) return 'opuntia';
  if (t.includes('کاکتوس') || t.includes('اچینو') || t.includes('مامیلاریا')) return 'cactus';
  if (t.includes('خونین') || t.includes('هایپوستس')) return 'hypoestes';
  if (t.includes('سدوم') || t.includes('چمن عروس')) return 'sedum';
  if (t.includes('زامیفولیا') || t.includes('زاموفیلیا')) return 'zz';
  if (t.includes('آدنیوم') || t.includes('کویر')) return 'adenium';
  if (t.includes('سانسوریا') || t.includes('شمشیری')) return 'sansevieria';
  if (t.includes('گندمی') || t.includes('عنکبوتی')) return 'spider_plant';
  if (t.includes('برگ‌بیدی') || t.includes('برگ بیدی') || t.includes('زبرینا')) return 'purple_heart';
  if (t.includes('پپرومیا') || t.includes('قاشقی')) return 'peperomia';
  if (t.includes('کالانکوئه') || t.includes('کراسولا') || t.includes('یشم')) return 'kalanchoe';
  if (t.includes('رز رونده') || t.includes('نسترن')) return 'climbing_rose';
  if (t.includes('رز')) return 'rose_bush';
  if (t.includes('مانسترا') || t.includes('مونسترا') || t.includes('انجیری')) return 'monstera';
  if (t.includes('اچوریا') || t.includes('آئونیوم') || t.includes('ساکولنت')) return 'echeveria';
  if (t.includes('هاورتیا')) return 'haworthia';
  return 'aglaonema';
};

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
  styleNote: string;
}> = Object.values(POT_COLOR_PALETTE).map((c) => ({
  id: c.id,
  label: c.nameFa,
  shortLabel: c.shortNameFa,
  hex: c.baseHex,
  styleNote: c.styleNote
}));

export const ALL_2D_SHAPES: Array<{ id: string; label: string }> = [
  { id: 'aglaonema', label: 'آگلونما' },
  { id: 'pothos', label: 'پتوس' },
  { id: 'sansevieria', label: 'سانسوریا' },
  { id: 'zz', label: 'زامیفولیا' },
  { id: 'monstera', label: 'مانسترا (برگ‌انجیری)' },
  { id: 'ficus', label: 'فیکوس الاستیکا' },
  { id: 'fiddle_leaf', label: 'فیکوس لیراتا' },
  { id: 'dracaena', label: 'دراسنا کامپکت' },
  { id: 'schefflera', label: 'شفلرا' },
  { id: 'dieffenbachia', label: 'دیفن‌باخیا' },
  { id: 'calathea', label: 'کالاتیا / مارانتا' },
  { id: 'chamaedorea', label: 'نخل شامادورا' },
  { id: 'peace_lily', label: 'اسپاتی‌فیلوم' },
  { id: 'spider_plant', label: 'گندمی' },
  { id: 'peperomia', label: 'پپرومیا برگ‌قاشقی' },
  { id: 'purple_heart', label: 'برگ‌بیدی بنفش' },
  { id: 'tradescantia', label: 'موسی در گهواره' },
  { id: 'hypoestes', label: 'برگ‌خونین' },
  { id: 'pine', label: 'کاج نانا' },
  { id: 'pachypodium', label: 'نخل ماداگاسکار' },
  { id: 'adenium', label: 'آدنیوم' },
  { id: 'aloe', label: 'آلوئه‌ورا' },
  { id: 'cactus', label: 'کاکتوس کروی' },
  { id: 'opuntia', label: 'کاکتوس اپونتیا / افوربیا' },
  { id: 'christmas_cactus', label: 'کاکتوس کریسمس' },
  { id: 'echeveria', label: 'ساکولنت اچوریا / آئونیوم' },
  { id: 'haworthia', label: 'هاورتیا' },
  { id: 'kalanchoe', label: 'کالانکوئه / کراسولا' },
  { id: 'sedum', label: 'سدوم (چمن عروس)' },
  { id: 'rose_bush', label: 'گل رز' },
  { id: 'climbing_rose', label: 'رز رونده' },
  { id: 'combo_trough', label: 'گلدان ترکیبی مستطیلی ۱' },
  { id: 'combo_trough_2', label: 'گلدان ترکیبی مستطیلی ۲' }
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

  // نگهداری مقادیر عددی به صورت رشته برای تایپ و پاک کردن روان در موبایل
  const [potVolumeStr, setPotVolumeStr] = useState<string>('2');
  const [plantHeightStr, setPlantHeightStr] = useState<string>('28');
  const [showDimensionHelper, setShowDimensionHelper] = useState(false);
  const [dimWidthStr, setDimWidthStr] = useState<string>('18');
  const [dimHeightStr, setDimHeightStr] = useState<string>('16');

  const [initialDaysSinceWater, setInitialDaysSinceWater] = useState<number>(0);
  const [initialRepotMonthsAgo, setInitialRepotMonthsAgo] = useState<number>(1);

  const [generatedProfile, setGeneratedProfile] = useState<AIPlantProfileResult | null>(null);
  const [manualShapeOverride, setManualShapeOverride] = useState<string | null>(null);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const [cycleDaysStr, setCycleDaysStr] = useState<string>('7');
  const [doseMlStr, setDoseMlStr] = useState<string>('180');

  const potVolumeLiters = parsePositiveFloat(potVolumeStr, 2.0);
  const plantHeightCm = parsePositiveFloat(plantHeightStr, 28);

  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const liveSuggestions: PlantSearchSuggestion[] = searchPlantEncyclopedia(
    name,
    isComboPlanter,
    8
  );

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

  useEffect(() => {
    if (gardens.length > 0 && !gardens.some((g) => g.id === garden)) {
      setGarden(gardens[0].id);
    }
  }, [gardens, garden]);

  const selectedGardenObj = gardens.find((g) => g.id === garden);
  const gardenLight = selectedGardenObj ? selectedGardenObj.lightLevel : 'high';

  // بازمحاسبه زنده نسخه آبیاری هنگام تغییر ابعاد گلدان یا نور باغچه
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
      setManualShapeOverride(null);

      if (!targetName.trim() && profile.name) {
        setName(profile.name);
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUploadedPreview(base64);
      triggerAutoGenerate(name, base64);
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

  const previewShape =
    manualShapeOverride ||
    (isComboPlanter
      ? 'combo_trough'
      : generatedProfile
      ? generatedProfile.shape3D
      : inferShapeFromTypedName(name, isComboPlanter));

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
      customSvgMarkup: finalProfile.customSvgMarkup,
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
          action: `ثبت در گلخانه (حجم خاک: ${toPersianNum(potVolumeLiters)} لیتر • پیمانه: ${toPersianNum(Math.round(finalDoseMl))} سی‌سی)`,
          by: 'سیستم هوشمند',
          time: 'هم‌اکنون',
          persianDate: formatPersianDate(0)
        }
      ]
    };

    onAdd(newPlant);
    setName('');
    setCompanionText('');
    setGeneratedProfile(null);
    setManualShapeOverride(null);
    setUploadedPreview(null);
    setShowFullEditor(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      {/* قاب اصلی مودال با overflow-hidden تا هیچ عنصری از گوشه‌های گرد بیرون نزند */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* ۱. هدر ثابت، تمیز و مینیمال */}
        <div className="px-4 py-3 border-b border-[#E8E2D5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 flex items-center justify-center text-[#2E5A44] shrink-0">
              <IconAddSprout className="w-4 h-4" />
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <h3 className="font-heading text-[15px] font-extrabold text-[#1C2822] truncate">
                افزودن گیاه جدید
              </h3>
              <span className="persian-num px-2 py-0.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[#2E5A44] text-[10.5px] font-bold shrink-0">
                {formattedCode}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* ۲. بدنه اسکرول‌شونده داخلی با دسته‌بندی منظم و خلوت */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 space-y-3">
          {/* ویترین زنده گلدان و سوییچ تک‌گیاهی / ترکیبی */}
          <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2.5 space-y-2.5">
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

            {/* کارت پیش‌نمایش زنده آیکون، شکل گلدان و فرمول آبیاری */}
            <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 flex items-center gap-3">
              <div className="w-18 h-18 rounded-xl bg-gradient-to-b from-[#F6F3EC] to-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center shrink-0">
                <PlantStylizedIllustration
                  shape={previewShape}
                  potColor={potColor}
                  potShape={isComboPlanter ? 'trough_fluted' : potShape}
                  plantName={pickText(name, generatedProfile?.name)}
                  customSvgMarkup={generatedProfile?.customSvgMarkup}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-heading text-[13px] font-bold text-[#1C2822] truncate">
                  {pickText(name, generatedProfile?.name, 'پیش‌نمایش زنده گلدان')}
                </div>
                <div className="persian-num flex flex-wrap items-center gap-1 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded-md bg-[#EBF4F8] text-[#1F6380] font-bold">
                    💧 {toPersianNum(generatedProfile ? doseMlStr : livePreviewCalc.doseMl)} سی‌سی
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] font-bold">
                    هر {toPersianNum(generatedProfile ? cycleDaysStr : livePreviewCalc.adjustedCycleDays)} روز
                  </span>
                </div>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-[9.5px] font-bold text-[#5A655E] shrink-0">آیکون گیاه:</span>
                  <select
                    value={previewShape}
                    onChange={(e) => setManualShapeOverride(e.target.value)}
                    className="flex-1 min-w-0 px-1.5 py-0.5 rounded-md bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-bold text-[#1C2822]"
                  >
                    {ALL_2D_SHAPES.map((sh) => (
                      <option key={sh.id} value={sh.id}>
                        {sh.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* گام ۱: جستجوی زنده گیاه از بانک جامع + تشخیص از روی عکس */}
          <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5 warm-shadow relative">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-bold text-[#1C2822]">
                ۱. نام گیاه و محل نگهداری
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
                        : 'جستجوی زنده نام گیاه (مثلاً: سانسوریا، پتوس، رز...)'
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
                  <span>عکس</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* کشوی جستجوی زنده (Autocomplete) با پیش‌نمایش دوبعدی گیاه */}
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
                                plantName={item.name}
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
              <div className="flex items-center justify-between bg-[#F6F3EC] p-2 rounded-xl border border-[#E8E2D5]">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={uploadedPreview}
                    alt="preview"
                    className="w-9 h-9 rounded-lg object-cover border border-[#E8E2D5] shrink-0"
                  />
                  <span className="text-[10px] font-bold text-[#2E5A44] truncate">
                    تصویر گیاه آماده تحلیل هوشمند است
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedPreview(null)}
                  className="text-[10px] text-[#C85A32] font-bold px-1.5 shrink-0"
                >
                  حذف
                </button>
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

          {/* گام ۲: شکل، رنگ و اندازه گلدان (با تایپ روان اعداد و خط‌کش وجبی) */}
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
            {/* نمایش زنده راهنمای تخصصی گلدان و رنگ انتخاب‌شده از فاز ۱۱ */}
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

            {/* انتخاب سریع شکل گلدان (شامل گرد ساده مینیمال) */}
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                مدل ظاهری گلدان:
              </label>
              <div className="grid grid-cols-5 gap-1">
                {POT_SHAPE_OPTIONS.map((opt) => {
                  const isSelected = potShape === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPotShape(opt.id)}
                      className={`py-1.5 px-1 rounded-xl border text-[9.5px] font-bold transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#2E5A44] text-white border-[#2E5A44] shadow-xs'
                          : 'bg-[#F6F3EC] text-[#1C2822] border-[#E8E2D5]'
                      }`}
                    >
                      {opt.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* انتخاب رنگ گلدان */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-[10px] font-bold text-[#5A655E] shrink-0">رنگ گلدان:</span>
              <div className="grid grid-cols-6 gap-1.5 flex-1">
                {POT_COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() => setPotColor(c.id)}
                    className={`h-7 rounded-lg border-2 flex items-center justify-center transition-transform ${
                      potColor === c.id
                        ? 'border-[#2E5A44] scale-105 shadow-xs'
                        : 'border-[#D5CFC2]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {potColor === c.id && (
                      <span
                        className={`text-[10px] font-bold ${
                          c.id === 'black' || c.id === 'terracotta'
                            ? 'text-white'
                            : 'text-[#1C2822]'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ۵ سایز آماده گلدان */}
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

            {/* خط‌کش وجبی و سانتی‌متری */}
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

            {/* فیلدهای عددی بدون مشکل گیر کردن صفر */}
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

          {/* دکمه استخراج هوشمند شناسنامه و کلینیک */}
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => triggerAutoGenerate()}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#EBF4F8] border border-[#2B7A9B]/30 text-[#1F6380] text-[11.5px] font-bold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-all disabled:opacity-60"
          >
            <span>✨</span>
            <span>
              {aiLoading
                ? 'در حال تنظیم هوشمند شناسنامه و کلینیک گیاه‌پزشکی...'
                : generatedProfile
                ? 'بازتولید هوشمند شناسنامه و کلینیک بر اساس نام جدید'
                : 'تولید پیش‌نمایش شناسنامه جامع و کلینیک (اختیاری)'}
            </span>
          </button>

          {/* بخش ویرایشگر شناسنامه در صورت تولید */}
          {generatedProfile && (
            <div className="bg-[#F6F3EC] border border-[#2E5A44]/30 rounded-2xl p-3 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12px] font-bold text-[#2E5A44] truncate">
                    ✓ شناسنامه «{pickText(name, generatedProfile.name)}» آماده شد
                  </div>
                  <div className="persian-num text-[10px] text-[#5A655E]">
                    شامل {toPersianNum(generatedProfile.clinic.length)} عارضه کلینیک و برنامه تغذیه
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
                        پیمانه (سی‌سی)
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

        {/* ۳. فوتر ثابت پایین مودال */}
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
// ۲. مودال ویرایش کامل مشخصات، گلدان، شناسنامه و کلینیک گیاه (با قاب قفل‌شده و تایپ عددی روان)
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
  const [garden, setGarden] = useState('');
  const [shape3D, setShape3D] = useState('ficus');
  const [potColor, setPotColor] = useState<PotColorType>('white');
  const [potShape, setPotShape] = useState<PotShapeType>('round_smooth');

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

  useEffect(() => {
    if (plant) {
      setName(plant.name);
      setSci(plant.sci);
      setNickname(pickText(plant.nickname));
      setBotanyStory(pickText(plant.botanyStory));
      setLight(pickText(plant.light));
      setSoilFert(pickText(plant.soilFert));
      setGarden(plant.garden);
      setShape3D(plant.shape3D);
      setPotColor(plant.potColor ? plant.potColor : 'white');
      setPotShape(plant.potShape ? plant.potShape : 'round_smooth');
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
    }
  }, [plant]);

  if (!plant) return null;

  const potVolumeLiters = parsePositiveFloat(potVolumeStr, 2.0);
  const plantHeightCm = parsePositiveFloat(plantHeightStr, 28);
  const waterCycleDays = Math.round(parsePositiveFloat(waterCycleStr, 7));
  const doseMl = Math.round(parsePositiveFloat(doseMlStr, 150));

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
    const isCombo = plant.isComboPlanter ? true : newShape3D.startsWith('combo_');

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
      garden,
      shape3D,
      potColor,
      potShape,
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
        {/* هدر ثابت */}
        <div className="px-4 py-3 border-b border-[#E8E2D5] bg-[#FDFBF7] flex items-center justify-between shrink-0">
          <h3 className="font-heading text-[14.5px] font-extrabold text-[#1C2822] truncate">
            ✏️ ویرایش «{plant.name}» ({plant.code})
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold flex items-center justify-center shrink-0"
          >
            ✕
          </button>
        </div>

        {/* بدنه اسکرول‌شونده داخلی */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 space-y-3">
          <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-2.5 flex items-center gap-3">
            <div className="w-18 h-18 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center shrink-0">
              <PlantStylizedIllustration
                shape={shape3D}
                potColor={potColor}
                potShape={potShape}
                plantName={name}
                customSvgMarkup={plant.customSvgMarkup}
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[12px] font-bold"
                placeholder="نام گیاه..."
              />
              <select
                value={garden}
                onChange={(e) => {
                  const newG = e.target.value;
                  setGarden(newG);
                  applySmartRecalculation(potVolumeLiters, plantHeightCm, potShape, newG, shape3D);
                }}
                className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
              >
                {gardens.map((g) => (
                  <option key={g.id} value={g.id}>
                    📍 {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                🌿 آیکون دوبعدی گیاه:
              </label>
              <select
                value={shape3D}
                onChange={(e) => {
                  const newSh = e.target.value;
                  setShape3D(newSh);
                  applySmartRecalculation(potVolumeLiters, plantHeightCm, potShape, garden, newSh);
                }}
                className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold"
              >
                {ALL_2D_SHAPES.map((sh) => (
                  <option key={sh.id} value={sh.id}>
                    {sh.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-1">
                🏺 شکل ظاهری گلدان:
              </label>
              <select
                value={potShape}
                onChange={(e) => {
                  const newPs = e.target.value as PotShapeType;
                  setPotShape(newPs);
                  applySmartRecalculation(potVolumeLiters, plantHeightCm, newPs, garden, shape3D);
                }}
                className="w-full px-2 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold"
              >
                {POT_SHAPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* رنگ گلدان */}
          <div className="grid grid-cols-6 gap-1.5">
            {POT_COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPotColor(c.id)}
                className={`py-1 px-1 rounded-xl border text-[10px] font-bold flex items-center justify-center ${
                  potColor === c.id
                    ? 'border-[#2E5A44] ring-2 ring-[#2E5A44]/30'
                    : 'border-[#E8E2D5]'
                }`}
                style={{
                  backgroundColor: c.hex,
                  color: c.id === 'black' || c.id === 'terracotta' ? '#FFF' : '#1C2822'
                }}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* حجم خاک و قد گیاه بدون مشکل تایپ */}
          <div className="bg-[#F6F3EC] p-2.5 rounded-2xl border border-[#E8E2D5] space-y-2">
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
                  className="w-full px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold text-center"
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
                  className="w-full px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold text-center"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
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
                  className="w-full px-2 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                  پیمانه (سی‌سی)
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
                  className="w-full px-2 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-center"
                />
              </div>
              <div>
                <label className="block text-[9.5px] font-bold text-[#5A655E] mb-0.5">
                  معادل لیوانی
                </label>
                <input
                  value={doseCup}
                  onChange={(e) => setDoseCup(e.target.value)}
                  className="w-full px-2 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
                />
              </div>
            </div>
          </div>

          {/* آخرین آبیاری و تعویض خاک */}
          <div className="bg-[#F6F3EC] p-2.5 rounded-2xl border border-[#E8E2D5] grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#1C2822] mb-1">
                💧 آخرین نوبت آبیاری:
              </label>
              <select
                value={daysSinceWater}
                onChange={(e) => setDaysSinceWater(Number(e.target.value))}
                className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
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
                className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold"
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
            className="w-full py-2 px-3 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] text-[11px] font-bold flex items-center justify-between"
          >
            <span>🩺 ویرایش شناسنامه و عارضه‌های کلینیک ({toPersianNum(clinicItems.length)} مورد)</span>
            <span>{showClinicEditor ? '▴ بستن' : '▾ باز کردن'}</span>
          </button>

          {showClinicEditor && (
            <div className="space-y-2.5 bg-[#F6F3EC]/70 p-2.5 rounded-2xl border border-[#E8E2D5]">
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  نیاز نوری:
                </label>
                <input
                  value={light}
                  onChange={(e) => setLight(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                  ترکیب خاک و کود:
                </label>
                <input
                  value={soilFert}
                  onChange={(e) => setSoilFert(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[11px]"
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

        {/* فوتر ثابت */}
        <div className="px-4 py-3 border-t border-[#E8E2D5] bg-[#FDFBF7] flex items-center gap-2 shrink-0">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[12.5px] warm-shadow"
          >
            ذخیره تغییرات ✓
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5 shrink-0">
          <div>
            <h3 className="font-heading text-[16px] font-bold text-[#1C2822]">
              🏛️ تالار یادبود و آرشیو گلخانه
            </h3>
            <p className="text-[11px] text-[#5A655E]">
              امکان بازگردانی به گلخانه یا حذف دائمی از سیستم
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-[#F6F3EC] text-[#1C2822] text-[11px] font-bold"
          >
            ✕ بستن
          </button>
        </div>

        <div className="overflow-y-auto overscroll-contain flex-1 space-y-2.5 py-1">
          {archivedPlants.length === 0 ? (
            <div className="text-center py-8 text-[12.5px] text-[#5A655E] bg-[#F6F3EC]/60 rounded-2xl border border-[#E8E2D5]">
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
                        plantName={plant.name}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-[#1C2822] truncate">
                        {plant.name}{' '}
                        <span className="text-[11px] text-[#5A655E]">({plant.code})</span>
                      </div>
                      <div className="text-[11px] text-[#C85A32] font-medium truncate">
                        علت: {reasonText}
                      </div>
                      <div className="text-[10.5px] text-[#5A655E]">{plant.archiveDate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRestore(plant.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#2E5A44] text-white text-[11px] font-bold"
                    >
                      بازگردانی
                    </button>
                    <button
                      onClick={() => onHardDelete(plant.id, plant.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FCEEE9] text-[#C85A32] border border-[#C85A32]/25 text-[11px] font-bold"
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
// ۴. مودال QR Code هوشمند
// ============================================================================
interface QRCodeModalProps {
  plant: PlantEntity | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ plant, onClose }) => {
  if (!plant) return null;

  const spId = pickText(plant.spaceId, 'office');
  const directPlantUrl = `${window.location.origin}${window.location.pathname}?space=${spId}&plant=${plant.id}&mode=visitor`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=1C2822&bgcolor=FDFBF7&data=${encodeURIComponent(
    directPlantUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-xs w-full p-5 text-center space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between">
          <span className="persian-num px-2 py-0.5 rounded-lg bg-[#2E5A44] text-white text-[11px] font-bold">
            {plant.code}
          </span>
          <span className="text-[12px] font-bold text-[#5A655E]">شناسنامه هوشمند گلدان</span>
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded-lg bg-[#F6F3EC] text-[#1C2822] text-[11px] font-bold"
          >
            ✕ بستن
          </button>
        </div>

        <div className="bg-[#F6F3EC] p-4 rounded-2xl border border-[#E8E2D5] flex flex-col items-center">
          <img
            src={qrImageUrl}
            alt={plant.name}
            className="w-40 h-40 rounded-xl border border-[#E8E2D5] p-2 bg-[#FDFBF7]"
          />
          <h4 className="font-heading text-[15px] font-bold text-[#1C2822] mt-3">
            {plant.name}
          </h4>
          <p className="persian-num text-[11.5px] text-[#2E5A44] font-semibold mt-0.5">
            پیمانه آب: {toPersianNum(plant.doseMl)} سی‌سی ({plant.doseCup})
          </p>
        </div>

        <p className="text-[11.5px] text-[#5A655E] leading-relaxed">
          با اسکن این کد، نمای نمایشگاهی و شناسنامه کامل این گلدان باز می‌شود.
        </p>

        <button
          onClick={() => window.print()}
          className="w-full py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13px]"
        >
          🖨️ چاپ برچسب گلدان
        </button>
      </div>
    </div>
  );
};