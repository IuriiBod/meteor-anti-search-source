Namespace('HospoHero.regExp', {
  /**
   * Contains all RegExp in app
   *
   */
  escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
  email: /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/,
  password: /^[a-zA-Z0-9]\w{3,14}$/i,
  pin: /^\d{4}$/,
  phone: /^[0-9]{0,20}/,
  numbers: /^\d/,
  dateMdDdYyyy: /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,
  mentionRegExp:/(?:^|\W)@(\w+)(?!\w)/g,


  /**
   * Return regex that can be added unto html
   * @param {regex} reg
   * @returns {regex}
   */
  toHtmlString: function (reg) {
    return /^\/(.+)\/[mgi]{0,3}$/i.exec(reg)[1];
  }
});