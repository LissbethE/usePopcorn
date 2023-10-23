import { useEffect, useState } from "react";

//////////////////////////////////////
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [amount, setAmount] = useState(1);
  const [fromCur, setFromCur] = useState("EUR");
  const [toCur, setToCur] = useState("USD");
  const [converted, setConverted] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();

      const convert = async function () {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("💥Something went wrong with fetching data");

          const data = await res.json();
          setConverted(data.rates[toCur]);

          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") console.log("💥Error: ", err);
        }
      };

      if (fromCur === toCur) return setConverted(amount);
      convert();

      // Cleaning up data fetching
      return () => controller.abort();
    },
    [amount, fromCur, toCur]
  );

  return (
    <div>
      <input
        type="text"
        value={amount}
        disabled={isLoading}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <select
        value={fromCur}
        disabled={isLoading}
        onChange={(e) => setFromCur(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      <select
        value={toCur}
        disabled={isLoading}
        onChange={(e) => setToCur(e.target.value)}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>

      <p>
        🤑 {converted} {toCur}
      </p>
    </div>
  );
}
