Template.figureBoxes.helpers({
  figureBoxesConfigs: function () {


    return [
      {
        main: {
          value: 1234,
          label: 'Sales'
        },
        bottom: {
          label: 'additional',
          value: 34
        },
        percent: {
          value: 15,
          icon: 'fa-chevron-up',
          color: 'text-success'
        },
        helpText: 'someHelp'
      }
    ]
  }
});