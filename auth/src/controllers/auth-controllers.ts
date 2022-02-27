import brypto from 'crypto';
import { HttpError } from '@adwesh/common';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import { natsWraper } from '../../natsWrapper';
import { SectionPublisher } from '../events/publishers/section-publisher';
import { User } from '../models/User';
import { Company } from '../models/Company';

// to compare company name(s)
const compareStrings = (requestCompanyName: string, dbCompanyName: string) => {
    return requestCompanyName.trim().toLocaleLowerCase().split(' ').join('-') === dbCompanyName.trim().toLocaleLowerCase().split(' ').join('-');
}

const signUp = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundUser;
    let foundCompany;
    let hashedPassword: string;
    let token: string;
    const { username, email, password, company } = req.body;

    //check if email exists in the DB
    try {
        foundUser = await User.findOne({email}).populate('company').exec();
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

    if(foundCompany) {
        const companyNameResult = compareStrings(company, foundCompany.name);
        if(companyNameResult) {
            return next(new HttpError('This company name is taken', 422));
        }
    }

    //create company in DB and publish event to company service
    const newCompany = new Company({
        name: company
    });
    try {
        await newCompany.save();
        await new SectionPublisher(natsWraper.client).publish({ id: newCompany.id, title: newCompany.name });
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
        token = await jwt.sign( { id: newUser.id, email }, process.env.JWT_KEY!, { expiresIn: '1h' });    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(201).json({message: 'Sign Up successful', user: { id: newUser.id, email, company: newCompany.name ,token }});

}

const login = async(req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid inputs', 422));
    }
    let foundUser;
    let isPassword: boolean;
    let token: string;
    const { email, password } = req.body;

    //check if email exists in the DB
    try {
        foundUser = await User.findOne({email}).populate('company').exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    if(!foundUser) {
        return next(new HttpError('Email does not exist, sign up instead', 400));
    }

    //compare passwords
    try {
        isPassword = await bcrypt.compare(password, foundUser.password);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!isPassword) {
        return next(new HttpError('Invalid password', 422));
    }

    //generate token
    try {
        token = await jwt.sign( { id: foundUser.id, email: foundUser.email }, process.env.JWT_KEY!, { expiresIn: '1h' });    
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    //TODO: Add company name to response body.
    res.status(201).json({message: 'Login Successful', user: { id: foundUser.id, email, token, roles: foundUser.roles }})
}

const requestPasswordReset = async(req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    let foundUser;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email', 422));
    }

    // check if user exists in DB
    try {
        foundUser = await User.findOne({email}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundUser) {
        return next(new HttpError('This account does not exist', 400));
    }
    const resetTkn = brypto.randomBytes(64).toString('hex');
    const resetDate = new Date(Date.now() + 3600000);
    foundUser.resetToken = resetTkn;
    foundUser.tokenExpirationDate = resetDate;

    //TODO: Send email with reset link to user : https://my-frontend-url/reset-token/${resetTkn}
    res.status(200).json({message: 'Check your email for a reset email link'});
}

const resetPassword = async(req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword } = req.body;
    const { resetToken } = req.params;
    let foundUser;
    let hashedPassword: string;

    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(new HttpError('Invalid email', 422));
    }

    //check if passwords match
    if(password !== confirmPassword) {
        return next(new HttpError('The passwords do not match', 422));
    }

    // check if user exists in DB
    try {
        foundUser = await User.findOne({resetToken, tokenExpirationDate: { $gt: Date.now() }}).exec();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    if(!foundUser) {
        return next(new HttpError('The password reset request is invalid', 400));
    }  

    // hash new password
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }
    foundUser.password = hashedPassword;
    foundUser.tokenExpirationDate = undefined;
    foundUser.resetToken = undefined;

    try {
        await foundUser.save();
    } catch (error) {
        return next(new HttpError('An error occured, try again', 500));
    }

    res.status(200).json({message: 'Password reset successful'});
 }

 export { signUp, login, requestPasswordReset, resetPassword };