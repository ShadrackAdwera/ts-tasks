import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from '@adwesh/common';

import { Category } from '../models/Category';

const createCategory = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    const { title, description, priority } = req.body;

    let newCategory = new Category({
        title, description, priority
    });
    try {
        await newCategory.save();
        // publish event to tasks service
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(201).json({message: 'Category created', category: newCategory});
}

const getCategories = async(req: Request, res: Response, next: NextFunction) => {
    let categories;

    try {
        categories = await Category.find().exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({totalCategories: categories.length, categories});
}

const getCategoryById = async(req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params?.id;
    let foundCategory;

    try {
        foundCategory = Category.findById(categoryId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundCategory) {
        return next(new HttpError('This category does not exist!', 404));
    }
    res.status(200).json({category: foundCategory});
}