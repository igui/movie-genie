
from typing import Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from weaviate.classes.query import Filter
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from weaviate.classes.query import MetadataQuery
from weaviate.collections.classes.internal import Object, Properties, MetadataReturn


from movie_genie.database import get_movies_collection
from movie_genie.log import logger

async def init_app(app: FastAPI):
    logger.info("Initializing the app...")
    load_dotenv()
    yield


app = FastAPI(lifespan=init_app)

# Allow CORS for local development
app.add_middleware(CORSMiddleware, 
                   allow_origins=["*"], 
                   allow_credentials=True,
                   allow_methods=["*"], 
                   allow_headers=["*"])


class Movie(BaseModel):
    movie_id: int
    plot: str
    title: str

class ResultMetadata(BaseModel):
    distance: Optional[float]
    certainty: Optional[float]

class SearchResult(BaseModel):
    properties: Movie
    metadata: ResultMetadata


@app.get("/movies")
def list_movies(limit: int = 5, offset: int = 0) -> list[SearchResult]:
    collection = get_movies_collection()
    objs = collection.query.fetch_objects(
        limit=limit,
        offset=offset,
    )
    return objs.objects



@app.get("/movies/{movie_id}")
def get_movie(movie_id: int) -> SearchResult:
    collection = get_movies_collection()
    obj = collection.query.fetch_objects(
        filters=Filter.by_property("movie_id").equal(movie_id),
        limit=1, 
    )
    if len(obj.objects) == 0:
        raise HTTPException(status_code=404, detail="Movie not found")
    return obj.objects[0]


@app.get("/movie_search_near_text")
def search_near_text(query: str, limit: int = 5) -> list[SearchResult]:
    movies = get_movies_collection()
    ret = movies.query.near_text(
        query, 
        limit=limit, 
        return_metadata=MetadataQuery(distance=True, certainty=True)
    )
    return ret.objects