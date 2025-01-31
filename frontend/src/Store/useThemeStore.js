import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light", // Default theme, will be updated in useEffect
  setTheme: (newTheme) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    set({ theme: newTheme });
  },
}));

// Ensure theme is set on first app load
if (typeof window !== "undefined") {
  const storedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", storedTheme);
  useThemeStore.setState({ theme: storedTheme });
}
