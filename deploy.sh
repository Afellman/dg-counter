rm -rf ./dist
cd server
npm run build
rsync -av --exclude='node_modules' ./ ../dist
rsync -av  ../public ../dist
cd ../dist
ls
scp -r ./* bokz:/var/www/dg-counter
ssh bokz "cd /var/www/dg-counter && npm install && pm2 start server.js"
