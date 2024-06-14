'use client'

import { useEffect, useState } from "react";
import VisualGrid from "./VisualGrid";
import SearchFilter from "./SearchFilter";
import Header from "./Header";
import Footer from "./Footer";
import Modal from "./Modal";

const DEFAULT_LIMIT = 16;
const API_ENDPOINT = "http://localhost:8000";

function App() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // Fetch movies from the API
    fetch(`${API_ENDPOINT}/movies?limit=${DEFAULT_LIMIT}`)
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const search = (search: string, alpha: number) => {
    setLoading(true);
    // Fetch movies from the API
    fetch(
      `${API_ENDPOINT}/movie_search_near_text/?query=${search}&limit=${DEFAULT_LIMIT}&alpha=${alpha}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  const selectMovie = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
  };

  const unsetMovie = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="grid h-screen w-screen text-center">
      <Header />
      <SearchFilter onSearch={search} disabled={loading} />
      <VisualGrid movies={movies} loading={loading} onSelect={selectMovie} />
      {selectedMovie && (
        <Modal searchResult={selectedMovie} onClose={unsetMovie} />
      )}
      <Footer />
    </div>
  );
}

export default App;
