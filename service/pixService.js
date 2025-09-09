const userRepository = require('../repository/userRepository');
const transactionRepository = require('../repository/transactionRepository');

function canTransact(username) {
  const transactions = transactionRepository.getRecentTransactions(username, 1); // 1 hour
  return transactions.length < 10;
}

exports.pay = (req, res) => {
  const { username, amount, pixKey } = req.body;
  if (!username || !amount || !pixKey) {
    return res.status(400).json({ message: 'Username, amount and PIX key are required.' });
  }
  const user = userRepository.findByUsername(username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (user.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance.' });
  }
  if (!canTransact(username)) {
    return res.status(429).json({ message: 'Transaction limit exceeded (10 per hour).' });
  }
  const receiver = userRepository.findByPixKey(pixKey);
  if (!receiver) {
    return res.status(404).json({ message: 'Receiver not found.' });
  }
  userRepository.updateBalance(username, user.balance - amount);
  userRepository.updateBalance(receiver.username, receiver.balance + amount);
  transactionRepository.addTransaction({
    from: username,
    to: receiver.username,
    amount,
    type: 'pay',
    date: new Date()
  });
  return res.status(200).json({ message: 'Payment successful.' });
};

exports.receive = (req, res) => {
  const { username, amount, pixKey } = req.body;
  if (!username || !amount || !pixKey) {
    return res.status(400).json({ message: 'Username, amount and PIX key are required.' });
  }
  const user = userRepository.findByUsername(username);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }
  if (!canTransact(username)) {
    return res.status(429).json({ message: 'Transaction limit exceeded (10 per hour).' });
  }
  if (user.pixKey !== pixKey) {
    return res.status(400).json({ message: 'PIX key does not match user.' });
  }
  userRepository.updateBalance(username, user.balance + amount);
  transactionRepository.addTransaction({
    from: null,
    to: username,
    amount,
    type: 'receive',
    date: new Date()
  });
  return res.status(200).json({ message: 'Value received successfully.' });
};
