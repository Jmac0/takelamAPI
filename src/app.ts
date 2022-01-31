import 'dotenv/config'
import express from 'express';
import contentRouter from "./routers/contentRouter";

const app = express()

app.use(express.json({
    limit: '10kb'
}));

app.use('/api/v1/content', contentRouter)


export default app;