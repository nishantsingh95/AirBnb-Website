import express from 'express';
import serverless from 'serverless-http';
import { app } from '../index.js';
import { connectDb } from '../config/db.js';

const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        await connectDb();
        return await serverlessHandler(event, context);
    } catch (error) {
        console.error("Function execution error:", error);
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
            body: JSON.stringify({
                message: error.message || "Internal Server Error",
                error: error.toString()
            })
        };
    }
};
