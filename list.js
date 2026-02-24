import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// VERIFIED API KEY FOR PROJECT: registervbs-83306
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

// AUTH STATE - Auto-redirects if already logged in
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

// PASSWORD VISIBILITY TOGGLE
document.getElementById('showPass').onclick = () => {
    const passInput = document.getElementById('passInput');
    passInput.type = document.getElementById('showPass').checked ? "text" : "password";
};

// LOGIN ACTION
document.getElementById('loginBtn').onclick = async () => {
    const email = "admin@yourchurch.com"; // Verified User
    const password = document.getElementById('passInput').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        // This displays the specific reason for failure on the screen
        document.getElementById('err').textContent = "Login Error: " + error.message;
    }
};

// LOGOUT ACTION
document.getElementById('logoutBtn').onclick = async () => {
    await signOut(auth);
    location.reload();
};

// DATA LOAD
async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        explorerList.innerHTML = ""; 
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:10px 0;";
            li.innerHTML = `
                <div>
                    <strong>${data.childName}</strong> (Grade: ${data.grade})<br>
                    Parent: ${data.email} | Phone: ${data.phone}
                </div>
                <button onclick="window.deleteEntry('${id}')" style="background:#e74c3c; color:white; border:none; padding:8px; cursor:pointer; border-radius:4px;">Delete</button>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

// DELETE ACTION
window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this explorer?")) {
        await deleteDoc(doc(db, "registrations", id));
        location.reload();
    }
};
