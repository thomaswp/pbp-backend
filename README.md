## CS Help Project
This is  a source code for CS-Help webapp. CS-Help is a prototype development environment for "purpose-first" programming, in which students construct the solution to a program out of problem-specific **plan blocks** that have inherent meaning (e.g. count the number of open delimiters in a list of tokens). It represents programs with a functional, data-flow interface (below), but models traditional imperative programming, with control structures like loops and conditionals.

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
    ```
2. Make sure you have Docker installed in your machine. The installation guide can be found [here](https://docs.docker.com/get-docker/)
3. In your terminal, run the folllowing command:
   ```
   docker-compose up --build
   ```
4. To stop the applications, run the following command:
   ```
   docker-compose stop
   ```
5. To delete the build to start from scratch, run the following command:
   ```
   docker-compose down
   ```
