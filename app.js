// ANA UYGULAMA, DRAFT MOTORU, ÇARK DRAFTI, 11+3 KADRO DİZİLİŞİ VE MAÇ SİMÜLATÖRÜ

const MODES = [
  { id: "classic", name: "Klasik Draft", tag: "En güçlü kadroyu kur", d: "11 asil + 3 yedek oyuncuyu sırayla seç. Reytingler gizlidir, futbol bilginle en iyi kadroyu oluştur!", clubs: "optional", cpu: "best" },
  { id: "wheel", name: "Çark Draftı", tag: "Takım çarkını çevir", d: "Seçtiğin tüm takımlar çarka yerleşir! Sıran geldiğinde çarkı çevir, çıkan kulübün verdiği oyuncuyu kadrona kat.", clubs: "optional", cpu: "best", wheel: 1 },
  { id: "club", name: "Kulüp Draftı", tag: "Sadece seçtiğin kulüpler", d: "Belirlediğin kulüplerin oyuncularıyla draft yap. Dev derbiler ve El Clasico kadroları için ideal.", clubs: "required", cpu: "best" },
  { id: "league", name: "Lig Draftı", tag: "Tek lig veya çoklu lig", d: "Lig seçiciden istediğin ligi seç; o ligdeki tüm kulüpler ve oyuncularla sınır olmadan draft yap.", clubs: "none", cpu: "best" },
  { id: "random", name: "Rastgele Draft", tag: "Şans kadronu kursun", d: "Seçimler rastgele yapılır. İstersen tek tuşla tüm kadroları tamamla ve maça geç.", clubs: "optional", cpu: "random" },
  { id: "budget", name: "Bütçe Draftı", tag: "350 M€ · İndirimsiz Sabit Fiyat", d: "350 M€ bütçe ile 14 oyuncu (11 Asil + 3 Yedek) seç. Kalan en ucuz oyunculara para yetmeyecekse sistem uyarır ve alımı iptal eder!", clubs: "optional", cpu: "best", budget: 350 }
];

function cost(p) {
  const r = p.r || 75;
  if (r <= 72) return 5;
  if (r <= 75) return 6 + (r - 72);
  if (r <= 79) return 9 + Math.round((r - 75) * 1.25);
  if (r <= 83) return 14 + Math.round((r - 79) * 2.0);
  if (r <= 87) return 22 + Math.round((r - 83) * 3.5);
  return 36 + Math.round((r - 87) * 5.0);
}

const tier = r => r >= 88 ? "e" : r >= 85 ? "h" : r >= 82 ? "g" : r >= 78 ? "m" : "";
const rt = r => `<span class="pos-badge pos-MID">★</span>`;
const posTag = pos => `<span class="pos-badge pos-${pos || 'MID'}">${POS_SHORT[pos || 'MID']}</span>`;

let S = {
  view: "setup",
  mode: "classic",
  leagues: new Set(["Premier Lig", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]),
  clubs: new Set(),
  opp: 1, // Varsayılan 1 rakip (2 Bilgisayar Karşılıklı Online veya 1v1 için ideal; 2 veya 3 seçilirse Yarı Final/Final Turnuvası)
  humanCount: 1,
  format: "snake",
  strictPos: true,
  teamName: "Senin Takımın",
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
let W = { spinning: false, angle: 0, selectedClub: null, offeredPlayers: [], jokers: 3 };
let SWAP = { teamIdx: 0, selectedId: null };

const $ = s => document.querySelector(s);
const app = $("#app");
const currentMode = () => MODES.find(m => m.id === S.mode) || MODES[0];

function hdr() {
  return `
    <header class="top">
      <div class="logo-wrap">
        <div class="logo-badge">FD</div>
        <div>
          <div class="logo">Futbol <span>Draft</span></div>
          <span class="logo-sub">5 Büyük Lig · 2 PC Canlı Online · Çark & 11+3 Turnuva</span>
        </div>
      </div>
      <div class="nav-actions">
        <button class="${NET.connected || S.onlineModal ? 'pri' : 'gold'}" onclick="toggleOnlineModal()">
          🌐 ${NET.connected ? `Canlı Oda (${NET.roomCode})` : "Online Oda Kur / Katıl (2 PC)"}
        </button>
        ${G ? `<button onclick="S.view='result';render()">📋 Kadro & Diziliş (11+3)</button>` : ""}
        ${G ? `<button onclick="goMatchDirect()">🏆 Turnuva & Maç Simülatörü</button>` : ""}
        ${S.view !== "setup" ? `<button onclick="resetToSetup()">🏠 Ana Menü</button>` : ""}
      </div>
    </header>
    ${renderNetStatusBar()}
  `;
}

function togglePoolView() { S.view = "setup"; render(); }
function renderPoolExplorer() { setup(); }
function renderPoolRows() { return ""; }
function updatePoolTable() {}

function resetToSetup() {
  if (M && M.tm) clearInterval(M.tm);
  G = null;
  M = null;
  T = null;
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
  S.onlineMsg = `<p class="ok-msg">✅ ${onlyCode ? "5 Haneli Oda Kodu" : "Canlı Oda Davet Linki"} kopyalandı! Arkadaşına gönder, tıkladığı anda odana bağlanacak.</p>`;
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
  const inviteUrl = getRoomInviteUrl();
  return `
    <div class="modal-backdrop" onclick="toggleOnlineModal()">
      <div class="modal-card" onclick="event.stopPropagation()">
        <div class="panel-head">
          <h2>🌐 İki Bilgisayar Karşılıklı Canlı Online (WebRTC P2P)</h2>
          <button class="sm" onclick="toggleOnlineModal()">✕ Kapat</button>
        </div>

        <p class="muted" style="margin:0 0 12px;font-size:.87rem">
          GitHub Pages üzerinde veya farklı internet bağlantılarında iki bilgisayar doğrudan birbirine bağlanır. Sırayla canlı oyuncu seçer, İlk 11 + 3 Yedek dizilişini yapar ve 90 dakikalık maçı aynı anda canlı izlersiniz!
        </p>

        <div style="margin-bottom:14px">
          <label style="font-weight:600;font-size:.86rem">Takım Adın:
            <input value="${S.teamName}" oninput="S.teamName=this.value||'Senin Takımın'" style="width:220px;margin-left:8px">
          </label>
        </div>

        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px">
          <div style="background:var(--raised);padding:14px;border-radius:10px;border:1px solid var(--border)">
            <h3 style="color:var(--pri);margin-bottom:6px">1. Bilgisayar: Oda Kur (Host)</h3>
            <p class="muted" style="font-size:.82rem;margin:0 0 10px">Odayı sen kur, oluşan 5 haneli Oda Kodunu veya Davet Linkini arkadaşına gönder.</p>
            <button class="pri" onclick="createOnlineRoom()" style="width:100%">🏠 Canlı Online Oda Kur</button>

            ${NET.role === "host" && NET.roomCode ? `
              <div style="margin-top:12px;text-align:center">
                <div class="muted" style="font-size:.78rem;margin-bottom:4px">Oda Kodun:</div>
                <div class="room-code-box">${NET.roomCode}</div>
                <div class="row" style="margin-top:10px;justify-content:center">
                  <button class="sm pri" onclick="copyInviteUrl(false)">📋 Davet Linkini Kopyala</button>
                  <button class="sm" onclick="copyInviteUrl(true)">🔑 Kodu Kopyala</button>
                </div>
              </div>
            ` : ""}
          </div>

          <div style="background:var(--raised);padding:14px;border-radius:10px;border:1px solid var(--border)">
            <h3 style="color:var(--t-elite);margin-bottom:6px">2. Bilgisayar: Odaya Katıl</h3>
            <p class="muted" style="font-size:.82rem;margin:0 0 10px">Arkadaşının gönderdiği 5 haneli Oda Kodunu aşağıya yazıp bağlan.</p>
            <div class="row">
              <input id="friend-code-inp" placeholder="Örn: 48291" value="${NET.role === 'guest' ? NET.roomCode : ''}" style="flex:1;font-family:var(--mono);font-size:1rem;text-align:center">
              <button class="gold" onclick="joinOnlineRoom()">🚀 Bağlan</button>
            </div>
          </div>
        </div>

        ${NET.connected ? `
          <div style="margin-top:14px;padding:12px;background:oklch(0.89 0.2 124 / 0.12);border:1px solid var(--pri);border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <div>
              <b>🟢 ${NET.peerName} ile Canlı Bağlantı Aktif!</b>
              <div class="muted" style="font-size:.82rem">${NET.role === "host" ? "Oda kurucu sensin. Draftı başlattığında iki ekranda birden açılacak." : "Oda kurucunun draftı başlatması bekleniyor..."}</div>
            </div>
            ${NET.role === "host" ? `<button class="pri" onclick="startDraft()">⚽ Karşılıklı Online Draftı Başlat!</button>` : ""}
          </div>
        ` : ""}

        ${NET.role ? `
          <div style="margin-top:10px;text-align:right">
            <button class="sm warn-btn" onclick="disconnectOnlineRoom()">🔌 Online Bağlantıyı Kes</button>
          </div>
        ` : ""}

        ${S.onlineMsg || ""}
      </div>
    </div>
  `;
}

// 6. KURULUM EKRANI
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
  S.err = "";
  render();
}

