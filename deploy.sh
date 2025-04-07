rm -rf ./dist
cd server
npm run build
rsync -av ./ ../dist
rsync -av  ../public ../dist
rsync -av  ../package.json ../dist
rsync -av  ../package-lock.json ../dist
cd ../dist
ls
scp -r ./* bokz:/var/www/dg-tracker
ssh bokz "cd /var/www/dg-tracker && npm install && pm2 start server.js"
