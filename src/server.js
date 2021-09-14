const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/page2': htmlHandler.getPage2,
  '/page3': htmlHandler.getPage3,
  '/party.mp4': mediaHandler.getParty,
  '/bling.mp3': mediaHandler.getBling,
  '/bird.mp4': mediaHandler.getBird,
  notFound: htmlHandler.getError
};

const onRequest = (request, response) => {
  const pathname = request.url;
  if (urlStruct[pathname]) {
    urlStruct[pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);
