Template.posSettings.onCreated(function () {
  this.posSystemTypes = ['Revel'];
  this.locationDoc = Template.currentData().locationDoc;

  var currentPosType;
  if (this.locationDoc.pos && this.locationDoc.pos.type) {
    currentPosType = this.locationDoc.pos.type;
  } else {
    currentPosType = this.posSystemTypes[0];
  }
  this.currentPosSystemName = new ReactiveVar(currentPosType);
});

Template.posSettings.helpers({
  posSystemTypes: function () {
    return Template.instance().posSystemTypes;
  },
  currentPosSystemName: function () {
    return Template.instance().currentPosSystemName.get();
  },
  isCurrentPosSystem: function (posSystemName) {
    return Template.instance().currentPosSystemName.get() === posSystemName;
  },
  posSettings: function () {
    return Template.instance().locationDoc.pos || {};
  }
});

Template.posSettings.events({
  'change select[name="posSystems"]': function (event, tmpl) {
    tmpl.currentPosSystem.set(event.target.value);
  }
});