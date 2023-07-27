const { Review } = require("../../../models/review/review");

async function getReviewByAuthor(req, res) {
  const { objectId: authorId } = req.params;

  const reviews = await Review.getReviewsByAuthorId(authorId);
  res.send(reviews);
}

module.exports = getReviewByAuthor;
