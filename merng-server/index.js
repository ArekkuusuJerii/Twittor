const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')

const typeDefs = require('./grapql/typedefs')
const resolvers = require('./grapql/resolvers')
const { MONGODB_URI } = require('./config')

const pubSub = new PubSub()
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubSub })
})

const PORT = process.env.PORT || 5000

mongoose
.connect(MONGODB_URI, { useNewUrlParser : true, useUnifiedTopology: true})
.then(() => {
    console.log(`Mongodb connected`)
    return server.listen({ port: PORT })
}).then(res => {
    console.log(`Server running at ${res.url}`)
}).catch(err => {
    console.error(err)
})