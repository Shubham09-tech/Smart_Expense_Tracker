import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="
        group relative flex items-center gap-2
        h-10 px-2
        rounded-full
        border border-gray-200 dark:border-gray-700
        bg-gray-100/80 dark:bg-gray-800/90
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:scale-[1.03]
        active:scale-95
        overflow-hidden
      "
    >
      {/* Sliding background */}
      <span
        className={`
          absolute top-1 bottom-1
          w-9 rounded-full
          bg-white dark:bg-gray-700
          shadow-sm
          transition-all duration-300 ease-out
          ${isDark ? "right-1" : "left-1"}
        `}
      />

      {/* Sun */}
      <span
        className={`
          relative z-10
          flex items-center justify-center
          w-8 h-8 rounded-full
          transition-all duration-300
          ${
            !isDark
              ? "text-amber-500 rotate-0 scale-100"
              : "text-gray-400 -rotate-45 scale-75"
          }
        `}
      >
        <Sun size={17} strokeWidth={2.3} />
      </span>

      {/* Moon */}
      <span
        className={`
          relative z-10
          flex items-center justify-center
          w-8 h-8 rounded-full
          transition-all duration-300
          ${
            isDark
              ? "text-indigo-400 rotate-0 scale-100"
              : "text-gray-400 rotate-45 scale-75"
          }
        `}
      >
        <Moon size={17} strokeWidth={2.3} />
      </span>
    </button>
  );
}