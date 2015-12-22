Template.areaBox.helpers({
  activeGeneralArea: function (id) {
    return this.stockTakeData.activeGeneralArea === id;
  },

  activeSpecialArea: function (id) {
    return this.stockTakeData.activeSpecialArea === id;
  },

  inActiveArea: function (id) {
    var sarea = this.stockTakeData.activeSpecialArea;
    var garea = this.stockTakeData.activeGeneralArea;
    return (sarea !== id) && (garea !== id);
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
    var progress, self = this, itemId = this.item._id;

    var getSpecialArea = function() {
      return self.class === 'garea-filter' ? SpecialAreas.find({"generalArea": itemId}) : SpecialAreas.findOne({_id: itemId});
    };

    var getStocksCount = function(specialArea) {
      return Ingredients.find({"_id": {$in: specialArea.stocks}, "status": "active"}).count();
    };

    var specialAreaProgressBar = function() {
      var progressBar = 0;
      var specialArea = getSpecialArea();
      if (specialArea && specialArea.stocks && specialArea.stocks.length) {
        var stocktakes = Stocktakes.find({
          "stockId": {$in: specialArea.stocks},
          "version": self.stockTakeData.stockTakeId,
          "specialArea": itemId,
          "generalArea": self.stockTakeData.activeGeneralArea
        }).count();
        var stocks = getStocksCount(specialArea);
        if (stocks > 0) {
          progressBar = (stocktakes / stocks) * 100;
        }
      }
      return progressBar;
    };

    var generalAreaProgressBar = function() {
      var totalCount = 0, progressBar = 0;
      var generalArea = GeneralAreas.findOne({_id: itemId});
      if (generalArea) {
        var specialAreas = getSpecialArea();
        if (specialAreas.count() > 0) {
          specialAreas.forEach(function (doc) {
            if (doc.stocks && doc.stocks.length) {
              var stocks = getStocksCount(doc);
              if (stocks > 0) {
                totalCount += stocks;
              }
            }
          });
        }
      }
      var stocktakes = Stocktakes.find({"version": self.stockTakeData.stockTakeId, "generalArea": itemId}).count();
      if (stocktakes > 0) {
        progressBar = (stocktakes / totalCount) * 100;
      }
      return progressBar;
    };

    if (this.class === "sarea-filter") {
      progress = specialAreaProgressBar();
      return (progress + '%');
    } else if (this.class === "garea-filter") {
      progress = generalAreaProgressBar();
      return (progress + "%");
    }
  }
});

Template.areaBox.events({
  'click .garea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeGeneralAreaActive(id);
    $(".areaFilering .collapse").removeClass("in");
    var sarea = $(event.target).parent().next().find(".areaBox")[0];
    if (sarea) {
      var sId = Blaze.getData(sarea).item._id;
      tmpl.data.stockTakeData.makeSpecialAreaActive(sId);
    } else {
      tmpl.data.stockTakeData.makeSpecialAreaActive(null);
    }
  },

  'click .sarea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeSpecialAreaActive(id);
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
    if (type === "garea") {
      Meteor.call("deleteGeneralArea", id, HospoHero.handleMethodResult());
    } else if (type === "sarea") {
      Meteor.call("deleteSpecialArea", id, HospoHero.handleMethodResult());
    }
  }
});