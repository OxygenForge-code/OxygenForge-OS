# OxygenForgeOS 1.0 “Forge”

Gizlilik odaklı, Debian 13 tabanlı Linux.

## İlk adımlar

- Canlı oturumda karşılama penceresinden **Sistemi kur** seçeneğini kullan.
- Terminalden kurulum: `sudo calamares` (masaüstü) veya
  `sudo oxygenforge-installer` (sunucu).
- Gizlilik ayarları: uygulama menüsünde **Gizlilik Merkezi** veya
  `oxygenforge-privacy`.

## Varsayılanlar

- Telemetri yok, hesap yok, reklam kimliği yok.
- DNS: Quad9, DNS-over-TLS. Gizlilik Merkezi'nden kapatılabilir.
- Güvenlik duvarı: gelen bağlantılar kapalı.
- Wi-Fi MAC: rastgele.
- Çökme dökümleri: kapalı.
- Otomatik güncelleme: kapalı. `sudo apt update && sudo apt full-upgrade`.

## Yardım

- Ağ bilgisi: Gizlilik Merkezi → **Ağ bilgisi**
- Doğrulama: `resolvectl status`, `sudo nft list ruleset`
- Sunucu: `docs/SERVER.md` (depoda)
- Gizlilik: sitedeki `gizlilik.html`

## Sınırlar

Secure Boot imzalı değildir. Anonimlik ağı değildir; yalnızca veri minimizasyonu
sağlar. Üçüncü taraf uygulamalar kendi politikalarına tabidir.
