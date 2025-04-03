require('dotenv').config();
const mongoose=require('mongoose');
const express=require('express');
const app=express();
const PORT=process.env.PORT || 5000;
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
app.use('/refresh', require('./routes/refresh'));
app.use('/admin/login',  require('./routes/adminLogin'));
app.use('/admin/logout', require('./routes/adminLogout'));
app.use('/admin/refresh', require('./routes/adminRefresh'));
// protected routes
app.use('/admin', require('./middleware/verifyAdminJWT'));
app.use('/admin', require('./routes/api/admin'));
app.use('/user', require('./middleware/verifyJWT'));
app.use('/user', require('./routes/api/user'));
app.all("*", (request, response)=>{
    response.status(404).send("Page not found");
});

mongoose.connection.once('open', ()=>{
    app.listen(PORT, ()=>{
        console.log("Server running on port "+`${PORT}`);
    });
});