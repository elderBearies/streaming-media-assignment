const fs = require('fs'); // grab file system module
const path = require('path');

const getParty = (request, response) => {
  loadFile(request, response, '../client/party.mp4', 'video/mp4');
};

const getBling = (request, response) => {
  loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

const getBird = (request, response) => {
  loadFile(request, response, '../client/bird.mp4', 'video/mp4');
}

const loadFile = (request, response, filePath, tag) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-'); // pull beginning and end positions from request range header

    let start = parseInt(positions[0], 10); // parse starting position to an int in base 10

    const total = stats.size; // get total file size in bytes

    // if no end position, set to end of file - else parse into an int in base 10
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1; // if start > end, reset start range
    }

    const chunkSize = (end - start) + 1; // how big is our chunk?

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`, // content range header - how much out of the full file is being sent
      'Accept-Ranges': 'bytes', // what type of data the browser should expect
      'Content-Length': chunkSize, // tell browser how big the chunk is
      'Content-Type': tag, // self explanatory
    });

    const stream = fs.createReadStream(file, { start, end }); // make a file stream

    stream.on('open', () => {
      stream.pipe(response); // pipe stream directly to client response
    });

    stream.on('error', (streamErr) => {
      // if error, end response and return the error. Browser will stop listening for bytes.
      response.end(streamErr);
    });

    return stream;
  });
}

module.exports.getParty = getParty;
module.exports.getBling = getBling;
module.exports.getBird = getBird;
