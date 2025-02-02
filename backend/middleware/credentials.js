const whiteList = require('../config/whiteList');

const credentials = (request, response, next) => {
    const origin = request.headers.origin;
    
    // Check if the origin is in the whitelist or if origin is undefined
    if (whiteList.indexOf(origin) !== -1 || !origin) {
        // response.header('Access-Control-Allow-Credentials', true); // Allow credentials
        // response.header('Access-Control-Allow-Origin', origin);    // Allow the exact origin (important for credentials)
    }
    
    next();
};

module.exports = credentials;
