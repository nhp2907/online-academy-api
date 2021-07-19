const express = require('express')
const CourseVideoModel = require("../schemas/course-video.schema");
const LearningStatusModel = require("../schemas/learning-status.schema");
const router = express.Router();

router.get('/last-play-video', async (req, res) => {
    const {userId, courseId} = req.query;


    const savedInfo = await LearningStatusModel.findOne({userId, courseId}).populate("video").exec();
    if (savedInfo) {

        if (!savedInfo.video) {
            const videos = await CourseVideoModel.find({courseId: courseId}).limit(1).exec();
            savedInfo.video = videos[0]
        }

        res.send(savedInfo);
        return;
    }

    const videos = await CourseVideoModel.find({courseId: courseId}).limit(1).exec();

    if (videos.length > 0) {
        res.send({
            playedSeconds: 0,
            chapterIndex: 0,
            video: videos[0]
        })
    } else {
        res.status(400).send({
            message: "No video found"
        })
    }
})

router.post('/save-status', async (req, res) => {
    console.log('save status body: ', req.body);
    const {userId, courseId, videoId, playedSeconds, chapterIndex} = req.body;
    try {
        const savedInfo = await LearningStatusModel.findOne({userId, courseId}).exec();
        if (savedInfo) {
            savedInfo.video = videoId;
            savedInfo.playedSeconds = playedSeconds;
            savedInfo.chapterIndex = chapterIndex;
            await savedInfo.save({validateModifiedOnly: true});
        } else {
            await LearningStatusModel.create(req.body);
        }
        res.send({message: 'success'})
    } catch (err) {
        console.log(err);
        res.status(400).send({message: err.message})
    }

})

module.exports = router;