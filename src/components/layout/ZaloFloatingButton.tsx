const ZALO_URL = 'https://zalo.me/0382548419';

export const ZaloFloatingButton = () => (
  <a
    href={ZALO_URL}
    target="_blank"
    rel="noreferrer"
    aria-label="Nhắn tin với B-ECO qua Zalo"
    className="group fixed bottom-24 right-4 z-50 flex items-center gap-3 md:bottom-28 md:right-7"
  >
    <span className="hidden rounded-xl bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-lg ring-1 ring-slate-200 transition-all group-hover:-translate-x-1 group-hover:text-[#0068ff] sm:block">
      Chat với B-ECO
    </span>
    <span className="relative flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#0068ff] shadow-[0_10px_30px_rgba(0,104,255,0.35)] ring-4 ring-white transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_14px_34px_rgba(0,104,255,0.45)] group-focus-visible:-translate-y-1 md:h-16 md:w-16">
      <span className="relative flex h-8 w-11 items-center justify-center rounded-[11px] bg-white text-[13px] font-extrabold tracking-[-0.06em] text-[#0068ff] md:h-9 md:w-12 md:text-sm">
        Zalo
        <span className="absolute -bottom-1 right-2 h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white" />
      </span>
    </span>
  </a>
);
