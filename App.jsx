/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  BizBook KZ v3.0 — Платформа финансового учёта для бизнеса РК  ║
 * ║  © 2026 ТОО «NOVA Comp». Все права защищены.                   ║
 * ║  Авторские права защищены Законом РК «Об авторском праве» №6-I ║
 * ║  Несанкционированное копирование ЗАПРЕЩЕНО.                     ║
 * ║  Разработано: ТОО «NOVA Comp» | novacomp.kz                    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
import { useState, useEffect, useRef, useCallback } from "react";

// ─── COPYRIGHT ──────────────────────────────────────────────────
/* © 2026 ТОО «NOVA Comp». All Rights Reserved. Закон РК ↖6-I */
const APP_FP = "NC-BIZBOOK-KZ-v3-2026";

// ─── CONSTANTS ────────────────────────────────────────────────────
const MRP = 4325, MZP = 85000;
const APP = { name: "BizBook KZ", version: "3.0.0", owner: "ТОО «NOVA Comp»", year: 2026 };
const CO = {
  name: "ТОО «NOVA COMP»", bin: "241040014477", reg: "10.10.2024",
  city: "Алматы", address: "г. Алматы, Турксибский р-н, мкр ЖУЛДЫЗ-2, д.35, кв.64",
  phone: "+7 705 474 1612", email: "info@novacomp.kz",
  director: "Иванов Алексей Сергеевич", regime: "ОУР", nds: true,
  bank: "Halyk Bank", bik: "HSBKKZKX", iik: "KZ89 601A 1234 5678 9100",
};
const EMPLOYEES = [
  { id:1, name:"Иванов Алексей Сергеевич", pos:"Генеральный директор", salary:600000, type:"standard", hired:"01.11.2024" },
  { id:2, name:"Петрова Анна Владимировна", pos:"Менеджер по продажам",  salary:380000, type:"standard", hired:"01.11.2024" },
  { id:3, name:"Сейткали Марат Бекович",   pos:"Маркетолог",            salary:350000, type:"standard", hired:"15.11.2024" },
];
const DOCS = [
  { id:1, no:"ЭСФ-0001", type:"ЭСФ",         dir:"out", cp:"ТОО «Digital Solutions»", amount:1180000, nds:163448, date:"05.05.2026", service:"Разработка CRM-системы",          pay:"paid",    ship:"shipped",   signed:true  },
  { id:2, no:"ЭАВР-0001",type:"ЭАВР",         dir:"out", cp:"ТОО «Digital Solutions»", amount:1180000, nds:163448, date:"05.05.2026", service:"Разработка CRM-системы",          pay:"paid",    ship:"shipped",   signed:true  },
  { id:3, no:"СЧ-0002",  type:"счёт",         dir:"out", cp:"ИП Сейткалиева Г.А.",      amount:250000,  nds:0,      date:"07.05.2026", service:"SEO-оптимизация сайта",           pay:"partial", ship:"unshipped", signed:false },
  { id:4, no:"АВР-0001", type:"АВР",          dir:"out", cp:"ИП Сейткалиева Г.А.",      amount:120000,  nds:0,      date:"07.05.2026", service:"Консультационные услуги",         pay:"paid",    ship:"shipped",   signed:true  },
  { id:5, no:"ДВР-0001", type:"доверенность", dir:"out", cp:"ТОО «Digital Solutions»", amount:0,       nds:0,      date:"06.05.2026", service:"Доверенность на получение ТМЦ",  pay:"paid",    ship:"shipped",   signed:true  },
  { id:6, no:"НАК-0001", type:"накладная",    dir:"out", cp:"ТОО «Digital Solutions»", amount:340000,  nds:0,      date:"06.05.2026", service:"Компьютерное оборудование",      pay:"unpaid",  ship:"unshipped", signed:false },
  { id:7, no:"ЭСФ-ВХ-4521",type:"ЭСФ",       dir:"in",  cp:"ТОО «КазАренда»",          amount:310200,  nds:42993,  date:"01.05.2026", service:"Аренда офиса май 2026",          pay:"paid",    ship:"shipped",   signed:true  },
  { id:8, no:"АКТ-ВХ-012",type:"акт",         dir:"in",  cp:"Beeline Kazakhstan",       amount:45000,   nds:0,      date:"01.05.2026", service:"Услуги связи май",               pay:"paid",    ship:"shipped",   signed:true  },
];
const BANK_OPS = [
  { id:1, date:"05.05.2026", desc:"Оплата от ТОО «Digital Solutions»", amount:1180000, type:"in",  cat:"revenue" },
  { id:2, date:"04.05.2026", desc:"Выплата ЗП Иванов А.С.",            amount:-503000, type:"out", cat:"salary"  },
  { id:3, date:"04.05.2026", desc:"Выплата ЗП Петрова А.В.",           amount:-320700, type:"out", cat:"salary"  },
  { id:4, date:"04.05.2026", desc:"Выплата ЗП Сейткали М.Б.",          amount:-295000, type:"out", cat:"salary"  },
  { id:5, date:"05.05.2026", desc:"Налоги ИПН + СН за Q1",             amount:-158000, type:"out", cat:"tax"     },
  { id:6, date:"05.05.2026", desc:"Соцплатежи ОПВ+СО+ОСМС+ОПВР",      amount:-212000, type:"out", cat:"tax"     },
  { id:7, date:"01.05.2026", desc:"Аренда офиса ТОО «КазАренда»",      amount:-310200, type:"out", cat:"expense" },
  { id:8, date:"07.05.2026", desc:"Частичная оплата ИП Сейткалиева",   amount:125000,  type:"in",  cat:"revenue" },
];
const TAXES = [
  { code:"КПН",  rate:"20%", form:"ФНО 100", period:"Раз в год",    deadline:"10 апр 2027", status:"planned", amount:null,   note:"Авансы ежемесячно до 25 числа"   },
  { code:"НДС",  rate:"16%", form:"ФНО 300", period:"Квартально",   deadline:"15 мая 2026", status:"urgent",  amount:120690, note:"Порог: 43.25 млн ₸ (10 000 МРП)" },
  { code:"ИПН",  rate:"10%", form:"ФНО 200", period:"Квартально",   deadline:"15 мая 2026", status:"urgent",  amount:130000, note:"Вычет 30 МРП = 129 750 ₸/мес"   },
  { code:"СН",   rate:"6%",  form:"ФНО 200", period:"Квартально",   deadline:"15 мая 2026", status:"urgent",  amount:78900,  note:"Снижен с 11% до 6% с 2026"      },
  { code:"ОПВ",  rate:"10%", form:"ФНО 200", period:"Ежемесячно",   deadline:"25 мая 2026", status:"pending", amount:133000, note:"Макс. база: 50 МЗП"             },
  { code:"ОПВР", rate:"3.5%",form:"ФНО 200", period:"Ежемесячно",   deadline:"25 мая 2026", status:"pending", amount:46550,  note:"Повышен с 2.5% до 3.5% с 2026"  },
  { code:"СО",   rate:"5%",  form:"ФНО 200", period:"Ежемесячно",   deadline:"25 мая 2026", status:"pending", amount:32500,  note:"Макс 7 МЗП · мин 1 МЗП"         },
  { code:"ВОСМС",rate:"2%",  form:"ФНО 200", period:"Ежемесячно",   deadline:"25 мая 2026", status:"pending", amount:26600,  note:"Работник дополнительно 2%"      },
];
const DOC_COLORS = { "ЭСФ":"#f59e0b","ЭАВР":"#06b6d4","АВР":"#22c55e","акт":"#22c55e","счёт":"#3b82f6","доверенность":"#a855f7","накладная":"#64748b","СФ":"#f59e0b","договор":"#ec4899" };
const DOC_ICONS  = { "ЭСФ":"🧾","ЭАВР":"📋","АВР":"✅","акт":"✅","счёт":"📄","доверенность":"📜","накладная":"📦","СФ":"🗂","договор":"📑" };
const PAY_MAP = {
  paid:    { l:"Оплачен",     lk:"Төленді",    c:"#22c55e", b:"rgba(34,197,94,.13)"  },
  partial: { l:"Частично",    lk:"Ішінара",    c:"#f59e0b", b:"rgba(245,158,11,.13)" },
  unpaid:  { l:"Не оплачен",  lk:"Төленбеді",  c:"#ef4444", b:"rgba(239,68,68,.13)"  },
};

// ─── SALARY CALC NK RK 2026 ───────────────────────────────────────
function calcSalary(gross, type = "standard") {
  const isPens = type === "pensioner", isStudent = type === "student";
  const isDisabled = type === "disabled", isNonresident = type === "nonresident";
  const opv  = (isPens || isNonresident) ? 0 : Math.round(Math.min(gross, 50*MZP) * .10);
  const vosms = (isPens || isStudent) ? 0 : Math.round(gross * .02);
  const deduct = 30*MRP + (isDisabled ? 882*MRP : 0);
  const ipnBase = isNonresident ? gross : Math.max(0, gross - opv - vosms - deduct);
  const ipn   = Math.round(ipnBase * (isNonresident ? .20 : .10));
  const net   = gross - opv - vosms - ipn;
  const opvr  = isPens ? 0 : Math.round(Math.min(gross, 50*MZP) * .035);
  const so    = isPens ? 0 : Math.round(Math.min(Math.max(gross-opv, MZP), 7*MZP) * .05);
  const sn    = Math.max(0, Math.round(gross * .06) - so);
  const vemp  = Math.round(gross * .02);
  return { gross, opv, vosms, ipn, net, opvr, so, sn, vemp, total: gross+opvr+so+sn+vemp };
}

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const T = {
  ru: {
    appName:"BizBook KZ", home:"Главная", docs:"Документы", bank:"Банк", taxes:"Налоги",
    cabinet:"Кабинет", analytics:"Аналитика", calendar:"Календарь", news:"Новости",
    ai:"ИИ-ассистент", settings:"Настройки", profile:"Профиль", logout:"Выйти",
    create:"+ Создать", search:"Поиск...", save:"Сохранить", cancel:"Отмена",
    send:"Отправить", sign:"Подписать ЭЦП", edit:"Изменить", delete:"Удалить",
    income:"Доходы", expense:"Расходы", profit:"Прибыль", balance:"Баланс",
    urgent:"Срочно", pending:"Ожидает", planned:"Запланирован",
    salary:"Зарплата", employees:"Сотрудники", reports:"Отчёты",
    dark:"Тёмная", light:"Светлая", system:"Системная", theme:"Тема",
    lang:"Язык", welcome:"Добро пожаловать!",
    register:"Регистрация", login:"Войти", phone:"Телефон", email:"Email",
    password:"Пароль", bin:"БИН / ИИН",
    taxCalendar:"Налоговый календарь", recentDocs:"Последние документы",
    allDocs:"Все →", createDoc:"Создать документ",
    nkRk:"НК РК 2026", paid:"Оплачен", unpaid:"Не оплачен", partial:"Частично",
    copyright:`© ${APP.year} ${APP.owner}. Все права защищены.`,
  },
  kz: {
    appName:"BizBook KZ", home:"Басты", docs:"Құжаттар", bank:"Банк", taxes:"Салықтар",
    cabinet:"Кабинет", analytics:"Аналитика", calendar:"Күнтізбе", news:"Жаңалықтар",
    ai:"ЖИ-көмекші", settings:"Баптаулар", profile:"Профиль", logout:"Шығу",
    create:"+ Жасау", search:"Іздеу...", save:"Сақтау", cancel:"Болдырмау",
    send:"Жіберу", sign:"ЭЦҚ қол қою", edit:"Өзгерту", delete:"Жою",
    income:"Кіріс", expense:"Шығыс", profit:"Пайда", balance:"Баланс",
    urgent:"Шұғыл", pending:"Күтуде", planned:"Жоспарда",
    salary:"Жалақы", employees:"Қызметкерлер", reports:"Есептер",
    dark:"Қараңғы", light:"Жарық", system:"Жүйелік", theme:"Тақырып",
    lang:"Тіл", welcome:"Қош келдіңіз!",
    register:"Тіркелу", login:"Кіру", phone:"Телефон", email:"Email",
    password:"Құпиясөз", bin:"БИН / ЖСН",
    taxCalendar:"Салық күнтізбесі", recentDocs:"Соңғы құжаттар",
    allDocs:"Барлығы →", createDoc:"Құжат жасау",
    nkRk:"ҚР СК 2026", paid:"Төленді", unpaid:"Төленбеді", partial:"Ішінара",
    copyright:`© ${APP.year} ${APP.owner}. Барлық құқықтар қорғалған.`,
  }
};

