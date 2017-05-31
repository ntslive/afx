'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextScramble = function () {
    /** Modified version of Justin Windle's Text Scrambler: https://codepen.io/soulwire/pen/mErPAK */

    function TextScramble(el, scrambleSpeed, chars) {
        _classCallCheck(this, TextScramble);

        this.el = el;
        this.scrambleSpeed = scrambleSpeed || 25;
        // this.chars = chars || 'aphextwin';
        this.chars = 'aphextwin;}[*$|~';
        this.update = this.update.bind(this);
    }

    _createClass(TextScramble, [{
        key: 'setText',
        value: function setText(newText) {
            window.countdowner.updateField = false;
            var oldText = this.el.innerText;
            var length = Math.max(oldText.length, newText.length);
            this.queue = [];

            for (var i = 0; i < length; i++) {
                var from = oldText[i] || '';
                var to = newText[i] || '';

                var start = Math.floor(Math.random() * this.scrambleSpeed);
                var end = start + Math.floor(Math.random() * this.scrambleSpeed);

                this.queue.push({ from: from, to: to, start: start, end: end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
        }
    }, {
        key: 'update',
        value: function update() {
            var output = '';
            var complete = 0;
            for (var i = 0, n = this.queue.length; i < n; i++) {
                var _queue$i = this.queue[i],
                    from = _queue$i.from,
                    to = _queue$i.to,
                    start = _queue$i.start,
                    end = _queue$i.end,
                    char = _queue$i.char;

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += '<span class="dud">' + char + '</span>';
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                window.countdowner.updateField = true;
                return;
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
    }, {
        key: 'randomChar',
        value: function randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }]);

    return TextScramble;
}();

var maxLineLength = 40;

function padWithDots(str) {
    var maxPadding = maxLineLength;
    var numToAdd = maxPadding - str.length;

    var dots = '';
    for (var i = 0; i < numToAdd; i++) {
        dots = dots + ".";
    }

    return str + dots;
}

var Countdown = function () {
    function Countdown(passwords) {
        _classCallCheck(this, Countdown);

        var that = this;

        this.$el = $('#countdown');
        this.updateField = true;

        var i = 0;

        function changePasswordAttempt() {
            that.c = passwords[i];
            if (that.c.length > maxLineLength) {
                that.c = that.c.substring(0, maxLineLength - 1);
            }
            that.c = that.c.replace(/\s/g, ".");

            that._setText();

            if (i === passwords.length - 1) {
                i = 0;
            } else {
                i++;
            }

            setTimeout(changePasswordAttempt, that._generateRandomTimeout());
        }

        changePasswordAttempt();
    }

    _createClass(Countdown, [{
        key: '_generateRandomTimeout',
        value: function _generateRandomTimeout() {
            return Math.floor(Math.random() * 300) + 100;
        }
    }, {
        key: '_setText',
        value: function _setText() {
            if (this.updateField) {
                if (this.c.length > maxLineLength) {
                    this.c = this.c.substring(0, maxLineLength - 1);
                }
                this.$el.text(padWithDots(this.c + ""));
            }
        }
    }]);

    return Countdown;
}();

function initScramblers(passwords) {
    window.countdowner = new Countdown(passwords);
    var countdownScrambler = new TextScramble(document.getElementById('countdown'), 20, 'aphex');

    var $paddingElements = $('.aphexDotPadding');
    var paddingScramblers = [];
    $paddingElements.each(function (i) {
        var $el = $($paddingElements[i]);
        $el.length && $el.text(padWithDots(""));

        paddingScramblers.push(new TextScramble($paddingElements[i], 20, i % 2 === 0 ? 'twin' : 'aphex'));
    });

    var scrambleText = function scrambleText() {
        for (var _i = 0; _i < paddingScramblers.length; _i++) {
            paddingScramblers[_i].setText(padWithDots(""));
        }

        countdownScrambler.setText(padWithDots(window.countdowner.c + ""));

        var rangeInSeconds = 4.5;
        var randomTimeout = Math.floor(Math.random() * 600 * rangeInSeconds);

        setTimeout(scrambleText, randomTimeout);
    };

    scrambleText();
}

var NTS_AFX = {};
NTS_AFX.store = {
    init: function init() {
        var config = {
            apiKey: "AIzaSyCn2JexWTvW3fyvyvjWNcdwe-wDkgOw1c0",
            authDomain: "nts-afx.firebaseapp.com",
            databaseURL: "https://nts-afx.firebaseio.com",
            projectId: "nts-afx",
            storageBucket: "nts-afx.appspot.com",
            messagingSenderId: "1740064170"
        };
        firebase.initializeApp(config);
    },
    post: function post(message) {
        var record = { message: message };
        var newPostKey = firebase.database().ref().child('messages').push().key;
        var updates = {};
        updates['/messages/' + newPostKey] = record;
        return firebase.database().ref().update(updates);
    }
};

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
    }, i[r].l = 1 * new Date();
    a = s.createElement(o), m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-6061419-3', 'auto');

$(document).ready(function () {
    $.getJSON("/public/json/passwords_day1_clean.json", function (data) {
        initScramblers(data.passwords);
    });
    NTS_AFX.store.init();

    var $consoleEntryForm = $('#console-entry-form');
    $consoleEntryForm.focus();
    $consoleEntryForm.submit(function (e) {
        e.preventDefault();

        ga('send', 'event', 'Aphex', 'PasswordAttempt');

        var authenticated = NTS_AFX.store.post(e.currentTarget.children['console-entry'].value).then(function (authenticated) {

            if (authenticated) {
                var $msg = $('#success-message');
                $msg.addClass('display');

                setTimeout(function () {
                    $msg.removeClass('display');
                }, 2000);

                authenticated.authenticate();
            } else {
                var _$msg = $('#error-message');
                _$msg.addClass('display');

                setTimeout(function () {
                    _$msg.removeClass('display');
                }, 1500);
            }

            e.currentTarget.children['console-entry'].value = "";
        });
    });
});
//# sourceMappingURL=prod.js.map
