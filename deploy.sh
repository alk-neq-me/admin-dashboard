export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 

 cd admin-dashboard

git restore .
git pull origin rangoon

# server
cd server
echo "[ INSTALL ] Installing backend dependencies...\n"
# pnpm dlx prisma db push
# pnpm dlx prisma generate
pnpm install

echo "[ BUILD ] building server...\n"
pnpm run build

# client 
cd ../client
echo "[ INSTALL ] Installing backend dependencies...\n"
pnpm install

echo "[ BUILD ] building client...\n"
pnpm run build


cd ../doc
echo "[ GENERATE ] generate documation...\n"
pnpm run gen
