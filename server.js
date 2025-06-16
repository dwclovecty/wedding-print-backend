const express = require('express');
  const sgMail = require('@sendgrid/mail');
  const fetch = require('node-fetch');
  const app = express();

  app.use(express.json());
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  app.post('/send-email', async (req, res) => {
    try {
      let { base64Photo, photoUrl } = req.body;
      if (!base64Photo && photoUrl) {
        console.log('Fetching photo from URL:', photoUrl);
        const response = await fetch(photoUrl);
        if (!response.ok) throw new Error(`Failed to fetch photo: ${response.status}`);
        const buffer = await response.buffer();
        base64Photo = buffer.toString('base64');
      }
      if (!base64Photo || typeof base64Photo !== 'string' || base64Photo.length < 100) {
        return res.status(400).send('無效的 Base64 照片');
      }

      const attachment = {
        content: base64Photo,
        filename: 'photo.jpg',
        type: 'image/jpeg',
        disposition: 'attachment'
      };

      const msg = {
        to: '你的EpsonConnect郵箱@example.com', // 請替換為實際 Epson Connect 郵箱
        from: 'a14913933@gmail.com',
        subject: 'Wedding Photo Print',
        text: 'Please print the attached photo.',
        attachments: [attachment]
      };

      await sgMail.send(msg);
      console.log('SendGrid 寄送成功');
      res.json({ success: true });
    } catch (error) {
      console.error('SendGrid 錯誤:', error);
      res.status(500).send(error.message);
    }
  });

  app.listen(3000, () => console.log('Server running on port 3000'));
