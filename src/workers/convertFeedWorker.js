require('dotenv').config();

const kue = require('kue');
const queue = kue.createQueue();
const parse = require('csv-parse');
const fs = require('fs');
const sleep = require('sleep');
const moment = require('moment');
const { JobHistory } = require('../store/db');

queue.process('convertFeed', (job, done) => {
  console.log(`Working on job ${job.id}`);
  // convertFeed(job, done);
  sleep.sleep(2);
  console.log(`Job ${job.id} done`);

  JobHistory.find({ where: { queueId: job.id } }).then((item) => {
    item.update({
      status: 'SUCCESS',
      dateUpdated: moment()
    })
    done();
  })
});

const convertFeed = (job, done) => {
  // console.log(`Analyzing feed from job ID: ${job.id}`);

  // let readStream = fs.createReadStream(job.data.input.location.path);
  // let writeStream = fs.createWriteStream(`${__dirname}/output.xml`);

  // var elem = xml.element({ _attr: { decade: '80s', locale: 'US' } });
  // var stream = xml({ toys: elem }, { stream: true });
  // stream.on('data', function (chunk) { console.log("data:", chunk) });
  // elem.push({ toy: 'Transformers' });
  // elem.push({ toy: 'GI Joe' });
  // elem.push({ toy: [{ name: 'He-man' }] });
  // elem.close();

  // var parser = parse({
  //   columns: true // map CSV header as keys 
  // })
  //   .on('readable', function () {
  //     let record;
  //     while (record = parser.read()) {

  //     }
  //   })
  //   .on('end', function () {
  //     console.log('Job complete.');
  //     done();
  //   });

  // readStream.pipe(parser);
};
