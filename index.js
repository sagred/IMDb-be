const express = require('express')
const redis = require('redis');

const app = express()
app.use(express.json())

const cors = require('cors')

app.use(cors())

const url = 'redis://127.0.0.1:6379'
const client = redis.createClient({ url: url });

const data = require("./movieData")

const connectToDB = async () => {
    await client.connect();
    await client.set('hello', 'world!');

    const key1Val = await client.get('hello');
    console.log(key1Val);

    client.multi().keys("*", (err, keys) => {
        if (err) console.log(err)

        for (var i = 0, len = keys.length; i < len; i++) {
            console.log(keys[i])
        }
    })
};

app.post("/", async (req, res) => {
    const { key, value } = req.body;
    const response = await client.set(key, JSON.stringify(value))
    res.send(response)
})

app.post("/movie/:id", async (req, res) => {
    const { id } = req.params;
    const response = await client.get(id)
    res.send(JSON.parse(response))
})

app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const response = await client.del(id)
    if (response === 1) {
        res.send("success")
        return
    }
    res.send("failed")
})

app.post("/create", async (req, res) => {
    const { key, value } = req.body
    const response = await client.set(JSON.stringify(key), JSON.stringify(value))
    res.send(response)
})

app.post("/update", async (req, res) => {
    const { key, value } = req.body
    const response = await client.set(JSON.stringify(key), JSON.stringify(value))
    res.send(response)
})

app.get("/movies", async (req, res) => {
    const tempData = []
    for (let i = 7000; i < 8000; i++) {
        const response = await client.get(JSON.stringify(i))
        tempData.push(JSON.parse(response))
    }
    res.send(tempData)
})

app.listen(8080, async () => {
    await connectToDB()
    console.log("I am listening...")
    for (let i = 0; i < 1000; i++) {
        const id = i + 7000
        data[i].uuid = id
        const response = await client.set(JSON.stringify(id), JSON.stringify(data[i]))
        console.log(response, id)
    }
    // data.forEach(async (a) => {
    //     //console.log(data.length + 1)
    //     const response = await client.set(a.Poster_Link, JSON.stringify(a))
    //     console.log(response)
    // })
})