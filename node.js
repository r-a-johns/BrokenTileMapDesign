var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
  if(req.url=="/"){
    req.url = "/TileDesign.html"
  }
  fs.readFile(__dirname + req.url, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end("Can't find that file....");
      return;
    }
    if (req.url.endsWith('.png')) {
      res.setHeader('Expires', 'January 1, 2021');
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080);