Migrations.add({
  version: 54,
  name: 'Change weekday name Thurs to Thu in recurring jobs',
  up: function () {
    JobItems.update({repeatOn: 'Thurs'}, {$push: {repeatOn: 'Thu'}});
    JobItems.update({repeatOn: 'Thurs'}, {$pull: {repeatOn: 'Thurs'}});
  }
});