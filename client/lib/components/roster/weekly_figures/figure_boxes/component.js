var component = FlowComponents.define("figureBoxes", function (props) {
  this.figureBox = props.figureBoxDataHelper;
});

component.state.getFigureBoxDataHelper = function () {
  return this.figureBox;
};