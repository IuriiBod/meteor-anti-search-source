var component = FlowComponents.define("schedulingJobsList", function(props) {});

component.state.jobsList = function() {
  return Jobs.find({
    "onshift": null,
    "relations.areaId": HospoHero.getDefaultArea()
  }).fetch();
};