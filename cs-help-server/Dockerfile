# Install image of the nodejs version
FROM node:16

# Path of the working directory
WORKDIR /cs-help-server

#Copy package.json to the docker working directory
COPY package.json .

# Install node modules
RUN npm install

# Copy source code to docker
COPY . .

# Run backend
CMD npm start