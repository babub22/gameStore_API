const { User } = require("../../../../models/user/user");
const decodeToken = require("../../../../utils/decodeToken");
const getAdminToken = require("../../../utils/getAdminToken");
const { createNewUser } = require("./createNewUser");

async function createTenUsers() {
  const createdUsers = [];
  let userNumber = 0;

  while (userNumber < 10) {
    const { userId } = await createNewUser({
      name: `newUser-${userNumber}`,
      email: `example-${userNumber}@gmail.com`,
      password: "1234",
    });

    if (userNumber === 0) {
      await blockUser(userId);
    }

    if (userNumber >= 5 && userNumber <= 7) {
      await User.changeRoleById({
        userId,
        newRole: "Moderator",
      });
    }

    if (userNumber > 7) {
      await User.changeRoleById({
        userId,
        newRole: "Admin",
      });
    }

    const { resultBody: userWithChangedReviewsCount } =
      await User.increaseReviewsCountById({
        userId,
        reviewsNumber: (userNumber + 1) * 10,
      });

    createdUsers.push(userWithChangedReviewsCount);
    userNumber++;
  }

  return createdUsers;
}

async function blockUser(userId) {
  const { token: adminToken } = getAdminToken();
  const decoded = decodeToken(adminToken);

  await User.blockUserById({
    userId,
    currentUser: decoded,
    reason: "Test test",
  });
}

module.exports = createTenUsers;
