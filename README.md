# Despliegue en Vercel y Render (Frontend + Backend)

Este repositorio es una guía práctica para aprender a estructurar, dockerizar y desplegar una aplicación web siguiendo los principios de **CI/CD** con **GitHub Actions**, **Vercel** y **Render**.

Utiliza:
- **Frontend:** Vue 3 + Vite + Tailwind CSS
- **Backend:** FastAPI (Python)
- **Desarrollo:** Docker Compose
- **Despliegue:** GitHub Actions + Render + Vercel

---

## Estructura del Proyecto

El repositorio está organizado siguiendo el patrón de monorepositorio sencillo, donde cada servicio tiene su propia responsabilidad y configuración:

```text
.
├── backend/                # API REST con FastAPI (Python)
│   ├── main.py             # Lógica de la API y configuración de CORS
│   ├── requirements.txt    # Dependencias del proyecto
│   └── Dockerfile          # Imagen optimizada para producción (Multi-stage)
├── frontend/               # Aplicación Web con Vue 3 + Vite
│   ├── src/
│   │   ├── App.vue         # Componente principal
│   │   ├── main.ts         # Punto de entrada
│   │   ├── style.css       # Estilos globales con Tailwind
│   │   └── services/
│   │       └── api.ts      # Servicio para consumir API del backend
│   ├── index.html          # Punto de entrada HTML
│   ├── Dockerfile          # Imagen optimizada (Multi-stage)
│   ├── vite.config.ts      # Configuración de Vite
│   └── tailwind.config.js  # Configuración de Tailwind CSS
├── .github/workflows/      # Automatización (CI/CD)
│   ├── deploy-backend.yaml # Despliegue automático a Render
│   └── deploy-frontend.yaml# Despliegue automático a Vercel
├── compose.yaml            # Orquestación para desarrollo local
└── README.md               # Esta documentación
```

---

## 1. Desarrollo Local con Docker

Para asegurar que todos los desarrolladores trabajen en el mismo entorno, utilizamos **Docker Compose**. Esto emula cómo funcionará la aplicación en producción.

### Requisitos:
- Docker y Docker Compose instalados.

### Pasos:
1. Clona el repositorio.
2. Desde la raíz, levanta ambos servicios:
   ```bash
   docker compose up --build
   ```
