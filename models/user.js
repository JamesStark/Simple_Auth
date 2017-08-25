var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = mongoose.Schema({
     name: {
        type: String
    },
    email: {
       type: String
   },
   phonenumber: {
      type: String
  },
     username: {
        type: String,
        index: true
    },
     password: {
        type: String,
    },
});

UserSchema.plugin(passportLocalMongoose);

var User = module.exports = mongoose.model("User", UserSchema);
