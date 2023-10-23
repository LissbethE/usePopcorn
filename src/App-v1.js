import { useEffect, useState } from "react";

import NavBar from "./components/Nav/NavBar";
import Search from "./components/Reusability/Search";
import NumResults from "./components/Reusability/NumResults";
import Main from "./components/Main/Main";
import Box from "./components/Reusability/Box";
import MovieList from "./components/Movies/MovieList";
import WatchedSummary from "./components/WatchedMovie/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMovie/WatchedMoviesList";
import Loader from "./components/Reusability/Loader";
import ErrorMessage from "./components/Reusability/ErrorMessage";
import MovieDetails from "./components/Movies/MovieDetails";
import { useMovies } from "./useMovies";

//////////////////////////////////////
/*
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];*/

const myKey = "82b7437f";

//////////////////////////////////////
export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // const [watched, setWatched] = useState([]);
  // Reading the data from localstorage
  const [watched, setWatched] = useState(function () {
    const storedValue = localStorage.getItem("watched");

    return JSON.parse(storedValue);
  });

  // Custom Hook
  useMovies(query);

  /////////////////////////
  const handleSelectMovie = (id) =>
    setSelectedId((selectedId) => (id === selectedId ? null : id));

  const handleCloseMovie = () => setSelectedId(null);

  // -----
  const handleAddWatched = function (movie) {
    setWatched((watched) => [...watched, movie]);

    // 1) Saving movies in localstorage
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  };

  const handleDeleteWatched = (id) =>
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));

  /////////////////////////
  useEffect(
    function () {
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

      handleCloseMovie();
      fetchMovies();

      // Cleaning up data fetching
      return () => controller.abort();
    },
    [query]
  );

  useEffect(
    function () {
      // 2) Saving movies in localstorage
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  /////////////////////////
  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        {/* Contenedor Lista De peliculas */}
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* Contenedor De Peliculas Miradas */}
        <Box>
          {selectedId ? (
            <MovieDetails
              key={selectedId}
              myKey={myKey}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>

        {/*  Option 2
        <Box element={<MovieList movies={movies} />} />

        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        />
        */}
      </Main>
    </>
  );
}
