import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
//const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
import app from './app';
dotenv.config();

const DB = process.env.DB!.replace(
  '<password>',
  process.env.PASSWORD as string
)!;
// Should find the port on Heroku
const port = process.env.PORT || 8000;
// catch unhandled synchronous errors
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 💥 shutting down...');
  process.exit(1);
});

// connect to Mongo db
(async function (): Promise<void> {
  try {
    await mongoose.connect(DB, {});
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
})();

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem')),
  },
  app
);

// connect to server
const server = httpsServer.listen(port, () => {
  if (process.env.NODE_ENV === 'dev') {
    console.log('Development Server Started');
  } else {
    console.log('Production Server Started');
  }
});

process.on('unhandledRejection', (err: { name: string; message: string }) => {
  console.log(err.name, err.message);

  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  // shut down node app
  // gracefully shutdown
  server.close(() => {
    process.exit(1);
  });
});
