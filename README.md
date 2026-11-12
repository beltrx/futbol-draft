# ⚽ Futbol Draft · 5 Büyük Lig 2026-27 (GitHub Pages & Online Multiplayer)

Bu proje, **GitHub Pages** üzerinde hiçbir ek sunucu (backend) kurulumuna gerek kalmadan doğrudan canlıya alınabilecek şekilde modüler dosyalara ayrılmıştır. **PeerJS (WebRTC P2P)** altyapısı sayesinde iki farklı bilgisayardan ve farklı internet bağlantılarından arkadaşınızla **gerçek zamanlı karşılıklı draft yapabilir**, **11 Asil + 3 Yedek** kadronuzu dizebilir ve **90/120 dakika + penaltı simülasyonunu** aynı anda canlı izleyebilirsiniz.

## 📁 Dosya Yapısı

```text
futbol-draft-github/
├── index.html          # Ana giriş sayfası (GitHub Pages doğrudan bu dosyayı açar)
├── .nojekyll           # GitHub Pages statik dosya yapılandırması
├── css/
│   └── styles.css      # Stadyum gece modu (Floodlit Night Match) tasarım sistemi
└── js/
    ├── data.js         # 5 Büyük Lig, 34 Kulüp SVG Logosu ve 735 Oyuncu Verisi
    ├── online.js       # PeerJS WebRTC P2P Canlı Online Oda, Sıra Senkronizasyonu ve Sohbet Motoru
    └── app.js          # Draft Motoru, Çark Draftı, Bütçe Koruması, 11+3 Taktik Tahtası ve Maç Simülatörü
```

## 🚀 GitHub Pages'e Yükleme ve Canlıya Alma (1 Dakika)

1. [GitHub](https://github.com) hesabınıza giriş yapın ve sağ üstteki **+** ikonundan **New repository**'ye tıklayın.
2. Repository adına örneğin `futbol-draft` yazın, **Public** seçin ve **Create repository** butonuna basın.
3. **uploading an existing file** bağlantısına tıklayın ve bu klasörün içindeki tüm dosyaları (`index.html`, `.nojekyll`, `css/` ve `js/` klasörleri) sürükleyip bırakın, ardından **Commit changes** butonuna tıklayın.
4. Üst menüden **Settings** -> sol menüden **Pages** sekmesine girin.
5. **Build and deployment** altındaki **Branch** kısmından `main` (veya `master`) dalını seçip **Save** butonuna basın.
6. Yaklaşık 30–45 saniye içinde siteniz `https://kullaniciadiniz.github.io/futbol-draft/` adresinde canlıya geçecektir!

## 🌐 İki Bilgisayardan Karşılıklı Online Draft Nasıl Oynanır?

1. **1. Bilgisayar (Oda Kurucu - Host):**
   - Siteyi açar, üst menüden **🌐 Online Oda (2 PC Canlı)** butonuna tıklar ve **"🏠 Online Oda Kur (Host Ol)"** seçeneğine basar.
   - Ekranda 5 haneli bir **Oda Kodu** (ör. `48291`) ve **Canlı Davet Linki** (`https://.../?room=48291`) oluşur. Bu linki veya kodu arkadaşına gönderir.
2. **2. Bilgisayar (Misafir - Farklı İnternet):**
   - Gönderilen `?room=48291` linkine tıklar (veya sitede **🌐 Online Oda** penceresine Oda Kodunu yazıp **Bağlan** der).
   - İki bilgisayar arasında doğrudan **WebRTC Canlı Bağlantısı** kurulur (`🟢 CANLI BAĞLI`).
3. **Gerçek Zamanlı Karşılıklı Draft ve Maç:**
   - Oda kurucu **Drafta Başla** dediğinde iki bilgisayarda aynı anda draft ekranı açılır.
   - Sıra 1. oyuncudayken sadece 1. bilgisayar seçim yapabilir (veya çarkı çevirebilir); seçtiği oyuncu milisaniyeler içinde 2. bilgisayarın ekranına düşer ve sıra 2. bilgisayara geçer!
   - 14 oyuncu (**11 Asil + 3 Yedek**) tamamlandığında her iki oyuncu kendi bilgisayarında **İlk 11**'ini dizer, **"✅ Kadrom Hazır"** butonuna basar ve **90/120 dakikalık canlı maç simülasyonu** her iki ekranda birebir aynı goller, asistler, kırmızı kartlar ve penaltılarla oynanır!
