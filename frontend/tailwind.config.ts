import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#105D56',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: '#17B2A8',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  safelist: [
    // Bronze tier colors
    "bg-orange-700",
    "bg-orange-600", 
    "bg-orange-50",
    "text-orange-900",
    "text-orange-800",
    "border-orange-600",
    "border-orange-500",
    "shadow-orange-300/50",
    
    // Silver tier colors
    "bg-gray-600",
    "bg-gray-50",
    "text-gray-800",
    "border-gray-400",
    "shadow-gray-400/50",
    "bg-slate-600",
    "bg-slate-50", 
    "text-slate-800",
    "border-slate-500",
    
    // Gold tier colors
    "bg-yellow-500",
    "bg-yellow-600",
    "bg-yellow-50",
    "text-yellow-900",
    "text-yellow-800",
    "border-yellow-500",
    "border-yellow-400",
    "shadow-yellow-400/50",
    "bg-amber-500",
    "bg-amber-600",
    "bg-amber-50",
    "text-amber-900",
    "text-amber-800",
    "border-amber-500",
    "border-amber-400",
    
    // Gradient classes for badges
    "bg-gradient-to-r",
    "from-orange-600",
    "to-orange-700",
    "from-gray-500", 
    "to-gray-600",
    "from-yellow-500",
    "to-yellow-600",
    "from-amber-600",
    "to-amber-700",
    
    // Common card styles
    "rounded-lg",
    "rounded-xl", 
    "shadow-lg",
    "border-2",
    "border-3"
  ],
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
