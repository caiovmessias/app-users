FROM node:16-alpine AS dev

WORKDIR "/application"

RUN apk update
RUN apk add git openssh bash sudo vim 

RUN cd /application

ENTRYPOINT [ "npm", "run" ]

CMD [ "start" ]
