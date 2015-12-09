Template.stockCounting.helpers({
  editable: function() {
    return Session.get('editStockTake');
  },

  //ordersExist: function() {
  //  var ordersExist = Stocktakes.findOne({
  //    "version": Session.get("thisVersion"),
  //    "status": true
  //  });
  //  return !!ordersExist;
  //},

  version: function() {
    return Session.get('editStockTake');
  },

  specialArea: function() {
    return Session.get("activeSArea");
  },

  generalArea: function() {
    return Session.get("activeGArea");
  },

  stocktakeList: function() {
    var thisVersion = Session.get("thisVersion");
    var gareaId = Session.get("activeGArea");
    var sareaId = Session.get("activeSArea");

    if (gareaId && sareaId) {
      var main = StocktakeMain.findOne(thisVersion);
      if (main && main.hasOwnProperty("orderReceipts") && main.orderReceipts.length > 0) {
        var stocktakes = Stocktakes.find({
          "version": thisVersion,
          "generalArea": gareaId,
          "specialArea": sareaId
        }, {sort: {"place": 1}});
        if (stocktakes) {
          return stocktakes;
        }
      }
    }
  },

  ingredientsList: function() {
    var thisVersion = Session.get("thisVersion");
    var gareaId = Session.get("activeGArea");
    var sareaId = Session.get("activeSArea");
    if (gareaId && sareaId) {
      var sarea = SpecialAreas.findOne(sareaId);
      var ings = [];
      if (sarea && sarea.stocks.length > 0) {
        var ids = sarea.stocks;
        ids.forEach(function (id) {
          if (id) {
            var item = Ingredients.findOne({"_id": id, "status": "active"});
            if (item) {
              ings.push(item);
            }
          }
        });
        return ings;
      }
    }
  },

  stocktakeMain: function() {
    return StocktakeMain.findOne(Session.get("thisVersion"));
  },

  filtered: function() {
    return Session.get("activeSArea");
  },

  notTemplate: function() {
    var main = StocktakeMain.findOne(Session.get("thisVersion"));
    var permitted = false;
    if (main) {
      if (main.hasOwnProperty("orderReceipts") && main.orderReceipts.length > 0) {
        permitted = true;
      }
    }
    return permitted;
  }
});

Template.stockCounting.events({
  'click .saveStockTake': function (event) {
    event.preventDefault();
    Session.set("editStockTake", false);
    $(event.target).hide();
    $(".editStockTake").show();
  },

  'click .addStock': function (event) {
    event.preventDefault();
    $("#stocksListModal").modal("show");
  },

  'click .editStockTake': function (event) {
    event.preventDefault();
    Session.set("editStockTake", true);
    $(event.target).hide();
    setTimeout(function () {
      $(".sarea").editable({
        type: "text",
        title: 'Edit Special area name',
        showbuttons: false,
        mode: 'inline',
        success: function (response, newValue) {
          var self = this;
          var id = $(self).attr("data-id");
          if (newValue) {
            Meteor.call("editSpecialArea", id, newValue, HospoHero.handleMethodResult());
          }
        }
      });

      $(".garea").editable({
        type: "text",
        title: 'Edit General area name',
        showbuttons: false,
        mode: 'inline',
        success: function (response, newValue) {
          var self = this;
          var id = $(self).attr("data-id");
          if (newValue) {
            Meteor.call("editGeneralArea", id, newValue, HospoHero.handleMethodResult());
          }
        }
      });

      $(".sortableStockItems").sortable({
        stop: function (event, ui) {
          var stocktakeId = $(ui.item).attr("data-stockRef");
          var stockId = $(ui.item).attr("data-id");
          var itemPosition = $(ui.item).attr("data-place");

          var nextItemId = $($($(ui.item)[0]).next()).attr("data-id");
          var nextItemPosition = $($($(ui.item)[0]).next()).attr("data-place");
          var prevItemId = $($($(ui.item)[0]).prev()).attr("data-id");
          var prevItemPosition = $($($(ui.item)[0]).prev()).attr("data-place");

          var sareaId = Session.get("activeSArea");
          if (!prevItemPosition) {
            prevItemPosition = 0;
          }

          var info = {
            "nextItemId": nextItemId,
            "prevItemId": prevItemId
          };
          if (nextItemPosition) {
            info['nextItemPosition'] = nextItemPosition
          }

          if (prevItemPosition) {
            info['prevItemPosition'] = prevItemPosition
          }
          Meteor.call("stocktakePositionUpdate", stocktakeId, stockId, sareaId, info, HospoHero.handleMethodResult());
        }
      });
    }, 10);

  },

  'click .generateOrders': function (event) {
    event.preventDefault();
    Session.set("editStockTake", false);
    var version = Session.get("thisVersion");
    if (version) {
      Meteor.call("generateOrders", version, HospoHero.handleMethodResult(function () {
        Router.go("stocktakeOrdering", {"_id": version})
      }));
    }
  }
});