var removeDatabase = function (dbName) {
    Areas.rawDatabase().dropCollection(dbName, function () {
    });
};

Migrations.add({
    version: 12,
    name: "Added DailySales, removed ImportedActualSales, predictionSales",
    up: function () {
        removeDatabase('importedActualSales');
        removeDatabase('predictionSales');
    }
});