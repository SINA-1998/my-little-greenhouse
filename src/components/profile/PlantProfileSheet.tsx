import React, { useState } from 'react';
import { type PlantEntity } from '../../data/initialPlants';
import { CareCalculator } from '../../engine/careCalculator';
import { type CareActionType } from '../../services/cloudSyncService';
import {
  IconWaterDrop,
  IconMistSpray,
  IconRotate90,
  PlantStylizedIllustration
} from '../icons/CustomIcons';
import { POT_SHAPE_OPTIONS, POT_COLOR_OPTIONS } from '../modals/LifecycleModals';

export type AccessRole = 'owner' | 'caretaker' | 'visitor';

const toPersianNum = (num: number | string) =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

export interface PlantProfileSheetProps {
  plant: PlantEntity | null;
  gardenName: string;
  userRole: AccessRole;
  radiatorOn: boolean;
  onClose: () => void;
  onRequestAction: (plant: PlantEntity, actionType: CareActionType) => void;
  onSwitchGarden: (plantId: string) => void;
  onEditPlant: (plant: PlantEntity) => void;
  onDeleteHistory: (plantId: string, logId: string) => void;
  onReportHistoryError: (plantName: string) => void;
  onOpenGuide: (topic: 'watering' | 'misting' | 'moisture') => void;
  onOpenQR: (plant: PlantEntity) => void;
  onArchivePlant: (plant: PlantEntity) => void;
  onHardDeletePlant: (plantId: string, plantName: string) => void;
  onAddCutting: (
    plantId: string,
    medium: 'در آب' | 'در پرلیت و پیت‌ماس' | 'تقسیم ریشه/پاجوش',
    note: string
  ) => void;
  onPromoteCuttingToPlant: (plant: PlantEntity, cuttingId: string) => void;
  onRemoveCutting: (plantId: string, cuttingId: string) => void;
}

