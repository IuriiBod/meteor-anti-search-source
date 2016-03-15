Template.areaItem.helpers({
  specialAreas: function () {
    var id = Template.instance().data.area._id;
    return StockAreas.find({generalAreaId: id}, {sort: {name: 1}});
  }
});

Template.areaItem.events({
  'keypress .special-area': function (e, tmpl) {
    if (e.keyCode === 13) {
      var $nameInput = $(e.target);
      var name = $nameInput.val();
      var id = tmpl.data.area._id;
      if (name) {
        Meteor.call('createSpecialArea', name, id, HospoHero.handleMethodResult(function () {
          $nameInput.val('');
          $nameInput.focus();
        }));
      }
    }
  }
});