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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginOverlay = document.getElementById('loginOverlay');
const adminContent = document.getElementById('adminContent');
const explorerList = document.getElementById('explorerList');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const passInput = document.getElementById('passInput');
const showPass = document.getElementById('showPass');

// 1. MONITOR AUTH STATE
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

// 3. SECURE LOGIN
loginBtn.onclick = async () => {
    const email = "admin@yourchurch.com"; // MUST MATCH FIREBASE AUTH USERS TAB
    const password = passInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        document.getElementById('err').textContent = "Access Denied: Invalid Credentials";
        console.error("Login Error:", error);
    }
};

// 4. SIGN OUT
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

        querySnapshot.forEach((documentSnapshot) => {
            const data = documentSnapshot.data();
            const id = documentSnapshot.id;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="explorer-info">
                    <span class="explorer-name">${data.childName}</span><br>
                    <span class="explorer-details">Grade: ${data.grade} | Parent: ${data.email}</span>
                </div>
                <button class="delete-btn" data-id="${id}">Delete</button>
            `;
            explorerList.appendChild(li);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = async (e) => {
                const docId = e.target.getAttribute('data-id');
                if (confirm("Permanently delete this explorer record?")) {
                    await deleteDoc(doc(db, "registrations", docId));
                    fetchExplorers();
                }
            };
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById('loading').textContent = "Security Error: Check Firestore Rules.";
    }
}
