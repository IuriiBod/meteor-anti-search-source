Template.areaBox.helpers({
  activeG: function (id) {
    var garea = Session.get("activeGArea");
    return garea == id;
  },

  activeS: function (id) {
    var sarea = Session.get("activeSArea");
    return sarea == id;
  },

  inActive: function (id) {
    var sarea = Session.get("activeSArea");
    var garea = Session.get("activeGArea");
    return !!((sarea != id) && (garea != id));
  },

  item: function() {
    var area = this.item;
    area.class = this.class;
    area.type = this.name;
    return area;
  },

  editable: function() {
    return Session.get("editStockTake");
  },

  widthOfBar: function() {
    var id = this.item._id;
    if (this.class == "sarea-filter") {
      var sProgress = 0;
      var specialArea = SpecialAreas.findOne(id);
      if (specialArea && specialArea.stocks) {
        if (specialArea.stocks.length > 0) {
          var stocktakes = Stocktakes.find({
            $and: [
              {"stockId": {$in: specialArea.stocks}},
              {"version": Session.get("thisVersion")},
              {"specialArea": id},
              {'generalArea': Session.get("activeGArea")}
            ]
          }).fetch();
          var stocks = Ingredients.find({"_id": {$in: specialArea.stocks}, "status": "active"}).fetch();
          if (stocks && stocks.length > 0) {
            sProgress = (stocktakes.length / stocks.length) * 100;
          }
        }
      }
      return (sProgress + "%");
    } else if (this.class == "garea-filter") {
      var gProgress = 0;
      var totalCount = 0;
      var generalArea = GeneralAreas.findOne(id);
      if (generalArea) {
        var specialAreas = SpecialAreas.find({"generalArea": id}).fetch();
        if (specialAreas && specialAreas.length > 0) {
          specialAreas.forEach(function (doc) {
            if (doc.stocks && doc.stocks.length > 0) {
              var stocks = Ingredients.find({"_id": {$in: doc.stocks}, "status": "active"}).fetch();
              if (stocks && stocks.length > 0) {
                totalCount += stocks.length;
              }
            }
          });
        }
      }

      var stocktakes = Stocktakes.find({"version": Session.get("thisVersion"), "generalArea": id}).fetch();
      if (stocktakes && stocktakes.length > 0) {
        gProgress = (stocktakes.length / totalCount) * 100;
      }
      return (gProgress + "%");
    }
  }
});

Template.areaBox.events({
  'click .garea-filter': function (event) {
    event.preventDefault();
    var id = $(event.target).parent().attr("data-id");
    Session.set("activeGArea", id);
    $(".areaFilering .collapse").removeClass("in");
    var sarea = $(event.target).parent().next().find(".areaBox")[0];
    if (sarea) {
      var sId = $(sarea).attr("data-id");
      Session.set("activeSArea", sId);
    } else {
      Session.set("activeSArea", null);
    }
  },

  'click .sarea-filter': function (event) {
    event.preventDefault();
    var id = $(event.target).parent().attr("data-id");
    Session.set("activeSArea", id);
  },

  'mouseenter .areaBox': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .areaBox': function (event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  },

  'click .removeArea': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    if (type == "garea") {
      Meteor.call("deleteGeneralArea", id, HospoHero.handleMethodResult());
    } else if (type == "sarea") {
      Meteor.call("deleteSpecialArea", id, HospoHero.handleMethodResult());
    }
  }
});