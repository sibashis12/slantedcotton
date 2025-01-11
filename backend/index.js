require('dotenv').config();
const mongoose=require('mongoose');
const express=require('express');
const app=express();
const PORT=process.env.PORT || 6000;
const cors=require('cors');
const {logger}=require('./middleware/logEvents');
const corsOptions=require('./config/corsOptions');
const credentials=require('./middleware/credentials');
const connectDB=require('./config/dbConn');
const cookieParser=require('cookie-parser');

app.use(logger);

connectDB();

app.use(credentials);//sets access control headers

app.use(cors(corsOptions));//contains whitelisted sites

app.use(cookieParser());//middleware to parse cookies

app.use(express.urlencoded({extended:false}));
app.use(express.json());
// routes
app.use('/signUp', require('./routes/signUp'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
// protected routes
app.use('/dummy', require('./middleware/verifyJWT'));
app.use('/dummy', require('./routes/api/dummy'));
app.all("*", (request, response)=>{
    response.status(404).send("Page not found");
});

mongoose.connection.once('open', ()=>{
    app.listen(PORT, ()=>{
        console.log("Server running on port "+`${PORT}`);
    });
});