var removeDatabase = function (dbName) {
  Areas.rawDatabase().dropCollection(dbName, function () {
  });
};

Migrations.add({
  version: 10,
  name: "Remove redundant collection from old forecast",
  up: function () {
    removeDatabase('orderingUnits');
    removeDatabase('usingUnits');
  }
});