const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    // connect a user to the post
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text : {
        type: String,
        required: true
    },
    // name of user - allow for option to NOT delete post if user deletes their account
    name : {
        type: String
    },
    avatar : {
        type: String
    },
    likes : [ // array of users that liked the post
        {
            user : {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments : [
        {
            user : {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            avatar : {
                type: String
            },
            date : {
                type: Date,
                default: Date.now
            }
        }
    ],
    date : {
        type: Date,
        default: Date.now
    }

});

module.exports = Post = mongoose.model('post', PostSchema);