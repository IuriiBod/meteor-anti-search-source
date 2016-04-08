Template.stockReport.onCreated(function () {
  this.reports = new ReactiveVar();

  this.firstSelectedDate = new ReactiveVar(false);
  this.secondSelectedDate = new ReactiveVar(false);

  this.detailedReportParams = new ReactiveVar();

  this.uploadNextStockReport = (firstDate = null, secondDate = null) => {
    Meteor.call('uploadStockReport', firstDate, secondDate, HospoHero.handleMethodResult((result) => {
      this.reports.set(result);
      if (this.firstSelectedDate.get() === false) {
        this.firstSelectedDate.set(result.firstStocktake.date);
        this.secondSelectedDate.set(result.secondStocktake.date);
      }
    }));
  };

  this.uploadNextStockReport();
});


Template.stockReport.helpers({
  stocktakeIntervalSelectParams: function () {
    let tmpl = Template.instance();
    return {
      firstStocktakeDate: tmpl.firstSelectedDate.get(),
      secondStocktakeDate: tmpl.secondSelectedDate.get(),
      onIntervalSubmit: function (firstDate, secondDate) {
        tmpl.uploadNextStockReport(firstDate, secondDate);
      }
    };
  },

  reports: function () {
    return Template.instance().reports.get();
  },

  detailedReportParams() {
    return Template.instance().detailedReportParams.get();
  }
});


Template.stockReport.events({
  'click .stocktake-total': function (event, tmpl) {
    event.preventDefault();

    let stocktakeType = $(event.target).data('type');
    let firstStocktake = tmpl.reports.get()[stocktakeType];

    tmpl.detailedReportParams.set({
      stocktakeDate: firstStocktake.date,
      stocktakeTotal: firstStocktake.total
    });
  },

  'click .difference-text': function (event, tmpl) {
    event.preventDefault();

    const reactiveVarDateToRouteParam = (reactiveDateVar) => moment(reactiveDateVar.get()).format('DD-MM-YY');

    Router.go('stockVarianceReport', {
      firstStocktakeDate: reactiveVarDateToRouteParam(tmpl.firstSelectedDate),
      secondStocktakeDate: reactiveVarDateToRouteParam(tmpl.secondSelectedDate)
    });
  }
});
