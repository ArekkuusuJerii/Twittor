import React, { useRef } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { gql, useMutation } from '@apollo/client'

import { useForm } from '../util/hooks'

function CommentForm({ user, postId }) {
    const commentInputRef = useRef(null)
    const { onChange, onSubmit, values } = useForm(addCommentCallback, {
        body: ''
    })

    const [addComment, { loading, error }] = useMutation(CREATE_COMMENT, {
        update(cache) {
            values.body = ''
            commentInputRef.current.blur()
        },
        onError(err) {
        },
        variables: {
            postId,
            ...values
        }
    })

    function addCommentCallback() {
        addComment()
    }

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h3>Create a comment:</h3>
                <div className='ui action input fluid'>
                    <input
                        type='text'
                        placeholder='Hi...'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                        ref={commentInputRef}/>
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

const CREATE_COMMENT = gql`
    mutation createComment (
        $postId: String!
        $body: String!
    ) {
        createComment(
            commentInput: {
                postId: $postId
                body: $body
            }
        ) {
            id
            username
            createdAt
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

export default CommentForm