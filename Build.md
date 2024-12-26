# First time
npm install

# Build new and Run in detached mode (we free up the terminal) and remove old containers
docker-compose up --build -d --remove-orphans

# View running containers and view logs
docker ps
docker logs <container-id>

# Stop
docker-compose down