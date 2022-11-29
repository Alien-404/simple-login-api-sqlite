const express = require('express');
const cors = require('cors');
require('dotenv').config();

// prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// init express
const app = express();

// miscellaneous
const BASE_URL = `http://localhost:${process.env.PORT || 8080}`;

// variable

// middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// root route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: `please provide username and password`,
    });
  }

  const createUser = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  res.status(200).json({
    createUser,
  });
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  const userCheck = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (!userCheck) {
    return res.status(400).json({
      message: `user not found with ${username}`,
    });
  }

  const hasUser = await prisma.user.findFirst({
    where: {
      username,
      password,
    },
  });

  if (!hasUser) {
    return res.status(400).json({
      message: `incorrect credentials`,
    });
  }
  res.status(200).json({
    message: `success login with ${hasUser}`,
  });
});

// listen app
app.listen(
  process.env.PORT || 8080,
  process.env.HOSTNAME || 'localhost',
  (req, res) => {
    console.log(`Server running ${BASE_URL}`);
  }
);
