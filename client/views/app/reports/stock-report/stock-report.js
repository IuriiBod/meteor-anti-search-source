Template.stockReport.onCreated(function () {
  this.reports = new ReactiveVar();

  this.firstSelectedDate = new ReactiveVar(false);
  this.secondSelectedDate = new ReactiveVar(false);

  this.detailedReportParams = new ReactiveVar();

  this.uploadNextStockReport = (firstDate = null, secondDate = null, event = false) => {
    let onUploadReportSuccess = (result) => {
      this.reports.set(result);
      if (this.firstSelectedDate.get() === false) {
        this.firstSelectedDate.set(result.firstStocktake.date);
        this.secondSelectedDate.set(result.secondStocktake.date);
      }
    };

    Meteor.call('uploadStockReport', firstDate, secondDate,
      Template.waitButton.handleMethodResult(event, onUploadReportSuccess));
  };

  this.uploadNextStockReport();
});


Template.stockReport.helpers({
  stocktakeIntervalSelectParams: function () {
    let tmpl = Template.instance();
    return {
      firstStocktakeDate: tmpl.firstSelectedDate.get(),
      secondStocktakeDate: tmpl.secondSelectedDate.get(),
      onIntervalSubmit: function (firstDate, secondDate, event) {
        tmpl.uploadNextStockReport(firstDate, secondDate, event);
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
    
    let $eventTarget = $(event.target);
    let stocktakeType = $eventTarget.data('type') || $eventTarget.parent().data('type');
    let firstStocktake = tmpl.reports.get()[stocktakeType];

    let ibox = tmpl.$('.ibox');
    let scrollTo = ibox.offset().top + ibox.height();

    tmpl.detailedReportParams.set({
      stocktakeDate: firstStocktake.date,
      stocktakeTotal: firstStocktake.total
    });

    $('#wrapper').animate({ 'scrollTop': scrollTo }, 1000, 'swing');
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
