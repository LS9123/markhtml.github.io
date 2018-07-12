
const http = require('http');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const template = require('art-template');
const mime = require('mime');
const mysql = require('mysql');
console.log(global)
let rootPath = path.join(__dirname,'www');

// 开启服务
http.createServer((req,res)=>{
    let filePath = path.join(rootPath,qs.unescape(req.url))
    if(fs.existsSync(filePath)){
        fs.readdir(filePath,(err,files)=>{
            if(err){
                fs.readFile(filePath,(err,data)=>{
                    if(err) throw err;
                    res.writeHead(200,{
                        "content-type":mime.getType(filePath)
                    })
                    res.end(data)
                    
                })
            }else{ 
                if(files.indexOf("index.html")!=-1){

                    var connection = mysql.createConnection({
                        host     : 'localhost',
                        user     : 'root',
                        password : 'root',
                        database : 'test'
                      });
                       
                      connection.connect();
                       
                      connection.query('SELECT * from manyhero', function (error, results, fields) {
                        if (error) throw error;
                        // console.log('The solution is: ', results);
                        let html = template(__dirname+"/www/index.html",{
                            results
                        })
                        res.writeHead(200,{
                            "content-type":"text/html;charset=utf-8"
                        })
                        // console.log(html)
                        res.end(html)
                      });
                    
                      connection.end();

                }else{
                    for(let i=0;i<files.length;i++){
                        files[i]=[path.join(req.url,files[i]),files[i]]
                    }
                   let html =  template(__dirname+"/art/list.art",{
                       files
                    })
                    res.writeHead(200,{
                        "content-type":"text/html;charset=utf-8;"
                    })
                    res.end(html)
                }
            }
        })

    }else{
        res.writeHead(404,{
            "content-type":"text/html;charset=utf-8;"
        });
        res.end(`
            <h1>NOT FOUND 404</h1>
        `)
    }

    // 响应内容
    // response.end('you come');
}).listen(80,'127.0.0.1',()=>{
    console.log('listen to 127.0.0.1:80 success');
})