
const async = require('async');
const path = require('path');
const { ResponseTime } = require('../models/ResponseTime');

const GetResponseTimeForCommunication = async () =>
    ResponseTime.find({ student_id: { $exists: true } })
        .populate({
            path: 'student_id',
            populate: [
                { path: 'agents', model: 'User' },
                { path: 'editors', model: 'User' }
            ]
        })
        .lean()

const GetResponseTimeForThread = async () =>
    ResponseTime.find({ thread_id: { $exists: true } })
        .populate({
            path: 'thread_id',
            populate: {
                path: 'student_id',
                model: 'User',
                populate: [
                    { path: 'agents', model: 'User' },
                    { path: 'editors', model: 'User' }
                ]
            }
        })
        .lean()

const FileTypeMapping = {
    "CV": ["CV"],
    "ML": ["ML"],
    "RL": ["RL_A", "RL_B", "RL_C", "Recommendation_Letter_A", "Recommendation_Letter_B"],
    "Essay": ["Essay"],
    "Communication": ["communication"],
    "Agent Support": ["Supplementary_Form", "Others", "Scholarship_Form", "Curriculum_Analysis"],
    "Portfolio": ["Portfolio"]
}

const BlankLookupTable = {
    "UserProfile": {
        firstname: null,
        Role: null
    },
    "CV": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "ML": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "RL": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "Essay": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "Communication": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "Agent Support": {
        AvgResponseTime: null,
        ResponseTimeId: []
    },
    "Portfolio": {
        AvgResponseTime: null,
        ResponseTimeId: []
    }
};

const GetFormattedFileType = (fileType) => {
    // Find the entry where the fileType exists in the values array
    const entry = Object.entries(FileTypeMapping).find(([key, values]) => values.includes(fileType));
    // If entry is found, return the key, otherwise return null
    return entry ? entry[0] : null;
};

const GernerateLookupTable = (Lookup, key, task) => {
    const FormattedFileType = GetFormattedFileType(task.interval_type);
    const userId = key?._id.toString();
    if (!(userId in Lookup)) {
        Lookup[userId] = JSON.parse(JSON.stringify(BlankLookupTable));
        Lookup[userId]["UserProfile"].firstname = key.firstname;
        Lookup[userId]["UserProfile"].Role = key.role;
    }
    Lookup[userId][FormattedFileType].AvgResponseTime += task.intervalAvg;
    Lookup[userId][FormattedFileType].ResponseTimeId.push(task);
};

const GenerateResponseTimeByUser = asyncHandler(async (req, res, next) => {
    let Lookup = {};

    const ResponseTimeForCommunication = await GetResponseTimeForCommunication({ student_id: { $exists: true } });
    ResponseTimeForCommunication.forEach((RTFC) => {
        const agent = RTFC.student_id.agents[0] ?? null

        if (agent) {
            GernerateLookupTable(Lookup, agent, RTFC);
        }
    });

    const ResponseTimeForThread = await GetResponseTimeForThread({ thread_id: { $exists: true } });
    ResponseTimeForThread.forEach((RTFT) => {
        const agent = RTFT.thread_id.student_id.agents[0] ?? null
        const editor = RTFT.thread_id.student_id.editors[0] ?? null

        if (agent) {
            GernerateLookupTable(Lookup, agent, RTFT);
        }
        if (editor) {
            GernerateLookupTable(Lookup, editor, RTFT);
        }
    });

    //calculate the average response time
    for (const user in Lookup) {
        for (const attribute in Lookup[user]) {
            if (attribute !== "UserProfile") {
                const entry = Lookup[user][attribute];
                if (entry.ResponseTimeId.length > 0) {
                    const averageResponseTime = entry.AvgResponseTime / entry.ResponseTimeId.length;
                    Lookup[user][attribute].AvgResponseTime = averageResponseTime;
                } else {
                    Lookup[user][attribute].AvgResponseTime = null;
                }
            }
        }
    };

    res.status(200).send({ success: true, data: Lookup });
    next();
});