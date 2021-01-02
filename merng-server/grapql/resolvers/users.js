const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { SECRET_FORMULA } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const User = require('../../models/User')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_FORMULA, { expiresIn: '1h' })
}

module.exports = {
    Mutation: {
        register,
        login
    }
}

async function register(_, {
    registerInput: {
        username, email, password, confirmPassword
    }
},
    context,
    info
) {
    // Validate de data
    // Make sure user is unique
    // Hash password before storage
    // Create auth token
    const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
    if (!valid) {
        throw new UserInputError('Errors', { errors })
    }
    const user = await User.findOne({ username })
    if (user) {
        throw new UserInputError('Username is taken', {
            errors: {
                username: 'This username is taken'
            }
        })
    }

    password = await bcrypt.hash(password, 12)

    const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
    })

    const res = await newUser.save()

    const token = generateToken(res)

    return {
        ...res._doc,
        id: res.id,
        token
    }
}

async function login(_, {
    loginInput: { username, password }
},
    context,
    info
) {
    const { valid, errors } = validateLoginInput(username, password)
    if (!valid) {
        throw new UserInputError('Errors', errors)
    }

    const user = await User.findOne({ username })
    if (!user) {
        errors.general = 'User not found'
        throw new UserInputError('User not found', { errors })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        errors.general = 'Wrong credentials'
        throw new UserInputError('Wrong credentials', { errors })
    }

    const token = generateToken(user)

    return {
        ...user._doc,
        id: user.id,
        token
    }
}