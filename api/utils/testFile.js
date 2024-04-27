const async = require('async');
const path = require('path');
const { Student } = require('../models/User');
const mongoose = require('mongoose');
const { connectToDatabase, disconnectFromDatabase } = require('../database');
const {
//   PORT,
//   isProd,
//   isDev,
//   HTTPS_KEY,
//   HTTPS_CERT,
//   HTTPS_CA,
//   HTTPS_PORT,
//   CLEAN_UP_SCHEDULE,
//   WEEKLY_TASKS_REMINDER_SCHEDULE,
//   DAILY_TASKS_REMINDER_SCHEDULE,
//   AWS_S3_PUBLIC_BUCKET_NAME,
//   AWS_S3_BUCKET_NAME,
  MONGODB_URI
//   COURSE_SELECTION_TASKS_REMINDER_JUNE_SCHEDULE,
//   COURSE_SELECTION_TASKS_REMINDER_DECEMBER_SCHEDULE,
//   COURSE_SELECTION_TASKS_REMINDER_JULY_SCHEDULE,
//   COURSE_SELECTION_TASKS_REMINDER_NOVEMBER_SCHEDULE
} = require('../config');

const test = async () => {
    
    try {
        const conn = await connectToDatabase('mongodb+srv://dev_test:taigerportal_access@clustertaiger.mff3w.mongodb.net/TaiGer?retryWrites=true&w=majority', 5000);
        console.info(`Database connected: ${conn.host}`);
    } catch (err) {
        console.error('Failed to connect to database: ', err);
        process.exit(1);
    }
    const findActiveDocumentThreads = async () => {
        try {
            const activeDocumentThreads = [];
            const students = await Student.find();
            for (const student of students){
                if (student.archiv != true){
                    for (const thread of student.generaldocs_threads){
                        activeDocumentThreads.push(thread.doc_thread_id);
                    };
                };
            };
            return activeDocumentThreads;
        } catch (error) {
            console.log("Error finding active document threads:", error);
            return [];
        };
    };
    console.log(await findActiveDocumentThreads());
};

test();
// disconnectFromDatabase();