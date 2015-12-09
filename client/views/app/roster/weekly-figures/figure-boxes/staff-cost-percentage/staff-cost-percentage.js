Template.staffCostPercentageFigureBox.onRendered(function () {
  this.$('[data-toggle="popover"]').popover({
    content: "The figure shows the % of wages compared to sales. It take the actual results " +
    "from past days and forecasts from future days."
  });
});

Template.staffCostPercentageFigureBox.helpers({
  weeklyStaffWage: function () {
    return this.figureBox.getWages().actual.toFixed(2);
  },

  rosteredStaffWage: function () {
    return this.figureBox.getWages().forecasted.toFixed(2);
  },

  percent: function () {
    return this.figureBox.getPercentDocs().wage;
  }
});
