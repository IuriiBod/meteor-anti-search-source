Template.stockCounting.events({
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
          var id = $(self).parent().attr("data-id");
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
          var id = $(self).parent().attr("data-id");
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
        var itemId = $(ui.item).attr("data-stockRef");
        var itemPosition = $(ui.item).attr("data-place");
        var nextItemId = $($($(ui.item)[0]).next()).attr("data-id");
        var nextItemPosition = $($($(ui.item)[0]).next()).attr("data-place");
        var prevItemPosition = $($($(ui.item)[0]).prev()).attr("data-place");
        var sareaId = Session.get("activeSArea");

        console.log(".....", itemId);
        console.log(".....", nextItemPosition, prevItemPosition);

        if(!prevItemPosition) {
          prevItemPosition = 0;
        } 
        Meteor.call("stocktakePositionUpdate", itemId, prevItemPosition, nextItemPosition, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            // console.log("......position updated");
            // Meteor.call("specialAreasPositionUpdate", sareaId, itemId, itemPosition, nextItemPosition, function(err) {
            //   if(err) {
            //     console.log(err);
            //     return alert(err.reason);
            //   }
            // });
          }
        });
        // if(!nextItemPosition) {
        //   // nextItemPosition = 
        // }
        

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