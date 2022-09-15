const dotenv=require('dotenv')
const mongoose=require('mongoose')
dotenv.config({path:'./config.env'})
const Tour=require('../../models/tourModel')
const fs=require('fs');

const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
// console.log(process.env.DATABASE)

mongoose.connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con=>{
    console.log('DB CONNECTION SUCESSFUL!')
    // console.log(con.connections)
})

const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

const importData= async ()=>{

    try{
        await Tour.create(tours);
        console.log('Data sucessfully added')
    }catch(err){
        console.log(err)
    }
    process.exit();
}

const deleteData = async ()=>{
    try{
        await Tour.deleteMany();
        console.log('Data sucessfully deleted')
    }catch(err){
        console.log(err)
    }
    process.exit();
}

// console.log(process.argv)


if(process.argv[2]==='--import') importData();
else if(process.argv[2]==='--delete') deleteData();

// node dev-data/data/import-dev-data.js