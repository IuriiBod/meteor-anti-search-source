Template.addNewCategory.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    var nameInput = tmpl.$('.category-name-input');
    var name = nameInput.val();
    if (!name) {
      alert("Category name should have a value");
      return;
    }

    Meteor.call('createCategory', name, HospoHero.handleMethodResult(function () {
      $("#addCategoryModal").modal('hide');
      nameInput.val('');
    }));
  }
});