3. Accede a las aplicaciones:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Documentación Interactiva (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 2. Estructura del Frontend

### Componentes principales:

- **App.vue:** Componente raíz que consume datos del backend
- **services/api.ts:** Servicio centralizador para peticiones HTTP con axios
- **style.css:** Estilos globales usando Tailwind CSS

### Consumiendo datos del backend:

```typescript
// src/services/api.ts
import { apiService } from './services/api'

// En el componente
onMounted(async () => {
  const data = await apiService.getData()
  // Usar los datos
})
```

### Variables de entorno:

```bash
# Durante desarrollo
VITE_API_URL=http://localhost:8000

# En producción (Render)
VITE_API_URL=https://tu-api.onrender.com
```

---

## 3. Estructura del Backend

### Endpoints disponibles:

- **GET /** - Estado del backend
- **GET /api/data** - Lista de módulos del proyecto
- **GET /docs** - Documentación interactiva (Swagger)

### CORS configurado:

El backend permite peticiones desde cualquier origen (configurable en producción):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Guía de Despliegue (CI/CD)

El objetivo es que cada vez que hagas un `git push` a la rama `main`, la aplicación se actualice automáticamente en internet.

### A. Despliegue del Backend (Render)

**Opción 1: Desde la Web (Recomendado para todos los planes)**

1. Ve a [Render.com](https://render.com) e inicia sesión (o crea una cuenta con GitHub).
2. Haz clic en **"New +"** > **"Web Service"**.
3. Conecta tu repositorio de GitHub:
   - Selecciona tu repositorio (`vercel-render`).
   - Haz clic en **"Connect"**.
4. Configura el servicio:
   - **Name:** `vercel-render-backend`
   - **Root Directory:** `./backend` (importante)
   - **Runtime:** `Docker`
   - **Region:** Elige la más cercana a ti
   - **Plan:** Free (o el que prefieras)
5. Haz clic en **"Create Web Service"** y espera a que se despliegue.
6. Una vez desplegado, tu backend estará disponible en una URL como: `https://vercel-render-backend-xxx.onrender.com`

**¿Qué sucede automáticamente?**
- Render detecta los cambios en tu repositorio automáticamente.
- Cada `git push` a la rama `main` desencadena un nuevo despliegue (esto funciona en FREE).
- Verás el progreso en el dashboard de Render.

**En caso de que NO se despliegue automáticamente:**
- Si estás en plan Free y no se actualiza automáticamente, ve al dashboard.
- Haz clic en **"Manual Deploy"** > **"Deploy latest commit"** para forzar un despliegue manual.

**Nota sobre los Secrets:**
- Los Deploy Hooks solo están disponibles en planes pagos.
- En plan Free, el despliegue es automático cuando empujas a GitHub (no necesitas Secrets).
- Si tienes variables de entorno sensibles, configúralas en **Settings** > **Environment Variables** en el dashboard de Render.

---

### B. Despliegue del Frontend (Vercel) - Opción 1: Desde la Web (Recomendado)

**Opción más rápida y visual:**

1. Ve a [Vercel.com](https://vercel.com) e inicia sesión (o crea una cuenta con GitHub).
2. Haz clic en **"Add New"** > **"Project"**.
3. Conecta tu repositorio de GitHub:
   - Selecciona tu repositorio (`vercel-render`).
   - Haz clic en **"Import"**.
4. Configura el proyecto:
   - **Project Name:** `vercel-render-frontend` (o el que prefieras)
   - **Root Directory:** `./frontend` (importante, señala la carpeta del frontend)
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build` (Vercel lo detecta automáticamente)
   - **Output Directory:** `dist`
5. Configura las variables de entorno:
   - En la sección **"Environment Variables"**, agrega:
     - **Name:** `VITE_API_URL`
     - **Value:** `https://tu-backend.onrender.com` (reemplaza con tu URL de Render)
6. Haz clic en **"Deploy"** y espera a que termine.
7. Una vez desplegado, tu frontend estará disponible en una URL como: `https://vercel-render-frontend-xxx.vercel.app`

**¿Qué sucede automáticamente?**
- Cada vez que hagas `git push` a la rama `main`, Vercel reconstruye y despliega automáticamente.
- Los cambios se verán en la web en menos de 1 minuto.

---

### B. Despliegue del Frontend (Vercel) - Opción 2: Desde la CLI (Avanzado)

Si prefieres usar la línea de comandos:

1. Instala la CLI de Vercel localmente:
   ```bash
   npm install -g vercel
   ```
2. Inicia sesión:
   ```bash
   vercel login
   ```
3. Ve a la carpeta del frontend y despliegua:
   ```bash
   cd frontend
   vercel --prod
   ```
4. Sigue los pasos interactivos y selecciona:
   - **Project name:** `vercel-render-frontend`
   - **Link to existing project?** No (primera vez)
5. Después, configura las variables de entorno desde el dashboard de Vercel.

---

## 5. Conceptos Clave

### Despliegue Automático

Una vez conectado tu repositorio a Vercel y Render, el despliegue es **completamente automático**:

```
1. Haces: git push a main
                 ↓
2. GitHub recibe el push
                 ↓
3. Vercel y Render detectan el cambio
                 ↓
4. Automáticamente inician un nuevo despliegue
                 ↓
5. Tu aplicación se actualiza en internet (1-2 minutos)
```

**¿Cómo lo verifico?**
- Ve al dashboard de **Vercel** o **Render**
- Busca la sección **"Deployments"** o **"Deploy logs"**
- Después de cada `git push`, verás un nuevo despliegue iniciándose automáticamente

**¿Qué pasa si quiero forzar un despliegue?**
- **Vercel:** Dashboard > Project > Deployments > "Redeploy"
- **Render:** Dashboard > Service > Manual Deploy > "Deploy latest commit"

---

### Docker Multi-stage
En los `Dockerfile`, utilizamos dos o más fases:
- **Builder:** Instala dependencias y compila/construye la aplicación
- **Runner/Development:** Solo copia lo necesario para ejecutar

Esto reduce el tamaño de las imágenes, mejora la seguridad y acelera el despliegue.

### CORS (Cross-Origin Resource Sharing)
El backend está configurado para aceptar peticiones del frontend. Sin esto, el navegador bloquearía la conexión por seguridad.

```python
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

### Variables de Entorno
- **Frontend:** `VITE_API_URL` indica dónde está el backend
- **Backend:** `PORT` indica en qué puerto escuchar

Nunca incluyas estas en el código, usa siempre archivos `.env` (no versionados).

### Secrets de GitHub
Nunca subas contraseñas, tokens o claves al repositorio. Usa siempre:
- GitHub Secrets (Settings > Secrets and variables)
- Variables de entorno en plataformas de despliegue (Vercel, Render)

---

## 6. Tecnologías Utilizadas

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| **Frontend** | Vue 3 | ^3.4.21 |
| **Build Tool** | Vite | ^5.0.11 |
| **CSS** | Tailwind CSS | ^3.4.1 |
| **Backend** | FastAPI | Última |
| **Python** | Python | 3.11+ |
| **Servidor Docker** | Node.js | 20-slim |
| **Base de Datos** | - | (Puede agregarse) |

---

## 7. Comandos Útiles

```bash
# Desarrollo local
docker compose up --build

# Detener servicios
docker compose down

# Reconstruir solo frontend
docker compose up --build frontend

# Ver logs de un servicio específico
docker compose logs -f frontend

# Ejecutar comando en un contenedor
docker compose exec frontend npm install
```

---

## 8. Próximos Pasos

- [ ] Agregar autenticación con JWT
- [ ] Implementar base de datos (PostgreSQL)
- [ ] Crear modelos de datos más complejos
- [ ] Escribir tests (pytest para backend, Vitest para frontend)
- [ ] Implementar CI/CD con GitHub Actions
- [ ] Configurar monitoring y logging
- [ ] Documentar APIs con OpenAPI/Swagger

---

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.