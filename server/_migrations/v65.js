// Maybe we should to make a separate method for quick fix the bug with
// unpublished shifts, if it will be repeat in the future

Migrations.add({
  version: 65,
  name: 'Force shifts publishing',
  up: function () {
  }
});
