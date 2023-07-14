function isAdminOrModeratorRole(role) {
  return ["Admin", "Moderator"].includes(role);
}

module.exports = isAdminOrModeratorRole;
