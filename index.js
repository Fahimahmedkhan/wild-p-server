const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.habxwhg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const photoCollection = client.db('wildP').collection('myPhotoCollection');
        const reviewCollection = client.db('wildP').collection('reviewCollection');

        app.get('/myPhotoCollection', async (req, res) => {
            const query = {};
            const option = {
                sort: { rating: 1 }
            }
            const cursor = photoCollection.find(query, option);
            const photo = await cursor.toArray();
            res.send(photo);
        });

        app.get('/collections', async (req, res) => {
            const query = {};
            const option = {
                sort: { rating: 1 }
            }
            const cursor = photoCollection.find(query, option);
            const photo = await cursor.toArray();
            const estimate = await photoCollection.estimatedDocumentCount();
            const removedNumber = estimate - 3;
            const newPhoto = photo.splice(2, removedNumber);
            res.send(photo);
        });

        app.get('/collection', async (req, res) => {
            const query = {};
            const option = {
                sort: { rating: 1 }
            }
            const cursor = photoCollection.find(query, option);
            const photo = await cursor.toArray();
            res.send(photo);
        });

        app.get('/myPhotoCollection/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const photo = await photoCollection.findOne(query);
            res.send(photo);
        });

        // orders api
        app.get('/reviewCollection', async (req, res) => {
            let query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        app.post('/reviewCollection', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.post('/myPhotoCollection', async (req, res) => {
            const photo = req.body;
            const result = await photoCollection.insertOne(photo);
            console.log(result);
            photo._id = result.insertedId;
            res.send(photo);
        });
    }
    finally {

    }
}

run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Wild-p server is running')
})

app.listen(port, () => {
    console.log(`Wild-p server running on ${port}`);
})