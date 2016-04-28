import { assert, expect } from 'chai';
import tranReportService from '../../src/services/transactionReportService';

describe('transactionReportService', ()=> {
  context('given multiple transactions', () => {

    const transactions = [
      {"Date": "2013-12-13", "Amount": "10", "Ledger": "TypeA"},
      {"Date": "2013-12-13", "Amount": "10", "Ledger": "TypeB"},
      {"Date": "2013-12-13", "Amount": "10", "Ledger": "TypeC"},
      {"Date": "2013-12-20", "Amount": "10", "Ledger": "TypeA"},
      {"Date": "2013-12-12", "Amount": "10", "Ledger": "TypeA"},
      {"Date": "2013-12-12", "Amount": "10", "Ledger": "TypeB"},
      {"Date": "2013-12-12", "Amount": "10", "Ledger": "TypeA"},
      {"Date": "2013-12-12", "Amount": "10", "Ledger": "TypeC"}
    ];

    describe('dailyRunningTotal', () => {
      it('running total by day calculated correctly', () => {
        let report = tranReportService.dailyRunningTotal(transactions);
        expect(report['2013-12-12']).to.equal(40);
        expect(report['2013-12-13']).to.equal(70);
        expect(report['2013-12-20']).to.equal(80);
      });

      it('date ordered correctly', () => {
        let report = tranReportService.dailyRunningTotal(transactions);
        let keys = Object.keys(report);

        expect(keys[0]).to.equal('2013-12-12');
        expect(keys[1]).to.equal('2013-12-13');
        expect(keys[2]).to.equal('2013-12-20');
      });
    });

    describe('totalBalance', () => {
      it('correct total calculated', () => {
        let total = tranReportService.totalBalance(transactions);
        expect(total).to.equal(80);
      });
    });

    describe('expenseByCategory', () => {

      it('transaction group by ledger', () => {
        let report = tranReportService.expenseByCategory(transactions);

        expect(report['TypeA'].transactions.length).to.equal(4);
        expect(report['TypeB'].transactions.length).to.equal(2);
        expect(report['TypeC'].transactions.length).to.equal(2);
      });

      it('total expense by ledge calculated correctly', () => {
        let report = tranReportService.expenseByCategory(transactions);

        expect(report['TypeA'].totalExpense).to.equal(40);
        expect(report['TypeB'].totalExpense).to.equal(20);
        expect(report['TypeC'].totalExpense).to.equal(20);
      })
    });
  });
});