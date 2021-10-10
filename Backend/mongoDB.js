const MongoClient = require('mongodb').MongoClient
const url = 'mongodb+srv://rohan_ray:Rohan9521@cluster0-nnyet.mongodb.net/places_test?retryWrites=true&w=majority'

const createPlace = async (req,res,next)=>{
    
    const place={
        desc:req.body.desc,
        info:req.body.info,
        user:req.body.user
    }
    const client = new MongoClient(url)
    try{
        await client.connect()
        const db = client.db()
        const result = db.collection('products').insertOne(place)

    }catch(error){
        return res.json({errorMessage:error})
    }
    client.close()
    res.json(place)
}   

const getPlace = (req,res,next)=>{
    
}

exports.createPlace = createPlace
exports.getPlace = getPlace