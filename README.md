# Information
HaloLab Full-Stack Developer Test Task

# Running
## Backend
There are 2 ways to run the backend part. First you need to go to the ```backend``` folder and install dependencies:
```bash
cd backend
npm ci
```
*1-st launch variant:*
```bash
./run_backend.sh
```
*2-nd launch variant:*
```bash
docker run -d --name halo-lab-redis -p your_port:6379 redis/redis-stack-server:latest
npm run build
npm run dev
```
The ```run_backend.sh``` script from variant 1 does the same thing as variant 2, except it reads the .env file, finds the specified port and adds it when downloading the Docker image.
## Frontend
```bash
cd frontend
npm ci
npm start
```
The website is at http://localhost:3000
