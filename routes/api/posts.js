const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Pofile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
    '/', 
    [auth, 
        [
            check('text', 'Text is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password'); //since user is logged in, the token is located in req.user.id --> this brings the user without the password
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });
            const post = await newPost.save();
            res.json(post);
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
    });

// @route  GET api/posts
// @desc   Get all posts
// @access Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }); // sort by most recent
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  GET api/posts/:id
// @desc   Get post by ID (of post)
// @access Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found' });
        res.status(500).send('Server Error');
    }
});

// @route  DELETE api/posts/:id
// @desc   Delete a post by id
// @access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // check if post exists
        if (!post) return res.status(404).json({ msg: 'Post not found' });
 
        // check if user that deletes the post is the user that owns the post

        // req.user.id is logged in user
        if (post.user.toString() !== req.user.id){ //post.user is an object so needs to be converted to a string
            return res.status(401).json({ msg: "User not authorized" });
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not found' });
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/posts/like/:id
// @desc   Like a post
// @access Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0 ){
            return res.status(400).json({ msg: 'Post already liked'});
        }
        post.likes.unshift({ user: req.user.id }); // add to likes array

        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  PUT api/posts/unlike/:id
// @desc   Unlike a post
// @access Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0 ){
            return res.status(400).json({ msg: 'Post not yet been liked'});
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.post(
    '/comment/:id', 
    [auth, 
        [
            check('text', 'Text is required').not().isEmpty()
        ]
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {
            const user = await User.findById(req.user.id).select('-password'); //since user is logged in, the token is located in req.user.id --> this retreives the user without their password
            const post = await Post.findById(req.params.id);
            
            const newComment = {    // no "new" keyword bc Comment is not a collection in the database
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);
    
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
        
    });

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete a post (id_of_post/id_of_comment)
// @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //Make sure comment exists
        if (!comment){
            return res.status(404).json({ msg: 'Comment does not exist'});
        }

        // Make sure user that deletes comment is user that created the comment
        if (comment.user.toString() !== req.user.id) { //NOTE: comment.user is a user ID AND req.user.id is id of logged in user
            return res.status(401).json({msg: 'User not authorized'});
        }

        // Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;