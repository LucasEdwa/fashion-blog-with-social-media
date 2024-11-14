
const express = require('express');
const router = express.Router();

const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('./middlewares');

const prisma = new PrismaClient();


router.post('/post',verifyToken, async (req, res) => {
    const { postContent, postImgs } = req.body;
    const userId = req.userId;
    if (!postContent || !postImgs) {
      return res.status(400).json({ error: 'Missing some of the required fields' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'User not found' });
    }
  
    try {
      const post = await prisma.post.create({
        data: {
          postContent,
          user: {
            connect: { id: userId }
          },
          postImgs: {
            create: postImgs.map(img => ({ img }))
          }
        },
        include: {
          postImgs: true
        }
      });
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


router.put('/post/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { postContent, postImgs } = req.body;
    const userId = req.userId;
  
    if (!postContent || !postImgs) {
      return res.status(400).json({ error: 'Missing some of the required fields' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'User not found' });
    }
  
    try {
      const post = await prisma.post.update({
        where: { id },
        data: {
          postContent,
          postImgs: {
            deleteMany: {}, // Delete existing images
            create: postImgs.map(img => ({ img }))
          }
        },
        include: {
          postImgs: true
        }
      });
      console.log('');
      res.status(200).json({ message: 'Post updated successfully', post});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;