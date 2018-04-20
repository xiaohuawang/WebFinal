process.env.NODE_ENV= process.env.NODE_ENV || 'development'
process.env.SERVER_PORT= process.env.SERVER_PORT || '4040'
process.env.JWT_SECRET='0a6b944d-d2fb-46fc-a85e-0295c986cd9f'
//process.env.MONGO_HOST='mongodb://localhost/test'
process.env.MONGO_HOST='mongodb://xiaohuawang:a62811610@ds255797.mlab.com:55797/heroku_7scwzd2c';
process.env.MONGO_PORT='35574'
require('babel-register');
require("babel-polyfill");
require('./server');
