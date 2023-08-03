###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development-build

# Create app directory
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app
WORKDIR /usr/src/app
RUN mkdir -p .config && chown node:node .config

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Set NODE_ENV environment variable
ENV NODE_ENV dev

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

RUN npm run build

###################
# DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/app

EXPOSE 3000

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=development-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development-build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development-build /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV prod

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

EXPOSE 3000

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]