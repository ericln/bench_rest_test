import request from 'request';
import async from 'async';
import _ from 'lodash';

function getPagedTransaction(pageIndex, done) {
  let url = `http://resttest.bench.co/transactions/${pageIndex}.json`;

  request.get(
    url,
    (err, res, body) => {
      if(err || res.statusCode >= 300) {
        return done({
          message: `error getting transaction for page ${pageIndex}`,
          error: err || res.body
        });
      }

      done(null, JSON.parse(res.body));
    }
  )
}

function getAllTransactions(done) {

  let resultPayload;
  let pageIndex = 1;
  let expectedTransactionCount = 0;
  let allTransactions = [];

  async.doWhilst(
    // fn
    (callback) => {
      getPagedTransaction(pageIndex, (err, payload) => {
        if(err) {
          return callback(err);
        }

        pageIndex++;
        resultPayload = _.cloneDeep(payload);
        expectedTransactionCount = payload.totalCount;

        if(resultPayload!=='') {
          allTransactions = allTransactions.concat(payload.transactions);
        }

        callback();
      });
    },
    // test
    () => {
      return expectedTransactionCount !== allTransactions.length;
    },
    // callback
    (err) => {
      if(err) {
        return done(err);
      }

      done(null, allTransactions);
    }
  );
}


export default {
  getPagedTransaction,
  getAllTransactions
}