const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app=express()
const port=process.env.PORT || 5000;

const cors = require('cors');
//middelware
app.use(cors());
app.use(express.json());



const uri = "mongodb+srv://foisalahmmed2:<password>@cluster0.pxrxjz6.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = client.db("insertDB");
    const userColection = database.collection("userColection");

    //read 
    app.get('/users',async(req,res)=>{
        const cursor= userColection.find();
        //toArray convert
        const result=await cursor.toArray();
        res.send(result)

    })
    //spacific id wise read
    app.get('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const query = { _id: new ObjectId(id) };
      const result= await userColection.findOne(query)
      res.send(result)
    })
    //create insert one
    app.post('/users',async(req,res)=>{
        const user=req.body;
        console.log(user)
        const result = await userColection.insertOne(user);
        res.send(result)
    })

    //update PUT
    app.put('/users/:id',async(req,res)=>{
      const id =req.params.id;
      const user=req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateUser = {
        $set: {
          name:user.name,
          email:user.email
        },
      };
      const result=await userColection.updateOne(filter,updateUser,options)
      res.send(result)
    })

    //delate one
    app.delete('/users/:id',async(req,res)=>{
      const id=req.params.id;
      //rap id with ObjectId
      const query = { _id: new ObjectId(id) };
      const result=await userColection.deleteOne(query)
      res.send(result)

    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>[
    res.send('CURD server running')
])

app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})