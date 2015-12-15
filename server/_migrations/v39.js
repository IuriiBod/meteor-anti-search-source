//var oldStatuses = [{_id: 'ideas', name: 'ideas'},
//  {
//    _id: 'archived',
//    name: 'archived'
//  },
//  {_id: 'active', name: 'active'}];
//

Migrations.add({
  version: 38,
  name: 'Remove menu items statuses collection',
  up: function () {
    var Statuses = new Mongo.Collection("statuses");

    Statuses.find({}).forEach(function (status) {
      MenuItems.update({status: status._id}, {$set: {status: status.name}}, {multi: true});
    });

    Migrations.utils.removeCollection('statuses');
  }
});