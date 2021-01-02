const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const { UserInputError } = require('apollo-server')

module.exports = {
    Query: {},
    Mutation: {
        likeTogglePost
    }
}

async function likeTogglePost(_, { postId }, context) {
    const { username } = checkAuth(context)
    //User was found

    try {
        const post = await Post.findById(postId)

        if (post) {
            if(post.likes.find(l => l.username === username)) {
                //Post already liked
                //Un like
                post.likes = post.likes.filter(l => l.username !== username)
            } else {
                //Not likes
                //Like
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString()
                })
            }

            await post.save()
            return post
        } else {
            throw new UserInputError('Post not found')
        }
    } catch (err) {
        throw new Error(err)
    }
}