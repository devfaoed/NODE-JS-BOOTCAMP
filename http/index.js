// create a static server which return index, about, contact, login, register and Error 404 page without using express 

const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
    //rendering orutes
    const routes = req.url;
    if(routes === "/" || routes ==="/index") {
        res.end("welcome to the index page");
    }
    else if(routes === "/about"){
        res.end('welcome to about page')
    }
    else if(routes === "/contact"){
        res.end('welcome to contact page')
    }
    else if(routes === "/login"){
        res.end('welcome to login page')
    }
    else if(routes === "/register"){
        res.end('welcome to register page')
    }
   else{
        res.writeHead(400, {
            "Content-type" : "text/html"
        })
        res.end("<h3> Error 404 Page </h4>")
   }
})


const port = process.env.PORT || 8080;
server.listen(port, "localhost", ()=> {
    console.log(`server started successfully on ${port}`)
})