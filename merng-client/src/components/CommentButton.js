import React from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import PopupWrapper from './PopupWrapper'

function CommentButton({ user, post: { id, comments, commentCount } }) {
    const commentButton = user && comments && comments.find(comment => comment.username === user.username) ? (
        <Label color='teal' pointing='left'>
            {commentCount}
        </Label>
    ) : (
            <Label basic color='teal' pointing='left'>
                {commentCount}
            </Label>
        )

    return (
        <PopupWrapper content='Comment on post'>
            <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                <Button color='teal' basic>
                    <Icon name='comments' />
                </Button>
                {commentButton}
            </Button>
        </PopupWrapper>
    )
}

export default CommentButton