var currentLocationId = 1;

Template.predictionSalesRow.onRendered(function () {
    $('.actual-qty').editable({
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
                var menuItemId = $(this).attr("data-menuId");
                var date = moment($(this).attr("data-date")).toDate();
                var updItem ={
                    locationId: currentLocationId,
                    quantity: newValue,
                    date: date,
                    menuItemId: menuItemId
                };
                Meteor.call("updateActualSale", updItem);
                //console.log(ImportedActualSales.find({date: TimeRangeQueryBuilder.forDay(date), menuItemId: menuItemId}).fetch());
            }
        }
    });
});