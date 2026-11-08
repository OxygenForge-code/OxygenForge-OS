# Derleme

## Gereksinimler

- Debian 13 “trixie” amd64 veya arm64 ana makine (önerilen)
- root erişimi (live-build chroot ve dosya sistemi oluşturur)
- En az 20 GB boş disk, 4 GB RAM (8 GB önerilir)
- Derleme sırasında Debian paket yansılarına erişim
- `live-build`, `debootstrap`, `squashfs-tools`, `xorriso`, uygun GRUB
  paketleri, `mtools`, `dosfstools`

```bash
sudo apt update
sudo apt install live-build debootstrap squashfs-tools xorriso \
  grub-pc-bin grub-efi-amd64-bin mtools dosfstools
```

ARM64 hedefi için arm64 makinede `grub-efi-arm64-bin` kullan.

## Derleme

```bash
sudo ./build.sh desktop
# veya
sudo ./build.sh server
```

`build.sh` şunları yapar:

1. Sürüm ve mimariyi doğrular, gerekli araçları ve boş alanı kontrol eder.
2. `profiles/base`, `profiles/<edition>` ve `profiles/<arch>` paket listelerini
   `config/package-lists/` içinde birleştirir.
3. `auto/config` üzerinden `lb config` seçeneklerini uygular.
4. `lb build` çalıştırır ve günlüğü `out/build-<edition>-<arch>.log` içine yazar.
5. ISO'yu `out/OxygenForgeOS-<edition>-<x86_64|arm64>.iso` olarak adlandırır,
   `.sha256` ve `.json` özetlerini üretir.

ARM64:

```bash
sudo ARCH=arm64 ./build.sh desktop
```

Çapraz derleme desteklenmez; arm64 ISO'yu arm64 Debian 13 üzerinde üret.
`build.sh` yanlış mimaride uyarır.

## Yeniden derleme

live-build paket önbelleğini kullanır. Yapılandırma değişikliklerinden sonra
tam temizlik gerekebilir:

```bash
sudo lb clean --purge
sudo ./build.sh desktop
```

Yalnızca paket listesi değiştiyse `lb clean` (paket önbelleğini korur) yeterli
olabilir; emin olmak için `--purge` kullan.

## Test etmeden yayınlama

ISO'yu en az iki senaryoda dene:

- UEFI, Secure Boot kapalı, boş disk, LUKS açık kurulum
- BIOS/CSM, mevcut Windows yanına kurulum (bölümleme ekranını mutlaka kontrol et)
- Canlı oturumda ağ, ses, Wi-Fi, Firefox ve Gizlilik Merkezi
- Sunucu ISO'sunda `oxygenforge-installer`, SSH'ın varsayılan kapalı olması
- Kurulum sonrası `oxygenforge-firstboot` ve SSH anahtar üretimi

## Sorun giderme

### `lb build` GRUB paketi bulamıyor

```bash
sudo apt install grub-pc-bin grub-efi-amd64-bin
```

arm64 için `grub-efi-arm64-bin`.

### `debootstrap` trixie bilmiyor

Ana makine çok eski. Debian 13 kullan veya güncel `debootstrap` paketini kur.
Yerel geliştirmede VM veya fiziksel Debian 13 makinesi önerilir. CI iş akışı,
loop aygıtları için `--privileged` bir `debian:trixie` konteyneri kullanır;
bu yalnızca CI içindir, günlük derleme yöntemi değildir.

### “loop device” veya “mount” hataları

live-build gerçek loop aygıtları ve mount işlemleri kullanır. Kısıtlı
konteynerlerde çalışmaz. Bir VM veya fiziksel Debian 13 makinesi kullan.

### Secure Boot

ISO imzasızdır. Secure Boot açıkken GRUB çalışmaz; kurulum için Secure Boot'u
kapat. Kalıcı çözüm için kendi MOK anahtarınla imzalama gerekir; bu depo bunu
yapmaz.

### Görsel/Grafik sorunları

Canlı oturum açılmıyorsa GRUB menüsünde “failsafe” seçeneğini dene. NVIDIA
kartlarda `nomodeset` gerekebilir; bu bir 1.0 bilinen sınırıdır.

## CI

`.github/workflows/build-iso.yml` amd64 masaüstü ISO'sunu `workflow_dispatch`
ile üretir. İş akışı `debian:trixie` konteynerinde `--privileged` kullanır;
sonuç artefakt olarak yüklenir. İmzalama ve yayınlama kapsam dışıdır.
