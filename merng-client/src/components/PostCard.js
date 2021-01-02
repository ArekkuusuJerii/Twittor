import React, { useContext } from 'react'
import { Card, Image, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from './LikeButton'
import CommentButton from './CommentButton'
import { DeletePostButton } from './DeleteButton'

function PostCard({
    post: { body, createdAt, id, username, likeCount, commentCount, likes, comments }
}) {
    const { user } = useContext(AuthContext)

    return (
        <Card fluid>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <CommentButton user={user} post={{ id, comments, commentCount }} />
                {user && user.username === username && <DeletePostButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard