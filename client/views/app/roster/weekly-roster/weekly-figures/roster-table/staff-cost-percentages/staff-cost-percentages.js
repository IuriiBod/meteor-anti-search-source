Template.staffCostPercentagesTr.helpers({
  percentages: function () {
    var calculatePercentage = function (staffAmount, salesAmount) {
      return salesAmount !== 0 ? (staffAmount / salesAmount ) * 100 : 0;
    };

    var forecast = calculatePercentage(this.staff.forecast, this.sales.forecast);
    var actual = calculatePercentage(this.staff.actual, this.sales.actual);

    return {
      forecast: forecast,
      actual: actual,
      statusClass: 'text-' + (actual <= forecast ? 'info' : 'danger')
    };
  }
});
