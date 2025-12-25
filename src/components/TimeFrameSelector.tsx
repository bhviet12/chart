
export default function TimeframeSelector({
  current,
  setCurrent,
  timeframes,
}: {
  current: string;
  setCurrent: (s: string) => void;
  timeframes: string[];
}) {
  return (
    <div className="flex gap-1">
      {timeframes.map((tf) => (
        <button
          key={tf}
          className={`px-2 py-1 rounded border text-xs ${
            tf === current
              ? "bg-blue-600 text-white"
              : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300"
          }`}
          onClick={() => setCurrent(tf)}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
