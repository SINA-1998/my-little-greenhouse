// ============================================================================
// Cloudflare Worker 24/7 Telegram Bot (In-Place UI + Expandable Cards + Relay)
// ============================================================================

const ROOM_ID = 'sina_office_greenhouse';
const MS_PER_DAY = 86400000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const toPersianNum = (num) =>
  String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

const formatPersianToday = () => {
  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    timeZone: 'Asia/Tehran',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());
};

const formatTehranTime = () => {
  return new Intl.DateTimeFormat('fa-IR', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
};

const normalizeMlUnit = (text) =>
  text ? String(text).replace(/سی‌سی|سی سی|cc/gi, 'میلی‌لیتر') : '';

// ۱. دریافت و ذخیره وضعیت گلخانه در Supabase
async function loadStateFromSupabase(env) {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/greenhouse_state?room_id=eq.${ROOM_ID}&select=payload`,
    {
      headers: {
        apikey: env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`
      }
    }
  );
  if (!res.ok) return null;
  const rows = await res.json();
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows[0].payload;
}

async function saveStateToSupabase(env, payload) {
  await fetch(`${env.SUPABASE_URL}/rest/v1/greenhouse_state`, {
    method: 'POST',
    headers: {
      apikey: env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      room_id: ROOM_ID,
      payload,
      updated_at: new Date().toISOString()
    })
  });
}

// ۲. موتور محاسبات علمی رطوبت بستر، آبیاری و غبارپاشی روی سرور
function evaluatePlantServer(plant, radiatorOn) {
  let effectiveCycle = plant.waterCycleDays ? plant.waterCycleDays : 7;
  if (radiatorOn && plant.statusType !== 'locked' && plant.statusType !== 'recovery') {
    effectiveCycle = Math.max(2, Math.round(effectiveCycle * 0.75));
  }
  let elapsed = plant.daysSinceWater ? plant.daysSinceWater : 0;
  if (typeof plant.lastWateredAt === 'number' && plant.lastWateredAt > 0) {
    elapsed = Math.max(0, Math.floor((Date.now() - plant.lastWateredAt) / MS_PER_DAY));
  }
  const daysRemaining = Math.max(0, effectiveCycle - elapsed);
  const needsWateringNow = plant.statusType !== 'recovery' && effectiveCycle - elapsed <= 0;

  const mistCycle = plant.mistCycleDays !== undefined ? plant.mistCycleDays : 0;
  let elapsedMist = plant.daysSinceMist !== undefined ? plant.daysSinceMist : 0;
  if (typeof plant.lastMistedAt === 'number' && plant.lastMistedAt > 0) {
    elapsedMist = Math.max(0, Math.floor((Date.now() - plant.lastMistedAt) / MS_PER_DAY));
  }
  const needsMistingNow = Boolean(
    plant.needsMistToday ? true : mistCycle > 0 && elapsedMist >= mistCycle
  );

  const rawMoisture = Math.round(((effectiveCycle - elapsed) / Math.max(1, effectiveCycle)) * 92 + 8);
  const radiatorPenalty = radiatorOn && elapsed > 0 ? 6 : 0;
  const moisturePercent = needsWateringNow
    ? Math.min(22, Math.max(8, rawMoisture - radiatorPenalty))
    : Math.max(12, Math.min(100, rawMoisture - radiatorPenalty));

  return {
    effectiveCycle,
    elapsed,
    daysRemaining,
    needsWateringNow,
    needsMistingNow,
    needsQuarterTurn: Boolean(plant.needsRotation),
    moisturePercent
  };
}

// ۳. توابع ارتباطی با Telegram Bot API (ارسال، ویرایش درجا، حذف کیبورد قدیمی و ثبت منو)
async function tgApiCall(token, method, payload) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch {
    return { ok: false };
  }
}

// حذف نامرئی کیبورد ۴ ردیفه قدیمی بدون به جا گذاشتن پیام اضافی در چت
async function clearOldReplyKeyboardSilently(token, chatId) {
  const sent = await tgApiCall(token, 'sendMessage', {
    chat_id: chatId,
    text: '⏳',
    reply_markup: { remove_keyboard: true }
  });
  if (sent?.ok && sent?.result?.message_id) {
    await tgApiCall(token, 'deleteMessage', {
      chat_id: chatId,
      message_id: sent.result.message_id
    });
  }
}

