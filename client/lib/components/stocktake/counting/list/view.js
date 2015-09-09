Template.stockCounting.events({
  'click .saveStockTake': function(event) {
    event.preventDefault();
    Session.set("editStockTake", false);
    $(event.target).hide();
    $(".editStockTake").show();
  },

  'click .addStock': function(event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .editStockTake': function(event) {
    event.preventDefault();
    Session.set("editStockTake", true);
    $(event.target).hide();
    setTimeout(function() {
      $(".sarea").editable({
        type: "text",
        title: 'Edit Special area name',
        showbuttons: false,
        mode: 'inline',
        success: function(response, newValue) {
          var self = this;
          var id = $(self).attr("data-id");
          if(newValue) {
            Meteor.call("editSpecialArea", id, {"name": newValue}, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
          }
        }
      });    

      $(".garea").editable({
        type: "text",
        title: 'Edit General area name',
        showbuttons: false,
        mode: 'inline',
        success: function(response, newValue) {
          var self = this;
          var id = $(self).attr("data-id");
          if(newValue) {
            Meteor.call("editGeneralArea", id, {"name": newValue}, function(err) {
              if(err) {
                console.log(err);
                return alert(err.reason);
              }
            });
          }
        }
      });
    }, 10);

    $(".sortableStockItems").sortable({
      stop: function(event, ui) {
        var stocktakeId = $(ui.item).attr("data-stockRef");
        var stockId = $(ui.item).attr("data-id");
        var itemPosition = $(ui.item).attr("data-place");

        var nextItemId = $($($(ui.item)[0]).next()).attr("data-id");
        var nextItemPosition = $($($(ui.item)[0]).next()).attr("data-place");
        var prevItemId = $($($(ui.item)[0]).prev()).attr("data-id");
        var prevItemPosition = $($($(ui.item)[0]).prev()).attr("data-place");

        var sareaId = Session.get("activeSArea");
        if(!prevItemPosition) {
          prevItemPosition = 0;
        } 

        var info = {
          "nextItemId": nextItemId,
          "prevItemId": prevItemId
        }
        if(nextItemPosition) {
          info['nextItemPosition'] = nextItemPosition
        }

        if(prevItemPosition) {
          info['prevItemPosition'] = prevItemPosition
        }
        Meteor.call("stocktakePositionUpdate", stocktakeId, stockId, sareaId, info, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } 
        });
      }
    });
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