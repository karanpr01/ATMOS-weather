import { useEffect, useState } from "react";

export function useTheme () {
    const [theme, setTheme] = useState(() => localStorage.getItem("atmos-theme")|| "system");

    useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme:dark)");

    const apply = () => {
        const isDark = theme === "dark" || (theme === "system" && media.matches);
        document.documentElement.classList.toggle("dark",isDark);
    };

    apply();
    localStorage.setItem("atmos-theme", theme);

    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
},[theme]);

return [theme, setTheme];
}

