const fs = require('fs');       
const http = require("http");
const url = require('url');

// importing replacetemplate which i turn to module by myself
const replaceTemplate = require("./modules/replaceTemplate");

// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%ID%}/g, product.id);
//     output = output.replace(/{%productname%}/g, product.productname);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
     
//     if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

//     return output;
// }


//geeting template contents
const overview_Template = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const product_Template = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');


// sync way of using fs to read and render data 
// this will only read the data once and keep rendering it anything the user requested for it
// data from database
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//creating server with http
const app = http.createServer((req, res) => {
    // creating routes
    const routes = req.url;
    const {query, pathname} = url.parse(req.url, true)

    // overview page
    if(pathname === "/" || pathname === "/index" || pathname === "/overview"){
        res.writeHead(200, {
            "Content-type" : "text/html"
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = overview_Template.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    // product page
    else if(pathname === "/product"){
        res.writeHead(200, {
            "Content-type" : "text/html"
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(product_Template, product);
        res.end(output);       
    }

    // api page
    else if(pathname === "/api"){
        //a async way of using fs to render data 
        //but this will keep reading and return data each time user request for it
        // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
        //     res.writeHead(200, {
        //         "Content-type" : "application/json"
        //     }) 
        //     res.end(data);
        // })
        
        res.writeHead(200, {
            "Content-type" : "application/json"
        })
        res.end(data);    }

        // error page
    else{
        res.writeHead(404, {
            "Content-type" : "text/html"
        })
        res.end("<h4>ohhps! Error Page</h4>")
    }
})

// listening on a port
const port = process.env.PORT || 4000;
app.listen(port, "127.0.0.1", () => {
    console.log(`server is listening on port ${port}`);
})
