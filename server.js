var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var config={
    user:'ashokkumarpesarlanka',
    database:'ashokkumarpesarlanka',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
 var pool=new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('select * from test',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send(JSON.stringify(result.rows));
       } 
       
    });
    
});
function createTemplate(data){
    var title=data.title;
    var heading=data.heading;
    var date=data.date;
    var content=data.conte;
    var htmlTemplate=`
    <html>
        <head>${title}</head>
        <body>
            <div class="container">
                <a href='/'>Home</a>
                <hr/>
                <h3>${heading}</h3>
                <div>
                ${date.toDateString()}
                </div>
                <div>${content}</div>
            </div>
        </body>
    </html>`;
    return htmlTemplate;
}
app.get('/:articleName',function(req,res){
    
   pool.query("select * from article where title='"+req.params.articleName+"'",function(err,result){
      if(err){
          res.status(500).send(err.toString());
      }else{
          if(result.rows.length===0){
              res.status(404).send("Article Not Found");
          }else{
              //res.send(JSON.stringify(result.rows));
              var articleData=result.rows[0];
              res.send(createTemplate(articleData));
          }
      } 
   }); 
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/Article-one',function(req,res){
   res.sendFile(path.join(__dirname, 'ui', 'Article-one.html'));
});

app.get('/Article-two',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'Article-two.html'));
});

app.get('/Article-three',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'Article-three.html'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
