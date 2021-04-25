const   mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(process.env.DB_URL+process.env.DB_NAME, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    mongoose.connection.on('error', console.error.bind(console, "Connection Error"));
    mongoose.connection.once('open', ()=>{
        console.log('Connect to DB')
    });
}