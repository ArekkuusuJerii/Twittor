import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { useMutation, gql } from '@apollo/client'

import PopupWrapper from './PopupWrapper'

function LikeButton({ user, post: { id, likes, likeCount } }) {
    const [liked, setLiked] = useState(false)

    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST, {
        variables: {
            postId: id
        }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='teal' basic>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button color='teal' basic as={Link} to='/login'>
                <Icon name='heart' />
            </Button>
        )

    return (
        <PopupWrapper content='Like this post'>
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        </PopupWrapper>
    )
}

const LIKE_POST = gql`
    mutation likeTogglePost (
        $postId: ID!
    ) {
        likeTogglePost(
            postId: $postId
        ) {
            id
            likes {
                id
                username
            }
            likeCount
        }
    }
`

export default LikeButton