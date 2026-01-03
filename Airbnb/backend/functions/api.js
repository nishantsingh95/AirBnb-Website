import express from 'express';
import serverless from 'serverless-http';
import { app } from '../index.js';
import connectDb from '../config/db.js';

const serverlessHandler = serverless(app);

// We need to wrap the app or use a router to handle the path prefix
// if the redirect keeps the prefix.
// However, serverless-http usually adapts.
// Let's try the safest Express way:
// Create a wrapper app that mounts the main app at `/.netlify/functions/api`.
// Note: We need to import express.

const wrapperApp = express();

// Middleware to parse JSON is already in `app`, but we might need it here if we do logic? 
// No, just delegation.

// Mount the app.
wrapperApp.use('/.netlify/functions/api', app);

// Create the handler from the WRAPPER app.
const handlerWithWrapper = serverless(wrapperApp);

export const handler = async (event, context) => {
    try {
        await connectDb();
        return await handlerWithWrapper(event, context);
    } catch (error) {
        console.error("Function execution error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error",
                error: error.message
            })
        };
    }
};
