Template.staffCostFigureBox.onRendered(function () {
    this.$('[data-toggle="popover"]').popover({
        content: "The figure shows the actual staff cost result from the days in the past plus " +
        "the forecast staff cost for the rest of the week. So you can see if you're on track."
    });
});