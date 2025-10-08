import { defineConfig } from 'astro/config';
import dotenv from 'dotenv';

// Importar integraciones
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import react from '@astrojs/react';

// Cargar variables de entorno
dotenv.config();

// Configuración de Astro
export default defineConfig({
  output: 'server',
  integrations: [
    tailwind(), // Integración de Tailwind CSS
    preact(),   // Integración de Preact
    react()     // Integración de React
    
  ],
});


