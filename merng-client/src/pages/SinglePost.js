import React, { useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Button, Card, Grid, Label, Image, Icon, Transition } from 'semantic-ui-react';
import moment from 'moment'

import { AuthContext } from '../context/auth'
import LikeButton from '../components/LikeButton';
import CommentButton from '../components/CommentButton';
import { DeletePostButton, DeleteCommentButton } from '../components/DeleteButton'
import CommentForm from '../components/CommentForm'

function SinglePost(props) {
    const { user } = useContext(AuthContext)
    const postId = props.match.params.postId

    const { data: { getPost: post } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })

    let postMarkup;
    if (!post) {
        postMarkup = (
            <p>Loading post...</p>
        )
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = post

        function deletePostCallback() {
            props.history.push('/')
        }

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            floated='right'
                            size='small'
                            src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                        />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <CommentButton user={user} post={{ id, comments, commentCount }} />
                                {user && user.username === username && <DeletePostButton postId={id} callback={deletePostCallback} />}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <CommentForm user={user} postId={id} />
                                </Card.Content>
                            </Card>
                        )}
                        <Transition.Group>
                            {comments.map(comment => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        <Card.Header>
                                            <Image
                                                floated='left'
                                                size='mini'
                                                src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
                                            />
                                            {comment.username}
                                            {user && comment.username === user.username && <DeleteCommentButton postId={id} commentId={comment.id} />}
                                        </Card.Header>
                                        <Card.Meta>
                                            {moment(comment.createdAt).fromNow(true)}
                                        </Card.Meta>
                                        <Card.Content>
                                            {comment.body}
                                        </Card.Content>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Transition.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup
}

const FETCH_POST_QUERY = gql`
    query getPost (
        $postId: ID!
    ) {
        getPost(
            postId: $postId
        ) {
            id
            body
            createdAt
            username
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id
                username
                body
                createdAt
            }
        }
    }
`

export default SinglePost