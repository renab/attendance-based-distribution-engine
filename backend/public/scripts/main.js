const quotes = document.getElementById('quotes');
const error = document.getElementById('error');

const firebaseConfig = {
    apiKey: "AIzaSyBHzT71nwPvxiimFuhhIhfG2ILOdB1tzvk",
    authDomain: "attendance-based-distribution.firebaseapp.com",
    projectId: "attendance-based-distribution",
    storageBucket: "attendance-based-distribution.appspot.com",
    messagingSenderId: "1046625301742",
    appId: "1:1046625301742:web:2f5284605cd074dd63afff",
    measurementId: "G-JHNPKR2L5Y"
};


// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
//console.log(auth)
//auth.setPersistence(auth.Auth.Persistence.NONE);
//export const analytics = getAnalytics(app);

const displayQuotes = (allQuotes) => {
    let html = '';
    for (const quote of allQuotes) {
        html += `<blockquote class="wp-block-quote">
                    <p>${quote.quote}. </p><cite>${quote.character}</cite>
                </blockquote>`;
    }
    return html;
};

console.log('Initialized application');