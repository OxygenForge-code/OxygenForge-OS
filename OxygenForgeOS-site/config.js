// Sitedeki içerik buradan gelir. ISO'yu yayınladıktan sonra releases
// bölümündeki url / size / sha256 alanlarını doldur.
const SITE = {
  version: "1.0",
  editions: {
    desktop: "Günlük kullanım için XFCE masaüstü, Calamares kurulum ve Gizlilik Merkezi.",
    server: "Konsol tabanlı sunucular için OpenSSH, nftables ve fail2ban."
  },
  // url: indirme bağlantısı · size: dosya boyutu (ör. "2.4 GB") · sha256: dosyanın SHA-256 değeri
  releases: {
    desktop: {
      x86_64: {
        url: "downloads/OxygenForgeOS-desktop-x86_64.iso",
        size: "1.9 GB",
        sha256: "3c9687e1a59878cfcf40d0d764e81f0e2772adc420c1c68b8c2f5ad216219f55"
      },
      arm64: { url: "", size: "", sha256: "" }
    },
    server:  { x86_64: { url: "", size: "", sha256: "" }, arm64: { url: "", size: "", sha256: "" } }
  },
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
    ["Hangi veriler toplanıyor?", "Varsayılan olarak hiçbiri. Gizlilik Merkezi'nden şifreli DNS'i, güvenlik duvarını ve MAC rastgeleleştirmeyi yönetebilirsin. Ayrıntılar Gizlilik Politikası'nda."]
  ]
};
