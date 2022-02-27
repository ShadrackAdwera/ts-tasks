import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';

import { sectionRouter } from './src/routes/section-routes';

const app = express();

app.use(express.json());

app.use('/api/sections', sectionRouter);

app.use((req: Request, res: Response, next:NextFunction) => {
    throw new HttpError('Invalid method / route', 404);
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'Unable to complete the request'});
});

export { app };