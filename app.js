var html = require('fs').readFileSync('index.html');
require('http').createServer(function (req, res) {
    var header = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Method": "GET",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (req.url.indexOf('/api') != -1) {
        header["Content-Type"] = "application/json";
        res.writeHead(200, header);
        res.end(JSON.stringify({
            msg: "メッセージ"
        }));
    } else {
        header["Content-Type"] = "text/html";
        res.writeHead(200, header);
        res.end(html);
    }

}).listen(3000);