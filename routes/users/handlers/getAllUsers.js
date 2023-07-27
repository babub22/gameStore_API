const { User } = require("../../../models/user/user");

async function getAllUsers(req, res) {
  const { sortBy, limit, role } = req.query;

  let query = {
    find: { "userStatus.status": "Active" },
    limit: Number(limit),
    sortBy: sortBy === "reviewsCount" ? `-${sortBy}` : `${sortBy}`,
  };

  if (role === "Reviewer") {
    query.find.isReviewer = true;
  } else if (role) {
    query.find.role = role;
  }

  const sortedUsers = await User.findUsersAndSortByQuery({ query });

  res.send(sortedUsers);
}

module.exports = getAllUsers;
