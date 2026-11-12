// GERÇEK ZAMANLI 2 BİLGİSAYAR (FARKLI İNTERNET) P2P WEBRTC ONLINE MOTORU (PeerJS)
const NET = {
  peer: null,
  conn: null,
  role: null, // "host" | "guest" | null
  roomCode: "",
  connected: false,
  statusText: "Bağlı Değil",
  myTeamIdx: 0,
  peerName: "Arkadaşın",
  readyMap: { 0: false, 1: false },
  chatLog: []
};

const PEER_PREFIX = "fd2026-p2p-room-";
const PEER_CONFIG = {
  debug: 1,
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ]
  }
};

function generateRoomCode() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

function getRoomInviteUrl() {
  if (!NET.roomCode) return window.location.href.split("?")[0].split("#")[0];
  const base = window.location.href.split("?")[0].split("#")[0];
  return `${base}?room=${NET.roomCode}`;
}

function createOnlineRoom() {
  if (typeof Peer === "undefined") {
    S.onlineMsg = `<p class="err">❌ PeerJS kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.</p>`;
    return render();
  }
  disconnectOnlineRoom(true);
  const code = generateRoomCode();
  NET.role = "host";
  NET.roomCode = code;
  NET.myTeamIdx = 0;
  NET.connected = false;
  NET.statusText = `Oda Kuruldu (${code}) · Arkadaşının bağlanması bekleniyor...`;
  S.onlineMsg = `<p class="ok-msg">⏳ Oda Kodu <b>${code}</b> oluşturuldu! Aşağıdaki davet linkini veya 5 haneli kodu arkadaşına gönder.</p>`;
  render();

  try {
    const peer = new Peer(PEER_PREFIX + code, PEER_CONFIG);
    NET.peer = peer;

    peer.on("open", () => {
      NET.statusText = `Oda Hazır (Kod: ${code}) · Arkadaşın bekleniyor...`;
      render();
    });

    peer.on("connection", (conn) => {
      NET.conn = conn;
      setupConnectionHandlers(conn);
    });

    peer.on("error", (err) => {
      S.onlineMsg = `<p class="err">⚠️ Bağlantı uyarısı: ${err.type || err.message}. Yeni bir oda kodu oluşturmayı deneyin.</p>`;
      render();
    });
  } catch (e) {
    S.onlineMsg = `<p class="err">❌ Oda kurulamadı: ${e.message}</p>`;
    render();
  }
}

function joinOnlineRoom(customCode) {
  if (typeof Peer === "undefined") {
    S.onlineMsg = `<p class="err">❌ PeerJS kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.</p>`;
    return render();
  }
  const inp = $("#friend-code-inp");
  const raw = (customCode || (inp ? inp.value : "")).trim();
  const codeMatch = raw.match(/(\d{5})/);
  const code = codeMatch ? codeMatch[1] : raw.replace(/[^a-zA-Z0-9]/g, "");

  if (!code) {
    S.onlineMsg = `<p class="err">Lütfen arkadaşının gönderdiği 5 haneli Oda Kodunu girin.</p>`;
    return render();
  }

  disconnectOnlineRoom(true);
  NET.role = "guest";
  NET.roomCode = code;
  NET.myTeamIdx = 1;
  NET.connected = false;
  NET.statusText = `Oda ${code} aranıyor ve bağlanılıyor...`;
  S.onlineMsg = `<p class="ok-msg">🔄 <b>${code}</b> numaralı odaya bağlanılıyor, lütfen bekleyin...</p>`;
  render();

  try {
    const peer = new Peer(undefined, PEER_CONFIG);
    NET.peer = peer;

    peer.on("open", () => {
      const conn = peer.connect(PEER_PREFIX + code, { reliable: true });
      NET.conn = conn;
      setupConnectionHandlers(conn);
    });

    peer.on("error", (err) => {
      NET.connected = false;
      NET.statusText = "Bağlantı Hatası";
      S.onlineMsg = `<p class="err">❌ Odaya bağlanılamadı (${err.type || "Oda bulunamadı"}). Arkadaşının odayı açık tuttuğundan emin ol.</p>`;
      render();
    });
  } catch (e) {
    S.onlineMsg = `<p class="err">❌ Bağlantı hatası: ${e.message}</p>`;
    render();
  }
}

