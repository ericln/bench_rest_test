import transactionSource from '../sources/transactionSource';
import transactionCleaner from './transactionCleanser';
import async from 'async';
import _ from 'lodash';
import moment from 'moment';

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
  let totalBalance = calculateBalance(transactions);
  let groupExpense = expenseByCategory(transactions);
  let runningTotal = calculateDailyRunningTotal(transactions);

  done(null, {
    totalBalance,
    groupExpense,
    runningTotal
  });
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


function calculateDailyRunningTotal(transactions) {
  let sortedTransactions = _.orderBy(
    transactions, (tran) => moment(tran.Date), 'asc'
  );

  let currentDate;
  let runningTotalSummary = {};

  _.reduce(sortedTransactions, (sum, item) => {
    if(!currentDate || currentDate != item.Date){
      currentDate = item.Date;
    }

    let runningTotal = sum + Number(item.Amount);
    runningTotalSummary[currentDate] = runningTotal;

    return runningTotal;
  }, 0);

  return runningTotalSummary;
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