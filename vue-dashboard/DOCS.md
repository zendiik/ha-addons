# Vue Dashboard Panel - Uživatelská příručka

## Instalace

1. **Přidání repository**
   - Otevři Home Assistant
   - Jdi do **Settings** → **Add-ons** → **Add-on Store**
   - Klikni na tři tečky (⋮) v pravém horním rohu
   - Vyber **Repositories**
   - Přidej: `https://github.com/your-username/ha-addons`
   - Klikni **Add**

2. **Instalace addonu**
   - V Add-on Store najdi **Vue Dashboard Panel**
   - Klikni **Install**
   - Počkej na dokončení instalace

3. **Konfigurace** (volitelné)
   - Přejdi na **Configuration** tab
   - Nastav požadované služby (viz níže)
   - Klikni **Save**

4. **Spuštění**
   - Přejdi na **Info** tab
   - Klikni **Start**
   - Počkej, až addon naběhne

5. **Přístup**
   - Dashboard se automaticky objeví v levém sidebaru Home Assistant
   - Ikona: 📊
   - Název: **Dashboard**

## Konfigurace

### Základní nastavení

**Theme** (výchozí: `auto`)
- `auto` - automatické přepínání podle systémového nastavení
- `light` - světlý režim
- `dark` - tmavý režim

**Refresh Interval** (výchozí: `30`)
- Interval aktualizace dat v sekundách
- Rozsah: 5-300 sekund

### Uptime Kuma Integrace

Pokud chceš zobrazovat status monitorů z Uptime Kuma:

```yaml
uptime_kuma_url: "https://uptime.example.com"
uptime_kuma_username: "admin"
uptime_kuma_password: "tvoje-heslo"
```

**Poznámka:** URL musí být dostupná z Home Assistant.

### Kubernetes Integrace

Pro zobrazení statusu podů v Kubernetes:

```yaml
kubernetes_url: "https://k8s-api.example.com"
kubernetes_token: "tvůj-k8s-token"
```

**Jak získat token:**
1. Vytvoř ServiceAccount v K8s
2. Přiřaď read-only ClusterRole
3. Zkopíruj token ze ServiceAccount

```bash
kubectl create serviceaccount dashboard-viewer
kubectl create clusterrolebinding dashboard-viewer \
  --clusterrole=view \
  --serviceaccount=default:dashboard-viewer
kubectl create token dashboard-viewer
```

### Minecraft Server

Pro monitoring Minecraft serveru:

```yaml
minecraft_server: "mc.example.com:25565"
```

Nebo pouze hostname:

```yaml
minecraft_server: "play.hypixel.net"
```

Dashboard automaticky zjistí:
- Online/Offline status
- Počet hráčů
- Seznam online hráčů
- Verzi serveru
- MOTD

## Použití

### Dashboard View

Hlavní přehled zobrazuje:
- **Statistiky** - počet světel, senzorů, spínačů
- **Entity karty** - interaktivní karty pro ovládání
- **Real-time updates** - automatické aktualizace stavů

**Ovládání světel:**
- Klikni na tlačítko v kartě světla
- Světlo se okamžitě zapne/vypne

### Energy View

Zobrazuje energetické statistiky:
- Aktuální spotřeba (W)
- Denní spotřeba (kWh)
- Měsíční spotřeba (kWh)
- Odhadované náklady

**Graf spotřeby** bude implementován v další verzi.

### Infrastructure View

Monitoring externí infrastruktury:

**Uptime Kuma:**
- Status monitorů (UP/DOWN)
- Ping každého monitoru
- Poslední update

**Minecraft Server:**
- Online/Offline status
- Počet hráčů (X/Y)
- Verze a software
- Ping
- Seznam online hráčů

**Kubernetes:**
- Celkový počet podů
- Running/Pending/Failed pody
- Node statistiky

### Settings View

Přehled připojení a statistik:
- Status všech integrací
- Počet entit v HA
- Uptime Kuma monitorů
- K8s podů
- Minecraft hráčů
- Verze aplikace

## Časté problémy

### Dashboard se nezobrazuje v sidebaru

**Řešení:**
1. Refreshni Home Assistant (Ctrl+F5)
2. Zkontroluj, že addon běží (zelená ikona)
3. Zkontroluj logs v addon detailu

### Nelze ovládat entity

**Možné příčiny:**
- WebSocket není připojený
- Zkontroluj status v Settings view
- Restartuj addon

### Uptime Kuma se nepřipojuje

**Řešení:**
1. Zkontroluj URL (musí být HTTPS nebo HTTP, ne websocket)
2. Ověř username a password
3. Zkontroluj dostupnost z HA: `ping uptime.example.com`
4. Zkontroluj logs

### Minecraft server offline

**Možné příčiny:**
- Server je skutečně offline
- Neplatná adresa serveru
- Firewall blokuje mcstatus.io API
- Rate limit (5 requests/second)

**Řešení:**
- Zkontroluj server manuálně
- Ověř adresu (formát: `hostname:port` nebo jen `hostname`)
- Počkej 60 sekund a zkontroluj znovu

## Tips & Tricks

### Dark Mode

Můžeš přepínat theme:
- Manuálně v konfigurac i: `theme: dark`
- Ikona měsíce/slunce v pravém horním rohu dashboardu

### Refresh Interval

Pro real-time monitoring nastav nízký interval:
```yaml
refresh_interval: 5
```

Pro úsporu zdrojů nastav vyšší:
```yaml
refresh_interval: 60
```

### Customizace

Dashboard zobrazuje automaticky všechny entity z HA.

Pro lepší organizaci doporuč ujeme:
- Pojmenuj entity popisně (friendly_name)
- Používej areas v HA
- Správně nastav device_class u senzorů

## Support

**Issues:** https://github.com/your-username/ha-addons/issues
**Dokumentace:** https://github.com/your-username/ha-addons

## Changelog

Viz [CHANGELOG.md](./CHANGELOG.md)
