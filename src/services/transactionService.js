import transactionSource from '../sources/transactionSource';
import transactionCleaner from './transactionCleanser';
import async from 'async';
import _ from 'lodash';

function getTransactionInfo(done) {
  let resultSummary = {};

  async.waterfall(
    [
      (callback) => transactionSource.getAllTransactions(callback),
      (transactions, callback) => {
        callback(null, transactionCleaner.applyAllCleanups(transactions));
      },
      (transactions, callback) => {
        let totalBalance = calculateBalance(transactions);
        let groupExpense = expenseByCategory(transactions);

        callback(null, {
          totalBalance,
          groupExpense
        });
      }
    ],
    (err, result) => {
      if(err) {
        return done(err);
      }

      done(null, result);
    }
  )
}

function expenseByCategory(transactions) {
  let transByLedger = _.groupBy(transactions, 'Ledger');

  let result = _.mapValues(transByLedger, (transactions) => {
    let totalExpense = _.sumBy(transactions, (tran) => {
      return Number(tran.Amount);
    });

    return {
      totalExpense,
      transactions
    }
  });

  return result;
}


function calculateBalance(transactions) {
  let totalBalance = _.sumBy(transactions, (tran) => {
    return Number(tran.Amount);
  });

  return totalBalance;
}

export default {
  getTransactionInfo,
  calculateBalance
}