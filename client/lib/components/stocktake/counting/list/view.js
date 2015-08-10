Template.stockCounting.events({
  'click .addStock': function(event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .editStockTake': function(event) {
    event.preventDefault();
    Session.set("editStockTake", true);
    $(event.target).hide();
  },

  'click .generateOrders': function(event) {
    event.preventDefault();
    Session.set("editStockTake", false);
    var version = Session.get("thisVersion");
    if(version) {
      Meteor.call("generateOrders", version, function(err, result) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("stocktakeOrdering", {"_id": version})
        }
      });
    }
  }
});

Template.stockCounting.rendered = function() {
  Tracker.autorun(function() {
    if(Session.get("editStockTake")) {
      $('#newStocktakeDate').editable({
        type: "combodate",
        title: "Select date",
        mode: "inline",
        format: 'YYYY-MM-DD',    
        viewformat: 'YYYY-MM-DD',    
        template: 'YYYY-MM-DD',    
        combodate: {
          minYear: 2000,
          maxYear: 2020,
          minuteStep: 1
        },
        success: function(response, newValue) {
          console.log("...........", newValue);
        }
      });
    }
  });
}