// ─── THEME SYSTEM ─────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#060914", card:"#0c0f1e", card2:"#131728", card3:"#1a1f30",
    border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.13)",
    text:"#eef1ff", muted:"#5a6480", dim:"#252a42",
    blue:"#1d4ed8", gold:"#d97706", goldL:"#fbbf24",
    green:"#16a34a", red:"#dc2626", orange:"#d97706",
    purple:"#7c3aed", cyan:"#0891b2", teal:"#0f766e",
    navBg:"#080b18", shadow:"rgba(0,0,0,0.85)",
    accent:"#d97706", accentSoft:"rgba(217,119,6,0.15)",
    blueSoft:"rgba(29,78,216,0.15)", inputBg:"#131728",
  },
  light: {
    bg:"#f5f7ff", card:"#ffffff", card2:"#eef1fb", card3:"#e4e8f5",
    border:"rgba(0,0,0,0.08)", border2:"rgba(0,0,0,0.15)",
    text:"#0a0d1a", muted:"#6b7280", dim:"#d1d5db",
    blue:"#1d4ed8", gold:"#b45309", goldL:"#d97706",
    green:"#15803d", red:"#b91c1c", orange:"#b45309",
    purple:"#6d28d9", cyan:"#0e7490", teal:"#0f766e",
    navBg:"#ffffff", shadow:"rgba(0,0,0,0.12)",
    accent:"#b45309", accentSoft:"rgba(180,83,9,0.1)",
    blueSoft:"rgba(29,78,216,0.08)", inputBg:"#f9faff",
  }
};

function useTheme() {
  const sys = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem("bb_theme") || "system"; } catch { return "system"; }
  });
  const resolved = mode === "system" ? sys() : mode;
  const C = THEMES[resolved];
  useEffect(() => {
    try { localStorage.setItem("bb_theme", mode); } catch {}
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const h = () => { if (mode === "system") setMode(m => m); };
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [mode]);
  return { C, mode, setMode, resolved };
}

function useLang() {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("bb_lang") || "ru"; } catch { return "ru"; }
  });
  useEffect(() => { try { localStorage.setItem("bb_lang", lang); } catch {} }, [lang]);
  const t = useCallback((k) => T[lang][k] || T.ru[k] || k, [lang]);
  return { lang, setLang, t };
}

// ─── UTILS ────────────────────────────────────────────────────────
const fmt  = n => (n||0).toLocaleString("ru-KZ") + " ₸";
const fmtS = n => n >= 1e6 ? (n/1e6).toFixed(1)+" млн ₸" : n >= 1e3 ? (n/1e3).toFixed(0)+"К ₸" : fmt(n);

