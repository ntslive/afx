
class TextScramble {
    /** Modified version of Justin Windle's Text Scrambler: https://codepen.io/soulwire/pen/mErPAK */

    constructor(el, scrambleSpeed, chars) {
        this.el = el;
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
    let maxPadding = 40;
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

        let now = new Date();
        let a = now.valueOf();
        // let b = 1499119200000;
        let b = new Date().setHours(now.getHours() + 96); // Used only for archive purposes
        // let d = 1496520000000;
        let d = new Date().setHours(now.getHours() + 168); // Used only for archive purposes

        this.$el = $('#countdown');
        this.updateField = true;
        this.c = b - a;

        this._setText();
        setInterval(function() {
            that.c = Math.floor((that.c - (100 * ((b - a) / (d - a)) ) )) ;
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
    const countdownScrambler = new TextScramble(document.getElementById('countdown'), 15, 'aphex');
    const dateScrambler = new TextScramble(document.getElementById('date-label') );
    const locationScrambler = new TextScramble(document.getElementById('location-label'), 35, 'twin');

    $('#nts-label').text(padWithDots("NTS"));

    let $paddingElements = $('.aphexDotPadding');
    let paddingScramblers = [];
    $paddingElements.each( function(i) {
        let $el = $($paddingElements[i]);
        $el.length && $el.text( padWithDots(""));

        paddingScramblers.push( new TextScramble($paddingElements[i], 25, i % 2 === 0 ? 'twin' : 'aphex'));
    });

    let $dateLabel = $('#date-label');
    let $locationLabel = $('#location-label');
    if ($dateLabel.length > 0) {
        $dateLabel.text( padWithDots("SATURDAY.3RD.JUNE") );
    }
    if ($locationLabel.length > 0) {
        $locationLabel.text( padWithDots("VIDEO.STREAM.LIVE.FROM.FIELD.DAY") );
    }
    let scrambleText = function() {
        ($dateLabel.length > 0) && dateScrambler.setText( padWithDots("SATURDAY.3RD.JUNE"));
        ($locationLabel.length > 0) && locationScrambler.setText(padWithDots("VIDEO.STREAM.LIVE.FROM.FIELD.DAY"));

        for(let i=0; i < paddingScramblers.length; i++) {
            paddingScramblers[i].setText(padWithDots(""));
        }

        countdownScrambler.setText( padWithDots(window.countdowner.c + "") );

        let rangeInSeconds = 4.5;
        let randomTimeout = Math.floor( (Math.random() * 1000) * rangeInSeconds);

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
        // Ensure Firebase Rules allow write
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

class AudioPlayer {
    constructor() {
        this.el = document.getElementById('aphex-audio');

        this.el.addEventListener('play', function(e) {
            $('#player').addClass('playing');
        });
        this.el.addEventListener('pause', function(e) {
            $('#player').removeClass('playing');
        });

        this.el.volume = 0.8;
    }

    play() {
        this.el.play();
    }

    pause() {
        this.el.pause();
    }

    isPlaying() {
        return !this.el.paused;
    }

    toggleAudio() {
        this.isPlaying()
            ? this.pause()
            : this.play();
    }
}

$(document).ready( function () {
    ga('send', 'pageview', window.location.pathname);

    initScramblers();
    // Uncomment below to enable auth-store
    // NTS_AFX.store.init();

    window.audioPlayer = new AudioPlayer();

    let $consoleEntryForm = $('#console-entry-form');

    $consoleEntryForm.focus();
    $consoleEntryForm.submit( function(e) {
        e.preventDefault();

        ga('send', 'event', 'Aphex', 'PasswordAttempt');

        // Uncomment below to enable auth-store
        // let authenticated = NTS_AFX.store.post(
        //     e.currentTarget.children['console-entry'].value
        // ).then(function(authenticated) {
        let authenticated = false;
        // Remove above when enabling auth-store

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
        // Uncomment below to enable auth-store
        // });
    });

    $('#nts-link').on('click', function() {
        ga('send', 'event', 'Aphex', 'GoTo-NTS');
    });
    $('#warp-link').on('click', function() {
        ga('send', 'event', 'Aphex', 'GoTo-Warp');
    });

    $('#player').on('click', function() {
        window.audioPlayer.toggleAudio();
    });

    $('#fieldday-link').on('click', function() {
        ga('send', 'event', 'Aphex', 'GoTo-FieldDay');
    });
});
