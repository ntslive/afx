
function aphexCountdown() {
    let $countdown = $('#countdown');

    let now = moment();
    let then = "03/06/2017 18:00:00";

    let differenceInMilliseconds = moment(then,"DD/MM/YYYY HH:mm:ss")
        .diff( moment(now,"DD/MM/YYYY HH:mm:ss") );

    let duration = moment.duration( Math.sqrt(differenceInMilliseconds)) ;

    $countdown.text(duration);
    setInterval(function() {
        $countdown.text(duration--);
    }, 100);
}

class TextScramble {
    constructor(el) {
        this.el = el;
        // this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.chars = '!<>-_\\/[]{}—=+*^?#___20173';
        this.update = this.update.bind(this)
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';

            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);

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

function initScramblers() {
    // const labelScrambler = new TextScramble(document.getElementById('aphex-label'));
    const ntsScrambler = new TextScramble(document.getElementById('nts-label'));

    let scramblerFrequency = 2000;
    let phrases = [
        "APHEX TWIN",
        "INCOMING",
    ];

    function padWithDots(str) {
        let maxPaddingString = phrases.reduce( function(a, b) {
            return a.length > b.length ? a : b;
        });

        let numToAdd = maxPaddingString.length - str.length;

        let dots = '';
        for (let i=0; i < numToAdd; i++) {
            dots = dots + ".";
        }

        return str + dots;
    }

    let selectedIndex = 0;
    let scrambleText = function() {
        selectedIndex === 0
            ? selectedIndex++
            : selectedIndex--;

        // labelScrambler.setText( padWithDots(phrases[selectedIndex]));
        ntsScrambler.setText("NTS");
    };
    scrambleText();
    setInterval( scrambleText, scramblerFrequency);
}

$(document).ready( function () {
    aphexCountdown();
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