# Vue Dashboard Panel - Home Assistant Addon

Moderní Vue 3 dashboard s glass morphism designem, integrovaný přímo do Home Assistant sidebaru přes Ingress panel.

## Features

- **Home Assistant Integration**
  - Real-time WebSocket připojení
  - Zobrazení a ovládání entit (světla, termostaty, senzory)
  - Service calls pro ovládání zařízení

- **External Services**
  - Uptime Kuma monitoring (Socket.io)
  - Kubernetes pod status a metriky
  - Minecraft server status (mcstatus.io API)

- **Modern UI**
  - Glass morphism + neumorphism design
  - Dark/Light mode s auto-detekc í
  - Plně responzivní (mobil, tablet, desktop)
  - Smooth animace a transitions

- **Tech Stack**
  - Vue 3 + Composition API
  - TypeScript (flexible mode)
  - Pinia state management
  - Tailwind CSS + Headless UI
  - Vite build tool

## Installation

1. Přidej tento repository do Home Assistant:
   - Settings → Add-ons → Add-on Store → ⋮ → Repositories
   - Přidej: `https://github.com/your-username/ha-addons`

2. Najdi **Vue Dashboard Panel** v Add-on Store

3. Klikni **Install**

4. Konfiguruj addon (volitelné):
   ```yaml
   uptime_kuma_url: "https://uptime.example.com"
   uptime_kuma_username: "admin"
   uptime_kuma_password: "password"
   kubernetes_url: "https://k8s-api.example.com"
   kubernetes_token: "your-k8s-token"
   minecraft_server: "mc.example.com:25565"
   theme: "auto"
   refresh_interval: 30
   ```

5. Start addon

6. Dashboard se objeví v sidebaru Home Assistant

## Configuration

### Uptime Kuma (volitelné)

- `uptime_kuma_url`: URL Uptime Kuma instance
- `uptime_kuma_username`: Přihlašovací jméno
- `uptime_kuma_password`: Heslo

### Kubernetes (volitelné)

- `kubernetes_url`: K8s API endpoint
- `kubernetes_token`: ServiceAccount token s read-only přístupem

**Poznámka:** Kubernetes integrace vyžaduje backend API proxy (browser nemá přímý přístup k K8s API).

### Minecraft Server (volitelné)

- `minecraft_server`: Server adresa (např. `play.hypixel.net`)

Používá mcstatus.io API - žádná konfigurace není nutná.

### General

- `theme`: `auto`, `light`, nebo `dark`
- `refresh_interval`: Interval aktualizace v sekundách (5-300)

## Development

### Prerequisites

- Node.js 20+
- npm nebo yarn

### Local Development

1. Clone repository:
   ```bash
   git clone https://github.com/your-username/ha-addons
   cd ha-addons/vue-dashboard/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Nastav Home Assistant access token:
   - V HA: Profile → Security → Long-Lived Access Tokens
   - Create token
   - Ulož do localStorage nebo .env

4. Start dev server:
   ```bash
   npm run dev
   ```

5. Otevři http://localhost:3000

### Build

```bash
cd frontend
npm run build
```

Build vytvoří `dist/` složku s optimalizovanou aplikací.

### Docker Build

```bash
docker build -t vue-dashboard .
```

## Architecture

```
frontend/
├── src/
│   ├── components/      # Vue komponenty
│   │   ├── layout/     # Layout (Sidebar, Header)
│   │   ├── cards/      # Entity a stat karty
│   │   ├── controls/   # Ovládací prvky
│   │   └── ui/         # UI utility komponenty
│   ├── composables/    # Vue composables
│   │   ├── useHomeAssistant.ts
│   │   ├── useUptimeKuma.ts
│   │   ├── useKubernetes.ts
│   │   └── useMinecraft.ts
│   ├── stores/         # Pinia stores
│   ├── types/          # TypeScript typy
│   ├── views/          # Route views
│   └── utils/          # Helper funkce
├── nginx/              # Nginx konfigurace
└── Dockerfile          # Multi-stage build
```

## Troubleshooting

### Dashboard se nezobrazuje v sidebaru

- Zkontroluj, že addon běží (Settings → Add-ons)
- Refreshni Home Assistant
- Zkontroluj logs: `docker logs addon_vue-dashboard-panel`

### Nelze se připojit k Home Assistant

- Ingress automaticky zajišťuje autentizaci
- Pro development nastav long-lived access token

### Uptime Kuma se nepřipojuje

- Zkontroluj URL a credentials
- Zkontroluj, že Uptime Kuma je dostupná z HA
- Logs: `docker logs addon_vue-dashboard-panel`

### Kubernetes data se nezobrazují

- K8s integrace vyžaduje backend API proxy
- Placeholder implementace v tomto release

## Contributing

Pull requesty jsou vítány! Pro větší změny prosím nejdřív otevři issue.

## License

MIT
