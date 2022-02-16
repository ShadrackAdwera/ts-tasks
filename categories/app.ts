import express, { Request, Response, NextFunction } from 'express';
import { categoryRoutes } from './routes/category-routes';

const app = express()

app.use(express.json());

app.use('/api/categories', categoryRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
    throw new Error('This method / route does not exist');
});

app.use((error: Error,req: Request, res: Response, next: NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(500).json({message: error.message || 'An error occured, try again'});
});

export { app };