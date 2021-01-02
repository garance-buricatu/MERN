import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getPost } from '../../actions/post'

import Spinner from '../layout/Spinner'
import PostItem from '../posts/PostItem'

const Post = ({ getPost, post: { post, loading }, match }) => { // match is for matching url
    useEffect(() => {
        getPost(match.params.id)
    }, [getPost])

    return loading || post === null ? (
        <Spinner />
    ) : (
        <Fragment>
            <Link to='/posts' classname='btn'>
                Back to Posts
            </Link>
            <PostItem post={post} showActions={false}  />
        </Fragment>
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post)