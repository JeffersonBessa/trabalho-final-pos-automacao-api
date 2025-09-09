const users = [];

exports.create = ({ username, password, pixKey }) => {
  users.push({ username, password, pixKey, balance: 0 });
};

exports.findByUsername = (username) => {
  return users.find(u => u.username === username);
};

exports.findByPixKey = (pixKey) => {
  return users.find(u => u.pixKey === pixKey);
};

exports.updateBalance = (username, newBalance) => {
  const user = users.find(u => u.username === username);
  if (user) user.balance = newBalance;
};

exports.getAll = () => users;
