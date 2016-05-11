// context items: (Cursor, Array)

Template.itemsPaletteContent.helpers({
  sortableOptions () {
    return {
      group: {
        name: 'newEvents',
        pull: true,
        put: false
      },

      sort: false,

      onRemove (event) {
        // the Crutch: fixes bug when we drag the same event at the second time
        let draggedItem = event.item;
        $(event.srcElement).append(draggedItem);
      },

      // don't remove empty functions!
      onAdd () {}
    };
  }
});