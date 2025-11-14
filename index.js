require('dotenv').config();
const express = require("express");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const { consoleLogger, requestLogger } = require('./src/utils/logger');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorMiddleware');



const app = express();

connectDB();

app.use(express.json);
app.use(express.urlencoded({extended:true}));
app.use(consoleLogger);
app.use(requestLogger);
app.use(errorHandler);
app.use(notFoundHandler);

app.use('/api/auth', authRoutes);


app.get('/', (req, res)=>{
    res.json({message:'Welcome to DealExpress Api'});
});

const PORT = 8080;

app.listen(PORT, ()=>{
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});


