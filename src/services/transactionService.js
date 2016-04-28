import transactionSource from '../sources/transactionSource';
import transactionCleaner from './transactionCleanser';
import transactionReportService from './transactionReportService';

import async from 'async';

function getTransactionInfo(done) {

  async.waterfall(
    [
      (callback) => transactionSource.getAllTransactions(callback),
      (transactions, callback) => {
        callback(null, transactionCleaner.applyAllCleanups(transactions));
      },
      (transactions, callback) => _generateSummary(transactions, callback)
    ],
    (err, result) => {
      if(err) {
        return done(err);
      }

      done(null, result);
    }
  )
}

function _generateSummary(transactions, done) {
  let totalBalance = transactionReportService.totalBalance(transactions);
  let groupExpense = transactionReportService.expenseByCategory(transactions);
  let runningTotal = transactionReportService.dailyRunningTotal(transactions);

  done(null, {
    totalBalance,
    groupExpense,
    runningTotal
  });
}

export default {
  getTransactionInfo
}