import app from "./server.js"
import mongo from "mongodb"
import dotenv from 'dotenv'
dotenv.config()
import ReviewsDAO from "./dao/reviewsDAO.js"

const MongoClient = mongo.MongoClient
const mongo_user = `${process.env.MONGO_USERNAME}`
const mongo_pass = `${process.env.MONGO_PASSWORD}`

console.log('MongoDB User:', mongo_user ? 'Found' : 'Missing')
console.log('MongoDB Pass:', mongo_pass ? 'Found' : 'Missing')
const url = `mongodb+srv://${mongo_user}:${mongo_pass}@cluster0.z3fqjnm.mongodb.net/?retryWrites=true&w=majority`

const port = process.env.PORT || 5500

MongoClient.connect(
    url,
    {
        maxPoolSize: 50,  wtimeoutMS: 2500
    }
)
    .catch(err => {
        console.error(err.stack)
        process.exit(1)
        }
    )
    .then(async client => {
        await ReviewsDAO.injectDB(client);
        app.listen(port, () => {
            console.log(`Listening on port ${port}`)
        })
    }
)