const whiteList=require('../config/whiteList');

const credentials=(request, response, next)=>{
    const origin=request.headers.origin;
    if(whiteList.indexOf(origin)!==-1 || !origin){
        response.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports=credentials;