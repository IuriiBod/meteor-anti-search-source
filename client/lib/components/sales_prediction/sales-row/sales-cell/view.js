
Template.predictionSalesCell.onRendered(function () {
    var menuItemId = FlowComponents.callAction("getItemId")._result;
    var date = moment(FlowComponents.callAction("getItem")._result.date).toDate();
});