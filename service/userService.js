const userRepository = require('../repository/userRepository');
const transactionRepository = require('../repository/transactionRepository');

exports.register = (req, res) => {
  const { username, password, pixKey } = req.body;
  if (!username || !password || !pixKey) {
    return res.status(400).json({ message: 'Username, password and PIX key are required.' });
  }
  if (userRepository.findByUsername(username)) {
    return res.status(409).json({ message: 'User already exists.' });
  }
  if (userRepository.findByPixKey(pixKey)) {
    return res.status(409).json({ message: 'PIX key already exists.' });
  }
  userRepository.create({ username, password, pixKey });
  return res.status(201).json({ message: 'User registered successfully.' });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  const user = userRepository.findByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  return res.status(200).json({ message: 'Login successful.' });
};

exports.getBalance = (req, res) => {
  const { username } = req.body;
  const user = userRepository.findByUsername(username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.status(200).json({ balance: user.balance });
};

exports.getStatement = (req, res) => {
  const { username } = req.body;
  const user = userRepository.findByUsername(username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  const statement = transactionRepository.getStatement(username);
  return res.status(200).json({ statement });
};
