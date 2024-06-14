import datetime
import json
import os
from functools import cache

import weaviate
from weaviate.classes.config import Configure, DataType, Property
from weaviate.classes.query import Filter
from weaviate.collections import Collection


VECTORIZER_MODEL = "text-embedding-3-large"

@cache
def weaviate_connect_client() -> weaviate.Client:
    """
    Connect to Weaviate and return the client
    """
    client = weaviate.connect_to_wcs(
        cluster_url=os.environ['WEAVIATE_URL'],
        auth_credentials=weaviate.auth.AuthApiKey(os.getenv("WEAVIATE_API_KEY")),
        headers={
            'X-OpenAI-Api-key': os.getenv("OPENAI_KEY")
        }
    )
    client.connect()
    return client



def create_collections():
    """
    Create the Movies collection in Weaviate database
    """
    client = weaviate_connect_client()

    # Movies are OK
    client.collections.delete("Movies")
    client.collections.create(
        name="Movies",
        vectorizer_config=Configure.Vectorizer.text2vec_openai(
            model=VECTORIZER_MODEL
        ),
        properties=[
            Property(name="movie_id", data_type=DataType.INT),
            Property(name="plot", data_type=DataType.TEXT),
            Property(name="title", data_type=DataType.TEXT),
        ]
    )

@cache
def get_movies_collection() -> Collection:
    """
    Get the Movies collection from the database
    """
    client = weaviate_connect_client()
    return client.collections.get("Movies")
