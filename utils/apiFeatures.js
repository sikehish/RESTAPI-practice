//Bewtter implementation of getAll tours
class APIFeatures{
    constructor(query, queryString){
        this.query=query;
        this.queryString=queryString
      }   
      filter()
      {
        const queryObj={...this.queryString}; //shallow copy
        const excluded=['page','sort','limit','fields']
        excluded.forEach(el=> delete queryObj[el])
        //  console.log(queryObj,queryString)
        // console.log(queryString)
        
        let queryStr= JSON.stringify(queryObj)
        queryStr=queryStr.replace(/\b(lt|gt|lte|gte)\b/g, match => `$${match}`)
        this.query =this.query.find(JSON.parse(queryStr))
        // console.log("this" , this.queryString)

        return this;
        } 
         

        //SORTING:
        // https://www.mongodb.com/community/forums/t/sorting-with-mongoose-and-mongodb/122573  SORTING IS NOW DIFF FRO WHAT IT USED TOBE IN MONGODB
        sort(){
            if (this.queryString.sort) {
              console.log("this" , this.queryString)
                const sortBy = this.queryString.sort.split(',').join(' ');
                // const sortBy = this.queryString.sort.replaceAll(',',' ');
                console.log(sortBy)
                // let sortObj={};
                // sortBy.forEach((ele)=>{
                //     if(ele[0]==='-') sortObj[ele.slice(1)]=-1
                //     else sortObj[ele]=1
                // })
                // console.log(sortObj)
                this.query = this.query.sort(sortBy);
              } else {
                this.query = this.query.sort('-createdAt');
              }
              return this;
        }
        

          //Limiting fields
          //Operatin of selection certain fields is called projecting
          limitFields()
          {
            if (this.queryString.fields) {
                const fields = this.queryString.fields.split(',').join(' ');
                console.log(fields)
                this.query = this.query.select(fields);
              } else {
                this.query = this.query.select('-__v');
              }
              return this;
          }
          

            //PAGINATION
            //NOTE:limit in query string is amount of result per page
            paginate()
            {
            const page=this.queryString.page*1||1
            const limit=this.queryString.limit*1||100
            const skip=(page-1)*limit;

            this.query=this.query.skip(skip).limit(limit)
            return this;
            }


}

module.exports=APIFeatures