import { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import type { IChartApi, UTCTimestamp } from "lightweight-charts";
import type { ICandleStick } from "../utils/api";

type Props = {
  data: ICandleStick[];
  ema?: (number | undefined)[];
  theme: "light" | "dark";
};

export default function ChartContainer({ data, ema, theme }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ReturnType<IChartApi["addCandlestickSeries"]> | null>(null);
  const volumeSeriesRef = useRef<ReturnType<IChartApi["addHistogramSeries"]> | null>(null);
  const emaSeriesRef = useRef<ReturnType<IChartApi["addLineSeries"]> | null>(null);

  // Chỉ tạo chart lại khi theme đổi hoặc lần đầu mount
  useEffect(() => {
    if (!chartRef.current) return;

    // Xóa chart cũ nếu có
    if (chartInstance.current) {
      chartInstance.current.remove();
      chartInstance.current = null;
    }

    const chart = createChart(chartRef.current, {
      height: 400,
      layout: {
        background: { color: theme === "dark" ? "#131722" : "#FFFFFF" },
        textColor: theme === "dark" ? "#D9D9D9" : "#191919",
      },
      grid: {
        vertLines: { color: theme === "dark" ? "#363c4e" : "#eee" },
        horzLines: { color: theme === "dark" ? "#363c4e" : "#eee" },
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      rightPriceScale: { scaleMargins: { top: 0.2, bottom: 0.3 } },
    });

    chartInstance.current = chart;
    candleSeriesRef.current = chart.addCandlestickSeries();
    volumeSeriesRef.current = chart.addHistogramSeries({
      color: "#2962FF",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });
    chart.priceScale('').applyOptions({ scaleMargins: { top: 0.7, bottom: 0 } });
    emaSeriesRef.current = chart.addLineSeries({
      color: "#FFA500",
      lineWidth: 2,
    });

    // Responsive
    const handleResize = () => {
      if (chartRef.current) {
        chart.resize(chartRef.current.clientWidth, 400);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [theme]);

  // Khi data đổi, chỉ setData cho các series, KHÔNG tạo hoặc remove chart!
  useEffect(() => {
    if (
      !candleSeriesRef.current ||
      !volumeSeriesRef.current ||
      !data.length
    )
      return;

    const candlestick = data.map((k) => ({
      time: Math.floor(k.openTime / 1000) as UTCTimestamp,
      open: k.open,
      high: k.high,
      low: k.low,
      close: k.close,
    }));

    candleSeriesRef.current.setData(candlestick);

    volumeSeriesRef.current.setData(
      data.map((k) => ({
        time: Math.floor(k.openTime / 1000) as UTCTimestamp,
        value: k.volume,
        color: k.close > k.open ? "#26a69a" : "#ef5350",
      }))
    );
    if (ema && ema.length && emaSeriesRef.current) {
      emaSeriesRef.current.setData(
        candlestick.map((c, i) => ({
          time: c.time,
          value: ema[i] ?? undefined,
        }))
      );
    }
  }, [data, ema]);

  return (
    <div className="w-full h-[400px] bg-white dark:bg-neutral-900 border rounded-2xl shadow-lg overflow-hidden">
      <div ref={chartRef} className="w-full h-[400px]" />
    </div>
  );
}
