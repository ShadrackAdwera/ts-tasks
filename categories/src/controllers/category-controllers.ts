import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError, natsWraper } from '@adwesh/common';

import { Category } from '../models/Category';
import { CategoryCreatedPublisher } from '../events/publisher/category-created-event';

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
        await new CategoryCreatedPublisher(natsWraper.client).publish({
            id: newCategory.id,
            title: newCategory.title,
            description: newCategory.description,
            priority: newCategory.priority,
            version: newCategory.version
        });
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
        foundCategory = await Category.findById(categoryId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundCategory) {
        return next(new HttpError('This category does not exist!', 404));
    }
    res.status(200).json({category: foundCategory});
}

const updateCategory = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const categoryId = req.params?.id;
    const { title, description, priority } = req.body;
    let foundCategory;

    try {
        foundCategory = await Category.findById(categoryId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundCategory) {
        return next(new HttpError('This category does not exist!', 404));
    }
    foundCategory.title = title;
    foundCategory.description = description;
    foundCategory.priority = priority;

    try {
        await foundCategory.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    //publish an event to tasks service
    res.status(200).json({message: 'Update Successful', category: foundCategory});

}

export { createCategory, getCategories, getCategoryById, updateCategory };