# OxygenForgeOS web sitesi

Statik HTML/CSS/JS site. Çerez, analitik, harici font ve üçüncü taraf betiği
kullanmaz. GitHub Pages’e `main` dalındaki değişikliklerle otomatik yayınlanır.

## İçerik güncelleme

Tüm sürüm, özellik, SSS ve yol haritası verisi `config.js` içindedir.

- `SITE.releaseTag`: gösterilen sürüm etiketi.
- `SITE.releases.*.url`: GitHub Releases indirme bağlantısı.
- `SITE.releases.*.size` ve `sha256`: indirme kartı ve doğrulama komutları.
- `SITE.features`, `SITE.compare`, `SITE.roadmap`: ana sayfa bölümleri.

ISO’yu repoya eklemeyin; GitHub’ın 100 MB dosya sınırı vardır. ISO’yu Releases’e
yükleyip `SITE.releases` içindeki adresi güncelleyin. Her ISO için
`downloads/*.json` manifestini boyut ve SHA-256 ile güncel tutun; yayın kontrolü
bu dosyaları kaynak alır.

## Yayın kontrolü

```bash
node ../scripts/verify-release.mjs
```

Bu komut, yayınlanan ISO’ların GitHub’daki boyutunu ve SHA-256 özetini
`downloads/*.json` ile karşılaştırır; indirme bağlantısını ve sitedeki yerel
bağlantıları da denetler. `.github/workflows/verify-release.yml` aynı kontrolü
release, haftalık zamanlanmış ve manuel çalıştırmalarda yapar.

## Yerel önizleme

```bash
npx serve .
# veya
python3 -m http.server 8080
```

## Yayın

`.github/workflows/pages.yml` bu klasörü GitHub Pages’e yükler. Pages kaynağı
“GitHub Actions” olmalıdır. Özel alan adı eklenirse `robots.txt`, `sitemap.xml`
ve `index.html` içindeki mutlak adresleri güncelleyin.


## Site kalite notları

- Mobil bölüm menüsü ve klavye odağı `nav.js` içinde; sayfaların ana içeriği
  `main` işaretine ve “İçeriğe geç” bağlantısına sahiptir.
- `og.png` 1200×630 sosyal paylaşım kartıdır; ana sayfa ve rehberlerde
  Open Graph/Twitter meta etiketleriyle kullanılır.
- İndirme kartları SHA-256 dosyasına doğrudan bağlantı verir; yayınlanmamış
  mimariler “Yakında” olarak devre dışıdır.
- Yalnızca site bağlantılarını denetlemek için:

```bash
node ../scripts/verify-release.mjs --site-only
```
