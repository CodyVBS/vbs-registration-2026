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

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const userInput = document.getElementById('passInput').value;
            if (userInput === "VBS2026") { 
                document.getElementById('loginOverlay').style.display = 'none';
                document.getElementById('adminContent').style.display = 'block';
                fetchExplorers();
            } else {
                const errDiv = document.getElementById('err');
                if (errDiv) errDiv.textContent = "Incorrect Password.";
            }
        });
    }
});

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const countDisplay = document.getElementById('totalCount');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        explorerList.innerHTML = ""; 
        countDisplay.textContent = querySnapshot.size;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "border-bottom:2px solid #3498db; padding:15px 0; list-style:none;";
            
            li.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div style="flex-grow: 1;">
                        <strong style="font-size:1.2em; color:#2c3e50;">${data.lastName}, ${data.firstName}</strong> 
                        <span style="background:#3498db; color:white; padding:2px 8px; border-radius:12px; font-size:0.8em; margin-left:10px;">Grade ${data.grade}</span><br>
                        
                        <div style="margin-top:8px; font-size:0.95em; line-height:1.4;">
                            <strong>Parent:</strong> ${data.parentName}<br>
                            <strong>Phone:</strong> ${data.phone} | <strong>Email:</strong> ${data.email}<br>
                            <strong>Church:</strong> ${data.homeChurch || 'None'}<br>
                            <div style="background:#fff3cd; padding:5px; border-radius:4px; margin-top:5px;">
                                <strong>Medical/Allergies:</strong> ${data.medicalInfo || 'None'}
                            </div>
                            <div style="background:#d4edda; padding:5px; border-radius:4px; margin-top:5px;">
                                <strong>Authorized Pickup:</strong> ${data.pickupNames}
                            </div>
                        </div>
                    </div>
                    <button onclick="window.deleteEntry('${id}')" 
                            style="background:#e74c3c; color:white; border:none; padding:10px 15px; border-radius:6px; cursor:pointer; font-weight:bold;">
                        Delete
                    </button>
                </div>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        console.error(e);
    }
}

window.deleteEntry = async (id) => {
    if (confirm("Permanently delete this child's record?")) {
        await deleteDoc(doc(db, "registrations", id));
        fetchExplorers();
    }
};
