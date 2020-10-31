# TV-Minder

> Full-stack web application to keep track of your favorite shows

[![Netlify Status](https://api.netlify.com/api/v1/badges/c0c8f001-1839-4c79-a338-de51cf4cd991/deploy-status)](https://app.netlify.com/sites/tv-minder/deploys) ![Amazon ECS Badge](https://github.com/trybick/tv-minder/workflows/Deploy%20API%20to%20Amazon%20ECS/badge.svg) ![Run tests](https://github.com/trybick/tv-minder/workflows/Run%20tests/badge.svg)

<p align="center">
<img src="./front/src/images/screenshot-my-shows.png" width="800px"/>
</p>

## Technologies

**Front**: React, Redux, TypeScript, Chakra UI

**API**: Express, TypeScript, Docker, AWS ECS

## Local Development

#### Using the production API (quickest)

This will start the front-end and use the production API for API requests.

```bash
yarn
yarn start

# or with npm
npm install
npm start
```

#### Using a locally running API

- Start the local API:

```bash
yarn serve

# or with npm
npm run serve
```

- Start the front-end:

```bash
yarn start:local

# or with npm
npm run start:local
```

#### ENV Files

- All ENV files on the frontend are checked into git, except for the google OAuth token. If you need to use Google OAuth locally, then create a file `front/.env.local` which contains `REACT_APP_GOOGLE_OAUTH_CLIENT_ID`.

## Contributing 😎

See [Contribution guidelines](https://github.com/trybick/tv-minder/blob/master/CONTRIBUTING.md)
