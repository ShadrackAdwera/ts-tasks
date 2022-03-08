import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError,natsWraper } from '@adwesh/common';

import { Task, taskStatus } from '../models/Tasks';
import { TaskCreatedPublisher } from '../events/publishers/task-created-publisher';

const createTask = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    const userId = <string>req.user?.userId;
    const { title, description, category, image } = req.body;

    const newTask = new Task({ title, 
        description, 
        category, 
        image, 
        createdBy: userId, 
        assignedTo: undefined, 
        status: taskStatus.pending });

    try {
        await newTask.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

     try {
         await new TaskCreatedPublisher(natsWraper.client).publish({
             id: newTask.id,
             title: newTask.title,
             description: newTask.description,
             category: newTask.category,
             image: newTask.image,
             createdBy: newTask.createdBy,
             assignedTo: undefined,
             status: taskStatus.pending
         })
     } catch (error) {
         
     }
    res.status(201).json({message: 'New task created', task: newTask});

}

const getAllTasks = async(req: Request, res: Response, next: NextFunction) => {
    let foundTasks;
    let userId = <string>req.user?.userId;
    try {
        foundTasks = await Task.find({createdBy: userId}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(200).json({totalTasks: foundTasks.length, tasks: foundTasks});
}

const getPendingTasks = async(req: Request, res: Response, next: NextFunction) => {
    let foundTasks;
    let userId = <string>req.user?.userId;
    try {
        foundTasks = await Task.find({createdBy: userId, status: taskStatus.pending}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(200).json({totalTasks: foundTasks.length, tasks: foundTasks});
}

const updateTasksAssigned = async(req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.taskId;
    const userId = <string>req.user?.userId;
    const { taskStatus } = req.body; 
    let foundTask

    try {
        foundTask = await Task.findById(taskId).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }
    if(!foundTask) {
        return next(new HttpError('This task does not exist!',404));
    }

    if(foundTask.assignedTo !== userId) {
        return next(new HttpError('You are not authorized to perform this action!',403));
    }

    foundTask.status = taskStatus;
    try {
        await foundTask.save();
        //publish to scheduler
    } catch (error) {
        return next(new HttpError('An error occured, try again',500));
    }

}

export { getAllTasks, getPendingTasks, createTask, updateTasksAssigned };


