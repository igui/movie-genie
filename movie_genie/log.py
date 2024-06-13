"""
Basic logging configuration for the Movie Genie package.
"""
import logging

logger = logging.getLogger("movie-genie")
logger.addHandler(logging.StreamHandler())
logger.setLevel(logging.INFO)
