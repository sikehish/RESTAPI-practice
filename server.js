// https://www.freecodecamp.org/news/node-process-object-explained/
//VVI FOR MOONGO DB LEC 81
const dotenv=require('dotenv')
const mongoose=require('mongoose')
dotenv.config({path:'./config.env'})
// console.log(process.env);
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

//connect method returns a promise
mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con=>{
    // console.log(con.connections)
})

// const tourSchema=new mongoose.Schema({
//     name:{
//         type: String,
//         required:[true, 'A tour must have a name'],
//         unique: true
//     },
//     rating:{
//         type:Number,
//         default: 4.5
//     },
//     price:{
//         type:Number,
//         required: [true, 'A tour must have a price']
//     }

// })

// const Tour=mongoose.model('Tour',tourSchema); //creating a model using tourSchema

// const testTour= new Tour({
//     name:'The Forest Hiker',
//     rating:4.7,
//     price:497
// }) //creating a document from Tour model

// testTour.save().then(doc => console.log(doc)).catch(err=> console.log('ERRROR!!',err))

const app=require('./app.js')

//basically read the data from the config.env file and then saves it to the env variables of nodJS, which we can acess using the globally available process obj

// console.log(app.get('env'));
console.log(process.env.NODE_ENV);
// console.log(process.env)

const port=process.env.PORT;
app.listen(port, ()=>{
    console.log(`App running on port ${port}`);
})