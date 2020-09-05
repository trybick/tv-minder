# TV-Minder

> Full-stack web application to keep track of your favorite shows

[![Netlify Status](https://api.netlify.com/api/v1/badges/c0c8f001-1839-4c79-a338-de51cf4cd991/deploy-status)](https://app.netlify.com/sites/tv-minder/deploys) ![Amazon ECS Badge](https://github.com/trybick/tv-minder/workflows/Deploy%20API%20to%20Amazon%20ECS/badge.svg)

## Technologies

**Front**: React, Redux, TypeScript, Chakra UI

**API**: Express, TypeScript, Docker, AWS ECS

## Local Development

From the root directory:

- Run `yarn`
- Start the API with Docker: `yarn serve`
- Start the React front end: `yarn start`

### Environment Variables

- Duplicate `front/.env.template` and `api/.env.template`, naming them `.env`, and fill in secrets (please request in an issue)
