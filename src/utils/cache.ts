import { redisClient } from '../config/redis';

export const clearMovieCache = async () => {
  let cursor: string = '0'; 

  do {
    const reply = await redisClient.scan(cursor, {
      MATCH: 'movies:search:*',
      COUNT: 100
    });

    cursor = reply.cursor.toString(); 
    const keys = reply.keys;

    if (keys.length > 0) {
      await redisClient.unlink(keys);
    }
  } while (cursor !== '0');
  
  console.log("Movie cache cleared!");
};
