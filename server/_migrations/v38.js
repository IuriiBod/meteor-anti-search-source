Migrations.add({
  version: 38,
  name: "Remove shift updates",
  up: function () {
    Migrations.utils.removeCollection('shiftUpdates');
  }
});
