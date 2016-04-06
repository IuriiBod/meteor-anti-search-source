Migrations.add({
  version: 71,
  name: "Add new field 'shelfLife' for all ingredients",
  up: function () {
    const defaultShelfLife = 5;

    Ingredients.update({}, {$set: {shelfLife: defaultShelfLife}}, {multi: true});
  }
});