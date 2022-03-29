const http = require("http");

const server = new http.Server();

server.on("request", (request, response) => {
  console.log(request.url);
  console.log(request.method);
  response.write("Test");
  response.end();
});

server.listen(3000);
