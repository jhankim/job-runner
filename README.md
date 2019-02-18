# job-runner

Node.js application for running jobs via Kue

## Packages

- [express](https://github.com/expressjs/express)
- [kue](https://github.com/Automattic/kue/)
- [kue-ui-epxress](https://github.com/stonecircle/kue-ui-express)

## Requirements

- [Redis](https://redis.io)

## Usage

```bash
# Install packages
$ npm i

# Run the worker process
$ npm run start:dev:worker

# Run API and UI at http://localhost:5000/kue/
$ npm run start:dev:api
```

## TODO

- [x] Implement data store
- [x] Hook up job queuer to data store
- [x] Implement run endpoint
- [x] Implement job list and job details endpoint
- [x] Request validation
- [x] Implement sample data endpoint
- [ ] Enable XML sample data endpoint
- [ ] Implement mapping and job worker