function setupConnectionHandlers(conn) {
  conn.on("open", () => {
    NET.connected = true;
    NET.readyMap = { 0: false, 1: false };
    if (NET.role === "guest") {
      NET.statusText = `🟢 Oda ${NET.roomCode} · Canlı Bağlantı Kuruldu!`;
      S.onlineMsg = `<p class="ok-msg">🟢 <b>Canlı Bağlantı Kuruldu!</b> Oda kurucunun (Host) draftı başlatması bekleniyor...</p>`;
      sendNetMsg({
        type: "HELLO",
        name: S.teamName === "Senin Takımın" ? "2. Oyuncu (Misafir)" : S.teamName
      });
    } else {
      NET.statusText = `🟢 Arkadaşın Odaya Katıldı! Draftı başlatabilirsin.`;
      S.onlineMsg = `<p class="ok-msg">🟢 <b>Arkadaşın odaya bağlandı!</b> Şimdi "Online Draftı Başlat" butonuna basarak karşılıklı draftı başlatabilirsin.</p>`;
    }
    render();
  });

  conn.on("data", (data) => {
    handleNetMsg(data);
  });

  conn.on("close", () => {
    NET.connected = false;
    NET.statusText = "🔴 Arkadaşının bağlantısı koptu";
    render();
  });
}

function disconnectOnlineRoom(silent = false) {
  if (NET.conn) {
    try { NET.conn.close(); } catch (e) {}
  }
  if (NET.peer) {
    try { NET.peer.destroy(); } catch (e) {}
  }
  NET.peer = null;
  NET.conn = null;
  NET.role = null;
  NET.roomCode = "";
  NET.connected = false;
  NET.statusText = "Bağlı Değil";
  NET.myTeamIdx = 0;
  NET.readyMap = { 0: false, 1: false };
  if (!silent) render();
}

function sendNetMsg(payload) {
  if (NET.conn && NET.connected) {
    try {
      NET.conn.send(payload);
    } catch (e) {}
  }
}

// Gelen Gerçek Zamanlı Mesajları İşle
function handleNetMsg(msg) {
  if (!msg || !msg.type) return;

  if (msg.type === "HELLO" && NET.role === "host") {
    NET.peerName = msg.name || "Arkadaşın";
    NET.statusText = `🟢 ${NET.peerName} ile Canlı Bağlı (Oda: ${NET.roomCode})`;
    sendNetMsg({
      type: "WELCOME",
      hostName: S.teamName || "1. Oyuncu (Host)",
      mode: S.mode,
      leagues: [...S.leagues],
      clubs: [...S.clubs],
      opp: S.opp,
      format: S.format,
      strictPos: S.strictPos
    });
    render();
  } else if (msg.type === "WELCOME" && NET.role === "guest") {
    NET.peerName = msg.hostName || "Oda Kurucu";
    S.mode = msg.mode || S.mode;
    if (msg.leagues) S.leagues = new Set(msg.leagues);
    if (msg.clubs) S.clubs = new Set(msg.clubs);
    S.opp = msg.opp != null ? msg.opp : S.opp;
    S.format = msg.format || S.format;
    S.strictPos = msg.strictPos != null ? msg.strictPos : true;
    NET.statusText = `🟢 ${NET.peerName} ile Canlı Bağlı (Oda: ${NET.roomCode})`;
    render();
  } else if (msg.type === "START_DRAFT") {
    // Host draftı başlattı -> Misafir ekranında aynı draftı kur!
    S.mode = msg.mode;
    S.leagues = new Set(msg.leagues);
    S.clubs = new Set(msg.clubs);
    S.opp = msg.opp;
    S.format = msg.format;
    S.strictPos = msg.strictPos;
    S.humanCount = 2;

    const st = buildDraftState();
    if (st) {
      st.teams[0].name = msg.teamNames[0];
      st.teams[1].name = msg.teamNames[1];
      st.teams[0].me = (NET.myTeamIdx === 0) ? 1 : 0;
      st.teams[1].me = (NET.myTeamIdx === 1) ? 1 : 0;
      st.order = msg.order;
      G = st;
      T = null;
      NET.readyMap = { 0: false, 1: false };
      S.onlineModal = false;
      S.view = "draft";
      render();
    }
  } else if (msg.type === "PICK") {
    // Karşı bilgisayar oyuncu seçti -> anında tahtaya işle!
    if (G && G.k < G.order.length) {
      applyPickDirectly(msg.playerId, msg.isCpu);
    }
  } else if (msg.type === "WHEEL_RESULT") {
    // Çark Draftında karşı tarafın çevirdiği çark sonucu
    W.selectedClub = msg.club;
    W.offeredPlayers = (msg.offeredIds || []).map(id => P[id]).filter(Boolean);
    W.jokers = msg.jokers;
    W.spinning = false;
    render();
  } else if (msg.type === "UNDO") {
    undoLastPick(true);
  } else if (msg.type === "AUTO_COMPLETE_SYNC") {
    if (G && Array.isArray(msg.picksByTeam)) {
      G.taken.clear();
      msg.picksByTeam.forEach((idList, idx) => {
        if (G.teams[idx]) {
          G.teams[idx].picks = idList.map(id => P[id]).filter(Boolean);
          G.teams[idx].spent = G.teams[idx].picks.reduce((s, p) => s + cost(p), 0);
          idList.forEach(id => G.taken.add(id));
        }
      });
      G.k = G.order.length;
      G.teams.forEach(ensureTeamLineup);
      initTournament();
      S.view = "result";
      render();
    }
  } else if (msg.type === "LINEUP_SYNC") {
    if (G && G.teams[msg.teamIdx]) {
      const tm = G.teams[msg.teamIdx];
      tm.formation = msg.formation || "4-3-3";
      tm.starters = (msg.starterIds || []).map(id => P[id]).filter(Boolean);
      tm.bench = (msg.benchIds || []).map(id => P[id]).filter(Boolean);
      NET.readyMap[msg.teamIdx] = !!msg.ready;
      render();
    }
  } else if (msg.type === "MATCH_SYNC") {
    // Host maç senaryosunu gönderdi -> Misafirde birebir aynı maçı aç!
    if (!G) return;
    if (!T) initTournament();
    const hydratedPlan = hydrateNetworkPlan(msg.plan);
    setupMatchFromNetwork(msg.a, msg.b, msg.tourneyMatchId, hydratedPlan);
    if (msg.autoStart) {
      toggleKickoff(true);
    }
  } else if (msg.type === "MATCH_CTRL") {
    if (!M) return;
    if (msg.action === "toggle") toggleKickoff(true);
    else if (msg.action === "speed") setSimSpeed(msg.speed, true);
    else if (msg.action === "instant") finishInstantly(true);
  } else if (msg.type === "CHAT") {
    NET.chatLog.push({ sender: msg.sender, text: msg.text });
    if (NET.chatLog.length > 15) NET.chatLog.shift();
    render();
  }
}

