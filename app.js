import async from 'async';
import transactionService from './src/services/transactionService';



function run() {
  transactionService.getTransactionInfo((err, result) => {
    if(err) {
      console.log(err);
    }

    console.log(result);
  })
}


run();