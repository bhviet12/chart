import React from 'react';

interface Props {
  interval: string;
  onIntervalChange: (intv: string) => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

const UIControls: React.FC<Props> = ({ interval, onIntervalChange, onToggleTheme, theme }) => {
  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
      <div className="flex gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            className={`px-2 py-1 rounded ${interval === tf ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            onClick={() => onIntervalChange(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
      <button onClick={onToggleTheme} className="px-3 py-1 bg-yellow-400 rounded">
        Toggle {theme === 'light' ? 'Dark' : 'Light'}
      </button>
    </div>
  );
};

export default UIControls;