// ثبت خودکار دکمه Menu رسمی تلگرام
async function ensureBotMenuCommands(token) {
  const commands = [
    { command: 'status', description: '🌿 داشبورد زنده وضعیت گلخانه' },
    { command: 'plants', description: '🪴 فهرست و شناسنامه گلدان‌ها' },
    { command: 'thirsty', description: '💧 گلدان‌های نیازمند آبیاری' },
    { command: 'mist', description: '💨 نوبت غبارپاشی برگ‌ها' },
    { command: 'rotate', description: '🔄 نوبت چرخش ۹۰ درجه' },
    { command: 'history', description: '🕒 گزارش آخرین فعالیت‌ها' },
    { command: 'radiator', description: '🔥 وضعیت گرمایش شوفاژ' }
  ];
  await tgApiCall(token, 'setMyCommands', { commands });
  await tgApiCall(token, 'setChatMenuButton', { menu_button: { type: 'commands' } });
}

// ارسال یا ویرایش درجای یک کارت در تلگرام
async function sendOrEditCard(token, chatId, title, bodyHtml, inlineKeyboard, messageIdToEdit) {
  const text = title ? `<b>${title}</b>\n\n${bodyHtml}` : bodyHtml;
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };
  if (inlineKeyboard && inlineKeyboard.length > 0) {
    payload.reply_markup = { inline_keyboard: inlineKeyboard };
  }

  if (messageIdToEdit) {
    const editRes = await tgApiCall(token, 'editMessageText', {
      ...payload,
      message_id: messageIdToEdit
    });
    if (editRes?.ok || (editRes?.description && editRes.description.includes('message is not modified'))) {
      return;
    }
  }

  await tgApiCall(token, 'sendMessage', payload);
}

