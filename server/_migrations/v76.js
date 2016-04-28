Migrations.add({
  version: 76,
  name: "Change field 'tel' for 'phone' in user profile.",
  up: function () {
    Meteor.users.find({'profile.tel':{ $exists: true }}).forEach((user) => {
      Meteor.users.update({_id:user._id}, { $set:{ 'profile.phone':user.profile.tel },  $unset: { 'profile.tel': user.profile.tel } });
    });
  }
});