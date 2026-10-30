import React from 'react';
import { type PotColorType, type PotShapeType } from '../../data/initialPlants';

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

// پالت رنگی واقع‌گرایانه برای ۶ رنگ گلدان (به همراه سایه و خطوط برجسته)
const getPotPalette = (potColor: PotColorType | string) => {
  switch (potColor) {
    case 'black':
      return { fill: '#262B30', shade: '#1B1F23', stroke: '#111417', detail: '#3B424A' };
    case 'mint':
      return { fill: '#CBEAD9', shade: '#B2DEC7', stroke: '#7BAF96', detail: '#94C9AE' };
    case 'terracotta':
      return { fill: '#D97B54', shade: '#C26540', stroke: '#8F4326', detail: '#E69573' };
    case 'grey':
      return { fill: '#9CA3AF', shade: '#848C99', stroke: '#555E6B', detail: '#B6BDC7' };
    case 'cream':
      return { fill: '#F5EFE0', shade: '#EAE0C8', stroke: '#C8BCA2', detail: '#DDD2B8' };
    case 'white':
    default:
      return { fill: '#FFFFFF', shade: '#F2EFE9', stroke: '#CFC8B8', detail: '#E2DDD0' };
  }
};

// تشخیص هوشمند مدل گلدان در صورتی که به کامپوننت پاس داده نشده باشد
const resolveEffectivePotShape = (shape: string, explicitPotShape?: PotShapeType): PotShapeType => {
  if (explicitPotShape) return explicitPotShape;
  if (shape === 'combo_trough' || shape === 'combo_trough_2') return 'trough_fluted';
  if (shape === 'christmas_cactus' || shape === 'climbing_rose' || shape === 'rose_bush') {
    return 'chalice_urn';
  }
  if (shape === 'sansevieria') return 'square_patterned';
  if (shape === 'aglaonema' || shape === 'zz' || shape === 'sedum' || shape === 'dieffenbachia') {
    return 'faceted_gem';
  }
  if (shape === 'dracaena' || shape === 'tradescantia') return 'cylinder_modern';
  return 'round_ribbed';
};

