# TV-Minder

[![Netlify Status](https://api.netlify.com/api/v1/badges/c0c8f001-1839-4c79-a338-de51cf4cd991/deploy-status)](https://app.netlify.com/sites/tv-minder/deploys) ![Amazon ECS Badge](https://github.com/trybick/tv-minder/workflows/Deploy%20API%20to%20Amazon%20ECS/badge.svg)

Full-stack application to track TV shows

## Local Development

Start the API with Docker: `yarn serve`

Start the React front end: `yarn start`

## Technologies

**Front**: React, Redux, TypeScript, Chakra UI

**API**: Express, TypeScript, Docker, AWS ECS

## Dev Notes

### ENV files in use

To setup env files for local development, create two files, `api/.env` and `front/.env`, with the contents in this format - `KEY="value"`.

Front:

- `REACT_APP_THE_MOVIE_DB_KHEE`

API:

- `DB_PASSWORD`
- `JWT_KEY`

### General API notes

- To trigger a new workflow build to build the docker API on AWS, push to the branch `api`, or change the trigger inside `.github/workflows/aws.yml`.

- After installing a new node module in the API folder, follow this process to avoid "module not found" errors
  - `yarn add some-package`
  - `docker-compose build`
  - `docker-compose down`
  - `docker-compose up`
