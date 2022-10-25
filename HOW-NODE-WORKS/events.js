const event = require("events");
const http = require("http");

const eventEmitter = new event();

eventEmitter.on("newSale", () => {
  console.log("there was a new sales");
});

eventEmitter.on("newSale", () => {
  console.log("Customer name: Faith");
});

eventEmitter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items available or left in the stock`);
});
eventEmitter.emit("newSale", 9);

const server = http.createServer();
server.on("request", (req, res) => {
  console.log("request received");
  console.log(req.url);
  res.end("request received");
});

server.on("request", (req, res) => {
  console.log("Another yet requested");
});

server.on("close", (req, res) => {
  console.log("Server closed");
});

server.listen(8080, "127.0.0.1", () => {
  console.log("waiting for request.....");
});
