module.exports = {
    functions: {
        connect: require("./functions/connect"),
        randomCode: require("./functions/createRandomCode")
    },
    models: {
        Tickets: require("./models/Tickets"),
        Config: require("./models/Config")
    }
}