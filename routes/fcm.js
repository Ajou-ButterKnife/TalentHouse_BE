const User = require('../models/user');
const express = require('express');
const router = express.Router();
const util = require('../util')

router.post("/register/:id", async(req, res) => {
    const data = req.body;
    console.log(data);

    const update = await User.updateOne(
        { _id : req.params.id },
        {
            $set : {
                fcm_key : data.token,
            }
        }
    );

    console.log(update);

    const response = {};
    if(update.n === 1 && update.n === update.ok) {
        response['result'] = 'Success';
        if(update.nModified == 0)
            response['detail'] = '같은 내용입니다.'
    }
    else {
        response['result'] = 'Fail';
        response['detail'] = "FCM 토큰이 정상적으로 등록되지 않았습니다."
    }
    res.status(200).send(response);
});

router.get("/test", async(req, res) => {
    const list = await User.find(
        {  },
        { _id : false, fcm_key : true }
    )

    var tokenList = []
    for(var i = 0; i < list.length; i++)
        if(list[i].fcm_key != null && list[i].fcm_key !== "")
            tokenList.push(list[i].fcm_key)

    await util.sendFcm("title", "body", tokenList)

    res.status(200).send(list)
})

module.exports = router
