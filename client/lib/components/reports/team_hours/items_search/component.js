var component = FlowComponents.define('teamHoursItemsSearch', function (props) {
  this.onKeyUp = props.onKeyUp;
});

component.action.searchText = function (text) {
  this.onKeyUp(text);
};