// ۴. ساخت محتوای کارت ۱: داشبورد زنده گلخانه (با بلوک تاشوی expandable و واحد میلی‌لیتر)
function buildSpaceDashboardView(state, space, headerPrefix) {
  const allPlants = (state.plants || []).filter(
    (p) => !p.archived && (p.spaceId || 'office') === space.id
  );
  const persianToday = formatPersianToday();

  const thirstyLines = [];
  const mistLines = [];
  const rotateLines = [];
  const healthyLines = [];
  const inlineKeyboard = [];

  allPlants.forEach((p) => {
    const m = evaluatePlantServer(p, space.radiatorOn);
    if (m.needsWateringNow) {
      thirstyLines.push(
        `• <b>${p.name}</b> (<code>${p.code}</code>) ← <b>${toPersianNum(p.doseMl)} میلی‌لیتر</b> (${p.doseCup})`
      );
      if (inlineKeyboard.length < 6) {
        inlineKeyboard.push([
          {
            text: `💧 آبیاری ${p.code} (${toPersianNum(p.doseMl)}ml)`,
            callback_data: `act:w:${p.id}`
          },
          {
            text: `🛡️ خاک مرطوب ${p.code}`,
            callback_data: `act:s:${p.id}`
          }
        ]);
      }
    } else {
      healthyLines.push(
        `• ${p.name} (${p.code}): ${toPersianNum(m.moisturePercent)}٪ رطوبت (${toPersianNum(
          m.daysRemaining
        )} روز مانده)`
      );
    }

    if (m.needsMistingNow) {
      mistLines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
      if (inlineKeyboard.length < 6 && !m.needsWateringNow) {
        inlineKeyboard.push([
          { text: `💨 غبارپاشی ${p.code}`, callback_data: `act:m:${p.id}` },
          { text: `📖 شناسنامه ${p.code}`, callback_data: `info:${p.id}` }
        ]);
      }
    }

    if (m.needsQuarterTurn) {
      rotateLines.push(`• <b>${p.name}</b> (<code>${p.code}</code>)`);
      if (inlineKeyboard.length < 6 && !m.needsWateringNow && !m.needsMistingNow) {
        inlineKeyboard.push([
          { text: `🔄 چرخش ۹۰° ${p.code}`, callback_data: `act:r:${p.id}` },
          { text: `📖 شناسنامه ${p.code}`, callback_data: `info:${p.id}` }
        ]);
      }
    }
  });

  // ردیف متقارن ۲ ستونه پایین داشبورد
  inlineKeyboard.push([
    {
      text: `🪴 فهرست گلدان‌ها (${toPersianNum(allPlants.length)})`,
      callback_data: `list:${space.id}`
    },
    {
      text: space.radiatorOn ? '🔥 شوفاژ: روشن' : '🍃 شوفاژ: خاموش',
      callback_data: `rad:${space.id}`
    }
  ]);

  const title = headerPrefix
    ? `${headerPrefix} • ${space.name}`
    : `${space.icon} داشبورد زنده • ${space.name}`;

  const isAllClean =
    thirstyLines.length === 0 && mistLines.length === 0 && rotateLines.length === 0;

  if (isAllClean) {
    const cleanBody = [
      `📅 ${persianToday} • گرمایش شوفاژ: <b>${space.radiatorOn ? 'روشن 🔥' : 'خاموش 🍃'}</b>`,
      '',
      `✨ تمام <b>${toPersianNum(allPlants.length)} گلدان</b> سیراب و متقارن هستند و امروز نیازی به رسیدگی ندارند.`
    ];
    if (healthyLines.length > 0) {
      cleanBody.push(
        '',
        `<blockquote expandable>🌿 <b>وضعیت رطوبت گلدان‌های سیراب (${toPersianNum(
          healthyLines.length
        )} گلدان):</b>\n${healthyLines.join('\n')}</blockquote>`
      );
    }
    return { title, bodyHtml: cleanBody.join('\n'), inlineKeyboard };
  }

  const sections = [
    `📅 ${persianToday} • شوفاژ: <b>${space.radiatorOn ? 'روشن 🔥' : 'خاموش 🍃'}</b>`,
    ''
  ];

  if (thirstyLines.length > 0) {
    sections.push(`💧 <b>نوبت آبیاری امروز (${toPersianNum(thirstyLines.length)} گلدان):</b>`);
    sections.push(...thirstyLines);
    sections.push('');
  }
  if (mistLines.length > 0) {
    sections.push(`💨 <b>نوبت غبارپاشی برگ (${toPersianNum(mistLines.length)} گلدان):</b>`);
    sections.push(...mistLines);
    sections.push('');
  }
  if (rotateLines.length > 0) {
    sections.push(`🔄 <b>نوبت چرخش ۹۰ درجه (${toPersianNum(rotateLines.length)} گلدان):</b>`);
    sections.push(...rotateLines);
  }
  if (healthyLines.length > 0) {
    sections.push(
      '',
      `<blockquote expandable>✅ <b>سایر گلدان‌های سیراب (${toPersianNum(
        healthyLines.length
      )} مورد):</b>\n${healthyLines.join('\n')}</blockquote>`
    );
  }

  return { title, bodyHtml: sections.join('\n').trim(), inlineKeyboard };
}

// ۵. ساخت محتوای کارت ۲: فهرست ۲ ستونه گلدان‌ها (Catalog View)
function buildSpaceCatalogView(state, space) {
  const spPlants = (state.plants || []).filter(
    (p) => !p.archived && (p.spaceId || 'office') === space.id
  );

  const inlineKeyboard = [];
  for (let i = 0; i < spPlants.length; i += 2) {
    const row = [];
    const p1 = spPlants[i];
    const m1 = evaluatePlantServer(p1, space.radiatorOn);
    const ic1 = m1.needsWateringNow ? '💧' : m1.needsMistingNow ? '💨' : '🌿';
    row.push({
      text: `${ic1} ${p1.name} (${p1.code})`,
      callback_data: `info:${p1.id}`
    });

    if (spPlants[i + 1]) {
      const p2 = spPlants[i + 1];
      const m2 = evaluatePlantServer(p2, space.radiatorOn);
      const ic2 = m2.needsWateringNow ? '💧' : m2.needsMistingNow ? '💨' : '🌿';
      row.push({
        text: `${ic2} ${p2.name} (${p2.code})`,
        callback_data: `info:${p2.id}`
      });
    }
    inlineKeyboard.push(row);
  }

  inlineKeyboard.push([
    {
      text: `🔙 بازگشت به داشبورد ${space.name}`,
      callback_data: `status:${space.id}`
    }
  ]);

  const title = `🪴 فهرست گلدان‌های «${space.name}»`;
  const bodyHtml = `مجموع گلدان‌های فعال: <b>${toPersianNum(
    spPlants.length
  )} گلدان</b>\n<blockquote>برای مشاهده شناسنامه کامل، وضعیت رطوبت بستر یا ثبت عملیات، روی گلدان مورد نظر بزنید:</blockquote>`;

  return { title, bodyHtml, inlineKeyboard };
}

