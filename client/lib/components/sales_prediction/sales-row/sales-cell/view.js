var currentLocationId = 1;

Template.predictionSalesCell.onRendered(function () {
    var menuItemId = FlowComponents.callAction("getItemId")._result;
    var date = moment(FlowComponents.callAction("getItem")._result.date).toDate();

    this.$('.actual-qty').editable({
        type: 'text',
        title: 'Enter actual sale for this item and date',
        display: false,
        showbuttons: true,
        success: function(response, newValue) {
            var pattern=/^[0-9]+$/;
            if(!pattern.test(newValue)){
                alert("Please insert an integer");
            }
            else{
                var updItem ={
                    locationId: currentLocationId,
                    quantity: parseInt(newValue),
                    date: date,
                    menuItemId: menuItemId
                };
                Meteor.call("updateActualSale", updItem);
            }
        }
    });
});