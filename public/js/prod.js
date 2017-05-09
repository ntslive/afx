'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextScramble = function () {
    function TextScramble(el, Countdown) {
        _classCallCheck(this, TextScramble);

        this.el = el;
        // this.chars = '!<>-_\\/[]{}—=+*^?#________';
        // this.chars = '!<>-_\\/[]{}—=+*^?#___20173';
        this.chars = 'aphextwin';
        this.update = this.update.bind(this);
    }

    _createClass(TextScramble, [{
        key: 'setText',
        value: function setText(newText) {
            var oldText = this.el.innerText;
            var length = Math.max(oldText.length, newText.length);
            this.queue = [];

            for (var i = 0; i < length; i++) {
                var from = oldText[i] || '';
                var to = newText[i] || '';

                var start = Math.floor(Math.random() * 40);
                var end = start + Math.floor(Math.random() * 40);

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

function padWithDots(str) {
    // let maxPaddingString = phrases.reduce( function(a, b) {
    //     return a.length > b.length ? a : b;
    // });

    var maxPadding = 50;
    var numToAdd = maxPadding - str.length;

    var dots = '';
    for (var i = 0; i < numToAdd; i++) {
        dots = dots + ".";
    }

    return str + dots;
}

var Countdown = function Countdown() {
    _classCallCheck(this, Countdown);

    var that = this;
    var a = new Date().valueOf();
    var b = 1499119200000;

    this.$el = $('#countdown');
    this.updateField = true;
    this.c = b - a;

    setInterval(function () {
        that.c--;

        if (this.updateField) {
            this.$el.text(padWithDots(that.c));
        }
    }, 100);
};

function initScramblers() {
    // const labelScrambler = new TextScramble(document.getElementById('aphex-label'));
    window.countdowner = new Countdown();

    var ntsScrambler = new TextScramble(document.getElementById('nts-label'));
    // const countdownScrambler = new TextScramble(document.getElementById('countdown'));

    $('#nts-label').text(padWithDots("NTS"));

    var $paddingElements = $('.aphexDotPadding');
    var paddingScramblers = [];
    $paddingElements.each(function (i) {
        var $el = $($paddingElements[i]);
        $el.length && $el.text(padWithDots(""));

        paddingScramblers.push(new TextScramble($paddingElements[i]));
    });

    var scramblerFrequency = 2000;
    var phrases = ["APHEX TWIN", "INCOMING"];

    var selectedIndex = 0;
    var scrambleText = function scrambleText() {
        selectedIndex === 0 ? selectedIndex++ : selectedIndex--;
        // labelScrambler.setText( padWithDots(phrases[selectedIndex]));

        ntsScrambler.setText(padWithDots("NTS"));

        for (var i = 0; i < paddingScramblers.length; i++) {
            paddingScramblers[i].setText(padWithDots(""));
        }

        // $('#countdown').text(padWithDots(window.countdowner.c + ""));
        // countdownScrambler.setText( padWithDots(window.countdowner.c + "") );

        // scramble countdown
    };
    scrambleText();
    setInterval(scrambleText, scramblerFrequency);
}

function aphexCountdown() {
    var $countdown = $('#countdown');

    var a = new Date().valueOf();
    var b = 1499119200000;

    var c = b - a;

    // $countdown.text(padWithDots(c + ""));
    setInterval(function () {
        // $countdown.text(padWithDots(c-- + ""));
    }, 100);
}

$(document).ready(function () {
    aphexCountdown();
    initScramblers();

    var ibeam = $('#flashing-beam');
    var flashIbeam = function flashIbeam() {
        ibeam.text().length ? ibeam.text('') : ibeam.text('|');
    };
    flashIbeam();
    setInterval(flashIbeam, 500);
});
//# sourceMappingURL=prod.js.map
