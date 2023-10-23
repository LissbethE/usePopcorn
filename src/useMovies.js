import { useState, useEffect } from "react";

const myKey = "82b7437f";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      const fetchMovies = async function () {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${myKey}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("💥Something went wrong with fetching Movies");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found 😢");

          setMovies(data?.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            console.log("💥ERROR: ", err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      };

      if (query.length < 3) {
        setMovies([]);
        setError("");

        return;
      }

      fetchMovies();

      // Cleaning up data fetching
      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoading, error };
}
