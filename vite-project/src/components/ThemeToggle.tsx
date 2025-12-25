
export default function ThemeToggle({
  theme,
  setTheme,
}: {
  theme: "light" | "dark";
  setTheme: (t: "light" | "dark") => void;
}) {
  return (
    <button
      className="rounded-xl px-3 py-1 border border-gray-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="Chuyển theme"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
