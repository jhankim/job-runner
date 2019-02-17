var Client = require('ftp');
var fs = require('fs');

var c = new Client();
c.on('ready', function () {
  c.put('foo.txt', 'foo.remote-copy.txt', function (err) {
    if (err) throw err;
    c.end();
  });
});

const FTP_HOST = process.env.FTP_HOST;
const FTP_USER = process.env.FTP_USER;
const FTP_PW = process.env.FTP_PW;

c.connect({
  host: FTP_HOST,
  user: FTP_USER,
  password: FTP_PW,
});
