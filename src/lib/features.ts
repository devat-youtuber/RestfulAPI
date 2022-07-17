// Constructors and object instances
export class APIfeatures {
  query: any;
  queryString: any;

  constructor(query: any, queryString: any){
    this.query = query; // Products.find()
    this.queryString = queryString; // req.query
  }
 

  paginating = () => {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = limit * (page - 1)
    this.query = this.query.limit(limit).skip(skip)
    return this;
  }

  //this.query = Products.find().limit(limit).skip(skip)

  sorting = () => {
    const sort = this.queryString.sort || '-createdAt';
    this.query = this.query.sort(sort)
    return this;
  }

  //this.query = Products.find().limit(limit).skip(skip).sort(sort)

  searching = () => {
    const search = this.queryString.search;
    if(search){
      this.query = this.query.find({
        $text: { $search: search }
      })
    }else{
      this.query = this.query.find()
    }
    return this;
  }
  //this.query = Products.find().find({
  //     $text: { $search: search }
  //  }).limit(limit).skip(skip).sort(sort)

  filtering = () => {
    const queryObj = { ...this.queryString }

    const excludedFields = ['page', 'sort', 'limit', 'search']
    excludedFields.forEach(el => delete(queryObj[el]))

    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

    this.query = this.query.find(JSON.parse(queryStr))
    return this;
  }

  //this.query = Products.find().find({
  //     {"price":{"$gt":"56.99"}}
  //  }).limit(limit).skip(skip).sort(sort)

  counting = () => {
    this.query = this.query.count()
    return this;
  }
}