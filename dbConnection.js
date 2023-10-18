const mongoose = require("mongoose");

exports.connectMongoose = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/passport")
    .then(() => console.log("Connected to MongoDB"))
    .catch((e) => console.log(`Error: ${e}`));
}


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    },
});

exports.User = mongoose.model("User", userSchema);