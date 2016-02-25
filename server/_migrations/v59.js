Migrations.add({
  version: 59,
  name: 'remove current stocks collection',
  up: function () {
    let collectionName = 'currentStocks';
    Migrations.utils.removeCollection(collectionName);
    console.log('Goodbye CurrentStocks!');
  }
});