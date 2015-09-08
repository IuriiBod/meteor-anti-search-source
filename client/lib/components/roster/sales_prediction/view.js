var random = function (zeros) {
  return Math.floor(Math.random() * Math.pow(10, zeros));
};

var menuItems = [
  'Brisket Special', 'Caramel Banana bread', 'Cupcakes Platter', 'Eton Mess', 'Fudge Brownie - Vegan', 'Muesli'
].map(function (itemName) {
    return {name: itemName, predictedSellCount: random(2)};
  });


Template.salesPrediction.helpers({
  salesPerMenuItem: function () {
    return menuItems;
  }
});

