FigureBox  = function FigureBox() {};

FigureBox.prototype.calcSalesCost = function(sales, actualOrPrediction) {
    var totalCost = 0;
    if(sales && sales.length > 0 && !!MenuItems.findOne()) {
        _.each(sales, function (item) {
            var quantity = 0;

            switch (actualOrPrediction) {
                case 'actual': quantity = item.actualQuantity; break;
                case 'prediction': quantity = item.predictionQuantity; break;
            }

            var price = 0;

            var menuItem = MenuItems.findOne({_id: item.menuItemId});
            if(menuItem && menuItem.salesPrice) {
                price = menuItem.salesPrice;
            }

            totalCost += quantity * price;
        });
    }
    return totalCost;
};

FigureBox.prototype.calcStaffCost = function(shifts){
    var totalCost = 0;
    if (shifts && shifts.length > 0) {
        _.each(shifts, function (shift) {
            var user = Meteor.users.findOne({_id: shift.assignedTo});
            if (user && user.profile && user.profile.payrates) {
                var day = moment(shift.shiftDate).format("dddd");
                var rate = 0;
                var totalhours = 0;

                if (shift.status == "draft" || shift.status == "started") {
                    totalhours = moment(shift.endTime).diff(moment(shift.startTime), "h");
                } else {
                    totalhours = moment(shift.finishedAt).diff(moment(shift.startedAt), "h");
                }
                if (day) {
                    if (day == "Saturday") {
                        if (user.profile.payrates.saturday) {
                            rate = user.profile.payrates.saturday;
                        }
                    } else if (day == "Sunday") {
                        if (user.profile.payrates.sunday) {
                            rate = user.profile.payrates.sunday;
                        }
                    } else {
                        if (user.profile.payrates.weekdays) {
                            rate = user.profile.payrates.weekdays;
                        }
                    }
                }
                if (totalhours > 0) {
                    totalCost += rate * totalhours;
                }
            }
        });
    }
    return totalCost;
};

FigureBox.prototype.percent = function (declining, subtrahend) {
    var doc = {
        "value": 0,
        "textColor": "text-navy",
        "icon": "fa-angle-up"
    };

    var diff = parseFloat(declining) - parseFloat(subtrahend);
    doc.value = ((diff / parseFloat(declining)) * 100);
    doc.value = !isNaN(doc.value) ? doc.value.toFixed(2) : 0;
    if (diff < 0) {
        doc.textColor = "text-danger";
        doc.icon = "fa-angle-down";
    }
    return doc;
};

