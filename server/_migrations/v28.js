Migrations.add({
  version: 28,
  name: "Remove old notifications",
  up: function () {
    Notifications.remove({interactive: {$ne: true}});
  }
});