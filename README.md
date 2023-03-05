<div style="padding-top: 50px; display: flex; justify-content: center;">
    <a href="https://crocode.io/" target="blank">
            <img style="object-fit: cover; width: 200px;" src="./picters/crocode-logo.svg">
    </a>
</div>


<div style="display: flex; justify-content: space-around">
    <a href="https://nodejs.org/ru/" target="blank"><img src="https://nodejsdev.ru/nodejs.svg" width="150" alt="Nest Logo" /></a>
    <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
</div>

## Description

[CodeDot](https://codedot.io/) applications for maintaining documentation on technologies and practices.

The server part on the [NestJS](https://github.com/nestjs/nest) framework for [NodeJS](https://nodejs.org/en/)

## Running the app

```bash
# install necessary dependency
$ npm install 
```
```bash
# watch mode 
$ npm run start:dev 
```
```bash
# prod mode 
$ npm run build 
```

## .env
Create two env files in the root of the project: .production.env and .development.env for prod mod and dev.
By default, at startup, it will be used .production.env. 
The contents of both files are the same:

* PORT - Port your application is running on.

Database postgres
* POSTGRES_HOST - Database host.
* POSTGRES_USER - Database username.
* POSTGRES_DB - Database name
* POSTGRES_PASSWORD - Database password.
* POSTGRES_PORT - Database host port. Default postgres port is 5432.

Auth
* PRIVATE_KEY - Secret data for access token.

Mail Auth
* MAIL_HOST - Mail sender removed host
* MAIL_AUTH_USER - Name of you accaunt on removed host
* MAIL_AUTH_PASS - Password from you removed host