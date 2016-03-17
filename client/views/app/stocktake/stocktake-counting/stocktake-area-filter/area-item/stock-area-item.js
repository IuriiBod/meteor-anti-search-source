Template.stockAreaItem.getStockAreaItemContext = function () {
  let templateData = Template.parentData(1);
  return {
    stockArea: this,
    activeAreas: templateData.activeAreas,
    isEditMode: templateData.isEditMode,
    onStockAreaSelect: templateData.onStockAreaSelect
  }
};


Template.stockAreaItem.onCreated(function () {
  console.log(this.data.stockArea.name, this.data);
});

Template.stockAreaItem.helpers({
  isCurrentAreaActive: function () {
    let isSpecial = !!this.stockArea.generalAreaId;
    return this.activeAreas[isSpecial ? 'special' : 'general'] === this.stockArea._id;
  },

  isGeneralStockArea: function () {
    return !this.stockArea.generalAreaId;
  },

  specialAreas: function () {
    return StockAreas.find({generalAreaId: this.stockArea._id, active: true}, {sort: {name: 1}});
  },

  getStockAreaItemContext: Template.stockAreaItem.getStockAreaItemContext
});

Template.stockAreaItem.events({
  'click .select-current-area-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onStockAreaSelect(tmpl.data.stockArea);
  },

  'click .add-special-area-button': function (event, tmpl) {
    event.preventDefault();
    let generalAreaId = tmpl.stockArea._id;

    sweetAlert({
      title: "Add new special area",
      text: "Special area name",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: false,
      animation: "slide-from-top",
      inputPlaceholder: "area name"
    }, function (specialAreaName) {
      if (specialAreaName === false) {
        return false;
      }
      if (specialAreaName === "") {
        sweetAlert.showInputError("You need to write area name!");
        return false
      }

      Meteor.call('createSpecialArea', specialAreaName, generalAreaId, HospoHero.handleMethodResult());
    });
  },

  'click .remove-area-button': function (event, tmpl) {
    event.preventDefault();
    let stockArea = tmpl.data.stockArea;
    let isSpecial = !!sockArea.generalAreaId;

    let removeMethodName = isSpecial ? 'deleteSpecialArea' : 'deleteGeneralArea';
    Meteor.call(removeMethodName, stockArea._id, HospoHero.handleMethodResult());
  }
});