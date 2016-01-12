Template.referenceSelector.onRendered(function () {
  this.$('.reference-selector').select2({
    placeholder: "Select a reference",
    allowClear: true
  });
});


Template.referenceSelector.helpers({
  menuItems: function () {
    return MenuItems.find().fetch();
  },

  jobItems: function () {
    return JobItems.find().fetch();
  },

  suppliers: function () {
    return Suppliers.find().fetch();
  }
});