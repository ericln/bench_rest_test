import async from 'async';
import util from 'util';
import transactionService from './src/services/transactionService';

function run() {
  transactionService.getDailyRunningTotal((err, result) => {
    if(err) {
      console.log(err);
    }



    console.log(util.inspect(result, false, null));
  })
}


run();