Template.areaBox.helpers({
  activeGeneralArea: function (id) {
    var garea = this.stockTakeData.activeGeneralArea;
    return garea == id;
  },

  activeSpecialArea: function (id) {
    var sarea = this.stockTakeData.activeSpecialArea;
    return sarea == id;
  },

  inActiveArea: function (id) {
    var sarea = this.stockTakeData.activeSpecialArea;
    var garea = this.stockTakeData.activeGeneralArea;
    return !!((sarea != id) && (garea != id));
  },

  item: function() {
    var area = this.item;
    area.class = this.class;
    area.type = this.name;
    return area;
  },

  editable: function() {
    return this.stockTakeData.editableStockTake;
  },

  widthOfBar: function() {
    var id = this.item._id;
    if (this.class == "sarea-filter") {
      var sProgress = 0;
      var specialArea = SpecialAreas.findOne({_id: id});
      if (specialArea && specialArea.stocks) {
        if (specialArea.stocks.length > 0) {
          var stocktakes = Stocktakes.find({
            $and: [
              {"stockId": {$in: specialArea.stocks}},
              {"version": this.stockTakeData.stockTakeId},
              {"specialArea": id},
              {'generalArea': this.stockTakeData.activeGeneralArea}
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
      var generalArea = GeneralAreas.findOne({_id: id});
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

      stocktakes = Stocktakes.find({"version": this.stockTakeData.stockTakeId, "generalArea": id}).fetch();
      if (stocktakes && stocktakes.length > 0) {
        gProgress = (stocktakes.length / totalCount) * 100;
      }
      return (gProgress + "%");
    }
  }
});

Template.areaBox.events({
  'click .garea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.makeGeneralAreaActive(id);
    $(".areaFilering .collapse").removeClass("in");
    var sarea = $(event.target).parent().next().find(".areaBox")[0];
    if (sarea) {
      var sId = $(sarea).attr("data-id");
      tmpl.data.makeSpecialAreaActive(sId);
    } else {
      tmpl.data.makeSpecialAreaActive(null);
    }
  },

  'click .sarea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.makeSpecialAreaActive(id);
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
    var id = this.item._id;
    var type = this.item.type;
    if (type == "garea") {
      Meteor.call("deleteGeneralArea", id, HospoHero.handleMethodResult());
    } else if (type == "sarea") {
      Meteor.call("deleteSpecialArea", id, HospoHero.handleMethodResult());
    }
  }
});