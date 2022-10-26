const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // ways of using node js to stream
  // solution 1
  // fs.readFile("test-file.txt", (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // solution 2: using stream method
  // const readable = fs.createReadStream("test-file.txt");
  // readable.on("data", (chunck) => {
  //   res.write(chunck);
  // });

  // readable.on("end", () => {
  //   res.end();
  // });

  // readable.on("error", (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end("file not found!");
  // });

  // solution 3: using pipe method (the simplest and best solution approach)
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});

server.listen(8000, "localhost", () => {
  console.log("listenning.....");
});
