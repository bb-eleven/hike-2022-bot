FROM node:16-alpine


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --ignore-scripts && npm i -g typescript

# Bundle app source
COPY . .

RUN tsc

ENV NODE_ENV="production"
EXPOSE 8443
CMD [ "npm", "run", "start" ]
