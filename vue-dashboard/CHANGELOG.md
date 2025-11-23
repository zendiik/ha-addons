# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-22

### Added

#### Home Assistant Integration
- Real-time WebSocket connection to Home Assistant
- Entity state monitoring with live updates
- Service call support for controlling devices
- Light, switch, sensor, and climate entity support
- Automatic reconnection with exponential backoff

#### External Services
- Uptime Kuma Socket.io integration
  - Monitor status display
  - Real-time heartbeat updates
  - Up/Down/Pending status indicators
- Minecraft server monitoring via mcstatus.io API
  - Online/Offline status
  - Player count and list
  - Server version and software
  - Ping measurement
- Kubernetes integration (placeholder)
  - Pod status overview
  - Running/Pending/Failed pod counts
  - Metrics API support

#### UI/UX
- Glass morphism design system
- Neumorphism button styles
- Dark/Light theme with auto-detection
- Fully responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Sidebar navigation
- Status indicators with pulse animation

#### Views
- **Dashboard** - Main overview with entity cards
- **Energy** - Energy consumption statistics and sensors
- **Infrastructure** - External service monitoring
- **Settings** - Connection status and app information

#### Technical
- Vue 3 + Composition API
- TypeScript (flexible mode)
- Pinia state management
- Tailwind CSS + Headless UI
- Vite build tool
- Multi-stage Docker build
- Nginx server for SPA routing
- Home Assistant Ingress panel integration

### Technical Details

**Architecture:**
- Frontend: Vue 3 + TypeScript
- State: Pinia stores
- Styling: Tailwind CSS
- Components: Headless UI
- Build: Vite
- Server: Nginx (Alpine)
- Container: Docker multi-stage build

**Dependencies:**
- vue: ^3.4.21
- vue-router: ^4.3.0
- pinia: ^2.1.7
- @headlessui/vue: ^1.7.19
- @heroicons/vue: ^2.1.3
- socket.io-client: ^4.7.5
- chart.js: ^4.4.2 (for future charts)

**Development:**
- Hot reload development server
- TypeScript type checking
- Automatic code splitting
- Optimized production builds
- Source maps disabled in production

### Known Limitations

- Kubernetes integration requires backend API proxy (placeholder implementation)
- Energy charts not yet implemented (planned for v1.1.0)
- No custom entity configuration UI (uses HA entity metadata)
- Uptime Kuma requires Socket.io (REST API fallback not implemented)

### Security

- WebSocket connections secured via Home Assistant Ingress
- No direct external access required
- Credentials stored in HA addon config (encrypted)
- CORS and CSP headers configured in Nginx

## [Unreleased]

### Planned Features

- **v1.1.0**
  - Energy consumption charts (Chart.js integration)
  - Custom dashboard layout editor
  - Entity grouping by areas
  - Climate control enhancements

- **v1.2.0**
  - Kubernetes backend API proxy
  - Real-time K8s metrics
  - Pod logs viewer
  - Deployment status

- **v2.0.0**
  - Custom widget system
  - Automation triggers from dashboard
  - Mobile app (Capacitor)
  - Multi-user profiles

### Ideas for Future

- Voice control integration
- Calendar integration
- Weather widgets
- Custom themes
- Plugin system
- Backup/restore configuration

---

**Note:** This changelog is maintained manually. For complete commit history, see Git log.
