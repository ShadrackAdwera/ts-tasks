import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '@adwesh/common';

import { Section } from '../models/Section';

const newSection = async(req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const userId = req.user?.userId;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }

    const newSection = new Section({ name, createdBy: userId });

    // TODO: publish to auth section DB??? We shall see . . . 

    try {
        await newSection.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(201).json({message: 'Section has been successfully created',section: newSection });
}

const getSections = async(req: Request, res: Response, next: NextFunction) => {
    let allSections;
    try {
        allSections = await Section.find().exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    res.status(200).json({totalSections: allSections.length, sections: allSections});
}

// TODO: add update section and delete section controllers - to also publish events to section db in auth service.

export { getSections, newSection };
