# Nexus — Simulador de Decisiones Inmobiliarias

**Nexus** es la plataforma de simulación de inversiones inmobiliarias más avanzada de México. Impulsada por IA, te permite evaluar proyectos inmobiliarios en segundos con métricas profesionales.

> *Simula. Decide. Invierte.*

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+
- npm 9+

### Instalación

```bash
cd nexus-frontend
npm install
```

### Desarrollo Local

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

### Build de Producción

```bash
npm run build
npm run preview
```

## 🔧 Variables de Entorno

Crea un archivo `.env.local` (o copia de `.env.example`) en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3001
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del API backend de Nexus | `http://localhost:3001` |

## 📦 Endpoints del API

El frontend se conecta a los siguientes endpoints del backend:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check del servidor |
| `POST` | `/api/projects` | Guarda un proyecto |
| `POST` | `/api/mirofish/simulation/create` | Crea una simulación |
| `POST` | `/api/mirofish/simulation/prepare` | Prepara la simulación (polling) |
| `GET` | `/api/mirofish/simulation/result/{id}` | Obtiene el resultado |

Si el backend no está disponible, el frontend genera **reportes de demostración** automáticamente para que puedas seguir probando la interfaz.

## 🚀 Deploy a Vercel

### Opción 1: Deploy desde GitHub

1. Sube el proyecto a un repositorio de GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Vercel detectará automáticamente Vite/React
5. Agrega la variable de entorno `VITE_API_URL` pointing to your production API
6. Deploy!

### Opción 2: CLI de Vercel

```bash
npm i -g vercel
vercel
```

Sigue las instrucciones y configura las variables de entorno en el dashboard de Vercel.

### Configuración para Vercel

El archivo `vercel.json` (creado automáticamente por Vite) maneja la configuración de build. Si necesitas uno personalizado:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## 🎨 Stack Tecnológico

- **React 18** — UI library
- **Vite** — Build tool y dev server
- **React Router v6** — Routing
- **CSS Variables** — Theming (sin frameworks CSS)
- **Fetch API** — HTTP client

## 📁 Estructura del Proyecto

```
nexus-frontend/
├── src/
│   ├── components/
│   │   ├── ChatMessage.jsx    # Mensaje de chat (usuario/IA)
│   │   └── ReportDisplay.jsx # Renderizado de reportes KPI
│   ├── pages/
│   │   ├── HomePage.jsx      # Landing page
│   │   └── SimulatorPage.jsx # Simulador principal
│   ├── App.jsx               # Router principal
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globales
├── index.html
├── nexus.config.js
├── .env.example
└── vite.config.js
```

## 🔐 Notas de Seguridad

- El API endpoint está configurado mediante variable de entorno `VITE_API_URL`
- Para producción, asegúrate de que tu backend tenga CORS configurado correctamente
- Considera usar autenticación JWT en el backend para entornos de producción

## 📄 Licencia

MIT — Todos los derechos reservados © {new Date().getFullYear()} Nexus.
