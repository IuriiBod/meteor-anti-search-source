Namespace('HospoHero.regexes', {
    /**
     * Contains all regexes in app
     *
     */
    escape:/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
    email:/.+@(.+){2,}\.(.+){2,}/,
    password:/^[a-zA-Z0-9]\w{3,14}$/i,
    pin:/^\d{4}$/,


    /**
     * Return regex that can be added unto html
     * @param {regex} reg
     * @returns {regex}
     */
    toHtmlString: function(reg){
        return /^\/(.+)\/[mgi]{0,3}$/i.exec(reg)[1];
    }
});