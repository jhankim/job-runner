const parse = require('csv-parse');
const fs = require('fs');

const getSampleData = (req, res, next) => {
  // Array to hold partially parsed output
  let output = [];
  let count = 0;
  const max = 5;
  // Create parser
  var parser = parse({
    columns: true, // map CSV header as keys
  })
    // When the stream is readable
    .on('readable', () => {
      let record;
      while ((record = parser.read() && count < max)) {
        output.push(parser.read());
        ++count;
      }
      // Unpipe after counter has reached max
      readFileStream.unpipe(parser);
    })
    // When the stream is unpiped
    .on('unpipe', () => {
      // Send the data back to the client
      res.json({ data: output });

      // Delete the file
      fs.unlink(req.file.path, err => {
        if (err) throw err;
      });
    });

  // Create a read stream from the uploaded file
  const readFileStream = fs.createReadStream(req.file.path);
  // Pipe the read stream into the parser
  readFileStream.pipe(parser);
};

module.exports = {
  getSampleData,
};
