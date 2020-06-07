# TV-Minder

Full-stack application to track TV shows

## Local Development

Start the API with Docker: `yarn-serve`

Start the React front-end: `yarn start`

## Dev Notes

### ENV files in use

To setup env files for local development, create two files, `api/.env` and `front/.env`, with the contents in this format - `KEY="value"`. The keys are listed below. To request the values please reply to an open issue.

Front:

- `REACT_APP_MOVIE_DB_KHEE`

API:

- `DB_PASSWORD`
- `JWT_KEY`

### General API notes

- After installing a new node module in the API folder, follow this process to avoid "module not found" errors
  - yarn add some-package
  - docker-compose build
  - docker-compose down
  - docker-compose up
