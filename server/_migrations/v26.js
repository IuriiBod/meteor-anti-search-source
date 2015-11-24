Migrations.add({
  version: 26,
  name: "Remove old notifications",
  up: function () {
    Notifications.remove({relations: {$ne: null}});
  }
});