var component = FlowComponents.define("rosterTable", function (props) {
  this.weekDates = props.weekDates;
  this.figureBoxDataHelper = props.figureBoxDataHelper;
});

component.state.weekDates = function () {
  return this.weekDates;
};

component.state.figureBoxDataHelper = function () {
  return this.figureBoxDataHelper;
};