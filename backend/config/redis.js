import Redis from 'redis';
import colors from 'colors';

let redisClient = '';
const DEFAULT_EXPIRATION = 3600;
try{
    redisClient= Redis.createClient();
    redisClient.on('connect', function() {
    console.log('Redis server running on 6379 port'.cyan);
});
    await redisClient.connect();
}catch(err){
    console.log(`Redis Unable to Connect: ${err}`.red);
}

const getOrSetCache = async (key, callback)=>{
    return new Promise(async (resolve, reject)=>{
        await redisClient.get(key, async(error, data)=>{
            if(error) return reject(error);
            if(data != null) return resolve(data);
            const freshData = await callback();

            redisClient.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
            return resolve(freshData);
        });
    })
}

export {redisClient, getOrSetCache};
