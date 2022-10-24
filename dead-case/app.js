const fs = require("fs");
const http = require("http");
const url = require("url");

//importing frontend template
const index = fs.readFileSync(`${(__dirname)}/template/index.html`, "utf-8"); 
const details = fs.readFileSync(`${(__dirname)}/template/details.html`, "utf-8"); 
const card = fs.readFileSync(`${(__dirname)}/template/card.html`, "utf-8"); 

//importing data from the db folder
const database = fs.readFileSync(`${(__dirname)}/db/data.json`, "utf-8");
// database array conersion to string
arrayCon = JSON.parse(database);

const replaceTemplate = (temp, people) => {
    let output = temp.replace(/{%id%}/g, people.char_id);
    output = output.replace(/{%name%}/g, people.name);
    output = output.replace(/{%birthday%}/g, people.birthday);
    output = output.replace(/{%occupation%}/g, people.occupation);
    output = output.replace(/{%status%}/g, people.status);
    output = output.replace(/{%nickname%}/g, people.nickname);
    output = output.replace(/{%portrayed%}/g, people.portrayed);
    
    return output;
}

// creating server by using http instaed of express
const app = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    if(pathname == "/" || pathname == "/index"){
        // res.writeHead(200, {
        //     "Content-type": "text/html",
        // })
        // res.end(index);
        const result = arrayCon.map(el => replaceTemplate(card, el)).join("");
        const output = index.replace('{%PRODUCT_CARDS%}', result);
        res.end(output);
    }
    else if(pathname == "/details"){
        res.writeHead(200, {
            "Content-type": "text/html",
        })
        const product = arrayCon[query.id];
        const output = replaceTemplate(details, product);
        res.end(output);       
    }
    else{
        res.writeHead(404, {
            "Content-type": "text/html",
        })
        res.end("<h2>Error page</h2>");
    }
})

//server listenning on port
const port = process.env.PORT || 7000;
app.listen(port, "localhost", () => {
    console.log(`server listenning on port ${port}`);
})