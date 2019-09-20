require('dotenv').config();


if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: process.env.DB_PRODUCTION}
} else {
  module.exports = {mongoURI: process.env.DB_DEVELOPMENT}
}