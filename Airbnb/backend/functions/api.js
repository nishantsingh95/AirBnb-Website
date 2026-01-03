import express from 'express';
import serverless from 'serverless-http';
import { app } from '../index.js';
import { connectDb } from '../config/db.js';

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    await connectDb();
    return serverlessHandler(event, context);
};

// We need to wrap the app or use a router to handle the path prefix
// if the redirect keeps the prefix.
// However, serverless-http usually adapts.
// Let's try the safest Express way:
// Create a wrapper app that mounts the main app at `/.netlify/functions/api`.
// Note: We need to import express.

statusCode: 500,
    body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
    })
        };
    }
};
