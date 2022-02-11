import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Document } from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import { User } from '../models/User';
import { Company } from '../models/Company';

interface UserAttributes extends Document {
    username: string;
    email: string;
    password: string;
    company: string;
    roles?: string[];
}

interface CompanyAttributes extends Document {
    name: string
}

// to compare company name(s)
const compareStrings = (requestCompanyName: string, dbCompanyName: string) => {
    return requestCompanyName.trim().toLocaleLowerCase().split(' ').join('-') === dbCompanyName.trim().toLocaleLowerCase().split(' ').join('-');
}

const signUp = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundUser: UserAttributes;
    let foundCompany: CompanyAttributes;
    let hashedPassword: string;
    let token: string;
    const { username, email, password, company } = req.body;

    //check if email exists in the DB
    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(foundUser) {
        return next(new HttpError('Email exists, login instead', 400));
    }
    //check if company exists in DB
    try {
        foundCompany = await Company.findOne({company}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    const companyNameResult = compareStrings(company, foundCompany.name);

    if(companyNameResult) {
        return next(new HttpError('This company name is taken', 422));
    }

    //create company in DB and publish event to company service
    const newCompany = new Company({
        name: company
    });
    try {
        await newCompany.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    //hash password
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }


    // create new user
    const newUser = new User({
        username, 
        email, 
        password: hashedPassword, 
        company: newCompany, 
        roles: ['Admin'],
        resetToken: null,
        tokenExpirationDate: undefined
    });

    try {
        await newUser.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    try {
        token = await jwt.sign( { id: newUser.id, email }, process.env.JWT_KEY, { expiresIn: '1h' });    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'Sign Up successful', user: { id: newUser.id, email, company: newCompany.name ,token }});

}

