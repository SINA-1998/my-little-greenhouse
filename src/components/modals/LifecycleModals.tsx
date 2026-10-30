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
import { PlantStylizedIllustration } from '../icons/CustomIcons';
import {
  generateSmartPlantProfile,
  PRESET_SPECIES_SUGGESTIONS,
  type AIPlantProfileResult
} from '../../services/aiPlantService';

const toPersianNum = (num: number | string): string =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const pickText = (...vals: Array<string | undefined | null>): string => {
  for (const v of vals) {
    if (typeof v === 'string' && v.trim().length > 0) {
      return v.trim();
    }
  }
  return '';
};

export const POT_SHAPE_OPTIONS: Array<{ id: PotShapeType; label: string; icon: string }> = [
  { id: 'round_ribbed', label: 'گرد شیاردار (کلاسیک)', icon: '🪴' },
  { id: 'faceted_gem', label: 'الماسی چندوجهی', icon: '💎' },
  { id: 'square_patterned', label: 'چهارگوش طرح‌دار', icon: '🔲' },
  { id: 'chalice_urn', label: 'جامی پایه‌بلند', icon: '🏆' },
  { id: 'trough_fluted', label: 'مستطیلی کنگره‌دار', icon: '▭' },
  { id: 'cylinder_modern', label: 'استوانه‌ای مدرن', icon: '🛢️' }
];

export const POT_COLOR_OPTIONS: Array<{ id: PotColorType; label: string; hex: string }> = [
  { id: 'white', label: 'سفید', hex: '#FFFFFF' },
  { id: 'mint', label: 'سبز پاستلی', hex: '#CBEAD9' },
  { id: 'black', label: 'مشکی', hex: '#262B30' },
  { id: 'terracotta', label: 'سفالی', hex: '#D97B54' },
  { id: 'grey', label: 'طوسی', hex: '#9CA3AF' },
  { id: 'cream', label: 'کرم', hex: '#F5EFE0' }
];

