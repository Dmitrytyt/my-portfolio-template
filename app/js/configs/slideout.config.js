$( document ).ready(function() {
    // Init Slideout.js
    var slideOut = new Slideout({
        'panel': document.getElementById( 'mainContent' ),
        'menu': document.getElementById( 'sladeMenu' ),
        'padding': 256,
        'tolerance': 70
    });

    $( '.toggle-button' ).on('click', function() {
        slideOut.toggle();
    });

});