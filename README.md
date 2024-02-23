# A Showcase of Multiplexing scalability applications
This project serves as a showcase for building scalable real-time applications using modern technologies. The serverside application is powered by bun.sh runtime and Socket.IO for efficient real-time communication. Redis is integrated to manage connection pools, enabling the system to handle millions of concurrent connections


## Articles
you can reach out a full articles in article directory 
- [Multiplexing System Architecture Scalability](https://github.com/14f3v/hyperscale-application-showcase/blob/main/articles/EN_Multiplexing_System_Architecture_Scalability.md)

## Start project
clone git repository and cd to the main project directory and install dependencies

incase of using [bun.sh](https://bun.sh)
```bash
cd multiplexing-applications-scalability-showcase
bun install
```

incase of using [npm]([https://npm.sh](https://www.npmjs.com))
```bash
cd multiplexing-applications-scalability-showcase
npm install
```

incase of using [yarn]([[https://npm.sh](https://www.npmjs.com](https://yarnpkg.com)))
```bash
cd multiplexing-applications-scalability-showcase
yarn
```

### Start sevrer application
There are so many condition to start a server application like run dry mode, run watch mode, run docker with watch mode and mount volumes. for example.

if you would like to start server application as a dry mode, you can use
```bash
bun run --b index.ts
```

if you would like to start server application as a watch mode, you can use
```bash
bun run --watch --b index.ts
```
or you can use
```bash
bun run start:watch
```
to run multiple replicas server side application container as a watch mode **depends on your code changed**. you can use a command-line
```bash
bun run docker:start:live
```

To run a minion from server-side to simulate and understanding a flow of concept, you can use a command-line to run
```bash
bun run start:watch:client
```
and similar concept of spawning a multiple minion, you can use docker-compose to replicate a container base on a project director volumes mount. you can use a command-line
```bash
bun run spawn:client
```
- facts: in default spawnclient.compose.live.yml config file setting a replicas of docker container at 3. you can scale a container instance out whenever you need. for example command-line
- ```bash
  docker-compose -f spawnclient.compose.live.yml scale client-minion=10
  ```

