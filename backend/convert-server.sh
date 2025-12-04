#!/bin/bash
# Convert server.ts requires to imports

sed -i '' 's/const dns = require('\''dns'\'');/import dns from '\''dns'\'';/g' server.ts
sed -i '' 's/require('\''dotenv'\'').config/import dotenv from '\''dotenv'\''; dotenv.config/g' server.ts
sed -i '' 's/const express = require('\''express'\'');/import express from '\''express'\'';/g' server.ts
sed -i '' 's/const cors = require('\''cors'\'');/import cors from '\''cors'\'';/g' server.ts
sed -i '' 's/const bodyParser = require('\''body-parser'\'');/import bodyParser from '\''body-parser'\'';/g' server.ts
sed -i '' 's/const morgan = require('\''morgan'\'');/import morgan from '\''morgan'\'';/g' server.ts
sed -i '' 's/const http = require('\''http'\'');/import http from '\''http'\'';/g' server.ts
sed -i '' 's/const { Server } = require("socket.io");/import { Server } from "socket.io";/g' server.ts
sed -i '' 's/module.exports = /export default /g' server.ts

# Convert all ./ requires to imports
sed -i '' 's/const \(.*\) = require('\''\.\//import \1 from '\''\.\//g' server.ts
sed -i '' "s/require('\.\//import from '.\//g" server.ts

echo "✅ Converted server.ts"
