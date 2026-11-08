# Sunucu sürümü

Sunucu ISO'su konsolda açılır. Grafik kurulum için:

```bash
sudo oxygenforge-installer
```

Bu komut minimal bir X sunucusu başlatır ve Calamares'i açar. Kurulum sonunda
X ve Calamares hedeften kaldırılır; sistem konsol tabanlıdır.

## İlk kontrol

```bash
cat /etc/os-release
systemctl status nftables systemd-resolved
sudo nft list ruleset
resolvectl status
systemctl status ssh
```

SSH bilinçli olarak **kapalıdır** ve güvenlik duvarı 22/tcp'yi açmaz.

## SSH'ı açma

Önce bir kullanıcı parolası ve tercihen SSH anahtarı hazırla. Sonra:

```bash
sudo systemctl enable --now ssh
```

Güvenlik duvarında izin ver. Kalıcı olması için `/etc/nftables.conf` içindeki
`chain input` bloğuna şu satırı ekle:

```
tcp dport 22 accept
```

Ardından:

```bash
sudo systemctl restart nftables
sudo nft list ruleset
sudo systemctl status fail2ban
```

`fail2ban` kurulumda etkindir; SSH kapalıyken de çalışır. Gerekirse:

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

## Güncellemeler

Varsayılan olarak otomatik güncelleme yoktur. Elle:

```bash
sudo apt update
sudo apt full-upgrade
sudo needrestart
```

Otomatik güvenlik güncellemesi istiyorsan (bilinçli tercih; ağa düzenli çıkar):

```bash
printf 'APT::Periodic::Enable "1";\nAPT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' \
  | sudo tee /etc/apt/apt.conf.d/99zz-unattended
sudo systemctl enable --now apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service
```

## Gizlilik ayarları

```bash
# DNS-over-TLS aç/kapat (yardımcı sabit komutlarla çalışır)
sudo /usr/libexec/oxygenforge-privacy-helper dns on
sudo /usr/libexec/oxygenforge-privacy-helper dns off

# Güvenlik duvarı
sudo /usr/libexec/oxygenforge-privacy-helper firewall on
sudo /usr/libexec/oxygenforge-privacy-helper firewall off
```

## Sertleştirme önerileri

- SSH için parola yerine anahtar kullan; `PasswordAuthentication no` yap.
- Yalnızca gereken portları aç; varsayılan politika `drop` kalsın.
- Düzenli yedek al; LUKS kullanıyorsan kurtarma anahtarını ayrı sakla.
- `unattended-upgrades` açacaksan yine de ayda bir `apt full-upgrade` ile
  çekirdek güncellemelerini uygula ve yeniden başlat.
- Sunucuda masaüstü kurmayın; saldırı yüzeyini büyütür.
