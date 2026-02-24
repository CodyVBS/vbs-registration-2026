import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    // PASTE YOUR REAL CONFIG FROM APP.JS HERE
    apiKey: "AIzaSyB9wvQ525wCsxZmIZmfzj6Z5VjF2aSUu_g",
    authDomain: "registervbs-83306.firebaseapp.com",
    projectId: "registervbs-83306",
    storageBucket: "registervbs-83306.firebasestorage.app",
    messagingSenderId: "462529063270",
    appId: "1:462529063270:web:40c1333dc7c450345300a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const listElement = document.getElementById('explorerList');
const loadingElement = document.getElementById('loading');

async function getRegistrations() {
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        loadingElement.style.display = 'none';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement('li');
            li.style.margin = "10px 0";
            
            // Create a link for each name
            const a = document.createElement('a');
            a.href = `#`; // You can link to a detail page like `details.html?id=${doc.id}`
            a.textContent = data.childName;
            a.style.textDecoration = "none";
            a.style.color = "#3498db";
            a.style.fontWeight = "bold";
            
            a.onclick = () => alert(`Explorer: ${data.childName}\nGrade: ${data.grade}\nParent: ${data.email}`);

            li.appendChild(a);
            listElement.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
        loadingElement.textContent = "Error loading list. Check console.";
    }
}

getRegistrations();