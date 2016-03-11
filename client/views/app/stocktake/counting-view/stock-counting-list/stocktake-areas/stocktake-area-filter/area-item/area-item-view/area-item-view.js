Template.areaItemView.helpers({
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

Template.areaItemView.events({
  'click .garea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeGeneralAreaActive(id);
    var sarea = SpecialAreas.findOne({generalArea: id}, {sort: {name: 1}});
    if (sarea) {
      tmpl.data.stockTakeData.makeSpecialAreaActive(sarea._id);
    } else {
      tmpl.data.stockTakeData.makeSpecialAreaActive(null);
    }
  },

  'click .sarea-filter': function (event, tmpl) {
    event.preventDefault();
    var id = this.item._id;
    tmpl.data.stockTakeData.makeSpecialAreaActive(id);
  }
});