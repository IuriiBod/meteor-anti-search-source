var component = FlowComponents.define('itemsSearch', function (props) {
  this.onKeyUp = props.onKeyUp;
});

component.action.searchText = function (text) {
  this.onKeyUp(text);
};