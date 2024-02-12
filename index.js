const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./starter/modules/replaceTemplate');

//Blocking Synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = 'About avocado: '+textIn+'\n'+Date.now();
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log(textOut);

//Non-Blocking Asynchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1);
//     fs.readFile('./starter/txt/'+data1+'.txt', 'utf-8', (err, data2) => {
//         console.log(data2);
//     });
// });
// console.log('Will read file!');

const tempOverview = fs.readFileSync(__dirname+'/starter/templates/template_overview.html', 'utf-8');
const tempProduct = fs.readFileSync(__dirname+'/starter/templates/template_product.html', 'utf-8');
const tempCard = fs.readFileSync(__dirname+'/starter/templates/template_card.html', 'utf-8');

const data = fs.readFileSync(__dirname+'/starter/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    
    const { query, pathname } = url.parse(req.url, true);
    
    //Overview
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type':'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const outputHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(outputHtml);

    //Product
    }else if(pathname === '/product'){
        res.writeHead(200, {'Content-type':'text/html'});

        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    //API
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);

    //Page Not found
    }else{
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'hello-world' 
        });
        res.end('<h1>Page not Found!!!</h1>')
    }
});

server.listen(8000, () => {
    console.log('Listening to port 8000...');
});


