# job-runner
Practice Node.js application for running jobs via Kue

## Packages
* [express](https://github.com/expressjs/express)
* [kue](https://github.com/Automattic/kue/)
* [kue-ui-epxress](https://github.com/stonecircle/kue-ui-express)

## Requirements
* [Redis](https://redis.io)

## Usage

```bash
# Install packages
$ npm i

# Run worker
$ node ./src/worker.js

# Run UI at http://localhost:5000/kue/
$ node ./src/index.js

# Queue up some jobs
$ node ./src/client.js
```

## TODO
- [x] Implement data store
- [x] Hook up job queuer to data store
- [x] Implement run endpoint
- [] Implement job list and job details endpoint
- [ ] Request validation
- [ ] Implement sample data endpoint
- [ ] Implement mapping and job worker