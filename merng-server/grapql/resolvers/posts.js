const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const { AuthenticationError, UserInputError } = require('apollo-server')

module.exports = {
    Query: {
        getPosts,
        getPost,
    },
    Mutation: {
        createPost,
        deletePost,
    },
    Subscription: {
        newPost: {
            subscribe
        }
    }
}

async function getPosts() {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        return posts
    } catch (err) {
        throw new Error(err)
    }
}

async function getPost(_, { postId }) {
    try {
        const post = await Post.findById(postId)
        if (post) {
            return post
        } else {
            throw new Error('Post not found')
        }
    } catch (err) {
        throw new Error(err)
    }
}

async function createPost(_, { body }, context) {
    const user = checkAuth(context)
    //User was found

    if(body.trim() === '') {
        throw new UserInputError('Post body must not be empty')
    }

    const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
    })

    const post = await newPost.save()

    context.pubSub.publish('NEW_POST', {
        newPost: post
    })

    return post
}

async function deletePost(_, { postId }, context) {
    const user = checkAuth(context)
    //User was found
    try {
        const post = await Post.findById(postId)
        if (post) {
            if (user.username === post.username) {
                await post.delete()
                return 'Post deleted successfully'
            } else {
                throw new AuthenticationError('Action not allowed')
            }
        } else {
            throw Error('Post does not exist')
        }
    } catch(err) {
        throw new Error(err)
    }
}

async function subscribe(_, __, { pubSub }) {
    return pubSub.asyncIterator('NEW_POST')
}