// ANA UYGULAMA: ÇARK AI DÜZELTMESİ, İKONİK TAKIMLAR HAVUZU, LİG KARİYER MODU (ARKA PLAN OLAYLARI & TAKIM HABERLERİ SİSTEMİ)

const MODES = [
  { id: "career", name: "Lig Kariyer Modu", tag: "★ YENİ MOD · Tek Oyunculu Sezon", d: "360 M€ bütçeyle kadronu kur; Premier Lig'de 20 takımlı 19 haftalık fikstürde şampiyonluk mücadelesi ver!", clubs: "optional", cpu: "best", budget: 360, career: 1, special: 1 },
  { id: "classic", name: "Klasik Draft", tag: "Standart Seçim", d: "11 asil ve 3 yedek oyuncuyu sırayla seçerek kadronu oluştur.", clubs: "optional", cpu: "best" },
  { id: "wheel", name: "Çark Draftı", tag: "Takım Çarkı", d: "Seçilen takımlar çarka yerleşir; hem sen hem de yapay zeka çarkı döndürerek çıkan kulüpten oyuncu alır.", clubs: "optional", cpu: "wheel", wheel: 1 },
  { id: "iconic", name: "İkonik Draft", tag: "18 Efsane Kadro", d: "Real Madrid 16-17, Barça 14-15, Milan 04-05, Arsenal 03-04 gibi unutulmaz efsane kadrolarla draft yap.", clubs: "optional", cpu: "best", iconicDefault: 1 },
  { id: "club", name: "Kulüp Draftı", tag: "Özel Kulüp Havuzu", d: "Yalnızca belirlediğin kulüplerin oyuncularıyla draft yap.", clubs: "required", cpu: "best" },
  { id: "league", name: "Lig Draftı", tag: "Tüm Lig Havuzu", d: "Seçtiğin liglerdeki tüm kulüplerle kulüp elemesi olmadan doğrudan drafta başla.", clubs: "none", cpu: "best" },
  { id: "random", name: "Rastgele Draft", tag: "Şans Seçimi", d: "Seçimler rastgele yapılır; hızlıca kadroları tamamlayıp maça geçebilirsin.", clubs: "optional", cpu: "random" },
  { id: "budget", name: "Bütçe Draftı", tag: "360 M€ Bütçe", d: "Dinamik piyasa değerleriyle 360 M€ bütçeyi aşmadan 14 kişilik kadronu kur.", clubs: "optional", cpu: "best", budget: 360 }
];

const CUSTOM_SHAPES = [
  { id: "shield", name: "Kalkan Arma" },
  { id: "circle", name: "Klasik Daire" },
  { id: "stripes", name: "Çubuklu Arma" },
  { id: "diamond", name: "Elmas Arma" },
  { id: "star", name: "Yıldızlı Arma" }
];

function renderTeamIdentityBadge(t, size = 24) {
  if (!t || !t.customIdentity) {
    return clubLogo("Manchester City", size);
  }
  const cid = t.customIdentity;
  if (cid.type === "club" && cid.club) {
    return clubLogo(cid.club, size);
  }
  const c1 = cid.c1 || "#166534";
  const c2 = cid.c2 || "#eab308";
  const sh = cid.shape || "shield";
  const abbr = ((t.name || "FC").replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ]/g, "").slice(0, 3) || "FC").toUpperCase();
  const txtCol = (c1.toLowerCase() === "#ffffff" || c1.toLowerCase() === "#fde100" || c1.toLowerCase() === "#eab308") ? "#07120d" : "#ffffff";

  if (sh === "circle") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="15" fill="${c1}" stroke="${c2}" stroke-width="2.2"/>
      <circle cx="16" cy="16" r="10.5" fill="${c2}" opacity="0.28"/>
      <text x="16" y="19.5" text-anchor="middle" fill="${txtCol}" font-family="Outfit, sans-serif" font-weight="800" font-size="9.5">${abbr}</text>
    </svg>`;
  }
  if (sh === "stripes") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <path d="M5,4 H27 V17 C27,24 16,29 16,29 C16,29 5,24 5,17 Z" fill="${c1}" stroke="${c2}" stroke-width="2"/>
      <path d="M11,5 V25 M16,5 V27 M21,5 V25" stroke="${c2}" stroke-width="3.2"/>
      <rect x="5" y="11" width="22" height="9" fill="rgba(0,0,0,0.68)"/>
      <text x="16" y="18.2" text-anchor="middle" fill="#FFFFFF" font-family="Outfit, sans-serif" font-weight="800" font-size="9">${abbr}</text>
    </svg>`;
  }
  if (sh === "diamond") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <polygon points="16,2 30,16 16,30 2,16" fill="${c1}" stroke="${c2}" stroke-width="2.2"/>
      <polygon points="16,6 26,16 16,26 6,16" fill="${c2}" opacity="0.25"/>
      <text x="16" y="19.2" text-anchor="middle" fill="${txtCol}" font-family="Outfit, sans-serif" font-weight="800" font-size="8.8">${abbr}</text>
    </svg>`;
  }
  if (sh === "star") {
    return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32">
      <path d="M5,6 H27 V18 C27,24.5 16,29.5 16,29.5 C16,29.5 5,24.5 5,18 Z" fill="${c1}" stroke="${c2}" stroke-width="2"/>
      <polygon points="16,1.2 17.5,4.2 20.8,4.5 18.2,6.6 19,9.8 16,8 13,9.8 13.8,6.6 11.2,4.5 14.5,4.2" fill="${c2}"/>
      <text x="16" y="20.5" text-anchor="middle" fill="${txtCol}" font-family="Outfit, sans-serif" font-weight="800" font-size="9">${abbr}</text>
    </svg>`;
  }
  return `<svg class="club-svg" width="${size}" height="${size}" viewBox="0 0 32 32">
    <path d="M5,4 H27 V17 C27,24 16,29 16,29 C16,29 5,24 5,17 Z" fill="${c1}" stroke="${c2}" stroke-width="2.2"/>
    <path d="M16,5 H26 V17 C26,22.5 16,27.5 16,27.5 Z" fill="${c2}" opacity="0.32"/>
    <text x="16" y="19.2" text-anchor="middle" fill="${txtCol}" font-family="Outfit, sans-serif" font-weight="800" font-size="9.2">${abbr}</text>
  </svg>`;
}

function cost(p) {
  return p.price != null ? p.price : calcBasePriceWithVariance(p.n, p.r, p.id || 0);
}

const tier = r => r >= 88 ? "e" : r >= 85 ? "h" : r >= 82 ? "g" : r >= 78 ? "m" : "";
const rt = r => `<span class="pos-badge pos-MID">★</span>`;
const posTag = pos => `<span class="pos-badge pos-${pos || 'MID'}">${POS_SHORT[pos || 'MID']}</span>`;

const MODERN_LEAGUES = LEAGUES.filter(l => l !== "İkonik Takımlar");

let S = {
  view: "setup", // "setup" | "clubs" | "draft" | "identity" | "result" | "match" | "league_select" | "league_hub"
  mode: "classic",
  leagues: new Set(MODERN_LEAGUES),
  clubs: new Set(),
  opp: 1,
  humanCount: 1,
  format: "snake",
  strictPos: true,
  teamName: "1. Oyuncu",
  err: "",
  impMsg: "",
  onlineModal: false,
  onlineMsg: "",
  poolFilter: { q: "", lg: "", c: "", p: "" }
};

let G = null;
let F = { q: "", lg: "", c: "", p: "" };
let M = null;
let T = null;
let LG = null;
let W = { spinning: false, angle: 0, selectedClub: null, offeredPlayers: [], jokers: 3 };
let SWAP = { teamIdx: 0, selectedId: null };
let ID_EDIT = { teamIdx: 0, lgFilter: "" };

const $ = s => document.querySelector(s);
const app = $("#app");
const currentMode = () => MODES.find(m => m.id === S.mode) || MODES[0];

function selectMode(modeId) {
  S.mode = modeId;
  S.err = "";
  if (modeId === "iconic") {
    S.leagues = new Set(["İkonik Takımlar"]);
    S.clubs = new Set(ICONIC_CLUBS);
  } else if (modeId === "career") {
    S.leagues.delete("İkonik Takımlar");
    if (!S.leagues.size) S.leagues = new Set(MODERN_LEAGUES);
    for (const c of [...S.clubs]) {
      if (CLUB_TO_LEAGUE[c] === "İkonik Takımlar") S.clubs.delete(c);
    }
    S.opp = 1;
    S.humanCount = 1;
  } else {
    if (S.leagues.size === 1 && S.leagues.has("İkonik Takımlar")) {
      S.leagues = new Set(MODERN_LEAGUES);
      S.clubs.clear();
    }
  }
  render();
}

function hdr() {
  const isCareer = G && G.m.career;
  return `
    <header class="top">
      <div class="logo-wrap">
        <div class="logo-badge">FD</div>
        <div>
          <div class="logo">Futbol <span>Draft</span></div>
          <span class="logo-sub">2026-27 Sezonu · Kadro, Lig Kariyeri & Turnuva Simülatörü</span>
        </div>
      </div>
      <div class="nav-actions">
        ${typeof renderGhModal === "function" ? `<button class="sm" onclick="toggleGhModal()">GitHub Dosyaları</button>` : ""}
        <button class="${NET.connected || S.onlineModal ? 'pri' : 'gold'}" onclick="toggleOnlineModal()">
          ${NET.connected ? `Canlı Oda (${NET.roomCode})` : "Online Oda (2 PC)"}
        </button>
        ${G && G.k >= G.order.length ? `<button onclick="S.view='identity';render()">Takım Kimliği & Logo</button>` : ""}
        ${G ? `<button onclick="S.view='result';render()">Kadro Dizilişi (11+3)</button>` : ""}
        ${G && isCareer && LG ? `<button class="pri" onclick="S.view='league_hub';render()">Premier Lig Merkezi</button>` : ""}
        ${G && !isCareer ? `<button onclick="goMatchDirect()">Turnuva & Maç</button>` : ""}
        ${S.view !== "setup" ? `<button onclick="resetToSetup()">Ana Menü</button>` : ""}
      </div>
    </header>
    ${renderNetStatusBar()}
    ${typeof renderGhModal === "function" ? renderGhModal() : ""}
  `;
}

function togglePoolView() { S.view = "setup"; render(); }
function renderPoolExplorer() { setup(); }
function renderPoolRows() { return ""; }
function updatePoolTable() {}
function doImport() {}
function resetPool() {}

function resetToSetup() {
  if (M && M.tm) clearInterval(M.tm);
  if (cpuTimer) clearTimeout(cpuTimer);
  G = null;
  M = null;
  T = null;
  LG = null;
  S.view = "setup";
  S.err = "";
  render();
}

function goMatchDirect() {
  if (!G) return;
  if (G.k < G.order.length) {
    autoCompleteDraft(true);
  }
  G.teams.forEach(ensureTeamLineup);
  if (G.m.career) {
    if (!LG) {
      S.view = "league_select";
    } else {
      S.view = "league_hub";
    }
    return render();
  }
  if (!T) initTournament();
  const nextMatch = getActiveTournamentMatch();
  if (nextMatch) {
    matchSetup(nextMatch.a, nextMatch.b, nextMatch.id);
  } else {
    matchSetup(0, 1);
  }
}

function toggleOnlineModal() {
  S.onlineModal = !S.onlineModal;
  render();
}

function copyInviteUrl(onlyCode = false) {
  const text = onlyCode ? NET.roomCode : getRoomInviteUrl();
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  S.onlineMsg = `<p class="ok-msg">${onlyCode ? "5 Haneli Oda Kodu" : "Canlı Oda Davet Linki"} kopyalandı.</p>`;
  render();
}

function encodeOnlineShare() {
  const payload = {
    m: S.mode,
    lg: [...S.leagues],
    cl: [...S.clubs],
    teams: G ? G.teams.map(t => ({
      n: t.name,
      p: t.picks.map(x => x.id),
      s: t.starters ? t.starters.map(x => x.id) : []
    })) : []
  };
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))); } catch (e) { return ""; }
}

function getShareUrl() { return getRoomInviteUrl(); }
function copyShareLink(onlyCode = false) { copyInviteUrl(onlyCode); }
function importFriendCode() { joinOnlineRoom(); }

function renderOnlineModal() {
  if (!S.onlineModal) return "";
  return `
    <div class="modal-backdrop" onclick="toggleOnlineModal()">
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="panel-head">
          <h2>İki Bilgisayar Karşılıklı Canlı Online Oda</h2>
          <button class="sm" onclick="toggleOnlineModal()">Kapat</button>
        </div>

        <p class="muted" style="margin:0 0 12px;font-size:.85rem">
          İki farklı bilgisayardan doğrudan oda koduyla bağlanarak sırayla oyuncu seçebilir, draft bitiminde kendi takım isminizi ve logonuzu belirleyebilir, İlk 11 + 3 Yedek dizilişini yapabilir ve 90 dakikalık maçı aynı anda izleyebilirsiniz.
        </p>

        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px">
          <div style="background:var(--raised);padding:14px;border-radius:10px;border:1px solid var(--border)">
            <h3 style="color:var(--pri-bright);margin-bottom:6px">1. Bilgisayar: Oda Kur (Host)</h3>
            <p class="muted" style="font-size:.8rem;margin:0 0 10px">Odayı kur ve oluşan 5 haneli Oda Kodunu arkadaşına gönder.</p>
            <button class="pri" onclick="createOnlineRoom()" style="width:100%">Canlı Online Oda Kur</button>

            ${NET.role === "host" && NET.roomCode ? `
              <div style="margin-top:12px;text-align:center">
                <div class="muted" style="font-size:.76rem;margin-bottom:4px">Oda Kodun:</div>
                <div class="room-code-box">${NET.roomCode}</div>
                <div class="row" style="margin-top:10px;justify-content:center">
                  <button class="sm pri" onclick="copyInviteUrl(false)">Linki Kopyala</button>
                  <button class="sm" onclick="copyInviteUrl(true)">Kodu Kopyala</button>
                </div>
              </div>
            ` : ""}
          </div>

          <div style="background:var(--raised);padding:14px;border-radius:10px;border:1px solid var(--border)">
            <h3 style="color:var(--t-elite);margin-bottom:6px">2. Bilgisayar: Odaya Katıl</h3>
            <p class="muted" style="font-size:.8rem;margin:0 0 10px">Arkadaşının gönderdiği 5 haneli Oda Kodunu girip bağlan.</p>
            <div class="row">
              <input id="friend-code-inp" placeholder="Örn: 48291" value="${NET.role === 'guest' ? NET.roomCode : ''}" style="flex:1;font-family:var(--mono);font-size:1rem;text-align:center">
              <button class="gold" onclick="joinOnlineRoom()">Bağlan</button>
            </div>
          </div>
        </div>

        ${NET.connected ? `
          <div style="margin-top:14px;padding:12px;background:rgba(22,101,52,0.22);border:1px solid var(--pri-bright);border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <b>${NET.peerName} ile Canlı Bağlantı Aktif</b>
              <div class="muted" style="font-size:.8rem">${NET.role === "host" ? "Oda kurucu sensin. Lig ve takım seçimine geçip draftı başlatabilirsin." : "Oda kurucunun draftı başlatması bekleniyor..."}</div>
            </div>
            ${NET.role === "host" ? `<button class="pri" onclick="S.onlineModal=false;S.view='clubs';render()">Lig & Takım Seçimine Geç →</button>` : ""}
          </div>
        ` : ""}

        ${NET.role ? `
          <div style="margin-top:10px;text-align:right">
            <button class="sm warn-btn" onclick="disconnectOnlineRoom()">Bağlantıyı Kes</button>
          </div>
        ` : ""}

        ${S.onlineMsg || ""}
      </div>
    </div>
  `;
}

// 6. KURULUM EKRANI (1. Ekran: Mod & Turnuva Ayarları -> 2. Ekran: Lig, Güncel Takım ve İkonik Takım Seçimi)
function toggleLeague(lg) {
  if (S.leagues.has(lg)) {
    if (S.leagues.size > 1) S.leagues.delete(lg);
  } else {
    S.leagues.add(lg);
  }
  for (const c of [...S.clubs]) {
    const clg = CLUB_TO_LEAGUE[c];
    if (clg && !S.leagues.has(clg)) S.clubs.delete(c);
  }
  S.err = "";
  render();
}

function selectOnlyLeague(lg) {
  S.leagues = new Set([lg]);
  S.clubs.clear();
  if (lg === "İkonik Takımlar") {
    S.clubs = new Set(ICONIC_CLUBS);
  }
  S.err = "";
  render();
}

function selectAllLeagues() {
  const m = currentMode();
  if (m.career) {
    S.leagues = new Set(MODERN_LEAGUES);
  } else {
    S.leagues = new Set(LEAGUES);
  }
  S.err = "";
  render();
}

function selectTop5Leagues() {
  S.leagues = new Set(["Premier Lig", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]);
  for (const c of [...S.clubs]) {
    if (!S.leagues.has(CLUB_TO_LEAGUE[c])) S.clubs.delete(c);
  }
  S.err = "";
  render();
}

function selectAllIconicClubs() {
  S.leagues.add("İkonik Takımlar");
  ICONIC_CLUBS.forEach(c => S.clubs.add(c));
  S.err = "";
  render();
}

function selectOnlyIconicClubs() {
  S.leagues = new Set(["İkonik Takımlar"]);
  S.clubs = new Set(ICONIC_CLUBS);
  S.err = "";
  render();
}

function proceedFromSetup() {
  S.err = "";
  S.view = "clubs";
  render();
}

