FROM node:19.5.0

WORKDIR /build
COPY package.json .
COPY yarn.lock .
RUN yarn
COPY . .
CMD ["yarn", "dev"]
EXPOSE 5173