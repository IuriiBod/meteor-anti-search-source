const STOCKTAKE_DATE_FORMAT = 'DD-MM-YY';

const getStocktakeDateOptions = (fromDate = false) => {
  let query = {};

  if (fromDate) {
    query.date = {$gt: fromDate};
  }

  return Stocktakes.find(query, {sort: {date: -1}}).map(
    stocktake => {
      let stocktakeDateStr = moment(stocktake.date).format(STOCKTAKE_DATE_FORMAT);
      return {
        value: stocktakeDateStr,
        text: stocktakeDateStr
      };
    }
  );
};


Template.stocktakeIntervalSelect.onCreated(function () {
  this.firstStocktakeDate = new ReactiveVar(false);
  this.secondStocktakeDate = new ReactiveVar(false);
});


Template.stocktakeIntervalSelect.helpers({
  createSelectParams: function (datePropertyName) {
    let tmpl = Template.instance();
    let selectFromDate = datePropertyName !== 'firstStocktakeDate' && (tmpl.firstStocktakeDate.get() || this.firstStocktakeDate);

    let currentValue = tmpl[datePropertyName].get() || this[datePropertyName];

    return {
      values: getStocktakeDateOptions(selectFromDate),
      selected: currentValue,
      onValueChanged: function (newValue) {
        tmpl[datePropertyName].set(newValue);
      },
      emptyValue: '-',
      name: datePropertyName,
      valueAdapter: {
        toValue: function (option) {
          return moment(option, STOCKTAKE_DATE_FORMAT).toDate();
        },
        toOption: function (value) {
          return value && moment(value).format(STOCKTAKE_DATE_FORMAT);
        }
      }
    };
  }
});


Template.stocktakeIntervalSelect.events({
  'click .submit-date-interval-button': function (event, tmpl) {
    event.preventDefault();

    if (_.isFunction(tmpl.data.onIntervalSubmit)) {
      let first = tmpl.firstStocktakeDate.get() || tmpl.data.firstStocktakeDate;
      let second = tmpl.secondStocktakeDate.get() || tmpl.data.secondStocktakeDate;
      tmpl.data.onIntervalSubmit(first, second, event);
    }
  }
});