// ─── LOGO ─────────────────────────────────────────────────────────
const Logo = ({ size=36, gold="#d97706" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1e3a8a"/>
        <stop offset="100%" stopColor="#1d4ed8"/>
      </linearGradient>
      <linearGradient id="lg2" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={gold}/>
        <stop offset="100%" stopColor="#fbbf24"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="url(#lg1)"/>
    <path d="M18 25L18 75L32 75L32 50L54 75L68 75L68 25L54 25L54 50L32 25Z" fill="url(#lg2)"/>
    <rect x="72" y="25" width="10" height="50" rx="4" fill="url(#lg2)"/>
  </svg>
);

// ─── MICRO COMPONENTS ─────────────────────────────────────────────
const Badge = ({ s, map, lang="ru" }) => {
  const d = map[s] || Object.values(map)[0];
  return <span style={{ fontSize:9, padding:"2px 8px", borderRadius:12, fontWeight:700, background:d.b, color:d.c, whiteSpace:"nowrap" }}>{lang==="kz"&&d.lk ? d.lk : d.l}</span>;
};

const DIcon = ({ type, sz=36 }) => (
  <div style={{ width:sz, height:sz, borderRadius:sz*.28, flexShrink:0, background:`${DOC_COLORS[type]||"#3b82f6"}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:sz*.44 }}>
    {DOC_ICONS[type]||"📄"}
  </div>
);

const Toggle = ({ on, onToggle, col="#d97706" }) => (
  <div onClick={onToggle} style={{ width:44, height:24, borderRadius:12, background:on?col:"#374151", display:"flex", alignItems:"center", padding:"0 3px", cursor:"pointer", flexShrink:0, transition:"background .2s" }}>
    <div style={{ width:18, height:18, borderRadius:9, background:"#fff", transform:on?"translateX(20px)":"translateX(0)", transition:"transform .2s" }}/>
  </div>
);

const Btn = ({ children, onClick, col, style={}, disabled }) => {
  const bg = disabled ? "#374151" : col ? `linear-gradient(135deg,${col},${col}cc)` : "linear-gradient(135deg,#1d4ed8,#1e40af)";
  return (
    <button onClick={onClick} disabled={disabled} style={{ padding:"12px 0", borderRadius:14, background:bg, border:"none", color:disabled?"#6b7280":"#fff", fontSize:13, fontWeight:700, cursor:disabled?"not-allowed":"pointer", width:"100%", transition:"opacity .15s", ...style }}>
      {children}
    </button>
  );
};

const SBtn = ({ children, onClick, C, style={} }) => (
  <button onClick={onClick} style={{ padding:"11px 0", borderRadius:13, background:C.card2, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, fontWeight:600, cursor:"pointer", width:"100%", ...style }}>
    {children}
  </button>
);

const Input = ({ label, value, onChange, placeholder, type="text", C }) => (
  <div style={{ marginBottom:12 }}>
    {label && <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:"0 0 4px", textTransform:"uppercase", letterSpacing:.6 }}>{label}</p>}
    <input value={value||""} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} type={type}
      style={{ width:"100%", background:C.inputBg, border:`1px solid ${C.border2}`, borderRadius:12, padding:"11px 14px", color:C.text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
  </div>
);

const Fd = ({ label, value, C }) => (
  <div style={{ marginBottom:10 }}>
    <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:"0 0 3px", textTransform:"uppercase", letterSpacing:.5 }}>{label}</p>
    <div style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:11, padding:"10px 14px", color:value?C.text:C.dim, fontSize:12 }}>{value||"—"}</div>
  </div>
);

const Sec = ({ children, action, onAction, C }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", margin:"16px 0 8px" }}>
    <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:0, textTransform:"uppercase", letterSpacing:1.2 }}>{children}</p>
    {action && <button onClick={onAction} style={{ background:"none", border:"none", color:C.gold, fontSize:11, cursor:"pointer", fontWeight:600, padding:0 }}>{action}</button>}
  </div>
);

// ─── SIDE MENU ────────────────────────────────────────────────────
function SideMenu({ open, onClose, screen, nav, C, t, mode, setMode, lang, setLang }) {
  const items = [
    { key:"home",      icon:"🏠", label:t("home")      },
    { key:"docs",      icon:"📁", label:t("docs")      },
    { key:"bank",      icon:"🏦", label:t("bank")      },
    { key:"taxes",     icon:"📊", label:t("taxes")     },
    { key:"analytics", icon:"📈", label:t("analytics") },
    { key:"calendar",  icon:"📅", label:t("calendar")  },
    { key:"news",      icon:"📰", label:t("news")      },
    { key:"ai",        icon:"🤖", label:t("ai")        },
    { key:"profile",   icon:"👤", label:t("profile")   },
  ];
  const themes = [
    { v:"dark",   icon:"🌙", label:t("dark")   },
    { v:"light",  icon:"☀️", label:t("light")  },
    { v:"system", icon:"💻", label:t("system") },
  ];
  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)", zIndex:100, opacity:open?1:0, pointerEvents:open?"all":"none", transition:"opacity .25s" }}/>
      {/* Panel */}
      <div style={{ position:"fixed", top:0, left:0, bottom:0, width:280, background:C.card, borderRight:`1px solid ${C.border2}`, zIndex:101, transform:open?"translateX(0)":"translateX(-100%)", transition:"transform .28s cubic-bezier(.4,0,.2,1)", display:"flex", flexDirection:"column", boxShadow:open?`4px 0 40px ${C.shadow}`:"none" }}>
        {/* Header */}
        <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
          <Logo size={38} gold={C.goldL}/>
          <div>
            <p style={{ color:C.text, fontSize:15, fontWeight:800, margin:0 }}>{APP.name}</p>
            <p style={{ color:C.muted, fontSize:10, margin:0 }}>{APP.owner}</p>
          </div>
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", color:C.muted, fontSize:22, cursor:"pointer", padding:0, lineHeight:1 }}>✕</button>
        </div>

        {/* Nav items */}
        <div style={{ flex:1, overflowY:"auto", padding:"10px 10px" }}>
          {items.map(({ key, icon, label }) => {
            const active = screen === key;
            return (
              <button key={key} onClick={() => { nav(key); onClose(); }} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 12px", borderRadius:12, border:"none", cursor:"pointer", background:active?C.accentSoft:"transparent", marginBottom:3, textAlign:"left", transition:"background .15s" }}>
                <span style={{ fontSize:18, width:24, textAlign:"center" }}>{icon}</span>
                <span style={{ color:active?C.gold:C.text, fontSize:13, fontWeight:active?700:500 }}>{label}</span>
                {active && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:3, background:C.gold }}/>}
              </button>
            );
          })}
        </div>

        {/* Theme switcher */}
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
          <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:"0 0 8px", textTransform:"uppercase", letterSpacing:1 }}>{t("theme")}</p>
          <div style={{ display:"flex", gap:5 }}>
            {themes.map(({ v, icon, label }) => (
              <button key={v} onClick={() => setMode(v)} style={{ flex:1, padding:"7px 4px", borderRadius:10, border:`1.5px solid ${mode===v?C.gold:C.border}`, background:mode===v?C.accentSoft:"transparent", color:mode===v?C.gold:C.muted, fontSize:9, fontWeight:600, cursor:"pointer" }}>
                {icon}<br/>{label}
              </button>
            ))}
          </div>
        </div>

        {/* Lang switcher */}
        <div style={{ padding:"8px 14px", borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", gap:6 }}>
            {[["ru","🇷🇺 РУС"],["kz","🇰🇿 ҚАЗ"]].map(([v,l]) => (
              <button key={v} onClick={() => setLang(v)} style={{ flex:1, padding:"8px", borderRadius:10, border:`1.5px solid ${lang===v?C.blue:C.border}`, background:lang===v?C.blueSoft:"transparent", color:lang===v?C.text:C.muted, fontSize:11, fontWeight:600, cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"10px 14px 16px", borderTop:`1px solid ${C.border}` }}>
          <p style={{ color:C.dim, fontSize:8, margin:0, textAlign:"center", lineHeight:1.6 }}>{t("copyright")}<br/>Закон РК «Об авторском праве» №6-I</p>
        </div>
      </div>
    </>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────
function TopBar({ onMenu, title, right, C, subtitle }) {
  return (
    <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
      <button onClick={onMenu} style={{ width:38, height:38, borderRadius:12, background:C.card2, border:`1px solid ${C.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>☰</button>
      <div style={{ flex:1, minWidth:0 }}>
        <h2 style={{ color:C.text, fontSize:16, fontWeight:800, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</h2>
        {subtitle && <p style={{ color:C.muted, fontSize:10, margin:0 }}>{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────

function HomeScreen({ nav, setSelDoc, C, t, lang }) {
  const income  = DOCS.filter(d=>d.dir==="out"&&d.pay==="paid").reduce((s,d)=>s+d.amount,0);
  const expense = BANK_OPS.filter(o=>o.type==="out").reduce((s,o)=>s+Math.abs(o.amount),0);
  const urgAmt  = TAXES.filter(x=>x.status==="urgent").reduce((s,x)=>s+(x.amount||0),0);
  const pending = DOCS.filter(d=>d.pay==="unpaid"&&d.dir==="out").reduce((s,d)=>s+d.amount,0);

  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      {/* Finance hero */}
      <div style={{ padding:"12px 16px 0" }}>
        <div style={{ background:`linear-gradient(135deg,#0d1b4b,#1a2d6b)`, borderRadius:20, padding:"18px", border:"1px solid rgba(29,78,216,.3)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:120, height:120, borderRadius:"50%", background:"rgba(217,119,6,.08)" }}/>
          <div style={{ position:"absolute", right:30, bottom:-20, width:80, height:80, borderRadius:"50%", background:"rgba(29,78,216,.1)" }}/>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:10, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:1 }}>{t("income")} · {lang==="kz"?"Мамыр":"Май"} 2026</p>
          <h1 style={{ color:"#fff", fontSize:28, fontWeight:900, margin:"0 0 14px", letterSpacing:-0.5 }}>{fmt(income)}</h1>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
            {[[t("expense"),expense,"#ef4444"],[t("pending"),pending,"#f59e0b"],[t("profit"),income-expense,"#22c55e"]].map(([l,v,c],i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,.07)", borderRadius:11, padding:"9px 8px" }}>
                <p style={{ color:"rgba(255,255,255,.45)", fontSize:9, margin:"0 0 3px", lineHeight:1.2 }}>{l}</p>
                <p style={{ color:c, fontSize:11, fontWeight:700, margin:0 }}>{fmtS(v)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent */}
      {urgAmt > 0 && (
        <div style={{ padding:"10px 16px 0" }}>
          <div onClick={()=>nav("taxes")} style={{ background:`rgba(220,38,38,.1)`, border:"1px solid rgba(220,38,38,.3)", borderRadius:14, padding:"12px 14px", cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>⚠️</span>
            <div style={{ flex:1 }}>
              <p style={{ color:"#ef4444", fontSize:12, fontWeight:700, margin:"0 0 1px" }}>{lang==="kz"?"Шұғыл 15 мамырға дейін":"Срочно до 15 мая · 3 формы"}</p>
              <p style={{ color:C.muted, fontSize:10, margin:0 }}>ФНО 200+300 · {fmt(urgAmt)}</p>
            </div>
            <span style={{ color:"#ef4444", fontSize:18 }}>›</span>
          </div>
        </div>
      )}

      {/* Quick create */}
      <div style={{ padding:"10px 16px 0" }}>
        <Sec C={C}>{t("createDoc")}</Sec>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {[["🧾","ЭСФ","#f59e0b"],["📋","ЭАВР","#06b6d4"],["📄",lang==="kz"?"Шот":"Счёт","#1d4ed8"],["📜",lang==="kz"?"Сенімхат":"Довер-ть","#7c3aed"],["📦",lang==="kz"?"Жүкқ.":"Накладн.","#64748b"],["📥",lang==="kz"?"Кіріс":"Входящий","#16a34a"]].map(([ic,l,c],i)=>(
            <button key={i} onClick={()=>nav("newDoc")} style={{ background:`${c}12`, border:`1px solid ${c}22`, borderRadius:14, padding:"13px 5px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, transition:"transform .1s" }}>
              <span style={{ fontSize:22 }}>{ic}</span>
              <span style={{ color:c, fontSize:10, fontWeight:700 }}>{l}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analytics mini */}
      <div style={{ padding:"8px 16px 0" }}>
        <Sec C={C} action={t("analytics")+" →"} onAction={()=>nav("analytics")}>{lang==="kz"?"Қаржы":"Финансы"} · {lang==="kz"?"Мамыр":"Май"}</Sec>
        <div style={{ background:C.card, borderRadius:16, padding:"14px", border:`1px solid ${C.border}` }}>
          {[[t("income"),income,"#22c55e"],[t("expense"),expense,"#ef4444"],[lang==="kz"?"Салықтар":"Налоги",urgAmt,"#f59e0b"]].map(([l,v,c])=>(
            <div key={l} style={{ marginBottom:10 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ color:C.muted, fontSize:11 }}>{l}</span>
                <span style={{ color:c, fontSize:11, fontWeight:700 }}>{fmt(v)}</span>
              </div>
              <div style={{ height:5, background:C.dim, borderRadius:3 }}>
                <div style={{ height:"100%", width:`${Math.min(v/income*100,100)}%`, background:c, borderRadius:3, transition:"width 1s" }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent docs */}
      <div style={{ padding:"8px 16px 0" }}>
        <Sec C={C} action={t("allDocs")} onAction={()=>nav("docs")}>{t("recentDocs")}</Sec>
        {DOCS.slice(0,4).map(doc=>(
          <div key={doc.id} onClick={()=>{setSelDoc(doc);nav("docDetail");}} style={{ background:C.card, borderRadius:13, padding:"11px 12px", marginBottom:7, display:"flex", gap:10, cursor:"pointer", border:`1px solid ${C.border}`, transition:"background .15s" }}>
            <DIcon type={doc.type}/>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:C.text, fontSize:12, fontWeight:600, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.cp}</p>
              <p style={{ color:C.dim, fontSize:9, margin:"2px 0 0" }}>{doc.date} · {doc.type}</p>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              {doc.amount>0 && <p style={{ color:C.text, fontSize:11, fontWeight:700, margin:"0 0 4px" }}>{fmt(doc.amount)}</p>}
              <Badge s={doc.pay} map={PAY_MAP} lang={lang}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocsScreen({ nav, setSelDoc, C, t, lang }) {
  const [dir, setDir]   = useState("все");
  const [filt, setFilt] = useState("все");
  const [q, setQ]       = useState("");
  const filtered = DOCS.filter(d =>
    (dir==="все"||d.dir===dir) &&
    (filt==="все"||d.type===filt) &&
    (q===""||d.cp.toLowerCase().includes(q.toLowerCase())||d.service.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      <div style={{ padding:"8px 16px 0" }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`🔍 ${t("search")}`}
          style={{ width:"100%", background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", color:C.text, fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
      </div>
      <div style={{ padding:"8px 16px 0", display:"flex", gap:5 }}>
        {[["все",lang==="kz"?"Барлығы":"Все"],["out","📤"],["in","📥"]].map(([v,l])=>(
          <button key={v} onClick={()=>setDir(v)} style={{ padding:"6px 12px", borderRadius:12, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, background:dir===v?C.gold:C.card2, color:dir===v?"#fff":C.muted }}>
            {l==="📤"?`📤 ${lang==="kz"?"Шығыс":"Исход."}`:l==="📥"?`📥 ${lang==="kz"?"Кіріс":"Входящ."}`:l}
          </button>
        ))}
      </div>
      <div style={{ padding:"6px 16px 0", display:"flex", gap:4, overflowX:"auto" }}>
        {["все","ЭСФ","ЭАВР","АВР","счёт","акт","доверенность","накладная"].map(f=>(
          <button key={f} onClick={()=>setFilt(f)} style={{ padding:"4px 10px", borderRadius:10, border:`1px solid ${filt===f?C.gold:C.border}`, cursor:"pointer", fontSize:9, fontWeight:600, whiteSpace:"nowrap", background:filt===f?C.accentSoft:"transparent", color:filt===f?C.gold:C.muted, flexShrink:0 }}>{f}</button>
        ))}
      </div>
      <div style={{ padding:"8px 16px 0" }}>
        {filtered.map(doc=>(
          <div key={doc.id} onClick={()=>{setSelDoc(doc);nav("docDetail");}} style={{ background:C.card, borderRadius:13, padding:"11px 12px", marginBottom:7, cursor:"pointer", border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <DIcon type={doc.type}/>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ color:C.text, fontSize:12, fontWeight:600, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{doc.cp}</p>
                <p style={{ color:C.dim, fontSize:9, margin:"2px 0 0" }}>{doc.service}</p>
              </div>
              {doc.amount>0 && <p style={{ color:C.text, fontSize:11, fontWeight:700, margin:0, flexShrink:0 }}>{fmt(doc.amount)}</p>}
            </div>
            <div style={{ marginTop:7, paddingTop:6, borderTop:`1px solid ${C.border}`, display:"flex", gap:4, flexWrap:"wrap", alignItems:"center" }}>
              <span style={{ fontSize:8, padding:"1px 6px", borderRadius:8, background:doc.dir==="out"?C.blueSoft:"rgba(22,163,74,.12)", color:doc.dir==="out"?C.blue:C.green, fontWeight:600 }}>{doc.dir==="out"?"📤":"📥"}</span>
              <span style={{ color:C.dim, fontSize:9 }}>{doc.date}</span>
              <Badge s={doc.pay} map={PAY_MAP} lang={lang}/>
              {doc.nds>0 && <span style={{ fontSize:8, padding:"1px 6px", borderRadius:8, background:C.accentSoft, color:C.gold, fontWeight:600 }}>НДС</span>}
              {doc.signed && <span style={{ fontSize:8, padding:"1px 6px", borderRadius:8, background:"rgba(22,163,74,.12)", color:C.green, fontWeight:600 }}>🔐 ЭЦП</span>}
            </div>
          </div>
        ))}
        {filtered.length===0 && <p style={{ color:C.muted, textAlign:"center", padding:"32px 0", fontSize:12 }}>Ничего не найдено</p>}
      </div>
    </div>
  );
}

function DocDetail({ doc, onBack, C, t, lang }) {
  const [showSign, setShowSign] = useState(false);
  if (!doc) return null;
  const base = doc.amount - doc.nds;
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:24, position:"relative" }}>
      <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.gold, fontSize:28, padding:0, lineHeight:1 }}>‹</button>
        <h2 style={{ color:C.text, fontSize:14, fontWeight:700, margin:0 }}>{DOC_ICONS[doc.type]} {doc.type} №{doc.no}</h2>
        <div style={{ marginLeft:"auto" }}><Badge s={doc.pay} map={PAY_MAP} lang={lang}/></div>
      </div>
      <div style={{ padding:"12px 16px 0" }}>
        <div style={{ background:C.card, borderRadius:16, padding:"16px", border:`1.5px solid ${DOC_COLORS[doc.type]||C.gold}30`, marginBottom:10 }}>
          <div style={{ borderBottom:`2px solid ${DOC_COLORS[doc.type]||C.gold}`, paddingBottom:10, marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p style={{ color:DOC_COLORS[doc.type]||C.gold, fontSize:11, fontWeight:800, margin:"0 0 2px", textTransform:"uppercase" }}>{doc.type} №{doc.no}</p>
                <p style={{ color:C.muted, fontSize:9, margin:0 }}>от {doc.date}</p>
              </div>
              <Logo size={26} gold={C.goldL}/>
            </div>
          </div>
          {[["Поставщик",CO.name],["БИН",CO.bin],["Банк",CO.bank],["ИИК",CO.iik]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ color:C.muted, fontSize:9 }}>{l}</span>
              <span style={{ color:C.text, fontSize:9, fontWeight:600, maxWidth:"55%", textAlign:"right" }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:8, marginTop:4, marginBottom:8 }}>
            <p style={{ color:C.muted, fontSize:9, margin:"0 0 2px", textTransform:"uppercase" }}>Покупатель</p>
            <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:0 }}>{doc.cp}</p>
          </div>
          <div style={{ background:C.card2, borderRadius:10, padding:"10px", marginBottom:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ color:C.muted, fontSize:10 }}>Услуга</span><span style={{ color:C.text, fontSize:10, maxWidth:"55%", textAlign:"right" }}>{doc.service}</span></div>
            {doc.nds>0 && <>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ color:C.muted, fontSize:10 }}>Без НДС</span><span style={{ color:C.text, fontSize:10 }}>{fmt(base)}</span></div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ color:C.muted, fontSize:10 }}>НДС 16%</span><span style={{ color:C.gold, fontSize:10 }}>{fmt(doc.nds)}</span></div>
            </>}
            {doc.amount>0 && <div style={{ display:"flex", justifyContent:"space-between", paddingTop:6, borderTop:`1px solid ${C.border}` }}>
              <span style={{ color:C.text, fontSize:12, fontWeight:700 }}>ИТОГО</span>
              <span style={{ color:C.text, fontSize:14, fontWeight:900 }}>{fmt(doc.amount)}</span>
            </div>}
          </div>
          {doc.signed
            ? <div style={{ background:"rgba(22,163,74,.1)", border:"1px solid rgba(22,163,74,.25)", borderRadius:10, padding:"8px 12px", display:"flex", gap:8, alignItems:"center" }}>
                <span style={{ fontSize:16 }}>🔐</span>
                <div><p style={{ color:C.green, fontSize:10, fontWeight:700, margin:"0 0 1px" }}>Подписан ЭЦП</p><p style={{ color:C.muted, fontSize:9, margin:0 }}>{CO.director} · {doc.date}</p></div>
              </div>
            : <div style={{ background:C.accentSoft, border:`1px solid ${C.gold}30`, borderRadius:10, padding:"8px 12px" }}>
                <p style={{ color:C.gold, fontSize:10, fontWeight:700, margin:"0 0 1px" }}>⚠️ Требуется подпись ЭЦП</p>
                <p style={{ color:C.muted, fontSize:9, margin:0 }}>eGov Mobile / eGov Cloud</p>
              </div>
          }
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:8 }}>
          {[["👁","PDF"],["📤",t("send")],["✏️",t("edit")]].map(([ic,l],i)=>(
            <button key={i} style={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:11, padding:"10px 5px", cursor:"pointer", color:C.text, fontSize:9, fontWeight:600 }}>{ic}<br/>{l}</button>
          ))}
        </div>
        {!doc.signed && <Btn onClick={()=>setShowSign(true)} col={C.green} style={{ marginBottom:8 }}>🔐 {t("sign")}</Btn>}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
          <button style={{ background:"rgba(220,38,38,.1)", border:"1px solid rgba(220,38,38,.2)", borderRadius:11, padding:"10px", cursor:"pointer", color:"#ef4444", fontSize:11, fontWeight:600 }}>🗑 {t("delete")}</button>
          <button style={{ background:C.blueSoft, border:`1px solid ${C.blue}22`, borderRadius:11, padding:"10px", cursor:"pointer", color:C.blue, fontSize:11, fontWeight:600 }}>📋 Копировать</button>
        </div>
      </div>
      {showSign && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.88)", display:"flex", alignItems:"flex-end", zIndex:50, borderRadius:44 }}>
          <div style={{ background:C.card, borderRadius:"22px 22px 0 0", width:"100%", padding:"18px 18px 26px" }}>
            <div style={{ width:36, height:4, background:C.dim, borderRadius:2, margin:"0 auto 16px" }}/>
            <h3 style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 14px" }}>🔐 Подписание ЭЦП</h3>
            {[["📱","eGov Mobile","QR-код · push-уведомление","Рекомендовано",C.green],["☁️","eGov Cloud","ЭЦП в облаке · логин/пароль","Без носителя",C.blue],["💻","NCA Layer (ПК)","USB-токен · только компьютер","Для десктопа",C.gold]].map(([ic,t2,d,note,c],i)=>(
              <div key={i} onClick={()=>setShowSign(false)} style={{ background:C.card2, borderRadius:12, padding:"12px 13px", marginBottom:7, cursor:"pointer", display:"flex", gap:11, alignItems:"center" }}>
                <span style={{ fontSize:22 }}>{ic}</span>
                <div style={{ flex:1 }}>
                  <p style={{ color:C.text, fontSize:12, fontWeight:600, margin:"0 0 1px" }}>{t2}</p>
                  <p style={{ color:C.muted, fontSize:10, margin:"0 0 3px" }}>{d}</p>
                  <span style={{ fontSize:8, padding:"1px 7px", borderRadius:8, background:`${c}18`, color:c, fontWeight:600 }}>{note}</span>
                </div>
              </div>
            ))}
            <SBtn onClick={()=>setShowSign(false)} C={C}>Отмена</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function NewDocScreen({ onBack, onDone, C, t }) {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState("ЭСФ");
  const [cp, setCp] = useState(null);
  const [service, setService] = useState("");
  const [amount, setAmount] = useState("");
  const [withNds, setWithNds] = useState(true);
  const [showCp, setShowCp] = useState(false);
  const total = (parseFloat(amount)||0);
  const nds   = withNds ? Math.round(total*16/116) : 0;
  const types = [["🧾","ЭСФ","#f59e0b"],["📋","ЭАВР","#06b6d4"],["✅","АВР","#22c55e"],["📄","счёт","#1d4ed8"],["📜","доверенность","#7c3aed"],["📦","накладная","#64748b"],["📑","договор","#ec4899"]];
  const CPS = [{ name:"ТОО «Digital Solutions»",bin:"200340015877",nds:true },{ name:"ИП Сейткалиева Г.А.",bin:"850101300211",nds:false },{ name:"ТОО «КазАренда»",bin:"180930021455",nds:true }];
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:24, position:"relative" }}>
      <div style={{ padding:"14px 16px 0", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.gold, fontSize:28, padding:0, lineHeight:1 }}>‹</button>
        <div><h2 style={{ color:C.text, fontSize:14, fontWeight:700, margin:0 }}>Новый документ</h2><p style={{ color:C.muted, fontSize:9, margin:0 }}>Шаг {step} из 3</p></div>
      </div>
      <div style={{ padding:"8px 16px 0", display:"flex", gap:3 }}>
        {[1,2,3].map(s=><div key={s} style={{ flex:1, height:3, borderRadius:2, background:s<=step?C.gold:C.card2 }}/>)}
      </div>
      <div style={{ padding:"12px 16px 0" }}>
        {step===1 && <>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
            {types.map(([ic,tp,c])=>(
              <button key={tp} onClick={()=>setDocType(tp)} style={{ padding:"7px 12px", borderRadius:11, border:`1.5px solid ${docType===tp?c:C.border}`, background:docType===tp?`${c}15`:"transparent", color:docType===tp?c:C.muted, fontSize:10, fontWeight:600, cursor:"pointer" }}>{ic} {tp}</button>
            ))}
          </div>
          <button onClick={()=>setShowCp(true)} style={{ width:"100%", padding:"11px 14px", borderRadius:13, marginBottom:8, background:cp?C.blueSoft:C.card2, border:`1.5px solid ${cp?C.blue:C.border}`, color:cp?C.text:C.muted, fontSize:12, fontWeight:600, cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between" }}>
            <span>{cp?`👤 ${cp.name}`:"📋 Выбрать контрагента"}</span><span style={{ color:C.gold }}>›</span>
          </button>
          {cp && <div style={{ background:C.card, borderRadius:11, padding:"9px 13px", marginBottom:8, border:`1px solid ${C.border}` }}><p style={{ color:C.text, fontSize:11, fontWeight:600, margin:"0 0 1px" }}>{cp.name}</p><p style={{ color:C.muted, fontSize:9, margin:0 }}>БИН: {cp.bin}</p></div>}
          <Btn onClick={()=>setStep(2)}>Далее →</Btn>
        </>}
        {step===2 && <>
          <Input label="Наименование *" value={service} onChange={setService} placeholder="Разработка сайта" C={C}/>
          {docType!=="доверенность" && <>
            <Input label="Сумма (₸)" value={amount} onChange={setAmount} placeholder="1 000 000" C={C}/>
            <div onClick={()=>setWithNds(!withNds)} style={{ background:withNds?C.accentSoft:C.card2, border:`1.5px solid ${withNds?C.gold:C.border}`, borderRadius:12, padding:"11px 13px", marginBottom:10, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div><p style={{ color:C.text, fontSize:12, fontWeight:600, margin:"0 0 1px" }}>НДС 16%</p><p style={{ color:C.muted, fontSize:9, margin:0 }}>Обязательно для плательщиков НДС</p></div>
              <Toggle on={withNds} onToggle={()=>setWithNds(!withNds)} col={C.gold}/>
            </div>
            {total>0 && <div style={{ background:C.blueSoft, borderRadius:13, padding:"12px", marginBottom:10, border:`1px solid ${C.blue}22` }}>
              {withNds && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}><span style={{ color:C.muted, fontSize:11 }}>Без НДС</span><span style={{ color:C.text, fontSize:11, fontWeight:600 }}>{fmt(total-nds)}</span></div>}
              {withNds && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}><span style={{ color:C.muted, fontSize:11 }}>НДС 16%</span><span style={{ color:C.gold, fontSize:11, fontWeight:600 }}>{fmt(nds)}</span></div>}
              <div style={{ display:"flex", justifyContent:"space-between" }}><span style={{ color:C.text, fontSize:13, fontWeight:700 }}>ИТОГО</span><span style={{ color:C.blue, fontSize:18, fontWeight:900 }}>{fmt(total)}</span></div>
            </div>}
          </>}
          <div style={{ display:"flex", gap:7 }}><SBtn onClick={()=>setStep(1)} C={C} style={{ flex:1 }}>← Назад</SBtn><Btn onClick={()=>service&&setStep(3)} disabled={!service} style={{ flex:2 }}>Далее →</Btn></div>
        </>}
        {step===3 && <>
          <div style={{ background:C.card, borderRadius:14, padding:"13px", border:`1px solid ${C.border}`, marginBottom:10 }}>
            <p style={{ color:C.gold, fontSize:10, fontWeight:800, margin:"0 0 8px", textTransform:"uppercase" }}>Предпросмотр · {docType}</p>
            {[["Поставщик",CO.name],["Покупатель",cp?.name||"—"],["Услуга",service||"—"],total>0&&["Сумма",fmt(total)],nds>0&&["НДС",fmt(nds)]].filter(Boolean).map(([l,v])=>(
              <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}><span style={{ color:C.muted, fontSize:10 }}>{l}</span><span style={{ color:C.text, fontSize:10, fontWeight:600, maxWidth:"55%", textAlign:"right" }}>{v}</span></div>
            ))}
          </div>
          <div style={{ background:C.accentSoft, border:`1px solid ${C.gold}22`, borderRadius:12, padding:"10px 13px", marginBottom:10 }}>
            <p style={{ color:C.gold, fontSize:11, fontWeight:700, margin:"0 0 2px" }}>🔐 Требуется подпись ЭЦП</p>
            <p style={{ color:C.muted, fontSize:10, margin:0 }}>После сохранения подпишите через eGov Mobile</p>
          </div>
          <div style={{ display:"flex", gap:7, marginBottom:8 }}><SBtn onClick={()=>setStep(2)} C={C} style={{ flex:1 }}>← Назад</SBtn><Btn onClick={onDone} style={{ flex:2 }}>📤 {t("save")}</Btn></div>
          <SBtn onClick={onDone} C={C}>💾 Черновик</SBtn>
        </>}
      </div>
      {showCp && (
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.88)", display:"flex", alignItems:"flex-end", zIndex:100, borderRadius:44 }}>
          <div style={{ background:C.card, borderRadius:"22px 22px 0 0", width:"100%", padding:"16px 16px 24px", maxHeight:"60%", display:"flex", flexDirection:"column" }}>
            <div style={{ width:36, height:4, background:C.dim, borderRadius:2, margin:"0 auto 14px" }}/>
            <p style={{ color:C.text, fontSize:14, fontWeight:700, margin:"0 0 11px" }}>Выбрать контрагента</p>
            <div style={{ overflowY:"auto", flex:1 }}>
              {CPS.map((c,i)=>(
                <div key={i} onClick={()=>{setCp(c);setShowCp(false);}} style={{ background:C.card2, borderRadius:12, padding:"11px 13px", marginBottom:7, cursor:"pointer", display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:34, height:34, borderRadius:17, background:C.blueSoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:C.text, flexShrink:0 }}>{c.name[0]}</div>
                  <div style={{ flex:1 }}><p style={{ color:C.text, fontSize:12, fontWeight:600, margin:0 }}>{c.name}</p><p style={{ color:C.dim, fontSize:9, margin:"2px 0 0" }}>БИН: {c.bin}</p></div>
                </div>
              ))}
            </div>
            <SBtn onClick={()=>setShowCp(false)} C={C} style={{ marginTop:10 }}>Закрыть</SBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function TaxesScreen({ nav, C, t, lang }) {
  const [tab, setTab] = useState("taxes");
  const urgAmt = TAXES.filter(x=>x.status==="urgent").reduce((s,x)=>s+(x.amount||0),0);
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      <div style={{ margin:"8px 16px 0", display:"flex", gap:0, background:C.card2, borderRadius:12, padding:"3px" }}>
        {["taxes","salary","reports"].map((tb,i)=>(
          <button key={tb} onClick={()=>setTab(tb)} style={{ flex:1, padding:"8px", borderRadius:10, border:"none", background:tab===tb?C.card:"transparent", color:tab===tb?C.text:C.muted, fontSize:10, fontWeight:600, cursor:"pointer" }}>
            {[lang==="kz"?"Салықтар":"Налоги",lang==="kz"?"Жалақы":"ЗП",lang==="kz"?"Есептер":"Отчёты"][i]}
          </button>
        ))}
      </div>
      <div style={{ padding:"10px 16px 0" }}>
        {tab==="taxes" && <>
          <div style={{ background:"linear-gradient(135deg,#2a1400,#4a2200)", borderRadius:16, padding:"16px", marginBottom:12, border:`1px solid ${C.gold}28` }}>
            <p style={{ color:"rgba(255,255,255,.5)", fontSize:9, margin:0, textTransform:"uppercase" }}>{lang==="kz"?"Шұғыл төленуге":"Срочно к уплате"} (до 15 мая)</p>
            <h2 style={{ color:C.goldL, fontSize:24, fontWeight:900, margin:"4px 0 10px" }}>{fmt(urgAmt)}</h2>
            <div style={{ display:"flex", gap:7 }}>
              <button style={{ flex:1, padding:"8px", borderRadius:10, background:C.gold, border:"none", color:"#fff", fontSize:10, fontWeight:700, cursor:"pointer" }}>💳 {lang==="kz"?"Төлеу":"Оплатить"}</button>
              <button style={{ flex:1, padding:"8px", borderRadius:10, background:"rgba(255,255,255,.1)", border:"none", color:"#fff", fontSize:10, fontWeight:600, cursor:"pointer" }}>📋 ФНО 200</button>
              <button style={{ flex:1, padding:"8px", borderRadius:10, background:"rgba(255,255,255,.1)", border:"none", color:"#fff", fontSize:10, fontWeight:600, cursor:"pointer" }}>📋 ФНО 300</button>
            </div>
          </div>
          {TAXES.map((tx,i)=>(
            <div key={i} style={{ background:C.card, borderRadius:13, padding:"11px 12px", marginBottom:7, border:`1px solid ${tx.status==="urgent"?"rgba(220,38,38,.3)":tx.status==="pending"?`${C.gold}22`:C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                <div style={{ flex:1, marginRight:7 }}>
                  <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:"0 0 1px" }}>{tx.code} · {tx.rate}</p>
                  <p style={{ color:C.muted, fontSize:9, margin:0 }}>{tx.form} · {tx.deadline}</p>
                </div>
                <span style={{ fontSize:8, padding:"2px 8px", borderRadius:10, fontWeight:700, background:tx.status==="urgent"?"rgba(220,38,38,.18)":tx.status==="pending"?C.accentSoft:C.card2, color:tx.status==="urgent"?"#ef4444":tx.status==="pending"?C.gold:C.muted, flexShrink:0 }}>
                  {tx.status==="urgent"?"🔴 Срочно":tx.status==="pending"?"🟡 Ожидает":"✅ Планово"}
                </span>
              </div>
              {tx.amount && <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <p style={{ color:C.dim, fontSize:8, margin:0 }}>{tx.note}</p>
                <span style={{ color:tx.status==="urgent"?"#ef4444":C.text, fontSize:12, fontWeight:700 }}>{fmt(tx.amount)}</span>
              </div>}
            </div>
          ))}
        </>}
        {tab==="salary" && <>
          <Sec C={C}>ЗП · {lang==="kz"?"Мамыр":"Май"} 2026 · НК РК</Sec>
          {EMPLOYEES.map(emp=>{
            const c = calcSalary(emp.salary, emp.type);
            return (
              <div key={emp.id} style={{ background:C.card, borderRadius:14, padding:"13px", marginBottom:9, border:`1px solid ${C.border}` }}>
                <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:"0 0 1px" }}>{emp.name}</p>
                <p style={{ color:C.muted, fontSize:9, margin:"0 0 9px" }}>{emp.pos}</p>
                <div style={{ background:C.card2, borderRadius:10, padding:"10px" }}>
                  {[["Оклад (gross)",fmt(c.gross),C.text,false],["ОПВ 10%","-"+fmt(c.opv),"#ef4444",false],["ВОСМС 2%","-"+fmt(c.vosms),"#ef4444",false],["Вычет 30 МРП",fmt(30*MRP),C.green,false],["ИПН","-"+fmt(c.ipn),"#ef4444",false],["✅ К выплате",fmt(c.net),C.green,true]].map(([l,v,col,b])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:b?0:4, paddingBottom:b?0:4, borderBottom:b?"none":`1px solid ${C.border}` }}>
                      <span style={{ color:C.muted, fontSize:b?11:9 }}>{l}</span>
                      <span style={{ color:col, fontSize:b?13:9, fontWeight:b?900:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:8, background:C.accentSoft, borderRadius:10, padding:"8px 10px" }}>
                  <p style={{ color:C.gold, fontSize:9, fontWeight:700, margin:"0 0 4px" }}>Расходы работодателя:</p>
                  {[["ОПВР 3.5%",fmt(c.opvr)],["СО 5%",fmt(c.so)],["СН 6%",fmt(c.sn)],["ВОСМС 2%",fmt(c.vemp)],["ИТОГО",fmt(c.total)]].map(([l,v])=>(
                    <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                      <span style={{ color:C.muted, fontSize:9 }}>{l}</span>
                      <span style={{ color:l==="ИТОГО"?"#ef4444":C.gold, fontSize:9, fontWeight:l==="ИТОГО"?800:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </>}
        {tab==="reports" && <>
          <div style={{ background:C.blueSoft, border:`1px solid ${C.blue}20`, borderRadius:13, padding:"11px 13px", marginBottom:10 }}>
            <p style={{ color:C.blue, fontSize:11, fontWeight:700, margin:"0 0 2px" }}>🔐 Отправка через ЭЦП в КНП</p>
            <p style={{ color:C.muted, fontSize:10, margin:0 }}>cabinet.salyk.kz · e-Salyq Business</p>
          </div>
          {[["ФНО 100.00","КПН · Раз в год","10 апр 2027","Планово",null],["ФНО 200.00","ИПН+СН · Квартально","15 мая 2026","СРОЧНО",329590],["ФНО 300.00","НДС · Квартально","15 мая 2026","СРОЧНО",120690],["ФНО 870.00","Имущественный · Год","1 окт 2026","Планово",null]].map(([f,d,dl,st,amt])=>(
            <div key={f} style={{ background:C.card, borderRadius:13, padding:"11px 12px", marginBottom:7, border:`1px solid ${st==="СРОЧНО"?"rgba(220,38,38,.3)":C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:0 }}>{f}</p>
                <span style={{ fontSize:8, padding:"2px 7px", borderRadius:10, fontWeight:700, background:st==="СРОЧНО"?"rgba(220,38,38,.18)":C.card2, color:st==="СРОЧНО"?"#ef4444":C.muted }}>{st}</span>
              </div>
              <p style={{ color:C.muted, fontSize:9, margin:"0 0 6px" }}>{d} · до {dl}</p>
              {amt && <div style={{ display:"flex", gap:5 }}>
                <button style={{ padding:"4px 10px", borderRadius:8, background:"rgba(22,163,74,.15)", border:"1px solid rgba(22,163,74,.25)", color:C.green, fontSize:8, fontWeight:600, cursor:"pointer" }}>📋 Заполнить</button>
                <button style={{ padding:"4px 10px", borderRadius:8, background:C.gold, border:"none", color:"#fff", fontSize:8, fontWeight:700, cursor:"pointer" }}>💳 {fmt(amt)}</button>
              </div>}
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}

function BankScreen({ C, t, lang }) {
  const [tab, setTab] = useState("ops");
  const income  = BANK_OPS.filter(o=>o.type==="in").reduce((s,o)=>s+o.amount,0);
  const expense = BANK_OPS.filter(o=>o.type==="out").reduce((s,o)=>s+Math.abs(o.amount),0);
  const cats    = BANK_OPS.filter(o=>o.type==="out").reduce((acc,o)=>({...acc,[o.cat]:(acc[o.cat]||0)+Math.abs(o.amount)}),{});
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      <div style={{ padding:"10px 16px 0" }}>
        <div style={{ background:"linear-gradient(135deg,#0d1b4b,#1a2d6b)", borderRadius:18, padding:"16px", border:"1px solid rgba(29,78,216,.28)", marginBottom:10 }}>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:9, margin:0, textTransform:"uppercase" }}>Halyk Bank · {lang==="kz"?"Мамыр":"Май"} 2026</p>
          <h2 style={{ color:"#fff", fontSize:22, fontWeight:900, margin:"4px 0 12px" }}>{fmt(income-expense)}</h2>
          <div style={{ display:"flex", gap:7 }}>
            {[[`+${t("income")}`,C.green],[`-${t("expense")}`,C.red],["⇄ Перевод",C.blue]].map(([l,c])=>(
              <button key={l} style={{ flex:1, padding:"7px", borderRadius:10, background:`${c}20`, border:`1px solid ${c}30`, color:c, fontSize:9, fontWeight:600, cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ background:C.card, borderRadius:14, padding:"13px", border:`1px solid ${C.border}`, marginBottom:10 }}>
          <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:"0 0 8px", textTransform:"uppercase" }}>Расходы по категориям</p>
          {[["💼","ЗП",cats.salary||0,C.blue],["🏛","Налоги",cats.tax||0,C.gold],["🏢","Аренда+прочее",cats.expense||0,C.muted]].map(([ic,l,v,c])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:8 }}>
              <span style={{ fontSize:16 }}>{ic}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ color:C.text, fontSize:11 }}>{l}</span>
                  <span style={{ color:c, fontSize:11, fontWeight:700 }}>{fmt(v)}</span>
                </div>
                <div style={{ height:4, background:C.dim, borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${v?Math.min(v/expense*100,100):0}%`, background:c, borderRadius:2 }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Sec C={C}>Операции</Sec>
        {BANK_OPS.map(op=>(
          <div key={op.id} style={{ background:C.card, borderRadius:12, padding:"10px 12px", marginBottom:6, display:"flex", gap:9, border:`1px solid ${C.border}` }}>
            <div style={{ width:32, height:32, borderRadius:16, background:op.type==="in"?"rgba(22,163,74,.18)":"rgba(220,38,38,.18)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{op.type==="in"?"📈":"📉"}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ color:C.text, fontSize:11, fontWeight:600, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{op.desc}</p>
              <p style={{ color:C.dim, fontSize:9, margin:"2px 0 0" }}>{op.date}</p>
            </div>
            <p style={{ color:op.type==="in"?C.green:C.red, fontSize:12, fontWeight:700, margin:0, flexShrink:0 }}>{op.type==="in"?"+":""}{fmt(op.amount)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsScreen({ C, t, lang }) {
  const income  = DOCS.filter(d=>d.dir==="out"&&d.pay==="paid").reduce((s,d)=>s+d.amount,0);
  const expense = BANK_OPS.filter(o=>o.type==="out").reduce((s,o)=>s+Math.abs(o.amount),0);
  const months  = [{ m:"Янв",i:420000,e:380000 },{ m:"Фев",i:560000,e:410000 },{ m:"Мар",i:890000,e:520000 },{ m:"Апр",i:750000,e:490000 },{ m:"Май",i:income,e:expense }];
  const maxV    = Math.max(...months.map(m=>Math.max(m.i,m.e)));
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      <div style={{ padding:"10px 16px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[[t("income"),income,C.green],[t("expense"),expense,"#ef4444"],[t("profit"),income-expense,income>expense?C.blue:"#ef4444"]].map(([l,v,c])=>(
            <div key={l} style={{ background:C.card, borderRadius:14, padding:"12px 10px", border:`1px solid ${C.border}`, textAlign:"center" }}>
              <p style={{ color:C.muted, fontSize:8, margin:"0 0 4px", textTransform:"uppercase" }}>{l}</p>
              <p style={{ color:c, fontSize:11, fontWeight:900, margin:0 }}>{fmtS(v)}</p>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:"14px", border:`1px solid ${C.border}`, marginBottom:14 }}>
          <p style={{ color:C.muted, fontSize:9, fontWeight:700, margin:"0 0 12px", textTransform:"uppercase" }}>Динамика · {lang==="kz"?"Кіріс/Шығыс":"Доходы/Расходы"}</p>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:90 }}>
            {months.map((m,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
                <div style={{ display:"flex", gap:2, alignItems:"flex-end", width:"100%" }}>
                  <div style={{ flex:1, background:C.green, borderRadius:"3px 3px 0 0", height:`${m.i/maxV*75}px`, minHeight:4 }}/>
                  <div style={{ flex:1, background:"#ef4444", borderRadius:"3px 3px 0 0", height:`${m.e/maxV*75}px`, minHeight:4 }}/>
                </div>
                <span style={{ color:C.muted, fontSize:8 }}>{m.m}</span>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:14, marginTop:8 }}>
            {[[C.green,t("income")],["#ef4444",t("expense")]].map(([c,l])=>(
              <div key={l} style={{ display:"flex", gap:5, alignItems:"center" }}><div style={{ width:8, height:8, borderRadius:2, background:c }}/><span style={{ color:C.muted, fontSize:9 }}>{l}</span></div>
            ))}
          </div>
        </div>
        <Sec C={C}>{lang==="kz"?"Санат бойынша шығыстар":"Расходы по категориям"}</Sec>
        <div style={{ background:C.card, borderRadius:14, padding:"13px", border:`1px solid ${C.border}` }}>
          {[["💼","ЗП",1118700,C.blue],["🏛",lang==="kz"?"Салықтар":"Налоги",370000,C.gold],["🏢",lang==="kz"?"Жалдау":"Аренда",310200,"#7c3aed"],["📡","Связь",45000,C.cyan]].map(([ic,l,v,c])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
              <span style={{ fontSize:16 }}>{ic}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ color:C.text, fontSize:11 }}>{l}</span>
                  <span style={{ color:c, fontSize:11, fontWeight:700 }}>{fmt(v)}</span>
                </div>
                <div style={{ height:4, background:C.dim, borderRadius:2 }}>
                  <div style={{ height:"100%", width:`${v/1843900*100}%`, background:c, borderRadius:2 }}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIScreen({ onBack, C, t, lang }) {
  const [msgs, setMsgs] = useState([{ role:"ai", text:`${lang==="kz"?"Сәлем! Мен BizBook KZ ЖИ-көмекшісімін":"Привет! Я ИИ-ассистент BizBook KZ"} 🤖\n\n${lang==="kz"?"Сізге не қажет?":"Чем могу помочь?"}\n• Налоги и расчёты\n• Создать документ\n• Рассчитать ЗП\n• Вопросы по НК РК 2026\n• Дивиденды и выплаты` }]);
  const [inp, setInp] = useState("");
  const endRef = useRef();
  const sugg = ["Срочные налоги?","Расчёт ЗП май","Создай ЭСФ","ОПВР 3.5%?","Дивиденды ТОО","Что нового в НК?"];
  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]);
    setInp("");
    setTimeout(()=>{
      const tx = text.toLowerCase();
      const r = tx.includes("налог")||tx.includes("срочн") ?
        "**Срочно до 15 мая 2026:**\n\n📊 ФНО 200.00:\n• ИПН: 130 000 ₸\n• СН 6%: 78 900 ₸\n\n🔖 ФНО 300.00 (НДС):\n• 120 690 ₸\n\n**Итого: 329 590 ₸**\n\nЗаполнить автоматически?" :
        tx.includes("зп")||tx.includes("зарплат") ?
        "**ЗП · Май 2026:**\n\n👔 Иванов 600 000 → 503 000 ₸\n👩 Петрова 380 000 → 320 700 ₸\n👨 Сейткали 350 000 → 295 000 ₸\n\n**К выплате: 1 118 700 ₸**\n**Расходы бизнеса: 1 318 350 ₸**" :
        tx.includes("дивид") ?
        "**Дивиденды ТОО 2026:**\n\nИПН: 5% (льготная ставка)\nОПВ: не удерживается\nСО: не начисляется\n\nПример: 1 000 000 ₸\n→ ИПН 5% = 50 000 ₸\n→ К выплате: 950 000 ₸\n\nСт. 350 НК РК" :
        "Понял! По НК РК 2026 для NOVA COMP:\n\n✅ ЭСФ обязательны при НДС\n✅ ОПВР 3.5% (↑ с 2.5%)\n✅ СН 6% (↓ с 11%)\n✅ Вычет 30 МРП = 129 750 ₸\n\nУточни вопрос — отвечу точно!";
      setMsgs(m=>[...m,{role:"ai",text:r}]);
    }, 600);
  };
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"8px 16px 8px", display:"flex", alignItems:"center", gap:10, flexShrink:0, borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.gold, fontSize:28, padding:0, lineHeight:1 }}>‹</button>
        <div style={{ width:34, height:34, borderRadius:17, background:"linear-gradient(135deg,#4c1d95,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🤖</div>
        <div><p style={{ color:C.text, fontSize:13, fontWeight:700, margin:0 }}>{t("ai")}</p><p style={{ color:C.green, fontSize:9, margin:0 }}>● Online · НК РК 2026</p></div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"10px 16px" }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", marginBottom:10 }}>
            <div style={{ maxWidth:"86%", padding:"10px 13px", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", background:m.role==="user"?C.blue:C.card, border:m.role==="ai"?`1px solid ${C.border}`:"none" }}>
              <p style={{ color:"#fff", fontSize:11, lineHeight:1.65, margin:0, whiteSpace:"pre-line" }}>{m.text.replace(/\*\*(.*?)\*\*/g,(_,p)=>p)}</p>
            </div>
          </div>
        ))}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:"7px 16px 12px", flexShrink:0, borderTop:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", gap:4, marginBottom:7, overflowX:"auto", paddingBottom:2 }}>
          {sugg.map((s,i)=><button key={i} onClick={()=>send(s)} style={{ padding:"4px 9px", borderRadius:11, background:C.accentSoft, border:`1px solid ${C.gold}24`, color:C.gold, fontSize:8, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>{s}</button>)}
        </div>
        <div style={{ display:"flex", gap:7 }}>
          <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(inp)} placeholder={lang==="kz"?"Сұрақ қойыңыз...":"Задайте вопрос..."} style={{ flex:1, background:C.inputBg, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 13px", color:C.text, fontSize:11, outline:"none", fontFamily:"inherit" }}/>
          <button onClick={()=>send(inp)} style={{ width:40, height:40, borderRadius:12, background:C.gold, border:"none", color:"#fff", fontSize:16, cursor:"pointer" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ nav, C, t, lang, mode, setMode, lang2, setLang }) {
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
      <div style={{ padding:"10px 16px 0" }}>
        <div style={{ background:"linear-gradient(135deg,#0c1f3d,#1a3560)", borderRadius:20, padding:"16px", marginBottom:14, border:"1px solid rgba(29,78,216,.25)", display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ padding:"8px", background:"rgba(255,255,255,.1)", borderRadius:14 }}><Logo size={34} gold={C.goldL}/></div>
          <div>
            <h3 style={{ color:"#fff", fontSize:13, fontWeight:800, margin:"0 0 2px" }}>{CO.name}</h3>
            <p style={{ color:"rgba(255,255,255,.55)", fontSize:9, margin:"0 0 5px" }}>БИН: {CO.bin} · с {CO.reg}</p>
            <div style={{ display:"flex", gap:4 }}>{["ОУР","НДС 16%","Алматы"].map((t2,i)=><span key={i} style={{ fontSize:8, padding:"2px 6px", borderRadius:8, background:"rgba(29,78,216,.35)", color:"#fff", fontWeight:600 }}>{t2}</span>)}</div>
          </div>
        </div>
        <Sec C={C}>{lang==="kz"?"Реквизиттер":"Реквизиты"}</Sec>
        {[[lang==="kz"?"Директор":"Директор",CO.director],[lang==="kz"?"Мекенжай":"Адрес",CO.address],["Телефон",CO.phone],["Email",CO.email],["Банк",CO.bank],["ИИК",CO.iik]].map(([l,v])=><Fd key={l} label={l} value={v} C={C}/>)}

        <Sec C={C}>{t("employees")}</Sec>
        {EMPLOYEES.map(emp=>(
          <div key={emp.id} style={{ background:C.card, borderRadius:12, padding:"10px 12px", marginBottom:6, border:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ width:36, height:36, borderRadius:18, background:C.blueSoft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:C.text, flexShrink:0 }}>{emp.name[0]}</div>
            <div style={{ flex:1 }}><p style={{ color:C.text, fontSize:11, fontWeight:600, margin:0 }}>{emp.name}</p><p style={{ color:C.muted, fontSize:9, margin:"1px 0 0" }}>{emp.pos}</p></div>
            <p style={{ color:C.gold, fontSize:11, fontWeight:700, margin:0 }}>{fmt(emp.salary)}</p>
          </div>
        ))}

        <Sec C={C}>{t("settings")}</Sec>
        <div style={{ background:C.card, borderRadius:14, overflow:"hidden", border:`1px solid ${C.border}`, marginBottom:12 }}>
          {[["🏢",lang==="kz"?"Компания деректері":"Данные компании"],["📋",lang==="kz"?"Салық режимі":"Налоговый режим"],["🏦",lang==="kz"?"Банк шоттары":"Банковские счета"],["🔐","ЭЦП и сертификаты"],["🔗",lang==="kz"?"Интеграциялар":"Интеграции"],["🔔",lang==="kz"?"Хабарламалар":"Уведомления"],["📊",lang==="kz"?"Тариф жоспары":"Тарифный план"],["❓",lang==="kz"?"Қолдау":"Поддержка 24/7"]].map(([ic,l],i,a)=>(
            <div key={i} style={{ padding:"12px 13px", borderBottom:i<a.length-1?`1px solid ${C.border}`:"none", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
              <span style={{ fontSize:16 }}>{ic}</span>
              <span style={{ color:C.text, fontSize:11, fontWeight:500, flex:1 }}>{l}</span>
              <span style={{ color:C.dim, fontSize:16 }}>›</span>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, borderRadius:13, padding:"11px 13px", marginBottom:12, border:`1px solid ${C.border}`, textAlign:"center" }}>
          <p style={{ color:C.muted, fontSize:8, margin:"0 0 2px" }}>{t("copyright")}</p>
          <p style={{ color:C.dim, fontSize:7, margin:0 }}>Закон РК «Об авторском праве» №6-I · BizBook KZ v{APP.version}</p>
        </div>
        <button onClick={()=>nav("splash")} style={{ width:"100%", padding:"12px", borderRadius:12, background:"rgba(220,38,38,.1)", border:"1px solid rgba(220,38,38,.2)", color:"#ef4444", fontSize:12, fontWeight:600, cursor:"pointer" }}>
          {t("logout")}
        </button>
      </div>
    </div>
  );
}

function SplashScreen({ nav, C, t, lang }) {
  const [tab, setTab] = useState("login");
  const [agreed, setAgreed] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [phone, setPhone] = useState("+7 705 474 1612");
  const [pass, setPass] = useState("");
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:`radial-gradient(ellipse at 30% 20%, rgba(29,78,216,.2), ${C.bg} 65%)` }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{ marginBottom:16, padding:14, background:C.accentSoft, borderRadius:24, border:`1px solid ${C.gold}30` }}>
          <Logo size={62} gold={C.goldL}/>
        </div>
        <h1 style={{ color:C.text, fontSize:28, fontWeight:900, margin:"0 0 5px", letterSpacing:-0.5 }}>{APP.name}</h1>
        <p style={{ color:C.muted, fontSize:12, margin:"0 0 6px" }}>{lang==="kz"?"Бизнес үшін ақылды бухгалтерия":"Умная бухгалтерия для бизнеса РК"} · 2026</p>
        <p style={{ color:C.dim, fontSize:9 }}>{APP.owner}</p>
      </div>
      <div style={{ background:C.card, borderRadius:"24px 24px 0 0", padding:"22px 22px 32px", border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", gap:4, marginBottom:16, background:C.card2, borderRadius:12, padding:"3px" }}>
          {["login","register"].map(tb=>(
            <button key={tb} onClick={()=>setTab(tb)} style={{ flex:1, padding:"9px", borderRadius:10, border:"none", background:tab===tb?C.gold:"transparent", color:tab===tb?"#fff":C.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {tb==="login"?t("login"):t("register")}
            </button>
          ))}
        </div>
        {tab==="login" ? <>
          <Input label={t("phone")+"/Email"} value={phone} onChange={setPhone} C={C}/>
          <Input label={t("password")} value={pass} onChange={setPass} type="password" placeholder="••••••••" C={C}/>
          <div style={{ textAlign:"right", marginBottom:12 }}><span style={{ color:C.gold, fontSize:11, cursor:"pointer" }}>{lang==="kz"?"Құпиясөзді ұмыттыңыз ба?":"Забыли пароль?"}</span></div>
          <Btn onClick={()=>nav("home")} col={C.gold}>{lang==="kz"?"Аккаунтқа кіру":"Войти в аккаунт"}</Btn>
          <div style={{ display:"flex", gap:6, marginTop:8 }}>
            <SBtn onClick={()=>nav("home")} C={C} style={{ flex:1, fontSize:10 }}>📱 eGov Mobile</SBtn>
            <SBtn onClick={()=>nav("home")} C={C} style={{ flex:1, fontSize:10 }}>☁️ eGov Cloud</SBtn>
          </div>
        </> : <>
          <Input label={t("bin")} value="" onChange={()=>{}} placeholder="241040014477" C={C}/>
          <Input label={t("phone")} value="" onChange={()=>{}} placeholder="+7 700 000 00 00" C={C}/>
          <Input label={t("password")} value="" onChange={()=>{}} type="password" C={C}/>
          <div onClick={()=>setAgreed(!agreed)} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, cursor:"pointer" }}>
            <div style={{ width:20, height:20, borderRadius:6, border:`1.5px solid ${agreed?C.gold:C.border}`, background:agreed?C.gold:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {agreed && <span style={{ color:"#fff", fontSize:11 }}>✓</span>}
            </div>
            <p style={{ color:C.muted, fontSize:10, margin:0 }}>
              {lang==="kz"?"Мен":"Принимаю"}{" "}
              <span onClick={e=>{e.stopPropagation();setShowOffer(true);}} style={{ color:C.gold, textDecoration:"underline", cursor:"pointer" }}>
                {lang==="kz"?"Жария оферта шартымен танысамын":"Договор публичной оферты"}
              </span>
            </p>
          </div>
          <Btn onClick={()=>agreed&&nav("onboard")} col={agreed?C.gold:C.dim} disabled={!agreed}>{lang==="kz"?"Аккаунт жасау →":"Создать аккаунт →"}</Btn>
        </>}
      </div>
      {showOffer && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", display:"flex", alignItems:"flex-end", zIndex:200 }}>
          <div style={{ background:C.card, borderRadius:"22px 22px 0 0", width:"100%", maxHeight:"80vh", display:"flex", flexDirection:"column", padding:"18px 18px 26px" }}>
            <div style={{ width:36, height:4, background:C.dim, borderRadius:2, margin:"0 auto 14px" }}/>
            <h3 style={{ color:C.text, fontSize:15, fontWeight:700, margin:"0 0 4px" }}>📑 Договор публичной оферты</h3>
            <p style={{ color:C.muted, fontSize:10, margin:"0 0 12px" }}>{APP.owner} · BizBook KZ · v{APP.version} · {APP.year}</p>
            <div style={{ overflowY:"auto", flex:1, marginBottom:14 }}>
              {[["1. Предмет","Платформа BizBook KZ предоставляется ТОО «NOVA Comp» для ведения бухгалтерского учёта в соответствии с НК РК 2026."],["2. Права","Пользователь обязуется использовать сервис законно. Запрещается передача доступа третьим лицам."],["3. Данные","Данные хранятся на серверах в РК. Закон РК «О персональных данных» №94-V. Не передаются третьим лицам."],["4. Интеллектуальная собственность","Все права на ПО, дизайн, алгоритмы принадлежат ТОО «NOVA Comp». Закон РК №6-I. Копирование ЗАПРЕЩЕНО."],["5. Тарифы","От 3 990 ₸/мес. Оплата через Kaspi Pay, Halyk Bank, перевод."],["6. Ответственность","Платформа «как есть». Рекомендуем верифицировать данные у бухгалтера."],["7. Право РК","Договор регулируется законодательством Республики Казахстан."]].map(([t2,c])=>(
                <div key={t2} style={{ marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
                  <p style={{ color:C.text, fontSize:12, fontWeight:700, margin:"0 0 4px" }}>{t2}</p>
                  <p style={{ color:C.muted, fontSize:11, margin:0, lineHeight:1.6 }}>{c}</p>
                </div>
              ))}
              <p style={{ color:C.dim, fontSize:8, textAlign:"center" }}>{t("copyright")} · Закон РК «Об авторском праве» №6-I</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <SBtn onClick={()=>setShowOffer(false)} C={C} style={{ flex:1 }}>{t("cancel")}</SBtn>
              <Btn onClick={()=>{setAgreed(true);setShowOffer(false);}} col={C.gold} style={{ flex:2 }}>✓ {lang==="kz"?"Қабылдаймын":"Принимаю"}</Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessScreen({ onDone, title, sub, C }) {
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
      <div style={{ fontSize:56, marginBottom:14 }}>🎉</div>
      <h2 style={{ color:C.text, fontSize:21, fontWeight:900, margin:"0 0 7px", textAlign:"center" }}>{title||"Готово!"}</h2>
      <p style={{ color:C.muted, fontSize:11, textAlign:"center", margin:"0 0 24px", lineHeight:1.6 }}>{sub||"Документ создан и готов к подписанию"}</p>
      <div style={{ display:"flex", gap:6, width:"100%", marginBottom:9 }}>
        {[["💬","WhatsApp"],["✈️","Telegram"],["📧","Email"],["📱","SMS"]].map(([ic,l],i)=>(
          <button key={i} onClick={onDone} style={{ flex:1, padding:"9px 3px", borderRadius:11, background:C.card, border:`1px solid ${C.border}`, color:C.text, fontSize:8, fontWeight:600, cursor:"pointer" }}>{ic}<br/>{l}</button>
        ))}
      </div>
      <Btn onClick={onDone} col={C.gold}>← На главную</Btn>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────
const AUTH_SCREENS = new Set(["splash","onboard"]);

export default function App() {
  const { C, mode, setMode } = useTheme();
  const { lang, setLang, t  } = useLang();
  const [screen, setScreen]   = useState("splash");
  const [selDoc, setSelDoc]   = useState(null);
  const [menuOpen, setMenu]   = useState(false);
  const nav = useCallback(s => { setScreen(s); setMenu(false); }, []);

  const isAuth = AUTH_SCREENS.has(screen);

  const title = {
    home: t("home"), docs: t("docs"), bank: t("bank"), taxes: t("taxes"),
    analytics: t("analytics"), calendar: t("calendar"), news: t("news"),
    ai: t("ai"), profile: t("profile"), cabinet: t("cabinet"),
  }[screen] || APP.name;

  const renderScreen = () => {
    switch(screen) {
      case "splash":    return <SplashScreen nav={nav} C={C} t={t} lang={lang}/>;
      case "onboard":   return <SplashScreen nav={nav} C={C} t={t} lang={lang}/>;
      case "home":      return <HomeScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang}/>;
      case "docs":      return <DocsScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang}/>;
      case "docDetail": return <DocDetail doc={selDoc} onBack={()=>nav("docs")} C={C} t={t} lang={lang}/>;
      case "newDoc":    return <NewDocScreen onBack={()=>nav("home")} onDone={()=>nav("success")} C={C} t={t}/>;
      case "bank":      return <BankScreen C={C} t={t} lang={lang}/>;
      case "taxes":     return <TaxesScreen nav={nav} C={C} t={t} lang={lang}/>;
      case "analytics": return <AnalyticsScreen C={C} t={t} lang={lang}/>;
      case "ai":        return <AIScreen onBack={()=>nav("home")} C={C} t={t} lang={lang}/>;
      case "profile":   return <ProfileScreen nav={nav} C={C} t={t} lang={lang} mode={mode} setMode={setMode} lang2={lang} setLang={setLang}/>;
      case "success":   return <SuccessScreen onDone={()=>nav("home")} C={C}/>;
      case "calendar":  return <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:C.muted}}>📅 {t("calendar")}</p></div>;
      case "news":      return <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}><p style={{color:C.muted}}>📰 {t("news")}</p></div>;
      case "cabinet":   return <DocsScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang}/>;
      default:          return <HomeScreen nav={nav} setSelDoc={setSelDoc} C={C} t={t} lang={lang}/>;
    }
  };

  // Responsive: detect viewport width
  const [vw, setVw] = useState(window.innerWidth);
  useEffect(() => {
    const h = () => setVw(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const isWide = vw >= 768;
  const containerStyle = isWide
    ? { display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"system-ui,-apple-system,sans-serif" }
    : { display:"flex", justifyContent:"center", alignItems:"center", minHeight:"100vh", background:"#02030a", fontFamily:"system-ui,-apple-system,sans-serif" };

  const phoneShell = !isWide
    ? { width:375, height:780, background:C.bg, borderRadius:44, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:`0 50px 160px rgba(0,0,0,.99), 0 0 0 1px rgba(255,255,255,.04)` }
    : { flex:1, display:"flex", flexDirection:"column", background:C.bg, overflow:"hidden" };

  return (
    <div style={containerStyle}>
      {/* Wide layout: persistent sidebar */}
      {isWide && !isAuth && (
        <div style={{ width:260, background:C.card, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
          <div style={{ padding:"20px 18px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <Logo size={36} gold={C.goldL}/>
            <div><p style={{ color:C.text, fontSize:15, fontWeight:800, margin:0 }}>{APP.name}</p><p style={{ color:C.muted, fontSize:9, margin:0 }}>{APP.owner}</p></div>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"10px 10px" }}>
            {[["home","🏠",t("home")],["docs","📁",t("docs")],["bank","🏦",t("bank")],["taxes","📊",t("taxes")],["analytics","📈",t("analytics")],["calendar","📅",t("calendar")],["news","📰",t("news")],["ai","🤖",t("ai")],["profile","👤",t("profile")]].map(([key,icon,label])=>{
              const active = screen===key;
              return (
                <button key={key} onClick={()=>nav(key)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 12px", borderRadius:12, border:"none", cursor:"pointer", background:active?C.accentSoft:"transparent", marginBottom:3, textAlign:"left" }}>
                  <span style={{ fontSize:18, width:24, textAlign:"center" }}>{icon}</span>
                  <span style={{ color:active?C.gold:C.text, fontSize:13, fontWeight:active?700:500 }}>{label}</span>
                  {active && <div style={{ marginLeft:"auto", width:6, height:6, borderRadius:3, background:C.gold }}/>}
                </button>
              );
            })}
          </div>
          <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", gap:4, marginBottom:8 }}>
              {[["dark","🌙"],["light","☀️"],["system","💻"]].map(([v,ic])=>(
                <button key={v} onClick={()=>setMode(v)} style={{ flex:1, padding:"6px 3px", borderRadius:9, border:`1.5px solid ${mode===v?C.gold:C.border}`, background:mode===v?C.accentSoft:"transparent", color:mode===v?C.gold:C.muted, fontSize:9, fontWeight:600, cursor:"pointer" }}>{ic}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:5 }}>
              {[["ru","🇷🇺 РУС"],["kz","🇰🇿 ҚАЗ"]].map(([v,l])=>(
                <button key={v} onClick={()=>setLang(v)} style={{ flex:1, padding:"7px", borderRadius:9, border:`1.5px solid ${lang===v?C.blue:C.border}`, background:lang===v?C.blueSoft:"transparent", color:lang===v?C.text:C.muted, fontSize:10, fontWeight:600, cursor:"pointer" }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ padding:"8px 14px 14px", borderTop:`1px solid ${C.border}` }}>
            <p style={{ color:C.dim, fontSize:7, margin:0, textAlign:"center", lineHeight:1.6 }}>{t("copyright")}<br/>Закон РК «Об авторском праве» №6-I</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={phoneShell}>
        {/* Status bar (mobile only) */}
        {!isWide && !isAuth && (
          <div style={{ padding:"11px 24px 3px", display:"flex", justifyContent:"space-between", flexShrink:0 }}>
            <span style={{ color:C.text, fontSize:11, fontWeight:600 }}>9:41</span>
            <span style={{ color:C.text, fontSize:9 }}>●●●● WiFi 🔋</span>
          </div>
        )}

        {/* TopBar (not on auth/ai screens) */}
        {!isAuth && !["ai","docDetail","newDoc"].includes(screen) && (
          <TopBar onMenu={()=>setMenu(true)} title={title}
            subtitle={screen==="home"?`${CO.name} · ОУР · НДС`:undefined}
            C={C}
            right={screen==="home"?(
              <div style={{ display:"flex", gap:6 }}>
                <button onClick={()=>nav("ai")} style={{ background:C.accentSoft, border:`1px solid ${C.gold}28`, borderRadius:10, padding:"6px 10px", color:C.gold, fontSize:11, fontWeight:700, cursor:"pointer" }}>🤖</button>
                <button onClick={()=>nav("profile")} style={{ width:33, height:33, borderRadius:16, background:`linear-gradient(135deg,#1d4ed8,#d97706)`, border:"none", fontSize:14, cursor:"pointer" }}>👤</button>
              </div>
            ):screen==="docs"?(
              <button onClick={()=>nav("newDoc")} style={{ background:C.gold, border:"none", borderRadius:14, padding:"5px 13px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer" }}>{t("create")}</button>
            ):screen==="taxes"?(
              <button onClick={()=>nav("calculator")} style={{ background:C.accentSoft, border:`1px solid ${C.gold}28`, borderRadius:10, padding:"5px 11px", color:C.gold, fontSize:10, fontWeight:700, cursor:"pointer" }}>🧮</button>
            ):null}
          />
        )}

        {/* Screen content */}
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {renderScreen()}
        </div>

        {/* Side menu (mobile) */}
        {!isWide && (
          <SideMenu open={menuOpen} onClose={()=>setMenu(false)} screen={screen} nav={nav} C={C} t={t} mode={mode} setMode={setMode} lang={lang} setLang={setLang}/>
        )}
      </div>

      {/* Anti-copy watermark */}
      <div style={{ position:"fixed", bottom:0, right:0, opacity:.012, fontSize:6, color:"#fff", writingMode:"vertical-rl", padding:"3px", letterSpacing:2, pointerEvents:"none", userSelect:"none", zIndex:9999, lineHeight:1.2 }}>
        {"© 2026 ТОО «NOVA Comp» BizBook KZ v3 All Rights Reserved Закон РК «Об авторском праве» №6-I Unauthorized copying prohibited ".repeat(6)}
      </div>
    </div>
  );
}
