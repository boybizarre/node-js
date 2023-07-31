const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////

// Blocking, synchronous way
// const inputText = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(inputText);

// const outputText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', outputText);
// console.log('File written');

// Non-blocking asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {

//   if(err) return console.log('There was an error');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your data has been written successfully!👍🏽');
//       });t
//     });
//   });
// });

// console.log('Will read file!');

///////////////////////////////////

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = temp.replace(/{%IMAGE%}/g, product.image);
  output = temp.replace(/{%PRICE%}/g, product.price);
  output = temp.replace(/{%FROM%}/g, product.from);
  output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = temp.replace(/{%QUANTITY%}/g, product.quantity);
  output = temp.replace(/{%DESCRIPTION%}/g, product.description);
  output = temp.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// Server
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  // const pathName = req.url;


  const { query, pathname } = url.parse(req.url, true);
  console.log(req.url);
  
  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    
    const cardsHtml = dataObj
    .map((el) => replaceTemplate(templateCard, el))
    .join('');
    
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    
    res.end(output);
    
    // product page
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'Hello world',
    });

    res.end('<h1>This page does not exist</h1>');
  }

  // response.end('Hello, from the server!');
});

server.listen('8000', '127.0.0.1', () => {
  console.log('Listening on port 8000');
});
