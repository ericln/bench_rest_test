import _ from 'lodash';

const STRING_CLEANING_REGS = [
  /(^|\s)xx(\w+)/g,
  /(^|\s)#x(\w+)/g,
  / @/g,
  /\d*\.?\d*(\w+) USD/g
];

/**
 * Clean up the vendor name to be more readable
 * @param transactions transactions that contains duplicate entry
 * @returns {Array} a new instance of transactions with readable vendor name
 */
function readableName(transactions) {
  let cleanTrans = _.map(transactions, (tran) => {
    let newTran = _.cloneDeep(tran);
    newTran.Company = _applyRegExNameCleaning(tran.Company);
    return newTran;
  });
  return cleanTrans;
}

function _applyRegExNameCleaning(name) {
  let resultName = name;
  STRING_CLEANING_REGS.forEach((reg) => {
    resultName = resultName.replace(reg, '');
  });

  return resultName;
}

/**
 * Remove any duplicate transactions
 * @returns {Array} a new instance of transactions without duplicate entry
 */
function removeDuplicate(transactions) {
  return _.uniqWith(transactions, _.isEqual);
}

function applyAllCleanups(transactions) {
  let readableTrans = readableName(transactions);
  let noDupTrans = removeDuplicate(readableTrans);
  return noDupTrans;
}

export default {
  readableName,
  removeDuplicate,
  applyAllCleanups
}


