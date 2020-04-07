const express = require("express");
const Posts = require("../data/db");
const router = express.Router();

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get("/", (req, res) => {
	Posts.find(req.query)
		.then(posts => res.status(200).json(posts))
		.catch(err =>
			res
				.status(500)
				.json({ errorMessage: "Uable to retrieve posts from database" })
		);
});

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get("/:id", (req, res) => {
	Posts.findById(req.params.id)
		.then(post => {
      if(post.length) {
        res.status(200).json({ post })
      } else {
        res.status(401).json({ errorMessage: `Failed to find post by ID: ${req.params.id} in database` })
      }
    })
		.catch(err =>
			res.status(500).json({
				errorMessage: `Error while retreiving post from server...`
			})
		);
});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
  Posts.findCommentById(req.params.id)
    .then(comments => {
      if(comments.length) {
        res.status(200).json({ comments })
      } else {
        res.status(404).json({ errorMessage: `Unable to find comments contained in ID: ${req.params.id}` })
      }
    })
    .catch(err => res.status(500).json({ errorMessage: `Error while retreiving post from server...` }))
})

// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
  if(req.body.title.length && req.body.contents.length) {
    Posts.insert(req.body)
      .then(post => {
        res.status(201).json({ message: `Successfully created post at ID: ${post.id}` })
        // .then(post => Posts.findById(post.id).then(res.json(post)))
      })
      .catch(err => res.status(500).json({ errorMessage: `Error while creating post on server...` }))
  } else {
    res.status(400).json({ errorMessage: `Post must contain both title and contents` })
  }
})

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
  if(req.body.text.length) {
    Posts.insertComment(req.body)
      .then(comment => {
        res.status(201).json({ message: `Successfully created comment at ID: ${comment.id}` })
      })
      .catch(err => res.status(500).json({ errorMessage: `Error while creating comment on server...`  }))
  } else {
    res.status(400).json({ errorMessage: `Comment must contain text content` })
  }
})

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.4
router.put('/:id', (req, res) => {
  Posts.update(req.params.id, req.body)
    .then(post => {
      res.status(201).json({ message: `Successfully edited post at ID: ${post.id}` })
    })
    .catch(err => res.status(500).json({ errorMessage: `Error updating post on server...` }))
})

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
    .then(post => {
      res.status(201).json({ message: `Successfully deleted post at ID: ${post.id}` })
    })
    .catch(err => res.status(500).json({ errorMessage: `Error deleting post on server...` }))
})

module.exports = router;
