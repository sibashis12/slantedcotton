const fs=require('fs');
const fsPromises=require('fs').promises;
const { format }=require('date-fns');
const { v4:uuid }=require('uuid');
const path=require('path');

const logEvents=async (message)=>{
    const msg=`${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}\t${uuid()}\t${message}\n`;
    try{
        if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', 'logEvents.txt'), msg);
    }
    catch(err){
        console.error(err);
    }
}

const logger=(req, res, next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`);
    next();
}
module.exports={logEvents, logger};