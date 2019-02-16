let kue = require('kue');
let queue = kue.createQueue();
const parse = require('csv-parse');
const fs = require('fs');
let sleep = require('sleep');

queue.process('analyzeFeed', (job, done) => {
  console.log(`Working on job ${job.id}`);
  analyzeFeed(job, done);
});

const analyzeFeed = (job, done) => {
  console.log(`Analyzing feed from job ID: ${job.id}`);

  let output = [];
  let readStream = fs.createReadStream(job.data.input.location.path);
  let writeStream = fs.createWriteStream(`${__dirname}/output.xml`);

  const doneParsing = function () {
    console.log('unpiping');
    readStream.unpipe(parser);
    done();
  }
  let count = 0;
  const max = 5;

  var parser = parse({ columns: true })
    .on('readable', function () {
      let record;
      while (record = parser.read() && count < max) {
        output.push(parser.read());
        ++count;
      }

      doneParsing();
    })
    .on('unpipe', function () {
      console.log(output);
      console.log('Parsing done.');
      console.log('Job complete.');
    });
  readStream.on('unpipe', function () {
    console.log('stream finished');
    parser.end();
  });

  readStream.pipe(parser);
};
