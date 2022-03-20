const mongoose = require("mongoose");

module.exports = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGO_DB_STRING, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }).then(() => {
            resolve(true);
        }).catch((err) => {
            reject(err);
        });
    });
}