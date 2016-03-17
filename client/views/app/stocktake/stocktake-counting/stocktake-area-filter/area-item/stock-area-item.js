Template.stockAreaItem.getStockAreaItemContext = function () {
  let templateData = Template.parentData(1);
  return {
    stockArea: this,
    activeAreas: templateData.activeAreas,
    isEditMode: templateData.isEditMode,
    onStockAreaSelect: templateData.onStockAreaSelect
  }
};

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
    let generalAreaId = tmpl.data.stockArea._id;

    sweetAlert({
      title: "Add new special area",
      text: "Special area name",
      type: "input",
      showCancelButton: true,
      closeOnConfirm: true,
      animation: "slide-from-top",
      inputPlaceholder: "area name"
    }, function (specialAreaName) {
      if (!specialAreaName) {
        HospoHero.error('Name is required!');
        return;
      }

      Meteor.call('createSpecialArea', specialAreaName, generalAreaId, HospoHero.handleMethodResult());
    });
  },

  'click .remove-area-button': function (event, tmpl) {
    event.preventDefault();
    event.stopPropagation();

    let stockArea = tmpl.data.stockArea;
    let confirmation = confirm(`Deleting {stockArea.name}.\nAre you sure?`);
    if (confirmation) {
      let isGeneral = !stockArea.generalAreaId;
      let removeMethodName = isGeneral ? 'deleteGeneralArea' : 'deleteSpecialArea';
      Meteor.call(removeMethodName, stockArea._id, HospoHero.handleMethodResult());
    }
  }
});