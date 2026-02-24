import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Monitor Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        fetchExplorers();
    } else {
        document.getElementById('loginOverlay').style.display = 'block';
        document.getElementById('adminContent').style.display = 'none';
    }
});

// Show Password Toggle
document.getElementById('showPass').onclick = () => {
    document.getElementById('passInput').type = document.getElementById('showPass').checked ? "text" : "password";
};

// Login Logic
document.getElementById('loginBtn').onclick = async () => {
    const email = "admin@yourchurch.com"; // Matches your Firebase User
    const password = document.getElementById('passInput').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        document.getElementById('err').textContent = "Access Denied: Invalid Credentials";
    }
};

// Logout Logic
document.getElementById('logoutBtn').onclick = async () => {
    await signOut(auth);
    location.reload();
};

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
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
                <button class="delete-btn" onclick="window.deleteEntry('${id}')">Delete</button>
            `;
            explorerList.appendChild(li);
        });
    } catch (error) { console.error(error); }
}

// Global Delete Function
window.deleteEntry = async (id) => {
    if (confirm("Delete this record?")) {
        await deleteDoc(doc(db, "registrations", id));
        location.reload();
    }
};
