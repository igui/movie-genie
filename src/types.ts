interface Movie {
    movie_id: number;
    title: string;
    plot: string;
}

interface Metadata {
    distance: number | null;
    certainty: number | null;
}

interface MovieSearchResult {
    properties: Movie;
    metadata: Metadata;
}