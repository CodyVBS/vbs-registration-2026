import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// YOUR CONFIG HERE (Copy from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyB9wVq525wCsxZmIZmfzj6Z5VjF2aSUu_g",
  authDomain: "registervbs-83306.firebaseapp.com",
  projectId: "registervbs-83306",
  storageBucket: "registervbs-83306.firebasestorage.app",
  messagingSenderId: "462529063270",
  appId: "1:462529063270:web:40c1333dc7c450345300a7"
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
