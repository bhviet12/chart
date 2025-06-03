import { createChart } from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { ICandleStick } from "../types/candle";

interface Props {
  data: ICandleStick[];
}

const CandleChart = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = createChart(chartRef.current!, {
      width: chartRef.current!.clientWidth,
      height: 400,
    });

    const series = chart.addCandlestickSeries();

    series.setData(
      data.map((item) => {
        const date = new Date(item.openTime);
        const yyyy = date.getUTCFullYear();
        const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(date.getUTCDate()).padStart(2, '0');
        return {
          time: `${yyyy}-${mm}-${dd}`,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        };
      })
    );

    return () => chart.remove();
  }, [data]);

  return <div ref={chartRef} />;
};

export default CandleChart;
