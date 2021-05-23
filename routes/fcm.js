const User = require('../models/user');
const express = require('express');
const router = express.Router();
const util = require('../util');

router.post('/register/:id', async (req, res) => {
  const data = req.body;
  console.log(data);

  const update = await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        fcm_key: data.token,
      },
    }
  );

  console.log(update);

  const response = {};
  if (update.n === 1 && update.n === update.ok) {
    response['result'] = 'Success';
    if (update.nModified == 0) response['detail'] = '같은 내용입니다.';
  } else {
    response['result'] = 'Fail';
    response['detail'] = 'FCM 토큰이 정상적으로 등록되지 않았습니다.';
  }
  res.status(200).send(response);
});

module.exports = router;
