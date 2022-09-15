const fs=require('fs');
const Tour=require('../models/tourModel')
const APIFeatures=require('../utils/apiFeatures')
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

//this is a middleare function to b used in tourRoutes
exports.aliasTopTours=(req,res,next)=>{
    req.query.limit= 5,
    req.query.sort= '-ratingsAverage,price'
    req.query.fields='name,price,ratingsAverage,summary,difficulty'
    next();
}

//NOTE : VVI OBSERVATION FROM LECTURE 101 https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065100#questions/8389426 //SO BASICALLY find emehtod can be used on the model i.e tour,however, sort,skip and limit can only be applied on an instance of The query class i.e on a query obj. Thats why we send Tour.find() so that we can return and then chain other methods: VVI READ https://thecodebarbarian.com/how-find-works-in-mongoose.html FOR EX: sort acc to doc is Query.prototype.sort(),which means that it would work only on query objects,while find is Model.find which means that it would work on Model created by us like Tour for ex. Now in this case , it'll work fine because we have filter method before sort and  pagination are chained, so we get the qury object from there (Tour.find()), but if we want to sort thee entire data then we wouldnt be using find in some cases so there we will have an issue.

//VVI: Tour.find() returns all the documents in the collection


exports.getAllTours = async (req,res)=>{
        
    try{

        console.log(req.query)
        const features=new APIFeatures(Tour.find(),req.query).filter().sort().limitFields().paginate()
        const tours= await features.query

        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results:tours.length,
            data:{
                tours
            }
        })
    }
   catch(err){
       console.log(err)
       res.status(404).json({
           status:'fail',
           message:err
       })
   }
  
}


exports.deleteTour = async (req,res)=>{

    try{
        const tour = await Tour.findByIdAndDelete(req.params.id)
        console.log(tour)
        res.status(204).json({
            status: 'success',
            data: null
        })
    }
        catch(err){
        console.log(err.message)
        res.status(404).json({
            status:'fail',
            message:err
        })
    }
    
//     const id = parseInt(req.params.id);
//   const tour = tours.find(t => t.id === id);
 
// //   https://www.geeksforgeeks.org/node-js-path-resolve-method/
//   const updatedTours = tours.filter(t => t.id !== tour.id);
//   fs.writeFile(
//     // path.resolve(__dirname, 'dev-data', 'data', 'tours-simple.json'),
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(updatedTours),
//     err => {
//       res.status(204).json({
//         status: 'success',
//         data: null
//       });
//     }
//   );
}

//   exports.checkID=(req,res,next,value)=>{
//       //NOTE: REQ.PARAMS.ID == VALUE == parameter 
//       console.log(`Your id is: ${req.params.id} or ${value}`);
//     if (req.params.id*1>tours.length) {
//         return res.status(404).json({
//           status: 'fail',
//           message: 'Invaild ID'
//         });
// }
//     next();
// }

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//           });
//     }

//     next();
// }

// NOTE: 96TH VIDEO IS A MUST WATCH!!! (Making the API Better: Advanced Filtering)
//OLD WAY OF DOING getAll Tours. New Way above this done using class API features

//  exports.getAllTours = async (req,res)=>{
     
//      try{
         
//         //Filtering 
//          const queryObj={...req.query}; //shallow copy
//          const excluded=['page','sort','limit','fields']
//          excluded.forEach(el=> delete queryObj[el])
//          console.log(queryObj,req.query)
//         console.log(req.query)
//         // Another way of doing this filter of the non wanted query props is ES6 syntax in another way const { page, sort, limit, fields, ...queryObj } = req.query;
         
//          //NOTE: In Mongoose,there are 2 ways of writing database queries
//          // 1.
//         //  const tours = await Tour.find(queryObj)
//         //2.
//         // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

//         //Advanced Filtering
//         //filter string in MongoDB {difficulty: 'easy', duration: { $gte:5 }}
//         //query string (req.query obj) -> {difficulty: 'easy', duration: { gte:5 }}

//         let queryStr= JSON.stringify(queryObj)
//         queryStr=queryStr.replace(/\b(lt|gt|lte|gte)\b/g, match => `$${match}`)
//         let query =Tour.find(JSON.parse(queryStr))
//         console.log(queryStr)

//         //SORTING:
//         // https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573  SORTING IS NOW DIFF FRO WHAT IT USED TOBE IN MONGODB
//         if (req.query.sort) {
//             const sortBy = req.query.sort.split(',').join(' ');
//             console.log(sortBy)
//             // let sortObj={};
//             // sortBy.forEach((ele)=>{
//             //     if(ele[0]==='-') sortObj[ele.slice(1)]=-1
//             //     else sortObj[ele]=1
//             // })
//             // console.log(sortObj)
//             query = query.sort(sortBy);
//           } else {
//             query = query.sort('-createdAt');
//           }

