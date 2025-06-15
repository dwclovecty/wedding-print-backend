const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json({ limit '30mb' }));

const transporter = nodemailer.createTransport({
  host 'smtp.gmail.com',
  port 587,
  secure false,
  auth {
    user process.env.EMAIL_USER  'a14913933@gmail.com',
    pass process.env.EMAIL_PASS  'stvcrztxrfbytdaw'
  }
});

app.post('send-email', async (req, res) = {
  try {
    const { base64Photo } = req.body;
    await transporter.sendMail({
      from 'a14913933@gmail.com',
      to 'jvt7394j7j3en4@print.epsonconnect.com',
      subject 'Wedding Print Photo',
      text 'Photo for printing via Epson Connect',
      attachments [{
        filename 'photo.jpg',
        content base64Photo,
        encoding 'base64'
      }]
    });
    fs.appendFileSync('send-email.log', `Sent email at ${new Date().toISOString()}n`);
    res.json({ success true });
  } catch (error) {
    console.error('後端寄信失敗', error);
    res.status(500).json({ error error.message });
  }
});

app.get('', (req, res) = {
  res.send('Wedding Print Backend is running!');
});

const port = process.env.PORT  3000;
app.listen(port, () = console.log(`Server running on port ${port}`));