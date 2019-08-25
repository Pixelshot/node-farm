const fs = require("fs");
const http = require("http");
const url = require("url");

// We can choose any name for the module but because the function was originally written here,
// we're gonna just going to give it the original name.
const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  // const pathWay = req.url;

  // Root/Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product/Products
  } else if (pathname === "/product" || pathname === "/products") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // Api
  } else if (pathname === "/api") {
    // res.end() needs to send back in a string format therefore we need to let the browser know in strings format that it's about to receive JSON.
    // status code 200 means 'clear/good to go/everything is ok'.
    res.writeHead(200, {
      "Content-type": "application/json"
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "You can find me under Header tab in Network"
    });
    res.end("<h1> 404 Page not found..</h1>");
  }
});

server.listen(8080, "127.0.0.1", () => {
  console.log("Listening on port 8080...");
});

// TODO
// Clean up sections
