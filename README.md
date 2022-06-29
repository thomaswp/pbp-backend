## CS Help Project
This is  a source code for CS-Help webapp. CS-Help is a prototype development environment for "purpose-first" programming, in which students construct the solution to a program out of problem-specific **plan blocks** that have inherent meaning (e.g. count the number of open delimiters in a list of tokens). It represents programs with a functional, data-flow interface (below), but models traditional imperative programming, with control structures like loops and conditionals.

For more documentation, see the [guides](https://drive.google.com/drive/u/0/folders/1LxHqUOTMfsz1bFjxGf3GZ2bym_1G6iCA) here

### Development Environment
1. Create ```.env``` file in the root folder which contains the following env variables:
    ```
    MONGODB_USER=root
    MONGODB_PASSWORD=123456
    MONGODB_DATABASE=cs_help_db
    MONGODB_LOCAL_PORT=7017
    MONGODB_DOCKER_PORT=27017
    NODE_LOCAL_PORT=6868
    NODE_DOCKER_PORT=5000
    VUE_DOCKER_PORT=8080
    GOOGLE_CLIENT_ID={YOUR GOOGLE OAUTH ID}
    GOOGLE_CLIENT_SECRET={YOUR GOOGLE OAUTH SECRET}
    MICROSOFT_CLIENT_ID={YOUR MICROSOFT CLIENT ID}
    MICROSOFT_CLIENT_SECRET={YOUR MICROSOFT CLIENT ID}
    ```
    Note that if you do not have a Google OAUTH setup, you can create on [here](https://developers.google.com/identity/sign-in/web/sign-in), and if you do not have a Microsoft setup, you can create one [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app).
2. Make sure you have Docker installed in your machine. The installation guide can be found [here](https://docs.docker.com/get-docker/)
3. Run ``npm install`` in both the `pbp` folder and the `cs-help-server` folder. You may need the `--legacy-peer-deps` flag if you have a newer version of node. *Note*: You will need to do this each time you update dependencies.
4. In your terminal, run the folllowing command (```--build``` is only necessary when you have code change):
   ```
   docker-compose up --build
   ```
   **To access the web-app, go to [localhost:3060](http://localhost:3060)**
5. To stop the applications without deleting database, run the following command:
   ```
   docker-compose stop
   ```
6. To delete the build to start from scratch, run the following command (```--volumes``` if you want to wipe out the database completely):
   ```
   docker-compose down --volumes
   ```

### Testing Setup
**Note** that you could run the development server and testing server side-by-side because the database port on both deployments are different. 
1. On the root, run Docker-Compose to create a testing database:
   ```
   docker-compose -f .github/docker-compose-mongo.yml up --build -d
   ```
2. Go to ```cs-help-server``` directory
3. Run the unit test
   ```
   npm run test
   npm run coverage
   ```
4. Make sure you stop the test MongoDB container by going back to the root and run the command:
   ```
   docker-compose -f .github/docker-compose-mongo.yml down --volumes
   ```
