/**
 * The list of messages
 */
var Messages = (function(){
    var settings = {},
        modal    = {},
        defaultModalSelector = '#messageScreen',
        defaultMessageSelector ='.message',
        defaultCloseButton = '.closebt',
        statusEvent = false,

    init = function ( options ){
        settings = $.extend({
            supportEmail:    'turchenko-dm@ya.ru',
            modalSelector:   defaultModalSelector,
            messageSelector: defaultMessageSelector,
            closeButton:     defaultCloseButton,
            context: {},
            form: {},
            settingsModal: {}
        }, options);

        _setUpListens();
    },

    // Listens for events
    _setUpListens = function(){
        if( statusEvent === true || defaultModalSelector !== settings.modalSelector ){
            return;
        }

        $( defaultCloseButton, defaultModalSelector ).on( 'click', function(e){
            e.preventDefault();
            hideMessage();
        });
        statusEvent = true;
    },

    // Show message
    showMessage = function (name) {
        var messageData = getMessage(name),
            messageText = _tempMessage(messageData);

        $( 'body, html' ).css({'overflow':'hidden'});
        $( settings.messageSelector, settings.modalSelector ).html( messageText );
        $( settings.modalSelector ).fadeIn('300');
    },

    // Clear message
    hideMessage = function() {
        $( settings.modalSelector ).fadeOut('300', function(){
            $( 'body, html' ).css({'overflow':'visible'});
            $( settings.messageSelector, settings.modalSelector ).empty();
        });
    },

    // Close ModalJs
    autoCloseMessage = function(ms){
        setTimeout( function() {
            hideMessage();
        }, ms);
    },

    // Show message
    showAnimateMessage = function (name) {
        if( $.isEmptyObject( settings.form ) ){
            return false;
        }

        var messageData = getMessage(name),
            messageText = _tempMessage(messageData);

        settings.form.addClass( 'hidden-xs-up' );
        $( settings.messageSelector, settings.context ).removeClass( 'hidden-xs-up' ).html( messageText );
    },

    // Clear message
    clearAnimateMessage = function() {
        if( $.isEmptyObject( settings.form ) ){
            return false;
        }

        settings.form.removeClass( 'hidden-xs-up' );
        $( settings.messageSelector, settings.context ).addClass( 'hidden-xs-up' ).html('');
    },

    // Close ModalJs
    closeModal = function(ms){
        if( $.isEmptyObject( settings.settingsModal ) ){
            return false;
        }

        setTimeout( function() {
            $( 'body, html' ).css( { 'overflow':'auto' } );
            modal = $( '#' + settings.settingsModal.target );

            if ( modal.hasClass( settings.settingsModal.target + '-on' ) ) {
                modal.removeClass( settings.settingsModal.target + '-on' );
                modal.addClass( settings.settingsModal.target + '-off' );
            }

            if ( modal.hasClass( settings.settingsModal.target + '-off' ) ) {
                modal.removeClass( settings.settingsModal.animatedIn );
                modal.addClass( settings.settingsModal.animatedOut );
                modal.one( 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', _afterCloseModal );
            }

        }, ms);
    },

    _afterCloseModal = function(){
        modal.css({
            "z-index":settings.settingsModal.zIndexOut,
            "opacity":settings.settingsModal.opacityOut
        });

        $( settings.animatedSelector ).hide();
        clearAnimateMessage();
    },

    getMessage = function(key){
        var list = _list();
        return list[key];
    },

    getMessageField = function(key){
        var list = _list();
        return list.field[key];
    },

    // Template message
    _tempMessage = function(message){
        return '<span class="title">' + message.title + '</span><br>' +
            '<span class="item">' + message.text + '</span>';
    },

    _list = function () {
        return {
            errorSend: {
                title: 'Ошибка!',
                text:  'Мы не смогли отправить вашу информацию. ' + _getAsk()
            },
            successSend: {
                title: 'Спасибо!',
                text:  'Ваша информация успешно отправлена. '
            },
            successSendOrder: {
                title: 'Спасибо!',
                text:  'Ваша заявка отправлена. '
            },
            errorServerOrder: {
                title: 'Ошибка!',
                text:  'Мы не смогли отправить вашу заявку. ' + _getAsk()
            },
            field: {
                empty: 'Поле не может быть пустым!',
                unCorrectPhone: 'В поле не корректный номер телефона!',
                notEmail: 'В поле содержится не корректный email!',
                notVote: 'Пожалуйста, поставьте вашу оценку!'
            }
        };
    },

    _getRecommendation = function () {
        return 'Проверьте свой почтовый ящик! Если через несколько минут Вы не получите уведомления, ' +
               ' повторите отправку - возможно Вы допустили ошибку в контактном адресе!';
    },

    _getAsk = function () {
        return 'Пожалуйста, если у Вас есть время, напишите нам о данной проблеме на email: ' +
               '<a class="modal__link" href="mailto:' + settings.supportEmail + '">' + settings.supportEmail + '</a><br>' +
               'Мы будем Вам за это очень признательны!<br> Тип ошибки: ошибка на сервере';
    };

    // Return object (public methods)
    return {
        init: init,
        showMessage: showMessage,
        hideMessage: hideMessage,
        autoCloseMessage: autoCloseMessage,
        showAnimateMessage: showAnimateMessage,
        clearAnimateMessage: clearAnimateMessage,
        getMessageField: getMessageField,
        closeModal: closeModal
    }
})();

