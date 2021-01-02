import React, { useRef } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm() {
    const commentInputRef = useRef(null)
    const { onChange, onSubmit, values } = useForm(addPostCallback, {
        body: ''
    })

    const [addPost, { loading, error }] = useMutation(CREATE_POST, {
        update(cache, { data: { createPost: post } }) {
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY
            })
            cache.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: {
                    getPosts: [post, ...data.getPosts]
                }
            })
            values.body = ''
            commentInputRef.current.blur()
        },
        onError(err) {
        },
        variables: values
    })

    function addPostCallback() {
        addPost()
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post:</h2>
                <div className='ui action input fluid'>
                    <input
                        type='text'
                        placeholder='Hi...'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false} />
                    <button type='submit' className='ui button teal' disabled={values.body.trim() === ''}>
                        Submit
                    </button>
                </div>
            </Form>
            {error && (
                <div className='ui error message' style={{ marginBottom: 20 }}>
                    <ul>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST = gql`
    mutation createPost (
        $body: String!
    ) {
        createPost(
            body: $body
        ) {
            id
            body
            username
            createdAt
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments {
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export default PostForm