let kue = require('kue');
let queue = kue.createQueue();
const parse = require('csv-parse');
const fs = require('fs');
const XMLWriter = require('xml-writer');

queue.process('convertFeed', (job, done) => {
  console.log(`Working on job ${job.id}`);
  convertFeed(job, done);
});

const convertFeed = (job, done) => {
  console.log(`Analyzing feed from job ID: ${job.id}`);

  let readStream = fs.createReadStream(job.data.input.location.path);
  let writeStream = fs.createWriteStream(`${__dirname}/output.xml`);

  xw = new XMLWriter;
  xw.startDocument();
  xw.startElement('root');
  xw.writeAttribute('foo', 'value');
  xw.text('Some content');
  xw.endDocument();

  var parser = parse({
    columns: true // map CSV header as keys 
  })
    .on('readable', function () {
      let record;
      while (record = parser.read()) {

      }
    })
    .on('end', function () {
      console.log('Job complete.');
      done();
    });

  readStream.pipe(parser);
};
