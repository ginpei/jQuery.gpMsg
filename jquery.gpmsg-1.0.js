/**
 * jQuery.gpMsg 1.0
 * http://ginpen.com/jquery/gpmsg/
 * https://github.com/ginpei/jQuery.gpMsg
 *
 * Copyright (c) 2011 Takanashi Ginpei
 * http://ginpen.com
 *
 * Released under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    try {
        if (window.com.ginpen.gpMsg) { return; }
    } catch (e) {}

    if (!window.com) { window.com = {}; }
    if (!com.ginpen) { com.ginpen = {}; }

    var gpMsg = com.ginpen.gpMsg = {
        /**
         * The version of this application.
         * @type String
         */
        VERSION: '1.0',

        /**
         * Default settings.
         * @type Object
         */
        DEFAULT: {
            classes: null,
            direction: null,
            duration: 5000,
            html: false,
            parent: null,
            remove: null
        },

        /**
         * Common container
         * @type HtmlElement
         * @see #_createContainer
         */
        $container: null,

        /**
         * @param {Object} settings
         * @returns {Object}
         */
        mergeSettings: function(settings) {
            return $.extend({}, this.DEFAULT, settings);
        },

        /**
         * Called by jQuery interface.
         * @param {HtmlElement} $el Target element.
         * @param {Object} settings Settings map.
         */
        exec: function($el, settings) {
        },

        /**
         * Add new message to container.
         * @param {String} message
         * @param {Object} settings
         * @returns {HtmlElement} Create message element.
         */
        pushMessage: function(message, settings) {
            var $message = this._buildMessage(message, settings);
            var $parent = this._getParent(settings);

            if (settings && $.isFunction(settings.show)) {
                settings.show($message, $parent);
            }
            else {
                if (settings && settings.direction == 'after') {
                    $parent.append($message);
                }
                else {
                    $parent.prepend($message);
                }
                $message
                    .hide()
                    .slideDown();
            }

            this._removeMessageLater($message, settings);

            return $message;
        },

        /**
         * Build new message element.
         * @param {String} message
         * @param {Object} settings
         */
        _buildMessage: function(message, settings) {
            var $message = $('<div />')
                .addClass('gpmsg-message');

            if (this._isHtml(settings)) {
                $message.html(message);
            }
            else {
                $message.text(message);
            }

            $('<span />')
                .addClass('gpmsg-close')
                .html('&times;')
                .prependTo($message);

            if (settings && settings.classes) {
                $message.addClass(settings.classes);
            }

            this._bindToClose($message, settings);

            return $message;
        },

        /**
         * Return true if html mode.
         * @param {Object} settings
         */
        _isHtml: function(settings) {
            return settings && settings.html;
        },

        /**
         * Init close button.
         * @param {HtmlElement} $message
         * @param {Object} settings
         */
        _bindToClose: function($message, settings) {
            var that = this;
            $message.children('.gpmsg-close').click(function(event) {
                that._removeMessage($message, settings);
            });
        },

        /**
         * Return parent element from settings or default.
         * @param {Object} settings
         * @returns {HtmlElement}
         */
        _getParent: function(settings) {
            var $parent;
            if (settings && settings.parent) {
                $parent = $(settings.parent);
            }
            else {
                if (!this._hasContainer()) {
                    this._createContainer();
                }
                $parent = gpMsg.$container;
            }

            return $parent;
        },

        /**
         * Create common container once.
         */
        _createContainer: function() {
            if (false) {
                return;
            }

            gpMsg.$container = $('<div id="gpmsg-container" />')
                .appendTo('body');
        },

        /**
         * Return true if common container is created.
         * @returns {Boolean}
         */
        _hasContainer: function() {
            return !!gpMsg.$container;
        },

        /**
         * Remove all messages.
         */
        clean: function() {
            if (this._hasContainer()) {
                this._getParent().empty();
            }
        },

        /**
         * Return duration to remove.
         * @param {Object} settings
         * @returns {Number}
         */
        _getDuration: function(settings) {
            var duration;
            if (settings && !isNaN(settings.duration)) {
                duration = parseInt(settings.duration);
            }
            else {
                duration = gpMsg.DEFAULT.duration;
            }

            return duration;
        },

        /**
         * Remove message after duration.
         * @param {HtmlElement} $message
         * @param {Object} settings
         * @param {Boolean} True if timer is set, false if not.
         */
        _removeMessageLater: function($message, settings) {
            var duration = this._getDuration(settings);

            var that = this;
            if (duration > 0) {
                setTimeout(function() {
                    that._removeMessage($message, settings);
                }, duration);

                return true;
            }
            else {
                return false;
            }
        },

        /**
         * Remove message now.
         * @param {HtmlElement} $message
         * @param {Object} settings
         */
        _removeMessage: function($message, settings) {
            if (settings && $.isFunction(settings.hide)) {
                settings.hide($message);
            }
            else {
                $message.slideUp(function() { $message.remove(); });
            }
        },

        banpei: null
    };

    // jQuery global method interface
    $.gpMsg = function(message, settings) {
        return gpMsg.pushMessage(message, settings);
    };

    /*
    // jQuery method interface
    $.fn.gpMsg = function(settings) {
        settings = gpMsg.mergeSettings(settings);
        for (var i = 0, l = this.length; i < l; i++) {
            gpMsg.exec(this.eq(i), settings);
        }

        return this;
    };
    */
}(jQuery));
