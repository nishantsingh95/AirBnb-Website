import express from 'express';
import serverless from 'serverless-http';
import { app } from '../index.js';
import { connectDb } from '../config/db.js';

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    try {
        await connectDb();
        return await serverlessHandler(event, context);
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