function sendChatMessage(customText) {
  const inp = $("#net-chat-inp");
  const text = customText || (inp ? inp.value.trim() : "");
  if (!text) return;
  const myName = NET.role === "host" ? (S.teamName || "Host") : (S.teamName || "Misafir");
  NET.chatLog.push({ sender: "Sen", text });
  if (NET.chatLog.length > 15) NET.chatLog.shift();
  sendNetMsg({ type: "CHAT", sender: myName, text });
  if (inp && !customText) inp.value = "";
  render();
}

function serializeMatchPlan(plan) {
  return {
    winnerSide: plan.winnerSide,
    goesToET: plan.goesToET,
    goesToPenalties: plan.goesToPenalties,
    penaltyData: plan.penaltyData,
    maxMin: plan.maxMin,
    scheduledByMin: plan.scheduledByMin.map(arr =>
      arr.map(ev => ({
        type: ev.type,
        side: ev.side,
        min: ev.min,
        scorerId: ev.scorer ? ev.scorer.id : null,
        assisterId: ev.assister ? ev.assister.id : null,
        playerId: ev.player ? ev.player.id : null,
        gkId: ev.gk ? ev.gk.id : null
      }))
    )
  };
}

function hydrateNetworkPlan(raw) {
  return {
    winnerSide: raw.winnerSide,
    goesToET: raw.goesToET,
    goesToPenalties: raw.goesToPenalties,
    penaltyData: raw.penaltyData,
    maxMin: raw.maxMin,
    scheduledByMin: raw.scheduledByMin.map(arr =>
      arr.map(ev => ({
        type: ev.type,
        side: ev.side,
        min: ev.min,
        scorer: ev.scorerId != null ? P[ev.scorerId] : null,
        assister: ev.assisterId != null ? P[ev.assisterId] : null,
        player: ev.playerId != null ? P[ev.playerId] : { n: "Oyuncu" },
        gk: ev.gkId != null ? P[ev.gkId] : { n: "Kaleci" }
      }))
    )
  };
}

function renderNetStatusBar() {
  if (!NET.role) return "";
  const lastChat = NET.chatLog[NET.chatLog.length - 1];
  return `
    <div class="net-bar">
      <div class="row">
        <span class="net-dot ${NET.connected ? 'online' : ''}"></span>
        <b>${NET.statusText}</b>
        <span class="lg-tag">${NET.role === "host" ? "Oda Kurucu (1. Takım)" : "Misafir (2. Takım)"}</span>
      </div>
      ${NET.connected ? `
        <div class="chat-strip">
          ${lastChat ? `<span class="chat-bubble">💬 <b>${lastChat.sender}:</b> ${lastChat.text}</span>` : ""}
          <button class="sm" onclick="sendChatMessage('🔥 Harika seçim!')">🔥</button>
          <button class="sm" onclick="sendChatMessage('😱 O oyuncuyu ben alacaktım!')">😱</button>
          <button class="sm" onclick="sendChatMessage('⚽ Maça hazır mısın?')">⚽</button>
          <input id="net-chat-inp" placeholder="Mesaj yaz..." style="width:130px;padding:4px 8px;font-size:.8rem" onkeydown="if(event.key==='Enter')sendChatMessage()">
          <button class="sm pri" onclick="sendChatMessage()">Gönder</button>
        </div>
      ` : ""}
    </div>
  `;
}