// ۶. ساخت محتوای کارت ۳: شناسنامه اختصاصی گیاه و پنل عملیات (Plant Profile View)
function buildPlantProfileView(state, plant, space) {
  const gardens = state.gardens || [];
  const gObj = gardens.find((g) => g.id === plant.garden);
  const gardenName = gObj ? gObj.name : 'باغچه اصلی';
  const m = evaluatePlantServer(plant, space.radiatorOn);

  const statusBadge = m.needsWateringNow
    ? '🚨 تشنه آبیاری'
    : m.needsMistingNow
    ? '💨 نیازمند غبارپاشی'
    : plant.statusType === 'locked'
    ? `🔒 سیراب (${toPersianNum(m.daysRemaining)} روز مانده)`
    : `✅ کاملاً سیراب (${toPersianNum(m.daysRemaining)} روز تا آبیاری)`;

  const lastLog = plant.history && plant.history.length > 0 ? plant.history[0] : null;
  const title = `🪴 ${plant.name} • پلاک ${plant.code}`;

  const bodyLines = [
    `📍 ${space.icon} ${space.name} (${gardenName})`,
    `<blockquote>• وضعیت: <b>${statusBadge}</b>\n• رطوبت فعلی بستر: <b>${toPersianNum(
      m.moisturePercent
    )}٪</b>\n• پیمانه دقیق آبیاری: <b>${toPersianNum(
      plant.doseMl
    )} میلی‌لیتر</b> (${plant.doseCup})\n• دوره آبیاری: هر ${toPersianNum(
      m.effectiveCycle
    )} روز یک‌بار\n• حجم خاک: ${toPersianNum(
      plant.potVolumeLiters || 2
    )} لیتر • قد گیاه: ${toPersianNum(plant.plantHeightCm || 28)} سانتی‌متر</blockquote>`
  ];

  const extraDetails = [];
  if (plant.nickname) extraDetails.push(`🌿 <b>لقب:</b> ${plant.nickname}`);
  if (plant.mistNeed) extraDetails.push(`💨 <b>غبارپاشی:</b> ${plant.mistNeed}`);
  if (plant.light) extraDetails.push(`☀️ <b>نیاز نوری:</b> ${plant.light}`);
  if (lastLog) {
    extraDetails.push(
      `🕒 <b>آخرین رویداد:</b> ${normalizeMlUnit(lastLog.action)} — ${lastLog.by} (${
        lastLog.persianDate || lastLog.time
      })`
    );
  }

  if (extraDetails.length > 0) {
    bodyLines.push(
      `<blockquote expandable>📖 <b>شناسنامه و راهنمای نگهداری:</b>\n${extraDetails.join(
        '\n'
      )}</blockquote>`
    );
  }

  const inlineKeyboard = [
    [
      {
        text: `💧 ثبت آبیاری (${toPersianNum(plant.doseMl)}ml)`,
        callback_data: `act:w:${plant.id}:p`
      },
      {
        text: '💨 ثبت غبارپاشی',
        callback_data: `act:m:${plant.id}:p`
      }
    ],
    [
      {
        text: '🔄 چرخش ۹۰ درجه',
        callback_data: `act:r:${plant.id}:p`
      },
      {
        text: '🛡️ خاک مرطوب (تعویق)',
        callback_data: `act:s:${plant.id}:p`
      }
    ],
    [
      {
        text: '✂️ ثبت هرس امروز',
        callback_data: `act:p:${plant.id}:p`
      },
      {
        text: '🪴 ثبت تعویض خاک',
        callback_data: `act:x:${plant.id}:p`
      }
    ],
    [
      {
        text: '🔙 فهرست گلدان‌ها',
        callback_data: `list:${space.id}`
      },
      {
        text: '📊 داشبورد گلخانه',
        callback_data: `status:${space.id}`
      }
    ]
  ];

  return { title, bodyHtml: bodyLines.join('\n'), inlineKeyboard };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // پل ارتباطی ضد فیلتر برای مرورگر
    if (url.pathname.startsWith('/bot')) {
      const tgUrl = `https://api.telegram.org${url.pathname}${url.search}`;
      const init = {
        method: request.method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = await request.text();
      }
      const tgRes = await fetch(tgUrl, init);
      const resBody = await tgRes.text();
      return new Response(resBody, {
        status: tgRes.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Botanica 24/7 Smart Telegram Worker Active 🌱', {
        status: 200,
        headers: CORS_HEADERS
      });
    }

    const update = await request.json();
    const state = await loadStateFromSupabase(env);
    if (!state) return new Response('OK', { status: 200, headers: CORS_HEADERS });

    const token = env.TELEGRAM_BOT_TOKEN || state.botSettings?.telegramBotToken;
    if (!token) return new Response('OK', { status: 200, headers: CORS_HEADERS });

    const spaces = state.spaces || [];
    const plants = state.plants || [];
    const members = state.members || [];

    // ========================================================================
    // الف) پردازش کلیک روی دکمه‌های زیر کارت‌ها (با ویرایش درجا editMessageText)
    // ========================================================================
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = String(cb.message?.chat?.id || cb.from.id);
      const messageId = cb.message?.message_id;
      const data = cb.data || '';

      const foundMem = members.find((m) => m.active && m.telegramChatId === chatId);
      const member = foundMem || members[0];

      if (!member || !member.active) {
        await tgApiCall(token, 'answerCallbackQuery', {
          callback_query_id: cb.id,
          text: '⛔ حساب شما غیرفعال است یا هنوز متصل نشده است.',
          show_alert: true
        });
        return new Response('OK', { status: 200, headers: CORS_HEADERS });
      }

      const canCare =
        member.role !== 'viewer' &&
        (member.permissions ? member.permissions.canWaterAndMist !== false : true);
      const canManageSpaces =
        member.role !== 'viewer' &&
        (member.permissions ? member.permissions.canManageSpaces !== false : true);

      // ۱. ثبت عملیات مراقبتی روی گیاه (آبیاری، غبارپاشی، چرخش، تعویق، هرس، تعویض خاک)
      if (data.startsWith('act:')) {
        if (!canCare) {
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: '🔒 حساب شما فقط مجوز مشاهده (بازدیدکننده) دارد.',
            show_alert: true
          });
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }

        const parts = data.split(':');
        const code = parts[1];
        const plantId = parts[2];
        const originView = parts[3]; // 'p' یعنی از داخل کارت شناسنامه گیاه زده شده
        const target = plants.find((p) => p.id === plantId);

        if (target) {
          const todayPersian = formatPersianToday();
          const nowTime = formatTehranTime();
          let actionLabel = '💧 ثبت آبیاری';

          if (code === 'w') {
            actionLabel = `آبیاری (${toPersianNum(target.doseMl)} میلی‌لیتر)`;
            target.daysSinceWater = 0;
            target.lastWateredAt = Date.now();
            target.waterCount = (target.waterCount || 0) + 1;
            if (target.waterCount % 2 === 0) target.needsRotation = true;
            target.fertDue = false;
            target.statusType = 'ok';
          } else if (code === 'm') {
            actionLabel = 'غبارپاشی برگ‌ها';
            target.needsMistToday = false;
            target.daysSinceMist = 0;
            target.lastMistedAt = Date.now();
          } else if (code === 'r') {
            actionLabel = 'چرخش ۹۰ درجه گلدان';
            target.needsRotation = false;
          } else if (code === 's') {
            actionLabel = 'خاک مرطوب است (تعویق ۲ روزه)';
            target.daysSinceWater = Math.max(0, (target.daysSinceWater || 2) - 2);
            target.lastWateredAt = Date.now() - target.daysSinceWater * MS_PER_DAY;
            target.statusType = 'ok';
          } else if (code === 'p') {
            actionLabel = '✂️ هرس و فرم‌دهی شاخسار';
            target.lastPrunedDate = todayPersian;
          } else if (code === 'x') {
            actionLabel = `🪴 تعویض بستر خاک (${toPersianNum(target.potVolumeLiters || 2)} لیتر)`;
            target.lastRepottedDate = todayPersian;
            target.lastRepottedMonthsAgo = 0;
          }

          target.history = [
            {
              id: 'log_' + Date.now(),
              action: actionLabel,
              by: `${member.name} (تلگرام)`,
              time: `ساعت ${nowTime}`,
              persianDate: todayPersian
            },
            ...(target.history || [])
          ];

          await saveStateToSupabase(env, state);

          // نمایش اعلان کپسولی بالای صفحه تلگرام بدون شلوغ کردن چت
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: `✅ ${actionLabel} برای «${target.name}» ثبت شد`
          });

          // به‌روزرسانی درجای همان کارتِ باز بدون ارسال پیام جدید!
          const sp =
            spaces.find((s) => s.id === (target.spaceId || 'office')) || spaces[0];
          if (originView === 'p') {
            const updatedPlantView = buildPlantProfileView(state, target, sp);
            await sendOrEditCard(
              token,
              chatId,
              updatedPlantView.title,
              updatedPlantView.bodyHtml,
              updatedPlantView.inlineKeyboard,
              messageId
            );
          } else {
            const updatedDash = buildSpaceDashboardView(state, sp, '');
            await sendOrEditCard(
              token,
              chatId,
              updatedDash.title,
              updatedDash.bodyHtml,
              updatedDash.inlineKeyboard,
              messageId
            );
          }
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
      }

      // ۲. مشاهده شناسنامه یک گیاه درجا روی همان کارت (info:)
      if (data.startsWith('info:')) {
        const plantId = data.replace('info:', '');
        const target = plants.find((p) => p.id === plantId);
        if (target) {
          const sp =
            spaces.find((s) => s.id === (target.spaceId || 'office')) || spaces[0];
          const view = buildPlantProfileView(state, target, sp);
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: `🪴 شناسنامه ${target.name}`
          });
          await sendOrEditCard(
            token,
            chatId,
            view.title,
            view.bodyHtml,
            view.inlineKeyboard,
            messageId
          );
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
      }

      // ۳. مشاهده فهرست ۲ ستونه تمام گلدان‌ها درجا روی همان کارت (list:)
      if (data.startsWith('list:')) {
        const spaceId = data.replace('list:', '');
        const sp = spaces.find((s) => s.id === spaceId) || spaces[0];
        if (sp) {
          const view = buildSpaceCatalogView(state, sp);
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: `🪴 فهرست گلدان‌های ${sp.name}`
          });
          await sendOrEditCard(
            token,
            chatId,
            view.title,
            view.bodyHtml,
            view.inlineKeyboard,
            messageId
          );
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
      }

      // ۴. تغییر وضعیت شوفاژ درجا روی همان کارت (rad:)
      if (data.startsWith('rad:')) {
        if (!canManageSpaces) {
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: '🔒 تغییر وضعیت شوفاژ نیازمند مجوز مدیریت فضا است.',
            show_alert: true
          });
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
        const spaceId = data.replace('rad:', '');
        const sp = spaces.find((s) => s.id === spaceId) || spaces[0];
        if (sp) {
          sp.radiatorOn = !sp.radiatorOn;
          await saveStateToSupabase(env, state);
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: sp.radiatorOn ? '🔥 شوفاژ روشن شد' : '🍃 شوفاژ خاموش شد'
          });
          const view = buildSpaceDashboardView(state, sp, '');
          await sendOrEditCard(
            token,
            chatId,
            view.title,
            view.bodyHtml,
            view.inlineKeyboard,
            messageId
          );
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
      }

      // ۵. بازگشت به داشبورد گلخانه درجا روی همان کارت (status:)
      if (data.startsWith('status:')) {
        const spaceId = data.replace('status:', '');
        const sp = spaces.find((s) => s.id === spaceId) || spaces[0];
        if (sp) {
          const view = buildSpaceDashboardView(state, sp, '');
          await tgApiCall(token, 'answerCallbackQuery', {
            callback_query_id: cb.id,
            text: `📊 داشبورد ${sp.name}`
          });
          await sendOrEditCard(
            token,
            chatId,
            view.title,
            view.bodyHtml,
            view.inlineKeyboard,
            messageId
          );
          return new Response('OK', { status: 200, headers: CORS_HEADERS });
        }
      }

      await tgApiCall(token, 'answerCallbackQuery', { callback_query_id: cb.id });
      return new Response('OK', { status: 200, headers: CORS_HEADERS });
    }

    // ========================================================================
    // ب) پردازش دستورات منوی تلگرام (/start, /status, /plants, /history...)
    // ========================================================================
    const msg = update.message;
    if (!msg?.chat?.id || !msg?.text) {
      return new Response('OK', { status: 200, headers: CORS_HEADERS });
    }

    const chatId = String(msg.chat.id);
    const text = msg.text.trim();

    // حذف نامرئی کیبورد بزرگ ۴ ردیفه قدیمی و ثبت منوی رسمی تلگرام
    await clearOldReplyKeyboardSilently(token, chatId);
    await ensureBotMenuCommands(token);

    // اتصال خودکار عضو با لینک دعوت (/start join_mem_...)
    if (text.startsWith('/start join_')) {
      const invitedId = text.replace('/start join_', '').trim();
      const targetMem = members.find((m) => m.id === invitedId);
      if (targetMem) {
        targetMem.telegramChatId = chatId;
        targetMem.telegramUsername = msg.chat.username;
        await saveStateToSupabase(env, state);

        const firstSp =
          spaces.find((s) => targetMem.assignedSpaces.includes(s.id)) || spaces[0];
        const view = buildSpaceDashboardView(
          state,
          firstSp,
          `✅ خوش آمدید ${targetMem.name} عزیز`
        );
        await sendOrEditCard(token, chatId, view.title, view.bodyHtml, view.inlineKeyboard);
        return new Response('OK', { status: 200, headers: CORS_HEADERS });
      }
    }

    const foundMem = members.find((m) => m.active && m.telegramChatId === chatId);
    const member = foundMem || members[0];
    const allowedSpaces =
      member && member.role !== 'super_admin'
        ? spaces.filter((s) => member.assignedSpaces.includes(s.id))
        : spaces;

    if (text === '/plants' || text.includes('شناسنامه')) {
      for (const sp of allowedSpaces) {
        const view = buildSpaceCatalogView(state, sp);
        await sendOrEditCard(token, chatId, view.title, view.bodyHtml, view.inlineKeyboard);
      }
    } else if (text === '/history' || text.includes('فعالیت')) {
      for (const sp of allowedSpaces) {
        const spPlants = plants.filter(
          (p) => !p.archived && (p.spaceId || 'office') === sp.id
        );
        const recentLogs = [];
        spPlants.forEach((p) => {
          if (p.history && p.history.length > 0) {
            const latest = p.history[0];
            recentLogs.push(
              `• <b>${p.name}</b> (<code>${p.code}</code>): ${normalizeMlUnit(
                latest.action
              )} — ${latest.by}`
            );
          }
        });
        const bodyHtml =
          recentLogs.length > 0
            ? `<blockquote>${recentLogs.slice(0, 8).join('\n')}</blockquote>`
            : 'هنوز فعالیتی ثبت نشده است.';

        await sendOrEditCard(token, chatId, `🕒 آخرین فعالیت‌ها • ${sp.name}`, bodyHtml, [
          [{ text: `📊 بازگشت به داشبورد ${sp.name}`, callback_data: `status:${sp.id}` }]
        ]);
      }
    } else {
      // برای /start, /status, /thirsty, /mist, /rotate, /radiator کارت داشبورد زنده را بفرست
      for (const sp of allowedSpaces) {
        const view = buildSpaceDashboardView(state, sp, '');
        await sendOrEditCard(token, chatId, view.title, view.bodyHtml, view.inlineKeyboard);
      }
    }

    return new Response('OK', { status: 200, headers: CORS_HEADERS });
  },

  // ج) کرون‌جاب خودکار ساعت ۰۸:۳۰ صبح و ۱۲:۳۰ ظهر کلودفلر
  async scheduled(event, env, ctx) {
    const state = await loadStateFromSupabase(env);
    if (!state) return;

    const token = env.TELEGRAM_BOT_TOKEN || state.botSettings?.telegramBotToken;
    if (!token) return;

    const spaces = state.spaces || [];
    const members = state.members || [];

    for (const sp of spaces) {
      const targets = members
        .filter(
          (m) =>
            m.active &&
            m.notifyAlerts &&
            m.telegramChatId &&
            (m.role === 'super_admin' || m.assignedSpaces.includes(sp.id))
        )
        .map((m) => m.telegramChatId);

      if (targets.length > 0) {
        const view = buildSpaceDashboardView(state, sp, '🔔 گزارش خودکار روزانه');
        for (const cid of targets) {
          await sendOrEditCard(token, cid, view.title, view.bodyHtml, view.inlineKeyboard);
        }
      }
    }
  }
};