var actionList = (function(){

    var catalog = $( '.catalog-list' ),
    dataUrl = '/account/list/status';

    var init = function (){
        _setUpListens();
    };

    // Listens for events
    var _setUpListens = function(){
        $( 'body' ).on( 'click', function(e){
            _setElem(e);
        });
    };

    // Set click elem
    var _setElem = function(e){

        var targetElem = $( e.target );

        if ( targetElem.is( ".list-header__view-list a" ) ){
            e.preventDefault();
            targetElem = targetElem.children();
        }

        if ( targetElem.is( ".icon-list" ) ){
            _showFullList(e);
            return;
        }

        if ( targetElem.is( ".icon-tile" ) ){
            _showTile(e);
        }
    };

    // Show full list
    var _showFullList = function(e) {
        //_sendStatus(0);
        _resetState();
        _addState(e);
    };

    // Show tile
    var _showTile = function(e){
        //_sendStatus(1);
        _resetState();
        _addState(e);

        catalog.addClass( 'catalog-list_tile' );
    };

    var _resetState = function(){
        catalog.removeClass( 'catalog-list_tile' );
        var active = $( '.list-header_active', '.list-header__view-list');
        active.removeClass( 'list-header_active' );
    };

    var _addState = function(e){
        var targetElem = $( e.target );

        if(targetElem.is( "i" )){
            targetElem.closest( 'a' ).addClass( 'list-header_active' );
            return;
        }

        targetElem.addClass( 'list-header_active' );
    };

    var _sendStatus = function(status){
        $.ajax({
            url: dataUrl,
            data: {status:status},
            cache: false,
            dataType : "html"
        });
    };

    // Return object (public methods)
    return {
        init: init
    }

})();

// Call module actionList
if( $( '.list-header__view-list' ).length ){
    actionList.init();
}