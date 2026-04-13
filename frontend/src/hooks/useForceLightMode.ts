import { useEffect } from "react";

export function useForceLightMode() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");

    return () => {
      const storedTheme = localStorage.getItem("sukoon-theme");
      if (storedTheme === "dark" || (!storedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        root.classList.add("dark");
      }
    };
  }, []);
}
