import React, { useEffect, useState, useRef } from "react";
import Loader from "../Reusability/Loader";
import StarRating from "../Stars/StarRating";

const MovieDetails = function ({
  selectedId,
  onCloseMovie,
  onAddWatched,
  myKey,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  //////////////////////////////////////
  const handleAdd = function () {
    const newWatchedMovie = {
      imdbID: selectedId,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runtime: Number(movie.Runtime.split(" ")[0]),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // No guardar la misma peli
  const isWatched = watched
    .map((watched) => watched?.imdbID)
    .includes(selectedId);

  const watchedUserRating = watched.find(
    (mov) => mov.imdbID === selectedId
  )?.userRating;

  //////////////////////////////////////
  useEffect(
    function () {
      const getMovieDetails = async function () {
        try {
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${myKey}&i=${selectedId}`
          );
          const data = await res.json();

          setMovie(data);

          setIsLoading(false);
        } catch (err) {
          console.log(err);
        }
      };

      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!movie.Title) return;

      document.title = `Movie | ${movie.Title}`;

      // Cleaning up the title
      return () => (document.title = `🍿usePopcorn`);
    },
    [movie.Title]
  );

  // Listening to a Keypress
  useEffect(
    function () {
      const callback = function (e) {
        if (e.code === "Escape") onCloseMovie();
      };

      document.addEventListener("keydown", callback);

      // Clean Up
      return () => document.removeEventListener("keydown", callback);
    },
    [onCloseMovie]
  );

  // Refs to persist data between renders
  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  //////////////////////////////////////
  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>

            <img src={movie.Poster} alt={movie.Title} />

            <div className="details-overview">
              <h2>{movie.Title}</h2>

              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>

              <p>{movie.Genre}</p>

              <p>
                <span>⭐</span>
                {movie.imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating size={24} onSetRating={setUserRating} />

                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add To List
                    </button>
                  )}
                </>
              ) : (
                <p>⛔ You rated with movie: ⭐{watchedUserRating}</p>
              )}
            </div>

            <p>
              <em>{movie.Plot}</em>
            </p>

            <p>🌟 Starring: {movie.Actors}</p>

            <p>🎬 Directed by: {movie.Director}</p>

            <p>✍️ Writers: {movie.Writer}</p>

            <p>🌎 Country: {movie.Country}</p>

            <p>🗣️ Language: {movie.Language}</p>

            <p>🏆 Awards: {movie.Awards}</p>
          </section>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
