interface Metadata {
    score: number | null;
}

interface MovieSearchResult {
    movie_id: number;
    title: string;
    plot: string;
    chunk: string;
    metadata: Metadata;
}