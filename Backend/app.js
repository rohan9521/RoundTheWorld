const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const placeRouter = require('./ROUTES/placesRoutes.js')
const userRouter = require('./ROUTES/userRoutes.js')
const HttpError = require('./models/httpError')
const cors = require('cors')
const mongoose = require('mongoose')

// app.use(cors());
// app.options('*', cors());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*'); //which domains should have access to this api specified by '*'
  res.setHeader('Access-Control-Allow-Headers','Origin,X-Requeste-With,Content-Type,Accept,Authorization')//setting headers which can be accessed 
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,PATCH');
  next()
});


app.use(bodyparser.json())

app.use('/api/project',placeRouter)

app.use('/api/project/usersonly',userRouter)


app.use((req,res,next)=>{
    const error = new HttpError('This route is unsupported')
    throw error
})
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message:error.message||'An unkown error occured'})
})
mongoose 
  .connect("mongodb://localhost:27017/Emp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen('4000')
    console.log("Connected to the server");
  })
  .catch(() => {
    console.log("Connection Failed");
  });
//mongodb+srv://rohan_ray:MogfTI25ahN0tKpf@cluster0-nnyet.mongodb.net/test?retryWrites=true&w=majority