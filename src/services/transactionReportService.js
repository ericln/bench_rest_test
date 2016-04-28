import _ from 'lodash';
import moment from 'moment';

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


function dailyRunningTotal(transactions) {
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

function totalBalance(transactions) {
  let totalBalance = _.sumBy(transactions, (tran) => {
    return Number(tran.Amount);
  });

  return totalBalance;
}

export default {
  expenseByCategory,
  dailyRunningTotal,
  totalBalance
}