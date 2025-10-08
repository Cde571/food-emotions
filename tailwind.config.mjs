/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'], // Rutas para buscar clases de Tailwind
	theme: {
	  extend: {}, // Aquí puedes extender el tema de Tailwind si es necesario
	},
	plugins: [], // Agrega aquí cualquier plugin de Tailwind si lo necesitas

	extend: {
  	keyframes: {
    gradient: {
      "0%": { backgroundPosition: "0% 50%" },
      "50%": { backgroundPosition: "100% 50%" },
      "100%": { backgroundPosition: "0% 50%" },
    },
  },
  	animation: {
    gradient: "gradient 8s ease infinite",
  },
}
  };
  