//           //Limiting fields
//           //Operatin of selection certain fields is called projecting
//           if (req.query.fields) {
//             const fields = req.query.fields.split(',').join(' ');
//             console.log(fields)
//             query = query.select(fields);
//           } else {
//             query = query.select('-__v');
//           }

//             //PAGINATION
//             //NOTE:limit in query string is amount of result per page
//             const page=req.query.page*1||1
//             const limit=req.query.limit*1||100
//             const skip=(page-1)*limit;

//             query.skip(skip).limit(limit)
            
//           if(req.query.page){
//               const numTours = await Tour.countDocuments();
//               if(skip>=numTours) throw new Error('This page doesnt exist')
//           }

//         const tours=await query

//     res.status(200).json({
//         status: 'success',
//         requestedAt: req.requestTime,
//         results:tours.length,
//         data:{
//             tours
//         }
//     })
//     }catch(err){
//         console.log(err)
//         res.status(404).json({
//             status:'fail',
//             message:err
//         })
//     }
   
// }

//MY OWN PATCH SOL
//BETTER IMPLEMEMNTATION : https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064856#questions/7474720
exports.updateTour = async (req,res)=>{

    try{
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        })
        console.log(tour)
        res.status(200).json({
            status:'sucess',
            data:{
                tour
            }
        })
    }catch(err){
        console.log(err.message)
        res.status(404).json({
            status:'fail',
            message:err
        })
    }

    // const tour=tours.find(el => el.id === req.params.id*1)
    // const temp=tours.filter(el => el.id !== req.params.id*1)
    // tours.splice(0, tours.length);
    // tours.push(...temp);

    // for(const key in req.body){
    //     if(tour[key]==undefined) return res.status(404).json({
    //         status:'failed',
    //         message:'No key found'
    //     })
    //    else if(req.body[key]!==tour[key]) tour[key]=req.body[key];
    // } 

    // tours.push(tour);
    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
    //     res.status(200).json({
    //         status:'sucess',
    //         data:{
    //             tour
    //         }
    //     })
    // })
    
    }

//VVI: https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15064850#questions/12164596
exports.createTour = async (req,res)=>{
    try{
        const tour = await Tour.create(req.body)
        console.log(tour)
        res.status(201).json({
            status:'sucess',
            data:{
                tour
            }
        })
    }catch(err){
        console.log(err.message)
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
    // const newTour={id:tours[tours.length-1].id+1,...req.body};
    // console.log(newTour);
    // tours.push(newTour);
    // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`,JSON.stringify(tours),(err)=>{
        // res.status(201).json({
        //     status:'sucess',
        //     // data:{
        //     //     tour: newTour
        //     // }
        // })
    // })
}

exports.getTour = async (req,res)=>{
    // console.log(req.params);

    try{
        const tour = await Tour.findById(req.params.id)
        console.log(tour)
    res.status(200).json({
        status: 'success',
        data:{
            tour
        }
    })
    }catch(err){
        console.log(err.message)
        res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        })
    }
   
    // const tour=tours.find(el => el.id === req.params.id*1)

    // if(!tour) {
    //     return res.status(404).json({
    //         status:'failed',
    //         message:'Invalid ID'
    //     })
    // }

    // res.status(200).json({
    //     status: 'success',
    //     data:{
    //         tour
    //     }
    // })
}

exports.getTourStats = async (req, res) => {
    try {
      const stats = await Tour.aggregate([
        {
          $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
          $group: {
            _id: { $toUpper: '$difficulty' },
            numTours: { $sum: 1 },
            numRatings: { $sum: '$ratingsQuantity' },
            avgRating: { $avg: '$ratingsAverage' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },
        {
          $sort: { avgPrice: 1 }
        }
        // {
        //   $match: { _id: { $ne: 'EASY' } }
        // }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  
  exports.getMonthlyPlan = async (req, res) => {
    try {
      const year = req.params.year * 1; // 2021
  
      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates'
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`)
            }
          }
        },
        {
          $group: {
            _id: { $month: '$startDates' },
            numTourStarts: { $sum: 1 },
            tours: { $push: '$name' }
          }
        },
        {
          $addFields: { month: '$_id' }
        },
        {
          $project: {
            _id: 0
          }
        },
        {
          $sort: { numTourStarts: -1 }
        },
        {
          $limit: 12
        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  