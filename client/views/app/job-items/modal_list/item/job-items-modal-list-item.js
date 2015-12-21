Template.jobItemListed.onRendered(function () {
  var self = this;
  $('.i-checks.selected-Prep').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });

  $('input.selectedPrep').on('ifChecked', function () {
    var id = $(this).attr("data-id");
    if (self.data.name == "addPrep") {
      var localId = Session.get("localId");

      var localMenuItem = LocalMenuItem.findOne(localId);
      if (localMenuItem) {
        LocalMenuItem.update({"_id": localId}, {$addToSet: {"preps": id}});
      }
    }
  });
});

Template.jobItemListed.helpers({
  item: function () {
    return Template.instance().data.jobitem;
  },

  costPerPortion: function () {
    var prep = getPrepCost(Template.instance().data._id);
    if (prep) {
      return prep.prepCostPerPortion;
    }
  }
});