export const ALL_2D_SHAPES: Array<{ id: string; label: string }> = [
  { id: 'aglaonema', label: 'آگلونما نقره‌ای پرپشت' },
  { id: 'dracaena', label: 'دراسنا کامپکت' },
  { id: 'ficus', label: 'فیکوس الاستیکا (شرابی)' },
  { id: 'dieffenbachia', label: 'دیفن‌باخیا / پتوس' },
  { id: 'pine', label: 'کاج نانا (بونسای)' },
  { id: 'tradescantia', label: 'موسی در گهواره' },
  { id: 'schefflera', label: 'شفلرا (درختچه چتری)' },
  { id: 'pachypodium', label: 'نخل ماداگاسکار' },
  { id: 'cactus', label: 'کاکتوس کروی (اچینو / مامیلاریا)' },
  { id: 'hypoestes', label: 'برگ‌خونین (صورتی و سفید)' },
  { id: 'sedum', label: 'سدوم (چمن عروس)' },
  { id: 'zz', label: 'زامیفولیا سبز' },
  { id: 'adenium', label: 'آدنیوم (رز کویری غده‌ای)' },
  { id: 'sansevieria', label: 'سانسوریا شمشیری بلند' },
  { id: 'christmas_cactus', label: 'کاکتوس کریسمس (زیگوکاکتوس)' },
  { id: 'spider_plant', label: 'گندمی ابلق (عنکبوتی با گندمک)' },
  { id: 'purple_heart', label: 'برگ‌بیدی بنفش (زبرینا)' },
  { id: 'peperomia', label: 'پپرومیا برگ‌قاشقی ابلق' },
  { id: 'kalanchoe', label: 'کالانکوئه / کراسولا برگ‌پهن' },
  { id: 'climbing_rose', label: 'رز رونده بلند با قیم' },
  { id: 'rose_bush', label: 'بوته گل رز پرگل' },
  { id: 'combo_trough', label: 'گلدان مستطیلی ترکیبی ۱ (آئونیوم و گولوم)' },
  { id: 'combo_trough_2', label: 'گلدان مستطیلی ترکیبی ۲ (هاورتیا و افوربیا)' },
  { id: 'monstera', label: 'مونسترا (برگ‌انجیری)' },
  { id: 'echeveria', label: 'ساکولنت اچوریا / آئونیوم رزت' },
  { id: 'haworthia', label: 'هاورتیا گورخری / ببری' },
  { id: 'opuntia', label: 'کاکتوس اپونتیا / افوربیا ستونی' }
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
  const [potShape, setPotShape] = useState<PotShapeType>('round_ribbed');

  const [isComboPlanter, setIsComboPlanter] = useState(false);
  const [companionText, setCompanionText] = useState('');
  const [potVolumeLiters, setPotVolumeLiters] = useState<number>(2.0);
  const [plantHeightCm, setPlantHeightCm] = useState<number>(28);

  const [showDimensionHelper, setShowDimensionHelper] = useState(false);
  const [dimWidthCm, setDimWidthCm] = useState<number>(18);
  const [dimHeightCm, setDimHeightCm] = useState<number>(16);

  const [initialDaysSinceWater, setInitialDaysSinceWater] = useState<number>(0);
  const [initialRepotMonthsAgo, setInitialRepotMonthsAgo] = useState<number>(1);

  const [generatedProfile, setGeneratedProfile] = useState<AIPlantProfileResult | null>(null);
  const [showFullEditor, setShowFullEditor] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  useEffect(() => {
    if (gardens.length > 0 && !gardens.some((g) => g.id === garden)) {
      setGarden(gardens[0].id);
    }
  }, [gardens, garden]);

  const selectedGardenObj = gardens.find((g) => g.id === garden);
  const gardenLight = selectedGardenObj ? selectedGardenObj.lightLevel : 'high';

  // بازمحاسبه زنده پیمانه آب و دوره آبیاری هنگام تغییر حجم خاک، قد یا شکل گلدان
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

  const handleApplyDimensionEstimate = (wCm: number, hCm: number) => {
    setDimWidthCm(wCm);
    setDimHeightCm(hCm);
    const estimated = CareCalculator.estimateVolumeFromDimensionsCm(wCm, hCm, potShape);
    setPotVolumeLiters(estimated);
  };

  const triggerAutoGenerate = async (overrideName?: string, overrideImage?: string) => {
    const targetName = overrideName !== undefined ? overrideName : name;
    const targetImage = overrideImage !== undefined ? overrideImage : uploadedPreview ? uploadedPreview : undefined;

    if (!targetName.trim() && !companionText.trim() && !targetImage) {
      alert('لطفاً نام گیاه را بنویسید، از لیست انتخاب کنید، یا عکس گیاه را آپلود نمایید.');
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
      if (!targetName.trim() && profile.name) {
        setName(profile.name);
      }
      if (profile.recommendedPotShape && !isComboPlanter) {
        setPotShape(profile.recommendedPotShape);
      }
      if (profile.recommendedPotColor) {
        setPotColor(profile.recommendedPotColor);
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

    const formattedCode = `#${toPersianNum(String(nextIndex).padStart(2, '0'))}`;
    const companionArr = companionText
      .split(/[,،+]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const effectiveDaysAgo =
      initialDaysSinceWater === 99 ? finalProfile.waterCycleDays : initialDaysSinceWater;
    const lastWateredTimestamp = Date.now() - effectiveDaysAgo * 86400000;
    const repotDaysAgo = initialRepotMonthsAgo * 30;

    const initialStatus =
      effectiveDaysAgo >= finalProfile.waterCycleDays
        ? 'thirsty'
        : finalProfile.isSucculentOrCactus
        ? 'locked'
        : 'ok';

    const finalPlantName = pickText(name, finalProfile.name, 'گیاه جدید');
    const finalGardenId = pickText(garden, defaultGardenId);

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
      shape3D: isComboPlanter ? 'combo_trough' : finalProfile.shape3D,
      potColor,
      potVolumeLiters,
      plantHeightCm,
      potShape: isComboPlanter ? 'trough_fluted' : potShape,
      isComboPlanter,
      companionSpecies: companionArr.length > 0 ? companionArr : undefined,
      customSvgMarkup: finalProfile.customSvgMarkup,
      waterCycleDays: finalProfile.waterCycleDays,
      daysSinceWater: effectiveDaysAgo,
      lastWateredAt: lastWateredTimestamp,
      waterCount: 1,
      needsRotation: false,
      doseMl: finalProfile.doseMl,
      doseCup: finalProfile.doseCup,
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
          action: `ثبت در گلخانه (حجم خاک: ${toPersianNum(potVolumeLiters)} لیتر • پیمانه: ${toPersianNum(finalProfile.doseMl)} سی‌سی)`,
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
    setUploadedPreview(null);
    setShowFullEditor(false);
    onClose();
  };

  const previewShape = isComboPlanter
    ? 'combo_trough'
    : generatedProfile
    ? generatedProfile.shape3D
    : 'aglaonema';

  return (
    <div className="fixed inset-0 z-50 bg-[#1C2822]/55 backdrop-blur-xs flex items-center justify-center p-3">
      <form
        onSubmit={handleSubmit}
        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-4 space-y-3.5 max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
          <div>
            <h3 className="font-heading text-[15.5px] font-extrabold text-[#1C2822]">
              ✨ ثبت دقیق گیاه و گلدان جدید
            </h3>
            <p className="text-[10.5px] text-[#5A655E]">
              انتخاب از لیست، تایپ نام یا تشخیص خودکار از روی عکس با تسلط کامل روی شناسنامه
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-[#F6F3EC] text-[#1C2822] text-[11px] font-bold"
          >
            ✕ بستن
          </button>
        </div>

        {/* سوییچ گلدان تکی یا مستطیلی ترکیبی */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#F6F3EC] p-1 rounded-2xl border border-[#E8E2D5]">
          <button
            type="button"
            onClick={() => {
              setIsComboPlanter(false);
              setPotShape('round_ribbed');
            }}
            className={`py-2 rounded-xl text-[11.5px] transition-all ${
              !isComboPlanter
                ? 'font-bold bg-[#FDFBF7] text-[#1C2822] warm-shadow'
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
              setPotVolumeLiters(2.5);
              setPlantHeightCm(15);
            }}
            className={`py-2 rounded-xl text-[11.5px] transition-all ${
              isComboPlanter
                ? 'font-bold bg-[#2E5A44] text-white warm-shadow'
                : 'font-semibold text-[#5A655E]'
            }`}
          >
            🌵 گلدان ترکیبی / مستطیلی
          </button>
        </div>

        {/* ۱. انتخاب سریع گونه، تایپ نام یا تشخیص از روی عکس */}
        <div className="bg-[#E6F0EB]/60 border border-[#2E5A44]/20 rounded-2xl p-3 space-y-2.5">
          <div>
            <label className="block text-[10.5px] font-bold text-[#2E5A44] mb-1">
              ⚡ انتخاب سریع از بانک گونه‌های آماده (اختیاری):
            </label>
            <select
              value=""
              onChange={(e) => {
                const chosenLabel = e.target.value;
                if (!chosenLabel) return;
                const found = PRESET_SPECIES_SUGGESTIONS.find((s) => s.label === chosenLabel);
                setName(chosenLabel);
                if (found?.isCombo) {
                  setIsComboPlanter(true);
                  setPotShape('trough_fluted');
                }
                triggerAutoGenerate(chosenLabel);
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold text-[#1C2822]"
            >
              <option value="">-- انتخاب سریع گونه از لیست (۲۶ گونه آماده) --</option>
              {PRESET_SPECIES_SUGGESTIONS.map((item) => (
                <option key={item.label} value={item.label}>
                  🌿 {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11.5px] font-bold text-[#1C2822] mb-1">
              {isComboPlanter
                ? 'عنوان گلدان مستطیلی / کلکسیونی:'
                : 'نام دقیق گیاه (یا خالی بگذارید و عکس بدهید):'}
            </label>
            <div className="flex gap-1.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  isComboPlanter
                    ? 'مثلاً: دیش‌گاردن ساکولنت لب پنجره'
                    : 'نام گیاه را بنویسید یا عکس بگیرید...'
                }
                className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[12px] font-semibold focus:outline-none focus:border-[#2E5A44]"
              />
              <label className="px-3 py-2 rounded-xl bg-[#2E5A44] text-white text-[11px] font-bold cursor-pointer flex items-center justify-center shrink-0 warm-shadow">
                📷 عکس گیاه
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {uploadedPreview && (
            <div className="flex items-center justify-between bg-[#FDFBF7] p-2 rounded-xl border border-[#E8E2D5]">
              <div className="flex items-center gap-2">
                <img
                  src={uploadedPreview}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-cover border border-[#E8E2D5]"
                />
                <span className="text-[10.5px] font-bold text-[#2E5A44]">
                  ✅ تصویر بارگذاری شد (نام و شناسنامه از روی عکس تشخیص داده می‌شود)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUploadedPreview(null)}
                className="text-[10px] text-[#C85A32] font-bold px-1.5"
              >
                حذف عکس
              </button>
            </div>
          )}

          {isComboPlanter && (
            <div>
              <label className="block text-[11px] font-bold text-[#2E5A44] mb-1">
                گونه‌های کاشته‌شده کنار هم در این گلدان (با + یا کاما جدا کنید):
              </label>
              <input
                value={companionText}
                onChange={(e) => setCompanionText(e.target.value)}
                placeholder="مثلاً: کاکتوس توپی + کراسولا گولوم + آئونیوم بنفش"
                className="w-full min-w-0 px-3 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px]"
              />
            </div>
          )}

          <div>
            <label className="block text-[10.5px] font-bold text-[#5A655E] mb-1">
              📍 در کدام باغچه قرار دارد؟ (نور باغچه در فرمول آبیاری لحاظ می‌شود)
            </label>
            <select
              value={garden}
              onChange={(e) => setGarden(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold text-[#1C2822]"
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

        {/* ۲. اندازه گلدان، حجم خاک و قد گیاه */}
        <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-[#1C2822]">
              🍶 اندازه گلدان و حجم خاک:
            </span>
            <button
              type="button"
              onClick={() => setShowDimensionHelper(!showDimensionHelper)}
              className="text-[10.5px] font-bold text-[#2B7A9B] underline"
            >
              {showDimensionHelper ? 'بستن خط‌کش وجبی' : '📏 محاسبه با وجب / سانتی‌متر'}
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {[
              { label: 'مینی', sub: 'لیوانی', liters: 0.4, height: 10 },
              { label: 'کوچک', sub: 'کاسه‌ای', liters: 1.2, height: 18 },
              { label: 'متوسط', sub: 'رومیزی', liters: 2.5, height: 35 },
              { label: 'بزرگ', sub: 'سالنی', liters: 4.5, height: 55 },
              { label: 'جام بزرگ', sub: 'حیاطی', liters: 8.5, height: 95 }
            ].map((preset) => {
              const active = Math.abs(potVolumeLiters - preset.liters) < 0.35;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPotVolumeLiters(preset.liters);
                    setPlantHeightCm(preset.height);
                  }}
                  className={`py-1.5 px-1 rounded-xl border text-center transition-all ${
                    active
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44] font-bold'
                      : 'bg-[#FDFBF7] text-[#1C2822] border-[#E8E2D5]'
                  }`}
                >
                  <div className="text-[10.5px] font-bold">{preset.label}</div>
                  <div className="text-[9px] opacity-80">{preset.sub}</div>
                  <div className="persian-num text-[9px] font-bold mt-0.5">
                    {toPersianNum(preset.liters)}L
                  </div>
                </button>
              );
            })}
          </div>

          {showDimensionHelper && (
            <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#2B7A9B]/30 space-y-2">
              <div className="text-[10.5px] font-bold text-[#2B7A9B]">
                🤚 دهانه گلدان را با وجب دست یا سانتی‌متر مشخص کنید تا حجم دقیق خاک محاسبه شود:
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyDimensionEstimate(12, 11)}
                  className="py-1.5 px-2 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-bold text-[#1C2822]"
                >
                  نصف وجب (۱۲cm)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyDimensionEstimate(20, 18)}
                  className="py-1.5 px-2 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-bold text-[#1C2822]"
                >
                  یک وجب کامل (۲۰cm)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyDimensionEstimate(30, 26)}
                  className="py-1.5 px-2 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10px] font-bold text-[#1C2822]"
                >
                  ۱.۵ وجب (۳۰cm)
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[9.5px] text-[#5A655E]">قطر/طول دهانه (cm)</label>
                  <input
                    type="number"
                    value={dimWidthCm}
                    onChange={(e) =>
                      handleApplyDimensionEstimate(Number(e.target.value), dimHeightCm)
                    }
                    className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[9.5px] text-[#5A655E]">ارتفاع گلدان (cm)</label>
                  <input
                    type="number"
                    value={dimHeightCm}
                    onChange={(e) =>
                      handleApplyDimensionEstimate(dimWidthCm, Number(e.target.value))
                    }
                    className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                حجم دقیق خاک (لیتر)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="40"
                value={potVolumeLiters}
                onChange={(e) => setPotVolumeLiters(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                قد گیاه (سانتی‌متر)
              </label>
              <input
                type="number"
                min="3"
                max="300"
                value={plantHeightCm}
                onChange={(e) => setPlantHeightCm(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold"
              />
            </div>
          </div>
        </div>

        {/* ۳. انتخاب شکل و رنگ گلدان */}
        <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-3 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
                🏺 شکل ظاهری گلدان:
              </label>
              <select
                value={potShape}
                onChange={(e) => setPotShape(e.target.value as PotShapeType)}
                className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
              >
                {POT_SHAPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
                🎨 رنگ گلدان:
              </label>
              <div className="grid grid-cols-6 gap-1 pt-0.5">
                {POT_COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    title={c.label}
                    onClick={() => setPotColor(c.id)}
                    className={`h-7 rounded-lg border-2 flex items-center justify-center transition-transform ${
                      potColor === c.id
                        ? 'border-[#2E5A44] scale-110 shadow-xs'
                        : 'border-[#D5CFC2]'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {potColor === c.id && (
                      <span
                        className={`text-[10px] font-bold ${
                          c.id === 'black' ? 'text-white' : c.id === 'terracotta' ? 'text-white' : 'text-[#1C2822]'
                        }`}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ۴. تاریخ آخرین آبیاری و آخرین تعویض خاک */}
        <div className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-2xl p-3 grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              💧 آخرین بار کی آب داده‌اید؟
            </label>
            <select
              value={initialDaysSinceWater}
              onChange={(e) => setInitialDaysSinceWater(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
            >
              <option value={0}>امروز (کاملاً سیراب است)</option>
              <option value={1}>دیروز (۱ روز پیش)</option>
              <option value={2}>پریروز (۲ روز پیش)</option>
              <option value={3}>۳ روز پیش</option>
              <option value={5}>۵ روز پیش</option>
              <option value={7}>۱ هفته پیش</option>
              <option value={99}>الان تشنه است (نیاز به آب فوری)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              🌱 آخرین تعویض خاک گلدان:
            </label>
            <select
              value={initialRepotMonthsAgo}
              onChange={(e) => setInitialRepotMonthsAgo(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
            >
              <option value={0}>تازه تعویض شده (همین ماه)</option>
              <option value={2}>حدود ۲ ماه پیش</option>
              <option value={4}>حدود ۴ ماه پیش</option>
              <option value={6}>حدود ۶ ماه پیش</option>
              <option value={12}>پارسال (۱۲ ماه پیش)</option>
              <option value={18}>بیش از ۱.۵ سال پیش (نیاز به بررسی)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          disabled={aiLoading}
          onClick={() => triggerAutoGenerate()}
          className="w-full py-2.5 rounded-xl bg-[#2B7A9B] text-white text-[12px] font-bold warm-shadow disabled:opacity-60"
        >
          {aiLoading
            ? '⏳ در حال استخراج شناسنامه جامع و ۶ عارضه کلینیک...'
            : '🤖 ساخت خودکار شناسنامه جامع، آیکون و کلینیک گیاه‌پزشکی'}
        </button>

        {/* ۵. نمایش و ویرایش کامل شناسنامه و کلینیک تولیدشده پیش از ثبت نهایی */}
        {generatedProfile && (
          <div className="bg-[#FDFBF7] border-2 border-[#2E5A44]/30 rounded-2xl p-3 space-y-3 warm-shadow">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 bg-[#F6F3EC] rounded-2xl border border-[#E8E2D5] flex items-center justify-center shrink-0">
                <PlantStylizedIllustration
                  shape={previewShape}
                  potColor={potColor}
                  potShape={potShape}
                  plantName={pickText(name, generatedProfile.name)}
                  customSvgMarkup={generatedProfile.customSvgMarkup}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-heading text-[13.5px] font-bold text-[#1C2822]">
                  {pickText(name, generatedProfile.name)}
                </div>
                <div dir="ltr" className="text-[10px] text-[#5A655E]">
                  {generatedProfile.sci}
                </div>
                <div className="persian-num text-[11px] font-bold text-[#2E5A44] mt-1">
                  💧 هر {toPersianNum(generatedProfile.waterCycleDays)} روز •{' '}
                  {toPersianNum(generatedProfile.doseMl)} سی‌سی ({generatedProfile.doseCup})
                </div>
                <div className="persian-num text-[10px] text-[#C85A32] font-bold mt-0.5">
                  🩺 {toPersianNum(generatedProfile.clinic.length)} عارضه تخصصی در کلینیک ثبت شد
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFullEditor(!showFullEditor)}
              className="w-full py-1.5 px-3 rounded-xl bg-[#E6F0EB] text-[#2E5A44] text-[11px] font-bold flex items-center justify-between"
            >
              <span>🛠️ بررسی و ویرایش جزئیات شناسنامه، آیکون و کلینیک</span>
              <span>{showFullEditor ? '▴ بستن' : '▾ باز کردن'}</span>
            </button>

            {showFullEditor && (
              <div className="space-y-2.5 pt-2 border-t border-[#E8E2D5]">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                      آیکون دوبعدی گیاه:
                    </label>
                    <select
                      value={generatedProfile.shape3D}
                      onChange={(e) =>
                        setGeneratedProfile({ ...generatedProfile, shape3D: e.target.value })
                      }
                      className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold"
                    >
                      {ALL_2D_SHAPES.map((sh) => (
                        <option key={sh.id} value={sh.id}>
                          {sh.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                      نام علمی (Latin):
                    </label>
                    <input
                      dir="ltr"
                      value={generatedProfile.sci}
                      onChange={(e) =>
                        setGeneratedProfile({ ...generatedProfile, sci: e.target.value })
                      }
                      className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[9.5px] font-bold text-[#5A655E]">
                      دوره آبیاری (روز)
                    </label>
                    <input
                      type="number"
                      value={generatedProfile.waterCycleDays}
                      onChange={(e) =>
                        setGeneratedProfile({
                          ...generatedProfile,
                          waterCycleDays: Number(e.target.value)
                        })
                      }
                      className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-[#5A655E]">
                      پیمانه (سی‌سی)
                    </label>
                    <input
                      type="number"
                      step={10}
                      value={generatedProfile.doseMl}
                      onChange={(e) => {
                        const ml = Number(e.target.value);
                        setGeneratedProfile({
                          ...generatedProfile,
                          doseMl: ml,
                          doseCup: CareCalculator.formatDoseCup(ml)
                        });
                      }}
                      className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold"
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
                      className="w-full px-2 py-1 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[10.5px] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                    داستان و هویت گیاه‌شناسی:
                  </label>
                  <textarea
                    rows={2}
                    value={generatedProfile.botanyStory}
                    onChange={(e) =>
                      setGeneratedProfile({ ...generatedProfile, botanyStory: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                  />
                </div>

                {/* ویرایشگر عارضه‌های کلینیک گیاه‌پزشکی */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#C85A32]">
                      🩺 کلینیک عارضه‌یابی ({toPersianNum(generatedProfile.clinic.length)} مورد):
                    </span>
                    <button
                      type="button"
                      onClick={handleAddClinicItem}
                      className="px-2 py-0.5 rounded-lg bg-[#2E5A44] text-white text-[10px] font-bold"
                    >
                      + افزودن عارضه
                    </button>
                  </div>

                  {generatedProfile.clinic.map((cItem, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F6F3EC] border border-[#E8E2D5] rounded-xl p-2 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <input
                          value={cItem.symptom}
                          onChange={(e) =>
                            handleUpdateClinicItem(idx, 'symptom', e.target.value)
                          }
                          placeholder="عنوان علامت / عارضه..."
                          className="flex-1 px-2 py-1 rounded-md bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-bold text-[#C85A32]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveClinicItem(idx)}
                          className="px-1.5 py-1 text-[10px] text-[#C85A32] font-bold"
                        >
                          🗑️
                        </button>
                      </div>
                      <input
                        value={cItem.cause}
                        onChange={(e) =>
                          handleUpdateClinicItem(idx, 'cause', e.target.value)
                        }
                        placeholder="علت علمی..."
                        className="w-full px-2 py-1 rounded-md bg-[#FDFBF7] border border-[#E8E2D5] text-[10px]"
                      />
                      <input
                        value={cItem.fix}
                        onChange={(e) =>
                          handleUpdateClinicItem(idx, 'fix', e.target.value)
                        }
                        placeholder="نسخه درمانی..."
                        className="w-full px-2 py-1 rounded-md bg-[#FDFBF7] border border-[#E8E2D5] text-[10px] text-[#2E5A44] font-semibold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={aiLoading}
            className="flex-1 py-3 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13px] warm-shadow"
          >
            {aiLoading
              ? '⏳ در حال ساخت...'
              : `ثبت نهایی در گلخانه با کد #${toPersianNum(String(nextIndex).padStart(2, '0'))} ✓`}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-[#F6F3EC] text-[#5A655E] font-semibold text-[12px]"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// ۲. مودال ویرایش کامل مشخصات، گلدان، شناسنامه و کلینیک گیاه
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
  const [potShape, setPotShape] = useState<PotShapeType>('round_ribbed');
  const [potVolumeLiters, setPotVolumeLiters] = useState<number>(2.0);
  const [plantHeightCm, setPlantHeightCm] = useState<number>(28);
  const [waterCycleDays, setWaterCycleDays] = useState(7);
  const [doseMl, setDoseMl] = useState(150);
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
      setPotShape(plant.potShape ? plant.potShape : 'round_ribbed');
      setPotVolumeLiters(plant.potVolumeLiters ? plant.potVolumeLiters : 2.0);
      setPlantHeightCm(plant.plantHeightCm ? plant.plantHeightCm : 28);
      setWaterCycleDays(plant.waterCycleDays);
      setDoseMl(plant.doseMl);
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

    setDoseMl(calc.doseMl);
    setDoseCup(calc.doseCup);
    setWaterCycleDays(calc.adjustedCycleDays);
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

    const newLastWateredAt = Date.now() - Number(daysSinceWater) * 86400000;
    const repotDaysAgo = Number(lastRepottedMonthsAgo) * 30;
    const isSucculent = CareCalculator.isSucculentSpecies(shape3D, name);

    const updatedStatus =
      Number(daysSinceWater) >= Number(waterCycleDays)
        ? 'thirsty'
        : isSucculent
        ? 'locked'
        : 'ok';

    const validLiters = Number(potVolumeLiters) > 0 ? Number(potVolumeLiters) : 1.5;
    const validHeight = Number(plantHeightCm) > 0 ? Number(plantHeightCm) : 25;
    const validCycle = Number(waterCycleDays) > 0 ? Number(waterCycleDays) : 7;
    const validDose = Number(doseMl) > 0 ? Number(doseMl) : 150;

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
      potVolumeLiters: validLiters,
      plantHeightCm: validHeight,
      waterCycleDays: validCycle,
      daysSinceWater: Number(daysSinceWater),
      lastWateredAt: newLastWateredAt,
      doseMl: validDose,
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
        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-4 space-y-3 max-h-[92vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2">
          <h3 className="font-heading text-[15px] font-bold text-[#1C2822] truncate">
            ✏️ ویرایش کامل «{plant.name}»
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-[#F6F3EC] text-[#1C2822] text-[11px] font-bold"
          >
            ✕ بستن
          </button>
        </div>

        {/* پیش‌نمایش زنده آیکون و گلدان */}
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
          <div className="min-w-0 flex-1 space-y-1">
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

        {/* انتخاب آیکون گیاه و شکل گلدان */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              🌿 آیکون و فرم برگ‌ها:
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
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              🏺 شکل گلدان:
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
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* رنگ گلدان */}
        <div>
          <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
            🎨 رنگ گلدان:
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {POT_COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPotColor(c.id)}
                className={`py-1 px-1 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 ${
                  potColor === c.id
                    ? 'border-[#2E5A44] ring-2 ring-[#2E5A44]/30'
                    : 'border-[#E8E2D5]'
                }`}
                style={{
                  backgroundColor: c.hex,
                  color: c.id === 'black' ? '#FFF' : c.id === 'terracotta' ? '#FFF' : '#1C2822'
                }}
              >
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* سایز گلدان و حجم خاک */}
        <div className="bg-[#E6F0EB]/60 p-3 rounded-2xl border border-[#2E5A44]/20 space-y-2">
          <span className="block text-[11px] font-bold text-[#1C2822]">
            📏 سایز گلدان و قد گیاه (بازمحاسبه خودکار فرمول آبیاری):
          </span>

          <div className="grid grid-cols-5 gap-1">
            {[
              { label: 'مینی', liters: 0.4, height: 10 },
              { label: 'کوچک', liters: 1.2, height: 18 },
              { label: 'متوسط', liters: 2.5, height: 35 },
              { label: 'بزرگ', liters: 4.5, height: 55 },
              { label: 'جام بزرگ', liters: 8.5, height: 95 }
            ].map((preset) => {
              const active = Math.abs(potVolumeLiters - preset.liters) < 0.35;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setPotVolumeLiters(preset.liters);
                    setPlantHeightCm(preset.height);
                    applySmartRecalculation(
                      preset.liters,
                      preset.height,
                      potShape,
                      garden,
                      shape3D
                    );
                  }}
                  className={`py-1 rounded-lg border text-[10px] font-bold ${
                    active
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                      : 'bg-[#FDFBF7] text-[#1C2822] border-[#E8E2D5]'
                  }`}
                >
                  <div>{preset.label}</div>
                  <div className="persian-num text-[9px] opacity-80">
                    {toPersianNum(preset.liters)}L
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                حجم خاک گلدان (لیتر)
              </label>
              <input
                type="number"
                step="0.1"
                value={potVolumeLiters}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPotVolumeLiters(val);
                  applySmartRecalculation(val, plantHeightCm, potShape, garden, shape3D);
                }}
                className="w-full px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#5A655E] mb-0.5">
                قد گیاه (سانتی‌متر)
              </label>
              <input
                type="number"
                value={plantHeightCm}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPlantHeightCm(val);
                  applySmartRecalculation(potVolumeLiters, val, potShape, garden, shape3D);
                }}
                className="w-full px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11.5px] font-bold"
              />
            </div>
          </div>
        </div>

        {/* خروجی موتور آبیاری */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              دوره آبیاری (روز)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={waterCycleDays}
              onChange={(e) => setWaterCycleDays(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              پیمانه (سی‌سی)
            </label>
            <input
              type="number"
              step={10}
              value={doseMl}
              onChange={(e) => {
                const ml = Number(e.target.value);
                setDoseMl(ml);
                setDoseCup(CareCalculator.formatDoseCup(ml));
              }}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11.5px] font-bold"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-bold text-[#1C2822] mb-1">
              معادل لیوانی
            </label>
            <input
              value={doseCup}
              onChange={(e) => setDoseCup(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-bold"
            />
          </div>
        </div>

        {/* تاریخ آخرین آبیاری و آخرین تعویض خاک */}
        <div className="bg-[#F6F3EC] p-2.5 rounded-2xl border border-[#E8E2D5] grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-[#1C2822] mb-1">
              💧 آخرین آبیاری (چند روز پیش؟)
            </label>
            <select
              value={daysSinceWater}
              onChange={(e) => setDaysSinceWater(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
            >
              <option value={0}>امروز (۰ روز پیش - سیراب)</option>
              <option value={1}>دیروز (۱ روز پیش)</option>
              <option value={2}>۲ روز پیش</option>
              <option value={3}>۳ روز پیش</option>
              <option value={4}>۴ روز پیش</option>
              <option value={5}>۵ روز پیش</option>
              <option value={7}>۷ روز پیش</option>
              <option value={10}>۱۰ روز پیش</option>
              <option value={waterCycleDays}>تشنه (موعد آبیاری امروز)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#1C2822] mb-1">
              🌱 آخرین تعویض خاک:
            </label>
            <select
              value={lastRepottedMonthsAgo}
              onChange={(e) => setLastRepottedMonthsAgo(Number(e.target.value))}
              className="w-full px-2 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold"
            >
              <option value={0}>تازه تعویض شده (همین ماه)</option>
              <option value={2}>۲ ماه پیش</option>
              <option value={3}>۳ ماه پیش</option>
              <option value={6}>۶ ماه پیش</option>
              <option value={9}>۹ ماه پیش</option>
              <option value={12}>پارسال (۱۲ ماه پیش)</option>
              <option value={18}>۱.۵ سال پیش (نیازمند تعویض)</option>
            </select>
          </div>
        </div>

        {/* بخش بازشونده ویرایش شناسنامه و کلینیک گیاه‌پزشکی */}
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
                    🗑️
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

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 py-2.5 rounded-2xl bg-[#2E5A44] text-white font-bold text-[13px] warm-shadow"
          >
            ذخیره تغییرات و بروزرسانی ✓
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-2xl bg-[#F6F3EC] text-[#5A655E] font-semibold text-[12px]"
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
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
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

        <div className="overflow-y-auto flex-1 space-y-2.5 py-1">
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