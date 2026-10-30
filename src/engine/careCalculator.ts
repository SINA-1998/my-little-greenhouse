import {
  type PlantEntity,
  type PlantStatusType,
  type PotShapeType,
  type GardenEntity
} from '../data/initialPlants';

export interface ComputedClimateMetrics {
  effectiveCycleDays: number;
  daysSinceWaterActual: number;
  daysRemaining: number;
  moisturePercent: number;
  dynamicStatus: PlantStatusType;
  isWeekendShifted: boolean;
  weekendShiftLabel: string | null;
  // شاخص‌های تفکیک‌شده برای زنگوله و مرکز عملیات
  needsWateringNow: boolean;
  needsMistingNow: boolean;
  needsQuarterTurn: boolean;
  needsFertilizerNow: boolean;
  needsRepottingSoon: boolean;
  repotProgressPercent: number;
  monthsSinceRepot: number;
  climateReducedDays: number;
  recommendedDoseMl: number;
  recommendedDoseCup: string;
  nextWateringText: string;
  nextMistingText: string;
  careSummaryBadges: string[];
}

const toPersianNum = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const RADIATOR_SENSITIVE_IDS = ['p3', 'p4', 'p5', 'p10', 'p11', 'h_p1', 'h_p2', 'h_p11', 'h_p12'];
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export class CareCalculator {
  // ۱. بررسی اینکه آیا گونه گیاهی جزو خانواده کاکتوس/ساکولنت/کم‌آب است یا خیر
  static isSucculentSpecies(shape3D: string, name: string = ''): boolean {
    const succulentShapes = [
      'cactus',
      'echeveria',
      'haworthia',
      'opuntia',
      'combo_trough',
      'combo_trough_2',
      'sedum',
      'pachypodium',
      'zz',
      'adenium',
      'sansevieria',
      'kalanchoe'
    ];
    if (succulentShapes.includes(shape3D)) return true;
    const lower = name.toLowerCase();
    return (
      lower.includes('کاکتوس') ||
      lower.includes('ساکولنت') ||
      lower.includes('کراسولا') ||
      lower.includes('هاورتیا') ||
      lower.includes('اچوریا') ||
      lower.includes('آئونیوم') ||
      lower.includes('سانسوریا') ||
      lower.includes('زامیفولیا') ||
      lower.includes('آدنیوم') ||
      lower.includes('افوربیا')
    );
  }

  // ۲. تبدیل سی‌سی به پیمانه ملموس خانگی
  static formatDoseCup(doseMl: number): string {
    if (doseMl <= 35) return '۲ قاشق غذاخوری';
    if (doseMl <= 60) return 'نصف استکان';
    if (doseMl <= 95) return '۱ استکان';
    if (doseMl <= 140) return 'نصف لیوان';
    if (doseMl <= 175) return '۲/۳ لیوان';
    if (doseMl <= 210) return '۳/۴ لیوان';
    if (doseMl <= 270) return '۱ لیوان';
    if (doseMl <= 400) return '۱.۵ لیوان';
    if (doseMl <= 550) return '۲ لیوان';
    if (doseMl <= 700) return '۲.۵ لیوان';
    return '۳ لیوان';
  }

  // ۳. تخمین خودکار حجم خاک (لیتر) از روی ابعاد دهانه و ارتفاع گلدان به سانتی‌متر
  static estimateVolumeFromDimensionsCm(
    diameterOrLengthCm: number,
    heightCm: number,
    potShape: PotShapeType = 'round_ribbed'
  ): number {
    if (potShape === 'trough' || potShape === 'trough_fluted') {
      // برای گلدان مستطیلی: طول × عرض تقریبی (۱۶cm) × ارتفاع
      const widthCm = Math.min(22, Math.max(12, Math.round(heightCm * 1.1)));
      const liters = (diameterOrLengthCm * widthCm * heightCm * 0.82) / 1000;
      return Math.max(0.3, Math.round(liters * 10) / 10);
    }
    // برای گلدان‌های گرد، جامی، الماسی و چهارگوش (فرمول مخروط ناقص)
    const radius = diameterOrLengthCm / 2;
    const liters = (Math.PI * radius * radius * heightCm * 0.78) / 1000;
    return Math.max(0.2, Math.round(liters * 10) / 10);
  }

  // ۴. موتور جامع مهندسی کشاورزی: محاسبه پیمانه آب، دوره آبیاری و دوره غبارپاشی بر اساس تمام پارامترهای فیزیکی
  static calculateAgronomicPrescription(params: {
    baseCycleDays: number;
    isSucculentOrCactus: boolean;
    isComboPlanter: boolean;
    potVolumeLiters: number;
    plantHeightCm: number;
    potShape: PotShapeType;
    gardenLightLevel?: 'high' | 'medium' | 'low';
  }): {
    doseMl: number;
    doseCup: string;
    adjustedCycleDays: number;
    mistCycleDays: number;
  } {
    const {
      baseCycleDays,
      isSucculentOrCactus,
      isComboPlanter,
      potVolumeLiters,
      plantHeightCm,
      potShape,
      gardenLightLevel = 'high'
    } = params;

    // الف) محاسبه سی‌سی آب بر اساس حجم خاک، قد گیاه و هندسه گلدان
    const baseMlPerLiter = isSucculentOrCactus ? 52 : 88;
    const heightFactor = 1 + Math.min(0.5, Math.max(-0.22, (plantHeightCm - 25) * 0.0075));

    // تاثیر هندسه گلدان روی سطح تبخیر
    let shapeEvapFactor = 1.0;
    if (potShape === 'trough' || potShape === 'trough_fluted') shapeEvapFactor = 1.14;
    else if (potShape === 'chalice_urn') shapeEvapFactor = 1.08;
    else if (potShape === 'square_patterned') shapeEvapFactor = 0.96;

    let rawMl = potVolumeLiters * baseMlPerLiter * heightFactor * shapeEvapFactor;
    if (isComboPlanter && isSucculentOrCactus) {
      rawMl = Math.max(40, rawMl * 0.88);
    }

    const doseMl = Math.max(20, Math.min(1200, Math.round(rawMl / 10) * 10));
    const doseCup = this.formatDoseCup(doseMl);

    // ب) تعدیل دوره آبیاری بر اساس حجم خاک، شکل گلدان و نور باغچه
    let cycleModifier = 1.0;
    if (potVolumeLiters <= 0.5) cycleModifier *= 0.8;
    else if (potVolumeLiters <= 1.0) cycleModifier *= 0.9;
    else if (potVolumeLiters >= 5.0) cycleModifier *= 1.18;
    else if (potVolumeLiters >= 3.5) cycleModifier *= 1.1;

    // گلدان‌های مستطیلی کم‌عمق زودتر خشک می‌شوند
    if (potShape === 'trough' || potShape === 'trough_fluted') {
      cycleModifier *= 0.92;
    }

    // تاثیر نور باغچه روی سرعت خشک شدن خاک
    if (gardenLightLevel === 'low') cycleModifier *= 1.2;
    else if (gardenLightLevel === 'medium') cycleModifier *= 1.06;

    const adjustedCycleDays = Math.max(
      2,
      Math.min(35, Math.round(baseCycleDays * cycleModifier))
    );

    const mistCycleDays = isSucculentOrCactus ? 0 : gardenLightLevel === 'high' ? 3 : 4;

    return { doseMl, doseCup, adjustedCycleDays, mistCycleDays };
  }

  // ۵. محاسبه روزهای واقعی سپری‌شده از آخرین آبیاری و غبارپاشی
  static getElapsedDaysSinceWater(plant: PlantEntity, now: Date = new Date()): number {
    if (typeof plant.lastWateredAt === 'number' && plant.lastWateredAt > 0) {
      const diffMs = now.getTime() - plant.lastWateredAt;
      return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
    }
    return plant.daysSinceWater;
  }

  static getElapsedDaysSinceMist(plant: PlantEntity, now: Date = new Date()): number {
    if (typeof plant.lastMistedAt === 'number' && plant.lastMistedAt > 0) {
      const diffMs = now.getTime() - plant.lastMistedAt;
      return Math.max(0, Math.floor(diffMs / MS_PER_DAY));
    }
    return plant.daysSinceMist ?? (plant.needsMistToday ? 99 : 1);
  }

  // ۶. ارزیابی هوشمند و لحظه‌ای وضعیت گیاه با در نظر گرفتن تمام وابستگی‌ها
  static evaluatePlant(
    plant: PlantEntity,
    radiatorOn: boolean,
    now: Date = new Date(),
    gardenObj?: GardenEntity
  ): ComputedClimateMetrics {
    const isSucculent = this.isSucculentSpecies(plant.shape3D, plant.name);

    // محاسبه پویا از روی ابعاد فعلی گلدان تا اگر کاربر گلدان را ویرایش کرد، موتور هم با آن هماهنگ باشد
    const livePrescription = this.calculateAgronomicPrescription({
      baseCycleDays: plant.waterCycleDays,
      isSucculentOrCactus: isSucculent,
      isComboPlanter: Boolean(plant.isComboPlanter),
      potVolumeLiters: plant.potVolumeLiters || 1.5,
      plantHeightCm: plant.plantHeightCm || 25,
      potShape: plant.potShape || 'round_ribbed',
      gardenLightLevel: gardenObj?.lightLevel || 'high'
    });

    let effectiveCycleDays = plant.waterCycleDays;
    let climateReducedDays = 0;

    // تاثیر شوفاژ روشن روی تبخیر خاک
    if (
      radiatorOn &&
      plant.statusType !== 'locked' &&
      plant.statusType !== 'recovery'
    ) {
      const isHighEvap =
        RADIATOR_SENSITIVE_IDS.includes(plant.id) ||
        plant.garden === 'window' ||
        plant.garden === 'home_window';
      const factor = isHighEvap ? 0.68 : 0.8;
      effectiveCycleDays = Math.max(2, Math.round(plant.waterCycleDays * factor));
      climateReducedDays = plant.waterCycleDays - effectiveCycleDays;
    }

    const daysSinceWaterActual = this.getElapsedDaysSinceWater(plant, now);
    const rawDaysRemaining = effectiveCycleDays - daysSinceWaterActual;
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + Math.max(0, rawDaysRemaining));
    const targetDayOfWeek = targetDate.getDay();

    let isWeekendShifted = false;
    let weekendShiftLabel: string | null = null;
    let adjustedDaysRemaining = rawDaysRemaining;

    // شیفت هوشمند تعطیلات آخر هفته فقط برای گلخانه محل کار
    const isOfficeSpace = (plant.spaceId || 'office') === 'office';
    if (
      isOfficeSpace &&
      rawDaysRemaining > 0 &&
      rawDaysRemaining <= 2 &&
      targetDayOfWeek === 5 &&
      plant.statusType !== 'locked' &&
      plant.statusType !== 'recovery'
    ) {
      isWeekendShifted = true;
      adjustedDaysRemaining = 0;
      weekendShiftLabel = '⚡ آبیاری پیش از تعطیلات آخر هفته';
    } else if (
      isOfficeSpace &&
      (now.getDay() === 3 || now.getDay() === 4) &&
      rawDaysRemaining <= 1 &&
      plant.statusType !== 'locked' &&
      plant.statusType !== 'recovery'
    ) {
      isWeekendShifted = true;
      adjustedDaysRemaining = 0;
      weekendShiftLabel = '⚡ آبیاری پیش از تعطیلات آخر هفته';
    }

    // بررسی نیاز به غبارپاشی هوشمند
    const mistCycle =
      plant.mistCycleDays !== undefined
        ? plant.mistCycleDays
        : !isSucculent && !plant.mistNeed.includes('نشود') && !plant.mistNeed.includes('بدون')
        ? 3
        : 0;
    const elapsedMist = this.getElapsedDaysSinceMist(plant, now);
    const effectiveMistCycle = radiatorOn && mistCycle > 0 ? Math.max(1, mistCycle - 1) : mistCycle;
    const needsMistingNow = Boolean(
      plant.needsMistToday ||
        (effectiveMistCycle > 0 && elapsedMist >= effectiveMistCycle) ||
        (radiatorOn && (plant.id === 'p5' || plant.id === 'h_p2'))
    );

    const needsWateringNow =
      plant.statusType !== 'recovery' && adjustedDaysRemaining <= 0;

    let dynamicStatus: PlantStatusType = plant.statusType;

    if (plant.statusType === 'recovery') {
      dynamicStatus = 'recovery';
    } else if (needsWateringNow) {
      dynamicStatus = 'thirsty';
    } else if (plant.statusType === 'locked' && rawDaysRemaining > 0) {
      dynamicStatus = 'locked';
    } else if (needsMistingNow) {
      dynamicStatus = 'mist';
    } else {
      dynamicStatus = 'ok';
    }

    const rawMoisture = Math.round((1 - daysSinceWaterActual / effectiveCycleDays) * 100);
    const moisturePercent =
      dynamicStatus === 'thirsty'
        ? Math.min(20, Math.max(8, rawMoisture))
        : Math.max(14, Math.min(98, rawMoisture));

    const needsQuarterTurn = Boolean(plant.needsRotation);
    const needsFertilizerNow = Boolean(plant.fertDue);

    // محاسبه وضعیت تعویض خاک
    const repotCycle = plant.repotCycleMonths || 16;
    const monthsSinceRepot = plant.lastRepottedMonthsAgo ?? 3;
    const repotProgressPercent = Math.min(
      100,
      Math.max(5, Math.round((monthsSinceRepot / repotCycle) * 100))
    );
    const needsRepottingSoon = monthsSinceRepot >= repotCycle - 1;

    let nextWateringText = '';
    if (needsWateringNow) {
      nextWateringText = isWeekendShifted
        ? 'امروز (پیش از تعطیلی جمعه)'
        : 'امروز (نیازمند آبیاری)';
    } else if (dynamicStatus === 'recovery') {
      nextWateringText = `دوره نقاهت (${toPersianNum(Math.max(1, rawDaysRemaining))} روز دیگر)`;
    } else {
      nextWateringText = `${toPersianNum(Math.max(1, adjustedDaysRemaining))} روز دیگر (دوره ${toPersianNum(effectiveCycleDays)} روزه)`;
    }

    let nextMistingText = 'بدون نیاز به غبارپاشی';
    if (effectiveMistCycle > 0) {
      const remMist = Math.max(0, effectiveMistCycle - elapsedMist);
      nextMistingText =
        remMist === 0 || needsMistingNow
          ? 'امروز (نیازمند غبارپاشی برگ‌ها)'
          : `${toPersianNum(remMist)} روز دیگر (هر ${toPersianNum(effectiveMistCycle)} روز)`;
    }

    const careSummaryBadges: string[] = [];
    if (needsWateringNow) {
      careSummaryBadges.push(plant.fertDue ? '💧🧪 آبیاری + کود' : '💧 نیازمند آبیاری');
    }
    if (needsMistingNow) {
      careSummaryBadges.push('💦 نیازمند غبارپاشی');
    }
    if (needsQuarterTurn) {
      careSummaryBadges.push('🔄 چرخش ۹۰°');
    }

    return {
      effectiveCycleDays,
      daysSinceWaterActual,
      daysRemaining: Math.max(0, adjustedDaysRemaining),
      moisturePercent,
      dynamicStatus,
      isWeekendShifted,
      weekendShiftLabel,
      needsWateringNow,
      needsMistingNow,
      needsQuarterTurn,
      needsFertilizerNow,
      needsRepottingSoon,
      repotProgressPercent,
      monthsSinceRepot,
      climateReducedDays,
      recommendedDoseMl: livePrescription.doseMl,
      recommendedDoseCup: livePrescription.doseCup,
      nextWateringText,
      nextMistingText,
      careSummaryBadges
    };
  }
}