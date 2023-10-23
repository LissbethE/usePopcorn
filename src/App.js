import { useState } from "react";

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
import { useLocalStorageState } from "./useLocalStorageState";

//////////////////////////////////////

const myKey = "82b7437f";

//////////////////////////////////////
export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  // Custom Hook
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  /////////////////////////
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  // -----
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);

    // 1) Saving movies in localstorage
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

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
