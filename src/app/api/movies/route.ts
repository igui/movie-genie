import { NextRequest } from "next/server";
import weaviate, { WeaviateClient, Collection } from "weaviate-client";

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

async function getCollection(): Promise<Collection> {
  const client = await connectToWeaviate();
  return client.collections.get("Movies");
}

const DEFAULT_ALPHA = '1';
const DEFAULT_LIMIT = '10';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query') || '';
  const limit = parseInt(searchParams.get('limit') || DEFAULT_LIMIT);

  //
  const alpha = parseFloat(searchParams.get('alpha') || DEFAULT_ALPHA);

  const collection = await getCollection();
  var ret = null;
  if(!query) {
    ret = await collection.query.fetchObjects({ limit: limit });
  }
  else {
    ret = await collection.query.nearText(
      query,
      {
        limit: limit,
        returnMetadata: 'all'
      }
    );
  }
  
  return Response.json(ret.objects);
}
