Template.areasProgressBar.helpers({
  widthOfBar: function() {
    var progress;
    var self = this;
    var getSpecialArea = function() {
      return self.itemClass === 'garea-filter' ?
          SpecialAreas.find({"generalArea": self.itemId}) : SpecialAreas.findOne({_id: self.itemId});
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
          "specialArea": self.itemId,
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
      var totalCount = 0;
      var progressBar = 0;
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

      var generalArea = GeneralAreas.findOne({_id: self.itemId});
      if (generalArea) {
        getStocks();
      }
      var stocktakes = Stocktakes.find({"version": self.stockTakeData.stockTakeId, "generalArea": self.itemId}).count();
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