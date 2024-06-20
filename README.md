# Movie 🎥 Search 🔍

## Powered by Weaviate <img src="https://avatars.githubusercontent.com/u/37794290?s=32&v=4">

LLM based Recommender that suggests great movies for you and your friends.

![Screenshot](https://i.imgur.com/3sGLA0u.png)

It has a list of 12K+ movies from the 1990's until today from the Kaggle's [wikimedia-movies](https://www.kaggle.com/datasets/exactful/wikipedia-movies) dataset. The search capabilites are powered by [Weaviate](https://weaviate.io/) and [OpenAI](https://platform.openai.com/) to generate vector embeddings for search. The frontend is a [Next.js](https://nextjs.org/) app hosted in [Vercel](https://vercel.com/). The database is a [Weaviate Cloud](https://weaviate.io/developers/wcs) cluster where we store the movies and their information. We store images locally to save space online.

You can check it out online at https://movie-genie-lovat.vercel.app

## Requirements

- <img src="https://www.marinedatascience.co/img/software/logo_python.png" height=14> [Python](https:///python.org) v3.11
- <img src="https://python-poetry.org/images/logo-origami.svg" height=14> [Poetry](https://python-poetry.org/) v1.8
- <img src="https://brandslogos.com/wp-content/uploads/images/large/nodejs-icon-logo.png" height=14> [Node.js](https://nodejs.org/) v22

## Instructions

### Installing dependencies
To run the import pipeline, first install dependencies. You can do so by running `poetry install --no-root`.

To run the frontend application, first install dependencies by running `npm install`

### Environment variables and secrets

This efine Enviroment variables. Create a file `.env` file and set the `WEAVIATE_URL`, `WEAVIATE_API_KEY` and `OPENAI_KEY` env vars to connect to Weaviate Cloud and OpenAI. There's an `.env.copy` file you can use as a reference.

## Running the app

Provided you have data, just run `npm run dev` and then go to `http://localhost:3000`

## Structure

It is a very simple project where Python is only used for the import pipeline and Next.js is used for the frontend.

- `import_movies.ipynb` has the import pipeline. If you run it, it will import the Kaggle dataset 
   into the `wikipedia-movies` directory and then into the Weaviate Cloud collection
- `src` has the Next.js app
- `linkedin_clustering.ipynb` Explores how to cluster data from LinkedIn postings related to ML or AI