# Home Assistant Custom Addons Repository

Multi-addon repository pro vlastní Home Assistant addony.

## Obsah

- **vue-dashboard** - Moderní Vue 3 dashboard s glass morphism designem

## Přidání repository do Home Assistant

1. Otevři Home Assistant
2. Přejdi do **Settings** → **Add-ons** → **Add-on Store**
3. Klikni na tři tečky v pravém horním rohu
4. Vyber **Repositories**
5. Přidej tuto URL: `https://github.com/your-username/ha-addons`
6. Klikni **Add**

## Addony

### Vue Dashboard Panel

Moderní Vue 3 dashboard integrovaný přímo do Home Assistant sidebaru s následujícími funkcemi:

- Real-time zobrazení Home Assistant entit
- Glass morphism + neumorphism design
- Uptime Kuma monitoring integrace
- Kubernetes pod status
- Minecraft server monitoring
- Dark/Light mode
- Plně responzivní

[Dokumentace →](./vue-dashboard/README.md)

## Development

Každý addon má vlastní složku s těmito soubory:

```
addon-name/
├── config.yaml       # HA addon konfigurace
├── build.yaml        # Multi-arch build
├── Dockerfile        # Docker image
├── README.md         # Developer dokumentace
└── DOCS.md          # User dokumentace
```

## Licence

MIT
