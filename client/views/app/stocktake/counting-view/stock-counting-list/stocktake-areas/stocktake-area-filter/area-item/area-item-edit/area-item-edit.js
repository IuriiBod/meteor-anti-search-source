Template.areaItemEdit.onRendered(function() {
  var self = this.data;
  this.$(".area").editable({
    type: "text",
    title: 'Edit area name',
    showbuttons: false,
    display: false,
    mode: 'inline',
    success: function (response, newValue) {
      var id = self.item._id;
      if (newValue) {
        if(self.itemClass === 'sarea-filter') {
          Meteor.call("editSpecialArea", id, newValue, HospoHero.handleMethodResult());
        } else {
          Meteor.call("editGeneralArea", id, newValue, HospoHero.handleMethodResult());
        }
      }
    }
  });
});

Template.areaItemEdit.helpers({
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

  widthOfBar: function() {
    var progress, self = this, itemId = this.item._id;
    var getSpecialArea = function() {
      return self.itemClass === 'garea-filter' ? SpecialAreas.find({"generalArea": itemId}) : SpecialAreas.findOne({_id: itemId});
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
      var getStocks = function() {
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
      };

      var generalArea = GeneralAreas.findOne({_id: itemId});
      if (generalArea) {
        getStocks();
      }
      var stocktakes = Stocktakes.find({"version": self.stockTakeData.stockTakeId, "generalArea": itemId}).count();
      if (stocktakes > 0) {
        progressBar = (stocktakes / totalCount) * 100;
      }
      return progressBar;
    };

    if (this.itemClass === "sarea-filter") {
      progress = specialAreaProgressBar();
      return (progress + '%');
    } else if (this.itemClass === "garea-filter") {
      progress = generalAreaProgressBar();
      return (progress + "%");
    }
  }
});

Template.areaItemEdit.events({
  'click .garea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeGeneralAreaActive(id);
    var sarea = SpecialAreas.findOne({generalArea: id}, {sort: {name: 1}});
    if (sarea) {
      tmpl.data.stockTakeData.makeSpecialAreaActive(sarea._id);
    } else {
      tmpl.data.stockTakeData.makeSpecialAreaActive(null);
    }
  },

  'click .sarea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeSpecialAreaActive(id);
  },

  'click .removeArea': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    var itemType = tmpl.data.itemType;
    if (itemType === "garea") {
      Meteor.call("deleteGeneralArea", id, HospoHero.handleMethodResult());
    } else if (itemType === "sarea") {
      Meteor.call("deleteSpecialArea", id, HospoHero.handleMethodResult());
    }
  }
});