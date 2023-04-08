<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Config with Docker

If you have Docker and Docker compose in your machine, follow the commands down for the up project.

### Running the app

```bash
# development
$ docker-compose up -d
```

## Config without Docker

If you don't have Docker and Docker compose in your machine, you can execute the project using the commands down.  
Ps.: The rabbit don't work without Docker, because the configuration is hard coded in file `src/helpers/sendToRabbit.ts`.

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Routes

Use JSON to communicate with the API.

### POST /api/users

This route, create a new document in collection `Users`  at the MongoDB. 

After creation send mail to new user and create a new event queue in Rabbit.
Ps.: The server SMTP is fake so the user don't received the Mail. 

#### Parameters Request  

| Parameter | Value      | Description    | Parameter Type | Data Type |
|-----------|------------|----------------|----------------|-----------|
| name      | (required) | The user name  | body           | string    |
| email     | (required) | The user email | body           | string    |

#### Responses Status

| HTTP Status | Message                     |
|-------------|-----------------------------|
| 201         | User created successfully   |
| 422         | Name and Email are required |
| 400         | Mail already exists         |


### GET /api/user/{userId}

This route make a request to API `https://reqres.in/api/users/${id}`. 

#### Parameters Request  

| Parameter | Value      | Description        | Parameter Type | Data Type |
|-----------|------------|--------------------|----------------|-----------|
| id        | (required) | The user id in API | query          | string    |

#### Responses Status

| HTTP Status | Message        |
|-------------|----------------|
| 200         | OK             |
| 404         | User not found |

### GET /api/user/{userId}/avatar

This route save a image in directory `./uploads` and create a new document in collection `Uploads` at the MongoDb.

If `userId` already exists in collection `Uploads` the route just return path and image in base-64. 

If `userId` don't exists in collection `uploads` the route make a new request for the `https://reqres.in/api/users/${id}`, get the `avatar` and save the image in directory `./uploads` and create a new document in collection `uploads` at the MongoDb.

#### Parameters Request  

| Parameter | Value      | Description        | Parameter Type | Data Type |
|-----------|------------|--------------------|----------------|-----------|
| id        | (required) | The user id in API | query          | string    |

#### Responses Status

| HTTP Status | Message                              |
|-------------|--------------------------------------|
| 200         | Ok                                   |
| 404         | User not found                       |
| 404         | Image not found in API for this user |

### DELETE /api/user/{userId}/avatar

This route drop the file in directory `./uploads` and drop document in collection  `Uploads` at the MongoDb.

#### Parameters Request  

| Parameter | Value      | Description        | Parameter Type | Data Type |
|-----------|------------|--------------------|----------------|-----------|
| id        | (required) | The user id in API | query          | string    |

#### Responses Status

| HTTP Status | Message                     |
|-------------|-----------------------------|
| 200         | Ok                          |
| 404         | Image or User not cadastred |

## Collections

In the directory `./docs/collection` have a collection for the Postman and Insomnia.

