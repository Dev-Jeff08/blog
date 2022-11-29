import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        qnique: true,
    },
    email: {
        type: String,
        required: true,
        qnique: true,
        lowercase: true
    },
    password: {
        type: String
    }
})

userSchema.pre('save', function(next) {
    if (this.isModified('password')) {

        const user = this;

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(String(user.password), salt, function(err, hash) {
                user.password = hash;
            })
        })

    } else {
        next();
    };
})

const User = mongoose.model('User', userSchema);

export default User;