# OxygenForgeOS

OxygenForgeOS, Debian 13 “trixie” tabanlı, gizlilik odaklı bir Linux dağıtımıdır.
Sürüm **1.0 “Forge”**; XFCE masaüstü, Calamares kurulum ekranı ve kendi
Gizlilik Merkezi ile gelir.

> Bu depo bir **kaynak ağacıdır**. ISO üretmek için Debian 13 çalıştıran bir
> Linux makinesi (veya uygun bir konteyner) gerekir. Derleme `live-build`
> kullanır ve root yetkisi ister.

## Neler var?

- `live-build` tabanlı otomatik ISO üretim hattı (amd64 ve arm64)
- XFCE masaüstü, LightDM, PipeWire, Firefox ESR, KeePassXC
- Calamares kurulum: disk bölümleme, LUKS tam disk şifreleme, kullanıcı oluşturma
- **OxygenForge Gizlilik Merkezi**: şifreli DNS, nftables güvenlik duvarı, MAC
  rastgeleleştirme ve yerel çökme dökümlerini tek yerden yönetir
- **Liquid glass masaüstü**: picom blur, yuvarlatılmış pencereler, yarı saydam
  GTK panelleri ve cam görünümlü Calamares kurulum ekranı
- Varsayılan olarak telemetri yok, reklam kimliği yok, otomatik güncelleme yok
- Sunucu profili: konsol, OpenSSH, nftables, fail2ban, Calamares
- Plymouth açılış teması, GRUB teması, özgün duvar kâğıtları
- Türkçe gizlilik politikası ile uyumlu varsayılanlar (`docs/PRIVACY.md`)

## Hızlı başlangıç

Debian 13 (trixie) üzerinde:

```bash
sudo apt update
sudo apt install live-build debootstrap squashfs-tools xorriso \
  grub-pc-bin grub-efi-amd64-bin mtools dosfstools
sudo ./build.sh desktop
```

Çıktı: `out/OxygenForgeOS-desktop-x86_64.iso`, yanında `.sha256` ve `.json`
özet dosyası.

Sunucu profili:

```bash
sudo ./build.sh server
```

ARM64 için arm64 bir Debian 13 makinesinde:

```bash
sudo ARCH=arm64 ./build.sh desktop
```

Ayrıntılar: [`docs/BUILDING.md`](docs/BUILDING.md)

## Proje düzeni

| Yol | İçerik |
| --- | --- |
| `auto/config` | `lb config` seçenekleri, sürüm/mimari bazlı |
| `build.sh` | Paket listelerini seçer, derler, ISO'yu adlandırır ve özetler |
| `profiles/` | Ortak, masaüstü, sunucu ve mimari paket listeleri |
| `config/includes.chroot/` | Kurulacak dosyalar (marka, servisler, uygulamalar, Calamares) |
| `config/includes.binary/` | ISO içine giren GRUB teması |
| `config/hooks/` | chroot ve binary aşaması betikleri |
| `scripts/` | Kontrol, logo üretimi ve sürüm yayınlama yardımcıları |
| `docs/` | Derleme, mimari, gizlilik ve sürüm notları |

## Doğrulama

```bash
./scripts/check.sh          # sözdizimi + JSON + zorunlu dosya kontrolü
(cd out && sha256sum -c *.iso.sha256)
```

## Gizlilik

OS'un ağ ve veri davranışı ile web sitesinin politikası aynı kaynaktan
yönetilir: [`docs/PRIVACY.md`](docs/PRIVACY.md). Sitedeki Türkçe politika
`OxygenForgeOS-site/gizlilik.html` dosyasıdır.

## Durum ve sınırlar

- Kaynak ağacı ve derleme hattı tamamdır; bu depoda önceden derlenmiş ISO
  bulunmaz.
- Secure Boot imzalama yapılmaz; imzasız ISO için Secure Boot kapatılmalıdır.
- ISO'yu yayınlamadan önce `docs/RELEASE.md` içindeki imza ve özet adımlarını
  uygula, ardından sitedeki `config.js` dosyasına boyut/SHA-256 değerlerini gir.

## Lisans

Orijinal kod ve yapılandırma MIT lisanslıdır. İçeri giren Debian paketleri ve
üçüncü taraf yazılımlar kendi lisanslarını korur. Ayrıntı: `LICENSE`.
