const nodemailer = require('nodemailer');

const clientUrl  = "localhost:8080"

exports.SendActivationMail = async (req, user) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  var mailOptions = {
    from: 'kitrampa@gmail.com',
    to: user.email,
    subject: 'Kitrampa Hesabınızı Doğrulayın',
    html: `
      <h1>Merhaba,</h1>
      <p>Kitrampa'ya kaydolduğunuz için teşekkür ederiz.</p>
      <p>E-posta adresinizi doğrulayabilmemiz için lütfen linke tıklayın</p>
      <a href="http://${clientUrl}/onayla/${user.id}?token=${user.emailToken}">Hesabını Doğrulamak için tıkla</a>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  return info;
}


exports.SendReplacementMail = async (req, user, newEmail) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  var mailOptions = {
    from: 'kitrampa@gmail.com',
    to: newEmail,
    subject: 'Kitrampa Hesabınızı Doğrulayın',
    html: `
      <h1>Merhaba,</h1>
      <p>Görünüşe göre e-posta adresinizi değiştirmek istiyorsunuz.</p>
      <p>E-posta adresinizi değiştirmemiz için lütfen linke tıklayın</p>
      <a href="http://${req.headers.host}/user/verify-email/${user.id}?token=${user.emailToken}">Hesabını Doğrulamak için tıkla</a>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  return info;
}

exports.SendResetPassword = async (req, user, digitCode) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  var mailOptions = {
    from: 'kitrampa@gmail.com',
    to: user.email,
    subject: 'Hesabınızın Şifresini Yenileyin',
    html: `
      <h1>Merhaba <b>${user.username}</b>,</h1>
      <p>Şifrenizi değiştirmek için aşağıdaki kodu kullanman yeterli.</p>
      <p>dijital kod: <b>${digitCode}</b></p>
    `
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);
  return info;
}