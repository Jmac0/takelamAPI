import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';

const DB = process.env.DB!.replace(
  '<password>',
  process.env.PASSWORD as string
)!;
const port = process.env.PORT;
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
// connect to server
const server = app.listen(port, () => {
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
