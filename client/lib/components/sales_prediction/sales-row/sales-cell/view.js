
Template.predictionSalesCell.onRendered(function () {
    var menuItemId = FlowComponents.callAction("getItemId")._result;
    var date = moment(FlowComponents.callAction("getItem")._result.date).toDate();

    this.$('.actual-qty').editable({
        type: 'text',
        title: 'Enter actual sale for this item and date',
        display: false,
        showbuttons: true,
        mode: "popup",
        success: function(response, newValue) {
            var pattern=/^[0-9]+$/;
            if(!pattern.test(newValue)){
                alert("Please insert an integer");
            }
            else{
                var area = HospoHero.getCurrentArea();
                var updItem ={
                    quantity: parseInt(newValue),
                    date: date,
                    menuItemId: menuItemId,
                    relations: {
                        organizationId: area.organizationId,
                        locationId: area.locationId,
                        areaId: area._id
                    }
                };
                Meteor.call("updateActualSale", updItem);
            }
        }
    });
});