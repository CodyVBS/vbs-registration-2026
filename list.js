import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// VERIFIED CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyB9wvQ525wCsxZmIZmfzj6Z5VjF2aSUu_g",
    authDomain: "registervbs-83306.firebaseapp.com",
    projectId: "registervbs-83306",
    storageBucket: "registervbs-83306.firebasestorage.app",
    messagingSenderId: "462529063270",
    appId: "1:462529063270:web:40c1333dc7c450345300a7"
};

// Initialize Services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Select UI Elements
const loginOverlay = document.getElementById('loginOverlay');
const adminContent = document.getElementById('adminContent');
const explorerList = document.getElementById('explorerList');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const passInput = document.getElementById('passInput');
const showPass = document.getElementById('showPass');
const errDisplay = document.getElementById('err');

// 1. MONITOR AUTH STATE (Checks if already logged in)
onAuthStateChanged(auth, (user) => {
    if (user) {
        loginOverlay.style.display = 'none';
        adminContent.style.display = 'block';
        fetchExplorers();
    } else {
        loginOverlay.style.display = 'block';
        adminContent.style.display = 'none';
    }
});

// 2. SHOW PASSWORD TOGGLE
showPass.onclick = () => {
    passInput.type = showPass.checked ? "text" : "password";
};

// 3. SECURE LOGIN LOGIC
loginBtn.onclick = async () => {
    const email = "admin@yourchurch.com"; //
    const password = passInput.value;

    // --- DEBUG ALERT: Confirm what the browser is seeing ---
    // alert("Logging in as: " + email + "\nPassword: [" + password + "]");

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Login Error:", error.code);
        if (error.code === 'auth/invalid-credential') {
            errDisplay.textContent = "Access Denied: Incorrect password for " + email;
        } else {
            errDisplay.textContent = "Error: " + error.message;
        }
    }
};

// 4. SECURE SIGN OUT
logoutBtn.onclick = async () => {
    await signOut(auth);
    location.reload();
};

// 5. DATA RETRIEVAL & DELETE
async function fetchExplorers() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        explorerList.innerHTML = ""; 

        if (querySnapshot.empty) {
            explorerList.innerHTML = "<li>No registrations found yet.</li>";
            return;
        }

        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const id = documentSnapshot.id;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="explorer-info">
                    <span class="explorer-name">${data.childName}</span><br>
                    <span class="explorer-details">
                        Grade: ${data.grade} | Parent: ${data.email}<br>
                        Allergies: ${data.allergies || 'None'}
                    </span>
                </div>
                <button class="delete-btn" data-id="${id}" style="width:auto; background:#e74c3c; padding:5px 10px;">Delete</button>
            `;
            explorerList.appendChild(li);
        });

        // Attach Delete Functionality
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const docId = e.target.getAttribute('data-id');
                if (confirm("Permanently delete this explorer record?")) {
                    await deleteDoc(doc(db, "registrations", docId));
                    fetchExplorers(); // Refresh the list
                }
            };
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById('loading').textContent = "Security Error: Check Firestore Rules.";
    }
}
