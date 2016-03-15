Template.stockAreas.helpers({
  areas: function () {
    return StockAreas.find({generalAreaId: {$exists: false}}, {sort: {createdAt: 1}});
  }
});

Template.stockAreas.events({
  'submit .general-area-form': function (e) {
    e.preventDefault();
    var $generalAreaNameInput = $(e.target);
    var name = $generalAreaNameInput.find('.general-area-name-input').val();
    if (name) {
      Meteor.call('createGeneralArea', name.trim(), HospoHero.handleMethodResult(function () {
        $generalAreaNameInput.find('.general-area-name-input').val('');
      }));
    }
  }
});