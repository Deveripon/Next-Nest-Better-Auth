## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Resources

# 📘 API Documentation

https://documenter.getpostman.com/view/43860379/2sB3HtFGvy

---

## To run this project is your local, below commad need to be execute.

```bash
 pnpm install

 pnpm db:format

 pnpm db:generate

 pnpm db:migrate

 pnpm db:push

pnpm start:dev
```

## I have given you the tripwheel_backup.sql file to instantly get data

- [x] first create a database in pgadmin named `tripwheel` or anything must be matched with env
- [x] then restore data from .sql file
