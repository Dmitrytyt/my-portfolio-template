/* ROOMS LIST
 ------------------------------------------------------------------------------*/
var Contact = (function(){

    var $context          = $( '#contact' ),
        storageKey        = 'userData',
        $callForm         = $( '.contact-order', $context ),
        $form             = $( '.form-order', $context ),
        actionButton      = '.submit-order',
        target            = {},
        sender            = $.extend( true, {}, Sender ),

        init = function (){
            _setUpListens();
            _initSender($form);
        },

        // Init sender
        _initSender = function (activeForm) {
            sender.init({
                storageKey: storageKey,
                context: $callForm,
                form: activeForm,
                target: target,
                actionButtonIcon: 'icon-send-email',
                errorSend: 'errorServerOrder',
                successSend: 'successSendOrder',
                requiredFields: {
                    'userName':'empty',
                    'email':'empty',
                    'phone':'empty',
                    'note':'empty'
                }
            });
        },

        // Listens for events
        _setUpListens = function(){
            $( actionButton, $context ).on( 'click', function(e){
                e.preventDefault();
                target = $( e.target );

                if ( target.hasClass( 'disabled' ) ){
                    return false;
                }

                _initSender( $form );
                var resultValidate = sender.validateForm();

                if( resultValidate === true ){
                    //var defferedObject = _sendData();
                    var defferedObject = sender.sendData();

                    if ( defferedObject ) {
                        //_showResultSend(defferedObject);
                        sender.showResultSend(defferedObject);
                    }
                }
            });

        };

    // Return object (public methods)
    return {
        init: init
    }

})();


$(function() {
    // Call module
    if ( $( '#contact' ).length ) {
        Contact.init();
    }
});