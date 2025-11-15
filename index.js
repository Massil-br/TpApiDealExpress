require('dotenv').config();
const express = require("express");
const connectDB = require("./src/config/db");
const { consoleLogger, requestLogger } = require('./src/utils/logger');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorMiddleware');


const authRoutes = require("./src/routes/authRoutes");
const dealRoutes = require("./src/routes/dealRoutes");


const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(consoleLogger);
app.use(requestLogger);


app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);

app.get('/', async (req, res)=>{
    res.json({message:'Welcome to DealExpress Api'});
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 8080;

app.listen(PORT,()=>{
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


