const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middlewares');
const router = express.Router();



const prisma = new PrismaClient();

router.get('/current-user', verifyToken, async (req, res) => {
    const user = await prisma.user.findUnique({
        where:{id: req.userId}    
    });
    if(!user){
        return res.status(404).json({error: 'User not found'});
    } else{
         res.send({user:user});
    }
}); 


// Manage users image using Express
router.post('/upload-profile-picture', verifyToken, async (req, res) => {
    // Check if a file was uploaded
    if (!req.files || !req.files.profileImg) {
        res.status(400).send({ error: "No file uploaded." });
        return;
    }
    const file = req.files.profileImg;
    // Check if the file name is available
    if (!file.name) {
        res.status(400).send({ error: "File name is missing." });
        return;
    }
    // Move the uploaded file to the images directory
    file.mv(`${__dirname}/images/profile/${file.name}`, async (error) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while uploading your image." });
            return;
        }
        // Update user profile image in the database
        try {
            await prisma.user.update({
                where: { id: req.userId },
                data: {
                    profileImg: 'images/profile/' + file.name
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while saving the image data." });
            return;
        }
        res.send({ success: "Profile picture uploaded successfully." });
    });
});

router.get('/get-user-image/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { profileImg: true }
        });

        if (!user || !user.profileImg) {
            return res.status(404).json({ error: 'Image not found' });
        }

        return res.json({ profileImg: user.profileImg });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to get user image URL', details: error.message });
    }
});

module.exports = router;