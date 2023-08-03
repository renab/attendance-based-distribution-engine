###################
# DEVELOPMENT
###################
FROM node:18-alpine as development

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ENV NODE_ENV dev

# install app dependencies
COPY package*.json ./

RUN npm ci

# add app
COPY . ./

# start app
CMD ["npm", "start"]

###################
# BUILD FOR PRODUCTION
###################
FROM node:18-alpine As build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY --chown=node:node --from=development /app/package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

ENV NODE_ENV prod

USER node

###################
# PRODUCTION
###################
FROM nginx:stable-alpine as production

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]