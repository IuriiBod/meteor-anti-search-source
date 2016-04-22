Migrations.add({
  version: 74,
  name: "Update all zero produced amount of jobs items.",
  up: function () {
    JobItems.update({
      producedAmount: 0
    }, {
      $set: {producedAmount: 1}
    }, {
      multi: true
    });
  }
});