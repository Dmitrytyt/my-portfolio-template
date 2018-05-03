$( document ).ready(function() {
    // Init lazyLoad
    var myLazyLoad = new LazyLoad();

    // Top menu
    $( '.top-menu__nav-item' ).hover(
        function(){
            $( '.submenu .sub-nav' )
                .addClass('invisible')
                .css('transition', 'none')
                .css('opacity', '0');

            $( '.header .top-menu__nav-item_active' )
                .css('background-color', 'inherit');
        },
        function(){
            $( '.submenu .sub-nav' )
                .css('opacity', '1')
                .css('transition', 'opacity 0s 1s')
                .removeClass('invisible');

            $( '.header .top-menu__nav-item_active' )
                .css('background-color', '#7cb803');
        }
    );

    // Init phone number mask
    var inputElement = $( '.phone-input' );
    inputElement.each(function(index, element){
        var cleave = new Cleave( element, {
            phone: true,
            phoneRegionCode: 'RU',
            delimiter: '-'
        });
    });


    // Remove error from input
    $( 'input, textarea, select' ).focusin( function(){
        var target = $( this ),
            wrap = target.closest( '.wrap-form' );

        if ( wrap.length === 0 ){
            return false;
        }

        var help  = $( 'span.form-text, .help-block', wrap );
        $( '.has-error', wrap ).removeClass( 'has-error' );

        help.fadeOut(300, function() {
            help.remove( 'span.form-text' );
            help.text( '' ).css('display', 'block');
        });
    });
});
