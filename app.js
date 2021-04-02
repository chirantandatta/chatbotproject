const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const server=require('http').Server(app);
const io=require('socket.io')(server);
const https=require('https');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));
app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
});
io.on('connection',socket=>{
  socket.on('covid-update',message=>{
    https.get('https://coronavirus-19-api.herokuapp.com/countries/'+message,function(response){
      response.on('data',function(data){
        try{
        const cases=JSON.parse(data);
        const total=cases.cases;
        const today=cases.todayCases;
        const death=cases.deaths;
        const recovered=cases.recovered;
        const active=cases.active;
        console.log(cases);
        socket.emit('covid-data',total,today,death,recovered,active);
      }
      catch{
        socket.emit('no-data');
      }
      });
    });
  });


});
server.listen(3000 || process.env.PORT);
