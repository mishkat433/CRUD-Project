require("dotenv").config();
const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const { MongoClient } = require('mongodb');
const objectId = require("mongodb").ObjectId;
const PORT = process.env.PORT || 3200;

const uri = process.env.URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})



client.connect(err => {
    const infoCollection = client.db("student").collection("information");
    
    // read
    app.get("/information",(req,res)=>{
        infoCollection.find({})
        .toArray((err,document)=>{
            res.send(document)
        })
    })

    // create
    app.post("/addStudent", (req, res) => {
        const student = req.body
       infoCollection.insertOne(student)
        .then(result => {
            res.redirect("/")
        })
    })

    // read
    app.get("/update/:id",(req,res)=>{
        infoCollection.find({ _id: objectId(req.params.id)})
        .toArray((err,document)=>{
            res.send(document[0])
        })
    })

    // update
    app.patch("/updateInfo/:id", (req, res) => {
        infoCollection.updateOne({ _id: objectId(req.params.id) },
            {
                $set: { name: req.body.uName, class: req.body.uClass, subject: req.body.uSubject }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })


    app.delete("/delete/:id",(req,res)=>{
        infoCollection.deleteOne({ _id: objectId(req.params.id) })
        .then(result=>{
            res.send(result.deletedCount>0)
        })
    })
    console.log("load compleate");

    // client.close();
});






app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})
