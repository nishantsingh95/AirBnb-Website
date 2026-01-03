import serverless from 'serverless-http';
import app from '../index.js'; // Adjust path as needed
import connectDb from '../config/db.js';

connectDb();

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    await connectDb();
    return serverlessHandler(event, context);
};
