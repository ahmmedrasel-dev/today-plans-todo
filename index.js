const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Middleware.
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbzsu.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const taskCollection = client.db('todotask').collection("task");

    app.post('/add-task', async (req, res) => {
      const task = req.body;
      await taskCollection.insertOne(task);
      res.send({ success: true, message: 'Added Task!' });
    })

    app.get('/task', async (req, res) => {
      const query = {};
      const task = await taskCollection.find(query).toArray();
      res.send(task)
    })

    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result)
    })

    app.put('/taskComplete/:id', async (req, res) => {
      const id = req.params.id;
      const complete = req.body.completeStatus
      const filter = { _id: ObjectId(id) };
      const options = { upset: true }
      const updateSatus = {
        $set: {
          complete: complete
        }
      };
      const result = await taskCollection.updateOne(filter, updateSatus, options);
      res.send({ message: 'Task Completed.' })
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Todays Plan')
})

app.listen(port, () => {
  console.log(`Doctors App listing from Port ${port}`)
})