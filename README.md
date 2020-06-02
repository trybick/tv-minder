# TV-Minder

Full-stack application to track TV shows

## Local Development

Start the API with Docker: `yarn-serve` (detached mode)

Start the React front-end: `yarn start`

## Dev Notes

### API

- After installing a new node module in the API folder, follow this process to avoid "module not found" errors
  - yarn add some-package
  - docker-compose build
  - docker-compose down
  - docker-compose up
