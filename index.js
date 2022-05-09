const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxnva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const furnitureCollection = client.db('furnitureHut').collection('furnitures');
        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = furnitureCollection.find(query);
            const furnitures = await cursor.toArray();
            res.send(furnitures);
        });
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const furniture = await furnitureCollection.findOne(query);
            res.send(furniture);
        });

        // post
        app.post('/product', async (req, res) => {
            const newFurniture = req.body;
            const result = await furnitureCollection.insertOne(newFurniture);
            res.send(result);
        });

        // delete
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await furnitureCollection.deleteOne(query);
            res.send(result);
        });

        // put
        app.put('/product', async (req, res) => {
            const filter = { _id: ObjectId(req.body.id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: req.body.testQuantity
                }
            };
            const result = await furnitureCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
    }
    finally { }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running server');
});

app.listen(port, () => {
    console.log('Listening');
});