# 🚀 Proyecto Astro: Chatbot iterativo

¡Bienvenido a nuestro proyecto de ChatBot con Astro! Este proyecto utiliza **Astro** para crear una página web rápida y optimizada, enfocada en la interacción con bots interactivos.

Si nunca has trabajado con Astro, este README te guiará para configurar el proyecto y comenzar a trabajar en él. 🌟

## 📋 **Requisitos Previos**

Antes de comenzar, asegúrate de tener los siguientes programas instalados en tu sistema:

- **Node.js** (v14.18.0 o superior)
- **npm** (incluido con Node.js)
- **Git** para clonar el repositorio

## ⚙️ **Configuración del Proyecto Localmente**

Sigue estos pasos para configurar el proyecto en tu máquina local:

1. **Clona el Repositorio**

   Abre tu terminal y ejecuta:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd NOMBRE_DEL_PROYECTO
## Instala las Dependencias

Dentro de la carpeta del proyecto, instala las dependencias necesarias ejecutando:
npm install


Ejecuta el Proyecto en Desarrollo

Inicia el servidor de desarrollo con:
   ```bash
   npm run dev
   ```
Construye para Producción

Si necesitas crear una versión para producción, usa:
 ```bash
npm run build
 ```
## 🗂️ Estructura del Proyecto
Aquí tienes la estructura básica del proyecto para que puedas orientarte fácilmente:
```bash
/src
│
├── /components
│   ├── NavBar.astro          # Componente de la barra de navegación
│   ├── Footer.astro          # Componente del pie de página
│   └── ...                   # Otros componentes reutilizables
│
├── /layouts
│   └── MainLayout.astro      # Layout principal utilizado en las páginas
│
├── /pages
│   ├── index.astro           # Página de inicio
│   ├── login.astro           # Página de inicio de sesión
│   ├── register.astro        # Página de registro de usuario
│   ├── bot-animation.astro   # Página con animaciones de bots
│   └── ...                   # Otras páginas adicionales
│
└── /public
    ├── /img                  # Carpeta de imágenes
    └── /styles               # Archivos de estilos globales
```
🌐 Secciones en el Index
La página principal (index.astro) incluirá las siguientes secciones:

Intro: Introducción a los chatbots.
Asks: Preguntas frecuentes o casos de uso destacados.
Variedad de Bots: Presentación de los diferentes bots disponibles.
Características: Detalle de las características clave de nuestros bots.
📄 Páginas en el Proyecto
Index: Página de inicio que presenta los diferentes elementos de la aplicación.
Login y Register: Páginas dedicadas para que los usuarios inicien sesión o se registren.
Bot Animation: Página que muestra las animaciones y funcionalidades de los bots.
🔧 Mejoras y Contribuciones
Si deseas contribuir al proyecto, sigue estos pasos para crear una rama, realizar cambios, y enviar un pull request. Asegúrate de probar todos los cambios localmente antes de subirlos.

## Crea una rama nueva
```
git checkout -b nombre-de-tu-rama
```
## Realiza tus cambios y confirma
```
git add .
git commit -m "Descripción de los cambios"
```

Sube la rama y crea un pull request
```
git push origin nombre-de-tu-rama
```


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 
Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
