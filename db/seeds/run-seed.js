const seed = require('./seed');
const data = require('../test-data/index')
const db = require('../connection')

seed(data).then(()=>{db.end})