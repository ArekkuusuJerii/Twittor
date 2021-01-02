const gql = require('graphql-tag')

module.exports = gql`
    # #
    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        comments: [
            Comment
        ]!
        likes: [
            Like
        ]!
        likeCount: Int
        commentCount: Int
    }
    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
    }
    # #
    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }
    input RegisterInput {
        username: String!
        email: String!
        password: String!
        confirmPassword: String!
    }
    input LoginInput {
        username: String!
        password: String!
    }
    input CommentInput {
        postId: String!
        body: String!
    }
    type Mutation {
        register(registerInput: RegisterInput) : User!
        login(loginInput: LoginInput): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(commentInput: CommentInput!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likeTogglePost(postId: ID!): Post!
    }
    type Subscription {
        newPost: Post!
    }
`