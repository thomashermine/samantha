# ==================================================================================================
# Build Container
# ==================================================================================================
FROM node:18.15.0

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./yarn.lock /app/yarn.lock

RUN mkdir /app/src
RUN yarn --frozen-lockfile

ENV NODE_ENV="production"

# Copy code
COPY src /app/src

# Build
RUN npx esbuild src/index.ts --bundle --platform=node --packages=external --outfile=build.js

# ==================================================================================================
# Server Container
# ==================================================================================================
FROM node:18.15.0
WORKDIR /app

# Copy code & node_modules from Build Container
# ==================================================================================================
COPY --from=0 /app/build.js /app/build.js
COPY --from=0 /app/node_modules /app/node_modules

# 2. Copy non-source code files needed for some modules
# ==================================================================================================
# Package.json to get version number
COPY package.json /app/package.json

# Prepare container for execution
ENV PORT=80
ENV NODE_ENV="production"
EXPOSE 80

CMD ["node", "build.js"],
