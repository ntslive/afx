class TextScramble {
    constructor(el, scrambleSpeed, chars) {
        this.el = el;
        // this.chars = '!<>-_\\/[]{}—=+*^?#________';
        // this.chars = '!<>-_\\/[]{}—=+*^?#___20173';
        this.scrambleSpeed = scrambleSpeed || 25;
        this.chars = chars || 'aphextwin';
        this.update = this.update.bind(this)
    }

    setText(newText) {
        window.countdowner.updateField = false;
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';

            const start = Math.floor(Math.random() * (this.scrambleSpeed));
            const end = start + Math.floor(Math.random() * (this.scrambleSpeed));

            this.queue.push({ from, to, start, end })
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char
                }
                output += `<span class="dud">${char}</span>`
            } else {
                output += from
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            window.countdowner.updateField = true;
            return;
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)]
    }
}

function padWithDots(str) {
    // let maxPaddingString = phrases.reduce( function(a, b) {
    //     return a.length > b.length ? a : b;
    // });

    let maxPadding = 50;
    let numToAdd = maxPadding - str.length;

    let dots = '';
    for (let i=0; i < numToAdd; i++) {
        dots = dots + ".";
    }

    return str + dots;
}

class Countdown {
    constructor() {
        let that = this;
        let a = new Date().valueOf();
        let b = 1499119200000;

        this.$el = $('#countdown');
        this.updateField = true;
        this.c = b - a;

        this._setText();
        setInterval(function() {
            that.c--;
            that._setText();
        }, 100);
    }

    _setText() {
        if (this.updateField) {
            this.$el.text( padWithDots(this.c + "") );
        }
    }
}

function initScramblers() {
    window.countdowner = new Countdown();

    // const labelScrambler = new TextScramble(document.getElementById('aphex-label'));
    const ntsScrambler = new TextScramble(document.getElementById('nts-label'), 35, 'aphex');
    const countdownScrambler = new TextScramble(document.getElementById('countdown'), 15, 'aphex');

    $('#nts-label').text(padWithDots("NTS"));

    let $paddingElements = $('.aphexDotPadding');
    let paddingScramblers = [];
    $paddingElements.each( function(i) {
        let $el = $($paddingElements[i]);
        $el.length && $el.text( padWithDots(""));

        paddingScramblers.push( new TextScramble($paddingElements[i], 25, 'twin'));
    });

    let scramblerFrequency = 2000;
    let phrases = [
        "APHEX TWIN",
        "INCOMING",
    ];

    let selectedIndex = 0;
    let scrambleText = function() {
        selectedIndex === 0
            ? selectedIndex++
            : selectedIndex--;
        // labelScrambler.setText( padWithDots(phrases[selectedIndex]));

        ntsScrambler.setText( padWithDots("NTS"));

        for(let i =0; i < paddingScramblers.length; i++) {
            paddingScramblers[i].setText(padWithDots(""));
        }

        countdownScrambler.setText( padWithDots(window.countdowner.c + "") );
    };
    scrambleText();
    setInterval( scrambleText, scramblerFrequency);
}

$(document).ready( function () {
    initScramblers();

    let ibeam = $('#flashing-beam');
    let flashIbeam = function() {
        ibeam.text().length
            ? ibeam.text('')
            : ibeam.text('|');
    };
    flashIbeam();
    setInterval( flashIbeam, 500);
});