export const PlantStylizedIllustration: React.FC<{
  shape: string;
  potColor: PotColorType | string;
  potShape?: PotShapeType;
  plantName?: string;
  customSvgMarkup?: string;
}> = ({ shape, potColor, potShape, plantName = '', customSvgMarkup }) => {
  const palette = getPotPalette(potColor);
  const effectivePotShape = resolveEffectivePotShape(shape, potShape);

  // ۱. اگر کد SVG اختصاصی توسط هوش مصنوعی ذخیره شده باشد
  if (customSvgMarkup && customSvgMarkup.trim().startsWith('<svg')) {
    return (
      <div
        className="w-24 h-24 flex items-center justify-center drop-shadow-xs"
        dangerouslySetInnerHTML={{ __html: customSvgMarkup }}
      />
    );
  }

  // ۲. گلدان مستطیلی کنگره‌دار شماره ۱ (مشابه عکس ۴: مامیلاریا، کراسولا گولوم، آئونیوم بنفش و کراسولا یشم)
  if (shape === 'combo_trough') {
    return (
      <svg className="w-26 h-23 drop-shadow-xs" viewBox="0 0 116 92" fill="none">
        {/* بستر خاک و دانه‌های سفید پرلیت */}
        <rect x="14" y="51" width="88" height="5" rx="2" fill="#6E5039" />
        {[20, 29, 36, 44, 55, 64, 73, 82, 91, 97].map((px, idx) => (
          <circle key={idx} cx={px} cy={53 + (idx % 2)} r="1.2" fill="#F4F1EA" opacity="0.9" />
        ))}

        {/* ۱. کاکتوس توپی مامیلاریا با خارهای سفید ستاره‌ای (سمت چپ) */}
        <g>
          <circle cx="25" cy="44" r="9.5" fill="#4D9057" stroke="#285932" strokeWidth="1.2" />
          <circle cx="25" cy="44" r="6.5" fill="#5FA86A" stroke="#367041" strokeWidth="0.8" strokeDasharray="2 2" />
          {[
            [21, 39], [25, 38], [29, 39],
            [20, 44], [25, 44], [30, 44],
            [22, 49], [28, 49]
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="0.9" fill="#FFFBEB" />
              <path d={`M${cx - 1.5} ${cy}H${cx + 1.5}M${cx} ${cy - 1.5}V${cy + 1.5}`} stroke="#FEF3C7" strokeWidth="0.6" />
            </g>
          ))}
        </g>

        {/* ۲. کراسولا گولوم / لوله‌ای شاخ‌بزی با تنه چوبی (وسط-چپ) */}
        <g>
          <path d="M44 53V45" stroke="#8C6D53" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M44 46C40 42 38 36 39 32C41 32 43 38 44 45Z" fill="#40916C" stroke="#1B4332" strokeWidth="1" />
          <path d="M44 45C44 38 43 30 45 27C47 30 47 38 44 45Z" fill="#52B788" stroke="#1B4332" strokeWidth="1" />
          <path d="M44 46C47 41 50 36 49 31C47 31 45 38 44 46Z" fill="#40916C" stroke="#1B4332" strokeWidth="1" />
          <ellipse cx="39.2" cy="32" rx="1.6" ry="1" fill="#D94E34" />
          <ellipse cx="45" cy="27.2" rx="1.7" ry="1" fill="#D94E34" />
          <ellipse cx="48.8" cy="31.2" rx="1.6" ry="1" fill="#D94E34" />
        </g>

        {/* ۳. ساکولنت آئونیوم بنفش/مشکی با مرکز سبز روشن (وسط-راست) */}
        <g>
          {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
            <ellipse
              key={deg}
              cx="65"
              cy="34"
              rx="3.6"
              ry="10"
              transform={`rotate(${deg} 65 41)`}
              fill="#4A2545"
              stroke="#2D1429"
              strokeWidth="0.9"
            />
          ))}
          {[18, 78, 138, 198, 258, 318].map((deg) => (
            <ellipse
              key={deg}
              cx="65"
              cy="36.5"
              rx="2.8"
              ry="6.5"
              transform={`rotate(${deg} 65 41)`}
              fill="#6A3863"
              stroke="#3D1E38"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="65" cy="41" r="4.2" fill="#74C69D" />
          <circle cx="65" cy="41" r="2" fill="#B7E4C7" />
        </g>

        {/* ۴. کراسولا خرفه‌ای / درختچه یشم با ساقه قهوه‌ای (سمت راست) */}
        <g>
          <path d="M88 53L90 36M90 42L84 37M90 39L96 34" stroke="#7F5539" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="83" cy="36" rx="4.5" ry="2.6" transform="rotate(-20 83 36)" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="96" cy="33" rx="4.5" ry="2.6" transform="rotate(20 96 33)" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="87" cy="29" rx="4.8" ry="2.7" transform="rotate(-15 87 29)" fill="#74C69D" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="94" cy="27" rx="4.5" ry="2.6" transform="rotate(18 94 27)" fill="#74C69D" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="90" cy="23" rx="3.8" ry="2.2" fill="#95D5B2" stroke="#2D6A4F" strokeWidth="0.9" />
        </g>

        {/* بدنه گلدان مستطیلی کنگره‌دار سفید همراه با زیرگلدانی (مشابه عکس ۴) */}
        <rect x="9" y="52" width="98" height="5.5" rx="2.7" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.5" />
        <path
          d="M13 57.5H103L99 79C98.5 81 96.5 82 94.5 82H21.5C19.5 82 17.5 81 17 79L13 57.5Z"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="1.6"
        />
        {[22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map((x) => (
          <line key={x} x1={x} y1="58" x2={x + (x < 58 ? 1 : -1)} y2="81" stroke={palette.detail} strokeWidth="1.3" />
        ))}
        <rect x="12" y="81.5" width="92" height="4.5" rx="2.2" fill={palette.shade} stroke={palette.stroke} strokeWidth="1.3" />
      </svg>
    );
  }

  // ۳. گلدان مستطیلی کنگره‌دار شماره ۲ (مشابه عکس ۷: کراسولا، هاورتیا ببری، افوربیا ستونی و آئونیوم)
  if (shape === 'combo_trough_2') {
    return (
      <svg className="w-26 h-23 drop-shadow-xs" viewBox="0 0 116 92" fill="none">
        <rect x="14" y="51" width="88" height="5" rx="2" fill="#6E5039" />
        {[22, 33, 45, 58, 70, 81, 93].map((px, idx) => (
          <circle key={idx} cx={px} cy={53} r="1.2" fill="#F4F1EA" />
        ))}

        {/* ۱. کراسولا جوان (چپ) */}
        <g>
          <path d="M26 53V38" stroke="#6C584C" strokeWidth="2.2" />
          <ellipse cx="22" cy="43" rx="4.5" ry="2.5" transform="rotate(-18 22 43)" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="30" cy="41" rx="4.5" ry="2.5" transform="rotate(18 30 41)" fill="#52B788" stroke="#2D6A4F" strokeWidth="1" />
          <ellipse cx="26" cy="36" rx="4.8" ry="2.6" fill="#74C69D" stroke="#2D6A4F" strokeWidth="1" />
        </g>

        {/* ۲. هاورتیا / آلوئه ببری خال‌دار (وسط-چپ) */}
        <g>
          <path d="M48 53L39 34L46 42L48 29L51 42L57 34L48 53Z" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.1" />
          <path d="M43 39H53M45 44H51M46 48H50" stroke="#D8F3DC" strokeWidth="1.3" strokeDasharray="2 2" strokeLinecap="round" />
        </g>

        {/* ۳. افوربیا ستونی منشعب (وسط-راست) */}
        <g>
          <rect x="66" y="31" width="5.5" height="22" rx="2.5" fill="#40916C" stroke="#1B4332" strokeWidth="1.1" />
          <path d="M66 41C61 40 60 36 61 33" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />
          <path d="M71.5 39C76 38 77 34 76 31" stroke="#52B788" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* ۴. ساکولنت آئونیوم رزت (راست) */}
        <g>
          <circle cx="91" cy="43" r="8" fill="#52B788" stroke="#2D6A4F" strokeWidth="1.1" />
          <circle cx="91" cy="43" r="4.5" fill="#74C69D" stroke="#2D6A4F" strokeWidth="0.9" />
          <circle cx="91" cy="43" r="1.8" fill="#D8F3DC" />
        </g>

        <rect x="9" y="52" width="98" height="5.5" rx="2.7" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.5" />
        <path
          d="M13 57.5H103L99 79C98.5 81 96.5 82 94.5 82H21.5C19.5 82 17.5 81 17 79L13 57.5Z"
          fill={palette.fill}
          stroke={palette.stroke}
          strokeWidth="1.6"
        />
        {[22, 30, 38, 46, 54, 62, 70, 78, 86, 94].map((x) => (
          <line key={x} x1={x} y1="58" x2={x} y2="81" stroke={palette.detail} strokeWidth="1.3" />
        ))}
        <rect x="12" y="81.5" width="92" height="4.5" rx="2.2" fill={palette.shade} stroke={palette.stroke} strokeWidth="1.3" />
      </svg>
    );
  }

  // ۴. رندرکننده ۶ مدل واقعی گلدان (گرد شیاردار، الماسی چندوجهی، چهارگوش طرح‌دار، جامی پایه‌دار، استوانه‌ای مدرن)
  const renderPotGeometry = () => {
    switch (effectivePotShape) {
      case 'chalice_urn':
        // گلدان جامی پایه‌دار سلطنتی (مشابه عکس ۵ و ۶: گلدان رزها و کاکتوس کریسمس)
        return (
          <g>
            <ellipse cx="50" cy="54" rx="20" ry="3.2" fill="#5C4033" />
            <rect x="28" y="52" width="44" height="4" rx="2" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.5" />
            <path
              d="M31 56H69L64 71C63 74 58 75.5 50 75.5C42 75.5 37 74 36 71L31 56Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.6"
            />
            {[38, 44, 50, 56, 62].map((x) => (
              <line key={x} x1={x} y1="56.5" x2={x + (50 - x) * 0.18} y2="74.5" stroke={palette.detail} strokeWidth="1.2" />
            ))}
            <path
              d="M45 75.5H55L59 84H41L45 75.5Z"
              fill={palette.shade}
              stroke={palette.stroke}
              strokeWidth="1.5"
            />
            <rect x="37" y="83.5" width="26" height="3.5" rx="1.7" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.4" />
          </g>
        );

      case 'faceted_gem':
        // گلدان سفید طرح الماسی / چندوجهی هندسی (مشابه عکس ۱: آگلونما و کاج نانا لب پنجره)
        return (
          <g>
            <ellipse cx="50" cy="54" rx="18" ry="2.8" fill="#5C4033" />
            <path
              d="M31 54H69L71 65L63 82H37L29 65L31 54Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M31 54L39 65L50 54L61 65L69 54M29 65H71M39 65L37 82M39 65L50 82L61 65M61 65L63 82"
              stroke={palette.detail}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'square_patterned':
        // گلدان چهارگوش لبه پهن با بافت لوزی برجسته (مشابه عکس ۳: گلدان سبز پاستلی سانسوریا)
        return (
          <g>
            <rect x="28" y="52.5" width="44" height="4.5" rx="2" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.6" />
            <path
              d="M31 57H69L65 83H35L31 57Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
            <path
              d="M36 62H64M37 68H63M38 74H62M42 57L39 83M50 57V83M58 57L61 83"
              stroke={palette.detail}
              strokeWidth="1.1"
              strokeOpacity="0.85"
            />
          </g>
        );

      case 'cylinder_modern':
        // گلدان استوانه‌ای مدرن با زیرگلدانی چسبیده (مشابه عکس ۷: گلدان موسی در گهواره)
        return (
          <g>
            <ellipse cx="50" cy="54" rx="17" ry="2.8" fill="#5C4033" />
            <path
              d="M32 54H68L66 79H34L32 54Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.7"
            />
            <path
              d="M33.5 78.5H66.5L65.5 83.5H34.5L33.5 78.5Z"
              fill={palette.shade}
              stroke={palette.stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      case 'round_ribbed':
      default:
        // گلدان گرد شیاردار کلاسیک به همراه زیرگلدانی (مشابه عکس ۲، ۷ و ۸)
        return (
          <g>
            <ellipse cx="50" cy="54" rx="18" ry="2.8" fill="#5C4033" />
            <rect x="30" y="52.5" width="40" height="4" rx="2" fill={palette.fill} stroke={palette.stroke} strokeWidth="1.5" />
            <path
              d="M33 56.5H67L63 80C62.5 81.8 60.5 82.5 58.5 82.5H41.5C39.5 82.5 37.5 81.8 37 80L33 56.5Z"
              fill={palette.fill}
              stroke={palette.stroke}
              strokeWidth="1.7"
            />
            {[39, 44.5, 50, 55.5, 61].map((x) => (
              <line key={x} x1={x} y1="57" x2={x + (50 - x) * 0.14} y2="81.5" stroke={palette.detail} strokeWidth="1.2" />
            ))}
            <rect x="34" y="81.5" width="32" height="3.2" rx="1.6" fill={palette.shade} stroke={palette.stroke} strokeWidth="1.2" />
          </g>
        );
    }
  };

  // ۵. رندر شاخ‌وبرگ اختصاصی و پرجزئیات برای تمام گونه‌های محل کار و خانه
  const renderFoliage = () => {
    switch (shape) {
      case 'sansevieria':
        // سانسوریا شمشیری ابلق و سبز بلند بسته‌شده با روبان صورتی (مشابه عکس ۳)
        return (
          <g>
            <path d="M42 54C39 38 37 22 39 7C43 20 45 36 46 54Z" fill="#2D6A4F" stroke="#84CC16" strokeWidth="1.3" />
            <path d="M58 54C61 38 63 20 60 6C56 20 55 36 54 54Z" fill="#2D6A4F" stroke="#A3E635" strokeWidth="1.3" />
            <path d="M47 54C46 35 47 16 50 3C53 16 54 35 53 54Z" fill="#40916C" stroke="#BEF264" strokeWidth="1.4" />
            <path d="M36 54C33 42 32 30 34 19C38 28 39 41 41 54Z" fill="#1B4332" stroke="#74C69D" strokeWidth="1.1" />
            <path d="M64 54C67 42 68 29 65 18C61 28 60 41 59 54Z" fill="#1B4332" stroke="#74C69D" strokeWidth="1.1" />
            {/* خطوط افقی ببری روی برگ‌های سانسوریا */}
            <path d="M48 16H52M47 24H53M47 32H53M40 26H44M56 25H60" stroke="#B7E4C7" strokeWidth="1.2" strokeLinecap="round" opacity="0.75" />
            {/* روبان صورتی دور برگ‌های سانسوریا دقیقاً مثل عکس ۳ */}
            <rect x="35" y="35" width="30" height="3.2" rx="1.6" fill="#EC4899" stroke="#BE185D" strokeWidth="0.9" />
            <path d="M56 36.5L62 41M56 36.5L61 33" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'christmas_cactus':
        // کاکتوس کریسمس / زیگوکاکتوس آبشاری بندبند (مشابه عکس ۶)
        return (
          <g>
            {[
              { d: 'M46 53 Q36 44 26 48 Q18 52 13 62', color: '#52B788' },
              { d: 'M48 52 Q38 36 28 36 Q19 36 14 44', color: '#74C69D' },
              { d: 'M50 52 Q50 32 50 18', color: '#40916C' },
              { d: 'M52 52 Q62 36 72 36 Q81 36 86 44', color: '#74C69D' },
              { d: 'M54 53 Q64 44 74 48 Q82 52 87 62', color: '#52B788' },
              { d: 'M44 54 Q35 54 27 64 Q22 70 20 77', color: '#40916C' },
              { d: 'M56 54 Q65 54 73 64 Q78 70 80 77', color: '#40916C' }
            ].map((branch, idx) => (
              <path
                key={idx}
                d={branch.d}
                stroke={branch.color}
                strokeWidth="4.6"
                strokeLinecap="round"
                strokeDasharray="6 2.2"
              />
            ))}
            {/* بندهای بالایی روشن‌تر */}
            <ellipse cx="44" cy="28" rx="3" ry="6" transform="rotate(-25 44 28)" fill="#A3E635" stroke="#3F6212" strokeWidth="0.9" />
            <ellipse cx="56" cy="28" rx="3" ry="6" transform="rotate(25 56 28)" fill="#A3E635" stroke="#3F6212" strokeWidth="0.9" />
            <ellipse cx="35" cy="42" rx="3.2" ry="6" transform="rotate(-55 35 42)" fill="#84CC16" stroke="#3F6212" strokeWidth="0.9" />
            <ellipse cx="65" cy="42" rx="3.2" ry="6" transform="rotate(55 65 42)" fill="#84CC16" stroke="#3F6212" strokeWidth="0.9" />
            {/* غنچه کوچک یاقوتی در نوک ساقه */}
            <circle cx="13" cy="62" r="2.3" fill="#E11D48" />
            <circle cx="87" cy="62" r="2.3" fill="#E11D48" />
          </g>
        );

      case 'spider_plant':
        // گندمی ابلق فواره‌ای با ساقه رونده و گندمک آویز (مشابه عکس ۸)
        return (
          <g>
            {[
              'M50 54 Q34 36 14 48',
              'M50 54 Q30 44 12 64',
              'M50 54 Q38 24 22 24',
              'M50 54 Q46 22 44 10',
              'M50 54 Q54 22 58 10',
              'M50 54 Q62 24 78 24',
              'M50 54 Q66 36 86 48',
              'M50 54 Q70 44 88 64'
            ].map((d, i) => (
              <g key={i}>
                <path d={d} stroke="#2D6A4F" strokeWidth="4.2" strokeLinecap="round" fill="none" />
                <path d={d} stroke="#ECFCCB" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </g>
            ))}
            {/* ساقه رونده طلایی و گندمک آویزان در پایین گلدان (مشابه عکس ۸) */}
            <path d="M44 54 Q30 66 26 83" stroke="#CA8A04" strokeWidth="1.5" fill="none" />
            <g transform="translate(26, 82)">
              <path d="M0 0L-6 5M0 0L6 5M0 0L-4 -5M0 0L4 -5M0 0V7" stroke="#4D7C0F" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="0" cy="0" r="1.8" fill="#FEF08A" />
            </g>
          </g>
        );

      case 'purple_heart':
        // برگ‌بیدی بنفش / زبرینا (مشابه عکس ۸)
        return (
          <g>
            {[
              { cx: 34, cy: 42, rot: -35, fill: '#581C87' },
              { cx: 66, cy: 42, rot: 35, fill: '#581C87' },
              { cx: 38, cy: 31, rot: -22, fill: '#7E22CE' },
              { cx: 62, cy: 31, rot: 22, fill: '#6B21A8' },
              { cx: 45, cy: 25, rot: -10, fill: '#86198F' },
              { cx: 55, cy: 25, rot: 10, fill: '#701A75' },
              { cx: 50, cy: 36, rot: 0, fill: '#4C1D95' }
            ].map((lf, i) => (
              <g key={i}>
                <ellipse
                  cx={lf.cx}
                  cy={lf.cy}
                  rx="5.5"
                  ry="13"
                  transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}
                  fill={lf.fill}
                  stroke="#3B0764"
                  strokeWidth="1.1"
                />
                <ellipse
                  cx={lf.cx}
                  cy={lf.cy}
                  rx="2"
                  ry="9"
                  transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}
                  fill="#A855F7"
                  opacity="0.45"
                />
              </g>
            ))}
            <circle cx="50" cy="20" r="2.5" fill="#F472B6" />
          </g>
        );

      case 'peperomia':
        // پپرومیا برگ‌قاشقی ابلق (مشابه عکس ۷ سمت راست)
        return (
          <g>
            <path d="M50 54V20M50 42L38 34M50 36L62 28M50 28L40 20" stroke="#65A30D" strokeWidth="2.4" strokeLinecap="round" />
            {[
              { cx: 37, cy: 39, rot: -20 },
              { cx: 63, cy: 39, rot: 20 },
              { cx: 39, cy: 28, rot: -15 },
              { cx: 61, cy: 28, rot: 15 },
              { cx: 45, cy: 19, rot: -8 },
              { cx: 55, cy: 19, rot: 8 },
              { cx: 50, cy: 13, rot: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
                <ellipse cx={lf.cx} cy={lf.cy} rx="6.8" ry="5.2" fill="#FEF9C3" stroke="#3F6212" strokeWidth="1.1" />
                <ellipse cx={lf.cx} cy={lf.cy} rx="4.2" ry="3.2" fill="#4D7C0F" />
              </g>
            ))}
          </g>
        );

      case 'kalanchoe':
        // کالانکوئه برگ‌پهن کنگره‌دار (مشابه عکس ۸ سمت راست)
        return (
          <g>
            {[
              { cx: 36, cy: 42, rot: -25 },
              { cx: 64, cy: 42, rot: 25 },
              { cx: 40, cy: 32, rot: -15 },
              { cx: 60, cy: 32, rot: 15 },
              { cx: 50, cy: 27, rot: 0 }
            ].map((lf, i) => (
              <ellipse
                key={i}
                cx={lf.cx}
                cy={lf.cy}
                rx="8.5"
                ry="6"
                transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}
                fill={i % 2 === 0 ? '#2D6A4F' : '#40916C'}
                stroke="#1B4332"
                strokeWidth="1.2"
                strokeDasharray="4 1.5"
              />
            ))}
            <circle cx="47" cy="20" r="2.2" fill="#FB7185" />
            <circle cx="53" cy="20" r="2.2" fill="#F43F5E" />
            <circle cx="50" cy="17" r="2.4" fill="#E11D48" />
          </g>
        );

      case 'climbing_rose':
        // رز رونده بلند با قیم چوبی و شاخه کمانی (مشابه عکس ۵ سمت چپ)
        return (
          <g>
            {/* قیم چوبی بامبو */}
            <line x1="45" y1="54" x2="45" y2="8" stroke="#D97706" strokeWidth="2.4" strokeLinecap="round" />
            {/* شاخه‌های رز رونده */}
            <path d="M48 54 C46 36 46 20 52 9 C62 7 74 14 82 26" stroke="#2D6A4F" strokeWidth="2" fill="none" />
            <path d="M52 54 C56 40 60 28 68 20" stroke="#40916C" strokeWidth="1.8" fill="none" />
            {/* رشته‌برگ‌های مرکب رز */}
            {[
              [38, 40], [36, 28], [39, 17], [53, 34], [56, 22], [65, 14], [75, 20], [64, 30]
            ].map(([lx, ly], idx) => (
              <g key={idx}>
                <ellipse cx={lx} cy={ly} rx="4.2" ry="2.3" transform={`rotate(-20 ${lx} ${ly})`} fill="#40916C" stroke="#1B4332" strokeWidth="0.8" />
                <ellipse cx={lx + 4} cy={ly + 2} rx="3.5" ry="2" transform={`rotate(20 ${lx + 4} ${ly + 2})`} fill="#52B788" stroke="#1B4332" strokeWidth="0.8" />
              </g>
            ))}
            {/* گل‌های رز شکفته */}
            <circle cx="66" cy="24" r="3.8" fill="#E11D48" stroke="#881337" strokeWidth="0.9" />
            <circle cx="66" cy="24" r="1.8" fill="#FDA4AF" />
            <circle cx="54" cy="14" r="3.2" fill="#F43F5E" stroke="#881337" strokeWidth="0.8" />
          </g>
        );

      case 'rose_bush':
        // بوته پرگل رز مینیاتوری و هلندی با غنچه‌های یاقوتی (مشابه عکس ۵)
        return (
          <g>
            <path d="M50 54V22M50 44L34 30M50 42L66 28M50 34L40 18M50 34L60 18" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />
            {[
              [34, 38], [66, 38], [38, 28], [62, 28], [46, 34], [54, 34], [44, 23], [56, 23]
            ].map(([lx, ly], i) => (
              <ellipse key={i} cx={lx} cy={ly} rx="5.2" ry="3" transform={`rotate(${i % 2 === 0 ? -22 : 22} ${lx} ${ly})`} fill="#2D6A4F" stroke="#143325" strokeWidth="0.9" />
            ))}
            {/* ۵ گل رز قرمز و صورتی */}
            {[
              { cx: 34, cy: 26, r: 4.2, c1: '#E11D48', c2: '#FECDD3' },
              { cx: 66, cy: 25, r: 4.2, c1: '#BE123C', c2: '#FDA4AF' },
              { cx: 50, cy: 15, r: 4.8, c1: '#E11D48', c2: '#FFE4E6' },
              { cx: 41, cy: 17, r: 3.5, c1: '#F43F5E', c2: '#FECDD3' },
              { cx: 59, cy: 17, r: 3.5, c1: '#F43F5E', c2: '#FECDD3' }
            ].map((fl, i) => (
              <g key={i}>
                <circle cx={fl.cx} cy={fl.cy} r={fl.r} fill={fl.c1} stroke="#881337" strokeWidth="0.9" />
                <circle cx={fl.cx} cy={fl.cy} r={fl.r * 0.45} fill={fl.c2} />
              </g>
            ))}
          </g>
        );

      case 'monstera':
        // برگ‌انجیری / مونسترا با بریدگی‌های طبیعی برگ
        return (
          <g>
            <path d="M50 54L36 32M50 54L64 30M50 54V22" stroke="#2D6A4F" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="35" cy="30" rx="11" ry="14" transform="rotate(-25 35 30)" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.2" />
            <ellipse cx="65" cy="30" rx="11" ry="14" transform="rotate(25 65 30)" fill="#40916C" stroke="#1B4332" strokeWidth="1.2" />
            <ellipse cx="50" cy="22" rx="12" ry="15" fill="#52B788" stroke="#1B4332" strokeWidth="1.2" />
            {/* شیارهای مخصوص برگ‌انجیری */}
            <path d="M42 18H47M53 18H58M41 24H46M54 24H59M28 28H33M67 28H72" stroke="#F6F3EC" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        );

      case 'echeveria':
        return (
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx="50" cy="34" rx="7" ry="14" transform={`rotate(${deg} 50 42)`} fill="#52B788" stroke="#2D6A4F" strokeWidth="1.2" />
            ))}
            {[22, 82, 142, 202, 262, 322].map((deg) => (
              <ellipse key={deg} cx="50" cy="37" rx="5" ry="10" transform={`rotate(${deg} 50 42)`} fill="#74C69D" stroke="#2D6A4F" strokeWidth="1" />
            ))}
            <circle cx="50" cy="42" r="4" fill="#D8F3DC" stroke="#2D6A4F" strokeWidth="1" />
          </g>
        );

      case 'haworthia':
        return (
          <g>
            <path d="M50 55L32 28L44 42L42 18L50 38L58 18L56 42L68 28L50 55Z" fill="#26543B" stroke="#163625" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M44 26H56M38 34H62M41 41H59M44 47H56" stroke="#E8F0EA" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 3" />
          </g>
        );

      case 'opuntia':
        return (
          <g>
            <ellipse cx="50" cy="41" rx="13" ry="15" fill="#40916C" stroke="#1B4332" strokeWidth="1.5" />
            <ellipse cx="37" cy="24" rx="7.5" ry="11" transform="rotate(-22 37 24)" fill="#52B788" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="63" cy="24" rx="7.5" ry="11" transform="rotate(22 63 24)" fill="#52B788" stroke="#1B4332" strokeWidth="1.4" />
            <circle cx="46" cy="38" r="1.2" fill="#FEF3C7" />
            <circle cx="54" cy="44" r="1.2" fill="#FEF3C7" />
            <circle cx="36" cy="22" r="1.2" fill="#FEF3C7" />
            <circle cx="64" cy="22" r="1.2" fill="#FEF3C7" />
          </g>
        );

      case 'dracaena':
        return (
          <g>
            <path d="M50 55V26" stroke="#5A4634" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M50 44C38 40 28 32 25 22C36 24 45 32 50 44Z" fill="#1B5E3A" stroke="#123F27" strokeWidth="1.2" />
            <path d="M50 44C62 40 72 32 75 22C64 24 55 32 50 44Z" fill="#237046" stroke="#123F27" strokeWidth="1.2" />
            <path d="M50 35C40 29 33 20 31 11C41 15 47 24 50 35Z" fill="#2E8555" stroke="#1B5E3A" strokeWidth="1.2" />
            <path d="M50 35C60 29 67 20 69 11C59 15 53 24 50 35Z" fill="#379963" stroke="#1B5E3A" strokeWidth="1.2" />
            <path d="M50 28C46 19 46 11 50 6C54 11 54 19 50 28Z" fill="#4BB37A" stroke="#1B5E3A" strokeWidth="1.2" />
          </g>
        );

      case 'aglaonema':
        // آگلونما نقره‌ای پرپشت با طرح نقره‌ای-سبز دقیقاً مطابق عکس ۱
        return (
          <g>
            <path d="M47 54L34 32M53 54L66 32M50 54V22" stroke="#74C69D" strokeWidth="2.4" strokeLinecap="round" />
            {[
              { cx: 31, cy: 36, rx: 7.5, ry: 15, rot: -34 },
              { cx: 69, cy: 36, rx: 7.5, ry: 15, rot: 34 },
              { cx: 38, cy: 26, rx: 8, ry: 16, rot: -18 },
              { cx: 62, cy: 26, rx: 8, ry: 16, rot: 18 },
              { cx: 50, cy: 21, rx: 8.5, ry: 17, rot: 0 }
            ].map((lf, i) => (
              <g key={i} transform={`rotate(${lf.rot} ${lf.cx} ${lf.cy})`}>
                <ellipse cx={lf.cx} cy={lf.cy} rx={lf.rx} ry={lf.ry} fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.2" />
                <ellipse cx={lf.cx} cy={lf.cy} rx={lf.rx * 0.58} ry={lf.ry * 0.76} fill="#B7E4C7" opacity="0.88" />
                <line x1={lf.cx} y1={lf.cy - lf.ry * 0.7} x2={lf.cx} y2={lf.cy + lf.ry * 0.7} stroke="#2D6A4F" strokeWidth="1" />
              </g>
            ))}
          </g>
        );

      case 'ficus':
        return (
          <g>
            <path d="M50 55V20" stroke="#6E473B" strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="34" cy="42" rx="13" ry="7.5" transform="rotate(-22 34 42)" fill="#1B4332" stroke="#0F291E" strokeWidth="1.5" />
            <path d="M26 39L42 45" stroke="#52B788" strokeWidth="1" opacity="0.7" />
            <ellipse cx="66" cy="38" rx="13" ry="7.5" transform="rotate(22 66 38)" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />
            <ellipse cx="36" cy="26" rx="12" ry="7" transform="rotate(-15 36 26)" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.5" />
            <ellipse cx="64" cy="24" rx="11" ry="6.5" transform="rotate(16 64 24)" fill="#1B4332" stroke="#0F291E" strokeWidth="1.4" />
            <path d="M50 22C52 10 56 9 54 22" fill="#D94E34" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      case 'dieffenbachia':
        return (
          <g>
            <ellipse cx="34" cy="34" rx="11" ry="17" transform="rotate(-20 34 34)" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="34" cy="34" rx="6.5" ry="11" transform="rotate(-20 34 34)" fill="#E9F5DB" />
            <ellipse cx="66" cy="34" rx="11" ry="17" transform="rotate(20 66 34)" fill="#2D6A4F" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="66" cy="34" rx="6.5" ry="11" transform="rotate(20 66 34)" fill="#E9F5DB" />
            <ellipse cx="50" cy="25" rx="11" ry="18" fill="#40916C" stroke="#1B4332" strokeWidth="1.4" />
            <ellipse cx="50" cy="25" rx="6.5" ry="12" fill="#F2F9EB" />
            <circle cx="48" cy="22" r="1.5" fill="#40916C" />
            <circle cx="53" cy="28" r="1.5" fill="#40916C" />
          </g>
        );

      case 'pine':
        return (
          <g>
            <ellipse cx="50" cy="53" rx="16" ry="4" fill="#65A30D" />
            <path d="M50 9L25 48H75L50 9Z" fill="#2F6648" stroke="#1E4430" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M50 16L30 43H70L50 16Z" fill="#43825F" />
            <path d="M50 23L36 38H64L50 23Z" fill="#5CA37B" />
          </g>
        );

      case 'tradescantia':
        return (
          <g>
            <path d="M50 55C40 44 26 36 18 24C30 26 42 36 50 55Z" fill="#9B2C62" stroke="#6B1B43" strokeWidth="1.3" />
            <path d="M50 55C60 44 74 36 82 24C70 26 58 36 50 55Z" fill="#9B2C62" stroke="#6B1B43" strokeWidth="1.3" />
            <path d="M50 55C43 38 34 24 30 12C40 18 47 32 50 55Z" fill="#3B7A57" stroke="#234F37" strokeWidth="1.3" />
            <path d="M50 55C57 38 66 24 70 12C60 18 53 32 50 55Z" fill="#E598B8" stroke="#9B2C62" strokeWidth="1.3" />
            <path d="M50 55C48 36 48 20 50 8C52 20 52 36 50 55Z" fill="#4D996E" stroke="#234F37" strokeWidth="1.3" />
          </g>
        );

      case 'schefflera':
        return (
          <g>
            <path d="M50 55V22M50 40L33 29M50 36L67 28" stroke="#4A6B53" strokeWidth="2.5" strokeLinecap="round" />
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="33" cy="22" rx="3.1" ry="7.8" transform={`rotate(${deg} 33 29)`} fill="#2D6A4F" stroke="#1B4332" strokeWidth="0.9" />
            ))}
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="67" cy="21" rx="3.1" ry="7.8" transform={`rotate(${deg} 67 28)`} fill="#40916C" stroke="#1B4332" strokeWidth="0.9" />
            ))}
            {[0, 51, 102, 153, 204, 255, 306].map((deg) => (
              <ellipse key={deg} cx="50" cy="13" rx="3.4" ry="8.4" transform={`rotate(${deg} 50 21)`} fill="#52B788" stroke="#1B4332" strokeWidth="0.9" />
            ))}
          </g>
        );

      case 'pachypodium':
        return (
          <g>
            <rect x="44" y="26" width="12" height="29" rx="5" fill="#9FA89B" stroke="#6B7368" strokeWidth="1.5" />
            <path d="M42 32L45 34M58 32L55 34M42 40L45 42M58 40L55 42M42 48L45 50M58 48L55 50" stroke="#5A6257" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M50 27C40 22 30 18 24 14C34 14 44 18 50 27Z" fill="#2E6F4E" stroke="#1E4D35" strokeWidth="1.2" />
            <path d="M50 27C60 22 70 18 76 14C66 14 56 18 50 27Z" fill="#2E6F4E" stroke="#1E4D35" strokeWidth="1.2" />
            <path d="M50 26C45 16 40 10 36 6C44 9 48 16 50 26Z" fill="#46966D" stroke="#1E4D35" strokeWidth="1.2" />
            <path d="M50 26C55 16 60 10 64 6C56 9 52 16 50 26Z" fill="#46966D" stroke="#1E4D35" strokeWidth="1.2" />
          </g>
        );

      case 'cactus':
        return (
          <g>
            <circle cx="50" cy="40" r="16" fill="#3D7A4F" stroke="#244F31" strokeWidth="1.6" />
            <path d="M43 25C41 35 41 45 43 55M50 24V56M57 25C59 35 59 45 57 55" stroke="#244F31" strokeWidth="1.2" />
            <path d="M43 31L40 29M43 41L39 41M43 50L40 52M57 31L60 29M57 41L61 41M57 50L60 52M50 34L52 32M50 45L48 47" stroke="#E9D8A6" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      case 'hypoestes':
        return (
          <g>
            <ellipse cx="36" cy="39" rx="12" ry="7.5" transform="rotate(-28 36 39)" fill="#D94E78" stroke="#2E5A44" strokeWidth="1.5" />
            <circle cx="34" cy="38" r="1.5" fill="#FDE2E9" />
            <circle cx="39" cy="41" r="1.2" fill="#FDE2E9" />
            <ellipse cx="64" cy="39" rx="12" ry="7.5" transform="rotate(28 64 39)" fill="#E8F0EA" stroke="#2E5A44" strokeWidth="1.5" />
            <circle cx="62" cy="38" r="1.5" fill="#3B7A57" />
            <circle cx="67" cy="41" r="1.2" fill="#3B7A57" />
            <ellipse cx="50" cy="26" rx="11" ry="8" fill="#EC6B94" stroke="#2E5A44" strokeWidth="1.5" />
            <circle cx="48" cy="24" r="1.4" fill="#FFF0F5" />
            <circle cx="53" cy="28" r="1.4" fill="#FFF0F5" />
          </g>
        );

      case 'sedum':
        return (
          <g>
            {[
              [34, 50], [42, 48], [50, 49], [58, 48], [66, 50],
              [30, 44], [38, 42], [46, 41], [54, 41], [62, 42], [70, 44],
              [35, 36], [43, 34], [50, 33], [57, 34], [65, 36],
              [42, 28], [50, 27], [58, 28]
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="5.5" fill={idx % 2 === 0 ? '#84CC16' : '#A3E635'} stroke="#4D7C0F" strokeWidth="1" />
            ))}
          </g>
        );

      case 'zz':
        return (
          <g>
            <path d="M46 55L36 16M54 55L64 14" stroke="#2B5E3F" strokeWidth="2.6" strokeLinecap="round" />
            {[22, 32, 42, 50].map((y, i) => (
              <g key={i}>
                <ellipse cx={33 - i * 1.2} cy={y} rx="6.5" ry="3.5" transform={`rotate(-25 ${33 - i * 1.2} ${y})`} fill="#2E6F4E" stroke="#18422C" strokeWidth="1.2" />
                <ellipse cx={43 - i * 1.2} cy={y - 2} rx="6.5" ry="3.5" transform={`rotate(25 ${43 - i * 1.2} ${y - 2})`} fill="#3E8E63" stroke="#18422C" strokeWidth="1.2" />
                <ellipse cx={57 + i * 1.2} cy={y - 2} rx="6.5" ry="3.5" transform={`rotate(-25 ${57 + i * 1.2} ${y - 2})`} fill="#52B788" stroke="#18422C" strokeWidth="1.2" />
                <ellipse cx={67 + i * 1.2} cy={y} rx="6.5" ry="3.5" transform={`rotate(25 ${67 + i * 1.2} ${y})`} fill="#40916C" stroke="#18422C" strokeWidth="1.2" />
              </g>
            ))}
          </g>
        );

      case 'adenium':
        return (
          <g>
            <path d="M40 55C38 42 43 35 46 31C48 28 52 28 54 31C57 35 62 42 60 55Z" fill="#9C8E7E" stroke="#6E6254" strokeWidth="1.8" />
            <path d="M46 32L39 21M54 32L61 22M50 30V19" stroke="#9C8E7E" strokeWidth="4" strokeLinecap="round" />
            <ellipse cx="39" cy="21" rx="2.2" ry="1.2" fill="#D4C7B8" />
            <ellipse cx="61" cy="22" rx="2.2" ry="1.2" fill="#D4C7B8" />
            <ellipse cx="50" cy="19" rx="2.2" ry="1.2" fill="#D4C7B8" />
          </g>
        );

      default: {
        // موتور ترکیب‌گر الگوریتمی (Procedural Botanical Synthesizer) برای هر گیاه جدیدی که در آینده اضافه شود
        const seedStr = `${shape}_${plantName}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
          hash = (hash * 31 + seedStr.charCodeAt(i)) % 10000;
        }
        const leafCount = 5 + (hash % 3);
        const palettes = [
          ['#1B4332', '#2D6A4F', '#52B788', '#95D5B2'],
          ['#14532D', '#166534', '#22C55E', '#BBF7D0'],
          ['#365314', '#4D7C0F', '#84CC16', '#ECFCCB'],
          ['#134E4A', '#0F766E', '#14B8A6', '#99F6E4']
        ];
        const chosenColors = palettes[hash % palettes.length];
        const hasFlowers =
          plantName.includes('گل') ||
          plantName.includes('بنفشه') ||
          plantName.includes('شمعدانی') ||
          plantName.includes('ارکیده');

        return (
          <g>
            <path d="M50 54V24M50 42L36 30M50 38L64 28" stroke={chosenColors[0]} strokeWidth="2.3" strokeLinecap="round" />
            {Array.from({ length: leafCount }).map((_, idx) => {
              const spread = (idx - (leafCount - 1) / 2) * 18;
              const cx = 50 + spread * 0.85;
              const cy = 24 + Math.abs(spread) * 0.45;
              return (
                <g key={idx} transform={`rotate(${spread} ${cx} ${cy})`}>
                  <ellipse
                    cx={cx}
                    cy={cy}
                    rx="7.5"
                    ry="13.5"
                    fill={chosenColors[(idx % 2) + 1]}
                    stroke={chosenColors[0]}
                    strokeWidth="1.2"
                  />
                  <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 10} stroke={chosenColors[3]} strokeWidth="1" opacity="0.75" />
                </g>
              );
            })}
            {hasFlowers && (
              <g>
                <circle cx="43" cy="18" r="3.6" fill="#EC4899" stroke="#9D174D" strokeWidth="0.9" />
                <circle cx="57" cy="19" r="3.4" fill="#F43F5E" stroke="#9D174D" strokeWidth="0.9" />
                <circle cx="50" cy="14" r="4" fill="#E11D48" stroke="#881337" strokeWidth="0.9" />
              </g>
            )}
          </g>
        );
      }
    }
  };

  return (
    <svg className="w-23 h-23 drop-shadow-xs" viewBox="0 0 100 90" fill="none">
      {renderFoliage()}
      {renderPotGeometry()}
    </svg>
  );
};