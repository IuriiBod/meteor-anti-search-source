Template.predictionSalesRow.onRendered(function () {
    $('.actual-qty').editable({
        type: 'text',
        title: 'Enter actual sale for this item and date',
        display: false,
        showbuttons: true,
        success: function(response, newValue) {
            console.log(parseInt(newValue));
            if(isNaN(parseInt(newValue))){
                alert("Please insert a number");
            }
        }
    });
});