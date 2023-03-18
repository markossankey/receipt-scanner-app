FROM node:19.5.0

WORKDIR /build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
RUN yarn prisma generate
RUN yarn prisma migrate
CMD ["yarn", "dev"]
EXPOSE 8000