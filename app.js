const fs=require("fs")
const tourRouter= require('./routes/tourRoutes')
const userRouter= require('./routes/userRoutes')
const express=require('express');
const morgan=require('morgan');

const app=express();

//MIDDLEWARES
app.use(express.json());
//expess.json() is a middleware, aka as body-parser, and it helps us acess the body of the request 

app.use(express.static(`${__dirname}/public`));

console.log(process.env.NODE_ENV === 'development');
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use((req,res,next) => {
    console.log('Hello from middleware');
    next();
})

app.use((req,res,next) => {
    req.requestTime = new Date().toISOString()
    next();
})


//ROUTE HANDLERS
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));
// console.log(tours);

// const deleteTour = (req,res)=>{
//     const id = parseInt(req.params.id);
//   const tour = tours.find(t => t.id === id);
 
//   if (!tour) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invaild ID'
//     });
//   }

// //   https://www.geeksforgeeks.org/node-js-path-resolve-method/
//   const updatedTours = tours.filter(t => t.id !== tour.id);
//   fs.writeFile(
//     path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
//     JSON.stringify(updatedTours),
//     err => {
//       res.status(204).json({
//         status: 'success',
//         data: null
//       });
//     }
//   );
//  }

//  const getAllTours = (req,res)=>{
//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime,
//         results:tours.length,
//         data:{
//             tours
//         }
//     })
// }

// //MY OWN PATCH SOL
// //BETTER IMPLEMEMNTATION : https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064856#questions/7474720
// const updateTour = (req,res)=>{
//     const tour=tours.find(el => el.id === req.params.id*1)
//     const temp=tours.filter(el => el.id !== req.params.id*1)
//     tours.splice(0, tours.length);
//     tours.push(...temp);

//     for(const key in req.body){
//         if(tour[key]==undefined) return res.status(404).json({
//             status:'failed',
//             message:'No key found'
//         })
//        else if(req.body[key]!==tour[key]) tour[key]=req.body[key];
//     } 

//     tours.push(tour);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
//         res.status(200).json({
//             status:'sucess',
//             data:{
//                 tour
//             }
//         })
//     })
//     }

    
// //VVI: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064850#questions/12164596
//     const createTour = (req,res)=>{
//         const newTour={id:tours[tours.length-1].id+1,...req.body};
//         console.log(newTour);
//         tours.push(newTour);
//         fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
//             res.status(201).json({
//                 status:'sucess',
//                 data:{
//                     tour: newTour
//                 }
//             })
//         })
//     }

//     const getTour = (req,res)=>{
//         console.log(req.params);
//         const tour=tours.find(el => el.id === req.params.id*1)
    
//         if(!tour) {
//             return res.status(404).json({
//                 status:'failed',
//                 message:'Invalid ID'
//             })
//         }
    
//         res.status(200).json({
//             status: 'success',
//             data:{
//                 tour
//             }
//         })
//     }

//     const getUser = (req,res)=>{
//         res.status(500).json({
//             status:'error',
//             message:'This route is not yet defined'
//         })
//     }

//     const createUser = (req,res)=>{
//         res.status(500).json({
//             status:'error',
//             message:'This route is not yet defined'
//         })
//     }

//     const getAllUsers = (req,res)=>{
//         res.status(500).json({
//             status:'error',
//             message:'This route is not yet defined'
//         })
//     }

//     const updateUser = (req,res)=>{
//         res.status(500).json({
//             status:'error',
//             message:'This route is not yet defined'
//         })
//     }

//     const deleteUser = (req,res)=>{
//         res.status(500).json({
//             status:'error',
//             message:'This route is not yet defined'
//         })
//     }

// //OLD WAY OF ROUTING 
// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours',createTour)
// app.get('/api/v1/tours/:id',getTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',deleteTour)

//BETTER WAY OF ROUTING 

//ROUTES
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

// app.route('/api/v1/users').get(getAllUsers).post(createUser);
// app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser)


//EVEN MORE PREFFERED WAY OF ROUTING

// const tourRouter=express.Router();
// const userRouter=express.Router();

// tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)


app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

//START SERVERS
// const port=3000;
// app.listen(port, ()=>{
//     console.log(`App running on port ${port}`);
// })

module.exports=app;