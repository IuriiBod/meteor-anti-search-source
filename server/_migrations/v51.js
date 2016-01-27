Migrations.add({
  version: 51,
  name: 'Removed old tasks',
  up: function () {
    TaskList.remove({
      sharingType: {
        $exists: true
      }
    });
  }
});