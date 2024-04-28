const async = require('async');
const path = require('path');
const { Student } = require('../models/User');
const { Documentthread } = require('../models/Documentthread');
const { Interval } = require('../models/Interval');
const { User } = require('../models/User');
const mongoose = require('mongoose');
const { connectToDatabase, disconnectFromDatabase } = require('../database');

const logger = require('../services/logger');

function calculateInterval(message1, message2){
    const intervalInDay = Math.abs(message1.createdAt - message2.createdAt) / (1000*60*60*24);
    return intervalInDay
  };

const findValidInterval = async(validDocumentThread) => {
    let thread;
    try {
        thread = await Documentthread.findById(validDocumentThread.toString())
        .populate('student_id', 'role')
        .lean();
    } catch (error){
        logger.error('error find valid documentthread')
    };
    if (thread.messages.length > 1){
        let msg_1;
        let msg_2;
        for (const msg of thread.messages){
            try {
                const user = await User.findById(msg.user_id?.toString())
                if (user?.role === "Student") {
                    msg_1 = msg;
                } else {
                    msg_2 = msg;
                }
            } catch (error) {
                logger.error("Error finding message user_id:", error);
            };
            //calculate interval, store values into Interval Collection
            if ( msg_1 !== undefined && msg_2 != undefined ){
                console.log('start calculate interval');
                try {
                    const interval = calculateInterval(msg_1, msg_2);
                    const newInterval = new Interval({
                        thread_id: thread._id.toString(),
                        message_1_id: msg_1,
                        message_2_id: msg_2,
                        interval_type: thread.file_type,
                        interval: interval,
                        updatedAt: new Date()
                    });
                    await newInterval.save();
                    console.log('finish saving interval');
                    msg_1 = undefined;
                    msg_2 = undefined;
                } catch (error){
                    logger.error("Error creating interval collection:", error);
                };
            };
        };
    };
};

const test = async () => {
    
    try {
        const conn = await connectToDatabase(url, 5000);
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
    try {
        const validDocumentThread = await findActiveDocumentThreads();
        for (const documentThread of validDocumentThread){
            await findValidInterval(documentThread);
        }
    } catch (error) {
        logger.error('wrong!');
    };
};

test();
// disconnectFromDatabase();