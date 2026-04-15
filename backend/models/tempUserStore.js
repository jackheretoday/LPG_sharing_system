const users = [];
let currentId = 1;

const findUserByEmail = (email) => {
  return users.find((user) => user.email === email.toLowerCase());
};

const findUserById = (id) => {
  return users.find((user) => user.id === id);
};

const createUser = ({ name, email, passwordHash }) => {
  const user = {
    id: currentId++,
    name,
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return user;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};
