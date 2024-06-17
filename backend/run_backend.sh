export $(grep "REDIS_PORT" .env | xargs)
docker run -d --name halo-lab-redis -p $REDIS_PORT:6379 redis/redis-stack-server:latest
npm run build
npm run dev
