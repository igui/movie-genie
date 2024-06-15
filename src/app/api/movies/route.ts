import { NextRequest } from "next/server";
import weaviate, {
  WeaviateClient,
  Collection,
  WeaviateNonGenericObject,
  ReturnMetadata,
} from "weaviate-client";

async function connectToWeaviate(): Promise<WeaviateClient> {
  if (!process.env.WEAVIATE_URL) {
    throw new Error("WEAVIATE_URL is not set");
  }
  if (!process.env.WEAVIATE_API_KEY) {
    throw new Error("WEAVIATE_API_KEY is not set");
  }
  if (!process.env.OPENAI_KEY) {
    throw new Error("OPENAI_KEY is not set");
  }

  return weaviate.connectToWeaviateCloud(process.env.WEAVIATE_URL, {
    authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_API_KEY),
    headers: {
      "X-OpenAI-Api-Key": process.env.OPENAI_KEY, // Replace with your inference API key
    },
  });
}

const DEFAULT_ALPHA = "1";
const DEFAULT_LIMIT = "10";

interface MovieChunkResult {
  movie_id: number;
  title: string;
  plot: string;
  chunk: string;
  metadata: ReturnMetadata;
}

function objToPayload(obj: WeaviateNonGenericObject): MovieChunkResult {
  const movieRef = obj.references!["movie"].objects[0];
  return {
    movie_id: movieRef.properties["movie_id"],
    title: movieRef.properties["title"],
    plot: movieRef.properties["plot"],
    chunk: obj.properties["chunk"],
    metadata: obj.metadata,
  } as MovieChunkResult;
}

// Search for objects in the "MovieChunk" collection in Weaviate
// using a hybrid search (text and vector search)
// The search is performed over the "chunk" property
// We return a list of objects that match the query but we only return each movie once
// The "alpha" parameter controls the balance between text and vector search
async function searchHybrid(
  collection: Collection,
  query: string,
  limit: number,
  alpha: number
): Promise<WeaviateNonGenericObject[]> {
  const objs: WeaviateNonGenericObject[] = [];
  const collectedMovies = new Set<number>();

  for (let offset = 0; objs.length < limit; offset += limit) {
    const ret = await collection.query.hybrid(query, {
      limit: limit,
      offset: offset,
      alpha: alpha,
      returnReferences: [{ linkOn: "movie" }],
      returnMetadata: "all",
    });
    if (ret.objects.length === 0) {
      break; // We reached the end of the collections
    }
    for (const obj of ret.objects) {
      const movieRef = obj.references!["movie"].objects[0];
      const movieId = movieRef.properties["movie_id"] as number;
      if (!collectedMovies.has(movieId) && objs.length < limit) {
        collectedMovies.add(movieId);
        objs.push(obj);
      }
    }
  }
  return objs;
}

// GET /api/movies
// GET /api/movies?query=matrix
// GET /api/movies?query=matrix&limit=5
// GET /api/movies?query=matrix&limit=5&alpha=0.5
//
// Returns a list of movies that match the query
// If no query is provided, returns a list of all movies
// We search over the "MovieChunk" collection in Weaviate
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") || "";
  const limit = parseInt(searchParams.get("limit") || DEFAULT_LIMIT);
  const alpha = parseFloat(searchParams.get("alpha") || DEFAULT_ALPHA);

  const client = await connectToWeaviate();
  const collection = await client.collections.get("MovieChunk");

  if (!query) {
    const ret = await collection.query.fetchObjects({
      limit: limit,
      returnReferences: [{ linkOn: "movie" }],
    });
    return Response.json(ret.objects.map(objToPayload));
  } else {
    const objs = await searchHybrid(collection, query, limit, alpha);
    return Response.json(objs.map(objToPayload));
  }
}
