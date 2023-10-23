import React from "react";

const Movie = ({ movie, onSelectMovie }) => {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      {movie.Poster !== "N/A" ? (
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
      ) : (
        <p>🥤🍿🎥</p>
      )}

      <h3>{movie.Title}</h3>

      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

export default Movie;
