import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// YOUR CONFIG HERE (Copy from Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form Submission Logic
const vbsForm = document.getElementById('vbsForm');

vbsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerText = "Registering...";

    try {
        await addDoc(collection(db, "registrations"), {
            childName: document.getElementById('childName').value,
            age: document.getElementById('childAge').value,
            grade: document.getElementById('grade').value,
            email: document.getElementById('parentEmail').value,
            phone: document.getElementById('parentPhone').value,
            allergies: document.getElementById('allergies').value,
            timestamp: new Date()
        });

        document.getElementById('message').innerText = "🎉 Registration Successful! See you at VBS!";
        vbsForm.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        document.getElementById('message').innerText = "Oops! Something went wrong. Please try again.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Register Explorer!";
    }
});