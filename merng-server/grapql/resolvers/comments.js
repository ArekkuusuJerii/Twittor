const Post = require('../../models/Post')
const checkAuth = require('../../util/check-auth')
const { UserInputError } = require('apollo-server')

module.exports = {
    Query: {},
    Mutation: {
        createComment,
        deleteComment
    }
}

async function deleteComment(_, { postId, commentId }, context) {
    const { username } = checkAuth(context)
    //User was found
    if (postId.trim() === '') {
        throw new UserInputError('PostId must not be empty')
    }
    if (commentId.trim() === '') {
        throw new UserInputError('CommentId must not be empty')
    }
    try {
        const post = await Post.findById(postId)

        if (post) {
            const commentIndex = post.comments.findIndex(c => c.id === commentId)
            const comment = post.comments[commentIndex]

            if (comment) {
                if (comment.username === username) {
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    return post
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            } else {
                throw new UserInputError('Comment not found')
            }
        } else {
            throw new UserInputError('Post not found')
        }
    } catch (err) {
        throw new Error(err)
    }
}

async function createComment(_, {
    commentInput: { postId, body }
}, context) {
    const { username } = checkAuth(context)
    //User was found
    if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
            errors: {
                body: 'Comment body must not be empty'
            }
        })
    }

    try {
        const post = await Post.findById(postId)

        if (post) {
            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString()
            })

            await post.save()
            return post
        } else {
            throw new UserInputError('Post not found')
        }
    } catch (err) {
        throw new Error(err)
    }
}