# Mimari

## Katmanlar

```
Debian 13 (trixie) tabanı
        │
        ├── live-build: ISO, squashfs, GRUB/syslinux, live-boot
        │
        ├── profiles/: base + desktop|server + amd64|arm64 paketleri
        │
        ├── config/includes.chroot/: marka, servisler, uygulamalar
        │       ├── XFCE + LightDM (desktop)
        │       ├── Calamares + kendi markası
        │       ├── Gizlilik Merkezi + polkit yardımcısı
        │       └── ağ/DNS/güvenlik varsayılanları
        │
        ├── config/hooks/: chroot ve binary aşaması düzeltmeleri
        │
        └── config/includes.binary/: canlı ISO GRUB teması
```

## Açılış akışı

1. GRUB (BIOS) veya GRUB EFI (UEFI) OxygenForge temasını yükler.
2. Linux çekirdeği `boot=live components` ile açılır.
3. Plymouth `oxygenforge` teması logo ve nabız animasyonunu gösterir; LUKS
   parolası için metin istemi aynı temada görünür.
4. `live-config` canlı kullanıcıyı (`oxygenforge`) oluşturur, Türkçe yerel
   ayarları uygular ve oturum açar.
5. Masaüstü: LightDM → XFCE. Sunucu: konsol oturumu.
6. Masaüstünde `oxygenforge-set-wallpaper` duvar kâğıdını, `oxygenforge-welcome`
   karşılama penceresini açar.

## Kurulum

Calamares, canlı sistemin squashfs görüntüsünü hedef diske açar
(`/run/live/rootfs/filesystem.squashfs`), makine kimliğini rastgeleleştirir,
canlıya özgü paketleri kaldırır ve GRUB'u kurar.

- Masaüstü: `settings-desktop.conf` → LightDM etkin, SSH kapalı.
- Sunucu: `settings-server.conf` → LightDM yok, SSH kapalı, fail2ban etkin.
- Kurulum sonrası ilk açılışta `oxygenforge-firstboot` SSH anahtarlarını üretir.

Calamares'in `unpackfs` kaynağı live-boot sürümüne göre değişebilir. Bu depo
Debian 13 live-boot'un `/run/live/rootfs/filesystem.squashfs` yolunu kullanır.

## Liquid glass masaüstü

XFCE'nin kendi compositor'ı oturum açılışında kapatılır; `picom` devralır.
`/etc/xdg/picom.conf` dual-kawase arka plan bulanıklığı, 14 px köşe yarıçapı
ve yumuşak gölgeler tanımlar. `/etc/gtk-3.0/gtk.css` ve `/etc/gtk-4.0/gtk.css`
yarı saydam pencere, başlık çubuğu, menü ve panel yüzeylerini çizer;
`/etc/xdg/autostart/oxygenforge-liquid.desktop` compositor'ı başlatır.
Calamares'in `stylesheet.qss` dosyası aynı cam dilini kurulum ekranına taşır.
Bu katman tamamen yereldir; hiçbir ağ bağlantısı veya telemetri eklemez.

## Gizlilik yığını

| Bileşen | Varsayılan | Dosya |
| --- | --- | --- |
| DNS | Quad9, DNS-over-TLS | `/etc/systemd/resolved.conf.d/90-oxygenforge.conf` |
| Güvenlik duvarı | Gelen bağlantılar reddedilir | `/etc/nftables.conf` |
| Wi-Fi MAC | Rastgele | `/etc/NetworkManager/conf.d/90-oxygenforge-privacy.conf` |
| Çökme dökümleri | Kapalı | `/etc/systemd/coredump.conf.d/90-oxygenforge.conf` |
| Günlükler | Yerel, 200 MB / 30 gün | `/etc/systemd/journald.conf.d/90-oxygenforge.conf` |
| Firefox | Telemetri, sponsorlu içerik, çalışma anketleri kapalı | `/etc/firefox/policies/policies.json` |
| Güncellemeler | Elle | `/etc/apt/apt.conf.d/99oxygenforge` |
| mDNS/LLMNR | Kapalı | `resolved.conf` ve maskelenmiş avahi |

Gizlilik Merkezi (`oxygenforge-privacy`) yalnızca yerel durumu okur ve
`/usr/libexec/oxygenforge-privacy-helper` üzerinden sabit komutlarla değişiklik
yapar. Yardımcı, arayüzden gelen serbest metni çalıştırmaz. Kurulu sistemde
polkit, canlı oturumda parolasız sudo kullanılır.

## Sunucu profili

Sunucu canlı görüntüsü konsolda açılır. Grafik kurulum için
`sudo oxygenforge-installer` komutu minimal X sunucusu başlatıp Calamares'i
açar. Kurulumda X/Calamares paketleri kaldırılır; hedef sistem konsol tabanlıdır.

## Özelleştirme noktaları

- Paketler: `profiles/*/package-lists/*.list.chroot`
- Marka: `usr/lib/os-release`, `etc/issue`, `etc/motd`, Plymouth, GRUB,
  Calamares branding ve duvar kâğıtları
- Gizlilik varsayılanları: `config/includes.chroot/etc/...`
- Uygulamalar: `config/includes.chroot/usr/local/bin/` ve `.desktop` dosyaları
- Kurulum akışı: `etc/calamares/settings-*.conf`
- Derleme seçenekleri: `auto/config`

## Bilinen sınırlar

- Secure Boot imzalama yok.
- NVIDIA kapalı kaynak sürücüsü varsayılan değil; `nouveau` kullanılır.
- Otomatik güncelleme bilinçli olarak kapalı; kullanıcı açar.
- Anonimlik ağı değildir: Tor/VPN yoktur, yalnızca veri minimizasyonu sağlar.
- ISO'lar bit düzeyinde tekrarlanabilir değildir; Debian yansıları sabitlenmez.
