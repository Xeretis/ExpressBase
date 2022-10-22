# ExpressBase

An opinionated express.js setup using typescript for creating APIs paired with a React frontend also using typescript.

I primarily made this for my own use in an other project but I will be updating it once I add more features to that project.

## Features

### Backend

- [x] MVC architecture (well, no views since it's for APIs only)
- [x] Secure authentication and authorization using tokens
- [x] Prisma ORM
- [x] Redis based message queue (BullMQ)
- [x] Email sending (Nodemailer)
- [x] Easy request validation using zod
- [x] Typed requests
- [x] Exception handling
- [x] Rate limiting middleware using redis
- [x] Support for multiple routes files
- [x] Logging using winston and morgan
- [x] Shared libraries between frontend and backend (validation, respose types, etc)
- [ ] User management
- [ ] Utils for working with file uploads and downloads
- [ ] Permissions system for more complex authorization
- [ ] Better configurability for integrating with the frontend
- [ ] Websockets using socket.io


### Frontend

- [x] Vite for asset bundling
- [x] Basic configuration of vite for working with the backend conveniently
- [x] Mantine beacuse it's awesome
- [x] Frontend for the default features of the backend (currently only auth)
- [x] Redux for state management and RTK Query for working with the backend api
- [x] React Router for routing

### Other

- [ ] A simple cli for generating controllers, jobs, react components, etc

## Usage

1. Clone the repository and run `pnpm install`
2. Copy `.env.example` to `.env` and fill in the values in both `apps/backend` and `apps/frontend`
3. Apply prisma migrations and generate the prisma client in `apps/backend`
4. Run both the backend and frontend with `pnpm dev` in their corresponding directories
