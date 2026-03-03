// ... (Firebase initialization same as above) ...

document.getElementById('registrationForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = "Registering...";

    try {
        await addDoc(collection(db, "registrations"), {
            firstName: document.getElementById('childFirstName').value,
            lastName: document.getElementById('childLastName').value,
            grade: document.getElementById('grade').value,
            parentName: document.getElementById('parentName').value,
            phone: document.getElementById('parentPhone').value,
            email: document.getElementById('parentEmail').value,
            homeChurch: document.getElementById('homeChurch').value,
            pickupNames: document.getElementById('pickupNames').value,
            medicalNotes: document.getElementById('medicalNotes').value,
            specialNotes: document.getElementById('specialNotes').value,
            timestamp: new Date()
        });
        window.location.href = "success.html";
    } catch (error) {
        alert("Error: " + error.message);
        btn.disabled = false;
        btn.textContent = "Register Child";
    }
};
