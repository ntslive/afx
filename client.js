
class TextScramble {
    /** Modified version of Justin Windle's Text Scrambler: https://codepen.io/soulwire/pen/mErPAK */

    constructor(el, scrambleSpeed, chars) {
        this.el = el;
        this.scrambleSpeed = scrambleSpeed || 25;
        // this.chars = chars || 'aphextwin';
        this.chars = 'aphextwin;}[*$|~';
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

let maxLineLength = 40;

function padWithDots(str) {
    let maxPadding = maxLineLength;
    let numToAdd = maxPadding - str.length;

    let dots = '';
    for (let i=0; i < numToAdd; i++) {
        dots = dots + ".";
    }

    return str + dots;
}

class Countdown {
    constructor(passwords) {
        let that = this;

        this.$el = $('#countdown');
        this.updateField = true;

        let i = 0;

        function changePasswordAttempt() {
            that.c = passwords[i];
            if (that.c.length > maxLineLength) {
                that.c = that.c.substring(0, maxLineLength-1);
            }
            that.c = that.c.replace(/\s/g, ".");

            that._setText();

            if (i === (passwords.length-1) ) {
                i = 0;
            } else {
                i++;
            }

            setTimeout(changePasswordAttempt, that._generateRandomTimeout());
        }

        changePasswordAttempt();
    }

    _generateRandomTimeout() {
        return Math.floor(Math.random() * 300) + 100;
    }

    _setText() {
        if (this.updateField) {
            if (this.c.length > maxLineLength) {
                this.c = this.c.substring(0, maxLineLength-1);
            }
            this.$el.text( padWithDots(this.c + "") );
        }
    }
}

function initScramblers(passwords) {
    window.countdowner = new Countdown(passwords);
    const countdownScrambler = new TextScramble(document.getElementById('countdown'), 20, 'aphex');

    let $paddingElements = $('.aphexDotPadding');
    let paddingScramblers = [];
    $paddingElements.each( function(i) {
        let $el = $($paddingElements[i]);
        $el.length && $el.text( padWithDots(""));

        paddingScramblers.push( new TextScramble($paddingElements[i], 20, i % 2 === 0 ? 'twin' : 'aphex'));
    });

    let scrambleText = function() {
        for(let i=0; i < paddingScramblers.length; i++) {
            paddingScramblers[i].setText(padWithDots(""));
        }

        countdownScrambler.setText( padWithDots(window.countdowner.c + "") );

        let rangeInSeconds = 4.5;
        let randomTimeout = Math.floor( (Math.random() * 600) * rangeInSeconds);

        setTimeout(scrambleText, randomTimeout)
    };

    scrambleText();
}

let NTS_AFX = {};
NTS_AFX.store = {
    init: function() {
        let config = {
            apiKey: "AIzaSyCn2JexWTvW3fyvyvjWNcdwe-wDkgOw1c0",
            authDomain: "nts-afx.firebaseapp.com",
            databaseURL: "https://nts-afx.firebaseio.com",
            projectId: "nts-afx",
            storageBucket: "nts-afx.appspot.com",
            messagingSenderId: "1740064170"
        };
        firebase.initializeApp(config);
    },
    post: function(message) {
        let record = { message: message };
        let newPostKey = firebase.database().ref().child('messages').push().key;
        let updates = {};
        updates['/messages/' + newPostKey] = record;
        return firebase.database().ref().update(updates);
    }
};

(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-6061419-3', 'auto');

$(document).ready( function () {
    $.getJSON("/public/json/passwords_day1_clean.json", function(data) {
        initScramblers(data.passwords);
    });
    NTS_AFX.store.init();

    let $consoleEntryForm = $('#console-entry-form');
    $consoleEntryForm.focus();
    $consoleEntryForm.submit( function(e) {
        e.preventDefault();

        ga('send', 'event', 'Aphex', 'PasswordAttempt');

        let authenticated = NTS_AFX.store.post(
            e.currentTarget.children['console-entry'].value
        ).then(function(authenticated) {

            if (authenticated) {
                let $msg = $('#success-message');
                $msg.addClass('display');

                setTimeout(function() {
                    $msg.removeClass('display');
                },2000);

                authenticated.authenticate();
            } else {
                let $msg = $('#error-message');
                $msg.addClass('display');

                setTimeout(function() {
                    $msg.removeClass('display');
                }, 1500);
            }

            e.currentTarget.children['console-entry'].value = "";
        });
    });
});