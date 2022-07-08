import React, { useState } from "react";
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client";

const QUERY_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      age
      username
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      id
      name
      yearOfPublication
    }
  }
`;

const QUERY_GET_MOVIE_BY_NAME = gql`
  query GetMovieByName($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
      isInTheaters
    }
  }
`;

const CREATE_MOVIE_MUTATION = gql`
  mutation CreateMovie($input: CreateMovieInput!) {
    createMovie(input: $input) {
      name
      yearOfPublication
    }
  }
`;

function DisplayData() {
  const { data, loading, refetch } = useQuery(QUERY_ALL_MOVIES);
  const [movieName, setMovieName] = useState("");
  const [movieYear, setMovieYear] = useState("");
  const [inputText, setInputText] = useState("");
  const [fetchMovie, { data: movieSearchedData, error: movieSearchedError }] =
    useLazyQuery(QUERY_GET_MOVIE_BY_NAME);

  const [createMovie] = useMutation(CREATE_MOVIE_MUTATION);

  const onChangeInput = (e) => {
    setInputText(e.target.value);
  };

  if (loading) {
    return <h1>DATA IS LOADING...</h1>;
  }

  if (data) {
    console.log(data);
  }

  return (
    <div>
      <input
        type="text"
        placeholder="name"
        onChange={(e) => {
          setMovieName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="year"
        onChange={(e) => {
          setMovieYear(e.target.value);
        }}
      />
      <button
        onClick={() => {
          createMovie({
            variables: {
              input: {
                name: movieName,
                yearOfPublication: Number(movieYear),
              },
            },
          });
          refetch();
        }}
      >
        Submit
      </button>
      {data &&
        data.movies.map((movie) => {
          return (
            <div>
              <h1>ID: {movie.id}</h1>
              <h1>Name: {movie.name}</h1>
              <h1>Year: {movie.yearOfPublication}</h1>
            </div>
          );
        })}
      <input
        type="text"
        placeholder={inputText}
        value={inputText}
        onChange={onChangeInput}
      />
      <button
        onClick={() => {
          fetchMovie({
            variables: {
              name: inputText,
            },
          });
        }}
      >
        Fetch Data
      </button>
      {movieSearchedData && (
        <div>
          <h1>{movieSearchedData.movie.name}</h1>
          <h1>{movieSearchedData.movie.yearOfPublication}</h1>
        </div>
      )}
    </div>
  );
}

export default DisplayData;
