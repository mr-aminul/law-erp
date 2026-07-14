/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground, var(--color-white))",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        theme: {
          DEFAULT: "var(--color-theme)",
          darkest: "var(--color-theme-darkest)",
          darker: "var(--color-theme-darker)",
          mid: "var(--color-theme-mid)",
          bright: "var(--color-theme-bright)",
          subtle: "var(--color-theme-subtle)",
        },
        sidebar: "var(--color-sidebar)",
        "sidebar-alt": "var(--color-sidebar-alt)",
        "active-nav": "var(--color-active-nav)",
        "active-nav-soft": "var(--color-active-nav-soft)",
        "on-theme": "var(--color-on-theme)",
        "on-theme-darker": "var(--color-on-theme-darker)",
        "on-theme-bright": "var(--color-on-theme-bright)",
        "on-active-nav": "var(--color-on-active-nav)",
        "on-active-nav-soft": "var(--color-on-active-nav-soft)",
        "on-green": "var(--color-on-green)",
        "on-sidebar": "var(--color-on-sidebar)",
        cream: "var(--color-cream)",
        "cream-card": "var(--color-cream-card)",
        "text-primary": "var(--color-text-primary)",
        "text-sec": "var(--color-text-sec)",
        "text-muted": "var(--color-text-muted)",
        green: {
          DEFAULT: "var(--color-green)",
          light: "var(--color-green-light)",
        },
        amber: {
          DEFAULT: "var(--color-amber)",
          light: "var(--color-amber-light)",
        },
        red: {
          DEFAULT: "var(--color-red)",
          light: "var(--color-red-light)",
        },
        blue: {
          DEFAULT: "var(--color-blue)",
          light: "var(--color-blue-light)",
        },
        status: {
          progress: "var(--color-status-in-progress)",
          "progress-surface": "var(--color-status-in-progress-surface)",
          pending: "var(--color-status-pending)",
          "pending-surface": "var(--color-status-pending-surface)",
          completed: "var(--color-status-completed)",
          "completed-surface": "var(--color-status-completed-surface)",
          hold: "var(--color-status-on-hold)",
          "hold-surface": "var(--color-status-on-hold-surface)",
        },
        divider: "var(--color-divider)",
        "muted-bg": "var(--color-muted-bg)",
      },
      borderRadius: {
        panel: "var(--radius-panel)",
        card: "var(--radius-card)",
        input: "var(--radius-input)",
        badge: "var(--radius-badge)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
      },
      width: {
        sidebar: "var(--sidebar-width)",
      },
      spacing: {
        shell: "var(--shell-margin)",
      },
    },
  },
};