function setup() {
  const m = currentMode();
  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">Futbol Draft · Güncel & İkonik Kadrolar · Lig Kariyer Modu</span>
      <h1>Kadro Draftı, Lig Kariyeri & Turnuva Simülatörü</h1>
      <p>Oyun modunu belirle. Devam ettiğinde lig, güncel kulüp ve İkonik Takım seçimi ekranı açılır.</p>
    </section>

    <div class="grid modes">
      ${MODES.map(x => `
        <button class="mode ${x.special ? 'special-career' : ''}" aria-pressed="${x.id === S.mode}" onclick="selectMode('${x.id}')">
          <div>
            ${x.special ? `<div class="new-mode-badge">★ YENİ OYUN MODU</div>` : `<small>${x.tag}</small>`}
            <h3>${x.name}</h3>
            <p>${x.d}</p>
          </div>
        </button>
      `).join("")}
    </div>

    <div class="panel">
      <div class="panel-head">
        <h2>Oyun & Turnuva Ayarları</h2>
      </div>
      ${m.career ? `
        <p class="muted" style="margin:0 0 12px;font-size:.86rem">
          <b>Lig Kariyer Modu (Tek Oyunculu):</b> 360 M€ bütçeyle 14 kişilik (11 Asil + 3 Yedek) kadronu kurduktan sonra takım ismini ve logonu belirleyip 20 takımlı Premier Lig sezonuna katılırsın.
        </p>
      ` : `
        <div class="row" style="gap:14px">
          <label>Turnuva Boyutu:
            <select onchange="S.opp=+this.value;if(S.humanCount>S.opp+1)S.humanCount=S.opp+1;render()">
              <option value="1" ${S.opp === 1 ? "selected" : ""}>2 Takım (Doğrudan Final)</option>
              <option value="2" ${S.opp === 2 ? "selected" : ""}>3 Takım (Yarı Final + Final)</option>
              <option value="3" ${S.opp === 3 ? "selected" : ""}>4 Takım (Yarı Final & Final Turnuvası)</option>
            </select>
          </label>
          <label>Katılımcı:
            <select onchange="S.humanCount=+this.value;render()">
              <option value="1" ${S.humanCount === 1 ? "selected" : ""}>Tek Oyuncu (vs CPU) / 2 PC Online</option>
              ${Array.from({ length: S.opp }, (_, idx) => idx + 2).map(cnt => `
                <option value="${cnt}" ${S.humanCount === cnt ? "selected" : ""}>Aynı Cihazda ${cnt} Oyuncu</option>
              `).join("")}
            </select>
          </label>
          <label>Draft Sırası:
            <select onchange="S.format=this.value">
              <option value="snake" ${S.format === "snake" ? "selected" : ""}>Yılan (Her tur döner)</option>
              <option value="linear" ${S.format === "linear" ? "selected" : ""}>Doğrusal (Sabit sıra)</option>
            </select>
          </label>
        </div>
      `}
      <div class="row" style="margin-top:16px">
        <button class="pri" onclick="proceedFromSetup()">
          Devam Et: Lig & Takım Seç →
        </button>
        ${!m.career ? `<button onclick="toggleOnlineModal()">Online Oda Kur / Katıl</button>` : ""}
      </div>
      ${S.err ? `<p class="err">${S.err}</p>` : ""}
    </div>
  `;
}

// 2. Ekran: Lig Seçici, Güncel Takımlar ve Ayrı İkonik Takımlar Bölümü
function renderClubSelectScreen() {
  const m = currentMode();
  const isCareer = !!m.career;
  const showClubChips = m.clubs !== "none";
  const leaguesToShow = isCareer
    ? LEAGUES_META.filter(lg => lg.id !== "İkonik Takımlar")
    : LEAGUES_META;

  const activeClubs = CLUBS.filter(c => S.leagues.has(CLUB_TO_LEAGUE[c] || "Diğer Takımlar"));
  const activePlayerCount = P.filter(p => S.leagues.has(p.lg) && (!S.clubs.size || S.clubs.has(p.c))).length;
  const selectedCount = S.clubs.size;
  const modernLeaguesSelected = [...S.leagues].filter(l => l !== "İkonik Takımlar");

  app.innerHTML = hdr() + renderOnlineModal() + `
    <div class="panel" style="margin-top:0">
      <div class="panel-head">
        <div>
          <span class="eyebrow">Adım 2 / 2 · Lig & Kulüp Havuzu</span>
          <h2>Ligleri (${S.leagues.size} Lig · ${activePlayerCount} Aktif Oyuncu) ve Takımları Belirle</h2>
        </div>
        <div class="row">
          <button onclick="S.view='setup';S.err='';render()">← Mod & Ayarlara Dön</button>
          <button class="pri" onclick="startDraft()">Drafta Başla →</button>
        </div>
      </div>

      <div class="row" style="margin-bottom:12px">
        <button class="sm ${S.leagues.size === leaguesToShow.length ? 'pri' : ''}" onclick="selectAllLeagues()">Tüm Ligler (${leaguesToShow.length})</button>
        <button class="sm" onclick="selectTop5Leagues()">5 Büyük Lig</button>
        ${!isCareer ? `<button class="sm gold" onclick="selectOnlyIconicClubs()">Sadece İkonik Efsaneler (18 Kadro · 299 Oyuncu)</button>` : ""}
      </div>

      <div class="league-grid" style="margin-bottom:18px">
        ${leaguesToShow.map(lg => {
          const lgPlayers = P.filter(p => p.lg === lg.id);
          const lgClubs = [...new Set(lgPlayers.map(p => p.c))];
          const isSel = S.leagues.has(lg.id);
          return `
            <div class="league-card" aria-pressed="${isSel}" onclick="toggleLeague('${lg.id}')">
              <div class="lg-title">
                <span>${lg.name}</span>
                <span style="font-size:.75rem;color:${isSel ? 'var(--pri-bright)' : 'var(--muted)'}">${isSel ? "Seçili" : "Kapalı"}</span>
              </div>
              <div class="lg-meta">${lg.country} · ${lgClubs.length} Kulüp · ${lgPlayers.length} Oyuncu</div>
              <div style="margin-top:4px">
                <button class="sm" onclick="event.stopPropagation();selectOnlyLeague('${lg.id}')">Sadece Bu Lig</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      ${S.err ? `<p class="err">${S.err}</p>` : ""}

      ${showClubChips ? `
        <div style="border-top:1px solid var(--border);padding-top:14px">
          <div class="panel-head">
            <div>
              <h2>Güncel Kulüpler (2026-27)</h2>
              <p class="muted" style="margin:2px 0 0;font-size:.82rem">
                ${m.clubs === "required"
                  ? "Kulüp Draftı modundasın: En az 2 takım seçmelisin."
                  : `Seçili takım: <b>${selectedCount || "Tümü (" + activeClubs.length + ")"}</b>. Hiç takım işaretlemezsen seçili liglerdeki tüm takımlar dahil edilir.`}
              </p>
            </div>
            <div class="row">
              <button class="sm" onclick="selectAllActiveClubs()">Tümünü İşaretle (${activeClubs.length})</button>
              <button class="sm" onclick="selectEuropeanGiants()">Avrupa Devleri</button>
              <button class="sm" onclick="selectBigSix()">Premier Lig Big 6</button>
              <button class="sm" onclick="selectSuperLigFour()">Süper Lig 4 Büyükler</button>
              <button class="sm" onclick="S.clubs.clear();render()">Seçimi Temizle</button>
            </div>
          </div>

          ${modernLeaguesSelected.map(lgName => {
            const clubsOfLg = CLUBS.filter(c => (CLUB_TO_LEAGUE[c] || "Diğer Takımlar") === lgName);
            if (!clubsOfLg.length) return "";
            return `
              <div style="margin-top:14px">
                <h3 style="font-size:.92rem;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:.05em">${lgName} (${clubsOfLg.length})</h3>
                <div class="chips">
                  ${clubsOfLg.map(c => {
                    const esc = c.replace(/'/g, "\\'");
                    return `<button class="chip" aria-pressed="${S.clubs.has(c)}" onclick="toggleClub('${esc}')">${clubLogo(c, 22)} <span>${c}</span></button>`;
                  }).join("")}
                </div>
              </div>
            `;
          }).join("")}
        </div>

        ${!isCareer ? `
          <div style="margin-top:22px;padding:16px;background:rgba(234,179,8,0.06);border:1px solid rgba(234,179,8,0.35);border-radius:var(--r)">
            <div class="panel-head" style="margin-bottom:10px">
              <div>
                <span class="eyebrow" style="color:var(--t-elite);border-color:rgba(234,179,8,0.4);background:rgba(234,179,8,0.12)">Efsaneler Havuzu · 18 İkonik Kadro · 299 Oyuncu</span>
                <h2 style="color:var(--t-elite)">İkonik Takımlar (1999 – 2020)</h2>
                <p class="muted" style="margin:2px 0 0;font-size:.82rem">
                  Futbol tarihine damga vurmuş efsane sezon kadrolarını draft havuzuna dahil et. Herhangi bir ikonik takıma tıkladığında otomatik olarak havuza eklenir.
                </p>
              </div>
              <div class="row">
                <button class="sm gold" onclick="selectOnlyIconicClubs()">Sadece İkonik Takımlarla Oyna (18)</button>
                <button class="sm" onclick="selectAllIconicClubs()">Tüm İkonikleri Havuza Ekle (18)</button>
              </div>
            </div>
            <div class="chips">
              ${ICONIC_CLUBS.map(c => {
                const esc = c.replace(/'/g, "\\'");
                return `<button class="chip" aria-pressed="${S.clubs.has(c)}" onclick="toggleIconicClub('${esc}')">${clubLogo(c, 22)} <span>${c}</span></button>`;
              }).join("")}
            </div>
          </div>
        ` : ""}
      ` : ""}

      <div class="row" style="margin-top:20px;justify-content:space-between;border-top:1px solid var(--border);padding-top:14px">
        <button onclick="S.view='setup';S.err='';render()">← Geri</button>
        <button class="pri" onclick="startDraft()">Drafta Başla (11 Asil + 3 Yedek)</button>
      </div>
    </div>
  `;
}

function toggleClub(c) {
  if (S.clubs.has(c)) S.clubs.delete(c);
  else {
    const lg = CLUB_TO_LEAGUE[c];
    if (lg) S.leagues.add(lg);
    S.clubs.add(c);
  }
  render();
}

function toggleIconicClub(c) {
  if (S.clubs.has(c)) {
    S.clubs.delete(c);
  } else {
    S.leagues.add("İkonik Takımlar");
    S.clubs.add(c);
  }
  render();
}

function selectAllActiveClubs() {
  const activeClubs = CLUBS.filter(c => S.leagues.has(CLUB_TO_LEAGUE[c] || "Diğer Takımlar"));
  S.clubs = new Set(activeClubs);
  render();
}

function selectBigSix() {
  S.leagues.add("Premier Lig");
  S.clubs = new Set(["Manchester City", "Arsenal", "Liverpool", "Chelsea", "Manchester United", "Tottenham"]);
  render();
}

function selectSuperLigFour() {
  S.leagues.add("Trendyol Süper Lig");
  S.clubs = new Set(["Galatasaray", "Fenerbahce", "Besiktas", "Trabzonspor"]);
  render();
}

function selectEuropeanGiants() {
  S.leagues = new Set(MODERN_LEAGUES);
  S.clubs = new Set([
    "Manchester City", "Arsenal", "Liverpool", "Chelsea",
    "Real Madrid", "Barcelona", "Atletico Madrid",
    "Inter", "Juventus", "Milan",
    "Bayern Munchen", "Borussia Dortmund", "PSG",
    "Porto", "Benfica", "Sporting", "Ajax",
    "Galatasaray", "Fenerbahce", "RB Salzburg"
  ]);
  render();
}

// 7. DRAFT MOTORU VE ÇARK / ÇEŞİTLİ CPU SEÇİMLERİ
function posCountsOf(team) {
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  team.picks.forEach(p => {
    const k = p.pos || "MID";
    counts[k] = (counts[k] || 0) + 1;
  });
  return counts;
}

function canTeamPickPos(team, pos, pool, taken) {
  if (!S.strictPos) return true;
  const counts = posCountsOf(team);
  const k = pos || "MID";
  const remSlots = ROUNDS - team.picks.length;

  const missingByPos = {};
  let totalMandatoryMissing = 0;
  for (const posKey of POSITIONS) {
    const miss = Math.max(0, FORMATION_QUOTA[posKey] - (counts[posKey] || 0));
    missingByPos[posKey] = miss;
    totalMandatoryMissing += miss;
  }

  if (missingByPos[k] > 0) return true;

  if (remSlots <= totalMandatoryMissing) {
    const anyNeededAvailable = pool.some(p => !taken.has(p.id) && missingByPos[p.pos] > 0);
    return !anyNeededAvailable;
  }

  if (k === "GK" && counts.GK >= 2) {
    const nonGkAvail = pool.some(p => !taken.has(p.id) && p.pos !== "GK");
    if (nonGkAvail) return false;
  }

  return true;
}

function minP() {
  if (!G || !G.pool.length) return { r: 66 };
  return G.pool.reduce((a, b) => cost(b) < cost(a) ? b : a, G.pool[0]);
}

function calcMinReserveAfterPick(t, candidateP) {
  const remSlots = ROUNDS - t.picks.length - 1;
  if (remSlots <= 0) return 0;

  const untaken = G.pool.filter(x => !G.taken.has(x.id) && x.id !== candidateP.id);
  if (!untaken.length) return 0;

  if (!S.strictPos) {
    const sortedCosts = untaken.map(cost).sort((a, b) => a - b);
    let sum = 0;
    for (let i = 0; i < remSlots && i < sortedCosts.length; i++) sum += sortedCosts[i];
    return sum;
  }

  const counts = posCountsOf(t);
  const candPos = candidateP.pos || "MID";
  counts[candPos] = (counts[candPos] || 0) + 1;

  let reserve = 0;
  let slotsLeft = remSlots;
  const usedIds = new Set();

  for (const posKey of POSITIONS) {
    const need = Math.max(0, FORMATION_QUOTA[posKey] - (counts[posKey] || 0));
    if (need > 0) {
      const posCheapest = untaken
        .filter(x => x.pos === posKey)
        .sort((a, b) => cost(a) - cost(b));
      for (let i = 0; i < need && slotsLeft > 0; i++) {
        if (posCheapest[i]) {
          reserve += cost(posCheapest[i]);
          usedIds.add(posCheapest[i].id);
          slotsLeft--;
        }
      }
    }
  }

  if (slotsLeft > 0) {
    const restCheapest = untaken.filter(x => !usedIds.has(x.id)).sort((a, b) => cost(a) - cost(b));
    for (let i = 0; i < slotsLeft && i < restCheapest.length; i++) {
      reserve += cost(restCheapest[i]);
    }
  }
  return reserve;
}

function checkBudgetStatus(t, p) {
  if (!G || !G.m.budget) return { ok: true, reason: "" };
  const remBudget = G.m.budget - t.spent;
  const price = cost(p);
  const remSlots = ROUNDS - t.picks.length - 1;

  if (price > remBudget) {
    return {
      ok: false,
      reason: `Satın Alma İptal Edildi: ${p.n} (${price} M€) için kalan bütçen (${remBudget} M€) yetersiz.`
    };
  }

  if (remSlots > 0) {
    const minReserve = calcMinReserveAfterPick(t, p);
    if (remBudget - price < minReserve) {
      return {
        ok: false,
        reason: `Bütçe Uyarısı — Alım İptal Edildi: ${p.n} (${price} M€) alınırsa kalan ${remSlots} oyuncu için ${remBudget - price} M€ kalır; ancak kalan boş mevkilerdeki en ucuz oyuncuları tamamlayabilmek için en az ${minReserve} M€ gerekiyor.`
      };
    }
  }

  return { ok: true, reason: "" };
}

function afford(t, p) {
  return checkBudgetStatus(t, p).ok;
}

function canPickPlayer(t, p) {
  if (!G || G.taken.has(p.id)) return false;
  if (!canTeamPickPos(t, p.pos, G.pool, G.taken)) return false;
  if (!afford(t, p)) return false;
  return true;
}

function isMyTurnNow() {
  if (!G || G.k >= G.order.length) return false;
  const currIdx = G.order[G.k];
  if (NET.connected) {
    return currIdx === NET.myTeamIdx;
  }
  return !!G.teams[currIdx].me;
}

function buildDraftState() {
  const m = currentMode();
  // Eğer kulüp işaretlenmişse ilgili kulüplerin liglerini de otomatik aktif et
  if (S.clubs.size) {
    S.clubs.forEach(c => {
      const lg = CLUB_TO_LEAGUE[c];
      if (lg) S.leagues.add(lg);
    });
  }
  let pool = P.filter(p => S.leagues.has(p.lg));
  if (m.clubs !== "none" && S.clubs.size) {
    pool = pool.filter(p => S.clubs.has(p.c));
  }
  if (m.clubs === "required" && S.clubs.size < 2) {
    S.err = "Kulüp Draftı için en az 2 kulüp seçmelisin.";
    return null;
  }
  const n = m.career ? 1 : (S.opp + 1);
  if (pool.length < n * ROUNDS) {
    S.err = `Seçili havuzda 14 kişilik (11 Asil + 3 Yedek) kadrolar için yeterli oyuncu yok (${pool.length} mevcut, en az ${n * ROUNDS} gerekli). Daha fazla kulüp veya lig seçin.`;
    return null;
  }

  if (S.strictPos) {
    for (const posKey of POSITIONS) {
      const availInPos = pool.filter(p => p.pos === posKey).length;
      const neededTotal = n * FORMATION_QUOTA[posKey];
      if (availInPos < neededTotal) {
        S.err = `Seçili havuzda yeterli ${POS_LABEL[posKey]} yok (${availInPos} mevcut, en az ${neededTotal} gerekli). Daha fazla kulüp veya lig seçin.`;
        return null;
      }
    }
  }

  let activeBudget = m.budget || null;
  if (activeBudget) {
    const cheapestPool = pool.map(cost).sort((a, b) => a - b);
    const min14Cost = cheapestPool.slice(0, n * ROUNDS).reduce((s, c) => s + c, 0) / n;
    if (min14Cost + 40 > activeBudget) {
      activeBudget = Math.ceil((min14Cost + 60) / 10) * 10;
    }
  }

  const cpuNames = ["Avrupa Elit XI", "Kuzey Yıldızları XI", "Akdeniz & Boğaz XI"];
  const cpuClubs = ["Real Madrid", "Bayern Munchen", "Inter"];
  const defaultPalette = [
    { c1: "#166534", c2: "#eab308", shape: "shield" },
    { c1: "#1e3a8a", c2: "#38bdf8", shape: "circle" },
    { c1: "#7f1d1d", c2: "#fbbf24", shape: "stripes" },
    { c1: "#3b0764", c2: "#f472b6", shape: "diamond" }
  ];

  const effectiveHumans = m.career ? 1 : (NET.connected ? 2 : S.humanCount);
  const teams = [];
  for (let i = 0; i < n; i++) {
    const isHuman = i < effectiveHumans;
    let tName;
    if (NET.connected) {
      if (i === 0) tName = "1. Oyuncu";
      else if (i === 1) tName = "2. Oyuncu";
      else tName = cpuNames[i - 1] || ("CPU " + i);
    } else {
      tName = isHuman ? (m.career ? "Senin Kulübün" : `${i + 1}. Oyuncu`) : `${cpuNames[i - 1] || ("CPU " + i)}`;
    }

    const isMeLocal = NET.connected ? (i === NET.myTeamIdx) : isHuman;
    const pal = defaultPalette[i % defaultPalette.length];
    teams.push({
      name: tName,
      me: isMeLocal ? 1 : 0,
      isHuman,
      identityDone: !isHuman,
      customIdentity: isHuman
        ? { type: "custom", shape: pal.shape, c1: pal.c1, c2: pal.c2, club: "Real Madrid" }
        : { type: "club", shape: "shield", c1: pal.c1, c2: pal.c2, club: cpuClubs[(i - 1) % cpuClubs.length] },
      picks: [],
      starters: null,
      bench: null,
      formation: "4-3-3",
      spent: 0
    });
  }

  const order = [];
  for (let r = 0; r < ROUNDS; r++) {
    const o = teams.map((_, i) => i);
    order.push(...(S.format === "snake" && (r % 2 === 1) ? o.reverse() : o));
  }

  W = { spinning: false, angle: 0, selectedClub: null, offeredPlayers: [], jokers: 3 };
  ID_EDIT = { teamIdx: NET.connected ? NET.myTeamIdx : 0, lgFilter: "" };

  return {
    m: { ...m, budget: activeBudget },
    pool,
    teams,
    order,
    k: 0,
    taken: new Set(),
    history: [],
    budgetWarning: ""
  };
}

function startDraft() {
  if (NET.connected && NET.role === "guest") {
    S.err = "Online odada draftı yalnızca Oda Kurucu (Host) başlatabilir.";
    return render();
  }
  const state = buildDraftState();
  if (!state) return render();
  S.err = "";
  G = state;
  T = null;
  LG = null;
  NET.readyMap = { 0: false, 1: false };
  F = { q: "", lg: "", c: "", p: "" };
  S.onlineModal = false;
  S.view = "draft";

  if (NET.connected && NET.role === "host") {
    sendNetMsg({
      type: "START_DRAFT",
      mode: S.mode,
      leagues: [...S.leagues],
      clubs: [...S.clubs],
      opp: S.opp,
      format: S.format,
      strictPos: S.strictPos,
      teamNames: G.teams.map(t => t.name),
      order: G.order
    });
  }

  render();
  cpuLoop();
}

function applyPickDirectly(id, isCpu = false) {
  if (!G || G.k >= G.order.length) return;
  const teamIdx = G.order[G.k];
  const t = G.teams[teamIdx];
  const p = P[id];
  if (!p || G.taken.has(id)) return;

  G.budgetWarning = "";
  const paid = cost(p);
  t.picks.push(p);
  t.spent += paid;
  G.taken.add(id);
  G.history.push({ teamIdx, playerId: id, paid, isCpu });
  G.k++;

  W.selectedClub = null;
  W.offeredPlayers = [];

  if (G.k >= G.order.length) {
    G.teams.forEach(ensureTeamLineup);
    SWAP.teamIdx = NET.connected ? NET.myTeamIdx : 0;
    ID_EDIT.teamIdx = NET.connected ? NET.myTeamIdx : 0;
    if (!G.m.career) initTournament();
    S.view = "identity";
    render();
  } else {
    render();
    cpuLoop();
  }
}

function pick(id, isCpu = false) {
  if (!G || G.k >= G.order.length) return;
  const teamIdx = G.order[G.k];
  const t = G.teams[teamIdx];
  const p = P[id];
  if (!p || G.taken.has(id)) return;

  if (!isCpu && !isMyTurnNow()) {
    G.budgetWarning = `Şu an sıra ${t.name} takımında. Rakibinin seçim yapmasını bekle.`;
    return render();
  }

  if (!canTeamPickPos(t, p.pos, G.pool, G.taken)) {
    if (!isCpu) {
      G.budgetWarning = `Pozisyon Kuralı: İlk 11'de zorunlu mevkileri tamamlamak için şu an ${POS_LABEL[p.pos]} yerine eksik mevkilerden seçim yapmalısın.`;
      render();
    }
    return;
  }

  if (G.m.budget) {
    const bStatus = checkBudgetStatus(t, p);
    if (!bStatus.ok) {
      if (!isCpu) {
        G.budgetWarning = bStatus.reason;
        render();
      }
      return;
    }
  }

  applyPickDirectly(id, isCpu);

  if (NET.connected) {
    sendNetMsg({ type: "PICK", playerId: id, isCpu });
  }
}

function chooseCpuPlayer(t) {
  let av = G.pool.filter(p => canPickPlayer(t, p));
  if (!av.length && G.m.budget) {
    const validPos = G.pool.filter(p => !G.taken.has(p.id) && canTeamPickPos(t, p.pos, G.pool, G.taken));
    validPos.sort((a, b) => cost(a) - cost(b));
    if (validPos.length && cost(validPos[0]) <= (G.m.budget - t.spent)) {
      return validPos[0];
    }
  }
  if (!av.length) return null;

  if (G.m.id === "wheel") {
    const clubs = getWheelClubsForTurn(t);
    const landedClub = clubs[(Math.random() * clubs.length) | 0];
    const clubValid = av.filter(p => p.c === landedClub);
    if (clubValid.length) {
      const shuffled = clubValid.slice().sort(() => Math.random() - 0.5).slice(0, 2);
      shuffled.sort((a, b) => b.r - a.r);
      return shuffled[0];
    }
    return av[(Math.random() * av.length) | 0];
  }

  if (G.m.cpu === "random") {
    return av[(Math.random() * av.length) | 0];
  }

  const lgCounts = {};
  const clubCounts = {};
  t.picks.forEach(pk => {
    lgCounts[pk.lg] = (lgCounts[pk.lg] || 0) + 1;
    clubCounts[pk.c] = (clubCounts[pk.c] || 0) + 1;
  });

  let candidates = av;
  if (G.m.budget) {
    const remBudget = G.m.budget - t.spent;
    const remSlots = ROUNDS - t.picks.length;
    const targetAvg = (remBudget / remSlots) * 1.4;
    const balanced = av.filter(p => cost(p) <= targetAvg);
    if (balanced.length) candidates = balanced;
  }

  const scored = candidates.map(p => {
    const lgPen = (lgCounts[p.lg] || 0) * 1.6;
    const clubPen = (clubCounts[p.c] || 0) * 2.5;
    const noise = (Math.random() - 0.5) * 6.5;
    return { p, score: p.r - lgPen - clubPen + noise };
  }).sort((a, b) => b.score - a.score);

  const poolSize = Math.min(12, scored.length);
  const topCandidates = scored.slice(0, poolSize);
  const weights = topCandidates.map((_, idx) => Math.pow(poolSize - idx, 1.3));
  let rnd = Math.random() * weights.reduce((s, w) => s + w, 0);
  for (let i = 0; i < topCandidates.length; i++) {
    if ((rnd -= weights[i]) <= 0) return topCandidates[i].p;
  }
  return topCandidates[0].p;
}

let cpuTimer = null;
function cpuLoop() {
  if (cpuTimer) clearTimeout(cpuTimer);
  if (!G || G.k >= G.order.length) return;
  const t = G.teams[G.order[G.k]];
  if (t.isHuman) return;
  if (NET.connected && NET.role === "guest") return;

  if (G.m.id === "wheel") {
    cpuTimer = setTimeout(() => {
      if (!G || G.k >= G.order.length || W.spinning) return;
      const currTeam = G.teams[G.order[G.k]];
      if (currTeam.isHuman) return;
      spinClubWheel(false, true);
    }, 320);
    return;
  }

  cpuTimer = setTimeout(() => {
    if (!G || G.k >= G.order.length) return;
    const currTeam = G.teams[G.order[G.k]];
    if (currTeam.isHuman) return;
    const chosen = chooseCpuPlayer(currTeam);
    if (chosen) pick(chosen.id, true);
  }, 240);
}

function undoLastPick(fromNet = false) {
  if (!G || !G.history.length) return;
  if (cpuTimer) clearTimeout(cpuTimer);
  while (G.history.length > 0) {
    const last = G.history.pop();
    const t = G.teams[last.teamIdx];
    t.picks.pop();
    t.spent = Math.max(0, t.spent - last.paid);
    G.taken.delete(last.playerId);
    G.k--;
    if (!last.isCpu) break;
  }
  G.budgetWarning = "";
  W.selectedClub = null;
  W.offeredPlayers = [];
  if (NET.connected && !fromNet) {
    sendNetMsg({ type: "UNDO" });
  }
  S.view = "draft";
  render();
}

function pickRandomForMe() {
  if (!G || G.k >= G.order.length || !isMyTurnNow()) return;
  const t = G.teams[G.order[G.k]];
  const av = G.pool.filter(p => canPickPlayer(t, p));
  if (!av.length) return;
  const topPool = av.slice().sort((a, b) => b.r - a.r).slice(0, Math.min(16, av.length));
  const chosen = topPool[(Math.random() * topPool.length) | 0];
  pick(chosen.id, false);
}

function autoCompleteDraft(silent = false) {
  if (!G) return;
  if (NET.connected && NET.role === "guest" && !silent) {
    G.budgetWarning = "Online odada Otomatik Tamamlama işlemini yalnızca Oda Kurucu başlatabilir.";
    return render();
  }
  if (cpuTimer) clearTimeout(cpuTimer);
  while (G.k < G.order.length) {
    const teamIdx = G.order[G.k];
    const t = G.teams[teamIdx];
    const chosen = chooseCpuPlayer(t);
    if (!chosen) break;
    const paid = cost(chosen);
    t.picks.push(chosen);
    t.spent += paid;
    G.taken.add(chosen.id);
    G.history.push({ teamIdx, playerId: chosen.id, paid, isCpu: !t.isHuman });
    G.k++;
  }
  G.teams.forEach(ensureTeamLineup);
  SWAP.teamIdx = NET.connected ? NET.myTeamIdx : 0;
  ID_EDIT.teamIdx = NET.connected ? NET.myTeamIdx : 0;
  if (!G.m.career) initTournament();
  if (NET.connected && NET.role === "host") {
    sendNetMsg({
      type: "AUTO_COMPLETE_SYNC",
      picksByTeam: G.teams.map(tm => tm.picks.map(p => p.id))
    });
  }
  S.view = "identity";
  if (!silent) render();
}

// 8. ÇARK DRAFTI MOTORU
function getWheelClubsForTurn(t) {
  const validPlayers = G.pool.filter(p => canPickPlayer(t, p));
  const clubs = [...new Set(validPlayers.map(p => p.c))];
  return clubs.length ? clubs : [...new Set(G.pool.filter(p => !G.taken.has(p.id)).map(p => p.c))];
}

function drawWheelCanvas() {
  const cv = $("#wheel-cv");
  if (!cv || !G || G.k >= G.order.length) return;
  const ctx = cv.getContext("2d");
  const t = G.teams[G.order[G.k]];
  const clubs = getWheelClubsForTurn(t);
  const w = cv.width, h = cv.height, cx = w / 2, cy = h / 2, rad = Math.min(cx, cy) - 8;

  ctx.clearRect(0, 0, w, h);
  if (!clubs.length) return;

  const slice = (Math.PI * 2) / clubs.length;
  clubs.forEach((c, i) => {
    const a0 = W.angle + i * slice;
    const a1 = a0 + slice;
    const cr = CLUB_CRESTS[c] || { c1: "#166534", c2: "#0b2919", code: c.slice(0, 3).toUpperCase() };

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rad, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? cr.c1 : (cr.c2 === "#FFFFFF" ? "#122b1e" : cr.c2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a0 + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = (i % 2 === 0 && (cr.c1 === "#FFFFFF" || cr.c1 === "#FDE100" || cr.c1 === "#FFCD00")) ? "#111" : "#FFF";
    ctx.font = "700 9.5px 'Outfit', sans-serif";
    const label = clubs.length > 18 ? cr.code : c.slice(0, 12);
    ctx.fillText(label, rad - 10, 3.5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = "#07120d";
  ctx.fill();
  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#22c55e";
  ctx.font = "800 10px 'Outfit', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ÇARK", cx, cy + 3.5);
}

function spinClubWheel(useJoker = false, isCpuSpin = false) {
  if (!G || W.spinning) return;
  if (!isCpuSpin && !isMyTurnNow()) return;

  const t = G.teams[G.order[G.k]];
  if (useJoker && !isCpuSpin) {
    if (W.jokers <= 0) return;
    W.jokers--;
  }

  const clubs = getWheelClubsForTurn(t);
  if (!clubs.length) return;

  W.spinning = true;
  W.selectedClub = null;
  W.offeredPlayers = [];
  render();

  const totalSpin = Math.PI * 2 * (4.5 + Math.random() * 3.5);
  const startAngle = W.angle;
  const duration = isCpuSpin ? 950 : 1650;
  const t0 = performance.now();

  function frame(now) {
    const p = Math.min(1, (now - t0) / duration);
    const ease = 1 - Math.pow(1 - p, 3.5);
    W.angle = (startAngle + totalSpin * ease) % (Math.PI * 2);
    drawWheelCanvas();
    if (p < 1) {
      requestAnimationFrame(frame);
    } else {
      W.spinning = false;
      const slice = (Math.PI * 2) / clubs.length;
      const norm = ((Math.PI * 2) - (W.angle % (Math.PI * 2))) % (Math.PI * 2);
      const idx = Math.floor(norm / slice) % clubs.length;
      const landedClub = clubs[idx];
      W.selectedClub = landedClub;

      let clubPool = G.pool.filter(x => x.c === landedClub && canPickPlayer(t, x));
      if (!clubPool.length) {
        clubPool = G.pool.filter(x => x.c === landedClub && !G.taken.has(x.id));
      }
      const shuffled = clubPool.slice().sort(() => Math.random() - 0.5);
      W.offeredPlayers = shuffled.slice(0, 2);

      if (NET.connected) {
        sendNetMsg({
          type: "WHEEL_RESULT",
          club: W.selectedClub,
          offeredIds: W.offeredPlayers.map(x => x.id),
          jokers: W.jokers
        });
      }
      render();

      if (isCpuSpin && W.offeredPlayers.length) {
        cpuTimer = setTimeout(() => {
          if (!G || G.k >= G.order.length) return;
          const bestOfOffered = [...W.offeredPlayers].sort((a, b) => b.r - a.r)[0];
          if (bestOfOffered) pick(bestOfOffered.id, true);
        }, 620);
      }
    }
  }
  requestAnimationFrame(frame);
}

// 9. DRAFT EKRANI RENDER
function squadCard(t, i) {
  const isTurn = G && G.order[G.k] === i && G.k < G.order.length;
  const counts = posCountsOf(t);
  const remB = G && G.m.budget ? Math.max(0, G.m.budget - t.spent) : 0;
  return `
    <div class="sq ${t.me ? "you" : ""}">
      <div class="sq-head">
        <h3 class="club-cell">${renderTeamIdentityBadge(t, 20)} <span>${t.name}</span> ${isTurn ? '<span style="color:var(--pri-bright)">· SIRADA</span>' : ""}</h3>
        <span>
          <b>${t.picks.length}/${ROUNDS}</b>
          ${G && G.m.budget ? ` · Kalan: <b style="color:var(--pri-bright)">${remB} M€</b>` : ""}
        </span>
      </div>
      <div class="sq-quotas">
        ${POSITIONS.map(k => `
          <span class="q-pill ${counts[k] >= FORMATION_QUOTA[k] ? 'full' : ''}">
            ${POS_SHORT[k]}: ${counts[k]}/${FORMATION_QUOTA[k]}+
          </span>
        `).join("")}
        <span class="q-pill">Yedek: 3</span>
      </div>
      <ol>
        ${t.picks.map((p, idx) => `
          <li>
            <span class="club-cell">
              ${posTag(p.pos)}
              ${clubLogo(p.c, 16)}
              <b>${p.n}</b>
              <span class="muted" style="font-size:.77rem">${p.c}</span>
            </span>
            <span class="muted" style="font-size:.77rem">
              ${G && G.m.budget ? `${cost(p)} M€` : (idx < 11 ? "İlk 11" : "Yedek")}
            </span>
          </li>
        `).join("") || '<li class="muted">Henüz seçim yok</li>'}
      </ol>
    </div>
  `;
}

function listHtml() {
  const q = F.q.toLowerCase();
  const t = G.teams[G.order[G.k]];
  const myTurn = isMyTurnNow();

  const l = G.pool
    .filter(p =>
      !G.taken.has(p.id) &&
      (!F.lg || p.lg === F.lg) &&
      (!F.c || p.c === F.c) &&
      (!F.p || p.pos === F.p) &&
      p.n.toLowerCase().includes(q)
    )
    .sort((a, b) => a.n.localeCompare(b.n, "tr"))
    .slice(0, 110);

  return l.map(p => {
    const okPos = canTeamPickPos(t, p.pos, G.pool, G.taken);
    const bStatus = checkBudgetStatus(t, p);
    const isWheelMode = G.m.id === "wheel";
    const wheelAllowed = !isWheelMode || (W.selectedClub === p.c && W.offeredPlayers.some(x => x.id === p.id));

    let btnClass = "pri sm";
    let btnLabel = "Seç";
    let disabledAttr = "";

    if (!myTurn) {
      btnLabel = "Bekleniyor";
      disabledAttr = "disabled";
    } else if (isWheelMode && !wheelAllowed) {
      btnLabel = "Çarktan Seçilir";
      disabledAttr = "disabled";
    } else if (!okPos) {
      btnLabel = "Zorunlu Mevki";
      btnClass = "warn-btn sm";
    } else if (G.m.budget && !bStatus.ok) {
      btnLabel = "Bütçe Uyarısı";
      btnClass = "warn-btn sm";
    }

    return `
      <tr>
        <td><b>${p.n}</b></td>
        <td>${posTag(p.pos)}</td>
        <td><span class="lg-tag">${p.lg}</span></td>
        <td><span class="club-cell">${clubLogo(p.c, 18)} <span class="muted">${p.c}</span></span></td>
        ${G.m.budget ? `<td class="n"><b>${cost(p)} M€</b></td>` : ""}
        <td class="n">
          <button class="${btnClass}" ${disabledAttr} onclick="pick(${p.id})">${btnLabel}</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="6" class="muted">Filtreye uygun oyuncu kalmadı.</td></tr>`;
}

function renderWheelSection(t) {
  if (G.m.id !== "wheel") return "";
  const myTurn = isMyTurnNow();
  return `
    <div class="wheel-box">
      <div class="wheel-stage">
        <div class="wheel-pointer"></div>
        <canvas id="wheel-cv" width="230" height="230"></canvas>
      </div>
      <div class="wheel-result-card">
        <div class="panel-head" style="margin-bottom:8px">
          <div>
            <h2>Takım & Oyuncu Çarkı (${t.name})</h2>
            <p class="muted" style="margin:2px 0 0;font-size:.82rem">
              Hem sen hem de rakip çarkı çevirerek gelen kulübün oyuncusunu kadrosuna katar. (Kalan Tekrar Çevirme Hakkın: <b>${W.jokers}</b>)
            </p>
          </div>
          <div class="row">
            <button class="pri" ${!myTurn || W.spinning || W.selectedClub ? "disabled" : ""} onclick="spinClubWheel(false, false)">
              Çarkı Çevir
            </button>
            ${W.selectedClub && W.jokers > 0 && myTurn ? `
              <button class="sm" ${W.spinning ? "disabled" : ""} onclick="spinClubWheel(true, false)">
                Tekrar Çevir (${W.jokers})
              </button>
            ` : ""}
          </div>
        </div>

        ${W.selectedClub ? `
          <div style="background:var(--raised);padding:12px;border-radius:8px;border:1px solid var(--pri-bright)">
            <div class="row" style="justify-content:space-between;margin-bottom:8px">
              <span class="club-cell" style="font-size:1.05rem;font-weight:700">
                ${clubLogo(W.selectedClub, 24)} Çıkan Kulüp: <span style="color:var(--pri-bright)">${W.selectedClub}</span>
              </span>
              <span class="lg-tag">${CLUB_TO_LEAGUE[W.selectedClub] || ""}</span>
            </div>
            <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px">
              ${W.offeredPlayers.map((p, idx) => `
                <div class="row" style="justify-content:space-between;background:var(--card);padding:8px 10px;border-radius:7px;border:1px solid var(--border)">
                  <span>${posTag(p.pos)} <b>${p.n}</b> <small class="muted">(${idx === 0 ? "Ana" : "Alternatif"})</small></span>
                  <button class="pri sm" ${myTurn ? "" : "disabled"} onclick="pick(${p.id})">Seç</button>
                </div>
              `).join("")}
            </div>
          </div>
        ` : `
          <div class="muted" style="padding:8px 0">
            ${W.spinning ? `${t.name} için çark dönüyor...` : (myTurn ? "Sıradaki oyuncunu belirlemek için Çarkı Çevir butonuna tıkla." : `${t.name} çarkı çeviriyor...`)}
          </div>
        `}
      </div>
    </div>
  `;
}

function renderDraft() {
  const t = G.teams[G.order[G.k]];
  const myTurn = isMyTurnNow();
  const activeLeagues = [...new Set(G.pool.map(p => p.lg))];
  const cl = [...new Set(G.pool.filter(p => !F.lg || p.lg === F.lg).map(p => p.c))];
  const counts = posCountsOf(t);
  const remB = G.m.budget ? Math.max(0, G.m.budget - t.spent) : 0;
  const minNextReserve = G.m.budget ? calcMinReserveAfterPick(t, { id: -999, pos: "MID" }) : 0;

  app.innerHTML = hdr() + renderOnlineModal() + `
    <div class="turn ${myTurn ? "me" : ""}">
      <div>
        <b>${myTurn ? `Sıra Sende (${t.name})` : `${t.name} seçim yapıyor…`}</b>
        <div class="muted" style="font-size:.82rem;margin-top:2px">
          ${G.m.name} · Seçim ${G.k + 1} / ${G.order.length}
          ${G.m.budget ? ` · Kalan Bütçe: <b style="color:var(--pri-bright)">${remB} M€</b> (Kalan slotlar için min rezerv: ${minNextReserve} M€)` : ""}
        </div>
      </div>
      <div class="row">
        <button class="sm" ${G.history.length ? "" : "disabled"} onclick="undoLastPick()">Geri Al</button>
        <button class="sm" ${myTurn && G.m.id !== 'wheel' ? "" : "disabled"} onclick="pickRandomForMe()">Rastgele Seç</button>
        <button class="sm pri" ${NET.connected && NET.role === "guest" ? "disabled" : ""} onclick="autoCompleteDraft()">Otomatik Tamamla</button>
      </div>
    </div>

    ${G.budgetWarning ? `<div class="err">${G.budgetWarning}</div>` : ""}

    ${renderWheelSection(t)}

    <div class="draft">
      <div>
        <div class="pos-tabs">
          <button class="pos-tab" aria-pressed="${F.p === ''}" onclick="F.p='';renderDraft()">Tümü</button>
          ${POSITIONS.map(k => {
            const rem = Math.max(0, FORMATION_QUOTA[k] - counts[k]);
            return `
              <button class="pos-tab" aria-pressed="${F.p === k}" onclick="F.p='${k}';renderDraft()">
                ${POS_LABEL[k]} (${POS_SHORT[k]} · Eksik: ${rem})
              </button>
            `;
          }).join("")}
        </div>

        <div class="row" style="margin-bottom:10px">
          <input id="q" placeholder="Oyuncu ara..." value="${F.q}" oninput="F.q=this.value;$('#tb').innerHTML=listHtml()" style="flex:1;min-width:150px">
          ${activeLeagues.length > 1 ? `
            <select onchange="F.lg=this.value;F.c='';renderDraft()">
              <option value="">Tüm Ligler (${activeLeagues.length})</option>
              ${activeLeagues.map(lg => `<option value="${lg}" ${F.lg === lg ? "selected" : ""}>${lg}</option>`).join("")}
            </select>
          ` : ""}
          <select onchange="F.c=this.value;$('#tb').innerHTML=listHtml()">
            <option value="">Tüm Kulüpler (${cl.length})</option>
            ${cl.map(c => `<option value="${c}" ${F.c === c ? "selected" : ""}>${c}</option>`).join("")}
          </select>
        </div>

        <div class="scroll">
          <table>
            <thead>
              <tr>
                <th>Oyuncu</th>
                <th>Mevki</th>
                <th>Lig</th>
                <th>Kulüp</th>
                ${G.m.budget ? '<th class="n">Piyasa Değeri</th>' : ""}
                <th class="n">İşlem</th>
              </tr>
            </thead>
            <tbody id="tb">${listHtml()}</tbody>
          </table>
        </div>
      </div>

      <div>
        ${G.teams.map((tm, idx) => squadCard(tm, idx)).join("")}
      </div>
    </div>
  `;

  if (G.m.id === "wheel") {
    drawWheelCanvas();
  }
  const q = $("#q");
  if (q && F.q && myTurn) {
    q.focus();
    q.setSelectionRange(99, 99);
  }
}

// 9.5 DRAFT BİTİMİ: TAKIM İSMİ VE LOGO / ARMA BELİRLEME EKRANI
function syncTeamIdentity(teamIdx) {
  if (!NET.connected || !G || !G.teams[teamIdx]) return;
  const tm = G.teams[teamIdx];
  sendNetMsg({
    type: "IDENTITY_SYNC",
    teamIdx,
    name: tm.name,
    customIdentity: tm.customIdentity,
    identityDone: tm.identityDone
  });
}

function updateTeamIdentityName(teamIdx, newName) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.name = newName.trim() || `${teamIdx + 1}. Oyuncu`;
  const previewBadge = $("#id-preview-badge");
  if (previewBadge) previewBadge.innerHTML = renderTeamIdentityBadge(tm, 64);
  syncTeamIdentity(teamIdx);
}

function setIdentityType(teamIdx, type) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.customIdentity.type = type;
  syncTeamIdentity(teamIdx);
  render();
}

function setIdentityShape(teamIdx, shapeId) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.customIdentity.type = "custom";
  tm.customIdentity.shape = shapeId;
  syncTeamIdentity(teamIdx);
  render();
}

function setIdentityColor(teamIdx, which, val) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.customIdentity.type = "custom";
  tm.customIdentity[which] = val;
  syncTeamIdentity(teamIdx);
  render();
}

function setIdentityClubLogo(teamIdx, clubName) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.customIdentity.type = "club";
  tm.customIdentity.club = clubName;
  syncTeamIdentity(teamIdx);
  render();
}

function confirmTeamIdentity(teamIdx) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  tm.identityDone = true;
  syncTeamIdentity(teamIdx);

  if (G.m.career) {
    S.view = "result";
    return render();
  }

  if (NET.connected) {
    S.view = "result";
    return render();
  }

  const nextHumanIdx = G.teams.findIndex((x, idx) => idx > teamIdx && x.isHuman && !x.identityDone);
  if (nextHumanIdx >= 0) {
    ID_EDIT.teamIdx = nextHumanIdx;
    render();
  } else {
    S.view = "result";
    render();
  }
}

function renderIdentityScreen() {
  const activeIdx = NET.connected ? NET.myTeamIdx : (ID_EDIT.teamIdx < G.teams.length ? ID_EDIT.teamIdx : 0);
  const tm = G.teams[activeIdx];
  const cid = tm.customIdentity;
  const clubsToShow = CLUBS.filter(c => !ID_EDIT.lgFilter || CLUB_TO_LEAGUE[c] === ID_EDIT.lgFilter);

  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">Draft Tamamlandı · Takım Kimliği & Logo</span>
      <h1>Takımının İsmini ve Logosunu Oluştur</h1>
      <p>Kadro seçimleri tamamlandı. Sahaya çıkmadan önce takımının adını belirle; ister renk ve arma şekli seçerek kendi özel kulüp armanı tasarla, ister gerçek kulüp logolarından birini seç.</p>
    </section>

    <div class="panel">
      <div class="panel-head">
        <div class="row">
          <h2>Takım Kimliği Düzenleyici</h2>
          ${!NET.connected && G.teams.length > 1 ? G.teams.map((tItem, idx) => `
            <button class="sm ${activeIdx === idx ? 'pri' : ''}" onclick="ID_EDIT.teamIdx=${idx};render()">
              ${renderTeamIdentityBadge(tItem, 16)} ${tItem.name}
            </button>
          `).join("") : ""}
        </div>
        <button class="pri" onclick="confirmTeamIdentity(${activeIdx})">
          Kaydet & Kadro Dizilişine Geç →
        </button>
      </div>

      <div class="lineup-editor" style="align-items:start">
        <div style="background:var(--raised);padding:18px;border-radius:var(--r);border:1px solid var(--border)">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:18px;padding-bottom:14px;border-bottom:1px solid var(--border)">
            <div id="id-preview-badge">${renderTeamIdentityBadge(tm, 64)}</div>
            <div style="flex:1">
              <div class="muted" style="font-size:.76rem;text-transform:uppercase;letter-spacing:.06em">Takım Adı</div>
              <input value="${tm.name}" oninput="updateTeamIdentityName(${activeIdx}, this.value)" placeholder="Takım adını yaz..." style="width:100%;font-size:1.15rem;font-weight:700;margin-top:4px">
            </div>
          </div>

          <div class="pos-tabs" style="margin-bottom:14px">
            <button class="pos-tab" aria-pressed="${cid.type === 'custom'}" onclick="setIdentityType(${activeIdx}, 'custom')">
              Özel Arma & Renk Tasarla
            </button>
            <button class="pos-tab" aria-pressed="${cid.type === 'club'}" onclick="setIdentityType(${activeIdx}, 'club')">
              Gerçek Kulüp Logosu Seç (${CLUBS.length})
            </button>
          </div>

          ${cid.type === "custom" ? `
            <div>
              <label style="display:block;font-weight:600;font-size:.84rem;margin-bottom:8px">1. Arma Şekli Seç:</label>
              <div class="row" style="margin-bottom:16px">
                ${CUSTOM_SHAPES.map(sh => `
                  <button class="sm ${cid.shape === sh.id ? 'pri' : ''}" onclick="setIdentityShape(${activeIdx}, '${sh.id}')">
                    ${sh.name}
                  </button>
                `).join("")}
              </div>

              <label style="display:block;font-weight:600;font-size:.84rem;margin-bottom:8px">2. Kulüp Renklerini Seç:</label>
              <div class="row" style="gap:20px">
                <label class="row">
                  <span>Ana Renk:</span>
                  <input type="color" value="${cid.c1}" oninput="setIdentityColor(${activeIdx}, 'c1', this.value)" style="width:46px;height:36px;padding:2px;cursor:pointer">
                </label>
                <label class="row">
                  <span>İkincil / Çerçeve Rengi:</span>
                  <input type="color" value="${cid.c2}" oninput="setIdentityColor(${activeIdx}, 'c2', this.value)" style="width:46px;height:36px;cursor:pointer;padding:2px">
                </label>
              </div>
            </div>
          ` : `
            <div>
              <div class="row" style="justify-content:space-between;margin-bottom:10px">
                <label style="font-weight:600;font-size:.84rem">Gerçek Takım Logosu Seç:</label>
                <select onchange="ID_EDIT.lgFilter=this.value;render()">
                  <option value="">Tüm Ligler (${CLUBS.length})</option>
                  ${LEAGUES.map(lg => `<option value="${lg}" ${ID_EDIT.lgFilter === lg ? "selected" : ""}>${lg}</option>`).join("")}
                </select>
              </div>
              <div class="chips" style="max-height:260px;overflow:auto;padding:4px">
                ${clubsToShow.map(c => {
                  const esc = c.replace(/'/g, "\\'");
                  return `
                    <button class="chip" aria-pressed="${cid.club === c}" onclick="setIdentityClubLogo(${activeIdx}, '${esc}')">
                      ${clubLogo(c, 22)} <span>${c}</span>
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          `}
        </div>

        <div>
          <h3 style="margin-bottom:10px">Takım Önizlemesi & Kadro Özeti</h3>
          ${squadCard(tm, -1)}
          <div class="row" style="justify-content:flex-end;margin-top:12px">
            <button class="pri" onclick="confirmTeamIdentity(${activeIdx})">
              Takım Kimliğini Onayla & Dizilişe Geç →
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 10. SABİT SLOTLU İLK 11 & 3 YEDEK KADRO DİZİLİŞİ YÖNETİMİ (MEVKİ DIŞI -10 REYTİNG CEZASI & SAKATLIK KORUMASI)
function getFormationDef(formName) {
  return FORMATIONS[formName] || FORMATIONS["4-3-3"];
}

function isPlayerInjuredInCareer(playerId) {
  return !!(G && G.m.career && LG && LG.injuries && LG.injuries[playerId] > 0);
}

function getEffectivePlayerRating(p, slotPos) {
  if (!p) return 70;
  const baseR = p.r || 75;
  if (slotPos && p.pos !== slotPos) {
    return Math.max(40, baseR - 10);
  }
  return baseR;
}

function getStarterSlotPosMap(formName = "4-3-3") {
  const fDef = getFormationDef(formName);
  const slotPositions = [];
  fDef.rows.forEach(rDef => {
    for (let i = 0; i < rDef.count; i++) slotPositions.push(rDef.pos);
  });
  return slotPositions;
}

function enforceHealthyStartersForTeam(t) {
  if (!G || !G.m.career || !LG || !LG.injuries || !t || !t.me) return;
  if (!t.starters || !t.bench) return;
  for (let i = 0; i < t.starters.length; i++) {
    const sp = t.starters[i];
    if (sp && LG.injuries[sp.id] > 0) {
      const slotPositions = getStarterSlotPosMap(t.formation || "4-3-3");
      const targetPos = slotPositions[i] || sp.pos;
      let bIdx = t.bench.findIndex(bp => bp && !LG.injuries[bp.id] && bp.pos === targetPos);
      if (bIdx < 0) {
        bIdx = t.bench.findIndex(bp => bp && !LG.injuries[bp.id]);
      }
      if (bIdx >= 0) {
        const healthySub = t.bench[bIdx];
        t.starters[i] = healthySub;
        t.bench[bIdx] = sp;
      }
    }
  }
}

function ensureTeamLineup(t) {
  if (t.starters && t.starters.length === STARTERS_COUNT && t.bench && t.bench.length === t.picks.length - STARTERS_COUNT) {
    if (t.me) enforceHealthyStartersForTeam(t);
    return;
  }
  autoBuildLineupForTeam(t, t.formation || "4-3-3");
}

function autoBuildLineupForTeam(t, formName = "4-3-3") {
  t.formation = formName;
  const fDef = getFormationDef(formName);
  const checkInj = !!(G && G.m.career && LG && LG.injuries && t.me);
  const sorted = [...t.picks].sort((a, b) => {
    if (checkInj) {
      const injA = LG.injuries[a.id] > 0 ? 1 : 0;
      const injB = LG.injuries[b.id] > 0 ? 1 : 0;
      if (injA !== injB) return injA - injB;
    }
    return b.r - a.r;
  });
  const used = new Set();

  const rowBuckets = fDef.rows.map(rDef => {
    const matched = sorted
      .filter(p => p.pos === rDef.pos && !used.has(p.id) && (!checkInj || !LG.injuries[p.id]))
      .slice(0, rDef.count);
    matched.forEach(p => used.add(p.id));
    return { count: rDef.count, players: matched };
  });

  rowBuckets.forEach(b => {
    while (b.players.length < b.count) {
      let nextP = sorted.find(p => !used.has(p.id) && (!checkInj || !LG.injuries[p.id]));
      if (!nextP) nextP = sorted.find(p => !used.has(p.id));
      if (!nextP) break;
      used.add(nextP.id);
      b.players.push(nextP);
    }
  });

  t.starters = rowBuckets.flatMap(b => b.players);
  t.bench = t.picks.filter(p => !used.has(p.id));
}

function broadcastMyLineup(teamIdx, ready = false) {
  if (!NET.connected || !G || !G.teams[teamIdx]) return;
  const tm = G.teams[teamIdx];
  NET.readyMap[teamIdx] = ready;
  sendNetMsg({
    type: "LINEUP_SYNC",
    teamIdx,
    name: tm.name,
    customIdentity: tm.customIdentity,
    formation: tm.formation,
    starterIds: tm.starters.map(p => p.id),
    benchIds: tm.bench.map(p => p.id),
    ready
  });
}

function markMyLineupReady() {
  const myIdx = NET.connected ? NET.myTeamIdx : SWAP.teamIdx;
  broadcastMyLineup(myIdx, true);
  render();
}

function selectSwapPlayer(teamIdx, playerId) {
  if (NET.connected && teamIdx !== NET.myTeamIdx) return;
  SWAP.err = "";
  const t = G.teams[teamIdx];
  ensureTeamLineup(t);

  // Eğer ilk tıklanan oyuncu yedekte ve sakatsa doğrudan uyarı ver
  if (SWAP.teamIdx !== teamIdx || SWAP.selectedId == null) {
    if (t.me && isPlayerInjuredInCareer(playerId)) {
      const pObj = P[playerId] || t.picks.find(x => x.id === playerId);
      const wLeft = LG.injuries[playerId];
      SWAP.err = `Sakatlık Engeli: ${pObj ? pObj.n : "Oyuncu"} şu an sakat (${wLeft} hafta kaldı). İyileşene kadar İlk 11'e alınamaz!`;
      return render();
    }
    SWAP = { teamIdx, selectedId: playerId, err: "" };
    return render();
  }
  if (SWAP.selectedId === playerId) {
    SWAP.selectedId = null;
    return render();
  }

  const id1 = SWAP.selectedId;
  const id2 = playerId;

  const sIdx1 = t.starters.findIndex(p => p.id === id1);
  const sIdx2 = t.starters.findIndex(p => p.id === id2);
  const bIdx1 = t.bench.findIndex(p => p.id === id1);
  const bIdx2 = t.bench.findIndex(p => p.id === id2);

  // Sakat oyuncunun yedekten İlk 11'e alınmasını engelle
  if (t.me && ((sIdx1 >= 0 && bIdx2 >= 0 && isPlayerInjuredInCareer(id2)) || (bIdx1 >= 0 && sIdx2 >= 0 && isPlayerInjuredInCareer(id1)))) {
    const injId = isPlayerInjuredInCareer(id1) ? id1 : id2;
    const pObj = P[injId] || t.picks.find(x => x.id === injId);
    const wLeft = LG.injuries[injId];
    SWAP.selectedId = null;
    SWAP.err = `Sakatlık Engeli: ${pObj ? pObj.n : "Oyuncu"} sakat olduğu için (${wLeft} hafta) İlk 11 kadrosuna koyulamaz!`;
    return render();
  }

  if (sIdx1 >= 0 && bIdx2 >= 0) {
    const temp = t.starters[sIdx1];
    t.starters[sIdx1] = t.bench[bIdx2];
    t.bench[bIdx2] = temp;
  } else if (bIdx1 >= 0 && sIdx2 >= 0) {
    const temp = t.bench[bIdx1];
    t.bench[bIdx1] = t.starters[sIdx2];
    t.starters[sIdx2] = temp;
  } else if (sIdx1 >= 0 && sIdx2 >= 0) {
    const temp = t.starters[sIdx1];
    t.starters[sIdx1] = t.starters[sIdx2];
    t.starters[sIdx2] = temp;
  } else if (bIdx1 >= 0 && bIdx2 >= 0) {
    const temp = t.bench[bIdx1];
    t.bench[bIdx1] = t.bench[bIdx2];
    t.bench[bIdx2] = temp;
  }

  SWAP.selectedId = null;
  broadcastMyLineup(teamIdx, NET.readyMap[teamIdx]);
  render();
}

function changeFormation(teamIdx, formName) {
  if (NET.connected && teamIdx !== NET.myTeamIdx) return;
  const t = G.teams[teamIdx];
  autoBuildLineupForTeam(t, formName);
  SWAP.selectedId = null;
  SWAP.err = "";
  broadcastMyLineup(teamIdx, NET.readyMap[teamIdx]);
  render();
}

function buildPitchRowsForTeam(t) {
  ensureTeamLineup(t);
  const fDef = getFormationDef(t.formation || "4-3-3");
  let cursor = 0;
  return fDef.rows.map(rDef => {
    const slice = t.starters.slice(cursor, cursor + rDef.count);
    cursor += rDef.count;
    return {
      label: rDef.label,
      pos: rDef.pos,
      count: rDef.count,
      players: slice
    };
  });
}

function groupStartersForPitch(t) {
  const rows = buildPitchRowsForTeam(t);
  const L = { GK: [], DEF: [], MID: [], FWD: [] };
  rows.forEach(r => {
    r.players.forEach(p => {
      const effR = getEffectivePlayerRating(p, r.pos);
      L[r.pos].push({ ...p, effR, outOfPos: p.pos !== r.pos, slotPos: r.pos });
    });
  });
  return L;
}

function renderResult() {
  G.teams.forEach(ensureTeamLineup);
  const activeTeamIdx = NET.connected ? NET.myTeamIdx : (SWAP.teamIdx < G.teams.length ? SWAP.teamIdx : 0);
  const myTeam = G.teams[activeTeamIdx];
  const pitchRows = buildPitchRowsForTeam(myTeam);
  const slotPositions = getStarterSlotPosMap(myTeam.formation || "4-3-3");
  const isTourney = G.teams.length > 2;
  const isCareer = !!G.m.career;
  const injuredMap = (LG && LG.injuries) ? LG.injuries : {};

  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">Kadro & Diziliş</span>
      <h1>İlk 11 ve 3 Yedek Oyuncunu Belirle</h1>
      <p>Sahadaki veya yedek kulübesindeki herhangi iki oyuncuya tıklayarak yerlerini değiştirebilirsin. <b>Not:</b> Kendi mevkisi dışında oynatılan oyuncular maç motorunda <b>-10 reyting cezası</b> alır.</p>
      <div class="row" style="margin-top:14px">
        ${NET.connected ? `
          <button class="${NET.readyMap[NET.myTeamIdx] ? 'gold' : 'pri'}" onclick="markMyLineupReady()">
            ${NET.readyMap[NET.myTeamIdx] ? "Kadron Hazır" : "Kadromu Onayla"}
          </button>
        ` : ""}
        ${isCareer ? `
          <button class="pri" onclick="goMatchDirect()">
            ${LG ? "Premier Lig Merkezine Dön →" : "Lig Seçimine Geç (Premier Lig) →"}
          </button>
        ` : `
          <button class="pri" ${NET.connected && NET.role === "guest" ? "disabled" : ""} onclick="goMatchDirect()">
            ${isTourney ? "Turnuva Eşleşmelerine Geç" : "90 Dk Maç Simülasyonuna Geç"}
          </button>
        `}
        <button onclick="S.view='identity';render()">Takım İsmi & Logosunu Düzenle</button>
        <button onclick="startDraft()">Yeni Draft</button>
      </div>
    </section>

    ${SWAP.err ? `<div class="err">${SWAP.err}</div>` : ""}

    <div class="panel">
      <div class="panel-head">
        <div class="row">
          <h2 class="club-cell">${renderTeamIdentityBadge(myTeam, 26)} <span>Taktik Tahtası (${myTeam.name})</span></h2>
          ${!NET.connected && G.teams.length > 1 ? G.teams.map((tm, idx) => `
            <button class="sm ${activeTeamIdx === idx ? 'pri' : ''}" onclick="SWAP.teamIdx=${idx};SWAP.selectedId=null;SWAP.err='';render()">
              ${renderTeamIdentityBadge(tm, 16)} ${tm.name}
            </button>
          `).join("") : ""}
        </div>
        <div class="row">
          <label>Diziliş:
            <select onchange="changeFormation(${activeTeamIdx}, this.value)">
              ${Object.keys(FORMATIONS).map(fn => `<option value="${fn}" ${myTeam.formation === fn ? "selected" : ""}>${fn}</option>`).join("")}
            </select>
          </label>
        </div>
      </div>

      <div class="lineup-editor">
        <div>
          <h3 style="margin-bottom:8px;color:var(--pri-bright)">Ana Kadro (İlk 11 · ${myTeam.formation})</h3>
          <div class="pitch">
            ${pitchRows.map(row => `
              <div class="pl-row">
                ${row.players.map(p => {
                  const isSel = SWAP.selectedId === p.id;
                  const injW = injuredMap[p.id] || 0;
                  const outOfPos = p.pos !== row.pos;
                  return `
                    <div class="pl clickable-pl ${isSel ? 'selected-swap' : ''} ${(injW || outOfPos) ? 'red-carded' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})" title="${p.n} (${row.label}${outOfPos ? ' · Mevki Dışı -10 Rtg' : ''})">
                      <div class="row" style="gap:3px">${clubLogo(p.c, 16)} ${posTag(p.pos)}</div>
                      <small>${p.n.split(" ").pop()}</small>
                      ${injW ? `<div class="pl-events"><span class="ev-badge ev-red">SAKAT (${injW}H)</span></div>` : (outOfPos ? `<div class="pl-events"><span class="ev-badge ev-red" title="Mevki Dışı: -10 Reyting">${POS_SHORT[row.pos]} (-10)</span></div>` : "")}
                    </div>
                  `;
                }).join("")}
              </div>
            `).join("")}
          </div>
        </div>

        <div>
          <h3 style="margin-bottom:8px;color:var(--t-elite)">Yedek Kulübesi (3 Oyuncu)</h3>
          <div class="bench-list">
            ${myTeam.bench.map(p => {
              const isSel = SWAP.selectedId === p.id;
              const injW = injuredMap[p.id] || 0;
              return `
                <div class="bench-item ${isSel ? 'selected-swap' : ''}" style="${injW ? 'opacity:0.65;cursor:not-allowed' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})">
                  <span class="club-cell">
                    ${posTag(p.pos)}
                    ${clubLogo(p.c, 20)}
                    <b>${p.n}</b>
                    <span class="muted" style="font-size:.8rem">(${p.c})</span>
                    ${injW ? `<span class="pos-badge pos-FWD">Sakat (${injW}H · Oynayamaz)</span>` : ""}
                  </span>
                  <button class="sm ${isSel ? 'gold' : ''}" ${injW ? "disabled" : ""}>${injW ? "Sakat" : (isSel ? "Seçildi" : "Değiştir")}</button>
                </div>
              `;
            }).join("")}
          </div>

          <h3 style="margin:18px 0 8px">İlk 11 Listesi</h3>
          <div class="sq" style="margin-bottom:0">
            <ol>
              ${myTeam.starters.map((p, sIdx) => {
                const isSel = SWAP.selectedId === p.id;
                const injW = injuredMap[p.id] || 0;
                const reqPos = slotPositions[sIdx] || p.pos;
                const outOfPos = p.pos !== reqPos;
                return `
                  <li style="cursor:pointer;${isSel ? 'color:var(--t-elite);font-weight:700' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})">
                    <span class="club-cell">
                      ${posTag(p.pos)}
                      ${clubLogo(p.c, 16)}
                      <b>${p.n}</b>
                      <span class="muted">${p.c}</span>
                      ${outOfPos ? `<span class="pos-badge pos-FWD" title="Bu slot ${POS_SHORT[reqPos]} mevkisidir. Oyuncu -10 reyting cezası alır.">Mevki Dışı (-10)</span>` : ""}
                    </span>
                    <span class="muted" style="font-size:.77rem">${injW ? `Sakat (${injW}H)` : (isSel ? "Seçildi" : `${POS_SHORT[reqPos]} Slotu`)}</span>
                  </li>
                `;
              }).join("")}
            </ol>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 10.5 TEK OYUNCULU LİG KARİYER MODU (PREMIER LİG 20 TAKIM, 19 HAFTA FİKSTÜR, GOL/ASİST KRALLIĞI VE 12 DETAYLI OLAY)
function renderCareerLeagueSelector() {
  const careerLeagues = [
    { id: "Premier Lig", name: "Premier Lig", country: "İngiltere", teams: 20, active: true, note: "20 Takım Hazır · Oynanabilir" },
    { id: "La Liga", name: "La Liga", country: "İspanya", teams: 3, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Serie A", name: "Serie A", country: "İtalya", teams: 5, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Bundesliga", name: "Bundesliga", country: "Almanya", teams: 4, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Ligue 1", name: "Ligue 1", country: "Fransa", teams: 2, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Trendyol Süper Lig", name: "Trendyol Süper Lig", country: "Türkiye", teams: 4, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Liga Portugal", name: "Liga Portugal", country: "Portekiz", teams: 3, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" },
    { id: "Eredivisie", name: "Eredivisie", country: "Hollanda", teams: 3, active: false, note: "Sonra Gelecek (Yeterli Takım Yok)" }
  ];

  const userTeam = G.teams[0];
  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">Lig Kariyer Modu · Lig Seçimi</span>
      <h1 class="club-cell">${renderTeamIdentityBadge(userTeam, 42)} <span>${userTeam.name} ile Hangi Lige Katılacaksın?</span></h1>
      <p>Bütçeli kadron hazır. Şimdi mücadele edeceğin 20 takımlı ligi seçerek 19 haftalık şampiyonluk maratonunu başlat.</p>
    </section>

    <div class="panel">
      <h2>Katılınacak Ligi Seç</h2>
      <div class="league-grid" style="margin-top:12px">
        ${careerLeagues.map(cl => `
          <div class="league-card" aria-pressed="${cl.active}" style="${cl.active ? '' : 'opacity:0.55;cursor:not-allowed'}" onclick="${cl.active ? "initCareerLeague('Premier Lig')" : ""}">
            <div class="lg-title">
              <span>${cl.name}</span>
              <span style="font-size:.74rem;color:${cl.active ? 'var(--pri-bright)' : 'var(--t-elite)'}">${cl.active ? "Aktif" : "Yakında"}</span>
            </div>
            <div class="lg-meta">${cl.country} · ${cl.note}</div>
            <div style="margin-top:8px">
              ${cl.active
                ? `<button class="sm pri" style="width:100%" onclick="event.stopPropagation();initCareerLeague('Premier Lig')">Premier Lig'e Katıl →</button>`
                : `<button class="sm" disabled style="width:100%">Sonra Gelecek</button>`}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function buildClubTeamObject(clubName) {
  const clubPlayers = [...P.filter(p => p.c === clubName)].sort((a, b) => b.r - a.r);
  const usedIds = new Set();
  const picks = [];

  // İlk 11 için her mevkiden en yüksek reytingli oyuncuları seç (4-3-3: 1 GK, 4 DEF, 3 MID, 3 FWD)
  const quotaOrder = [["GK", 1], ["DEF", 4], ["MID", 3], ["FWD", 3]];
  for (const [posKey, cnt] of quotaOrder) {
    const matching = clubPlayers.filter(p => p.pos === posKey && !usedIds.has(p.id)).slice(0, cnt);
    matching.forEach(p => {
      usedIds.add(p.id);
      picks.push({ ...p });
    });
  }

  // Kalan yedek slotlarını (14'e kadar) en yüksek reytingli kalan oyuncularla tamamla
  for (const p of clubPlayers) {
    if (picks.length >= 14) break;
    if (!usedIds.has(p.id)) {
      usedIds.add(p.id);
      picks.push({ ...p });
    }
  }
  while (picks.length < 14 && clubPlayers.length) {
    picks.push({ ...clubPlayers[picks.length % clubPlayers.length] });
  }

  const tm = {
    name: clubName,
    me: 0,
    isHuman: false,
    identityDone: true,
    customIdentity: { type: "club", club: clubName, shape: "shield", c1: "#166534", c2: "#eab308" },
    picks,
    starters: null,
    bench: null,
    formation: "4-3-3",
    spent: 0
  };
  ensureTeamLineup(tm);
  return tm;
}

function generateRoundRobinSchedule(numTeams) {
  const teams = Array.from({ length: numTeams }, (_, i) => i);
  const rounds = [];
  const n = numTeams;
  for (let r = 0; r < n - 1; r++) {
    const matches = [];
    for (let i = 0; i < n / 2; i++) {
      const a = teams[i];
      const b = teams[n - 1 - i];
      if ((r + i) % 2 === 0) matches.push({ a, b, done: false, sc: null });
      else matches.push({ a: b, b: a, done: false, sc: null });
    }
    rounds.push(matches);
    const last = teams.pop();
    teams.splice(1, 0, last);
  }
  return rounds;
}

function initCareerLeague(leagueName = "Premier Lig") {
  const userTeam = G.teams[0];
  ensureTeamLineup(userTeam);

  const plClubs = CLUBS.filter(c => CLUB_TO_LEAGUE[c] === "Premier Lig");
  const aiClubs = plClubs.filter(c => c !== userTeam.name).slice(0, 19);
  const aiTeams = aiClubs.map(buildClubTeamObject);

  G.teams = [userTeam, ...aiTeams];

  const standings = G.teams.map((tm, idx) => ({
    teamIdx: idx,
    played: 0,
    w: 0,
    d: 0,
    l: 0,
    gf: 0,
    ga: 0,
    pts: 0
  }));

  LG = {
    leagueName,
    week: 1,
    maxWeeks: 19,
    viewWeek: 1,
    schedule: generateRoundRobinSchedule(20),
    standings,
    playerStats: {},
    injuries: {},
    moraleMod: 0,
    clubFunds: Math.max(15, (G.m.budget || 360) - userTeam.spent),
    sponsorName: "Yok",
    lastResult: null,
    usedEventIds: new Set(),
    usedNewsIds: new Set(),
    activeEvent: null,
    activeNews: null,
    eventHistory: [],
    newsFeed: [
      {
        week: 1,
        source: "Premier Lig Medya Merkezi",
        teamIdx: 0,
        title: `2026-27 Premier Lig Sezonu Başlıyor!`,
        body: `20 takımlı maratonda ${userTeam.name} yeni kurulan kadrosuyla şampiyonluk yarışına katılıyor. Otoriteler sezonun ilk haftalarındaki puan kayıplarının zirve yarışında belirleyici olacağını vurguluyor.`
      }
    ],
    tab: "standings"
  };

  S.view = "league_hub";
  render();
}

function recordLeagueGoalsAndAssists(teamIdx, sObj, goalsCount) {
  const tm = G.teams[teamIdx];
  if (!tm) return;
  for (let g = 0; g < goalsCount; g++) {
    const scorer = pickGoalscorer(sObj.L);
    const assister = Math.random() < 0.78 ? pickAssister(sObj.L, scorer) : null;
    if (scorer) {
      const k = `${teamIdx}_${scorer.n}`;
      if (!LG.playerStats[k]) LG.playerStats[k] = { name: scorer.n, teamIdx, teamName: tm.name, club: scorer.c, goals: 0, assists: 0 };
      LG.playerStats[k].goals++;
    }
    if (assister) {
      const kA = `${teamIdx}_${assister.n}`;
      if (!LG.playerStats[kA]) LG.playerStats[kA] = { name: assister.n, teamIdx, teamName: tm.name, club: assister.c, goals: 0, assists: 0 };
      LG.playerStats[kA].assists++;
    }
  }
}

function updateLeagueTableForMatch(aIdx, bIdx, goalsA, goalsB) {
  const stA = LG.standings.find(x => x.teamIdx === aIdx);
  const stB = LG.standings.find(x => x.teamIdx === bIdx);
  if (!stA || !stB) return;

  stA.played++;
  stB.played++;
  stA.gf += goalsA;
  stA.ga += goalsB;
  stB.gf += goalsB;
  stB.ga += goalsA;

  if (goalsA > goalsB) {
    stA.w++;
    stA.pts += 3;
    stB.l++;
  } else if (goalsB > goalsA) {
    stB.w++;
    stB.pts += 3;
    stA.l++;
  } else {
    stA.d++;
    stB.d++;
    stA.pts += 1;
    stB.pts += 1;
  }
}

function simulateBackgroundLeagueMatch(mObj) {
  if (mObj.done) return;
  const tA = G.teams[mObj.a];
  const tB = G.teams[mObj.b];
  const sA = side(tA);
  const sB = side(tB);

  const rawDiff = sA.avg - sB.avg;
  const compDiff = Math.max(-1.25, Math.min(1.25, rawDiff * 0.35));
  const swing = (Math.random() - 0.5) * 3.6;
  const adv = compDiff + swing;

  let gA = 1, gB = 1;
  if (Math.abs(adv) < 0.52) {
    const draws = [[1, 1], [0, 0], [2, 2], [1, 1]];
    const d = draws[(Math.random() * draws.length) | 0];
    gA = d[0]; gB = d[1];
  } else {
    const winScores = [[2, 1], [1, 0], [2, 0], [3, 1], [3, 2], [2, 1]];
    const w = winScores[(Math.random() * winScores.length) | 0];
    if (adv >= 0) { gA = w[0]; gB = w[1]; }
    else { gA = w[1]; gB = w[0]; }
  }

  mObj.done = true;
  mObj.sc = [gA, gB];
  updateLeagueTableForMatch(mObj.a, mObj.b, gA, gB);
  recordLeagueGoalsAndAssists(mObj.a, sA, gA);
  recordLeagueGoalsAndAssists(mObj.b, sB, gB);
}

// ARKA PLANDA OTOMATİK TETİKLENEN KULÜP OLAYLARI HAVUZU
function buildCareerEventsCatalog() {
  const userTeam = G.teams[0];
  ensureTeamLineup(userTeam);
  const healthyStarters = userTeam.starters.filter(p => !LG.injuries[p.id]);
  const starPlayer = [...healthyStarters].sort((a, b) => b.r - a.r)[0] || userTeam.starters[0] || userTeam.picks[0];
  const randomStarter = healthyStarters[(Math.random() * healthyStarters.length) | 0] || starPlayer;
  const benchSub = userTeam.bench.find(b => b.pos === randomStarter.pos && !LG.injuries[b.id]) || userTeam.bench[0];
  const lastRes = LG.lastResult || { userGoals: 0, oppGoals: 2, oppName: "Rakip" };

  return [
    {
      id: "sponsor",
      tag: "Sponsorluk Masası · Ticari Anlaşma",
      title: "Etihad Airways, Qatar Airways ve Emirates'ten Forma Sponsorluğu Teklifi!",
      desc: `Kulübünün Premier Lig'deki yükselişi sonrası 3 dev havayolu şirketi göğüs sponsorluğu için teklif sundu: <b>Qatar Airways</b> en yüksek nakit paketi verirken yoğun tanıtım turu istiyor; <b>Etihad Airways</b> dengeli bütçe ve tesis desteği sunuyor; <b>Emirates</b> ise şampiyonluk primli prestij paketi öneriyor.`,
      choices: [
        {
          label: "Qatar Airways ile İmzala (+32 M€ Nakit · Tanıtım Turu: -%2 Kondisyon)",
          effect: () => {
            LG.clubFunds += 32;
            LG.sponsorName = "Qatar Airways";
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Qatar Airways ana sponsor oldu! Kasaya +32 M€ girdi, ticari çekimler nedeniyle kondisyonda -%2 yorgunluk oluştu.`;
          }
        },
        {
          label: "Etihad Airways ile İmzala (+24 M€ Nakit · Tesis Desteği: +%2 Performans)",
          effect: () => {
            LG.clubFunds += 24;
            LG.sponsorName = "Etihad Airways";
            LG.moraleMod += 2;
            return `Etihad Airways ile anlaşma imzalandı! Kasaya +24 M€ eklendi ve yenilenen antrenman tesisleriyle performans +%2 arttı.`;
          }
        },
        {
          label: "Fly Emirates Prestij Paketi (+18 M€ Nakit · +%4 Takım Morali)",
          effect: () => {
            LG.clubFunds += 18;
            LG.sponsorName = "Fly Emirates";
            LG.moraleMod += 4;
            return `Fly Emirates sponsorluğu açıklandı (+18 M€)! Kulüp prestiji ve oyuncu morali +%4 yükseldi.`;
          }
        }
      ]
    },
    {
      id: "bad_pitch",
      tag: "Stadyum & Saha Krizi",
      title: "Stadyum Zemini Çok Kötü Durumda!",
      desc: `Yoğun yağış ve maç trafiği sonrasında stadyum zemini balçık ve çukurlarla doldu. Pas oyununuz aksıyor ve sakatlık riski arttı. Zemin için nasıl bir adım atacaksın?`,
      choices: [
        {
          label: "Hibrit Çim Zemini Acilen Yenilet (-12 M€ · +%3 Saha Performansı)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 12);
            LG.moraleMod += 3;
            return `12 M€ harcanarak stadyuma birinci sınıf hibrit çim serildi! Takımın pas temposu +%3 yükseldi.`;
          }
        },
        {
          label: "Kısmi Bakım Yaptır ve Uzun Top Taktiğine Geç (Ücretsiz · -%2 Performans)",
          effect: () => {
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Bozuk zeminde teknik oyundan vazgeçildi; takım performansı -%2 etkilendi.`;
          }
        }
      ]
    },
    {
      id: "media_backlash",
      tag: "Spor Gündemi · Mağlubiyet Yankıları",
      title: "Mağlubiyet Sonrası Gazetelerde Sert Eleştiri!",
      desc: `${lastRes.oppName} karşısında alınan <b>${lastRes.userGoals}-${lastRes.oppGoals}</b>'lik yenilgi sonrası spor basını takımın taktik disiplinini ağır şekilde eleştirdi. Soyunma odasında moraller bozuk.`,
      choices: [
        {
          label: "Tesisleri Dış Dünyaya Kapat & Takımı Kenetle (+%4 Odaklanma)",
          effect: () => {
            LG.moraleMod += 4;
            return `Takım dış eleştirilere kulaklarını tıkayıp kenetlendi (+%4 performans).`;
          }
        },
        {
          label: "Oyunculara Tam Destek Ver (+%3 Oyuncu Sadakati)",
          effect: () => {
            LG.moraleMod += 3;
            return `Oyuncuları koruyan tavrın soyunma odasında güven yarattı (+%3 performans).`;
          }
        },
        {
          label: "Disiplin Cezası Kes (+6 M€ Kasa · -%4 Moral)",
          effect: () => {
            LG.clubFunds += 6;
            LG.moraleMod = Math.max(-15, LG.moraleMod - 4);
            return `Oyunculara 6 M€ para cezası kesildi ancak soyunma odasında huzursuzluk oluştu (-%4 performans).`;
          }
        }
      ]
    },
    {
      id: "injury",
      tag: "Sağlık Raporu · Sakatlık Krizi",
      title: `${randomStarter.n} Antrenmanda Sakatlandı!`,
      desc: `İlk 11 oyuncun <b>${randomStarter.n}</b> arka adalesinden sakatlık geçirdi. Sağlık ekibi normal şartlarda 3 hafta sahalardan uzak kalacağını bildirdi.`,
      choices: [
        {
          label: "Özel Klinik Tedavisi Uygula (-8 M€ · 1 Hafta Sonra Döner)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 8);
            LG.injuries[randomStarter.id] = 1;
            if (benchSub) {
              const sIdx = userTeam.starters.findIndex(x => x.id === randomStarter.id);
              const bIdx = userTeam.bench.findIndex(x => x.id === benchSub.id);
              if (sIdx >= 0 && bIdx >= 0) {
                userTeam.starters[sIdx] = benchSub;
                userTeam.bench[bIdx] = randomStarter;
              }
            }
            return `${randomStarter.n} özel kliniğe gönderildi (1 hafta dinlenecek, yerine ${benchSub ? benchSub.n : 'yedek oyuncu'} İlk 11'e alındı).`;
          }
        },
        {
          label: "Standart Dinlendirme (3 Hafta Yok · Yedek Oyuncu Oynar)",
          effect: () => {
            LG.injuries[randomStarter.id] = 3;
            if (benchSub) {
              const sIdx = userTeam.starters.findIndex(x => x.id === randomStarter.id);
              const bIdx = userTeam.bench.findIndex(x => x.id === benchSub.id);
              if (sIdx >= 0 && bIdx >= 0) {
                userTeam.starters[sIdx] = benchSub;
                userTeam.bench[bIdx] = randomStarter;
              }
            }
            return `${randomStarter.n} 3 hafta kadro dışı kaldı; ${benchSub ? benchSub.n : 'yedek oyuncu'} İlk 11'e geçti.`;
          }
        }
      ]
    },
    {
      id: "takeover",
      tag: "Yönetim Kurulu · Yatırım Teklifi",
      title: "Kulübe Uluslararası Yatırım Fonu Ortaklık Teklifi!",
      desc: `Küresel bir yatırım fonu <b>${userTeam.name}</b> hisselerinin %35'ini satın alarak kulübe sermaye girişi sağlamak istiyor.`,
      choices: [
        {
          label: "Ortaklığı Onayla (+35 M€ Kulüp Kasası · +%3 Şampiyonluk Primi)",
          effect: () => {
            LG.clubFunds += 35;
            LG.moraleMod += 3;
            return `Yatırım fonu ortaklığı onaylandı! Kulüp kasasına +35 M€ eklendi ve primlerle takım morali +%3 arttı.`;
          }
        },
        {
          label: "Teklifi Reddet & Kulüp Yapısını Koru (+%5 Taraftar Desteği)",
          effect: () => {
            LG.moraleMod += 5;
            return `Taraftarlar bağımsızlık kararını coşkuyla karşıladı! Saha içi performans +%5 yükseldi.`;
          }
        }
      ]
    },
    {
      id: "transfer_bid",
      tag: "Transfer Masası · Astronomik Teklif",
      title: `Avrupa Devinden ${starPlayer.n} İçin Astronomik Teklif!`,
      desc: `Avrupa'nın dev kulüplerinden biri yıldız oyuncun <b>${starPlayer.n}</b> için kulüp yönetimine reddedilmesi güç bir teklif sundu. Oyuncunun kafası karışık.`,
      choices: [
        {
          label: "Teklifi Reddet & Maaş İyileştirmesi Yap (-10 M€ · +1 Reyting)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 10);
            starPlayer.r = Math.min(99, starPlayer.r + 1);
            return `${starPlayer.n} takımda kaldı! Yeni sözleşme sonrası oyuncunun genel reytingi ${starPlayer.r} seviyesine yükseldi.`;
          }
        },
        {
          label: "Oyuncuyla Görüşüp Sezon Sonuna Söz Al (Maliyetsiz · +%2 Uyum)",
          effect: () => {
            LG.moraleMod += 2;
            return `${starPlayer.n} sezon sonuna kadar şampiyonluk yarışına odaklanmaya ikna edildi (+%2 uyum).`;
          }
        }
      ]
    },
    {
      id: "var_referee",
      tag: "Hakem & VAR Gündemi · PGMOL",
      title: "Tartışmalı VAR Kararları ve Kritik Hakem Ataması!",
      desc: `Son haftalardaki tartışmalı VAR kararları gündemdeyken bu haftaki kritik maça da en çok tartışılan hakem triosu atandı.`,
      choices: [
        {
          label: "Resmi Kulüp Bildirisi Yayınla ve VAR Kayıtlarını İste (+%4 Tribün Baskısı)",
          effect: () => {
            LG.moraleMod += 4;
            return `Resmi bildiri sonrası tribünler kenetlendi (+%4 saha içi baskı avantajı).`;
          }
        },
        {
          label: "Takıma 'Sadece Oyuna Odaklanın' Talimatı Ver (+%2 Taktik Disiplin)",
          effect: () => {
            LG.moraleMod += 2;
            return `Oyuncular kart görmemek ve oyuna odaklanmak konusunda uyarıldı (+%2 disiplin).`;
          }
        }
      ]
    },
    {
      id: "dressing_room_crisis",
      tag: "Soyunma Odası · Disiplin Krizi",
      title: `${starPlayer.n} Sabah Antrenmanına Geç Kaldı!`,
      desc: `Yıldız oyuncun <b>${starPlayer.n}</b> kritik hafta öncesinde sabah idmanına izinsiz şekilde geç katıldı. Takım arkadaşları vereceğin kararı bekliyor.`,
      choices: [
        {
          label: "Para Cezası Kes ve Disiplini Koru (+5 M€ Kasa · +%3 Disiplin)",
          effect: () => {
            LG.clubFunds += 5;
            LG.moraleMod += 3;
            return `Tavizsiz disiplinin takımda saygı uyandırdı (+5 M€ ceza geliri, +%3 takım disiplini).`;
          }
        },
        {
          label: "Olayı Kapat ve Yıldız Oyuncuyu Uyarmakla Yetin (-%3 Takım İçi Adalet)",
          effect: () => {
            LG.moraleMod = Math.max(-15, LG.moraleMod - 3);
            return `Yıldıza ayrıcalık tanıman diğer oyuncuların tepkisini çekti (-%3 takım uyumu).`;
          }
        }
      ]
    },
    {
      id: "fan_protest",
      tag: "Tribün Gündemi · Bilet Fiyatları",
      title: "Taraftarlardan Bilet Fiyatları Tepkisi!",
      desc: `Kale arkası taraftar grupları, artan bilet fiyatları nedeniyle bu haftaki maçın ilk 15 dakikasında protesto hazırlığında.`,
      choices: [
        {
          label: "Bilet Fiyatlarında %25 İndirim Yap (-6 M€ · +%5 Tribün Desteği)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 6);
            LG.moraleMod += 5;
            return `Bilet indirimi sonrası stadyum tamamen doldu! Tribün desteğiyle takım performansı +%5 arttı.`;
          }
        },
        {
          label: "Fiyatları Sabit Tut (Gelir Kaybı Yok · -%3 Tribün Desteği)",
          effect: () => {
            LG.moraleMod = Math.max(-15, LG.moraleMod - 3);
            return `Tribünlerdeki protesto nedeniyle iç saha atmosferi soğudu (-%3 performans).`;
          }
        }
      ]
    },
    {
      id: "youth_boost",
      tag: "Antrenman Raporu · Bireysel Gelişim",
      title: `${randomStarter.n} Antrenmanlarda Parlıyor!`,
      desc: `Teknik heyet, <b>${randomStarter.n}</b> isimli oyuncunun son haftalarda ekstra şut ve kondisyon çalışarak formunun zirvesine çıktığını raporladı.`,
      choices: [
        {
          label: "Özel Prim Ver & Sorumluluğunu Artır (+1 Kalıcı Reyting)",
          effect: () => {
            randomStarter.r = Math.min(99, randomStarter.r + 1);
            return `${randomStarter.n} ödüllendirildi ve kalıcı reytingi ${randomStarter.r} oldu!`;
          }
        },
        {
          label: "Tüm Takıma Moral Yemeği Düzenle (+%3 Takım Performansı)",
          effect: () => {
            LG.moraleMod += 3;
            return `Takım içi kolej havası güçlendi, genel saha performansı +%3 arttı!`;
          }
        }
      ]
    },
    {
      id: "friendly_cup",
      tag: "Uluslararası Davet · Özel Gösteri Maçı",
      title: "Riyad Sezon İçi Dostluk Kupası Daveti!",
      desc: `Uluslararası organizatörler, fikstür arasındaki boşlukta kulübünü özel bir gösteri maçına davet etti. Katılırsan ciddi bir yayın geliri elde edeceksin ancak yolculuk takımı yorabilir.`,
      choices: [
        {
          label: "Daveti Kabul Et (+16 M€ Gelir · Yolculuk Yorgunluğu: -%2 Form)",
          effect: () => {
            LG.clubFunds += 16;
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Özel dostluk maçından kasaya +16 M€ girdi; seyahat temposu nedeniyle formda -%2 düşüş yaşandı.`;
          }
        },
        {
          label: "Teklifi Reddet & Tesislerde Taktik Kamp Yap (+%3 Saha İçi Uyum)",
          effect: () => {
            LG.moraleMod += 3;
            return `Seyahat teklifi reddedildi; tesislerde yapılan özel taktik çalışmayla takım formu +%3 yükseldi.`;
          }
        }
      ]
    },
    {
      id: "analytics_lab",
      tag: "Tesis Yatırımı · Futbol Teknolojisi",
      title: "Yapay Zeka Destekli Performans & Analiz Laboratuvarı!",
      desc: `Sportif direktörün, kulüp tesislerine oyuncu yük takibi ve rakip duran top analizi yapan yeni nesil bir veri laboratuvarı kurulmasını önerdi.`,
      choices: [
        {
          label: "Laboratuvarı Kur (-10 M€ · +%4 Kalıcı Taktik & Kondisyon Katkısı)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 10);
            LG.moraleMod += 4;
            return `10 M€ yatırımla veri analiz laboratuvarı kuruldu! Takımın taktik hazırlığı +%4 güçlendi.`;
          }
        },
        {
          label: "Bütçeyi Koru & Mevcut Analiz Ekibiyle Devam Et (+%1 Odak)",
          effect: () => {
            LG.moraleMod += 1;
            return `Bütçe korundu, mevcut teknik analiz ekibiyle çalışmalara devam edildi (+%1 odak).`;
          }
        }
      ]
    },
    {
      id: "bonus_revision",
      tag: "Soyunma Odası · Prim Görüşmesi",
      title: "Takım Kaptanlarından Şampiyonluk Primi Talebi!",
      desc: `Takım kaptanları, zorlu Premier Lig fikstürü öncesinde yönetimden maç başı ve şampiyonluk primlerinin güncellenmesini talep etti.`,
      choices: [
        {
          label: "Prim Paketi Güncellemesini Onayla (-8 M€ · +%5 Şampiyonluk Hırsı)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 8);
            LG.moraleMod += 5;
            return `8 M€'luk yeni prim paketi açıklandı! Soyunma odasında şampiyonluk hırsı +%5 arttı.`;
          }
        },
        {
          label: "Sezon Sonuna Kadar Mevcut Sözleşmeleri Koru (-%2 Moral)",
          effect: () => {
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Prim talebi sezon sonuna ertelendi; bazı oyuncularda -%2 motivasyon kaybı oluştu.`;
          }
        }
      ]
    },
    {
      id: "stadium_vip",
      tag: "Kulüp Ekonomisi · Stadyum Projesi",
      title: "VIP Loca ve Maç Günü Ticari Alan Yenilemesi!",
      desc: `Pazarlama departmanı, stadyumun batı tribününe yeni kurumsal VIP localar ekleyerek maç günü gelirlerini artırma projesini sundu.`,
      choices: [
        {
          label: "Kurumsal VIP Locaları Aç (+15 M€ Net Gelir)",
          effect: () => {
            LG.clubFunds += 15;
            return `Yeni VIP locaların satışından kulüp kasasına +15 M€ sıcak para girdi!`;
          }
        },
        {
          label: "Alanı Gençlik & Taraftar Tribününe Ayır (+%4 İç Saha Atmosferi)",
          effect: () => {
            LG.moraleMod += 4;
            return `Tribünler ateşli taraftar gruplarına tahsis edildi! İç saha atmosferi +%4 güçlendi.`;
          }
        }
      ]
    },
    {
      id: "recovery_protocol",
      tag: "Sağlık Kurulu · Yoğun Fikstür",
      title: "Kriyoterapi ve Rejenerasyon Merkezi Yatırımı!",
      desc: `Sağlık ekibi, üst üste oynanan sert Premier Lig maçları sonrası kas yorgunluğunu azaltacak yeni rejenerasyon üniteleri talep ediyor.`,
      choices: [
        {
          label: "Rejenerasyon Ünitelerini Al (-6 M€ · Sakatlık Süreleri -1 Hafta & +%3 Form)",
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 6);
            LG.moraleMod += 3;
            for (const pid of Object.keys(LG.injuries)) {
              LG.injuries[pid] = Math.max(0, LG.injuries[pid] - 1);
              if (LG.injuries[pid] <= 0) delete LG.injuries[pid];
            }
            return `Rejenerasyon merkezi devreye girdi! Oyuncu kondisyonu +%3 arttı ve mevcut sakatlık süreleri kısaldı.`;
          }
        },
        {
          label: "Mevcut Fizyoterapi Programıyla Devam Et (Maliyetsiz)",
          effect: () => {
            return `Sağlık ekibi standart dinlenme protokolüyle haftayı tamamladı.`;
          }
        }
      ]
    },
    {
      id: "saudi_mega_offer",
      tag: "Transfer Masası · Suudi Pro Ligi Teklifi",
      title: `Suudi Arabistan Kulübünden ${starPlayer.n} İçin 85 M€'luk Teklif!`,
      desc: `Suudi Pro Ligi devlerinden biri, takımının en önemli yıldızı <b>${starPlayer.n}</b>'a yıllık 40 M€ maaş ve kulübüne dev bir bonservis paketi sundu. Oyuncunun menajeri yönetimle acil görüşme talep etti.`,
      choices: [
        {
          label: `Kapıyı Kapat & Yıldız Oyuncuya Sadakat Primi Ver (-9 M€ · +1 Kalıcı Reyting)`,
          effect: () => {
            LG.clubFunds = Math.max(0, LG.clubFunds - 9);
            starPlayer.r = Math.min(99, starPlayer.r + 1);
            return `${starPlayer.n} astronomik teklifi reddedip takımda kaldı! Özel sadakat primiyle reytingi ${starPlayer.r} seviyesine yükseldi.`;
          }
        },
        {
          label: `Menajeriyle Sert Konuş ve Sözleşmesini Hatırlat (Maliyetsiz · -%2 Moral)`,
          effect: () => {
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Transfer teklifi reddedildi ancak ${starPlayer.n} cephesinde kısa süreli kırgınlık yaşandı (-%2 moral).`;
          }
        }
      ]
    },
    {
      id: "docuseries_deal",
      tag: "Medya & Yayın · Kulüp Belgeseli",
      title: "Dijital Platformdan 'Soyunma Odası' Belgeseli Teklifi!",
      desc: `Küresel bir dijital yayın platformu, sezon boyunca soyunma odası ve antrenman tesislerinde kamera bulundurarak kulübün şampiyonluk yürüyüşünü belgesel yapmak için yüksek bütçeli teklif sundu.`,
      choices: [
        {
          label: "Anlaşmayı İmzala (+20 M€ Yayın Geliri · Kameralar Nedeniyle -%2 Odak)",
          effect: () => {
            LG.clubFunds += 20;
            LG.moraleMod = Math.max(-15, LG.moraleMod - 2);
            return `Belgesel anlaşmasıyla kasaya +20 M€ girdi; soyunma odasındaki kameralar konsantrasyonu -%2 etkiledi.`;
          }
        },
        {
          label: "Soyunma Odası Mahremiyetini Koru & Reddet (+%3 Takım İçi Güven)",
          effect: () => {
            LG.moraleMod += 3;
            return `Kameraları soyunma odasına sokmadın; oyuncuların sana olan güveni ve saha içi uyumu +%3 arttı.`;
          }
        }
      ]
    }
  ];
}

// LİGDEKİ RAKİP YILDIZLAR (+/- REYTİNG ETKİLİ) VE DİĞER LİGLERDEN DÜNYA FUTBOLU HABER MOTORU
function modifyRivalPlayerRating(teamObj, playerName, delta) {
  if (!teamObj) return null;
  let target = (teamObj.starters || []).find(p => p.n === playerName) || (teamObj.picks || []).find(p => p.n === playerName);
  if (!target && teamObj.starters && teamObj.starters.length) {
    target = [...teamObj.starters].sort((a, b) => b.r - a.r)[0];
  }
  if (!target) return null;
  const oldR = target.r;
  target.r = Math.max(68, Math.min(97, target.r + delta));
  const sign = delta > 0 ? `+${delta}` : `${delta}`;
  return { name: target.n, oldR, newR: target.r, badge: `${target.n}: ${sign} Reyting (${oldR} → ${target.r})`, isPositive: delta > 0 };
}

const PREMIER_STAR_NEWS_TEMPLATES = [
  {
    id: "mci_haaland_fire",
    club: "Manchester City",
    player: "Erling Haaland",
    delta: 2,
    source: "Sky Sports · Yıldız Raporu",
    title: "Erling Haaland Özel Bitiricilik İdmanlarıyla Durdurulamıyor!",
    body: "Manchester City'nin Norveçli gol makinesi Erling Haaland, tesislerde yaptığı ekstra şut ve fiziksel güçlendirme çalışmalarının ardından formunun zirvesine çıktı."
  },
  {
    id: "mci_psr_foden",
    club: "Manchester City",
    player: "Phil Foden",
    delta: -2,
    source: "The Athletic · Etihad Kulisleri",
    title: "Manchester City'de Finansal Denetim Gerginliği ve Form Düşüşü!",
    body: "Premier Lig mali kurulunun incelemesi kulüpte soğuk rüzgarlar estirirken, Phil Foden son haftalardaki yoğun maç temposu nedeniyle fiziksel düşüş yaşıyor."
  },
  {
    id: "ars_saka_boost",
    club: "Arsenal",
    player: "Bukayo Saka",
    delta: 2,
    source: "BBC Sport · Kuzey Londra",
    title: "Bukayo Saka Kanatta Fırtına Gibi Esiyor!",
    body: "Arsenal'in yıldız kanat oyuncusu Bukayo Saka, son haftalardaki hücum istatistikleriyle ligin en tehlikeli hücumcuları arasında ilk sıraya yerleşti."
  },
  {
    id: "ars_odegaard_dip",
    club: "Arsenal",
    player: "Martin Odegaard",
    delta: -2,
    source: "Evening Standard · Sağlık Raporu",
    title: "Arsenal'de Martin Odegaard Hafif Sakatlıkla Boğuşuyor!",
    body: "Kuzey Londra ekibinin kaptanı Martin Odegaard'ın bileğindeki ağrılar nedeniyle hafta içi antrenmanların bir bölümünü kaçırdığı ve maç ritminde düşüş yaşadığı bildirildi."
  },
  {
    id: "liv_isak_surge",
    club: "Liverpool",
    player: "Alexander Isak",
    delta: 2,
    source: "Liverpool Echo · Anfield Gündemi",
    title: "Alexander Isak Anfield'ı Coşturmaya Devam Ediyor!",
    body: "Liverpool hücum hattının en keskin silahı Alexander Isak, ceza sahası içindeki soğukkanlı bitiriciliğiyle teknik heyetten tam not aldı."
  },
  {
    id: "liv_wirtz_pressure",
    club: "Liverpool",
    player: "Florian Wirtz",
    delta: -1,
    source: "Sky Sports · Analiz",
    title: "Florian Wirtz Üzerinde Sert Savunma Markajı!",
    body: "Premier Lig savunmalarının sert ikili mücadeleleri karşısında yıpranan Florian Wirtz, son haftalarda oyun kurmakta beklenenden fazla zorlanıyor."
  },
  {
    id: "che_palmer_cold",
    club: "Chelsea",
    player: "Cole Palmer",
    delta: -2,
    source: "The Telegraph · Londra Gündemi",
    title: "Stamford Bridge'de Cole Palmer ve Rotasyon Tartışması!",
    body: "Chelsea'nin kalabalık kadrosunda sistem değişiklikleri nedeniyle istediği topları alamayan Cole Palmer'ın antrenmanlarda moralsiz olduğu gözlemlendi."
  },
  {
    id: "che_joaopedro_hot",
    club: "Chelsea",
    player: "Joao Pedro",
    delta: 2,
    source: "Sky Sports · Maç Analizi",
    title: "Chelsea Hücumunda Joao Pedro Rüzgarı!",
    body: "Mavilerin Brezilyalı yıldızı Joao Pedro, bağlantı oyunu ve ceza sahası koşularıyla takımın en formda gol ayağı haline geldi."
  },
  {
    id: "mun_bruno_crisis",
    club: "Manchester United",
    player: "Bruno Fernandes",
    delta: -2,
    source: "Manchester Evening News",
    title: "Old Trafford'da Kaptan Bruno Fernandes'e Medya Eleştirisi!",
    body: "Manchester United'ın dalgalı performansı sonrası İngiliz basını kaptan Bruno Fernandes'in saha içi beden dilini ağır sözlerle eleştirdi; oyuncunun morali bozuk."
  },
  {
    id: "mun_cunha_form",
    club: "Manchester United",
    player: "Matheus Cunha",
    delta: 2,
    source: "The Guardian · Carrington Raporu",
    title: "Matheus Cunha Carrington Tesislerinde Vites Yükseltti!",
    body: "Manchester United'ın hücum yıldızı Matheus Cunha, hızı ve uzaktan şutlarıyla kırmızı-şeytanların hücumdaki en büyük kozu oldu."
  },
  {
    id: "tot_vandeven_wall",
    club: "Tottenham",
    player: "Micky van de Ven",
    delta: 2,
    source: "Football London",
    title: "Micky van de Ven Hız Rekorları Kırıyor!",
    body: "Tottenham'ın Hollandalı stoperi Micky van de Ven, savunma arkasına atılan toplardaki sprint hızıyla Premier Lig forvetlerine geçit vermiyor."
  },
  {
    id: "tot_kudus_slump",
    club: "Tottenham",
    player: "Mohamed Kudus",
    delta: -2,
    source: "Evening Standard",
    title: "Tottenham'da Mohamed Kudus Taktik Disiplin Uyarısı Aldı!",
    body: "Son maçlarda top kaybı oranı yükselen Mohamed Kudus, teknik heyet tarafından bireysel oyun yerine pas oyununa dönmesi konusunda uyarıldı."
  },
  {
    id: "new_tonali_boost",
    club: "Newcastle United",
    player: "Sandro Tonali",
    delta: 2,
    source: "Chronicle Live",
    title: "St. James' Park'ta Sandro Tonali Orta Sahayı Domine Ediyor!",
    body: "Newcastle United'ın İtalyan yıldızı Sandro Tonali, yüksek koşu mesafesi ve kilit paslarıyla takımını sırtlamaya devam ediyor."
  },
  {
    id: "avl_jackson_boost",
    club: "Aston Villa",
    player: "Nicolas Jackson",
    delta: 2,
    source: "Birmingham Mail",
    title: "Villa Park'ta Nicolas Jackson Savunma Arkasını Yıpratıyor!",
    body: "Aston Villa'nın hızlı forveti Nicolas Jackson, yakaladığı form grafiğiyle teknik heyetin yüzünü güldürdü."
  },
  {
    id: "cry_wharton_star",
    club: "Crystal Palace",
    player: "Adam Wharton",
    delta: 2,
    source: "South London Press",
    title: "Avrupa Devleri Adam Wharton'ın Peşinde!",
    body: "Crystal Palace'ın genç orta saha beyni Adam Wharton, kusursuz pas vizyonuyla haftanın en çok konuşulan yeteneklerinden biri oldu."
  },
  {
    id: "nfo_gibbswhite_dip",
    club: "Nottingham Forest",
    player: "Morgan Gibbs-White",
    delta: -1,
    source: "Nottingham Post",
    title: "Nottingham Forest'ta Morgan Gibbs-White Yorgunluk Sinyalleri Veriyor!",
    body: "Sezon başından beri neredeyse her maçta 90 dakika sahada kalan Morgan Gibbs-White'ın kondisyon değerlerinde düşüş tespit edildi."
  }
];

const WORLD_FOOTBALL_NEWS_TEMPLATES = [
  {
    id: "world_ronaldo_1000",
    club: "Al-Nassr",
    source: "Sky Sports · Suudi Pro Ligi",
    title: "Tarihi An: Cristiano Ronaldo 1000. Golüne Ulaştı ve Futbolu Bırakıyor!",
    body: "Suudi Pro Ligi'nde Al-Nassr formasıyla kariyerinin 1000. resmi golünü kaydederek futbol tarihinde kırılması imkânsız bir rekora imza atan Cristiano Ronaldo, maç sonunda yaptığı duygusal açıklamayla sezon sonunda futbolu bırakacağını resmen duyurdu!"
  },
  {
    id: "world_messi_miami",
    club: "Inter Miami",
    source: "The Guardian · MLS (ABD)",
    title: "Miami'de Lionel Messi ve Eski Barcelona Tayfasından Resital!",
    body: "MLS'te Inter Miami forması giyen Lionel Messi, Luis Suarez, Jordi Alba ve Sergio Busquets'in ceza sahası çevresinde tek dokunuşlarla ördüğü muazzam pas trafiği sonrası gelen jeneriklik gol dünya basınında haftanın olayı oldu."
  },
  {
    id: "world_osimhen_saudi",
    club: "Al-Hilal",
    source: "Sky Sports · Transfer Bombası",
    title: "Victor Osimhen 80 Milyon Euro'ya Suudi Arabistan'a Satıldı!",
    body: "Avrupa ve Türk futbolunda yılın transfer bombası patladı! Nijeryalı süper golcü Victor Osimhen, Suudi Arabistan temsilcisi Al-Hilal'in sunduğu 80 M€ peşin bonservis ve yıllık 45 M€ net maaş teklifinin ardından Suudi Pro Ligi'ne transfer oldu."
  },
  {
    id: "world_transfer_hijack",
    club: "Real Madrid",
    source: "Marca · Transfer Çalımı",
    title: "Yılın Transfer Çalımı: Sağlık Kontrolüne Giderken Uçağın Rotası Değişti!",
    body: "Avrupa transfer piyasasında inanılmaz bir son dakika operasyonu yaşandı! Ezeli rakibiyle her konuda anlaşan ve sağlık kontrolü için havalimanına inen yıldız oyuncunun özel uçağı, gelen son dakika teklifiyle rotasını değiştirip rakip kulübe imza attı."
  },
  {
    id: "world_davies_contract",
    club: "Bayern Munchen",
    source: "The Guardian · Sözleşme Krizi",
    title: "Alphonso Davies ve Yönetim Arasında Maaş Krizi Büyüyor!",
    body: "Bayern Münih'te sözleşme yenileme görüşmelerinde astronomik maaş talebinde bulunan Alphonso Davies ile yönetim arasındaki ipler gerildi. Yeni kontrata imza atmaması halinde yıldız oyuncunun kadro dışı bırakılma ihtimali konuşuluyor."
  },
  {
    id: "world_loan_revenge",
    club: "Monaco",
    source: "Sky Sports · Avrupa Kupaları",
    title: "Kiralık Yıldızın İntikamı: Bonservisini Elinde Bulunduran Takıma Gol Attı, Sevinmedi!",
    body: "Sezon başında kadroda düşünülmediği için kiralık gönderilen genç yetenek, kupa eşleşmesinde bonservisini elinde bulunduran kendi kulübüne 89. dakikada attığı golle takımını tur atlattı ve gol sonrası ellerini kaldırarak sevinmedi."
  },
  {
    id: "world_superclasico_libertadores",
    club: "Bournemouth",
    source: "Marca · Copa Libertadores",
    title: "Arjantin'de Nefes Kesen Süper Klasiko: 4 Kırmızı Kart, 90+8'de Gelen Galibiyet!",
    body: "Güney Amerika'da River Plate ile Boca Juniors arasında oynanan tarihi Süper Klasiko'da saha karıştı! 4 kırmızı kartın çıktığı ve 90+8. dakikada gelen golle çözülen dev derbideki unutulmaz atmosfer dünya gündemine oturdu."
  },
  {
    id: "world_ucl_12players_error",
    club: "Bayer Leverkusen",
    source: "Sky Sports · Taktik & Teknoloji",
    title: "Şampiyonlar Ligi'nde İnanılmaz Hata: Oyuncu Değişikliği Kağıdı Yanlış Verildi!",
    body: "Devler Ligi gecesinde dördüncü hakeme teslim edilen oyuncu değişikliği kağıdındaki numara hatası nedeniyle sahada 20 saniye boyunca 12 kişi kalan ekip, rakibin itirazı üzerine UEFA disiplin talimatı gereği hükmen mağlubiyet tehlikesiyle karşı karşıya kaldı."
  },
  {
    id: "world_dortmund_yellow_wall",
    club: "Borussia Dortmund",
    source: "The Guardian · Taraftar & Atmosfer",
    title: "Sarı Duvar'dan Görsel Şölen: Dortmund Tribünlerinden Tarihi Koreografi!",
    body: "Signal Iduna Park'ta Devler Ligi gecesinde ünlü 'Sarı Duvar' tribününün hazırladığı dev 3 boyutlu koreografi izleyenleri büyüledi ve sosyal medyada milyonlarca kez paylaşıldı."
  },
  {
    id: "world_fifa_offside_wenger",
    club: "Inter",
    source: "Marca · FIFA & Kural Devrimi",
    title: "FIFA'dan Yeni Kural Değişikliği Sinyali: Ofsayt Sisteminde Devrim!",
    body: "Arsene Wenger'in önerdiği ve hücum oyuncusunun ofsayt sayılması için 'tüm vücudunun son savunmacının önünde olması' şartını getiren yeni ofsayt sisteminin FIFA tarafından pilot turnuvalarda resmen test edilmeye başlandığı açıklandı."
  },
  {
    id: "world_superlig_samsun",
    club: "Samsunspor",
    source: "Sky Sports · Süper Lig Özel",
    title: "Anadolu Kulübünden Devlere Gözdağı: Samsunspor'un 10 Maçtır Bileği Bükülmüyor!",
    body: "Trendyol Süper Lig'de müthiş bir çıkış yakalayan Samsunspor, üst üste 10 maçlık yenilmezlik serisiyle devleri geride bırakarak zirve yarışına resmen ortak oldu!"
  },
  {
    id: "world_superlig_goztepe",
    club: "Göztepe",
    source: "The Guardian · Süper Lig Raporu",
    title: "Anadolu Kulübünden Devlere Gözdağı: Göztepe 10 Maçtır Yenilmiyor!",
    body: "İzmir temsilcisi Göztepe, Gürsel Aksel Stadyumu'ndaki müthiş taraftar desteği ve dinamik kadrosuyla 10 maçlık yenilmezlik serisi yakalayarak Süper Lig'de zirve yarışına ortak oldu!"
  },
  {
    id: "world_superlig_eyup",
    club: "Eyüpspor",
    source: "Marca · Avrupa Ligleri",
    title: "Süper Lig'de Sürpriz Çıkış: Eyüpspor 10 Maçtır Bileği Bükülmüyor!",
    body: "Oynadığı pas odaklı modern futbolla dikkat çeken Eyüpspor, güçlü rakiplerine karşı yakaladığı 10 maçlık yenilmezlik serisiyle ligin üst sıralarına demir attı."
  },
  {
    id: "world_enrique_press",
    club: "PSG",
    source: "Marca · Fransa Ligue 1",
    title: "PSG Hocası Luis Enrique Basın Toplantısında Gazetecilerle Kavga Etti!",
    body: "Paris Saint-Germain'in maç sonu basın toplantısında taktik tercihlerini sorgulayan Fransız muhabirle sert bir tartışmaya giren teknik direktör Luis Enrique, 'Futboldan anlamıyorsunuz!' diyerek mikrofonu bırakıp salonu terk etti."
  },
  {
    id: "world_real_mbappe_vini",
    club: "Real Madrid",
    source: "Marca · İspanya La Liga",
    title: "Real Madrid'de Mbappé ve Vinicius Jr. Arasında Penaltı Kulisleri!",
    body: "Santiago Bernabéu'da son maçta kazanılan penaltı atışı sonrası Kylian Mbappé ve Vinicius Junior arasındaki görev paylaşımı İspanyol basınının bir numaralı gündem maddesi oldu."
  },
  {
    id: "world_barca_yamal",
    club: "Barcelona",
    source: "The Guardian · La Liga",
    title: "Barcelona'dan Lamine Yamal'a 1 Milyar Euro'luk Yeni Sözleşme Zırhı!",
    body: "Katalan devi Barcelona, Körfez ve İngiliz kulüplerinin radarına giren genç süper yıldızı Lamine Yamal ile yeni kontrat imzalayarak serbest kalma bedelini 1 Milyar € olarak sabitledi."
  },
  {
    id: "world_bayern_kane",
    club: "Bayern Munchen",
    source: "Sky Sports · Bundesliga",
    title: "Bayern Münih'te Harry Kane Gol Rekorlarını Altüst Ediyor!",
    body: "Bundesliga'da hafta sonunu hat-trick ile kapatan İngiliz yıldız Harry Kane, Almanya'da maç başına gol ortalamasıyla tarihin en verimli sezonlarından birini yaşıyor."
  },
  {
    id: "world_superlig_derby",
    club: "Fenerbahce",
    source: "Sky Sports · Trendyol Süper Lig",
    title: "Süper Lig'de Dev Derbi Öncesi Yabancı VAR ve Hakem Fırtınası!",
    body: "Türkiye'de şampiyonluk düğümünü çözecek Fenerbahçe - Galatasaray derbisi öncesinde iki kulüp yönetimleri karşılıklı açıklamalar yayınladı; derbi heyecanı tüm ülkeyi sardı."
  },
  {
    id: "world_seriea_inter_milan",
    club: "Inter",
    source: "The Guardian · Serie A",
    title: "Milano Derbisinde Nefes Kesen Mücadele ve Taktik Savaşı!",
    body: "Serie A'nın zirvesini yakından ilgilendiren Della Madonnina derbisinde Inter ve Milan arasındaki sert mücadele İtalyan spor manşetlerini süsledi."
  },
  {
    id: "world_bjk_ts",
    club: "Besiktas",
    source: "Sky Sports · Süper Lig Gündemi",
    title: "Dolmabahçe'de Beşiktaş ve Trabzonspor Arasında Kritik Randevu!",
    body: "Trendyol Süper Lig'de haftanın dev maçında Beşiktaş ile Trabzonspor karşı karşıya gelirken tribünlerdeki koreografi ve coşku Avrupa basınında da geniş yer buldu."
  },
  {
    id: "world_juve_kenan",
    club: "Juventus",
    source: "The Guardian · İtalya Serie A",
    title: "Torino'da 10 Numaralı Kenan Yıldız Rüzgarı!",
    body: "Juventus'un genç yıldızı Kenan Yıldız, Şampiyonlar Ligi ve Serie A'da attığı klas gollerle İtalyan taraftarların sevgilisi haline geldi."
  },
  {
    id: "world_real_arda",
    club: "Real Madrid",
    source: "Marca · İspanya Gündemi",
    title: "Santiago Bernabéu'da Arda Güler Ayakta Alkışlandı!",
    body: "Real Madrid orta sahasında ilk 11'de sahaya çıkan Arda Güler, yaptığı asist ve uzaktan golüyle maçın oyuncusu seçildi."
  }
];

const UCL_SAMPLE_PAIRS = [
  ["Real Madrid", "Bayern Munchen"],
  ["Barcelona", "PSG"],
  ["Inter", "Atletico Madrid"],
  ["Galatasaray", "Juventus"],
  ["Borussia Dortmund", "Milan"],
  ["Bayer Leverkusen", "Porto"],
  ["Fenerbahce", "Benfica"],
  ["Sporting", "Ajax"],
  ["Real Madrid", "Inter"],
  ["Bayern Munchen", "Barcelona"]
];

function generateChampionsLeagueHeadline(completedWeek) {
  const pair = UCL_SAMPLE_PAIRS[(completedWeek + ((Math.random() * UCL_SAMPLE_PAIRS.length) | 0)) % UCL_SAMPLE_PAIRS.length];
  const [clubA, clubB] = pair;
  const scores = [[3, 1], [2, 1], [2, 2], [3, 2], [2, 0], [1, 0], [4, 2]];
  const [gA, gB] = scores[(Math.random() * scores.length) | 0];

  const playersA = (DATA[clubA] || []).slice(-5);
  const playersB = (DATA[clubB] || []).slice(-5);
  const starA = playersA.length ? playersA[(Math.random() * playersA.length) | 0][0] : "Yıldız Oyuncu";
  const starB = playersB.length ? playersB[(Math.random() * playersB.length) | 0][0] : "Yıldız Oyuncu";

  if (gA === gB) {
    return {
      week: completedWeek,
      source: "Sky Sports · Şampiyonlar Ligi Gecesi",
      clubLogoName: clubA,
      teamIdx: null,
      title: `Devler Ligi'nde Nefes Kesen Maç: ${clubA} ${gA} - ${gB} ${clubB}!`,
      body: `UEFA Şampiyonlar Ligi haftanın maçında ${clubA} ile ${clubB} yenişemedi (${gA}-${gB}). Ev sahibi ekipte ${starA}, konuk takımda ise ${starB} sergiledikleri performansla gecenin yıldızları oldu.`,
      effectBadge: `UCL · ${clubA} ${gA}-${gB} ${clubB}`,
      effectPositive: null
    };
  }

  return {
    week: completedWeek,
    source: "Sky Sports · Şampiyonlar Ligi Gecesi",
    clubLogoName: clubA,
    teamIdx: null,
    title: `Şampiyonlar Ligi'nde Dev Zafer: ${clubA} ${gA} - ${gB} ${clubB}!`,
    body: `UEFA Şampiyonlar Ligi gecesinin en kritik randevusunda ${clubA}, sahasında ağırladığı ${clubB} karşısında ${starA}'in yıldızlaştığı maçı ${gA}-${gB} kazanarak büyük avantaj yakaladı.`,
    effectBadge: `UCL · ${clubA} ${gA}-${gB} ${clubB}`,
    effectPositive: true
  };
}

function generateDynamicMatchHeadline(roundMatches, completedWeek) {
  if (!roundMatches || !roundMatches.length) return null;
  const aiMatches = roundMatches.filter(m => m.done && m.sc && m.a !== 0 && m.b !== 0);
  if (!aiMatches.length) return null;

  const sorted = [...aiMatches].sort((x, y) => {
    const diffX = Math.abs(x.sc[0] - x.sc[1]);
    const diffY = Math.abs(y.sc[0] - y.sc[1]);
    const totX = x.sc[0] + x.sc[1];
    const totY = y.sc[0] + y.sc[1];
    return (diffY * 2 + totY) - (diffX * 2 + totX);
  });

  const pick = sorted[0];
  const tA = G.teams[pick.a];
  const tB = G.teams[pick.b];
  if (!tA || !tB) return null;

  const [gA, gB] = pick.sc;
  if (gA === gB) {
    return {
      week: completedWeek,
      source: "Sky Sports · Premier Lig Özeti",
      clubLogoName: tA.name,
      teamIdx: pick.a,
      title: `${tA.name} ile ${tB.name} Yenişemedi: ${gA}-${gB}!`,
      body: `${completedWeek}. haftanın dikkat çeken mücadelesinde ${tA.name} ve ${tB.name} sahadan ${gA}-${gB}'lik beraberlikle ayrılarak puanları paylaştı.`
    };
  }

  const winIdx = gA > gB ? pick.a : pick.b;
  const loseIdx = gA > gB ? pick.b : pick.a;
  const winTeam = G.teams[winIdx];
  const loseTeam = G.teams[loseIdx];
  const winGoals = Math.max(gA, gB);
  const loseGoals = Math.min(gA, gB);

  return {
    week: completedWeek,
    source: "Sky Sports · Haftanın Raporu",
    clubLogoName: winTeam.name,
    teamIdx: winIdx,
    title: `${winTeam.name}, ${loseTeam.name} Karşısında ${winGoals}-${loseGoals} Galip!`,
    body: `Premier Lig'in ${completedWeek}. haftasında ${winTeam.name}, etkili bir oyun sergileyerek ${loseTeam.name} engelini ${winGoals}-${loseGoals} ile geçti ve hanesine kritik 3 puan yazdırdı.`
  };
}

function triggerWeeklyTeamNews(roundMatches, completedWeek) {
  if (!LG) return;

  // 1. Haftanın Premier Lig maçlarından dinamik özet haberi
  const matchNews = generateDynamicMatchHeadline(roundMatches, completedWeek);
  if (matchNews) {
    LG.newsFeed.unshift(matchNews);
  }

  // 2. Birkaç haftada bir (her 2 haftada bir) Şampiyonlar Ligi maç sonucu haberi gelsin
  let uclNewsItem = null;
  if (completedWeek % 2 === 0) {
    uclNewsItem = generateChampionsLeagueHeadline(completedWeek);
    if (uclNewsItem) {
      LG.newsFeed.unshift(uclNewsItem);
    }
  }

  // 3. Aktif ligde yer alan rakip takımların yıldız haberleri (Sunderland vb. lig dışı takımlar elenir)
  const activeRivalNames = new Set(G.teams.slice(1).map(tm => tm.name));
  let availStar = PREMIER_STAR_NEWS_TEMPLATES.filter(t => activeRivalNames.has(t.club) && !LG.usedNewsIds.has(t.id));
  if (!availStar.length) {
    PREMIER_STAR_NEWS_TEMPLATES.forEach(t => LG.usedNewsIds.delete(t.id));
    availStar = PREMIER_STAR_NEWS_TEMPLATES.filter(t => activeRivalNames.has(t.club));
  }

  let availWorld = WORLD_FOOTBALL_NEWS_TEMPLATES.filter(t => !LG.usedNewsIds.has(t.id));
  if (!availWorld.length) {
    WORLD_FOOTBALL_NEWS_TEMPLATES.forEach(t => LG.usedNewsIds.delete(t.id));
    availWorld = [...WORLD_FOOTBALL_NEWS_TEMPLATES];
  }

  const pickWorldFirst = (completedWeek % 2 === 1);
  let primaryItem = null;

  if (availStar.length) {
    const sTpl = availStar[(Math.random() * availStar.length) | 0];
    LG.usedNewsIds.add(sTpl.id);
    const targetTeamIdx = G.teams.findIndex((tm, idx) => idx > 0 && tm.name === sTpl.club);
    const targetTeam = targetTeamIdx > 0 ? G.teams[targetTeamIdx] : null;
    const modInfo = modifyRivalPlayerRating(targetTeam, sTpl.player, sTpl.delta);
    const stRow = targetTeamIdx > 0 ? getSortedStandings().findIndex(s => s.teamIdx === targetTeamIdx) + 1 : null;
    const rankStr = stRow ? ` (${sTpl.club} şu an ligde ${stRow}. sırada)` : "";

    const starNewsObj = {
      week: completedWeek,
      source: sTpl.source,
      clubLogoName: sTpl.club,
      teamIdx: targetTeamIdx > 0 ? targetTeamIdx : null,
      title: sTpl.title,
      body: `${sTpl.body}${rankStr}`,
      effectBadge: modInfo ? modInfo.badge : null,
      effectPositive: modInfo ? modInfo.isPositive : true
    };
    LG.newsFeed.unshift(starNewsObj);
    if (!pickWorldFirst) primaryItem = starNewsObj;
  }

  if (availWorld.length) {
    const wTpl = availWorld[(Math.random() * availWorld.length) | 0];
    LG.usedNewsIds.add(wTpl.id);
    const worldNewsObj = {
      week: completedWeek,
      source: wTpl.source,
      clubLogoName: wTpl.club,
      teamIdx: null,
      title: wTpl.title,
      body: wTpl.body,
      effectBadge: "Dünya Futbolu · Özel Gündem",
      effectPositive: null
    };
    LG.newsFeed.unshift(worldNewsObj);
    if (pickWorldFirst || !primaryItem) primaryItem = worldNewsObj;
  }

  // Her 4 haftada bir Şampiyonlar Ligi gecesi manşeti de bildirim olarak öne çıkabilsin
  if (uclNewsItem && completedWeek % 4 === 0) {
    primaryItem = uclNewsItem;
  }

  if (primaryItem) {
    if (!LG.activeEvent && Math.random() < 0.85) {
      LG.activeNews = primaryItem;
    } else if (LG.activeEvent && Math.random() < 0.6) {
      LG.pendingNewsAfterEvent = primaryItem;
    }
  }

  if (LG.newsFeed.length > 50) {
    LG.newsFeed = LG.newsFeed.slice(0, 50);
  }
}

function triggerWeeklyCareerEvent() {
  if (!LG || LG.week > LG.maxWeeks) return;
  const userTeam = G.teams[0];
  ensureTeamLineup(userTeam);

  for (const pid of Object.keys(LG.injuries)) {
    LG.injuries[pid]--;
    if (LG.injuries[pid] <= 0) delete LG.injuries[pid];
  }

  const catalog = buildCareerEventsCatalog();

  // Son maçta mağlup olunduysa Gazete Manşeti Eleştirisi öncelikli tetiklensin
  if (LG.lastResult && LG.lastResult.userGoals < LG.lastResult.oppGoals) {
    const mediaEv = catalog.find(e => e.id === "media_backlash");
    if (mediaEv && (!LG.usedEventIds.has("media_backlash") || (LG.lastResult.oppGoals - LG.lastResult.userGoals >= 2))) {
      LG.usedEventIds.add("media_backlash");
      LG.activeEvent = mediaEv;
      return;
    }
  }

  // Arka planda %65 ihtimalle kulüp kararı olayı tetiklenir
  if (Math.random() > 0.65) return;

  let available = catalog.filter(e => e.id !== "media_backlash" && !LG.usedEventIds.has(e.id));
  if (!available.length) {
    LG.usedEventIds.clear();
    available = catalog.filter(e => e.id !== "media_backlash");
  }
  const pickedEvent = available[(Math.random() * available.length) | 0];
  if (pickedEvent) {
    LG.usedEventIds.add(pickedEvent.id);
    LG.activeEvent = pickedEvent;
  }
}

function resolveCareerEvent(choiceIdx) {
  if (!LG || !LG.activeEvent) return;
  const ch = LG.activeEvent.choices[choiceIdx];
  if (ch && ch.effect) {
    const outcomeText = ch.effect();
    LG.eventHistory.unshift({
      week: LG.week,
      title: LG.activeEvent.title,
      outcome: outcomeText
    });
  }
  LG.activeEvent = null;
  if (LG.pendingNewsAfterEvent) {
    LG.activeNews = LG.pendingNewsAfterEvent;
    LG.pendingNewsAfterEvent = null;
  }
  render();
}

function dismissCareerNews() {
  if (!LG) return;
  LG.activeNews = null;
  render();
}

function playCurrentWeekLeagueMatch(instant = false) {
  if (!LG || LG.week > LG.maxWeeks) return;
  if (M && M.tm) clearInterval(M.tm);
  const roundMatches = LG.schedule[LG.week - 1];
  if (!roundMatches) return;
  const userMatch = roundMatches.find(m => m.a === 0 || m.b === 0);
  if (!userMatch) return;

  // Eğer bir şekilde kullanıcı maçı önceden tamamlanmışsa haftayı ilerlet
  if (userMatch.done) {
    roundMatches.forEach(m => {
      if (!m.done) simulateBackgroundLeagueMatch(m);
    });
    LG.viewWeek = LG.week;
    LG.week++;
    return render();
  }

  matchSetup(userMatch.a, userMatch.b, `LG_W${LG.week}`);
  if (instant) {
    finishInstantly();
  } else {
    toggleKickoff();
  }
}

function finalizeCareerWeekAfterUserMatch(scA, scB, goalsListA, goalsListB) {
  if (!LG || LG.week > LG.maxWeeks) return;
  const completedWeek = LG.week;
  const roundMatches = LG.schedule[completedWeek - 1];
  if (!roundMatches) return;

  const userMatch = roundMatches.find(m => m.a === 0 || m.b === 0);
  if (userMatch && !userMatch.done) {
    userMatch.done = true;
    userMatch.sc = [scA, scB];
    updateLeagueTableForMatch(userMatch.a, userMatch.b, scA, scB);

    const userGoals = userMatch.a === 0 ? scA : scB;
    const oppGoals = userMatch.a === 0 ? scB : scA;
    const oppIdx = userMatch.a === 0 ? userMatch.b : userMatch.a;
    LG.lastResult = {
      userGoals,
      oppGoals,
      oppName: G.teams[oppIdx] ? G.teams[oppIdx].name : "Rakip"
    };

    [
      [userMatch.a, goalsListA],
      [userMatch.b, goalsListB]
    ].forEach(([tIdx, gArr]) => {
      const tm = G.teams[tIdx];
      if (!tm) return;
      (gArr || []).forEach(g => {
        if (g && g.scorer) {
          const k = `${tIdx}_${g.scorer}`;
          if (!LG.playerStats[k]) LG.playerStats[k] = { name: g.scorer, teamIdx: tIdx, teamName: tm.name, goals: 0, assists: 0 };
          LG.playerStats[k].goals++;
        }
        if (g && g.assister) {
          const kA = `${tIdx}_${g.assister}`;
          if (!LG.playerStats[kA]) LG.playerStats[kA] = { name: g.assister, teamIdx: tIdx, teamName: tm.name, goals: 0, assists: 0 };
          LG.playerStats[kA].assists++;
        }
      });
    });
  }

  roundMatches.forEach(m => {
    if (!m.done) simulateBackgroundLeagueMatch(m);
  });

  LG.viewWeek = completedWeek;
  LG.week++;
  triggerWeeklyCareerEvent();
  triggerWeeklyTeamNews(roundMatches, completedWeek);
}

function simulateRestOfLeagueSeason() {
  if (!LG) return;
  while (LG.week <= LG.maxWeeks) {
    const cw = LG.week;
    const roundMatches = LG.schedule[cw - 1];
    roundMatches.forEach(m => {
      if (!m.done) simulateBackgroundLeagueMatch(m);
    });
    const matchNews = generateDynamicMatchHeadline(roundMatches, cw);
    if (matchNews) LG.newsFeed.unshift(matchNews);
    LG.viewWeek = cw;
    LG.week++;
  }
  LG.activeEvent = null;
  LG.activeNews = null;
  LG.pendingNewsAfterEvent = null;
  render();
}

function getSortedStandings() {
  if (!LG) return [];
  return [...LG.standings].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const gdA = a.gf - a.ga;
    const gdB = b.gf - b.ga;
    if (gdB !== gdA) return gdB - gdA;
    return b.gf - a.gf;
  });
}

function renderLeagueHub() {
  if (!LG) return renderCareerLeagueSelector();
  const userTeam = G.teams[0];
  const sortedTable = getSortedStandings();
  const userRank = sortedTable.findIndex(x => x.teamIdx === 0) + 1;
  const isSeasonOver = LG.week > LG.maxWeeks;
  const currentRoundMatches = !isSeasonOver ? LG.schedule[LG.week - 1] : [];
  const nextUserMatch = currentRoundMatches.find(m => m.a === 0 || m.b === 0);
  const oppIdx = nextUserMatch ? (nextUserMatch.a === 0 ? nextUserMatch.b : nextUserMatch.a) : null;
  const oppTeam = oppIdx != null ? G.teams[oppIdx] : null;

  const topScorers = Object.values(LG.playerStats)
    .filter(x => x.goals > 0)
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 15);

  const topAssisters = Object.values(LG.playerStats)
    .filter(x => x.assists > 0)
    .sort((a, b) => b.assists - a.assists || b.goals - a.goals)
    .slice(0, 15);

  const fixtureWeek = Math.min(LG.maxWeeks, Math.max(1, LG.viewWeek || LG.week));
  const weekMatches = LG.schedule[fixtureWeek - 1] || [];
  const latestNews = LG.newsFeed && LG.newsFeed.length ? LG.newsFeed[0] : null;

  app.innerHTML = hdr() + renderOnlineModal() + `
    ${LG.activeEvent ? `
      <div class="modal-backdrop">
        <div class="modal-card" style="max-width:600px">
          <span class="eyebrow" style="color:var(--t-elite)">${LG.activeEvent.tag}</span>
          <h2 style="margin-top:4px">${LG.activeEvent.title}</h2>
          <p style="margin:10px 0 16px;font-size:.92rem;line-height:1.5">${LG.activeEvent.desc}</p>
          <div style="display:flex;flex-direction:column;gap:10px">
            ${LG.activeEvent.choices.map((ch, idx) => `
              <button class="${idx === 0 ? 'pri' : ''}" style="justify-content:flex-start;text-align:left;padding:12px 14px" onclick="resolveCareerEvent(${idx})">
                ${ch.label}
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    ` : (LG.activeNews ? `
      <div class="modal-backdrop" onclick="dismissCareerNews()">
        <div class="modal-card" style="max-width:560px;border-color:var(--t-elite)" onclick="event.stopPropagation()">
          <div class="row" style="justify-content:space-between;margin-bottom:8px">
            <span class="eyebrow" style="color:var(--t-elite);margin-bottom:0;display:inline-flex;align-items:center;gap:4px">${typeof mediaLogoBadge === "function" ? mediaLogoBadge(LG.activeNews.source) : ""}${LG.activeNews.source} · ${LG.activeNews.week}. Hafta Gündemi</span>
            ${LG.activeNews.effectBadge ? `<span class="pos-badge ${LG.activeNews.effectPositive === false ? 'pos-FWD' : (LG.activeNews.effectPositive === true ? 'pos-MID' : 'pos-GK')}">${LG.activeNews.effectBadge}</span>` : `<span class="lg-tag">Gündem</span>`}
          </div>
          <div class="row" style="gap:12px;margin:8px 0 12px">
            ${LG.activeNews.clubLogoName ? clubLogo(LG.activeNews.clubLogoName, 40) : (LG.activeNews.teamIdx != null && G.teams[LG.activeNews.teamIdx] ? renderTeamIdentityBadge(G.teams[LG.activeNews.teamIdx], 40) : "")}
            <h2 style="font-size:1.18rem;line-height:1.3;flex:1">${LG.activeNews.title}</h2>
          </div>
          <p style="margin:0 0 18px;font-size:.91rem;line-height:1.55;color:var(--fg)">${LG.activeNews.body}</p>
          <div class="row" style="justify-content:flex-end">
            <button class="pri" onclick="dismissCareerNews()">Haberi Kapat & Devam Et →</button>
          </div>
        </div>
      </div>
    ` : "")}

    <section class="hero">
      <div class="row" style="justify-content:space-between;align-items:center">
        <div>
          <span class="eyebrow">${LG.leagueName} · 2026-27 Kariyer Sezonu · ${isSeasonOver ? "Sezon Tamamlandı" : `${LG.week}. Hafta / ${LG.maxWeeks}`}</span>
          <h1 class="club-cell" style="margin-top:4px">
            ${renderTeamIdentityBadge(userTeam, 42)}
            <span>${userTeam.name}</span>
          </h1>
          <p style="margin-top:6px">
            Sıralama: <b style="color:var(--pri-bright)">${userRank}. Sıra</b> · Kasa: <b>${LG.clubFunds} M€</b> · Sponsor: <b style="color:var(--t-elite)">${LG.sponsorName}</b> · Moral/Form: <b style="color:${LG.moraleMod >= 0 ? 'var(--pri-bright)' : 'var(--bad)'}">${LG.moraleMod >= 0 ? '+' : ''}${LG.moraleMod}%</b>
          </p>
        </div>

        <div style="background:var(--raised);padding:14px 18px;border-radius:var(--r);border:1px solid var(--border);min-width:290px">
          ${!isSeasonOver && oppTeam ? `
            <div class="muted" style="font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Sıradaki Maç · ${LG.week}. Hafta</div>
            <div class="row" style="justify-content:space-between;margin-bottom:10px">
              <span class="club-cell"><b>${userTeam.name}</b></span>
              <span class="muted">vs</span>
              <span class="club-cell">${renderTeamIdentityBadge(oppTeam, 22)} <b>${oppTeam.name}</b></span>
            </div>
            <div class="row">
              <button class="pri sm" style="flex:1" onclick="playCurrentWeekLeagueMatch(false)">Canlı Oynat (30 Sn)</button>
              <button class="sm gold" style="flex:1" onclick="playCurrentWeekLeagueMatch(true)">Hızlı Simüle Et</button>
            </div>
          ` : `
            <div style="text-align:center">
              <span class="eyebrow" style="color:var(--t-elite)">Sezon Şampiyonu</span>
              <h3 class="club-cell" style="justify-content:center;margin-top:6px;color:var(--t-elite)">
                ${renderTeamIdentityBadge(G.teams[sortedTable[0].teamIdx], 28)}
                <span>${G.teams[sortedTable[0].teamIdx].name} (${sortedTable[0].pts} Puan)</span>
              </h3>
            </div>
          `}
        </div>
      </div>

      ${latestNews ? `
        <div style="margin-top:12px;padding:10px 14px;background:rgba(17,41,30,0.85);border:1px solid var(--border);border-left:3px solid var(--t-elite);border-radius:8px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <div class="club-cell" style="font-size:.83rem;flex:1">
            ${latestNews.clubLogoName ? clubLogo(latestNews.clubLogoName, 22) : (latestNews.teamIdx != null && G.teams[latestNews.teamIdx] ? renderTeamIdentityBadge(G.teams[latestNews.teamIdx], 22) : "")}
            <span>
              ${typeof mediaLogoBadge === "function" ? mediaLogoBadge(latestNews.source) : ""}<b style="color:var(--t-elite)">[${latestNews.source}]</b>
              <b>${latestNews.title}</b>
              ${latestNews.effectBadge ? ` <span class="pos-badge ${latestNews.effectPositive === false ? 'pos-FWD' : (latestNews.effectPositive === true ? 'pos-MID' : 'pos-GK')}" style="margin-left:4px">${latestNews.effectBadge}</span>` : ""}
              — <span class="muted">${latestNews.body}</span>
            </span>
          </div>
          <button class="sm" onclick="LG.tab='news';render()">Tüm Haberler (${LG.newsFeed.length})</button>
        </div>
      ` : ""}

      ${LG.eventHistory.length ? `
        <div class="ok-msg" style="margin:10px 0 0;font-size:.82rem">
          <b>Son Kulüp Kararı (${Math.max(1, LG.eventHistory[0].week - 1)}. Hafta):</b> ${LG.eventHistory[0].outcome}
        </div>
      ` : ""}
    </section>

    <div class="row" style="justify-content:space-between;margin-bottom:12px">
      <div class="pos-tabs" style="margin-bottom:0">
        <button class="pos-tab" aria-pressed="${LG.tab === 'standings'}" onclick="LG.tab='standings';render()">Puan Durumu (20 Takım)</button>
        <button class="pos-tab" aria-pressed="${LG.tab === 'fixtures'}" onclick="LG.tab='fixtures';LG.viewWeek=Math.min(LG.maxWeeks,LG.week);render()">Haftalık Fikstür & Sonuçlar</button>
        <button class="pos-tab" aria-pressed="${LG.tab === 'leaders'}" onclick="LG.tab='leaders';render()">Gol & Asist Krallığı</button>
        <button class="pos-tab" aria-pressed="${LG.tab === 'news'}" onclick="LG.tab='news';render()">Lig Haberleri & Kulüp Günlüğü (${LG.newsFeed.length})</button>
      </div>
      <div class="row">
        <button class="sm" onclick="S.view='result';render()">Kadro & İlk 11 Değiştir</button>
        ${!isSeasonOver ? `<button class="sm" onclick="simulateRestOfLeagueSeason()">Tüm Sezonu Hızlı Tamamla</button>` : ""}
      </div>
    </div>

    ${LG.tab === "standings" ? `
      <div class="panel" style="margin-top:0">
        <div class="scroll" style="max-height:680px">
          <table>
            <thead>
              <tr>
                <th style="width:42px">#</th>
                <th>Kulüp</th>
                <th class="n">O</th>
                <th class="n">G</th>
                <th class="n">B</th>
                <th class="n">M</th>
                <th class="n">AG</th>
                <th class="n">YG</th>
                <th class="n">AV</th>
                <th class="n">Puan</th>
              </tr>
            </thead>
            <tbody>
              ${sortedTable.map((row, idx) => {
                const tm = G.teams[row.teamIdx];
                const gd = row.gf - row.ga;
                const isMe = row.teamIdx === 0;
                return `
                  <tr style="${isMe ? 'background:rgba(34,197,94,0.16);font-weight:700' : ''}">
                    <td><b>${idx + 1}</b></td>
                    <td>
                      <span class="club-cell">
                        ${renderTeamIdentityBadge(tm, 20)}
                        <b>${tm.name}</b>
                        ${idx === 0 && isSeasonOver ? '<span class="pos-badge pos-GK">ŞAMPİYON</span>' : ''}
                      </span>
                    </td>
                    <td class="n">${row.played}</td>
                    <td class="n">${row.w}</td>
                    <td class="n">${row.d}</td>
                    <td class="n">${row.l}</td>
                    <td class="n">${row.gf}</td>
                    <td class="n">${row.ga}</td>
                    <td class="n">${gd > 0 ? '+' + gd : gd}</td>
                    <td class="n"><b style="color:var(--pri-bright);font-size:.96rem">${row.pts}</b></td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    ` : ""}

    ${LG.tab === "fixtures" ? `
      <div class="panel" style="margin-top:0">
        <div class="panel-head">
          <h2>${fixtureWeek}. Hafta Maçları</h2>
          <div class="row">
            <button class="sm" ${fixtureWeek <= 1 ? "disabled" : ""} onclick="LG.viewWeek=${fixtureWeek - 1};render()">← Önceki Hafta</button>
            <select onchange="LG.viewWeek=+this.value;render()">
              ${Array.from({ length: LG.maxWeeks }, (_, i) => i + 1).map(w => `
                <option value="${w}" ${w === fixtureWeek ? "selected" : ""}>${w}. Hafta</option>
              `).join("")}
            </select>
            <button class="sm" ${fixtureWeek >= LG.maxWeeks ? "disabled" : ""} onclick="LG.viewWeek=${fixtureWeek + 1};render()">Sonraki Hafta →</button>
          </div>
        </div>
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:10px">
          ${weekMatches.map(m => {
            const tA = G.teams[m.a];
            const tB = G.teams[m.b];
            const isUserMatch = m.a === 0 || m.b === 0;
            return `
              <div style="background:${isUserMatch ? 'rgba(22,101,52,0.28)' : 'var(--raised)'};border:1px solid ${isUserMatch ? 'var(--pri-bright)' : 'var(--border)'};border-radius:8px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px">
                <span class="club-cell" style="flex:1">${renderTeamIdentityBadge(tA, 18)} <b>${tA.name}</b></span>
                <span style="font-family:var(--mono);font-weight:700;padding:3px 9px;background:var(--surface);border-radius:6px;color:var(--pri-bright)">
                  ${m.done && m.sc ? `${m.sc[0]} - ${m.sc[1]}` : "v"}
                </span>
                <span class="club-cell" style="flex:1;justify-content:flex-end;text-align:right"><b>${tB.name}</b> ${renderTeamIdentityBadge(tB, 18)}</span>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    ` : ""}

    ${LG.tab === "leaders" ? `
      <div class="match-grid" style="margin-top:0">
        <div class="panel" style="margin-top:0">
          <h2>Gol Krallığı</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Oyuncu</th>
                <th>Kulüp</th>
                <th class="n">Gol</th>
              </tr>
            </thead>
            <tbody>
              ${topScorers.map((p, idx) => `
                <tr style="${p.teamIdx === 0 ? 'background:rgba(34,197,94,0.15)' : ''}">
                  <td><b>${idx + 1}</b></td>
                  <td><b>${p.name}</b></td>
                  <td><span class="club-cell">${renderTeamIdentityBadge(G.teams[p.teamIdx], 16)} <span class="muted">${p.teamName}</span></span></td>
                  <td class="n"><b style="color:var(--t-elite)">${p.goals}</b></td>
                </tr>
              `).join("") || `<tr><td colspan="4" class="muted">Henüz gol kaydedilmedi.</td></tr>`}
            </tbody>
          </table>
        </div>

        <div class="panel" style="margin-top:0">
          <h2>Asist Krallığı</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Oyuncu</th>
                <th>Kulüp</th>
                <th class="n">Asist</th>
              </tr>
            </thead>
            <tbody>
              ${topAssisters.map((p, idx) => `
                <tr style="${p.teamIdx === 0 ? 'background:rgba(34,197,94,0.15)' : ''}">
                  <td><b>${idx + 1}</b></td>
                  <td><b>${p.name}</b></td>
                  <td><span class="club-cell">${renderTeamIdentityBadge(G.teams[p.teamIdx], 16)} <span class="muted">${p.teamName}</span></span></td>
                  <td class="n"><b style="color:var(--pri-bright)">${p.assists}</b></td>
                </tr>
              `).join("") || `<tr><td colspan="4" class="muted">Henüz asist kaydedilmedi.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    ` : ""}

    ${LG.tab === "news" ? `
      <div class="match-grid" style="margin-top:0">
        <div class="panel" style="margin-top:0">
          <div class="panel-head">
            <h2>Premier Lig Basın Bülteni & Takım Haberleri</h2>
            <span class="muted" style="font-size:.78rem">Haftalık otomatik güncellenir</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:10px;max-height:520px;overflow:auto;padding-right:4px">
            ${LG.newsFeed.map(n => `
              <div style="background:var(--raised);border:1px solid var(--border);border-radius:10px;padding:12px 14px">
                <div class="row" style="justify-content:space-between;margin-bottom:6px">
                  <div class="row" style="gap:6px">
                    <span class="lg-tag" style="color:var(--t-elite);display:inline-flex;align-items:center;gap:4px">${typeof mediaLogoBadge === "function" ? mediaLogoBadge(n.source) : ""}${n.source}</span>
                    ${n.effectBadge ? `<span class="pos-badge ${n.effectPositive === false ? 'pos-FWD' : (n.effectPositive === true ? 'pos-MID' : 'pos-GK')}">${n.effectBadge}</span>` : ""}
                  </div>
                  <span class="min-tag">${n.week}. Hafta</span>
                </div>
                <div class="club-cell" style="margin-bottom:6px">
                  ${n.clubLogoName ? clubLogo(n.clubLogoName, 22) : (n.teamIdx != null && G.teams[n.teamIdx] ? renderTeamIdentityBadge(G.teams[n.teamIdx], 22) : "")}
                  <h3 style="font-size:.95rem">${n.title}</h3>
                </div>
                <p class="muted" style="margin:0;font-size:.82rem;line-height:1.45">${n.body}</p>
              </div>
            `).join("") || `<p class="muted">Henüz haber bülteni yayınlanmadı.</p>`}
          </div>
        </div>

        <div class="panel" style="margin-top:0">
          <div class="panel-head">
            <h2>Sezon İçi Kulüp Karar Geçmişi</h2>
            <span class="muted" style="font-size:.78rem">Arka planda tetiklenen olaylar</span>
          </div>
          <ul class="log" style="margin-top:6px;max-height:520px">
            ${LG.eventHistory.map(ev => `
              <li class="goal-item">
                <span class="min-tag">${Math.max(1, ev.week - 1)}.H</span>
                <span><b>${ev.title}:</b> ${ev.outcome}</span>
              </li>
            `).join("") || `<li class="muted">Henüz kulüp olayı yaşanmadı. Haftalar ilerledikçe arka planda gelişen olaylar ve aldığın kararlar burada listelenir.</li>`}
          </ul>
        </div>
      </div>
    ` : ""}
  `;
}

// 11. DENGELİ MAÇ SİMÜLASYONU
const tot = t => {
  const rows = buildPitchRowsForTeam(t);
  let sum = 0;
  rows.forEach(r => {
    r.players.forEach(p => {
      sum += getEffectivePlayerRating(p, r.pos);
    });
  });
  return sum;
};
const avgRating = t => {
  ensureTeamLineup(t);
  return t.starters.length ? (tot(t) / t.starters.length) : 0;
};

function lineup(t) {
  return groupStartersForPitch(t);
}

const av = a => a.reduce((s, p) => s + (p.effR != null ? p.effR : p.r), 0) / (a.length || 1);

function side(t) {
  const L = lineup(t);
  const pitchRows = buildPitchRowsForTeam(t);
  const avg = avgRating(t);
  return {
    L,
    pitchRows,
    avg,
    att: (av(L.FWD) * 3 + av(L.MID) * 2) / 5,
    def: (av(L.DEF) * 3 + av(L.GK) * 2) / 5,
    mid: av(L.MID)
  };
}

function pickGoalscorer(L, sentOffSet = new Set()) {
  const weights = [];
  for (const [k, posMult] of [["FWD", 9.8], ["MID", 2.0], ["DEF", 0.3]]) {
    (L[k] || []).forEach(p => {
      if (sentOffSet.has(p.id)) return;
      const rVal = p.effR != null ? p.effR : p.r;
      const ratingFactor = Math.pow(Math.max(8, rVal - 62), 2.35);
      const starForwardBoost = (k === "FWD" && rVal >= 88) ? 1.75 : (k === "FWD" && rVal >= 85 ? 1.35 : 1.0);
      weights.push([p, posMult * ratingFactor * starForwardBoost]);
    });
  }
  if (!weights.length) return (L.FWD && L.FWD[0]) || (L.MID && L.MID[0]);
  let r = Math.random() * weights.reduce((s, a) => s + a[1], 0);
  for (const [p, w] of weights) {
    if ((r -= w) <= 0) return p;
  }
  return weights[0][0];
}

function pickAssister(L, scorer, sentOffSet = new Set()) {
  const weights = [];
  for (const [k, posMult] of [["MID", 5.0], ["FWD", 3.4], ["DEF", 1.2], ["GK", 0.1]]) {
    (L[k] || []).forEach(p => {
      if ((scorer && p.id === scorer.id) || sentOffSet.has(p.id)) return;
      const rVal = p.effR != null ? p.effR : p.r;
      const ratingFactor = Math.pow(Math.max(8, rVal - 60), 1.7);
      weights.push([p, posMult * ratingFactor]);
    });
  }
  if (!weights.length) return null;
  let r = Math.random() * weights.reduce((s, a) => s + a[1], 0);
  for (const [p, w] of weights) {
    if ((r -= w) <= 0) return p;
  }
  return weights[0][0];
}

function generateMatchPlan(teamA, teamB, sA, sB, allowExtraTime = true) {
  const scheduledByMin = Array.from({ length: 121 }, () => []);
  const sentOff = [new Set(), new Set()];

  const redCardMinutes = [null, null];
  [0, 1].forEach(sideIdx => {
    if (Math.random() < 0.12) {
      const rcMin = 20 + ((Math.random() * 56) | 0);
      redCardMinutes[sideIdx] = rcMin;
      const sObj = sideIdx === 0 ? sA : sB;
      const candidates = [...sObj.L.DEF, ...sObj.L.MID];
      const sentPlayer = candidates[(Math.random() * candidates.length) | 0];
      if (sentPlayer) {
        sentOff[sideIdx].add(sentPlayer.id);
        scheduledByMin[rcMin].push({
          type: "red",
          side: sideIdx,
          min: rcMin,
          player: sentPlayer
        });
      }
    }
  });

  const rawDiff = sA.avg - sB.avg;
  const compressedDiff = Math.max(-1.25, Math.min(1.25, rawDiff * 0.35));

  const matchDaySwing = (Math.random() - 0.5) * 3.7;
  const redPenA = redCardMinutes[0] ? ((90 - redCardMinutes[0]) / 90) * 1.45 : 0;
  const redPenB = redCardMinutes[1] ? ((90 - redCardMinutes[1]) / 90) * 1.45 : 0;

  const netAdvantage = compressedDiff + matchDaySwing - redPenA + redPenB;
  const absAdv = Math.abs(netAdvantage);

  let regGoals = [1, 1];
  let goesToET = false;

  if (absAdv < 0.55 || Math.random() < 0.24) {
    const drawScores = [[1, 1], [2, 2], [1, 1], [0, 0]];
    regGoals = drawScores[(Math.random() * drawScores.length) | 0];
    goesToET = allowExtraTime;
  } else {
    const regWinner = netAdvantage >= 0 ? 0 : 1;
    const closePatterns = [[2, 1], [1, 0], [3, 2], [2, 0], [3, 1], [2, 1]];
    const ch = closePatterns[(Math.random() * closePatterns.length) | 0];
    regGoals = regWinner === 0 ? [ch[0], ch[1]] : [ch[1], ch[0]];
  }

  const usedMinutes = new Set([45, 90, 105, 120, redCardMinutes[0], redCardMinutes[1]]);
  function pickMinute(minStart, minEnd) {
    for (let tries = 0; tries < 50; tries++) {
      const m = minStart + ((Math.random() * (minEnd - minStart)) | 0);
      if (!usedMinutes.has(m)) {
        usedMinutes.add(m);
        return m;
      }
    }
    return minStart + 2;
  }

  [0, 1].forEach(sideIdx => {
    const count = regGoals[sideIdx];
    const sideObj = sideIdx === 0 ? sA : sB;
    const oppObj = sideIdx === 0 ? sB : sA;
    for (let g = 0; g < count; g++) {
      const min = pickMinute(4, 89);
      const activeSentOff = (redCardMinutes[sideIdx] && min > redCardMinutes[sideIdx]) ? sentOff[sideIdx] : new Set();
      const scorer = pickGoalscorer(sideObj.L, activeSentOff);
      const assister = pickAssister(sideObj.L, scorer, activeSentOff);
      scheduledByMin[min].push({
        type: "goal",
        side: sideIdx,
        min,
        scorer,
        assister,
        gk: oppObj.L.GK[0]
      });
    }
  });

  let goesToPenalties = false;
  let penaltyData = null;
  let finalWinnerSide = regGoals[0] > regGoals[1] ? 0 : (regGoals[1] > regGoals[0] ? 1 : -1);

  if (goesToET) {
    if (Math.random() < 0.48) {
      const etWinner = (netAdvantage + (Math.random() - 0.5) * 2.0 >= 0) ? 0 : 1;
      const etMin = pickMinute(93, 118);
      const sideObj = etWinner === 0 ? sA : sB;
      const oppObj = etWinner === 0 ? sB : sA;
      const scorer = pickGoalscorer(sideObj.L, sentOff[etWinner]);
      const assister = pickAssister(sideObj.L, scorer, sentOff[etWinner]);
      scheduledByMin[etMin].push({
        type: "goal",
        side: etWinner,
        min: etMin,
        scorer,
        assister,
        gk: oppObj.L.GK[0]
      });
      finalWinnerSide = etWinner;
    } else {
      goesToPenalties = true;
      const penWinner = Math.random() < 0.5 ? 0 : 1;
      const penPatterns = [[5, 4], [4, 3], [5, 3], [4, 2], [6, 5]];
      const pat = penPatterns[(Math.random() * penPatterns.length) | 0];
      const penScore = penWinner === 0 ? [pat[0], pat[1]] : [pat[1], pat[0]];
      finalWinnerSide = penWinner;

      const takersA = [...sA.L.FWD, ...sA.L.MID].slice(0, 5).map(p => p.n);
      const takersB = [...sB.L.FWD, ...sB.L.MID].slice(0, 5).map(p => p.n);
      penaltyData = {
        score: penScore,
        winnerSide: penWinner,
        takersA,
        takersB
      };
    }
  }

  const maxMin = goesToET ? 120 : 90;
  for (let m = 2; m < maxMin; m++) {
    if (m === 45 || m === 90 || m === 105 || scheduledByMin[m].length > 0) continue;
    if (Math.random() < 0.21) {
      const attSide = Math.random() < 0.5 ? 0 : 1;
      const sideObj = attSide === 0 ? sA : sB;
      const oppObj = attSide === 0 ? sB : sA;
      const shooter = pickGoalscorer(sideObj.L, sentOff[attSide]);
      const gk = oppObj.L.GK[0] || { n: "Kaleci" };
      const r = Math.random();
      if (r < 0.55) {
        scheduledByMin[m].push({ type: "save", side: attSide, min: m, player: shooter, gk });
      } else if (r < 0.82) {
        scheduledByMin[m].push({ type: "miss", side: attSide, min: m, player: shooter });
      } else if (r < 0.92) {
        scheduledByMin[m].push({ type: "post", side: attSide, min: m, player: shooter });
      } else {
        const defList = oppObj.L.DEF.length ? oppObj.L.DEF : oppObj.L.MID;
        const carded = defList[(Math.random() * defList.length) | 0];
        scheduledByMin[m].push({ type: "card", side: 1 - attSide, min: m, player: carded });
      }
    }
  }

  return {
    winnerSide: finalWinnerSide,
    goesToET,
    goesToPenalties,
    penaltyData,
    maxMin,
    scheduledByMin
  };
}

function initTournament() {
  if (!G || G.m.career) return;
  G.teams.forEach(ensureTeamLineup);
  const n = G.teams.length;
  if (n === 2) {
    T = {
      matches: [
        { id: "FINAL", title: "BÜYÜK FİNAL", a: 0, b: 1, done: false, sc: null, pen: null, winner: null, goals: [] }
      ],
      champion: null
    };
  } else if (n === 3) {
    T = {
      matches: [
        { id: "SF1", title: "YARI FİNAL", a: 1, b: 2, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "FINAL", title: "BÜYÜK FİNAL", a: 0, b: null, done: false, sc: null, pen: null, winner: null, goals: [] }
      ],
      champion: null
    };
  } else {
    T = {
      matches: [
        { id: "SF1", title: "YARI FİNAL 1", a: 0, b: 3, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "SF2", title: "YARI FİNAL 2", a: 1, b: 2, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "FINAL", title: "BÜYÜK FİNAL", a: null, b: null, done: false, sc: null, pen: null, winner: null, goals: [] }
      ],
      champion: null
    };
  }
}

function getActiveTournamentMatch() {
  if (!T) return null;
  return T.matches.find(m => !m.done && m.a != null && m.b != null) || T.matches[T.matches.length - 1];
}

function recordTournamentMatchResult(matchId, sc, penScore, winnerIdx, goalsList) {
  if (!T || !matchId) return;
  const m = T.matches.find(x => x.id === matchId);
  if (!m) return;
  m.done = true;
  m.sc = [...sc];
  m.pen = penScore ? [...penScore] : null;
  m.winner = winnerIdx;
  m.goals = goalsList;

  const fin = T.matches.find(x => x.id === "FINAL");
  if (m.id === "SF1" && fin) {
    if (G.teams.length === 3) fin.b = winnerIdx;
    else fin.a = winnerIdx;
  } else if (m.id === "SF2" && fin) {
    fin.b = winnerIdx;
  } else if (m.id === "FINAL") {
    T.champion = winnerIdx;
  }
}

function playBracketMatch(matchId, instant = false) {
  if (!T) return;
  const bm = T.matches.find(x => x.id === matchId);
  if (!bm || bm.a == null || bm.b == null) return;
  matchSetup(bm.a, bm.b, bm.id);
  if (instant) {
    finishInstantly();
  } else {
    toggleKickoff();
  }
}

function simulateAllRemainingTournament() {
  if (!T) initTournament();
  for (const bm of T.matches) {
    if (!bm.done && bm.a != null && bm.b != null) {
      matchSetup(bm.a, bm.b, bm.id);
      finishInstantly();
    }
  }
}

function setupMatchFromNetwork(a, b, tourneyMatchId, plan) {
  if (M && M.tm) clearInterval(M.tm);
  G.teams.forEach(ensureTeamLineup);
  if (!T && !G.m.career) initTournament();

  const teamA = G.teams[a];
  const teamB = G.teams[b];
  const sA = side(teamA);
  const sB = side(teamB);

  const initPerfA = (G.m.career && a === 0 && LG) ? 100 + LG.moraleMod : 100;
  const initPerfB = (G.m.career && b === 0 && LG) ? 100 + LG.moraleMod : 100;

  M = {
    a,
    b,
    tourneyMatchId,
    sa: sA,
    sb: sB,
    plan,
    min: 0,
    sc: [0, 0],
    penSc: null,
    redCards: [0, 0],
    perfFactor: [initPerfA, initPerfB],
    shots: [0, 0],
    onTarget: [0, 0],
    saves: [0, 0],
    xg: [0, 0],
    goalsList: [[], []],
    playerStats: {},
    lastHighlightGoal: null,
    lastHighlightAssist: null,
    log: [],
    run: 0,
    speed: 1,
    leagueWeekRecorded: false
  };
  S.view = "match";
  drawMatch();
}

function matchSetup(a = 0, b = 1, tourneyMatchId = null) {
  if (M && M.tm) clearInterval(M.tm);
  if (a === b) b = (a + 1) % G.teams.length;
  G.teams.forEach(ensureTeamLineup);
  if (!T && !G.m.career) initTournament();

  if (!tourneyMatchId && T && !G.m.career) {
    const found = T.matches.find(x => !x.done && ((x.a === a && x.b === b) || (x.a === b && x.b === a)));
    if (found) {
      tourneyMatchId = found.id;
      a = found.a;
      b = found.b;
    }
  }

  const teamA = G.teams[a];
  const teamB = G.teams[b];
  const sA = side(teamA);
  const sB = side(teamB);
  const isLeagueMatch = !!(G.m.career && tourneyMatchId && String(tourneyMatchId).startsWith("LG_"));
  const plan = generateMatchPlan(teamA, teamB, sA, sB, !isLeagueMatch);

  setupMatchFromNetwork(a, b, tourneyMatchId, plan);

  if (NET.connected && NET.role === "host") {
    sendNetMsg({
      type: "MATCH_SYNC",
      a,
      b,
      tourneyMatchId,
      plan: serializeMatchPlan(plan),
      autoStart: false
    });
  }
}

function setMatchTeam(which, val) {
  if (M && M.run) return;
  let a = M.a, b = M.b;
  if (which === "a") a = +val;
  else b = +val;
  if (a === b) {
    if (which === "a") b = (a + 1) % G.teams.length;
    else a = (b + 1) % G.teams.length;
  }
  matchSetup(a, b, null);
}

function setSimSpeed(sp, fromNet = false) {
  if (!M) return;
  M.speed = sp;
  if (M.run) {
    startIntervalLoop();
  }
  if (NET.connected && !fromNet) {
    sendNetMsg({ type: "MATCH_CTRL", action: "speed", speed: sp });
  }
  updateSpeedButtons();
}

function updateSpeedButtons() {
  [1, 2, 4].forEach(sp => {
    const btn = $("#sp-" + sp);
    if (btn) btn.className = "sm " + (M.speed === sp ? "pri" : "");
  });
}

function stepMinute(m) {
  const events = M.plan.scheduledByMin[m] || [];
  const names = [G.teams[M.a].name, G.teams[M.b].name];

  for (const ev of events) {
    const i = ev.side;
    if (ev.type === "goal") {
      M.sc[i]++;
      M.shots[i]++;
      M.onTarget[i]++;
      M.xg[i] += 0.36 + Math.random() * 0.22;

      const scId = ev.scorer.id;
      if (!M.playerStats[scId]) M.playerStats[scId] = { goals: 0, assists: 0, red: false };
      M.playerStats[scId].goals++;
      M.lastHighlightGoal = scId;

      let astText = "Bireysel";
      if (ev.assister) {
        const asId = ev.assister.id;
        if (!M.playerStats[asId]) M.playerStats[asId] = { goals: 0, assists: 0, red: false };
        M.playerStats[asId].assists++;
        M.lastHighlightAssist = asId;
        astText = `Asist: ${ev.assister.n}`;
      }

      M.goalsList[i].push({
        min: m,
        scorer: ev.scorer.n,
        assister: ev.assister ? ev.assister.n : null
      });

      M.log.push({
        min: m,
        isGoal: true,
        isRed: false,
        text: `GOL! <b>${ev.scorer.n}</b> topu ağlara gönderdi. <span class="muted">(${astText} · ${names[i]})</span>`
      });
    } else if (ev.type === "red") {
      M.redCards[i]++;
      M.perfFactor[i] = Math.round(M.perfFactor[i] * 0.82);
      const sideObj = i === 0 ? M.sa : M.sb;
      sideObj.att *= 0.82;
      sideObj.mid *= 0.82;
      sideObj.def *= 0.82;

      const pId = ev.player.id;
      if (!M.playerStats[pId]) M.playerStats[pId] = { goals: 0, assists: 0, red: false };
      M.playerStats[pId].red = true;

      M.log.push({
        min: m,
        isGoal: false,
        isRed: true,
        text: `KIRMIZI KART! <b>${ev.player.n}</b> (${names[i]}) oyun dışı kaldı. Takım performansı %${M.perfFactor[i]} seviyesine geriledi.`
      });
    } else if (ev.type === "save") {
      M.shots[i]++;
      M.onTarget[i]++;
      M.saves[1 - i]++;
      M.xg[i] += 0.11 + Math.random() * 0.1;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `<b>${ev.player.n}</b> (${names[i]}) şutunu çekti, kaleci <b>${ev.gk.n}</b> gole izin vermedi.`
      });
    } else if (ev.type === "post") {
      M.shots[i]++;
      M.xg[i] += 0.2;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `DİREK! <b>${ev.player.n}</b> (${names[i]}) sert vurdu, top direkten döndü.`
      });
    } else if (ev.type === "miss") {
      M.shots[i]++;
      M.xg[i] += 0.07;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `<b>${ev.player.n}</b> (${names[i]}) uygun pozisyonda şutunu auta gönderdi.`
      });
    } else if (ev.type === "card") {
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `<b>${ev.player.n}</b> (${names[i]}) sarı kart gördü.`
      });
    }
  }

  if (m === 45) {
    M.log.push({
      min: 45,
      isGoal: false,
      isRed: false,
      text: `<b>İlk Yarı Sona Erdi</b> · Skor: ${M.sc[0]} - ${M.sc[1]}`
    });
  } else if (m === 90 && M.plan.goesToET) {
    M.log.push({
      min: 90,
      isGoal: true,
      isRed: false,
      text: `<b>Normal Süre Berabere Tamamlandı (${M.sc[0]} - ${M.sc[1]})</b> · Uzatma devrelerine geçiliyor.`
    });
  } else if (m === 105 && M.plan.goesToET) {
    M.log.push({
      min: 105,
      isGoal: false,
      isRed: false,
      text: `<b>1. Uzatma Devresi Sona Erdi</b> · Skor: ${M.sc[0]} - ${M.sc[1]}`
    });
  }
}

function renderBracketHTML() {
  if (!T || G.m.career) return "";
  const nextPending = T.matches.find(x => !x.done && x.a != null && x.b != null);
  return `
    <div class="bracket-panel" id="bracket-box">
      <div class="panel-head" style="margin-bottom:4px">
        <div>
          <h2>Turnuva Eşleşme Ağacı</h2>
        </div>
        <div class="row">
          ${nextPending ? `
            <button class="sm pri" ${M && M.run ? "disabled" : ""} onclick="playBracketMatch('${nextPending.id}', false)">
              Sıradaki Maçı Oynat (${nextPending.title})
            </button>
          ` : ""}
          ${!T.champion ? `
            <button class="sm" ${M && M.run ? "disabled" : ""} onclick="simulateAllRemainingTournament()">
              Tüm Turnuvayı Hızlı Tamamla
            </button>
          ` : `
            <button class="sm" onclick="initTournament();matchSetup(T.matches[0].a, T.matches[0].b, T.matches[0].id)">
              Turnuvayı Sıfırla
            </button>
          `}
        </div>
      </div>

      <div class="bracket-grid">
        ${T.matches.map(bm => {
          const tA = bm.a != null ? G.teams[bm.a] : null;
          const tB = bm.b != null ? G.teams[bm.b] : null;
          const isCurrent = M && M.tourneyMatchId === bm.id;
          const canPlay = tA && tB && (!M || !M.run);
          return `
            <div class="br-card ${isCurrent ? 'active-match' : ''} ${bm.done ? 'done-match' : ''}">
              <div class="br-stage">
                <span>${bm.title}</span>
                <span>${bm.done ? "Tamamlandı" : (isCurrent ? "Sahada" : "Bekliyor")}</span>
              </div>
              <div class="br-team-row ${bm.done && bm.winner === bm.a ? 'winner-row' : ''}">
                <span class="club-cell">${tA ? `${renderTeamIdentityBadge(tA, 18)} <span>${tA.name}</span>` : '<span class="muted">Yarı Final 1 Kazananı</span>'}</span>
                <span class="br-score">${bm.done && bm.sc ? `${bm.sc[0]}${bm.pen ? ` (${bm.pen[0]})` : ''}` : (isCurrent ? M.sc[0] : "–")}</span>
              </div>
              <div class="br-team-row ${bm.done && bm.winner === bm.b ? 'winner-row' : ''}">
                <span class="club-cell">${tB ? `${renderTeamIdentityBadge(tB, 18)} <span>${tB.name}</span>` : '<span class="muted">Yarı Final Kazananı</span>'}</span>
                <span class="br-score">${bm.done && bm.sc ? `${bm.sc[1]}${bm.pen ? ` (${bm.pen[1]})` : ''}` : (isCurrent ? M.sc[1] : "–")}</span>
              </div>
              <div class="row" style="margin-top:4px;justify-content:space-between">
                <button class="sm ${!bm.done && canPlay ? 'pri' : ''}" ${canPlay ? "" : "disabled"} onclick="playBracketMatch('${bm.id}', false)">
                  ${bm.done ? "Tekrar İzle" : "Canlı Oynat (30 Sn)"}
                </button>
                ${!bm.done && tA && tB ? `
                  <button class="sm" ${canPlay ? "" : "disabled"} onclick="playBracketMatch('${bm.id}', true)">
                    Hızlı Sonuç
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      ${T.champion != null ? `
        <div class="champ-banner">
          <div class="club-cell" style="gap:12px">
            ${renderTeamIdentityBadge(G.teams[T.champion], 44)}
            <div>
              <span class="eyebrow" style="margin-bottom:2px">Turnuva Tamamlandı</span>
              <h3>ŞAMPİYON: ${G.teams[T.champion].name}</h3>
            </div>
          </div>
          <button class="gold" onclick="startDraft()">Yeni Draft Başlat</button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderPitchHTML(t, s, sideIdx) {
  const perf = M ? M.perfFactor[sideIdx] : 100;
  const rc = M ? M.redCards[sideIdx] : 0;
  const pitchRows = s.pitchRows || buildPitchRowsForTeam(t);
  return `
    <div class="sq ${t.me ? "you" : ""}" style="margin-bottom:0">
      <div class="sq-head">
        <h3 class="club-cell">${renderTeamIdentityBadge(t, 20)} <span>${t.name}</span> <span class="muted" style="font-size:.8rem">(${t.formation || "4-3-3"})</span></h3>
        <span class="muted" style="font-size:.78rem">
          Performans: <b style="color:${perf < 100 ? 'var(--bad)' : 'var(--pri-bright)'}">%${perf}</b>
          ${rc ? ` · <span style="color:var(--bad)">${rc} Kırmızı</span>` : ""}
        </span>
      </div>
      <div class="pitch">
        ${pitchRows.map(row => `
          <div class="pl-row">
            ${row.players.map(p => {
              const st = M.playerStats[p.id] || { goals: 0, assists: 0, red: false };
              const hiGoal = M.lastHighlightGoal === p.id ? "highlight-goal" : "";
              const hiAst = M.lastHighlightAssist === p.id ? "highlight-assist" : "";
              const outOfPos = p.pos !== row.pos;
              const redCls = st.red ? "red-carded" : "";
              return `
                <div class="pl ${hiGoal} ${hiAst} ${redCls}" title="${p.n} (${p.c}${outOfPos ? ' · Mevki Dışı -10 Rtg' : ''})">
                  <div class="row" style="gap:3px">${clubLogo(p.c, 15)} ${posTag(p.pos)}</div>
                  <small>${p.n.split(" ").pop()}</small>
                  ${(st.goals || st.assists || st.red || outOfPos) ? `
                    <div class="pl-events">
                      ${st.goals ? `<span class="ev-badge ev-goal">G${st.goals > 1 ? st.goals : ""}</span>` : ""}
                      ${st.assists ? `<span class="ev-badge ev-ast">A${st.assists > 1 ? st.assists : ""}</span>` : ""}
                      ${st.red ? `<span class="ev-badge ev-red">KK</span>` : ""}
                      ${outOfPos ? `<span class="ev-badge ev-red" title="Mevki Dışı (-10 Reyting)">-10</span>` : ""}
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        `).join("")}
      </div>
      <div class="muted" style="font-size:.76rem;margin-top:6px">
        <b>Yedekler:</b> ${(t.bench || []).map(b => `${b.n.split(" ").pop()} (${POS_SHORT[b.pos]})`).join(", ")}
      </div>
    </div>
  `;
}

function renderStatsComparison() {
  const totShots = M.shots[0] + M.shots[1];
  const possA = totShots ? Math.round(42 + 16 * (M.shots[0] / totShots)) : 50;
  const possB = 100 - possA;
  const rows = [
    ["Takım Performansı (%)", `%${M.perfFactor[0]}`, `%${M.perfFactor[1]}`, M.perfFactor[0] / 2, M.perfFactor[1] / 2],
    ["Topla Oynama (%)", `%${possA}`, `%${possB}`, possA, possB],
    ["Toplam Şut (İsabetli)", `${M.shots[0]} (${M.onTarget[0]})`, `${M.shots[1]} (${M.onTarget[1]})`,
      totShots ? (100 * M.shots[0] / totShots) : 50,
      totShots ? (100 * M.shots[1] / totShots) : 50],
    ["Gol Beklentisi (xG)", M.xg[0].toFixed(2), M.xg[1].toFixed(2),
      M.xg[0] + M.xg[1] ? (100 * M.xg[0] / (M.xg[0] + M.xg[1])) : 50,
      M.xg[0] + M.xg[1] ? (100 * M.xg[1] / (M.xg[0] + M.xg[1])) : 50],
    ["Kaleci Kurtarışı", M.saves[0], M.saves[1],
      M.saves[0] + M.saves[1] ? (100 * M.saves[0] / (M.saves[0] + M.saves[1])) : 50,
      M.saves[0] + M.saves[1] ? (100 * M.saves[1] / (M.saves[0] + M.saves[1])) : 50],
    ["Kırmızı Kart", M.redCards[0], M.redCards[1], 50, 50]
  ];
  return `
    <div class="stat-bars">
      ${rows.map(([label, vA, vB, wA, wB]) => `
        <div class="stat-row">
          <div class="stat-row-top">
            <b>${vA}</b>
            <span class="muted">${label}</span>
            <b>${vB}</b>
          </div>
          <div class="dual-bar">
            <div class="left-b" style="width:${wA}%"></div>
            <div class="right-b" style="width:${wB}%"></div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGoalAssistSummary() {
  const allGoals = [
    ...M.goalsList[0].map(g => ({ ...g, team: G.teams[M.a].name })),
    ...M.goalsList[1].map(g => ({ ...g, team: G.teams[M.b].name }))
  ].sort((x, y) => x.min - y.min);

  if (!allGoals.length) {
    return `<p class="muted" style="margin:0">Henüz gol kaydedilmedi.</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Dk.</th>
          <th>Takım</th>
          <th>Gol</th>
          <th>Asist</th>
        </tr>
      </thead>
      <tbody>
        ${allGoals.map(g => `
          <tr>
            <td><span class="min-tag">${g.min}'</span></td>
            <td class="muted">${g.team}</td>
            <td><b>${g.scorer}</b></td>
            <td>${g.assister ? `<b>${g.assister}</b>` : '<span class="muted">Bireysel</span>'}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function drawMatch() {
  const A = G.teams[M.a], B = G.teams[M.b];
  const stageObj = T && M.tourneyMatchId ? T.matches.find(x => x.id === M.tourneyMatchId) : null;
  const isCareerMatch = !!(G.m.career && M.tourneyMatchId && String(M.tourneyMatchId).startsWith("LG_"));
  const maxM = M.plan.maxMin || 90;

  app.innerHTML = hdr() + renderOnlineModal() + `
    ${renderBracketHTML()}

    <div class="row" style="margin-bottom:12px;justify-content:space-between">
      <div class="row">
        ${!isCareerMatch ? `
          <label>Ev Sahibi:
            <select id="sel-a" ${M.run ? "disabled" : ""} onchange="setMatchTeam('a', this.value)">
              ${G.teams.map((t, i) => `<option value="${i}" ${i === M.a ? "selected" : ""}>${t.name}</option>`).join("")}
            </select>
          </label>
          <span class="muted">vs</span>
          <label>Deplasman:
            <select id="sel-b" ${M.run ? "disabled" : ""} onchange="setMatchTeam('b', this.value)">
              ${G.teams.map((t, i) => `<option value="${i}" ${i === M.b ? "selected" : ""}>${t.name}</option>`).join("")}
            </select>
          </label>
        ` : `
          <span class="eyebrow">Premier Lig · ${LG ? (M.leagueWeekRecorded ? LG.week - 1 : LG.week) : 1}. Hafta Karşılaşması</span>
        `}
        <span class="muted" style="font-size:.8rem;margin-left:6px">Hız:</span>
        <button id="sp-1" class="sm ${M.speed === 1 ? 'pri' : ''}" onclick="setSimSpeed(1)">1x</button>
        <button id="sp-2" class="sm ${M.speed === 2 ? 'pri' : ''}" onclick="setSimSpeed(2)">2x</button>
        <button id="sp-4" class="sm ${M.speed === 4 ? 'pri' : ''}" onclick="setSimSpeed(4)">4x</button>
      </div>
      <div class="row">
        ${isCareerMatch && M.min >= maxM ? `
          <button class="pri" onclick="S.view='league_hub';render()">Puan Durumu & Fikstüre Dön →</button>
        ` : `
          <button class="pri" id="go-btn" onclick="toggleKickoff()">
            ${M.min === 0 ? "Maçı Başlat (30 Sn)" : (M.min >= maxM ? "Tekrar Oynat" : (M.run ? "Duraklat" : "Devam Et"))}
          </button>
          <button id="inst-btn" ${M.min >= maxM ? "disabled" : ""} onclick="finishInstantly()">Anında Bitir</button>
        `}
        ${isCareerMatch ? `<button onclick="if(M&&M.tm)clearInterval(M.tm);S.view='league_hub';render()">Lig Merkezine Dön</button>` : `<button onclick="if(M&&M.tm)clearInterval(M.tm);S.view='result';render()">Dizilişe Dön</button>`}
      </div>
    </div>

    <div class="scoreboard">
      <div class="sb-top">
        <div class="sb-team">
          <h2 class="club-cell">${renderTeamIdentityBadge(A, 34)} <span>${A.name}</span></h2>
          <div><span class="sb-avg">Diziliş: <b>${A.formation || "4-3-3"}</b> · Performans: <b id="pf-a">%${M.perfFactor[0]}</b></span></div>
        </div>
        <div class="score-box">
          <div class="score" id="sc">${M.sc[0]} - ${M.sc[1]}</div>
          <div class="pen-score" id="pen-sc">${M.penSc ? `Penaltılar: ${M.penSc[0]} - ${M.penSc[1]}` : ""}</div>
          <div class="clock-pill ${M.run ? 'live' : ''}" id="mn">
            ${M.min === 0 ? (stageObj ? stageObj.title : "Başlama Vuruşu") : (M.min >= maxM ? `${maxM}' Maç Bitti` : M.min + ". Dakika")}
          </div>
        </div>
        <div class="sb-team right">
          <h2 class="club-cell"><span>${B.name}</span> ${renderTeamIdentityBadge(B, 34)}</h2>
          <div><span class="sb-avg">Diziliş: <b>${B.formation || "4-3-3"}</b> · Performans: <b id="pf-b">%${M.perfFactor[1]}</b></span></div>
        </div>
      </div>

      <div class="sb-goals">
        <ul class="sb-goal-list" id="gl-a"></ul>
        <ul class="sb-goal-list right" id="gl-b"></ul>
      </div>

      <div class="bar"><i id="bar" style="width:${Math.min(100, (M.min / maxM) * 100)}%"></i></div>
    </div>

    <div class="match-grid" id="pitches-box">
      ${renderPitchHTML(A, M.sa, 0)}
      ${renderPitchHTML(B, M.sb, 1)}
    </div>

    <div class="match-grid">
      <div class="panel" style="margin-top:0">
        <h2>Maç Olayları</h2>
        <ul class="log" id="log"></ul>
      </div>
      <div>
        <div class="panel" style="margin-top:0">
          <h2>Gol & Asist Cetveli</h2>
          <div id="ga-table">${renderGoalAssistSummary()}</div>
        </div>
        <div class="panel">
          <h2>Maç İstatistikleri</h2>
          <div id="stats-box">${renderStatsComparison()}</div>
        </div>
      </div>
    </div>
  `;
  refreshMatchLiveDOM();
}

function refreshMatchLiveDOM() {
  if (!M || !$("#sc")) return;
  const maxM = M.plan.maxMin || 90;
  $("#sc").textContent = `${M.sc[0]} - ${M.sc[1]}`;
  const penEl = $("#pen-sc");
  if (penEl) penEl.textContent = M.penSc ? `Seri Penaltılar: ${M.penSc[0]} - ${M.penSc[1]}` : "";

  const pfA = $("#pf-a"), pfB = $("#pf-b");
  if (pfA) pfA.textContent = `%${M.perfFactor[0]}`;
  if (pfB) pfB.textContent = `%${M.perfFactor[1]}`;

  const mn = $("#mn");
  if (M.min === 0) {
    mn.textContent = "0' Başlama Vuruşu";
  } else if (M.min >= maxM) {
    const A = G.teams[M.a], B = G.teams[M.b];
    if (M.sc[0] === M.sc[1] && !M.penSc) {
      mn.textContent = `${maxM}' Maç Bitti · Berabere (${M.sc[0]}-${M.sc[1]})`;
    } else {
      const winSide = M.penSc ? (M.penSc[0] > M.penSc[1] ? 0 : 1) : (M.sc[0] > M.sc[1] ? 0 : 1);
      const winName = winSide === 0 ? A.name : B.name;
      mn.textContent = `${maxM}' Maç Bitti · Kazanan: ${winName}`;
    }
    mn.classList.remove("live");
  } else {
    mn.textContent = `${M.min}' ${M.min > 90 ? "(Uzatmalar)" : ""}`;
  }

  const bar = $("#bar");
  if (bar) bar.style.width = `${Math.min(100, (M.min / maxM) * 100)}%`;

  const glA = $("#gl-a"), glB = $("#gl-b");
  if (glA) {
    glA.innerHTML = M.goalsList[0].map(g =>
      `<li><b>${g.min}' ${g.scorer}</b> ${g.assister ? `<span class="muted">(Asist: ${g.assister})</span>` : ""}</li>`
    ).join("");
  }
  if (glB) {
    glB.innerHTML = M.goalsList[1].map(g =>
      `<li>${g.assister ? `<span class="muted">(Asist: ${g.assister})</span> ` : ""}<b>${g.scorer} ${g.min}'</b></li>`
    ).join("");
  }

  const pitchesBox = $("#pitches-box");
  if (pitchesBox) {
    pitchesBox.innerHTML = renderPitchHTML(G.teams[M.a], M.sa, 0) + renderPitchHTML(G.teams[M.b], M.sb, 1);
  }

  const gaTable = $("#ga-table");
  if (gaTable) gaTable.innerHTML = renderGoalAssistSummary();

  const statsBox = $("#stats-box");
  if (statsBox) statsBox.innerHTML = renderStatsComparison();

  const logEl = $("#log");
  if (logEl) {
    logEl.innerHTML = [...M.log].reverse().map(item => `
      <li class="${item.isGoal ? 'goal-item' : ''} ${item.isRed ? 'red-item' : ''}">
        <span class="min-tag">${item.min}'</span>
        <span>${item.text}</span>
      </li>
    `).join("") || `<li class="muted">Maç henüz başlamadı.</li>`;
  }
}

function startIntervalLoop() {
  if (M.tm) clearInterval(M.tm);
  const msPerMinute = 333.333 / M.speed;
  M.t0 = Date.now() - (M.min * msPerMinute);
  const maxM = M.plan.maxMin || 90;

  M.tm = setInterval(() => {
    if (!G || !M || !$("#sc")) {
      clearInterval(M.tm);
      return;
    }
    const targetMin = Math.min(maxM, Math.floor((Date.now() - M.t0) / msPerMinute));
    while (M.min < targetMin) {
      stepMinute(++M.min);
    }
    refreshMatchLiveDOM();
    if (M.min >= maxM) {
      clearInterval(M.tm);
      finishMatch();
    }
  }, 60);
}

function toggleKickoff(fromNet = false) {
  if (!M) return;
  const maxM = M.plan.maxMin || 90;
  if (M.min >= maxM) {
    matchSetup(M.a, M.b, M.tourneyMatchId);
    toggleKickoff(fromNet);
    return;
  }
  if (NET.connected && !fromNet) {
    sendNetMsg({ type: "MATCH_CTRL", action: "toggle" });
  }
  if (M.run) {
    M.run = 0;
    if (M.tm) clearInterval(M.tm);
    const goBtn = $("#go-btn");
    if (goBtn) goBtn.textContent = "Devam Et";
    const mn = $("#mn");
    if (mn) mn.classList.remove("live");
    return;
  }
  M.run = 1;
  const selA = $("#sel-a"), selB = $("#sel-b"), goBtn = $("#go-btn"), mn = $("#mn");
  if (selA) selA.disabled = true;
  if (selB) selB.disabled = true;
  if (goBtn) goBtn.textContent = "Duraklat";
  if (mn) mn.classList.add("live");
  startIntervalLoop();
}

function finishInstantly(fromNet = false) {
  if (!M) return;
  const maxM = M.plan.maxMin || 90;
  if (M.min >= maxM) return;
  if (NET.connected && !fromNet) {
    sendNetMsg({ type: "MATCH_CTRL", action: "instant" });
  }
  if (M.tm) clearInterval(M.tm);
  while (M.min < maxM) {
    stepMinute(++M.min);
  }
  finishMatch();
}

function finishMatch() {
  M.run = 0;
  const A = G.teams[M.a], B = G.teams[M.b];
  const isCareerMatch = !!(G.m.career && M.tourneyMatchId && String(M.tourneyMatchId).startsWith("LG_"));

  if (isCareerMatch) {
    if (!M.leagueWeekRecorded) {
      M.leagueWeekRecorded = true;
      finalizeCareerWeekAfterUserMatch(M.sc[0], M.sc[1], M.goalsList[0], M.goalsList[1]);
    }
    M.log.push({
      min: 90,
      isGoal: true,
      isRed: false,
      text: `<b>Lig Maçı Tamamlandı: ${A.name} ${M.sc[0]} - ${M.sc[1]} ${B.name}</b> · Diğer 9 Premier Lig maçı da simüle edildi.`
    });
    drawMatch();
    return;
  }

  let winnerIdx = M.sc[0] > M.sc[1] ? M.a : M.b;

  if (M.sc[0] === M.sc[1] && M.plan.goesToPenalties && M.plan.penaltyData) {
    const pd = M.plan.penaltyData;
    M.penSc = pd.score;
    winnerIdx = pd.winnerSide === 0 ? M.a : M.b;

    M.log.push({
      min: 120,
      isGoal: true,
      isRed: false,
      text: `<b>120 Dakika Berabere Bitti (${M.sc[0]} - ${M.sc[1]}) · Seri Penaltı Atışları Başlıyor</b>`
    });

    for (let r = 0; r < 5; r++) {
      const pA = pd.takersA[r] || "Oyuncu A";
      const pB = pd.takersB[r] || "Oyuncu B";
      const hitA = r < pd.score[0] ? "GOL" : "Kaçırdı";
      const hitB = r < pd.score[1] ? "GOL" : "Kaçırdı";
      M.log.push({
        min: "PEN",
        isGoal: false,
        isRed: false,
        text: `<b>${r + 1}. Penaltı:</b> ${A.name} - ${pA} (${hitA}) | ${B.name} - ${pB} (${hitB})`
      });
    }
  }

  const winner = G.teams[winnerIdx];
  if (M.tourneyMatchId) {
    recordTournamentMatchResult(M.tourneyMatchId, M.sc, M.penSc, winnerIdx, M.goalsList);
  }

  let mvp = winner.starters[0] || winner.picks[0];
  let bestScore = -1;
  [...A.starters, ...B.starters].forEach(p => {
    const st = M.playerStats[p.id] || { goals: 0, assists: 0, red: false };
    const sc = p.r + st.goals * 15 + st.assists * 10 - (st.red ? 25 : 0);
    if (sc > bestScore) {
      bestScore = sc;
      mvp = p;
    }
  });
  const mvpStats = M.playerStats[mvp.id] || { goals: 0, assists: 0 };

  const penSummary = M.penSc ? ` (Penaltılar: ${M.penSc[0]}-${M.penSc[1]})` : (M.plan.goesToET ? " (Uzatmalarda)" : "");
  M.log.push({
    min: M.plan.maxMin || 90,
    isGoal: true,
    isRed: false,
    text: `<b>Maç Sonucu: ${A.name} ${M.sc[0]} - ${M.sc[1]} ${B.name}${penSummary}</b> · Kazanan: <b>${winner.name}</b> · Maçın Oyuncusu: <b>${mvp.n}</b> (${mvpStats.goals}G, ${mvpStats.assists}A)`
  });

  drawMatch();
}

function render() {
  if (S.view === "clubs") return renderClubSelectScreen();
  if (!G || S.view === "setup") return setup();
  if (S.view === "identity") return renderIdentityScreen();
  if (S.view === "league_select") return renderCareerLeagueSelector();
  if (S.view === "league_hub") return renderLeagueHub();
  if (S.view === "match" && M) return drawMatch();
  if (G.k >= G.order.length || S.view === "result") return renderResult();
  return renderDraft();
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get("room");
  if (roomParam) {
    S.onlineModal = true;
    render();
    setTimeout(() => joinOnlineRoom(roomParam), 300);
  } else {
    render();
  }
});

render();
