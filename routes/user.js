const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.get('/category/:id', async (req, res, next) => {
    console.log(req.params.id);
    const category = await User.findOne(
        { _id: req.params.id },
        { _id: false, category: true }
    );
    const retval = {
        data: category,
    };
    console.log(category);
    res.status(200).json(retval);
});

router.get('/:id', async(req, res) => {
    const userInfo = await User.findOne(
        { _id : req.params.id },
        { _id : true, nickname : true }
    )

    const response = {};
    response['result'] = userInfo != null ? 'Success' : 'Fail';
    response['detail'] =
        userInfo != null ? '' : '잘못된 사용자입니다.';
    response['data'] =
        userInfo != null ? userInfo : null
    console.log(response);
    res.status(200).send(response);
});

module.exports = router
