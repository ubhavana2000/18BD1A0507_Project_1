const express=require("express");
const app=express();
let server=require("./server");
let middleware=require("./middleware");
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
    console.log('Connected:${url}');
});

app.get('/Hospital',middleware.checkToken,(req,res)=>{
    console.log("Hospital Details");
    var data=db.collection('Hospital').find().toArray().then(result=>res.json(result));
});

app.get('/Ventilators',middleware.checkToken,(req,res)=>{
    console.log("Ventilator Details");
    var data=db.collection('Ventilators').find().toArray().then(result=>res.json(result));
});

app.post('/SearchVentilatorByStatus',middleware.checkToken,(req,res)=>{
    var status=req.query.status;
    console.log(status);
    var data=db.collection('Ventilators').find({status:status}).toArray().then(result=>res.json(result));
});

app.post('/SearchVentilatorByHospName',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('Ventilators').find({name:name}).toArray().then(result=>res.json(result));
});

app.post('/SearchHospByName',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var data=db.collection('Hospital').find({name:name}).toArray().then(result=>res.json(result));
});

app.put('/UpdateVentilatorDetails',middleware.checkToken,(req,res)=>{
    var vid={vid:req.query.vid};
    console.log(vid);
    var newvalues={ $set: { status: req.query.status} };
    db.collection("Ventilators").updateOne(vid, newvalues, function(err, result){
        res.json('1 Document Updated');
        if(err) throw err;
    });
});

app.post('/AddVentilator',middleware.checkToken,(req,res)=>{
    var hId=req.query.hId;
    var name=req.query.name;
    var vid=req.query.vid;
    var status=req.query.status;
    var item={ hId:hId, name:name, vid:vid, status:status };
    db.collection("Ventilators").insertOne(item, function(err, result){
        res.json('1 Item Updated');
        if(err) throw err;
    });
});

app.delete('/DeleteVentilatorByVid',middleware.checkToken,(req,res)=>{
    var vid=req.query.vid;
    console.log(vid);
    db.collection('Ventilators').deleteOne({vid:vid},function(err,result){res.json('Vid Deleted');
    if (err) throw err;
});
});


app.listen(3000);
