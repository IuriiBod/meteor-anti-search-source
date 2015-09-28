Meteor.publish("salesPrediction", function() {
    return SalesPrediction.find();
});