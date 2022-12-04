const allRoles = {
  user: [
    'getUsers',
    'manageUsers',
    'managePosts',
    'getPosts',
    'getJobs',
    'manageJobs',
    'getConversations',
    'sendMessages',
    'getMessages',
    'readMessages',
    'initConversation',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
