/* ---------------------------------------------------------
   디지털 명함 — 스크립트 (다크/라이트 토글 · vCard · 공유)
   명함에 보이는 글자는 index.html 에서 바로 수정하시면 됩니다.
   아래 PROFILE 은 "연락처 저장(vCard)" 파일을 만들 때만 씁니다.
   --------------------------------------------------------- */

const PROFILE = {
  name: "김민수",
  team: "마케팅팀",
  role: "마케팅 매니저",
  org: "스타트업 허브",
  email: "minsu@example.com",
  phone: "010-1234-5678",
  website: "https://minsu.dev",
  linkedin: "https://linkedin.com/in/minsu-kim",
  github: "https://github.com/minsu-dev",
  location: "서울, 대한민국",
  bio: "5년차 B2B 마케터. 콘텐츠 마케팅과 그로스 해킹을 좋아합니다. 커피와 자동화 도구를 사랑합니다."
};

const $ = (id) => document.getElementById(id);

/* ---------- 1. 다크 / 라이트 모드 ---------- */
const THEME_KEY = "namecard-theme";

// 배경 그라데이션의 시작색 (style.css 의 --bg-from 과 같은 값)
const THEME_COLOR = { light: "#ffffff", dark: "#101a38" };

function readStoredTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;

  $("themeToggle").setAttribute(
    "aria-label",
    theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"
  );
  $("themeToggle").setAttribute("aria-pressed", String(theme === "dark"));

  // 모바일 브라우저 상단 바 색을 배경과 맞춘다
  const meta = $("themeColor");
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

function initTheme() {
  const saved = readStoredTheme();
  const darkQuery = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  // head 의 인라인 스크립트가 이미 정한 테마를 그대로 이어받는다
  applyTheme(
    document.documentElement.dataset.theme ||
    saved ||
    (darkQuery && darkQuery.matches ? "dark" : "light")
  );

  $("themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* 무시 */ }
  });

  // 직접 고른 적이 없다면 OS 설정 변화를 따라간다
  if (!saved && darkQuery) {
    darkQuery.addEventListener("change", (e) => {
      if (!readStoredTheme()) applyTheme(e.matches ? "dark" : "light");
    });
  }
}

/* ---------- 2. 토스트 메시지 ---------- */
let toastTimer;
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- 3. vCard 내려받기 ---------- */
function buildVCard() {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:" + PROFILE.name,
    "N:" + PROFILE.name + ";;;;",
    "ORG:" + PROFILE.org + ";" + PROFILE.team,
    "TITLE:" + PROFILE.role,
    "TEL;TYPE=CELL:" + PROFILE.phone,
    "EMAIL;TYPE=INTERNET:" + PROFILE.email,
    "URL:" + PROFILE.website,
    "X-SOCIALPROFILE;TYPE=linkedin:" + PROFILE.linkedin,
    "X-SOCIALPROFILE;TYPE=github:" + PROFILE.github,
    "ADR;TYPE=WORK:;;" + PROFILE.location + ";;;;",
    "NOTE:" + PROFILE.bio,
    "END:VCARD"
  ];
  return lines.join("\r\n");
}

function downloadVCard() {
  // 앞의 BOM(﻿)은 일부 주소록 앱에서 한글이 깨지는 것을 막아준다
  const blob = new Blob(["﻿" + buildVCard()], {
    type: "text/vcard;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = PROFILE.name + ".vcf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("연락처 파일을 내려받았습니다.");
}

/* ---------- 4. 공유하기 ---------- */
async function shareCard() {
  const data = {
    title: PROFILE.name + " 명함",
    text: PROFILE.name + " · " + PROFILE.role,
    url: location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (e) {
      if (e.name === "AbortError") return;   // 사용자가 취소한 경우
    }
  }

  try {
    await navigator.clipboard.writeText(location.href);
    toast("링크를 복사했습니다.");
  } catch (e) {
    toast("주소창의 링크를 복사해 공유하세요.");
  }
}

/* ---------- 실행 ---------- */
initTheme();
$("saveContact").addEventListener("click", downloadVCard);
$("shareBtn").addEventListener("click", shareCard);
