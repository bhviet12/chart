import React, { useState } from "react";
import axios from "axios";

export default function PriceButton({
  coin,
  interval,
}: {
  coin: string;
  interval: string;
}) {
  const [result, setResult] = useState<string | null>(null);

  const fetchPrice = async () => {
    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/klines?symbol=${coin}&interval=${interval}&limit=2`
      );
      const data = res.data as Array<any>;
      const latest = data[1];
      const prev = data[0];
      setResult(`Hiện tại: ${latest[4]} | 1 nến trước: ${prev[4]}`);
    } catch {
      setResult("Lỗi khi lấy dữ liệu!");
    }
  };

  return (
    <div>
      <button
        className="px-2 py-1 bg-green-600 text-white rounded"
        onClick={fetchPrice}
      >
        Giá hiện tại & 1 nến trước
      </button>
      {result && <div className="mt-1 text-xs">{result}</div>}
    </div>
  );
}
