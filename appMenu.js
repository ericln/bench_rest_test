import async from 'async';
import util from 'util';
import transactionService from './src/services/transactionService';
import Menu from 'extended-terminal-menu';

let menu = Menu({width: 50, x: 3, y: 2});

function reDrawMenu() {
  menu.reset();
  menu.write('Transaction reports\n');
  menu.write('-------------------------\n');
  menu.add('All');
  menu.add('Total Balance');
  menu.add('Expense by category');
  menu.add('Daily running total');
}

reDrawMenu();

const MENU_ITEM_METHOD_MAP = {
  'All': transactionService.getAllReport,
  'Total Balance': transactionService.getTotalBalance,
  'Expense by category': transactionService.getExpenseByCategory,
  'Daily running total': transactionService.getDailyRunningTotal
};

menu.on('select', function (label) {
  // clear the console
  process.stdout.write('\x1B[2J');

  let func = MENU_ITEM_METHOD_MAP[label];

  if(!func) {
    console.log('Invalid menu selection');
  }

  func((err, result) => {
    if(err) {
      console.log(err);
    }

    console.log(util.inspect(result, false, null));
  });
});


process.stdin.pipe(menu.createStream()).pipe(process.stdout);
process.stdin.setRawMode(true);
menu.on('close', function () {
  process.stdin.setRawMode(false);
  process.stdin.end();
});