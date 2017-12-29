/* SENDER FORMS
 ------------------------------------------------------------------------------*/
var Sender = (function(){
    var settings = {},
        json = {},
        validation    = $.extend(true, {}, Validation),
        messages      = $.extend(true, {}, Messages),

    init = function (options) {
        settings = $.extend({
            storageKey: '',
            context: {},
            form: {},
            target: {},
            json: {},
            actionButtonIcon: 'icon-send',
            loadIcon:  'btn-load fa-spin',
            errorSend: 'errorServer',
            successSend: 'successSend',
            requiredFields: {},
            requiredPoints: {},
            settingsModal:  {},
            autoCloseTime: 10000
        }, options);
    },

    // Init validation object
    _initValidation = function(){
        validation.init({
            context: settings.context,
            form: settings.form,
            requiredFields: settings.requiredFields,
            requiredPoints: settings.requiredPoints
        });
    },

    // Init validation object
    _initMessages = function(){
        messages.init({
            context: settings.context,
            form: settings.form,
            settingsModal: settings.settingsModal
        });
    },

    // Clear form
    clearFrom = function () {
        _initValidation();
        _initMessages();
        validation.removeErrors();
        validation.clearForm(true);
    },

    // Clear form
    clearAnimateFrom = function () {
        _initValidation();
        _initMessages();
        messages.clearAnimateMessage();
    },

    // Check the form for errors
    validateForm = function () {
        _initValidation();
        _initMessages();

        var formData = _getFormData();
        var resultValidate = validation.checkFormData( formData );
        var resultPointValidate = true;

        if( !$.isEmptyObject( settings.requiredPoints ) ){
            resultPointValidate = validation.checkPoints( formData );
        }

        return ( !( resultValidate === false || resultPointValidate === false ) );
    },

    // Sent data
    sendData = function() {
        return $.ajax({
            url:      settings.form.data( 'action' ),
            dataType: "json",
            data:     json,
            type:     'post',
            async:    true,
            beforeSend: function(){
                _showProcess();
            }
        }).fail( function () {
            _showMessageError();
        }).always( function () {
            _hideProcess();
        });
    },

    // Show result send
    showResultSend = function ( response, animate ) {
        response.done( function(answer) {
            var message = answer.message,
                status = answer.status;

            if ( status === 'OK' ){
                validation.clearForm();

                if ( animate === true ){
                    messages.showAnimateMessage( settings.successSend );
                    messages.closeModal( settings.autoCloseTime );
                } else {
                    messages.showMessage( settings.successSend );
                    messages.autoCloseMessage( settings.autoCloseTime );
                }

            } else {
                validation.removeErrors();

                $.each( message, function(i, val) {
                    var elem = $( "[name='" + i + "']", settings.form ).eq(0);
                    validation.showError(elem, val);
                });
            }

        });
    },

    // Show message error
    _showMessageError = function () {
        if ( $.isEmptyObject( settings.settingsModal ) ){
            messages.showMessage( settings.errorSend );
        } else {
            messages.showAnimateMessage( settings.errorSend );
        }
    },

    // Show send process
    _showProcess  = function() {
        settings.target.addClass( 'disabled' );
        $( 'i', settings.target ).removeClass( settings.actionButtonIcon ).addClass( settings.loadIcon );
    },

    // Hide send process
    _hideProcess  = function() {
        settings.target.removeClass( 'disabled' );
        $( 'i', settings.target ).removeClass( settings.loadIcon ).addClass( settings.actionButtonIcon );
    },

    // Get form data
    _getFormData = function() {
        //console.log(settings);
        var data = {};
        $.map(settings.form.serializeArray(), function(n){
            data[n['name']] = n['value'];
        });

        _setData(data);
        return data;
    },

    // Set data from sent
    _setData = function(data) {
        json = data;
    };

    // Return object (public methods)
    return {
        init: init,
        validateForm: validateForm,
        sendData: sendData,
        showResultSend: showResultSend,
        clearFrom: clearFrom,
        clearAnimateFrom: clearAnimateFrom
    }

})();