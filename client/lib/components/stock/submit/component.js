var component = FlowComponents.define('submitIngredientBody', function (props) {
  var isModal = props.isModal || false;
  this.set('isModal', isModal);

  this.set('unitOrdered', '[unit ordered]');
  this.set('unitUsed', '[unit used]');
});

component.action.changeUnitOrdered = function (unitOrderedNewVal) {
  this.set('unitOrdered', unitOrderedNewVal);
};

component.action.changeUnitUsed = function (unitUsedNewVal) {
  this.set('unitUsed', unitUsedNewVal);
};

component.action.submit = function (event) {

  var fields = [
    'code',
    {
      name: 'name',
      newName: 'description'
    },
    {
      name: 'supplier',
      newName: 'suppliers'
    },
    'unitOrdered',
    'unitUsed',
    {
      name: 'costPerPortion',
      parse: 'float',
      type: 'number'
    },
    {
      name: 'unitSize',
      parse: 'float',
      type: 'number'
    }
  ];

  var info = HospoHero.misc.getValuesFromEvent(event, fields, true);

  if (!info.code) {
    return HospoHero.error("You need to add a code");
  }

  if (!info.description) {
    return HospoHero.error("You need to a description");
  }

  info.costPerPortion = Math.round(info.costPerPortion * 100) / 100;

  Meteor.call("createIngredients", info, HospoHero.handleMethodResult(function () {
    IngredientsListSearch.cleanHistory();
    IngredientsListSearch.search("", {"limit": 10});
  }));
};

component.state.suppliers = function () {
  return Suppliers.find({}, {sort: {"name": 1}});
};