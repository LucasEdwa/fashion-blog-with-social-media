const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/create-season", async (req, res) => {
  const { season } = req.body;
  if (!season) {
    return res.status(400).json({ error: "Missing season" });
  }
  try {
    const newSeason = await prisma.seasons.create({
      data: {
        season
      }
    });
    res.status(201).json(newSeason);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/seasons", async (req, res) => {
  try {
    const seasons = await prisma.seasons.findMany();
    res.json(seasons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;