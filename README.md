# OxygenForgeOS

**Gizlilik bir ayar değil, başlangıç noktası.**

OxygenForgeOS, Debian 13 “trixie” tabanlı, gizlilik odaklı bir Linux dağıtımıdır.
Telemetri, zorunlu hesap, reklam kimliği ve otomatik güncelleme olmadan gelir.
Sürüm **1.0 “Forge”**; XFCE masaüstü, Calamares kurulum ve liquid glass arayüz
içerir.

[Web sitesi](https://oxygenforge-code.github.io/OxygenForge-OS/) ·
[ISO indir](https://github.com/OxygenForge-code/OxygenForge-OS/releases/tag/v1.0.0) ·
[Derleme rehberi](OxygenForgeOS/docs/BUILDING.md) ·
[Gizlilik](OxygenForgeOS/docs/PRIVACY.md)

## Bu depoda ne var?

| Yol | İçerik |
| --- | --- |
| [`OxygenForgeOS/`](OxygenForgeOS/) | `live-build` kaynak ağacı, Calamares, gizlilik araçları ve marka dosyaları |
| [`OxygenForgeOS-site/`](OxygenForgeOS-site/) | Statik indirme sitesi; GitHub Pages’e otomatik yayınlanır |
| [`.github/workflows/pages.yml`](.github/workflows/pages.yml) | Siteyi her değişiklikte GitHub Pages’e dağıtır |
| `OxygenForgeOS/.github/workflows/build-iso.yml` | İsteğe bağlı ISO derleme iş akışı |

## İndir

Önerilen sürüm: **Desktop / x86_64**, 1.9 GB.

- SHA-256: `3c9687e1a59878cfcf40d0d764e81f0e2772adc420c1c68b8c2f5ad216219f55`
- Platform: UEFI ve BIOS, 64 bit Intel/AMD
- Not: ISO imzasızdır; Secure Boot kapatılmalıdır.

## Kaynaktan derle

Debian 13 üzerinde:

```bash
sudo apt update
sudo apt install live-build debootstrap squashfs-tools xorriso \
  grub-pc-bin grub-efi-amd64-bin mtools dosfstools
cd OxygenForgeOS
sudo ./build.sh desktop
```

Çıktı: `out/OxygenForgeOS-desktop-x86_64.iso` (yanında `.sha256` ve `.json`).
Ayrıntılar için [`docs/BUILDING.md`](OxygenForgeOS/docs/BUILDING.md).

## Gizlilik

- Telemetri ve kullanım istatistiği yok.
- Hesap, bulut eşitleme veya reklam kimliği yok.
- Varsayılan DNS-over-TLS, nftables ve Wi-Fi MAC rastgeleleştirme.
- Çökme dökümleri varsayılan olarak kapalı.
- Site çerez, analitik ve harici font kullanmaz.

Politikanın tamamı: [gizlilik politikası](https://oxygenforge-code.github.io/OxygenForge-OS/gizlilik.html)
ve [`docs/PRIVACY.md`](OxygenForgeOS/docs/PRIVACY.md).

## Katkı

Hata bildirimi, çeviri, dokümantasyon ve paket testleri açıktır. Kaynak ağacını
inceleyip `scripts/check.sh` ile doğrulayabilirsiniz:

```bash
cd OxygenForgeOS
./scripts/check.sh
```

## Lisans

Orijinal kod ve yapılandırma MIT lisanslıdır. Debian paketleri ve üçüncü taraf
yazılımlar kendi lisanslarını korur. Ayrıntı: [`LICENSE`](LICENSE).
