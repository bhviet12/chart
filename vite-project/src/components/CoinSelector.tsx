import React from "react";
import { cryptoCoins, getCryptoImage } from "../utils/api";

export default function CoinSelector({
  current,
  setCurrent,
}: {
  current: string;
  setCurrent: (s: string) => void;
}) {
  return (
    <select
      className="px-2 py-1 rounded border text-xs dark:bg-gray-800"
      value={current}
      onChange={e => setCurrent(e.target.value)}
    >
      {cryptoCoins.map((coin) => (
        <option key={coin.cryptoName} value={coin.cryptoName}>
          {coin.cryptoName}
        </option>
      ))}
    </select>
  );
}
