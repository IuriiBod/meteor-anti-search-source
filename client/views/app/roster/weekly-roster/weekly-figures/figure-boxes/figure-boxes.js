Template.figureBoxes.helpers({
  figureBoxesConfigs: function () {
    var visualizePercent = function (declining, subtrahend) {
      var difference = declining - subtrahend;
      var value = (subtrahend !== 0) ? (difference / subtrahend) * 100 : 0;

      var isBad = difference < 0;
      return {
        value: value.toFixed(2),
        color: 'text-' + (isBad ? 'danger' : 'navy'),
        icon: 'fa-angle-' + (isBad ? 'down' : 'up')
      };
    };

    var calculateStaffPercent = function (staffCost, sales) {
      return sales !== 0 ? ((staffCost / sales) * 100).toFixed(2) : 0;
    };

    var formatCurrency = function (amount) {
      return '$' + Math.round(amount).toLocaleString();
    };

    var actualStaffPercent = calculateStaffPercent(this.staff.actual, this.sales.actual);
    var forecastStaffPercent = calculateStaffPercent(this.staff.forecast, this.sales.forecast);

    return [
      {
        main: {
          value: formatCurrency(this.sales.actual),
          label: 'Sales'
        },
        bottom: {
          label: 'Forecast',
          value: formatCurrency(this.sales.forecast)
        },
        percent: visualizePercent(this.sales.actual, this.sales.forecast),
        helpText: "The figure shows the actual sales result from the days in the past plus the forecast sales " +
        "for the rest of the week. So you can see if you're on track."
      },
      {
        main: {
          value: formatCurrency(this.staff.actual),
          label: 'Staff Cost'
        },
        bottom: {
          label: 'Rostered',
          value: formatCurrency(this.staff.forecast)
        },
        percent: visualizePercent(this.staff.forecast, this.staff.actual),
        helpText: "The figure shows the actual staff cost result from the days in the past plus " +
        "the forecast staff cost for the rest of the week. So you can see if you're on track."
      },
      {
        main: {
          value: actualStaffPercent + '%',
          label: 'Staff Cost'
        },
        bottom: {
          label: 'Rostered',
          value: forecastStaffPercent + '%'
        },
        percent: visualizePercent(forecastStaffPercent, actualStaffPercent),
        helpText: "The figure shows the % of wages compared to sales. It take the actual results " +
        "from past days and forecasts from future days."
      }
    ];
  }
});