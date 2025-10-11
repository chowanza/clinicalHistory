# 🏥 Clinical History App - Frontend

## 📋 Descripción

Frontend de la aplicación de gestión de historias clínicas para consultorios médicos pediátricos. Desarrollado con React 19 y Vite para una experiencia de usuario moderna y eficiente.

## 🚀 Tecnologías

- **React 19** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Material-UI** - Componentes UI
- **React Router** - Navegación
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Framer Motion** - Animaciones
- **React PDF** - Generación de reportes
- **React Big Calendar** - Calendario médico

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y llamadas API
│   ├── axios.js           # Configuración de Axios
│   ├── auth.js            # APIs de autenticación
│   ├── patients.js        # APIs de pacientes
│   ├── consultations.js   # APIs de consultas
│   ├── vaccination.js     # APIs de vacunación
│   └── recipeCalendar.js  # APIs de recetas
├── components/            # Componentes React
│   ├── auth/             # Componentes de autenticación
│   ├── dashboard-doctor/ # Componentes del dashboard médico
│   ├── dashboard-patient/# Componentes del perfil de paciente
│   ├── MedicalCalendar/  # Componentes del calendario médico
│   └── ui/               # Componentes UI reutilizables
├── context/              # Contextos de React
│   ├── AuthContext.jsx   # Contexto de autenticación
│   └── PatientsContext.jsx # Contexto de pacientes
├── pages/                # Páginas principales
├── utils/                # Utilidades
│   ├── ageUtils.js       # Utilidades de edad
│   └── lmsUtils.js       # Utilidades LMS para percentiles
└── data/                 # Datos de percentiles
    ├── weight_for_age.json
    ├── length_for_age.json
    ├── weight_for_length.json
    └── head_circumference_for_age.json
```

## 🛠️ Instalación

### Requisitos Previos
- Node.js 18 o superior
- npm

### Instalación Local

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]
cd clinicalHistory

# Instalar dependencias
npm install

# Configurar para desarrollo local
# Editar src/api/axios.js y cambiar:
# const useProductionBackend = true
# Por:
# const useProductionBackend = false

# Iniciar servidor de desarrollo
npm run dev
```

### Instalación Automática (Recomendado)

Usar el script de instalación desde el directorio raíz:

```bash
# Windows
.\setup-local.ps1

# Linux/Mac
./setup-local.sh
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 5173)
npm run build        # Build para producción
npm run preview      # Preview del build de producción
npm run lint         # Linter de código
```

## 🌐 Configuración

### Variables de Entorno
El frontend se conecta automáticamente al backend configurado en `src/api/axios.js`.

### Desarrollo Local
Para usar el backend local:
```javascript
// En src/api/axios.js
const useProductionBackend = false
```

### Producción
Para usar el backend de producción:
```javascript
// En src/api/axios.js
const useProductionBackend = true
```

## 📱 Funcionalidades

### 🔐 Autenticación
- Registro e inicio de sesión de doctores
- Recuperación de contraseña por email
- Gestión de sesiones con JWT

### 👥 Gestión de Pacientes
- Crear, editar, buscar pacientes
- Información personal completa
- Datos familiares (padres, obstetra)
- Historia médica (neonatal, personal, familiar)

### 🏥 Historias Clínicas
- Consultas médicas numeradas secuencialmente
- Examen físico detallado
- Medidas antropométricas
- Diagnóstico y tratamiento
- Subida de archivos como base64
- Eliminación individual de anexos

### 💉 Programa de Vacunación
- 17 vacunas predefinidas del esquema nacional
- Múltiples dosis (dose1, dose2, dose3, booster1, booster2)
- Seguimiento de fechas de aplicación

### 💊 Recetas Médicas
- Gestión de medicamentos
- Fechas y descripciones de tratamientos
- Historial de medicaciones

### 📊 Reportes y Análisis
- Generación de PDFs para historias clínicas
- Gráficos de crecimiento con percentiles
- Cálculos LMS para curvas de crecimiento
- Exportación de datos médicos

### 📅 Calendario Médico
- Programación de citas
- Gestión de consultas
- Vista mensual y semanal

## 🔧 Desarrollo

### Estructura de Componentes
- **Componentes funcionales** con hooks
- **Context API** para estado global
- **React Hook Form** para formularios
- **Tailwind CSS** para estilos
- **Material-UI** para componentes complejos

### Patrones de Código
```javascript
// Ejemplo de componente
import React from 'react'
import { useAuth } from '../context/AuthContext'

const MyComponent = () => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <div>No autorizado</div>
  }
  
  return (
    <div className="p-4">
      <h1>Bienvenido, {user.username}</h1>
    </div>
  )
}

export default MyComponent
```

### API Calls
```javascript
// Ejemplo de llamada API
import axios from '../api/axios'

const fetchPatients = async () => {
  try {
    const response = await axios.get('/tasks')
    return response.data
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}
```

## 🚨 Solución de Problemas

### Error: "Cannot find module"
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Network error"
- Verificar que el backend esté ejecutándose
- Verificar configuración en `src/api/axios.js`
- Verificar CORS en el backend

### Error: "Build failed"
```bash
# Verificar errores de compilación
npm run build
```

## 📊 Performance

### Optimizaciones Implementadas
- **Code splitting** automático con Vite
- **Tree shaking** para eliminar código no usado
- **Lazy loading** de componentes pesados
- **Memoización** de componentes costosos
- **Optimización de imágenes** con Vite

### Bundle Size
- Build de producción optimizado
- Compresión automática de assets
- Chunks separados para vendor y app

## 🔐 Seguridad

### Medidas Implementadas
- **Autenticación JWT** con tokens seguros
- **Validación de formularios** en cliente y servidor
- **Sanitización** de inputs
- **HTTPS** en producción
- **CORS** configurado correctamente

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componentes Adaptativos
- Tablas responsivas con scroll horizontal
- Formularios adaptativos
- Navegación móvil optimizada
- Calendario responsive

## 🧪 Testing

### Testing Manual
- Pruebas de funcionalidad en diferentes navegadores
- Pruebas de responsive design
- Pruebas de accesibilidad
- Pruebas de performance

### Herramientas de Desarrollo
- React Developer Tools
- Redux DevTools (si aplica)
- Network tab para debugging de APIs

## 📚 Documentación Adicional

- [AGENTS.md](../AGENTS.md) - Guía completa de deployment
- [README-LOCAL-DEPLOYMENT.md](../README-LOCAL-DEPLOYMENT.md) - Deployment local
- [PROJECT-OVERVIEW.md](../PROJECT-OVERVIEW.md) - Resumen del proyecto

## 🤝 Contribución

### Estándares de Código
- Usar ESLint configurado
- Seguir convenciones de React
- Comentar código complejo
- Usar TypeScript-style JSDoc

### Git Workflow
```bash
# Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# Commit con mensaje descriptivo
git commit -m "feat: agregar nueva funcionalidad"

# Push y crear PR
git push origin feature/nueva-funcionalidad
```

## 📞 Soporte

### Archivos Importantes
- `src/api/axios.js` - Configuración de API
- `src/context/AuthContext.jsx` - Autenticación
- `src/ProtectedRoute.jsx` - Protección de rutas

### Comandos de Diagnóstico
```bash
# Verificar instalación
npm list --depth=0

# Verificar build
npm run build

# Verificar linting
npm run lint
```

---

**Desarrollado con ❤️ para consultorios médicos pediátricos**