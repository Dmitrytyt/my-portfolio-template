/* Init show category
 ------------------------------------------------------------------------------*/
var ShowCategory = (function(){
    var catListElem = $( '#categoryList' ),
        status      = catListElem.css( 'z-index' ),

    init = function() {
        _setState();
    },

    // Set state collapse form search
    _setState = function(){
        if( status === 'auto' ){
            catListElem.addClass( 'in' );
            $( '.header-link', '.header-collapse' ).removeClass( 'collapsed' );
        }
    };

    // Return object (public methods)
    return {
        init: init
    }

})();

$(document).ready(function(){
    // Call module
    if ( $( '#categoryList' ).length ) {
        ShowCategory.init();
    }
});