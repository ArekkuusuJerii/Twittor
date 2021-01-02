const jwt = require('jsonwebtoken')
const { AuthenticationError } = require('apollo-server')

const { SECRET_FORMULA } = require('../config')

module.exports = (context) => {
    //context = { ... header}
    const authHeader = context.req.headers.authorization
    if(authHeader) {
        //Bearer ....
        const token = authHeader.split('Bearer ')[1]
        if(token) {
            try {
                const user = jwt.verify(token, SECRET_FORMULA)
                return user
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        } else {
            throw new AuthenticationError('Authentication token must be \'Bearer [token]')
        }
    } else {
        throw new Error('Authentication header must be provided')
    }
}