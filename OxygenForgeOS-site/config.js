// Sitedeki içerik buradan gelir. ISO'yu yayınladıktan sonra releases
// bölümündeki url / size / sha256 alanlarını doldur.
const SITE = {
  version: "1.0",
  codename: "Forge",
  repo: "https://github.com/OxygenForge-code/OxygenForge-OS",
  pages: "https://oxygenforge-code.github.io/OxygenForge-OS/",
  releaseTag: "V1",
  editions: {
    desktop: "Günlük kullanım için XFCE masaüstü, Calamares kurulum ve Gizlilik Merkezi.",
    server: "Konsol tabanlı sunucular için OpenSSH, nftables ve fail2ban."
  },
  // url: indirme bağlantısı · size: dosya boyutu (ör. "2.4 GB") · sha256: dosyanın SHA-256 değeri
  releases: {
    desktop: {
      x86_64: {
        url: "https://github.com/OxygenForge-code/OxygenForge-OS/releases/download/V1/OxygenForgeOS-desktop-x86_64.iso",
        size: "1.9 GB",
        sha256: "3c9687e1a59878cfcf40d0d764e81f0e2772adc420c1c68b8c2f5ad216219f55"
      },
      arm64: { url: "", size: "", sha256: "" }
    },
    server: {
      x86_64: {
        url: "https://github.com/OxygenForge-code/OxygenForge-OS/releases/download/V1/OxygenForgeOS-server-x86_64.iso",
        size: "1.1 GB",
        sha256: "5df795c7663c1053fa7dc652cda98c2cf7a412194ae8080a8b6c8ff45d74a1ab"
      },
      arm64: { url: "", size: "", sha256: "" }
    }
  },
  features: [
    ["shield", "Telemetri yok", "Kurulum ve kullanım verisi hiçbir sunucuya gönderilmez. Toplanmayan veri sızdırılamaz.", "Gizlilik"],
    ["lock", "Tam disk şifreleme", "Calamares içinde LUKS’i tek adımda aç. Kurtarma anahtarı yalnızca sende kalır.", "Güvenlik"],
    ["spark", "Liquid glass", "picom blur, yarı saydam paneller ve yuvarlatılmış kenarlarla hazır gelen imza görünümü.", "Tasarım"],
    ["sliders", "Tek merkez", "DNS-over-TLS, güvenlik duvarı, MAC rastgeleleştirme ve çökme dökümleri aynı yerde.", "Kontrol"],
    ["code", "Açık kaynak", "Tüm kaynak GitHub’da. İncele, derle, değiştir; kapalı kutu yok.", "Topluluk"],
    ["package", "Debian 13 tabanı", "Tanıdık paket yönetimi, geniş donanım desteği ve uzun ömürlü bir temel.", "Temel"]
  ],
  compare: [
    ["Masaüstü", "XFCE + liquid glass", "Yok, konsol"],
    ["Kurulum", "Calamares grafik kurulum", "Calamares, sunucu profili"],
    ["Günlük araçlar", "Firefox ESR, LibreOffice, KeePassXC", "Temel sistem araçları"],
    ["Gizlilik Merkezi", "Grafik arayüz", "Komut satırı araçları"],
    ["SSH", "Kapalı", "Kapalı, isteğe bağlı"],
    ["Hedef", "Günlük kullanım", "Sunucu / VPS"]
  ],
  roadmap: [
    {
      v: "1.0",
      date: "Kasım 2026",
      state: "done",
      name: "Forge",
      items: ["İlk genel sürüm", "Desktop + Server ISO", "Gizlilik Merkezi", "Liquid glass masaüstü"]
    },
    {
      v: "1.1",
      date: "Planlanıyor",
      state: "next",
      name: "Signal",
      items: ["ARM64 masaüstü imajı", "Secure Boot imzalama", "Daha geniş donanım testi"]
    },
    {
      v: "1.2",
      date: "Planlanıyor",
      state: "later",
      name: "Common",
      items: ["Topluluk yansıları", "Ek dil desteği", "Otomatik kurulum testleri", "Paket imzalama"]
    }
  ],
  wizard: {
    questions: [
      {
        key: "use",
        title: "Nerede kullanacaksın?",
        hint: "Bu, hangi imajı önereceğimizi belirler.",
        options: [
          { v: "desktop", t: "Günlük masaüstü", d: "Tarayıcı, ofis, medya ve günlük işler" },
          { v: "server", t: "Sunucu / VPS", d: "Konsol, SSH ve ağ servisleri" }
        ]
      },
      {
        key: "arch",
        title: "İşlemcin hangisi?",
        hint: "Emin değilsen çoğu bilgisayar için Intel / AMD seçeneği doğrudur.",
        options: [
          { v: "x86_64", t: "Intel / AMD", d: "x86_64 · 64 bit" },
          { v: "arm64", t: "Apple Silicon / ARM", d: "ARM64 · 64 bit" }
        ]
      },
      {
        key: "enc",
        title: "Disk şifreleme?",
        hint: "Kurulum sırasında LUKS tam disk şifrelemesini açabilirsin.",
        options: [
          { v: "yes", t: "Evet, LUKS istiyorum", d: "Kurtarma anahtarını ayrıca sakla" },
          { v: "no", t: "Sonra karar vereceğim", d: "Kurulum ekranında yine açabilirsin" }
        ]
      }
    ]
  },
  privacyDemo: [
    { k: "dns", t: "Şifreli DNS", s: "Quad9 · DNS-over-TLS", on: true, d: "Sorguların ağda okunabilir metin olarak görünmez. Gizlilik Merkezi'nden kapatabilirsin." },
    { k: "fw", t: "Güvenlik duvarı", s: "nftables · gelen bağlantılar", on: true, d: "İstenmeyen gelen bağlantılar varsayılan olarak reddedilir; yalnızca senin açtığın servisler geçer." },
    { k: "mac", t: "MAC rastgeleleştirme", s: "Wi-Fi ağlarında", on: true, d: "Her ağda farklı bir donanım adresi kullanılır; fiziksel konum takibini zorlaştırır." },
    { k: "crash", t: "Çökme dökümleri", s: "Yalnızca yerel · varsayılan kapalı", on: false, d: "Açarsan dökümler 200 MB sınırıyla yalnızca cihazında tutulur; hiçbir yere gönderilmez." }
  ],
  pipeline: [
    { n: "01", t: "profiles", d: "Masaüstü, sunucu ve mimari paket listeleri seçilir." },
    { n: "02", t: "live-build", d: "Debootstrap ile Debian tabanı kurulur, marka ve gizlilik dosyaları eklenir." },
    { n: "03", t: "squashfs", d: "Kök dosya sistemi sıkıştırılır; Calamares ve açılış yapılandırması hazırlanır." },
    { n: "04", t: "ISO", d: "BIOS + UEFI önyüklemeli, SHA-256 özetli tek dosya üretilir." }
  ],
  requirements: [
    ["İşlemci", "64 bit, çift çekirdek", "64 bit, dört çekirdek"],
    ["Bellek", "2 GB", "4 GB veya üzeri"],
    ["Disk", "20 GB", "40 GB veya üzeri"],
    ["Önyükleme", "UEFI veya BIOS", "UEFI"],
    ["Grafik", "1024 × 768", "1920 × 1080 veya üzeri"]
  ],
  steps: [
    ["ISO’yu indir ve doğrula", "Sürümünü seçip indir, ardından SHA-256 değerini Doğrulama bölümündeki komutla kontrol et."],
    ["USB belleğe yaz", "balenaEtcher, Rufus veya benzeri bir araçla ISO’yu en az 8 GB’lık boş bir USB belleğe yaz."],
    ["USB’den başlat ve kur", "Bilgisayarı USB’den başlat, Calamares’te dili ve klavyeyi seç. Diskini bölümlerken tam disk şifrelemesini (LUKS) açman önerilir."]
  ],
  changelog: [{
    v: "1.0",
    date: "8 Kasım 2026",
    items: [
      "İlk genel sürüm: Debian 13 tabanlı XFCE masaüstü.",
      "Server / x86_64 ISO’su: konsol, nftables, fail2ban ve kapalı SSH.",
      "Calamares kurulum: LUKS, ext4/btrfs/xfs, UEFI ve BIOS.",
      "Gizlilik Merkezi: şifreli DNS, nftables, MAC rastgeleleştirme, çökme dökümleri.",
      "Liquid glass masaüstü: picom blur, yarı saydam paneller ve cam kurulum ekranı.",
      "Varsayılan olarak telemetri, hesap, reklam kimliği ve otomatik güncelleme yok.",
      "Sunucu profili: konsol, OpenSSH (kapalı), nftables, fail2ban."
    ]
  }],
  faq: [
    ["Hangi mimariyi seçmeliyim?", "Intel veya AMD işlemcili çoğu bilgisayar için x86_64, Apple Silicon ve çoğu ARM cihaz için ARM64."],
    ["Kurulumdan önce yedek almalı mıyım?", "Evet. Disk bölümlerini değiştiren her kurulumdan önce önemli dosyalarını yedekle. Tam disk şifrelemesi açarsan kurtarma anahtarını ayrıca sakla."],
    ["İndirme başlamıyor, ne yapmalıyım?", "Tarayıcı indirmeyi engellemiş olabilir. Bağlantıyı yeniden dene ya da sayfayı başka bir tarayıcıda aç."],
    ["Dosyanın bozulmadığını nasıl anlarım?", "Doğrulama bölümündeki komutu çalıştır ve çıktıyı beklenen SHA-256 değeriyle karşılaştır."],
    ["OxygenForgeOS telemetri gönderiyor mu?", "Hayır. Kurulum ve kullanım verisi toplanmaz; çökme dökümleri varsayılan olarak kapalıdır. Ağa yalnızca senin başlattığın güncelleme, DNS ve saat eşitleme için çıkılır."],
    ["Hangi veriler toplanıyor?", "Varsayılan olarak hiçbiri. Gizlilik Merkezi'nden şifreli DNS'i, güvenlik duvarını ve MAC rastgeleleştirmeyi yönetebilirsin. Ayrıntılar Gizlilik Politikası'nda."],
    ["Katkıda bulunabilir miyim?", "Evet. Kaynak, derleme belgeleri ve sorun takibi GitHub’da. Hata bildirimi, çeviri, dokümantasyon ve paket testleri açık."],
    ["Sunucu sürümü var mı?", "Evet. Server / x86_64 ISO’su V1 sürümünde yayınlandı; kurulum ve SSH sertleştirme adımları Sunucu rehberinde."]
  ]
};
