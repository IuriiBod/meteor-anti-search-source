Migrations.add({
  version: 63,
  name: 'Remove inactive users, get rid of isActive property',
  up: function () {
    let ids = Meteor.users.find({isActive: false}).map(user => user._id);
    ids.push('MGBaDcpnxwhckt6qL'); //already doesn't exists
    Migrations.utils.removeUserWithRelatedStuff(ids);
    //Meteor.users.remove({_id: {$in: ids}});

    Meteor.users.update({}, {$unset: {isActive: ''}}, {multi: true});
  }
});
