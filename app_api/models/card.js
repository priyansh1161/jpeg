var mongoose = require('mongoose');
var UserSchema = require('./user');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
    title : {type : String , required : true },
    createdOn : {type : Date , default : Date.now},
    imgLink : String,
    imgRaw : Buffer,
    createdBy : Schema.Types.ObjectId,
    comments : [{
        by : String,
        comment : String
    }],
    likes : {type : Number , default:0 , min:0}
});
mongoose.model('Card',CardSchema);

module.exports = CardSchema;
