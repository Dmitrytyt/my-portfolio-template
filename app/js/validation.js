var Validation = (function (){
    var settings = {},
        messages = $.extend(true, {}, Messages),

    init = function( options ){
        settings = $.extend({
            context: {},
            form: {},
            requiredFields: {},
            requiredPoints: {},
            storage: {},
            messages: {},
            nameClassError: 'has-error',
            parentSelector: '.life-form__group-addon',
            parentPointSelector: '.wrap-form',
            formText: 'form-text',
            classActiveOption: 'active-option'
        }, options);
    },

    // Check data from form
    checkFormData = function(data) {
        var result = true;
        removeErrors();

        if( $.isEmptyObject(messages) ){
            return false;
        }

        $.each(data, function(i, val){
            var elem = $( "[name='" + i + "']", settings.form ).eq(0);

            if ( val === null || val.length < 1 ){
                if( settings.requiredFields[i] !== undefined ){
                    showError(elem, messages.getMessageField(settings.requiredFields[i]));
                    result = false;
                    return;
                }
            }

            if ( i === 'phone' && val.length > 0 && !_isPhone(val) ){
                showError(elem, messages.getMessageField('unCorrectPhone'));
                result = false;
            }

            if ( i === 'email' && val.length > 0 &&  !_isValidEmail(val) ){
                showError(elem, messages.getMessageField('notEmail'));
                result = false;
            }

            if ( elem[0].localName === 'select' && parseInt(val) === 0 ){
                if( settings.requiredFields[i] !== undefined ){
                    showError(elem, messages.getMessageField(settings.requiredFields[i]));
                    result = false;
                }
            }

        });

        return result;
    },

    // Check point data form
    checkPoints = function( data ) {
        var result = true;

        $.each( settings.requiredPoints, function( i, val ){
            if( data[i] === undefined || data[i].length < 1 ){
                var elem = $( "[name='" + i + "']", settings.form ).eq(0);
                showError( elem, messages.getMessageField(val), settings.parentPointSelector );
                result = false;
            }
        });

        return result;
    },

    // Set error
    showError = function(elem, textError, parentSelector){
        var selectorParent = ( parentSelector !== undefined ) ? parentSelector : settings.parentSelector;

        if(elem !== undefined){
            elem.closest( selectorParent )
                .addClass( settings.nameClassError )
                .after( '<span class="' + settings.formText + ' text-danger">' + textError + '</span>' );
        }
    },

    removeErrors = function() {
        $( 'span.' + settings.formText, settings.context ).remove( 'span.' + settings.formText );
        $( '.' + settings.nameClassError, settings.context ).removeClass( settings.nameClassError );
    },

    // Clear form
    clearForm = function(storage) {
        $.map(settings.form.serializeArray(), function(n){
            var elem = $( "[name='" + n['name'] + "']", settings.form );

            if( elem[0].localName === 'select' ){
                _clearSelect( elem );
            } else {
                elem.val('');
            }
        });

        if( !$.isEmptyObject( settings.storage ) && storage ){
            settings.storage.clear();
        }
    },

    _clearSelect = function (elem) {
        var selectedElem = $( 'option:selected', elem );

        selectedElem.each(function(){
            this.selected = false;
        });

        selectedElem.removeAttr( 'selected' );
        $( "option:first", elem ).attr( "selected", "selected" );

        elem.removeClass( settings.classActiveOption );
    },

    _isPhone = function (val) {
        var phone = parseInt(val.replace(/\D+/g,""));
        return (''+phone).length >= 5;
    },

    _isValidEmail = function(email, strict) {
        if (!strict) email = email.replace(/^\s+|\s+$/g, '');
        return (/^([a-z0-9_\-]+\.)*[a-z0-9_\-]+@([a-z0-9][a-z0-9\-]*[a-z0-9]\.)+[a-z]{2,4}$/i).test(email);
    };

    return {
        init: init,
        checkFormData: checkFormData,
        checkPoints: checkPoints,
        clearForm: clearForm,
        removeErrors: removeErrors,
        showError: showError
    };

})();

//Validation.init();
