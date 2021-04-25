const Express = require("express");
const PORT = process.env.PORT || 4000;

const bodyparser = require('body-parser');
const tokenProtection = require('./middleware/tokenProtection')
const verificate = require('./middleware/verificate');
const helmet = require('helmet');
const requestLog = require('./middleware/requestLog');
const cors = require('cors');

require('dotenv').config();

// database connection
require('./helper/db')();

// app
const app = Express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(tokenProtection);
app.use(bodyparser.json());
app.use(verificate);
app.use(requestLog);

// routes
const userRoutes = require('./routes/userRoute');
const adminRoutes = require('./routes/adminRoute');
const bookRoutes = require('./routes/bookRoute');
app.use('/user',userRoutes);
app.use('/admin', adminRoutes)
app.use('/book', bookRoutes)
// run
app.listen(PORT, (err) => {
	if(err) return console.log(err);
	console.log(`Started: http://localhost:${PORT}`);
});

