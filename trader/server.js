var http 	   = require("http"),
	url 	   = require("url"),
	formidable = require('formidable');

function start(route, handle) {
  function onRequest(request, response) {
	var	pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    route(handle, pathname, response, request);
  }

  http.createServer(onRequest)
	.listen(8888);
	// .listen(process.env.PORT,process.env.IP); //c9.io
	
  console.log("Server has started.");
}

exports.start = start;