export const PlantProfileSheet: React.FC<PlantProfileSheetProps> = ({
  plant,
  gardenName,
  userRole,
  radiatorOn,
  onClose,
  onRequestAction,
  onSwitchGarden,
  onEditPlant,
  onDeleteHistory,
  onReportHistoryError,
  onOpenGuide,
  onOpenQR,
  onArchivePlant,
  onHardDeletePlant,
  onAddCutting,
  onPromoteCuttingToPlant,
  onRemoveCutting
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'horticulture' | 'clinic' | 'history'>('info');
  const [cuttingMedium, setCuttingMedium] = useState<
    'در آب' | 'در پرلیت و پیت‌ماس' | 'تقسیم ریشه/پاجوش'
  >('در آب');
  const [cuttingNote, setCuttingNote] = useState('');

  if (!plant) return null;

  const isOwner = userRole === 'owner';
  const isVisitor = userRole === 'visitor';
  const metrics = CareCalculator.evaluatePlant(plant, radiatorOn);
  const cuttings = plant.cuttings || [];

  const potShapeLabel =
    POT_SHAPE_OPTIONS.find((s) => s.id === plant.potShape)?.label || 'گرد کلاسیک';
  const potColorLabel =
    POT_COLOR_OPTIONS.find((c) => c.id === plant.potColor)?.label || 'سفید';

  const handleCreateCutting = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCutting(plant.id, cuttingMedium, cuttingNote.trim());
    setCuttingNote('');
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1C2822]/55 backdrop-blur-xs transition-opacity"
      />

      <div className="relative z-50 w-full max-w-md mx-auto bg-[#FDFBF7] rounded-t-[28px] border-t border-[#E8E2D5] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* هدر شیت */}
        <div className="px-4 pt-3.5 pb-3 border-b border-[#E8E2D5] bg-[#F6F3EC]/85 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="persian-num px-2.5 py-1 rounded-xl bg-[#2E5A44] text-white text-[11.5px] font-bold shrink-0 mt-0.5">
                {plant.code}
              </span>
              <div className="min-w-0">
                <h2 className="font-heading text-[16px] font-bold text-[#1C2822] leading-snug">
                  {plant.name}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span
                    dir="ltr"
                    className="px-2 py-0.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] text-[10.5px] font-medium text-[#5A655E]"
                  >
                    {plant.sci}
                  </span>
                  {plant.nickname && (
                    <span className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold">
                      ✨ {plant.nickname}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] flex items-center justify-center gap-1 text-[#1C2822] text-[11px] font-bold shrink-0 warm-shadow active:scale-95 transition-transform"
            >
              <span>✕</span>
              <span>بستن</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-0.5 gap-1.5">
            {isOwner ? (
              <button
                onClick={() => onSwitchGarden(plant.id)}
                className="px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-[#2E5A44] flex items-center gap-1"
              >
                <span>⇄</span>
                <span>{gardenName}</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-semibold text-[#5A655E]">
                📍 {gardenName}
              </span>
            )}

            <div className="flex items-center gap-1.5">
              {isOwner && (
                <button
                  onClick={() => onEditPlant(plant)}
                  className="px-2.5 py-1 rounded-xl bg-[#E6F0EB] border border-[#2E5A44]/20 text-[11px] font-bold text-[#2E5A44]"
                >
                  ✏️ ویرایش گلدان و تقویم
                </button>
              )}
              <button
                onClick={() => onOpenQR(plant)}
                className="px-2.5 py-1 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-[11px] font-bold text-[#1C2822]"
              >
                📱 کارت QR
              </button>
            </div>
          </div>
        </div>

        {/* بدنه قابل اسکرول داخلی */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-4 pt-3 pb-36 space-y-3.5">
          {(metrics.climateReducedDays > 0 ||
            metrics.isWeekendShifted ||
            (metrics.needsQuarterTurn && !isVisitor) ||
            (metrics.needsRepottingSoon && !isVisitor)) && (
            <div className="bg-[#FCEEE9] border border-[#C85A32]/30 rounded-2xl p-3 text-[11.5px] text-[#C85A32] font-semibold space-y-1.5">
              {metrics.climateReducedDays > 0 && (
                <div className="persian-num">
                  🔥 به دلیل روشن بودن شوفاژ، دوره آبیاری از{' '}
                  {toPersianNum(plant.waterCycleDays)} روز به{' '}
                  <strong>{toPersianNum(metrics.effectiveCycleDays)} روز</strong> کاهش یافت.
                </div>
              )}
              {metrics.isWeekendShifted && (
                <div>⚡ موعد آبیاری با تعطیلی جمعه تداخل داشت و به امروز جلو افتاد.</div>
              )}
              {metrics.needsQuarterTurn && !isVisitor && (
                <div className="flex items-center justify-between bg-[#FEF6E7] border border-[#B47B26]/30 text-[#B47B26] px-2.5 py-1.5 rounded-xl">
                  <span>🔄 نوبت چرخش ۹۰ درجه گلدان رسیده است</span>
                  <button
                    onClick={() => onRequestAction(plant, 'rotate')}
                    className="px-2.5 py-1 rounded-lg bg-[#B47B26] text-white text-[10.5px] font-bold shrink-0"
                  >
                    ثبت چرخش ✓
                  </button>
                </div>
              )}
              {metrics.needsRepottingSoon && !isVisitor && (
                <div className="persian-num flex items-center justify-between bg-[#E6F0EB] border border-[#2E5A44]/30 text-[#2E5A44] px-2.5 py-1.5 rounded-xl">
                  <span>🪴 زمان بررسی ریشه و تعویض خاک فرا رسیده است</span>
                  <button
                    onClick={() => onRequestAction(plant, 'repot')}
                    className="px-2.5 py-1 rounded-lg bg-[#2E5A44] text-white text-[10.5px] font-bold shrink-0"
                  >
                    ثبت تعویض خاک
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ویترین استودیویی گیاه */}
          <div className="relative h-44 rounded-2xl bg-gradient-to-b from-[#F6F3EC] via-[#FDFBF7] to-[#E6F0EB]/40 border border-[#E8E2D5] flex flex-col items-center justify-center overflow-hidden">
            <div
              className={`w-36 h-36 rounded-full blur-2xl absolute opacity-35 ${
                metrics.dynamicStatus === 'thirsty'
                  ? 'bg-[#C85A32]'
                  : metrics.dynamicStatus === 'mist'
                  ? 'bg-[#2B7A9B]'
                  : 'bg-[#2E5A44]'
              }`}
            />

            <div className="relative z-10 transform scale-135 -mt-3">
              <PlantStylizedIllustration
                shape={plant.shape3D}
                potColor={plant.potColor}
                potShape={plant.potShape}
                plantName={plant.name}
                customSvgMarkup={plant.customSvgMarkup}
              />
            </div>
            <div className="relative z-10 w-24 h-2.5 rounded-full bg-[#2E5A44]/20 mt-1" />

            <div className="absolute bottom-2 inset-x-3 z-10 bg-[#FDFBF7]/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#E8E2D5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#1C2822]">رطوبت خاک:</span>
                <div className="w-24 h-2 bg-[#F6F3EC] rounded-full overflow-hidden border border-[#E8E2D5]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      metrics.dynamicStatus === 'thirsty' ? 'bg-[#C85A32]' : 'bg-[#2B7A9B]'
                    }`}
                    style={{ width: `${metrics.moisturePercent}%` }}
                  />
                </div>
                <span className="persian-num text-[11px] font-bold text-[#2B7A9B]">
                  {toPersianNum(metrics.moisturePercent)}٪
                </span>
              </div>
              <button
                onClick={() => onOpenGuide('moisture')}
                className="text-[10.5px] font-bold text-[#2E5A44] underline"
              >
                تست خاک چیست؟
              </button>
            </div>
          </div>

          {/* ۴ تب تخصصی */}
          <div className="grid grid-cols-4 gap-1 bg-[#F6F3EC] p-1 rounded-2xl border border-[#E8E2D5]">
            {[
              { id: 'info', label: '📋 شناسنامه' },
              { id: 'horticulture', label: '🌱 تکثیر و خاک' },
              { id: 'clinic', label: `🩺 کلینیک (${toPersianNum(plant.clinic.length)})` },
              { id: 'history', label: '📅 تاریخچه' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() =>
                  setActiveTab(t.id as 'info' | 'horticulture' | 'clinic' | 'history')
                }
                className={`py-2 rounded-xl text-[11px] transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'font-bold bg-[#FDFBF7] text-[#1C2822] warm-shadow'
                    : 'font-semibold text-[#5A655E]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* تب ۱: شناسنامه */}
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#F6F3EC]/80 border border-[#E8E2D5] rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#5A655E]">پیمانه دقیق آبیاری</span>
                    <button
                      onClick={() => onOpenGuide('watering')}
                      className="text-[10.5px] font-bold text-[#2B7A9B]"
                    >
                      ℹ️ راهنما
                    </button>
                  </div>
                  <div className="persian-num text-[12.5px] font-bold text-[#1C2822] mt-1 whitespace-nowrap">
                    {toPersianNum(plant.doseMl)} سی‌سی ({plant.doseCup})
                  </div>
                  <div className="persian-num text-[10.5px] text-[#2E5A44] font-semibold mt-0.5 truncate">
                    موعد: {metrics.nextWateringText}
                  </div>
                </div>

                <div className="bg-[#F6F3EC]/80 border border-[#E8E2D5] rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#5A655E]">رطوبت و غبارپاشی</span>
                    <button
                      onClick={() => onOpenGuide('misting')}
                      className="text-[10.5px] font-bold text-[#2B7A9B]"
                    >
                      ℹ️ چیست؟
                    </button>
                  </div>
                  <div className="text-[11.5px] font-bold text-[#1C2822] mt-1 truncate">
                    {plant.mistNeed}
                  </div>
                  <div className="persian-num text-[10px] text-[#2B7A9B] font-semibold mt-0.5 truncate">
                    {metrics.nextMistingText}
                  </div>
                </div>
              </div>

              {/* نمایش مشخصات گلدان، حجم خاک، قد و گونه‌های هم‌زیست */}
              <div className="bg-[#F6F3EC]/90 border border-[#E8E2D5] rounded-2xl p-3 space-y-2">
                <div className="persian-num flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                  <span className="font-bold text-[#1C2822]">
                    🏺 گلدان {potShapeLabel} ({potColorLabel})
                  </span>
                  <div className="flex items-center gap-1">
                    {plant.potVolumeLiters && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] font-bold text-[#2E5A44]">
                        حجم خاک: {toPersianNum(plant.potVolumeLiters)} لیتر
                      </span>
                    )}
                    {plant.plantHeightCm && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#FDFBF7] border border-[#E8E2D5] font-bold text-[#2B7A9B]">
                        قد: {toPersianNum(plant.plantHeightCm)}cm
                      </span>
                    )}
                  </div>
                </div>

                {plant.companionSpecies && plant.companionSpecies.length > 0 && (
                  <div className="pt-1.5 border-t border-[#E8E2D5] flex flex-wrap items-center gap-1">
                    <span className="text-[10.5px] font-bold text-[#5A655E]">
                      🌵 گونه‌های هم‌زیست در این گلدان:
                    </span>
                    {plant.companionSpecies.map((sp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-[#E6F0EB] text-[#2E5A44] text-[10px] font-bold"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-[#E6F0EB]/45 border border-[#2E5A44]/20 rounded-2xl p-3.5 space-y-2">
                <div className="text-[13px] font-bold text-[#2E5A44]">
                  🌍 اصالت، خاستگاه و هویت گیاه‌شناسی
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-[11.5px] bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8E2D5]">
                  <div>
                    <strong className="text-[#1C2822]">📍 زادگاه طبیعی: </strong>
                    <span className="text-[#5A655E]">{plant.origin || 'مناطق گرمسیری'}</span>
                  </div>
                  <div>
                    <strong className="text-[#1C2822]">🧬 خانواده گیاهی: </strong>
                    <span className="text-[#5A655E]">{plant.family || 'گیاهان زینتی آپارتمانی'}</span>
                  </div>
                </div>
                {plant.botanyStory && (
                  <p className="text-[12px] text-[#1C2822] leading-relaxed pt-0.5 text-justify">
                    {plant.botanyStory}
                  </p>
                )}
              </div>

              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3.5 space-y-2.5">
                <div>
                  <div className="text-[12.5px] font-bold text-[#1C2822]">☀️ نیاز نوری و موقعیت</div>
                  <p className="text-[12px] text-[#5A655E] leading-relaxed mt-0.5">{plant.light}</p>
                </div>
                <hr className="border-[#E8E2D5]" />
                <div>
                  <div className="text-[12.5px] font-bold text-[#1C2822]">🌱 ترکیب خاک و رژیم کوددهی</div>
                  <p className="text-[12px] text-[#5A655E] leading-relaxed mt-0.5">{plant.soilFert}</p>
                </div>
              </div>

              {isOwner && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onArchivePlant(plant)}
                    className="py-2.5 px-3 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] text-[11.5px] font-bold hover:text-[#1C2822]"
                  >
                    🏛️ انتقال به تالار یادبود
                  </button>
                  <button
                    onClick={() => onHardDeletePlant(plant.id, plant.name)}
                    className="py-2.5 px-3 rounded-2xl bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] text-[11.5px] font-bold"
                  >
                    🗑️ حذف دائمی گیاه
                  </button>
                </div>
              )}
            </div>
          )}

          {/* تب ۲: تکثیر، قلمه‌زنی، هرس و تعویض خاک */}
          {activeTab === 'horticulture' && (
            <div className="space-y-3.5">
              <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3.5 space-y-3 warm-shadow">
                <div className="text-[13px] font-bold text-[#1C2822]">
                  ✂️🪴 عملیات‌های بهسازی، هرس و تقویم تعویض خاک
                </div>

                <div className="space-y-2.5 text-[11.5px] bg-[#F6F3EC]/80 p-3 rounded-xl border border-[#E8E2D5]">
                  <div>
                    <strong className="text-[#2E5A44]">✂️ اصول هرس این گیاه: </strong>
                    <span className="text-[#5A655E]">
                      {plant.pruningGuide ||
                        'برگ‌های زرد یا آسیب‌دیده را از پایه جدا کنید و سرشاخه‌های بلند را در بهار سرزنی نمایید.'}
                    </span>
                  </div>
                  <hr className="border-[#E8E2D5]" />
                  <div className="space-y-1.5">
                    <div className="persian-num flex items-center justify-between">
                      <span>
                        <strong className="text-[#1C2822]">🪴 آخرین تعویض خاک: </strong>
                        <span className="text-[#5A655E]">
                          {plant.lastRepottedDate || 'ثبت نشده'} ({toPersianNum(metrics.monthsSinceRepot)} ماه پیش)
                        </span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#FDFBF7] border border-[#E8E2D5] text-[10px] font-bold text-[#2E5A44]">
                        دوره: هر {toPersianNum(plant.repotCycleMonths || 16)} ماه
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#FDFBF7] rounded-full overflow-hidden border border-[#E8E2D5]">
                      <div
                        className={`h-full rounded-full ${
                          metrics.needsRepottingSoon ? 'bg-[#C85A32]' : 'bg-[#2E5A44]'
                        }`}
                        style={{ width: `${metrics.repotProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {!isVisitor && (
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onRequestAction(plant, 'prune')}
                      className="py-2 px-2 rounded-xl bg-[#E6F0EB] text-[#2E5A44] border border-[#2E5A44]/20 text-[11px] font-bold whitespace-nowrap"
                    >
                      ✂️ ثبت هرس
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestAction(plant, 'repot')}
                      className="py-2 px-2 rounded-xl bg-[#FEF6E7] text-[#B47B26] border border-[#B47B26]/30 text-[11px] font-bold whitespace-nowrap"
                    >
                      🪴 تعویض خاک
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestAction(plant, 'clean_leaves')}
                      className="py-2 px-2 rounded-xl bg-[#E8F4F8] text-[#2B7A9B] border border-[#2B7A9B]/25 text-[11px] font-bold whitespace-nowrap"
                    >
                      ✨ غبارروبی برگ
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#E6F0EB]/50 border border-[#2E5A44]/25 rounded-2xl p-3.5 space-y-3">
                <div>
                  <div className="text-[13px] font-bold text-[#2E5A44]">
                    🌱 ایستگاه تکثیر و قلمه‌زنی «{plant.name}»
                  </div>
                  <p className="text-[11.5px] text-[#1C2822] leading-relaxed mt-1">
                    <strong>روش تخصصی تکثیر: </strong>
                    {plant.propagationGuide ||
                      'قلمه ساقه یا برگ سالم در آب جوشیده سردشده یا بستر پرلیت مرطوب.'}
                  </p>
                </div>

                {!isVisitor && (
                  <form
                    onSubmit={handleCreateCutting}
                    className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E8E2D5] space-y-2"
                  >
                    <div className="text-[11.5px] font-bold text-[#1C2822]">
                      ➕ ثبت قلمه یا پاجوش جدید از این گیاه مادر:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <select
                        value={cuttingMedium}
                        onChange={(e) => setCuttingMedium(e.target.value as any)}
                        className="px-2 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px] font-semibold"
                      >
                        <option value="در آب">💧 ریشه‌زایی در آب</option>
                        <option value="در پرلیت و پیت‌ماس">🌱 کاشت در پرلیت</option>
                        <option value="تقسیم ریشه/پاجوش">🪴 جدا کردن پاجوش</option>
                      </select>
                      <input
                        value={cuttingNote}
                        onChange={(e) => setCuttingNote(e.target.value)}
                        placeholder="یادداشت (مثلاً: ۲ برگ سالم)..."
                        className="px-2.5 py-1.5 rounded-lg bg-[#F6F3EC] border border-[#E8E2D5] text-[11px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-[#2E5A44] text-white text-[11.5px] font-bold"
                    >
                      + ثبت قلمه در ایستگاه تکثیر
                    </button>
                  </form>
                )}

                {cuttings.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11.5px] font-bold text-[#1C2822]">
                      🧪 قلمه‌های فعال در حال ریشه‌زایی ({toPersianNum(cuttings.length)} مورد):
                    </div>
                    {cuttings.map((cut) => (
                      <div
                        key={cut.id}
                        className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl p-2.5 space-y-2"
                      >
                        <div className="flex items-center justify-between text-[11.5px]">
                          <span className="font-bold text-[#2E5A44]">🌱 بستر: {cut.medium}</span>
                          <span className="persian-num text-[10.5px] text-[#5A655E]">
                            📅 شروع: {cut.startDate}
                          </span>
                        </div>
                        {cut.note && (
                          <div className="text-[11px] text-[#5A655E]">یادداشت: {cut.note}</div>
                        )}
                        {isOwner && (
                          <div className="flex items-center gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => onPromoteCuttingToPlant(plant, cut.id)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-[#2E5A44] text-white text-[10.5px] font-bold"
                            >
                              🪴 ریشه داد! تبدیل به گلدان مستقل در گلخانه
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveCutting(plant.id, cut.id)}
                              className="py-1.5 px-2.5 rounded-lg bg-[#FCEEE9] text-[#C85A32] text-[10.5px] font-bold"
                            >
                              حذف
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* تب ۳: کلینیک */}
          {activeTab === 'clinic' && (
            <div className="space-y-2.5">
              <div className="bg-[#FEF6E7] border border-[#B47B26]/30 rounded-2xl p-3 text-[12px] text-[#1C2822] leading-relaxed">
                🩺 <strong>دائرةالمعارف بالینی «{plant.name}»:</strong> در صورت مشاهده هر یک از علائم زیر روی برگ، ساقه یا خاک، علت و نسخه درمانی زیر را اجرا کنید:
              </div>
              {plant.clinic.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3.5 space-y-1.5 warm-shadow"
                >
                  <div className="text-[13px] font-bold text-[#C85A32] flex items-start gap-1.5">
                    <span className="persian-num px-1.5 py-0.2 rounded-md bg-[#FCEEE9] text-[11px] shrink-0 mt-0.5">
                      عارضه {toPersianNum(idx + 1)}
                    </span>
                    <span>{item.symptom}</span>
                  </div>
                  <div className="text-[12px] text-[#5A655E] leading-relaxed">
                    <strong className="text-[#1C2822]">🔍 علت گیاه‌پزشکی:</strong> {item.cause}
                  </div>
                  <div className="text-[12px] text-[#1C2822] bg-[#E6F0EB]/60 p-2.5 rounded-xl border border-[#2E5A44]/15 leading-relaxed">
                    <strong>✅ نسخه و راهکار اجرایی:</strong> {item.fix}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* تب ۴: تاریخچه */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {plant.history.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-2xl p-3.5 flex items-center justify-between gap-2 warm-shadow"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="persian-num text-[13px] font-bold text-[#1C2822] flex flex-wrap items-center gap-1.5">
                      <span>{log.action}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-[#E6F0EB] text-[#2E5A44] text-[10.5px] font-bold">
                        توسط {log.by}
                      </span>
                    </div>
                    <div className="persian-num flex flex-wrap items-center gap-1.5 text-[11px] text-[#5A655E]">
                      {log.persianDate && (
                        <span className="px-2 py-0.5 rounded-md bg-[#F6F3EC] border border-[#E8E2D5] text-[#1C2822] font-semibold">
                          📅 {log.persianDate}
                        </span>
                      )}
                      <span>🕒 {log.time}</span>
                    </div>
                    {log.note && (
                      <div className="text-[11.5px] text-[#2E5A44] bg-[#F6F3EC]/60 px-2.5 py-1 rounded-lg border border-[#E8E2D5]/70">
                        💬 یادداشت: «{log.note}»
                      </div>
                    )}
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => onDeleteHistory(plant.id, log.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FCEEE9] text-[#C85A32] text-[11px] font-bold shrink-0"
                    >
                      حذف
                    </button>
                  )}
                  {userRole === 'caretaker' && (
                    <button
                      onClick={() => onReportHistoryError(plant.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#F6F3EC] text-[#5A655E] text-[10.5px] font-semibold shrink-0"
                    >
                      🚩 گزارش خطا
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* نوار عملیات پایین شیت */}
        <div className="absolute bottom-0 inset-x-0 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8E2D5] px-3.5 py-2.5">
          {isVisitor ? (
            <div className="w-full py-2.5 px-3 rounded-2xl bg-[#E6F0EB]/80 border border-[#2E5A44]/20 text-center text-[12px] font-semibold text-[#2E5A44]">
              🌱 نمای نمایشگاهی گلخانه کوچک من • از حضور و توجه شما به طبیعت سپاسگزاریم
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => onRequestAction(plant, 'water')}
                className={`w-full h-[44px] rounded-2xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all warm-shadow whitespace-nowrap ${
                  metrics.dynamicStatus === 'locked' || metrics.dynamicStatus === 'recovery'
                    ? 'bg-[#F6F3EC] text-[#5A655E] border border-[#E8E2D5]'
                    : plant.fertDue
                    ? 'bg-[#2E5A44] text-white'
                    : 'bg-[#2B7A9B] text-white'
                }`}
              >
                <IconWaterDrop className="w-4 h-4 shrink-0" />
                <span className="persian-num">
                  {metrics.dynamicStatus === 'locked' || metrics.dynamicStatus === 'recovery'
                    ? `سیراب است • بی‌نیاز از آبیاری (${toPersianNum(plant.doseMl)} سی‌سی)`
                    : plant.fertDue
                    ? `ثبت آبیاری + کود (${toPersianNum(plant.doseMl)} سی‌سی • ${plant.doseCup})`
                    : `ثبت آبیاری (${toPersianNum(plant.doseMl)} سی‌سی • معادل ${plant.doseCup})`}
                </span>
              </button>

              <div className="grid grid-cols-12 gap-1.5">
                <button
                  onClick={() => onRequestAction(plant, 'mist')}
                  className="col-span-4 h-[38px] rounded-xl font-bold text-[11.5px] bg-[#E6F0EB] text-[#2E5A44] border border-[#2E5A44]/20 flex items-center justify-center gap-1 whitespace-nowrap"
                >
                  <IconMistSpray className="w-3.5 h-3.5 shrink-0" />
                  <span>غبارپاشی</span>
                </button>

                <button
                  onClick={() => onRequestAction(plant, 'rotate')}
                  className={`col-span-3 h-[38px] rounded-xl font-bold text-[11px] border flex items-center justify-center gap-1 whitespace-nowrap ${
                    metrics.needsQuarterTurn
                      ? 'bg-[#FEF6E7] text-[#B47B26] border-[#B47B26]/40'
                      : 'bg-[#F6F3EC] text-[#5A655E] border-[#E8E2D5]'
                  }`}
                >
                  <IconRotate90 className="w-3.5 h-3.5 shrink-0" />
                  <span className="persian-num">چرخش ۹۰°</span>
                </button>

                <button
                  onClick={() => onRequestAction(plant, 'snooze')}
                  className="col-span-5 h-[38px] rounded-xl font-semibold text-[10.5px] bg-[#F6F3EC] text-[#1C2822] border border-[#E8E2D5] flex items-center justify-center whitespace-nowrap px-1.5"
                >
                  ⏳ خاک مرطوب (تعویق آبیاری)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};