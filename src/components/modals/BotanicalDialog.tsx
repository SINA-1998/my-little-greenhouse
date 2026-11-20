import React, { useState, useEffect } from 'react';

export type BotanicalDialogTone = 'success' | 'info' | 'warning' | 'danger';

interface DialogRequest {
  id: string;
  kind: 'alert' | 'confirm' | 'prompt';
  title: string;
  message: string;
  tone: BotanicalDialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
  defaultValue?: string;
  placeholder?: string;
  isPin?: boolean;
  resolve: (value: any) => void;
}

type DialogListener = (req: DialogRequest | null) => void;

let activeListener: DialogListener | null = null;
const requestQueue: DialogRequest[] = [];
let currentActiveRequest: DialogRequest | null = null;

const notifyNextInQueue = () => {
  if (currentActiveRequest || !activeListener) return;
  const next = requestQueue.shift() || null;
  currentActiveRequest = next;
  activeListener(next);
};

const enqueueDialog = (req: Omit<DialogRequest, 'id'>) => {
  const fullReq: DialogRequest = {
    ...req,
    id: 'dlg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)
  };
  requestQueue.push(fullReq);
  notifyNextInQueue();
};

// ۱. جایگزین اختصاصی alert() مرورگر
export const showBotanicalAlert = (params: {
  title: string;
  message: string;
  tone?: BotanicalDialogTone;
  confirmLabel?: string;
}): Promise<void> => {
  return new Promise((resolve) => {
    enqueueDialog({
      kind: 'alert',
      title: params.title,
      message: params.message,
      tone: params.tone || 'info',
      confirmLabel: params.confirmLabel || 'متوجه شدم ✓',
      resolve: () => resolve()
    });
  });
};

// ۲. جایگزین اختصاصی window.confirm() مرورگر
export const askBotanicalConfirm = (params: {
  title: string;
  message: string;
  tone?: BotanicalDialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> => {
  return new Promise((resolve) => {
    enqueueDialog({
      kind: 'confirm',
      title: params.title,
      message: params.message,
      tone: params.tone || 'warning',
      confirmLabel: params.confirmLabel || 'بله، تایید می‌کنم ✓',
      cancelLabel: params.cancelLabel || 'انصراف',
      resolve: (val: boolean) => resolve(Boolean(val))
    });
  });
};

// ۳. جایگزین اختصاصی window.prompt() مرورگر (متن یا پین‌کد ۴ رقمی)
export const askBotanicalPrompt = (params: {
  title: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  isPin?: boolean;
  tone?: BotanicalDialogTone;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<string | null> => {
  return new Promise((resolve) => {
    enqueueDialog({
      kind: 'prompt',
      title: params.title,
      message: params.message,
      defaultValue: params.defaultValue || '',
      placeholder: params.placeholder || '',
      isPin: params.isPin || false,
      tone: params.tone || 'info',
      confirmLabel: params.confirmLabel || 'تایید و ثبت ✓',
      cancelLabel: params.cancelLabel || 'انصراف',
      resolve: (val: string | null) => resolve(val)
    });
  });
};

// آیکون‌های برداری اختصاصی بر اساس نوع پیام
const DialogToneIcon: React.FC<{ tone: BotanicalDialogTone }> = ({ tone }) => {
  if (tone === 'success') {
    return (
      <span className="w-9 h-9 rounded-2xl bg-[#E6F0EB] border border-[#2E5A44]/25 text-[#2E5A44] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (tone === 'danger') {
    return (
      <span className="w-9 h-9 rounded-2xl bg-[#FCEEE9] border border-[#C85A32]/30 text-[#C85A32] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (tone === 'warning') {
    return (
      <span className="w-9 h-9 rounded-2xl bg-[#FEF6E7] border border-[#D97706]/30 text-[#B45309] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 8v5M12 16h.01"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="w-9 h-9 rounded-2xl bg-[#EBF4F8] border border-[#2B7A9B]/30 text-[#1F6380] flex items-center justify-center shrink-0">
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 16v-4M12 8h.01"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};

export const BotanicalDialogHost: React.FC = () => {
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    activeListener = (req) => {
      setRequest(req);
      setInputVal(req?.defaultValue || '');
    };
    notifyNextInQueue();
    return () => {
      activeListener = null;
    };
  }, []);

  if (!request) return null;

  const closeAndResolve = (result: any) => {
    const target = request;
    currentActiveRequest = null;
    setRequest(null);
    target.resolve(result);
    setTimeout(notifyNextInQueue, 40);
  };

  const confirmBtnClass =
    request.tone === 'danger'
      ? 'bg-[#C85A32] text-white border-[#C85A32]'
      : request.tone === 'warning'
      ? 'bg-[#B45309] text-white border-[#B45309]'
      : 'bg-[#2E5A44] text-white border-[#2E5A44]';

  return (
    <div className="fixed inset-0 z-[90] bg-[#1C2822]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] border border-[#E8E2D5] rounded-3xl max-w-xs w-full p-4 space-y-3.5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* هدر متقارن دیالوگ */}
        <div className="flex items-center justify-between gap-2.5 border-b border-[#E8E2D5] pb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <DialogToneIcon tone={request.tone} />
            <h4 className="font-heading text-[14.5px] font-extrabold text-[#1C2822] leading-snug">
              {request.title}
            </h4>
          </div>

          <button
            type="button"
            onClick={() =>
              closeAndResolve(request.kind === 'confirm' ? false : null)
            }
            className="w-7 h-7 rounded-xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] hover:text-[#C85A32] flex items-center justify-center shrink-0 active:scale-90 transition-transform"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* متن پیام */}
        <p className="persian-num text-[11.5px] font-semibold text-[#1C2822] bg-[#F6F3EC] p-3 rounded-2xl border border-[#E8E2D5] leading-relaxed text-justify">
          {request.message}
        </p>

        {/* کادر ورودی در حالت prompt (پین‌کد یا متن) */}
        {request.kind === 'prompt' && (
          <div>
            <input
              autoFocus
              type={request.isPin ? 'password' : 'text'}
              inputMode={request.isPin ? 'numeric' : 'text'}
              maxLength={request.isPin ? 4 : 120}
              dir={request.isPin ? 'ltr' : 'rtl'}
              value={inputVal}
              onChange={(e) =>
                setInputVal(
                  request.isPin
                    ? e.target.value.replace(/\D/g, '').slice(0, 4)
                    : e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  closeAndResolve(inputVal);
                }
              }}
              placeholder={request.placeholder}
              className={`w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border-2 border-[#2E5A44]/40 focus:outline-none focus:border-[#2E5A44] ${
                request.isPin
                  ? 'text-center font-mono text-[16px] tracking-[0.4em] font-extrabold'
                  : 'text-[11.5px] font-bold'
              }`}
            />
          </div>
        )}

        {/* دکمه‌های عملیاتی پایین */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              if (request.kind === 'confirm') closeAndResolve(true);
              else if (request.kind === 'prompt') closeAndResolve(inputVal);
              else closeAndResolve(undefined);
            }}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-[12px] border warm-shadow active:scale-98 transition-transform ${confirmBtnClass}`}
          >
            {request.confirmLabel}
          </button>

          {request.kind !== 'alert' && (
            <button
              type="button"
              onClick={() =>
                closeAndResolve(request.kind === 'confirm' ? false : null)
              }
              className="px-4 py-2.5 rounded-2xl bg-[#F6F3EC] border border-[#E8E2D5] text-[#5A655E] font-bold text-[11.5px] active:scale-95 transition-transform"
            >
              {request.cancelLabel || 'انصراف'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};