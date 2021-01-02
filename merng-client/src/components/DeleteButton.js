import React, { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'

import { FETCH_POSTS_QUERY } from '../util/graphql'
import PopupWrapper from './PopupWrapper'

export function DeleteCommentButton({ postId, commentId }) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION, {
        update(cache) {
            setConfirmOpen(false)
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
            <PopupWrapper content='Delete this comment'>
                <Button
                    as='div'
                    color='red'
                    floated='right'
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name='trash' style={{ margin: 0 }} />
                </Button>
            </PopupWrapper>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deleteComment} />
        </>
    )
}

export function DeletePostButton({ postId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(cache) {
            const data = cache.readQuery({
                query: FETCH_POSTS_QUERY
            })
            if (data) {
                const posts = data
                    .getPosts
                    .filter(ref => ref.id !== postId)
                cache.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        getPosts: [...posts]
                    }
                })
            }
            setConfirmOpen(false)
            if (callback) {
                callback()
            }
        },
        variables: {
            postId
        }
    })

    return (
        <>
            <PopupWrapper content='Delete this post'>
                <Button
                    as='div'
                    color='red'
                    floated='right'
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name='trash' style={{ margin: 0 }} />
                </Button>
            </PopupWrapper>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost} />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost(
        $postId: ID!
    ) {
        deletePost(
            postId: $postId
        )
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment(
        $postId: ID!
        $commentId: ID!
    ) {
        deleteComment(
            postId: $postId
            commentId: $commentId
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