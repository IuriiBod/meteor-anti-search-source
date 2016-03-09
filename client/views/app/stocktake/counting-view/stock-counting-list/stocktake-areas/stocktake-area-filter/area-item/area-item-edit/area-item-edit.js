Template.areaItemEdit.onRendered(function() {
  var tmpl = this;
  var onCountChanged = function (response, newValue) {
    var id = tmpl.data.item._id;
    if (newValue) {
      if(tmpl.data.itemClass === 'sarea-filter') {
        Meteor.call("editSpecialArea", id, newValue, HospoHero.handleMethodResult());
      } else {
        Meteor.call("editGeneralArea", id, newValue, HospoHero.handleMethodResult());
      }
    }
  };

  this.$(".area").editable({
    type: "text",
    title: 'Edit area name',
    showbuttons: false,
    display: false,
    mode: 'inline',
    success: onCountChanged
  });
});

Template.areaItemEdit.helpers({
  areas: function () {
    var itemId = this.item._id;
    var currentActiveGeneralArea = this.stockTakeData.activeGeneralArea;
    var currentActiveSpecialArea = this.stockTakeData.activeSpecialArea;
    return {
      activeGeneralArea: currentActiveGeneralArea === itemId,
      activeSpecialArea: currentActiveSpecialArea === itemId,
      inActiveArea: (currentActiveSpecialArea !== itemId) && (currentActiveGeneralArea !== itemId)
    };
  }
});

Template.areaItemEdit.events({
  'click .garea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeGeneralAreaActive(id);
    var sarea = SpecialAreas.findOne({generalArea: id}, {sort: {name: 1}});
    tmpl.data.stockTakeData.makeSpecialAreaActive(sarea && sarea._id || null);
  },

  'click .sarea-filter': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.stockTakeData.makeSpecialAreaActive(this.item._id);
  },

  'click .removeArea': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.item._id;
    var itemClass = tmpl.data.itemClass;
    if (itemClass === "garea-filter") {
      Meteor.call("deleteGeneralArea", id, HospoHero.handleMethodResult());
    } else if (itemClass === "sarea-filter") {
      Meteor.call("deleteSpecialArea", id, HospoHero.handleMethodResult());
    }
  }
});