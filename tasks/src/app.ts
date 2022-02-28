import { HttpError } from '@adwesh/common';
import express, { Request, Response, NextFunction } from 'express';
import { tasksRouter } from './routes/tasks-routes';

const app = express();

app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HttpError('This method / route does not exist', 404);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'Unable to fulfill your request at the moment.'});
});

export { app };