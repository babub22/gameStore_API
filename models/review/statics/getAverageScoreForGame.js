module.exports = async function ({ gameId }) {
  const gameScores = await this.find({ "game._id": gameId })
    .select("gameScore -_id")
    .lean();

  const averageScore = calculateAvgScore(gameScores);
  return averageScore;
};

function calculateAvgScore(scores) {
  if (scores.length === 0) {
    return 0;
  }

  let sumOfScore = 0;
  let scoreCounter = 0;

  while (scores.length > scoreCounter) {
    sumOfScore += scores[scoreCounter].gameScore;
    scoreCounter++;
  }

  return (sumOfScore / scores.length).toFixed(1);
}
