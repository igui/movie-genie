import "./App.css";
import { useEffect, useState } from "react";
import { MovieSearchResult } from "./types";
import VisualGrid from "./VisualGrid";
import SearchFilter from "./SearchFilter";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const DEFAULT_LIMIT = 28;
const API_ENDPOINT = "http://localhost:8000";

const AppGrid = styled.div`
  grid-template-rows: auto auto 1fr auto;
`;

function App() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
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

  const search = (search: string) => {
    setLoading(true);
    // Fetch movies from the API
    fetch(
      `${API_ENDPOINT}/movie_search_near_text/?query=${search}&limit=${DEFAULT_LIMIT}`
    )
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  };

  return (
    <AppGrid className="grid h-full">
      <Header />
      <SearchFilter onSearch={search} disabled={loading} />
      <VisualGrid movies={movies} loading={loading} />
      <Footer />
    </AppGrid>
  );
}

export default App;
