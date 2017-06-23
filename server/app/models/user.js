const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs')

//================================
// User Schema
//================================
const UserSchema = new Schema({
    email: {
        type:String,
        lowercase:true,
        unique:true,
        required:true
    },
    emailActive: {
        type:Boolean,
        default:false
    },
    games: {
        type:Array,
        default:false
    },
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    profile: {
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        }
    },
    role: {
        type: String,
        enum: ['Member', 'Client','Owner', 'Admin'],
        default: 'Member'
    },
    resetPasswordToken: { type: String},
    resetPasswordExpires: { type: Date }
},
{
    timestamps:true
})

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function(next) {
    const user = this,
        SALT_FACTOR = 5

    if(!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if(err) return next(err)
        
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if(err) return next(err)
            user.password = hash
            next()
        })

    })
})

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    console.log('candidatePassword', candidatePassword, 'this.password', this.password)
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) {
            console.log('Error', err)
            return cb(err)
        }
        console.log('isMatch', isMatch)
        // if(!isMatch) {
        //     return cb({status:false})
        // }
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)