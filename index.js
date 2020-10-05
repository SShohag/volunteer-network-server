const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qgdls.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 8080;




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect(err => {
  const volunteerCollection = client.db("volunteerStore").collection("volunteers");
  const registrationCollection = client.db("volunteerStore").collection("registration");
  
  //To add volunteer at mongodb
    app.post('/addVolunteer', (req, res) => {

        const volunteers = req.body;
        // console.log(volunteer);
        volunteerCollection.insertOne(volunteers)
        .then( result => {
            // console.log(result)
            // console.log(result.insertedCount);
            res.send(result.insertedCount)
            
        })
    })
    //To red volunteers data from mongodb
    app.get('/volunteers', (req, res) => {
        volunteerCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addRegistration', (req, res) => {

        const regInformation = req.body;
        registrationCollection.insertOne(regInformation)
        .then( result => {
            res.send(result.insertedCount >0)
        })
       
    })

    app.get('/registeredUser', (req, res) => {
        console.log(req.query.email);
        registrationCollection.find({})
        .toArray((err, documents)  => {
            console.log(err, documents)
           const user = documents.filter(item => item.details.email==req.query.email)
            res.send(user);
        })
    })

  
});




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);