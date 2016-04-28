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
      (transactions, callback) => calculateBalance(transactions, callback)
    ],
    (err, result) => {
      if(err) {
        return done(err);
      }

      done(null, result);
    }
  )
}

function calculateBalance(transactions, done) {
  console.log(transactions);
  let totalBalance = _.sumBy(transactions, (tran) => {
    return Number(tran.Amount);
  });
  console.log(totalBalance);
  done();
}



export default {
  getTransactionInfo,
  calculateBalance
}