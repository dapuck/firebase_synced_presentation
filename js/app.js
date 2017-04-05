/*jshint globals: true, browser: true*/
/*globals firebase, console, Reveal, alert*/
(function(){
    var presenter = null;
    var presentationId = "/FirstTest";
    var revealStarted = false;
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAu2PvDB5aQPgP9pI-2-HiOPzeXnMv-ELw",
        authDomain: "presentations-6c31d.firebaseapp.com",
        databaseURL: "https://presentations-6c31d.firebaseio.com",
        projectId: "presentations-6c31d",
        storageBucket: "presentations-6c31d.appspot.com",
        messagingSenderId: "95919133222"
    };
    firebase.initializeApp(config);

    var loginBtn = document.getElementById('go');
    var guestBtn = document.getElementById('guest');
    var loginFrm = document.getElementById('auth');
    var slides = document.getElementById('reveal');
    loginBtn.onclick = fireAuth;
    guestBtn.onclick = startReveal;

    firebase.auth().onAuthStateChanged(fireAuthState);
    var database = firebase.database();

    database.ref(presentationId + "/state")
        .on('value', function(snap) {
        if(snap.val() && revealStarted) {
            console.log(snap.val());
            Reveal.setState(JSON.parse(snap.val()));
        }
    });

    function fireAuth() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        firebase.auth().signInWithEmailAndPassword(email,password)
        .catch(function(error) {
            console.log(error);
            alert("Issue with login");
        });
        startReveal();
    }

    function fireAuthState(user) {
        if(user) {
            presenter = user;
        } else {
            presenter = null;
        }
    }

    function startReveal() {
        loginFrm.style.display = 'none';
        slides.style.display = 'block';
        var options = {
            controls: false,
            keyboard: false,
            touch: false,
            mouseWheel: false
        };
        if(presenter) {
            options = {};
        }
        Reveal.initialize(options);
        if(presenter) {
            database.ref(presentationId + "/state")
            .set(JSON.stringify(Reveal.getState()))
            .then(function() {
                console.log(arguments);
            })
            .catch(function(err) {
                console.log(err);
            });
        }
        revealStarted = true;
        Reveal.addEventListener('slidechanged', function(event) {
            // For presenter: Get and send state to FireDB
            var state = Reveal.getState();
            if(presenter) {
                database.ref(presentationId + "/state")
                    .set(JSON.stringify(state));
            }
        });
        Reveal.addEventListener('fragmentshown', function(event) {
            // For presenter: Get and send state to FireDB
            var state = Reveal.getState();
            if(presenter) {
                database.ref(presentationId + "/state")
                    .set(JSON.stringify(state));
            }
        });
        Reveal.addEventListener('fragmenthidden', function(event) {
            // For presenter: Get and send state to FireDB
            var state = Reveal.getState();
            if(presenter) {
                database.ref(presentationId + "/state")
                    .set(JSON.stringify(state));
            }
        });
    }
})();