import React from "react";

export default function IndicatorToggle({
  indicators,
  setIndicators,
}: {
  indicators: { rsi: boolean; ema: boolean };
  setIndicators: (ind: { rsi: boolean; ema: boolean }) => void;
}) {
  return (
    <div className="flex gap-2 items-center">
      <label className="flex gap-1 items-center">
        <input
          type="checkbox"
          checked={indicators.rsi}
          onChange={e => setIndicators({ ...indicators, rsi: e.target.checked })}
        />
        <span>RSI</span>
      </label>
      <label className="flex gap-1 items-center">
        <input
          type="checkbox"
          checked={indicators.ema}
          onChange={e => setIndicators({ ...indicators, ema: e.target.checked })}
        />
        <span>EMA</span>
      </label>
    </div>
  );
}
