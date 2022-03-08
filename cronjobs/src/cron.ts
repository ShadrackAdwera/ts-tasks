import { HttpError } from '@adwesh/common';
import cron from 'node-cron';
import { Task, Agent } from './models/Models';
import { taskStatus } from './utils/enums';

export const handleCronJobs = () => {
    cron.schedule('*/15 * * * *', async()=>{
        console.log(`We're up and running on this cron jobs thing . . . `);
        let foundTasks;
        let foundUser;
        try {
            foundTasks = await Task.find({status: taskStatus.pending}).exec();
        } catch (error) {
            throw new HttpError('An error occured', 500);
        }
        if(foundTasks.length===0) {
            return;
        }
        
    
        for(const foundTask of foundTasks) {
            try {
                foundUser = await Agent.findOne({ category: foundTask.category }).exec()
             } catch (error) {
                 throw new HttpError('An error occured', 500);
             }
             if(!foundUser) {
                 return;
             }
             foundTask.assignedTo = foundUser.id;
             await foundTask.save();
             //notify user via email of assigned task;
        }
        return;
    });
}