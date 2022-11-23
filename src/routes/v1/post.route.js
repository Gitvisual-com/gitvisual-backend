const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const postValidation = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');
const jsonify = require('../../middlewares/jsonify');

const router = express.Router();
const storage = multer.diskStorage({
  destination(_req, _res, cb) {
    cb(null, './public/uploads');
  },
  filename(_req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router
  .route('/')
  .post(
    auth('managePosts'),
    upload.array('media'),
    jsonify(['tags', 'tools']),
    validate(postValidation.createPost),
    postController.createPost
  )
  .get(auth('getPosts'), validate(postValidation.getPosts), postController.getPosts);

router
  .route('/:postId')
  .get(auth('getPosts'), validate(postValidation.getPost), postController.getPost)
  .patch(auth('managePosts'), validate(postValidation.updatePost), postController.updatePost)
  .delete(auth('managePosts'), validate(postValidation.deletePost), postController.deletePost);

module.exports = router;
