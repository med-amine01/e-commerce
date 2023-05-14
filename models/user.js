const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken')

const user_schema = new mongoose.Schema({
    name : {type:String, required : true},
    email : {type : String, unique :true, required :true},
    password : {type : String,  required :true},
    isAdmin : { type: Boolean , default : false},
    role: {
        type: String,
        enum: ['admin', 'owner', 'client'],
        default: 'client',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
})
user_schema.plugin(uniqueValidator)
user_schema.methods.generateAuthJWT = function () {
    const token = jwt.sign({_id:this._id, name : this.name, isAdmin : this.isAdmin},'secret',{ expiresIn: '1h' });
    return token;
}
const user_valid = Joi.object({
    name : Joi.string().min(4).required(),
    email : Joi.string().email().required(),
    password : Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})")).required(),
    isAdmin : Joi.boolean(),
    role: Joi.string().valid('admin', 'owner', 'client').default('client'),
    joinedAt: Joi.date().default(Date.now),
    isActive: Joi.boolean().default(true),
})

const user_login_valid = Joi.object({
    username : Joi.string().email().required(),
    password : Joi.string().regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{4,})")).required(),
})

function user_validate_fun(user){
    let results = user_valid.validate(user);
    return results.error;
}
function user_login_validate_fun(user){
    let results = user_login_valid.validate(user);
    return results.error;
}

const User = mongoose.model('User',user_schema);

module.exports.User =User;
module.exports.user_validate_fun = user_validate_fun;
module.exports.user_login_validate_fun = user_login_validate_fun;
