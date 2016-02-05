Migrations.add({
  version: 60,
  name: 'remove invitation collection',
  up: function () {
    let collectionName = 'invitations';
    Migrations.utils.removeCollection(collectionName);
    console.log('Goodbye Invitations!');
  }
});