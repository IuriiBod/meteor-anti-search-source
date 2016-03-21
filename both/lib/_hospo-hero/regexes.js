Namespace('HospoHero.regExp', {
    /**
     * Contains all RegExp in app
     *
     */
    escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
    email:/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/,
    password:/^[a-zA-Z0-9]\w{3,14}$/i,
    pin:/^\d{4}$/,
    phone:/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
    numbers:/^\d/,


    /**
     * Return regex that can be added unto html
     * @param {regex} reg
     * @returns {regex}
     */
    toHtmlString: function(reg){
        return /^\/(.+)\/[mgi]{0,3}$/i.exec(reg)[1];
    }
});