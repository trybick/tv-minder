# TV-Minder

> Full-stack web application to keep track of your favorite shows

[![Netlify Status](https://api.netlify.com/api/v1/badges/c0c8f001-1839-4c79-a338-de51cf4cd991/deploy-status)](https://app.netlify.com/sites/tv-minder/deploys) ![Amazon ECS Badge](https://github.com/trybick/tv-minder/workflows/Deploy%20API%20to%20Amazon%20ECS/badge.svg)

## Technologies

**Front**: React, Redux, TypeScript, Chakra UI

**API**: Express, TypeScript, Docker, AWS ECS

## Local Development

From the root directory:

- Run `yarn`
- Start the front end: `yarn start`
- Optionally start the back end: `yarn serve`
  - Note: If you are just working on the front-end, you don't need to run the back-end since the local project is set to use the deployed API. If you want to work with the local API, change [this](https://github.com/trybick/tv-minder/blob/master/front/src/utils/constants.ts) file and request the env files for the api folder in an issue.

## Contributing

See [Contribution guidelines](./CONTRIBUTING.md) 😎