function selectAllLeagues() {
  S.leagues = new Set(LEAGUES);
  S.err = "";
  render();
}

function setup() {
  const m = currentMode();
  const cl = m.clubs !== "none";
  const activeClubs = CLUBS.filter(c => S.leagues.has(CLUB_TO_LEAGUE[c] || "Diğer") || !CLUB_TO_LEAGUE[c]);
  const activePlayerCount = P.filter(p => S.leagues.has(p.lg)).length;

  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">5 Büyük Lig · 2026-27 · 2 Bilgisayar Canlı Online P2P</span>
      <h1>Futbol Draft · Online, Çark, 11+3 Yedek & Turnuva</h1>
      <p>İster <b>Online Oda Kurarak</b> farklı bilgisayardaki arkadaşınla karşılıklı canlı oyna, ister CPU rakiplerle Yarı Final ve Final turnuvasına katıl! <b>11 Asil + 3 Yedek</b> kadronu kur, İlk 11'ini diz ve şans faktörü, kırmızı kart, uzatma ve penaltılarla dolu 90 dakikayı yaşa.</p>
      <div class="hero-stats">
        <div class="stat-pill"><b>🌐 2 PC Canlı</b> WebRTC P2P Online Draft</div>
        <div class="stat-pill"><b>11 + 3</b> İlk 11 & Yedek Kulübesi</div>
        <div class="stat-pill"><b>🎡 Çark</b> Takım Çarkı Modu</div>
        <div class="stat-pill"><b>🟥 & Penaltı</b> Uzatma, Penaltı & Kırmızı Kart</div>
      </div>
    </section>

    <div class="grid modes">
      ${MODES.map(x => `
        <button class="mode" aria-pressed="${x.id === S.mode}" onclick="S.mode='${x.id}';S.err='';render()">
          <div>
            <small>${x.tag}</small>
            <h3>${x.id === 'wheel' ? '🎡 ' : ''}${x.name}</h3>
            <p>${x.d}</p>
          </div>
        </button>
      `).join("")}
    </div>

    <div class="panel">
      <div class="panel-head">
        <div>
          <h2>🌍 Lig Seçici (Aktif Havuz: ${activePlayerCount} Oyuncu)</h2>
          <p class="muted" style="margin:2px 0 0;font-size:.84rem">Drafta ve Çarka dahil etmek istediğin ligleri seç.</p>
        </div>
        <div class="row">
          <button class="sm ${S.leagues.size === LEAGUES.length ? 'pri' : ''}" onclick="selectAllLeagues()">Tüm 5 Büyük Ligi Seç</button>
        </div>
      </div>
      <div class="league-grid">
        ${LEAGUES_META.map(lg => {
          const lgPlayers = P.filter(p => p.lg === lg.id);
          const lgClubs = [...new Set(lgPlayers.map(p => p.c))];
          const isSel = S.leagues.has(lg.id);
          return `
            <div class="league-card" aria-pressed="${isSel}" onclick="toggleLeague('${lg.id}')">
              <div class="lg-title">
                <span>${lg.flag} ${lg.name}</span>
                <span style="font-size:.83rem;color:${isSel ? 'var(--pri)' : 'var(--muted)'}">${isSel ? "✓ Seçili" : "Kapalı"}</span>
              </div>
              <div class="lg-meta">${lgClubs.length} Kulüp · ${lgPlayers.length} Oyuncu</div>
              <div style="margin-top:4px">
                <button class="sm" onclick="event.stopPropagation();selectOnlyLeague('${lg.id}')">Sadece ${lg.name}</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    ${cl ? `
      <div class="panel">
        <div class="panel-head">
          <h2>🛡️ Kulüp Seçimi ${m.clubs === "required" ? "(En az 2 kulüp seç)" : "(Seçilmezse seçili liglerdeki tüm kulüpler dahil)"}</h2>
          <div class="row">
            <button class="sm" onclick="selectEuropeanGiants()">Avrupa Devleri (12 Kulüp)</button>
            <button class="sm" onclick="selectBigSix()">Premier Lig Big 6</button>
            <button class="sm" onclick="S.clubs.clear();render()">Temizle</button>
          </div>
        </div>
        <div class="chips">
          ${activeClubs.map(c => {
            const esc = c.replace(/'/g, "\\'");
            return `<button class="chip" aria-pressed="${S.clubs.has(c)}" onclick="toggleClub('${esc}')">${clubLogo(c, 18)} ${c}</button>`;
          }).join("")}
        </div>
      </div>
    ` : ""}

    <div class="panel">
      <h2>⚙️ Draft, Yedek & Online Turnuva Ayarları</h2>
      <div class="row" style="gap:14px">
        <label>Takım Adın:
          <input value="${S.teamName}" oninput="S.teamName=this.value||'Senin Takımın'" style="width:165px">
        </label>
        <label>Toplam Takım (Turnuva):
          <select onchange="S.opp=+this.value;if(S.humanCount>S.opp+1)S.humanCount=S.opp+1;render()">
            <option value="1" ${S.opp === 1 ? "selected" : ""}>2 Takım (1v1 Doğrudan Final)</option>
            <option value="2" ${S.opp === 2 ? "selected" : ""}>3 Takım (Yarı Final + Final)</option>
            <option value="3" ${S.opp === 3 ? "selected" : ""}>4 Takım (Yarı Final & Final Turnuvası)</option>
          </select>
        </label>
        <label>Oyun Türü:
          <select onchange="S.humanCount=+this.value;render()">
            <option value="1" ${S.humanCount === 1 ? "selected" : ""}>Tek Bilgisayar (Sen vs CPU) veya 2 PC Online</option>
            ${Array.from({ length: S.opp }, (_, idx) => idx + 2).map(cnt => `
              <option value="${cnt}" ${S.humanCount === cnt ? "selected" : ""}>Aynı Bilgisayarda ${cnt} Arkadaş Sıralı</option>
            `).join("")}
          </select>
        </label>
        <label>Draft Sırası:
          <select onchange="S.format=this.value">
            <option value="snake" ${S.format === "snake" ? "selected" : ""}>Yılan (Snake - Her tur döner)</option>
            <option value="linear" ${S.format === "linear" ? "selected" : ""}>Doğrusal (Sabit sıra)</option>
          </select>
        </label>
      </div>
      <div class="row" style="margin-top:14px">
        <button class="pri" onclick="startDraft()">⚽ ${NET.connected ? "Canlı Online Draftı Başlat!" : "Drafta Başla (11 Asil + 3 Yedek)"}</button>
        <button class="gold" onclick="toggleOnlineModal()">🌐 İki Bilgisayar Online Oda Kur / Katıl</button>
        <button onclick="quickDraftAndSim()">⚡ Hızlı Kadro Kur & Dizilişe Geç</button>
      </div>
      ${S.err ? `<p class="err">${S.err}</p>` : ""}
    </div>

    <div class="panel">
      <h2>📥 Özel Oyuncu Listesi Yükle</h2>
      <p class="muted" style="margin:0 0 10px">Kulüp bloklu metin veya CSV yapıştırabilirsiniz.</p>
      <textarea id="imp" rows="3" placeholder="Real Madrid&#10;Thibaut Courtois 87 GK&#10;Jude Bellingham 90 OS&#10;Kylian Mbappe 91 FV"></textarea>
      <div class="row" style="margin-top:10px">
        <button onclick="doImport()">Listeyi Yükle</button>
        <button onclick="resetPool()">Varsayılan 5 Büyük Lig Havuzu (${DEFAULT_ROWS.length} Oyuncu)</button>
      </div>
      ${S.impMsg || ""}
    </div>
  `;
}

function toggleClub(c) {
  if (S.clubs.has(c)) S.clubs.delete(c);
  else S.clubs.add(c);
  render();
}

function selectBigSix() {
  S.leagues.add("Premier Lig");
  S.clubs = new Set(["Manchester City", "Arsenal", "Liverpool", "Chelsea", "Manchester United", "Tottenham"]);
  render();
}

function selectEuropeanGiants() {
  S.leagues = new Set(["Premier Lig", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]);
  S.clubs = new Set([
    "Manchester City", "Arsenal", "Liverpool", "Chelsea",
    "Real Madrid", "Barcelona", "Atletico Madrid",
    "Inter", "Juventus", "Milan",
    "Bayern Munchen", "PSG"
  ]);
  render();
}

function doImport() {
  const val = ($("#imp") && $("#imp").value) || "";
  const r = parseList(val);
  const ok = r.rows.filter(x => x.rating != null);
  if (!ok.length) {
    S.impMsg = '<p class="err">Geçerli oyuncu bulunamadı.</p>';
    return render();
  }
  setPool(ok);
  S.leagues = new Set(LEAGUES);
  S.clubs.clear();
  S.impMsg = `<p class="ok-msg">${ok.length} oyuncu başarıyla yüklendi.</p>`;
  render();
}

function resetPool() {
  setPool(DEFAULT_ROWS);
  S.leagues = new Set(LEAGUES);
  S.clubs.clear();
  S.impMsg = `<p class="ok-msg">Varsayılan 5 Büyük Lig 2026-27 (${DEFAULT_ROWS.length} oyuncu) havuzu geri yüklendi.</p>`;
  render();
}

// 7. DRAFT MOTORU
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
  return G.pool.reduce((a, b) => b.r < a.r ? b : a, G.pool[0]);
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
      reason: `🚫 Satın Alma İptal Edildi! ${p.n} (${price} M€) için kalan bütçen (${remBudget} M€) yetersiz.`
    };
  }

  if (remSlots > 0) {
    const minReserve = calcMinReserveAfterPick(t, p);
    if (remBudget - price < minReserve) {
      return {
        ok: false,
        reason: `⚠️ Bütçe Uyarısı — Alım İptal Edildi! ${p.n} (${price} M€) alınırsa kalan ${remSlots} oyuncu için sadece ${remBudget - price} M€ kalır; ancak kalan boş mevkilerdeki en ucuz oyuncuları tamamlayabilmek için en az ${minReserve} M€ gerekiyor!`
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
  let pool = P.filter(p => S.leagues.has(p.lg));
  if (m.clubs !== "none" && S.clubs.size) {
    pool = pool.filter(p => S.clubs.has(p.c));
  }
  if (m.clubs === "required" && S.clubs.size < 2) {
    S.err = "Kulüp Draftı için en az 2 kulüp seçmelisin.";
    return null;
  }
  const n = S.opp + 1;
  if (pool.length < n * ROUNDS) {
    S.err = `Seçili havuzda 14 kişilik (11 Asil + 3 Yedek) kadrolar için yeterli oyuncu yok (${pool.length} mevcut, ${n} takım için en az ${n * ROUNDS} oyuncu gerekli). Lütfen daha fazla kulüp veya lig seçin.`;
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
    if (min14Cost + 35 > activeBudget) {
      activeBudget = Math.ceil((min14Cost + 55) / 10) * 10;
    }
  }

  const cpuNames = ["Madrid & Londra XI", "Milano & Münih XI", "Paris & Kuzey XI"];
  const effectiveHumans = NET.connected ? 2 : S.humanCount;
  const teams = [];
  for (let i = 0; i < n; i++) {
    const isHuman = i < effectiveHumans;
    let tName;
    if (NET.connected) {
      if (i === 0) tName = NET.role === "host" ? (S.teamName || "1. Oyuncu (Host)") : NET.peerName;
      else if (i === 1) tName = NET.role === "guest" ? (S.teamName || "2. Oyuncu (Misafir)") : NET.peerName;
      else tName = cpuNames[i - 1] || ("CPU " + i);
    } else {
      tName = i === 0 ? (S.teamName || "1. Oyuncu") : (isHuman ? `${i + 1}. Oyuncu (Arkadaş)` : `${cpuNames[i - 1] || ("CPU " + i)}`);
    }

    const isMeLocal = NET.connected ? (i === NET.myTeamIdx) : isHuman;
    teams.push({
      name: tName,
      me: isMeLocal ? 1 : 0,
      isHuman,
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

function quickDraftAndSim() {
  const state = buildDraftState();
  if (!state) return render();
  S.err = "";
  G = state;
  T = null;
  autoCompleteDraft(true);
  S.view = "result";
  render();
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
    initTournament();
    S.view = "result";
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

  // Online modda sıra kontrolü
  if (!isCpu && !isMyTurnNow()) {
    G.budgetWarning = `⏳ Şu an sıra ${t.name} takımında! Arkadaşının seçim yapmasını bekle.`;
    return render();
  }

  if (!canTeamPickPos(t, p.pos, G.pool, G.taken)) {
    if (!isCpu) {
      G.budgetWarning = `⚠️ Pozisyon Kuralı: İlk 11'de zorunlu mevkileri tamamlamak için şu an ${POS_LABEL[p.pos]} yerine eksik mevkilerden seçim yapmalısın!`;
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

  if (G.m.cpu === "random" || G.m.id === "wheel") {
    const topSlice = av.slice().sort((a, b) => b.r - a.r).slice(0, Math.min(18, av.length));
    return topSlice[(Math.random() * topSlice.length) | 0];
  }

  if (G.m.budget) {
    const remBudget = G.m.budget - t.spent;
    const remSlots = ROUNDS - t.picks.length;
    const targetAvg = (remBudget / remSlots) * 1.35;
    const balanced = av.filter(p => cost(p) <= targetAvg);
    const poolToUse = balanced.length ? balanced : av;
    return poolToUse.reduce((a, b) => b.r > a.r ? b : a, poolToUse[0]);
  }

  return av.reduce((a, b) => b.r > a.r ? b : a, av[0]);
}

let cpuTimer = null;
function cpuLoop() {
  if (cpuTimer) clearTimeout(cpuTimer);
  if (!G || G.k >= G.order.length) return;
  const t = G.teams[G.order[G.k]];
  if (t.isHuman) return;
  // Online modda CPU seçimlerini sadece Host hesaplar ve Misafire gönderir
  if (NET.connected && NET.role === "guest") return;

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
  const topPool = av.slice().sort((a, b) => b.r - a.r).slice(0, Math.min(12, av.length));
  const chosen = topPool[(Math.random() * topPool.length) | 0];
  pick(chosen.id, false);
}

function autoCompleteDraft(silent = false) {
  if (!G) return;
  if (NET.connected && NET.role === "guest" && !silent) {
    G.budgetWarning = "Online odada Otomatik Tamamlama işlemini yalnızca Oda Kurucu (Host) başlatabilir.";
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
  initTournament();
  if (NET.connected && NET.role === "host") {
    sendNetMsg({
      type: "AUTO_COMPLETE_SYNC",
      picksByTeam: G.teams.map(tm => tm.picks.map(p => p.id))
    });
  }
  S.view = "result";
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
  if (!cv || !G) return;
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
    const cr = CLUB_CRESTS[c] || { c1: "#10b981", c2: "#064e3b", code: c.slice(0, 3).toUpperCase() };

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rad, a0, a1);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? cr.c1 : (cr.c2 === "#FFFFFF" ? "#1e293b" : cr.c2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a0 + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = (i % 2 === 0 && (cr.c1 === "#FFFFFF" || cr.c1 === "#FDE100" || cr.c1 === "#FFCD00")) ? "#111" : "#FFF";
    ctx.font = "700 10px 'Barlow Condensed', sans-serif";
    const label = clubs.length > 18 ? cr.code : c.slice(0, 13);
    ctx.fillText(label, rad - 10, 3.5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
  ctx.strokeStyle = "#a3e635";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#a3e635";
  ctx.font = "800 11px 'Barlow Condensed', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ÇARK", cx, cy + 4);
}

function spinClubWheel(useJoker = false) {
  if (!G || W.spinning || !isMyTurnNow()) return;
  const t = G.teams[G.order[G.k]];
  if (useJoker) {
    if (W.jokers <= 0) return;
    W.jokers--;
  }

  const clubs = getWheelClubsForTurn(t);
  if (!clubs.length) return;

  W.spinning = true;
  W.selectedClub = null;
  W.offeredPlayers = [];
  render();

  const totalSpin = Math.PI * 2 * (5 + Math.random() * 4);
  const startAngle = W.angle;
  const duration = 1750;
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
        <h3>${t.name} ${isTurn ? '<span style="color:var(--pri)">· SIRADA</span>' : ""}</h3>
        <span>
          <b>${t.picks.length}/${ROUNDS} Oyuncu</b> (11+3)
          ${G && G.m.budget ? ` · Kalan Bütçe: <b style="color:var(--pri)">${remB} M€</b>` : ""}
        </span>
      </div>
      <div class="sq-quotas">
        ${POSITIONS.map(k => `
          <span class="q-pill ${counts[k] >= FORMATION_QUOTA[k] ? 'full' : ''}">
            ${POS_SHORT[k]}: ${counts[k]}/${FORMATION_QUOTA[k]}+
          </span>
        `).join("")}
        <span class="q-pill">Yedek Kapasitesi: 3</span>
      </div>
      <ol>
        ${t.picks.map((p, idx) => `
          <li>
            <span class="club-cell">
              ${posTag(p.pos)}
              ${clubLogo(p.c, 16)}
              <b>${p.n}</b>
              <span class="muted" style="font-size:.78rem">${p.c}</span>
            </span>
            <span class="muted" style="font-size:.78rem">
              ${G && G.m.budget ? `${cost(p)} M€` : (idx < 11 ? "Kadro" : "Yedek")}
            </span>
          </li>
        `).join("") || '<li class="muted">Henüz oyuncu seçilmedi</li>'}
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
    .slice(0, 100);

  return l.map(p => {
    const okPos = canTeamPickPos(t, p.pos, G.pool, G.taken);
    const bStatus = checkBudgetStatus(t, p);
    const isWheelMode = G.m.id === "wheel";
    const wheelAllowed = !isWheelMode || (W.selectedClub === p.c && W.offeredPlayers.some(x => x.id === p.id));

    let btnClass = "pri sm";
    let btnLabel = "Seç";
    let disabledAttr = "";

    if (!myTurn) {
      btnLabel = "Rakibin Sırası";
      disabledAttr = "disabled";
    } else if (isWheelMode && !wheelAllowed) {
      btnLabel = "Çarktan Seçilir";
      disabledAttr = "disabled";
    } else if (!okPos) {
      btnLabel = "Zorunlu Mevki Eksik";
      btnClass = "warn-btn sm";
    } else if (G.m.budget && !bStatus.ok) {
      btnLabel = "⚠️ Bütçe Uyarısı";
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
        <canvas id="wheel-cv" width="240" height="240"></canvas>
      </div>
      <div class="wheel-result-card">
        <div class="panel-head" style="margin-bottom:8px">
          <div>
            <h2>🎡 Takım & Oyuncu Çarkı</h2>
            <p class="muted" style="margin:2px 0 0;font-size:.84rem">
              Çarkı çevir; gelen kulübün sana verdiği oyuncuyu kadrona kat! (Joker Hakkı: <b>${W.jokers}</b>)
            </p>
          </div>
          <div class="row">
            <button class="pri" ${!myTurn || W.spinning || W.selectedClub ? "disabled" : ""} onclick="spinClubWheel(false)">
              🎡 ÇARKI ÇEVİR!
            </button>
            ${W.selectedClub && W.jokers > 0 && myTurn ? `
              <button class="sm" ${W.spinning ? "disabled" : ""} onclick="spinClubWheel(true)">
                🔄 Joker Kullan & Tekrar Çevir (${W.jokers})
              </button>
            ` : ""}
          </div>
        </div>

        ${W.selectedClub ? `
          <div style="background:var(--raised);padding:12px;border-radius:10px;border:1px solid var(--pri)">
            <div class="row" style="justify-content:space-between;margin-bottom:8px">
              <span class="club-cell" style="font-size:1.1rem;font-weight:700">
                ${clubLogo(W.selectedClub, 26)} Çarktan Çıkan Kulüp: <span style="color:var(--pri)">${W.selectedClub}</span>
              </span>
              <span class="lg-tag">${CLUB_TO_LEAGUE[W.selectedClub] || ""}</span>
            </div>
            <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px">
              ${W.offeredPlayers.map((p, idx) => `
                <div class="row" style="justify-content:space-between;background:var(--card);padding:8px 10px;border-radius:8px;border:1px solid var(--border)">
                  <span>${posTag(p.pos)} <b>${p.n}</b> <small class="muted">(${idx === 0 ? "Ana Çark Oyuncusu" : "Alternatif"})</small></span>
                  <button class="pri sm" ${myTurn ? "" : "disabled"} onclick="pick(${p.id})">Kadroya Al</button>
                </div>
              `).join("")}
            </div>
          </div>
        ` : `
          <div class="muted" style="padding:10px 0">
            ${W.spinning ? "🎡 Çark dönüyor, kulüp belirleniyor..." : (myTurn ? "👉 Sıradaki oyuncunu çekmek için <b>'ÇARKI ÇEVİR!'</b> butonuna tıkla." : `⏳ <b>${t.name}</b> çarkı çeviriyor...`)}
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
        <b>${myTurn ? `🟢 Sıra Sende (${t.name}) — ${G.m.id === 'wheel' ? 'Çarkı Çevir!' : 'Oyuncu Seç'}` : `⏳ ${t.name} seçim yapıyor…`}</b>
        <div class="muted" style="font-size:.85rem;margin-top:2px">
          ${G.m.name} · Seçim ${G.k + 1} / ${G.order.length} (11 Asil + 3 Yedek = 14 Oyuncu)
          ${G.m.budget ? ` · Kalan Bütçe: <b style="color:var(--pri)">${remB} M€</b> (Kalan en ucuz slotlar için min rezerv: ${minNextReserve} M€)` : ""}
        </div>
      </div>
      <div class="row">
        <button class="sm" ${G.history.length ? "" : "disabled"} onclick="undoLastPick()">↩ Geri Al</button>
        <button class="sm" ${myTurn && G.m.id !== 'wheel' ? "" : "disabled"} onclick="pickRandomForMe()">🎲 Rastgele Seç</button>
        <button class="sm pri" ${NET.connected && NET.role === "guest" ? "disabled" : ""} onclick="autoCompleteDraft()">⚡ Otomatik Tamamla</button>
      </div>
    </div>

    ${G.budgetWarning ? `<div class="err">${G.budgetWarning}</div>` : ""}

    ${renderWheelSection(t)}

    <div class="draft">
      <div>
        <div class="pos-tabs">
          <button class="pos-tab" aria-pressed="${F.p === ''}" onclick="F.p='';renderDraft()">Tüm Mevkiler</button>
          ${POSITIONS.map(k => {
            const rem = Math.max(0, FORMATION_QUOTA[k] - counts[k]);
            return `
              <button class="pos-tab" aria-pressed="${F.p === k}" onclick="F.p='${k}';renderDraft()">
                ${POS_LABEL[k]} (${POS_SHORT[k]} · İlk 11 Eksik: ${rem})
              </button>
            `;
          }).join("")}
        </div>

        <div class="row" style="margin-bottom:10px">
          <input id="q" placeholder="Oyuncu ara..." value="${F.q}" oninput="F.q=this.value;$('#tb').innerHTML=listHtml()" style="flex:1;min-width:160px">
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
                ${G.m.budget ? '<th class="n">Bonservis Bedeli</th>' : ""}
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

// 10. İLK 11 & 3 YEDEK KADRO DİZİLİŞİ YÖNETİMİ
function ensureTeamLineup(t) {
  if (t.starters && t.starters.length === STARTERS_COUNT && t.bench && t.bench.length === t.picks.length - STARTERS_COUNT) {
    return;
  }
  autoBuildLineupForTeam(t, t.formation || "4-3-3");
}

function autoBuildLineupForTeam(t, formName = "4-3-3") {
  t.formation = formName;
  const need = FORMATIONS[formName] || FORMATION_QUOTA;
  const sorted = [...t.picks].sort((a, b) => b.r - a.r);
  const used = new Set();
  const starters = [];

  for (const k of POSITIONS) {
    const matches = sorted.filter(p => p.pos === k && !used.has(p.id)).slice(0, need[k]);
    matches.forEach(p => {
      used.add(p.id);
      starters.push(p);
    });
  }
  while (starters.length < STARTERS_COUNT) {
    const nextP = sorted.find(p => !used.has(p.id));
    if (!nextP) break;
    used.add(nextP.id);
    starters.push(nextP);
  }
  t.starters = starters;
  t.bench = t.picks.filter(p => !used.has(p.id));
}

function broadcastMyLineup(teamIdx, ready = false) {
  if (!NET.connected || !G || !G.teams[teamIdx]) return;
  const tm = G.teams[teamIdx];
  NET.readyMap[teamIdx] = ready;
  sendNetMsg({
    type: "LINEUP_SYNC",
    teamIdx,
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
  if (SWAP.teamIdx !== teamIdx || SWAP.selectedId == null) {
    SWAP = { teamIdx, selectedId: playerId };
    return render();
  }
  if (SWAP.selectedId === playerId) {
    SWAP.selectedId = null;
    return render();
  }
  const t = G.teams[teamIdx];
  ensureTeamLineup(t);
  const id1 = SWAP.selectedId;
  const id2 = playerId;

  const sIdx1 = t.starters.findIndex(p => p.id === id1);
  const sIdx2 = t.starters.findIndex(p => p.id === id2);
  const bIdx1 = t.bench.findIndex(p => p.id === id1);
  const bIdx2 = t.bench.findIndex(p => p.id === id2);

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
  broadcastMyLineup(teamIdx, NET.readyMap[teamIdx]);
  render();
}

function groupStartersForPitch(t) {
  ensureTeamLineup(t);
  const need = FORMATIONS[t.formation || "4-3-3"] || FORMATION_QUOTA;
  const L = { GK: [], DEF: [], MID: [], FWD: [] };
  const used = new Set();

  for (const k of POSITIONS) {
    const inPos = t.starters.filter(p => p.pos === k && !used.has(p.id)).slice(0, need[k]);
    inPos.forEach(p => {
      used.add(p.id);
      L[k].push(p);
    });
  }
  for (const k of ["FWD", "MID", "DEF", "GK"]) {
    while (L[k].length < need[k]) {
      const p = t.starters.find(x => !used.has(x.id));
      if (!p) break;
      used.add(p.id);
      L[k].push(p);
    }
  }
  return L;
}

function renderResult() {
  G.teams.forEach(ensureTeamLineup);
  const activeTeamIdx = NET.connected ? NET.myTeamIdx : (SWAP.teamIdx < G.teams.length ? SWAP.teamIdx : 0);
  const myTeam = G.teams[activeTeamIdx];
  const L = groupStartersForPitch(myTeam);
  const isTourney = G.teams.length > 2;

  app.innerHTML = hdr() + renderOnlineModal() + `
    <section class="hero">
      <span class="eyebrow">Draft Tamamlandı · Kadro & Yedek Kulübesi Dizilişi</span>
      <h1>Ana Kadronu (İlk 11) ve 3 Yedeğini Diz!</h1>
      <p>Seçtiğin 14 oyuncudan sahaya çıkacak <b>İlk 11 Ana Kadronu</b> ve <b>3 Yedek Oyuncunu</b> belirle. Sahadaki bir oyuncuya ve ardından yedek kulübesindeki bir oyuncuya tıklayarak <b>yerlerini değiştirebilirsin</b>!</p>
      <div class="row" style="margin-top:16px">
        ${NET.connected ? `
          <button class="${NET.readyMap[NET.myTeamIdx] ? 'gold' : 'pri'}" onclick="markMyLineupReady()">
            ${NET.readyMap[NET.myTeamIdx] ? "✅ Kadron Hazır (Arkadaşın Bekleniyor)" : "✅ Kadromu Onayla (Hazırım)"}
          </button>
          <span class="stat-pill">
            Durum: <b>${G.teams[0].name} ${NET.readyMap[0] ? "✅ Hazır" : "⏳ Diziyor"}</b> ·
            <b>${G.teams[1].name} ${NET.readyMap[1] ? "✅ Hazır" : "⏳ Diziyor"}</b>
          </span>
        ` : ""}
        <button class="pri" ${NET.connected && NET.role === "guest" ? "disabled" : ""} onclick="goMatchDirect()">
          🏆 ${isTourney ? "Yarı Final & Final Turnuvasına Geç" : "90 Dk Canlı Maça Geç (30 Sn)"}
        </button>
        <button onclick="startDraft()">🔄 Yeni Draft Yap</button>
      </div>
    </section>

    <div class="panel">
      <div class="panel-head">
        <div class="row">
          <h2>⚽ Taktik Tahtası & İlk 11 Dizilişi (${myTeam.name})</h2>
          ${!NET.connected ? G.teams.map((tm, idx) => `
            <button class="sm ${activeTeamIdx === idx ? 'pri' : ''}" onclick="SWAP.teamIdx=${idx};SWAP.selectedId=null;render()">
              ${tm.name}
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

      <p class="muted" style="margin:0 0 12px;font-size:.86rem">
        💡 <b>Nasıl Değiştirilir?</b> İlk 11'deki veya Yedek Kulübesindeki bir oyuncunun üzerine tıkla, sonra yer değiştirmek istediğin diğer oyuncuya tıkla!
      </p>

      <div class="lineup-editor">
        <div>
          <h3 style="margin-bottom:8px;color:var(--pri)">🏟️ ANA KADRO (İLK 11 · ${myTeam.formation})</h3>
          <div class="pitch">
            ${["FWD", "MID", "DEF", "GK"].map(k => `
              <div class="pl-row">
                ${L[k].map(p => {
                  const isSel = SWAP.selectedId === p.id;
                  return `
                    <div class="pl clickable-pl ${isSel ? 'selected-swap' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})" title="Değiştirmek için tıkla: ${p.n}">
                      <div class="row" style="gap:3px">${clubLogo(p.c, 16)} ${posTag(p.pos)}</div>
                      <small>${p.n.split(" ").pop()}</small>
                    </div>
                  `;
                }).join("")}
              </div>
            `).join("")}
          </div>
        </div>

        <div>
          <h3 style="margin-bottom:8px;color:var(--t-elite)">🪑 YEDEK KULÜBESİ (3 YEDEK OYUNCU)</h3>
          <div class="bench-list">
            ${myTeam.bench.map(p => {
              const isSel = SWAP.selectedId === p.id;
              return `
                <div class="bench-item ${isSel ? 'selected-swap' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})">
                  <span class="club-cell">
                    ${posTag(p.pos)}
                    ${clubLogo(p.c, 20)}
                    <b>${p.n}</b>
                    <span class="muted" style="font-size:.8rem">(${p.c})</span>
                  </span>
                  <button class="sm ${isSel ? 'gold' : ''}">${isSel ? "Seçildi (İlk 11'den Seç)" : "🔄 İlk 11'e Al"}</button>
                </div>
              `;
            }).join("")}
          </div>

          <h3 style="margin:18px 0 8px">📋 İlk 11 Oyuncu Listesi</h3>
          <div class="sq" style="margin-bottom:0">
            <ol>
              ${myTeam.starters.map(p => {
                const isSel = SWAP.selectedId === p.id;
                return `
                  <li style="cursor:pointer;${isSel ? 'color:var(--t-elite);font-weight:700' : ''}" onclick="selectSwapPlayer(${activeTeamIdx}, ${p.id})">
                    <span class="club-cell">${posTag(p.pos)} ${clubLogo(p.c, 16)} <b>${p.n}</b> <span class="muted">${p.c}</span></span>
                    <span class="muted" style="font-size:.78rem">${isSel ? "Seçildi" : "İlk 11"}</span>
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

// 11. MAÇ SİMÜLASYONU
const tot = t => {
  ensureTeamLineup(t);
  return t.starters.reduce((s, p) => s + p.r, 0);
};
const avgRating = t => {
  ensureTeamLineup(t);
  return t.starters.length ? (tot(t) / t.starters.length) : 0;
};

function lineup(t) {
  return groupStartersForPitch(t);
}

const av = a => a.reduce((s, p) => s + p.r, 0) / (a.length || 1);

function side(t) {
  const L = lineup(t);
  const avg = avgRating(t);
  return {
    L,
    avg,
    att: (av(L.FWD) * 3 + av(L.MID) * 2) / 5,
    def: (av(L.DEF) * 3 + av(L.GK) * 2) / 5,
    mid: av(L.MID)
  };
}

function pickGoalscorer(L, sentOffSet = new Set()) {
  const weights = [];
  for (const [k, posMult] of [["FWD", 5.2], ["MID", 2.4], ["DEF", 0.55]]) {
    L[k].forEach(p => {
      if (sentOffSet.has(p.id)) return;
      const ratingFactor = Math.pow(Math.max(10, p.r - 55), 1.6);
      weights.push([p, posMult * ratingFactor]);
    });
  }
  if (!weights.length) return L.FWD[0] || L.MID[0];
  let r = Math.random() * weights.reduce((s, a) => s + a[1], 0);
  for (const [p, w] of weights) {
    if ((r -= w) <= 0) return p;
  }
  return weights[0][0];
}

function pickAssister(L, scorer, sentOffSet = new Set()) {
  const weights = [];
  for (const [k, posMult] of [["MID", 4.8], ["FWD", 3.1], ["DEF", 1.35], ["GK", 0.12]]) {
    L[k].forEach(p => {
      if (p.id === scorer.id || sentOffSet.has(p.id)) return;
      const ratingFactor = Math.pow(Math.max(10, p.r - 55), 1.45);
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

function generateMatchPlan(teamA, teamB, sA, sB) {
  const scheduledByMin = Array.from({ length: 121 }, () => []);
  const sentOff = [new Set(), new Set()];

  const redCardMinutes = [null, null];
  [0, 1].forEach(sideIdx => {
    if (Math.random() < 0.14) {
      const rcMin = 18 + ((Math.random() * 58) | 0);
      redCardMinutes[sideIdx] = rcMin;
      const sObj = sideIdx === 0 ? sA : sB;
      const candidates = [...sObj.L.DEF, ...sObj.L.MID];
      const sentPlayer = candidates[(Math.random() * candidates.length) | 0];
      sentOff[sideIdx].add(sentPlayer.id);
      scheduledByMin[rcMin].push({
        type: "red",
        side: sideIdx,
        min: rcMin,
        player: sentPlayer
      });
    }
  });

  const luckA = (Math.random() - 0.5) * 2.9;
  const luckB = (Math.random() - 0.5) * 2.9;
  const redPenA = redCardMinutes[0] ? ((90 - redCardMinutes[0]) / 90) * 2.4 : 0;
  const redPenB = redCardMinutes[1] ? ((90 - redCardMinutes[1]) / 90) * 2.4 : 0;

  const effA = sA.avg + luckA - redPenA;
  const effB = sB.avg + luckB - redPenB;
  const diff = effA - effB;
  const absDiff = Math.abs(diff);

  let regGoals = [1, 1];
  let goesToET = false;

  if (absDiff < 1.15 && Math.random() < 0.42) {
    const drawScores = [[1, 1], [2, 2], [1, 1], [0, 0]];
    regGoals = drawScores[(Math.random() * drawScores.length) | 0];
    goesToET = true;
  } else {
    const regWinner = diff >= 0 ? 0 : 1;
    let wG, lG;
    if (absDiff >= 3.2) {
      wG = 3 + ((Math.random() * 2) | 0);
      lG = Math.random() < 0.55 ? 0 : 1;
    } else if (absDiff >= 1.5) {
      wG = 2 + ((Math.random() * 2) | 0);
      lG = Math.max(0, wG - 2 + ((Math.random() * 2) | 0));
      if (lG >= wG) lG = wG - 1;
    } else {
      const closePatterns = [[2, 1], [1, 0], [3, 2], [2, 1]];
      const ch = closePatterns[(Math.random() * closePatterns.length) | 0];
      wG = ch[0];
      lG = ch[1];
    }
    regGoals = regWinner === 0 ? [wG, lG] : [lG, wG];
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
      const min = pickMinute(3, 89);
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
  let finalWinnerSide = regGoals[0] > regGoals[1] ? 0 : 1;

  if (goesToET) {
    if (Math.random() < 0.48) {
      const etWinner = (effA + (Math.random() - 0.5) * 1.2 >= effB) ? 0 : 1;
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
      const penWinner = (effA + (Math.random() - 0.5) * 1.8 >= effB) ? 0 : 1;
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
      const attSide = Math.random() < (sA.mid / (sA.mid + sB.mid)) ? 0 : 1;
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
  if (!G) return;
  G.teams.forEach(ensureTeamLineup);
  const n = G.teams.length;
  if (n === 2) {
    T = {
      matches: [
        { id: "FINAL", title: "🏆 BÜYÜK FİNAL", a: 0, b: 1, done: false, sc: null, pen: null, winner: null, goals: [] }
      ],
      champion: null
    };
  } else if (n === 3) {
    const ranked = G.teams.map((t, i) => ({ i, avg: avgRating(t) })).sort((x, y) => y.avg - x.avg);
    T = {
      matches: [
        { id: "SF1", title: "⚡ YARI FİNAL", a: ranked[1].i, b: ranked[2].i, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "FINAL", title: "🏆 BÜYÜK FİNAL", a: ranked[0].i, b: null, done: false, sc: null, pen: null, winner: null, goals: [] }
      ],
      champion: null
    };
  } else {
    T = {
      matches: [
        { id: "SF1", title: "⚡ YARI FİNAL 1", a: 0, b: 3, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "SF2", title: "⚡ YARI FİNAL 2", a: 1, b: 2, done: false, sc: null, pen: null, winner: null, goals: [] },
        { id: "FINAL", title: "🏆 BÜYÜK FİNAL", a: null, b: null, done: false, sc: null, pen: null, winner: null, goals: [] }
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
  if (!T) initTournament();

  const teamA = G.teams[a];
  const teamB = G.teams[b];
  const sA = side(teamA);
  const sB = side(teamB);

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
    perfFactor: [100, 100],
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
    speed: 1
  };
  S.view = "match";
  drawMatch();
}

function matchSetup(a = 0, b = 1, tourneyMatchId = null) {
  if (M && M.tm) clearInterval(M.tm);
  if (a === b) b = (a + 1) % G.teams.length;
  G.teams.forEach(ensureTeamLineup);
  if (!T) initTournament();

  if (!tourneyMatchId && T) {
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
  const plan = generateMatchPlan(teamA, teamB, sA, sB);

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
      M.xg[i] += 0.38 + Math.random() * 0.25;

      const scId = ev.scorer.id;
      if (!M.playerStats[scId]) M.playerStats[scId] = { goals: 0, assists: 0, red: false };
      M.playerStats[scId].goals++;
      M.lastHighlightGoal = scId;

      let astText = "Bireysel beceri";
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
        text: `⚽ GOL! <b>${ev.scorer.n}</b> ağları havalandırdı! <span class="muted">(${astText} · ${names[i]})</span>`
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
        text: `🟥 <b>KIRMIZI KART! ${ev.player.n}</b> (${names[i]}) sert müdahale sonrası doğrudan oyun dışı kaldı! <b>${names[i]}</b> 10 kişi devam ediyor, takım performansı <b>%${M.perfFactor[i]}</b> seviyesine düştü!`
      });
    } else if (ev.type === "save") {
      M.shots[i]++;
      M.onTarget[i]++;
      M.saves[1 - i]++;
      M.xg[i] += 0.12 + Math.random() * 0.1;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `🧤 <b>${ev.player.n}</b> (${names[i]}) sert vurdu, kaleci <b>${ev.gk.n}</b> köşeden çıkardı!`
      });
    } else if (ev.type === "post") {
      M.shots[i]++;
      M.xg[i] += 0.22;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `💥 DİREK! <b>${ev.player.n}</b> (${names[i]}) ceza sahası dışından vurdu, top direkten döndü!`
      });
    } else if (ev.type === "miss") {
      M.shots[i]++;
      M.xg[i] += 0.07;
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `🎯 <b>${ev.player.n}</b> (${names[i]}) pozisyona girdi ancak şutu auta çıktı.`
      });
    } else if (ev.type === "card") {
      M.log.push({
        min: m,
        isGoal: false,
        isRed: false,
        text: `🟨 Taktik faul sonrası <b>${ev.player.n}</b> (${names[i]}) sarı kart gördü.`
      });
    }
  }

  if (m === 45) {
    M.log.push({
      min: 45,
      isGoal: false,
      isRed: false,
      text: `⏱️ <b>İlk Yarı Sona Erdi</b> · Skor: ${M.sc[0]} - ${M.sc[1]}`
    });
  } else if (m === 90 && M.plan.goesToET) {
    M.log.push({
      min: 90,
      isGoal: true,
      isRed: false,
      text: `⏱️ <b>Normal Süre Berabere Bitti (${M.sc[0]} - ${M.sc[1]})!</b> Maçta eşitlik bozulmadı, <b>Uzatmalara (91' - 120')</b> geçiliyor!`
    });
  } else if (m === 105 && M.plan.goesToET) {
    M.log.push({
      min: 105,
      isGoal: false,
      isRed: false,
      text: `⏱️ <b>1. Uzatma Devresi Sona Erdi</b> · Skor: ${M.sc[0]} - ${M.sc[1]}`
    });
  }
}

function renderBracketHTML() {
  if (!T) return "";
  const nextPending = T.matches.find(x => !x.done && x.a != null && x.b != null);
  return `
    <div class="bracket-panel" id="bracket-box">
      <div class="panel-head" style="margin-bottom:4px">
        <div>
          <h2>🏆 Turnuva Eşleşme Ağacı (${G.teams.length > 2 ? "Yarı Final & Final" : "Büyük Final"})</h2>
          <p class="muted" style="margin:2px 0 0;font-size:.83rem">Maçları ister 30 saniyelik canlı simülasyonla sahada izle, ister hızlı sonuçlandırarak Finale ilerle.</p>
        </div>
        <div class="row">
          ${nextPending ? `
            <button class="sm pri" ${M && M.run ? "disabled" : ""} onclick="playBracketMatch('${nextPending.id}', false)">
              ▶️ Sıradaki Maçı Canlı Oynat (${nextPending.title})
            </button>
          ` : ""}
          ${!T.champion ? `
            <button class="sm" ${M && M.run ? "disabled" : ""} onclick="simulateAllRemainingTournament()">
              ⚡ Tüm Turnuvayı Hızlı Tamamla
            </button>
          ` : `
            <button class="sm" onclick="initTournament();matchSetup(T.matches[0].a, T.matches[0].b, T.matches[0].id)">
              🔄 Turnuvayı Baştan Oynat
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
                <span>${bm.done ? "✅ Tamamlandı" : (isCurrent ? "🔴 Sahada" : "⏳ Bekliyor")}</span>
              </div>
              <div class="br-team-row ${bm.done && bm.winner === bm.a ? 'winner-row' : ''}">
                <span>${tA ? `${tA.name}` : '<span class="muted">Yarı Final 1 Kazananı</span>'}</span>
                <span class="br-score">${bm.done && bm.sc ? `${bm.sc[0]}${bm.pen ? ` (${bm.pen[0]})` : ''}` : (isCurrent ? M.sc[0] : "–")}</span>
              </div>
              <div class="br-team-row ${bm.done && bm.winner === bm.b ? 'winner-row' : ''}">
                <span>${tB ? `${tB.name}` : '<span class="muted">Yarı Final Kazananı</span>'}</span>
                <span class="br-score">${bm.done && bm.sc ? `${bm.sc[1]}${bm.pen ? ` (${bm.pen[1]})` : ''}` : (isCurrent ? M.sc[1] : "–")}</span>
              </div>
              <div class="row" style="margin-top:4px;justify-content:space-between">
                <button class="sm ${!bm.done && canPlay ? 'pri' : ''}" ${canPlay ? "" : "disabled"} onclick="playBracketMatch('${bm.id}', false)">
                  ${bm.done ? "🔄 Tekrar İzle" : "▶️ Canlı Oynat (30 Sn)"}
                </button>
                ${!bm.done && tA && tB ? `
                  <button class="sm" ${canPlay ? "" : "disabled"} onclick="playBracketMatch('${bm.id}', true)">
                    ⏭ Hızlı Sonuç
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>

      ${T.champion != null ? `
        <div class="champ-banner">
          <div>
            <span class="eyebrow" style="margin-bottom:4px">Turnuva Tamamlandı</span>
            <h3>🏆 TURNUVA ŞAMPİYONU: ${G.teams[T.champion].name}</h3>
            <div class="muted" style="font-size:.9rem">Tebrikler! Yarı Final ve Final etaplarını geçerek kupaya uzandı!</div>
          </div>
          <button class="gold" onclick="startDraft()">🔄 Yeni Draft & Turnuva Başlat</button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderPitchHTML(t, s, sideIdx) {
  const perf = M ? M.perfFactor[sideIdx] : 100;
  const rc = M ? M.redCards[sideIdx] : 0;
  return `
    <div class="sq ${t.me ? "you" : ""}" style="margin-bottom:0">
      <div class="sq-head">
        <h3>${t.name} <span class="muted" style="font-size:.82rem">(${t.formation || "4-3-3"})</span></h3>
        <span class="muted" style="font-size:.8rem">
          Performans: <b style="color:${perf < 100 ? 'var(--bad)' : 'var(--pri)'}">%${perf}</b>
          ${rc ? ` · <span style="color:var(--bad)">🟥 ${rc} Kırmızı</span>` : ""}
        </span>
      </div>
      <div class="pitch">
        ${["FWD", "MID", "DEF", "GK"].map(k => `
          <div class="pl-row">
            ${s.L[k].map(p => {
              const st = M.playerStats[p.id] || { goals: 0, assists: 0, red: false };
              const hiGoal = M.lastHighlightGoal === p.id ? "highlight-goal" : "";
              const hiAst = M.lastHighlightAssist === p.id ? "highlight-assist" : "";
              const redCls = st.red ? "red-carded" : "";
              return `
                <div class="pl ${hiGoal} ${hiAst} ${redCls}" title="${p.n} (${p.c})">
                  <div class="row" style="gap:3px">${clubLogo(p.c, 15)} ${posTag(p.pos)}</div>
                  <small>${p.n.split(" ").pop()}</small>
                  ${(st.goals || st.assists || st.red) ? `
                    <div class="pl-events">
                      ${st.goals ? `<span class="ev-badge ev-goal">⚽${st.goals > 1 ? st.goals : ""}</span>` : ""}
                      ${st.assists ? `<span class="ev-badge ev-ast">🅰️${st.assists > 1 ? st.assists : ""}</span>` : ""}
                      ${st.red ? `<span class="ev-badge ev-red">🟥</span>` : ""}
                    </div>
                  ` : ""}
                </div>
              `;
            }).join("")}
          </div>
        `).join("")}
      </div>
      <div class="muted" style="font-size:.78rem;margin-top:6px">
        🪑 <b>Yedekler:</b> ${(t.bench || []).map(b => `${b.n.split(" ").pop()} (${POS_SHORT[b.pos]})`).join(", ")}
      </div>
    </div>
  `;
}

function renderStatsComparison() {
  const possA = Math.round(100 * Math.pow(M.sa.mid, 2) / (Math.pow(M.sa.mid, 2) + Math.pow(M.sb.mid, 2)));
  const possB = 100 - possA;
  const rows = [
    ["Takım Performansı (%)", `%${M.perfFactor[0]}`, `%${M.perfFactor[1]}`, M.perfFactor[0] / 2, M.perfFactor[1] / 2],
    ["Topla Oynama (%)", `%${possA}`, `%${possB}`, possA, possB],
    ["Toplam Şut (İsabetli)", `${M.shots[0]} (${M.onTarget[0]})`, `${M.shots[1]} (${M.onTarget[1]})`,
      M.shots[0] + M.shots[1] ? (100 * M.shots[0] / (M.shots[0] + M.shots[1])) : 50,
      M.shots[0] + M.shots[1] ? (100 * M.shots[1] / (M.shots[0] + M.shots[1])) : 50],
    ["Gol Beklentisi (xG)", M.xg[0].toFixed(2), M.xg[1].toFixed(2),
      M.xg[0] + M.xg[1] ? (100 * M.xg[0] / (M.xg[0] + M.xg[1])) : 50,
      M.xg[0] + M.xg[1] ? (100 * M.xg[1] / (M.xg[0] + M.xg[1])) : 50],
    ["Kaleci Kurtarışı", M.saves[0], M.saves[1],
      M.saves[0] + M.saves[1] ? (100 * M.saves[0] / (M.saves[0] + M.saves[1])) : 50,
      M.saves[0] + M.saves[1] ? (100 * M.saves[1] / (M.saves[0] + M.saves[1])) : 50],
    ["Kırmızı Kart (🟥)", M.redCards[0], M.redCards[1], 50, 50]
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
    return `<p class="muted" style="margin:0">Henüz gol kaydedilmedi. Maç başladığında goller ve asistler burada listelenir.</p>`;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Dk.</th>
          <th>Takım</th>
          <th>⚽ Golü Atan</th>
          <th>🅰️ Asist Yapan</th>
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
  const maxM = M.plan.maxMin || 90;

  app.innerHTML = hdr() + renderOnlineModal() + `
    ${renderBracketHTML()}

    <div class="bg-rule-banner">
      <div>
        ⚡ <b>${stageObj ? stageObj.title : "Özel Maç"}:</b> Kadro kalitesi + maç günü şans faktörü, kırmızı kart performans etkisi ve beraberlik halinde <b>Uzatmalar (120') & Seri Penaltılar</b> aktiftir.
      </div>
      <div class="row">
        <span class="muted" style="font-size:.8rem">Simülasyon Hızı:</span>
        <button id="sp-1" class="sm ${M.speed === 1 ? 'pri' : ''}" onclick="setSimSpeed(1)">1x (30sn)</button>
        <button id="sp-2" class="sm ${M.speed === 2 ? 'pri' : ''}" onclick="setSimSpeed(2)">2x (15sn)</button>
        <button id="sp-4" class="sm ${M.speed === 4 ? 'pri' : ''}" onclick="setSimSpeed(4)">4x (7.5sn)</button>
      </div>
    </div>

    <div class="row" style="margin-bottom:12px;justify-content:space-between">
      <div class="row">
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
      </div>
      <div class="row">
        <button class="pri" id="go-btn" onclick="toggleKickoff()">
          ${M.min === 0 ? "▶️ Maçı Başlat (30 Sn)" : (M.min >= maxM ? "🔄 Bu Maçı Tekrar Oynat" : (M.run ? "⏸ Duraklat" : "▶️ Devam Et"))}
        </button>
        <button id="inst-btn" ${M.min >= maxM ? "disabled" : ""} onclick="finishInstantly()">⏭ Anında Bitir</button>
        <button onclick="if(M&&M.tm)clearInterval(M.tm);S.view='result';render()">📋 İlk 11 & Yedekleri Düzenle</button>
      </div>
    </div>

    <div class="scoreboard">
      <div class="sb-top">
        <div class="sb-team">
          <h2>${A.name}</h2>
          <div><span class="sb-avg">Diziliş: <b>${A.formation || "4-3-3"}</b> · Performans: <b id="pf-a">%${M.perfFactor[0]}</b></span></div>
        </div>
        <div class="score-box">
          <div class="score" id="sc">${M.sc[0]} - ${M.sc[1]}</div>
          <div class="pen-score" id="pen-sc">${M.penSc ? `Penaltılar: ${M.penSc[0]} - ${M.penSc[1]}` : ""}</div>
          <div class="clock-pill ${M.run ? 'live' : ''}" id="mn">
            ${M.min === 0 ? "Başlama Vuruşu Bekleniyor" : (M.min >= maxM ? `${maxM}' Maç Bitti` : M.min + ". Dakika")}
          </div>
        </div>
        <div class="sb-team right">
          <h2>${B.name}</h2>
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
        <h2>⏱️ Canlı Maç Anlatımı (Goller, Asistler, Kartlar & Penaltılar)</h2>
        <ul class="log" id="log"></ul>
      </div>
      <div>
        <div class="panel" style="margin-top:0">
          <h2>⚽ Gol & Asist Cetveli</h2>
          <div id="ga-table">${renderGoalAssistSummary()}</div>
        </div>
        <div class="panel">
          <h2>📈 Maç İstatistikleri</h2>
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
    const winName = M.plan.winnerSide === 0 ? A.name : B.name;
    mn.textContent = `${maxM}' Maç Bitti · Kazanan: ${winName}`;
    mn.classList.remove("live");
  } else {
    mn.textContent = `${M.min}' ${M.min > 90 ? "(Uzatmalar)" : ""}`;
  }

  const bar = $("#bar");
  if (bar) bar.style.width = `${Math.min(100, (M.min / maxM) * 100)}%`;

  const glA = $("#gl-a"), glB = $("#gl-b");
  if (glA) {
    glA.innerHTML = M.goalsList[0].map(g =>
      `<li>⚽ <b>${g.min}' ${g.scorer}</b> ${g.assister ? `<span class="muted">(🅰️ ${g.assister})</span>` : ""}</li>`
    ).join("");
  }
  if (glB) {
    glB.innerHTML = M.goalsList[1].map(g =>
      `<li>${g.assister ? `<span class="muted">(🅰️ ${g.assister})</span> ` : ""}<b>${g.scorer} ${g.min}'</b> ⚽</li>`
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
    `).join("") || `<li class="muted">Maç henüz başlamadı. "Maçı Başlat (30 Sn)" butonuna tıklayın.</li>`;
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
    if (goBtn) goBtn.textContent = "▶️ Devam Et";
    const mn = $("#mn");
    if (mn) mn.classList.remove("live");
    return;
  }
  M.run = 1;
  const selA = $("#sel-a"), selB = $("#sel-b"), goBtn = $("#go-btn"), mn = $("#mn");
  if (selA) selA.disabled = true;
  if (selB) selB.disabled = true;
  if (goBtn) goBtn.textContent = "⏸ Duraklat";
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
  let winnerIdx = M.sc[0] > M.sc[1] ? M.a : M.b;

  if (M.sc[0] === M.sc[1] && M.plan.goesToPenalties && M.plan.penaltyData) {
    const pd = M.plan.penaltyData;
    M.penSc = pd.score;
    winnerIdx = pd.winnerSide === 0 ? M.a : M.b;

    M.log.push({
      min: 120,
      isGoal: true,
      isRed: false,
      text: `⏱️ <b>120 Dakika Berabere Bitti (${M.sc[0]} - ${M.sc[1]})! Seri Penaltı Atışlarına Geçiliyor...</b>`
    });

    for (let r = 0; r < 5; r++) {
      const pA = pd.takersA[r] || "Oyuncu A";
      const pB = pd.takersB[r] || "Oyuncu B";
      const hitA = r < pd.score[0] ? "✅ GOL" : "❌ Kaçırdı";
      const hitB = r < pd.score[1] ? "✅ GOL" : "❌ Kaçırdı";
      M.log.push({
        min: "PEN",
        isGoal: false,
        isRed: false,
        text: `🎯 <b>${r + 1}. Penaltılar:</b> ${A.name} - ${pA} (${hitA}) | ${B.name} - ${pB} (${hitB})`
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

  const penSummary = M.penSc ? ` (Penaltılarla ${M.penSc[0]}-${M.penSc[1]})` : (M.plan.goesToET ? " (Uzatmalarda)" : "");
  M.log.push({
    min: M.plan.maxMin || 90,
    isGoal: true,
    isRed: false,
    text: `🏆 <b>Maç Sona Erdi: ${A.name} ${M.sc[0]} - ${M.sc[1]} ${B.name}${penSummary}</b> · Turu geçen: <b>${winner.name}</b>! ⭐ Maçın Adamı: <b>${mvp.n}</b> (${mvpStats.goals} Gol, ${mvpStats.assists} Asist)`
  });

  drawMatch();
}

function render() {
  if (!G || S.view === "setup") return setup();
  if (S.view === "match" && M) return drawMatch();
  if (G.k >= G.order.length || S.view === "result") return renderResult();
  return renderDraft();
}

// URL'de ?room=12345 varsa otomatik olarak odaya bağlan
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
