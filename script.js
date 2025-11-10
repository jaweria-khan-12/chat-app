import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, update, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCzgxLweSjb6UE8lvoRc3_P1HuItGi8AFA",
  authDomain: "form-eebcb.firebaseapp.com",
  databaseURL: "https://form-eebcb-default-rtdb.firebaseio.com",
  projectId: "form-eebcb",
  storageBucket: "form-eebcb.firebasestorage.app",
  messagingSenderId: "963306865969",
  appId: "1:963306865969:web:079a4147c72f34e0199c10",
  measurementId: "G-HWBNMQ2ETV"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Pages detection
if (document.getElementById('signupBtn')) {
    // Signup/Login page
    const signupBtn = document.getElementById('signupBtn');
    const loginBtn = document.getElementById('loginBtn');
    const goLogin = document.getElementById('goLogin');
    const goSignup = document.getElementById('goSignup');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const themeSwitch = document.getElementById('themeSwitch');

    // Theme toggle
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeSwitch.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

    goLogin.addEventListener('click', () => {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    });

    goSignup.addEventListener('click', () => {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    });

    signupBtn.addEventListener('click', () => {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const pass = document.getElementById('signupPass').value;

        auth.createUserWithEmailAndPassword(email, pass)
            .then(userCred => {
                return userCred.user.updateProfile({ displayName: name });
            })
            .then(() => {
                window.location = "chat.html";
            })
            .catch(err => alert(err.message));
    });

    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;

        auth.signInWithEmailAndPassword(email, pass)
            .then(() => window.location = "chat.html")
            .catch(err => alert(err.message));
    });
}

// Chat page
if (document.getElementById('chatMessages')) {
    const logoutBtn = document.getElementById('logoutBtn');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const userDisplayName = document.getElementById('userDisplayName');
    const themeSwitch = document.querySelector('#themeSwitch');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const sendBtnColorPicker = document.getElementById('sendBtnColorPicker');

    let currentUser = null;

    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            userDisplayName.textContent = user.displayName || "User";
        } else {
            window.location = "index.html";
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => window.location = "index.html");
    });

    sendBtn.addEventListener('click', () => {
        const msg = messageInput.value.trim();
        if (msg) {
            db.ref('messages').push({
                user: currentUser.displayName,
                text: msg,
                timestamp: Date.now()
            });
            messageInput.value = '';
        }
    });

    db.ref('messages').on('child_added', snapshot => {
        const data = snapshot.val();
        const div = document.createElement('div');
        div.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Theme toggle
    themeSwitch.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeSwitch.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

    // Chat settings
    bgColorPicker.addEventListener('input', () => {
        chatMessages.style.background = bgColorPicker.value;
    });

    sendBtnColorPicker.addEventListener('input', () => {
        sendBtn.style.background = sendBtnColorPicker.value;
    });
}