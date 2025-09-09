const transactions = [];

exports.addTransaction = (tx) => {
  transactions.push(tx);
};

exports.getStatement = (username) => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return transactions.filter(tx =>
    (tx.from === username || tx.to === username) &&
    new Date(tx.date) >= thirtyDaysAgo
  );
};

exports.getRecentTransactions = (username, hours) => {
  const now = new Date();
  const since = new Date(now.getTime() - hours * 60 * 60 * 1000);
  return transactions.filter(tx =>
    (tx.from === username || tx.to === username) &&
    new Date(tx.date) >= since
  );
};
