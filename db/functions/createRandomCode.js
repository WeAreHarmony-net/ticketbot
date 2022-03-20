const mongoose = require("mongoose");

module.exports = () => {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
    let rand = "";
    for (let i = 0; i < 5; i++) {
        rand += nums[Math.floor(Math.random() * nums.length)]
    }
    return rand;
}