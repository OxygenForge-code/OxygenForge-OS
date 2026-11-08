# Güvenlik politikası

## Desteklenen sürümler

| Sürüm | Destek |
| --- | --- |
| 1.0 “Forge” | Güvenlik düzeltmeleri |

## Bildirim

Güvenlik açıklarını herkese açık bir issue olarak **açma**. Şu adrese yaz:

`security@oxygenforge.example`

Yayından önce bu adresi gerçek bir adresle değiştir ve mümkünse bir PGP anahtarı
yayınla. Mesajda şunları ekle:

- Etkilenen sürüm ve mimari
- Yeniden üretme adımları
- Etki ve olası saldırı senaryosu
- Varsa önerdiğin düzeltme

## Süreç

- 72 saat içinde alındı bildirimi.
- 7 gün içinde ilk değerlendirme.
- Düzeltme hazır olduğunda koordineli yayın; hedef 90 gün.
- Düzeltme yayınlandıktan sonra, istersen adını anarız.

## Kapsam

- ISO üretim hattı ve `config/` yapılandırmaları
- Gizlilik Merkezi ve polkit yardımcısı
- Varsayılan ağ/DNS/güvenlik duvarı yapılandırmaları
- Calamares ve marka dosyaları

Debian paketlerinin kendisi upstream'e aittir; yine de OxygenForgeOS'u
etkiliyorsa bize bildir, koordinasyonu biz yürütürüz.

## Bilinen sınırlar

- ISO imzasızdır; Secure Boot açıkken çalışmaz.
- Anonimlik ağı değildir; VPN/Tor sağlamaz.
- Üçüncü taraf uygulamaların açıkları kendi upstream süreçlerine tabidir.
