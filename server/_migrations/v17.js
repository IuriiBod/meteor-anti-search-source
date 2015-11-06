var migrationFn = function () {
  var colors = [
    'rgb(97, 189, 79)',
    'rgb(242, 214, 0)',
    'rgb(255, 171, 74)',
    'rgb(235, 90, 70)',
    'rgb(195, 119, 224)',
    'rgb(0, 121, 191)',
    'rgb(0, 194, 224)',
    'rgb(81, 232, 152)',
    'rgb(255, 128, 206)',
    'rgb(77, 77, 77)',
    'rgb(182, 187, 191)'
  ];

  Areas.find().forEach(function(area, index) {
    index = index % colors.length;
    var color = colors[index];
    Areas.update({
      _id: area._id
    }, {
      $set: {
        color: color
      }
    });
  });
};


Migrations.add({
  version: 17,
  name: "Adding area colors",
  up: migrationFn
});
