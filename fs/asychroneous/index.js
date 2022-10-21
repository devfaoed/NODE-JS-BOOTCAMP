const fs = require('fs');

//using fs to read the content of a file
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
    if(err) return console.log('ERROR! !!!!')
    fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
            console.log(data3);
            // writing data2 and data3 into a single file
            fs.writeFile('./txt/final.txt', `${data2} \n ${data3}`, 'utf-8', err => {
                console.log('file created and written suucessfully');
            });
        })
    })
})
console.log('will read this first')