var successfullyCalibratedMessage = function () {
  sweetAlert("Success!", "Sales item has been successfully calibrated.", "success");
};

Template.salesCalibratedList.events({
  'keyup #dateRange': function(event) {
    var value = $(event.target).val();
    FlowComponents.callAction("keyup", value);
  },

  'submit form': function(event) {
    event.preventDefault();
    var dateRange = $(event.target).find('[name=dateRange]').val();
    var totalRevenue = $(event.target).find('[name=totalRevenue]').val();
    var menus = $(event.target).find('[name=qty]').get();
    var items = [];
    if(menus.length > 0) {
      menus.forEach(function(item) {
        var qty = parseFloat($(item).val());
        var avg = qty/parseFloat(totalRevenue);
        var obj = {
          _id: $(item).attr("data-id"),
          qty: qty,
          avg: avg
        };
        items.push(obj);
      });
    }
    var exist = SalesCalibration.findOne();
    
    if(exist) {
      exist.menus.forEach(function(menu, key) {
        var menuId = menu._id;
        items.forEach(function(item) {
          if (item._id == menuId) {
            exist.menus[key] = {
              _id: menuId,
              qty: item.qty,
              avg: item.avg
            }
          }
        });
      });
      
      Meteor.call("updateSalesCalibration", exist._id, dateRange, totalRevenue, exist.menus, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          successfullyCalibratedMessage();
        }
      });
    } else {
      Meteor.call("createSalesCalibration", dateRange, totalRevenue, items, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          successfullyCalibratedMessage();
        }
      });
    }
  }
});

