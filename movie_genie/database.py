import datetime
import json
import os
from functools import cache

import weaviate
from weaviate.classes.config import DataType, Property
from weaviate.classes.query import Filter

from movie_genie.log import logger


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


def create_collection():
    """
    Create the Bookings collection in Weaviate database
    """
    client = weaviate_connect_client()
    client.collections.delete("Bookings")
    client.collections.create(
        name="Bookings",
        properties=[
            Property(name="booking_id", data_type=DataType.INT),
            Property(name="date", data_type=DataType.DATE),
            Property(name="service", data_type=DataType.TEXT),
        ]
    )


def add_initial_bookings():
    """
    Add some initial bookings to the database
    """
    client = weaviate_connect_client()
    with open('seed_data.json', 'r') as f, client.batch.dynamic() as batch:
        data = json.load(f)
        for booking in data['bookings']:
            datetime_s = f"{booking['date']} {booking['time']}" # looks like "2021-10-01 10:00 AM" 
            datetime_obj = datetime.datetime.strptime(datetime_s, "%Y-%m-%d %I:%M %p")

            batch.add_object("Bookings", {
                "booking_id": int(booking['id']),
                "date": datetime_obj.astimezone(datetime.timezone.utc),
                "service": booking['service'],
            })


def check_booking_exists(
    collection: weaviate.collections.Collection,
    start_date: datetime.datetime,
    service: str
) -> int | None:
    """
    Check if a booking already exists for a specific date and service
    """
    end_date = start_date + datetime.timedelta(minutes=30)
    response = collection.query.fetch_objects(
        filters=(
            Filter.by_property("date").greater_or_equal(start_date) &
            Filter.by_property("date").less_or_equal(end_date) &
            Filter.by_property("service").equal(service)
        ),
        limit=1
    )
    if len(response.objects) > 0:
        return response.objects[0].properties["booking_id"]

def initialize_database():
    """
    Initialize the database with the collection and some initial bookings
    """
    logger.info("Setting up database")
    create_collection()
    logger.info("Adding initial bookings")
    add_initial_bookings()
    logger.info("Database initialized")



