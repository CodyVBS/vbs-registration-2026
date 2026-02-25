import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
const db = getFirestore(app);

// Simple Password Logic
document.getElementById('loginBtn').onclick = () => {
    const userInput = document.getElementById('passInput').value;
    if (userInput === "VBS2026") { 
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        fetchExplorers();
    } else {
        document.getElementById('err').textContent = "Incorrect Password.";
    }
};

document.getElementById('showPass').onclick = () => {
    document.getElementById('passInput').type = document.getElementById('showPass').checked ? "text" : "password";
};

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const countDisplay = document.getElementById('totalCount');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        explorerList.innerHTML = ""; 
        
        // Update Total Count
        countDisplay.textContent = querySnapshot.size;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:10px 0;";
            li.innerHTML = `
                <div>
                    <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                    Parent: ${data.email} | Phone: ${data.phone}
                </div>
                <button onclick="window.deleteEntry('${id}')" style="background:#e74c3c; color:white; border:none; padding:8px; cursor:pointer; border-radius:4px;">Delete</button>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        document.getElementById('err').textContent = "Database Error. Ensure Firestore Rules are set to 'allow read: if true'";
    }
}

window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this explorer?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};
