"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function aphexCountdown() {
    var $countdown = $('#countdown');

    var now = moment();
    var then = "03/06/2017 18:00:00";

    var differenceInMilliseconds = moment(then, "DD/MM/YYYY HH:mm:ss").diff(moment(now, "DD/MM/YYYY HH:mm:ss"));

    var duration = moment.duration(differenceInMilliseconds);

    $countdown.text(duration--);
    setInterval(function () {
        $countdown.text(duration--);
    }, 100);
}

var TextScramble = function () {
    function TextScramble(el) {
        _classCallCheck(this, TextScramble);

        this.el = el;
        // this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.chars = '!<>-_\\/[]{}—=+*^?#___20173';
        this.update = this.update.bind(this);
    }

    _createClass(TextScramble, [{
        key: "setText",
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
        key: "update",
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
                    output += "<span class=\"dud\">" + char + "</span>";
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
        key: "randomChar",
        value: function randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }]);

    return TextScramble;
}();

function initScramblers() {
    var labelScrambler = new TextScramble(document.getElementById('aphex-label'));
    var ntsScrambler = new TextScramble(document.getElementById('nts-label'));

    var scramblerFrequency = 2000;
    var phrases = ["APHEX TWIN", "INCOMING"];

    function padWithDots(str) {
        var maxPaddingString = phrases.reduce(function (a, b) {
            return a.length > b.length ? a : b;
        });

        var numToAdd = maxPaddingString.length - str.length;

        var dots = '';
        for (var i = 0; i < numToAdd; i++) {
            dots = dots + ".";
        }

        return str + dots;
    }

    var selectedIndex = 0;
    var scrambleText = function scrambleText() {
        selectedIndex === 0 ? selectedIndex++ : selectedIndex--;

        labelScrambler.setText(padWithDots(phrases[selectedIndex]));
        ntsScrambler.setText("NTS");
    };
    scrambleText();
    setInterval(scrambleText, scramblerFrequency);
}

$(document).on('ready', function () {
    aphexCountdown();
    initScramblers();

    var ibeam = $('#flashing-beam');
    var flashIbeam = function flashIbeam() {
        ibeam.text().length ? ibeam.text('') : ibeam.text('|');
    };
    flashIbeam();
    setInterval(flashIbeam, 500);

    console.log('read');
});
//# sourceMappingURL=prod.js.map
