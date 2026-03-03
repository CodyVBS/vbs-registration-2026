// ... (Firebase initialization remains the same) ...

function renderList(list) {
    const explorerList = document.getElementById('explorerList');
    explorerList.innerHTML = "";
    list.forEach(data => {
        const li = document.createElement('li');
        // Layout with specific line breaks for parent info and church
        li.innerHTML = `
            <div>
                <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                <span style="font-size: 0.95em; color: #333; line-height: 1.6;">
                    <strong>Parent:</strong> ${data.parentName}<br>
                    <strong>Phone:</strong> ${data.phone}<br>
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Pick-up:</strong> ${data.pickupNames || 'N/A'}<br>
                    <strong>Allergies:</strong> ${data.medicalNotes || 'None'}<br>
                    <strong>Special Notes:</strong> ${data.specialNotes || 'None'}<br>
                    <strong>Home Church:</strong> ${data.homeChurch || 'None'}
                </span>
            </div>
            <button onclick="window.deleteEntry('${data.id}')" style="background:#e74c3c; width: auto; padding: 8px 15px; font-size: 13px; margin-top:15px; color:white;">Delete</button>
        `;
        explorerList.appendChild(li);
    });
}

window.downloadRoster = () => {
    // CSV Header with space between "Special" and "Notes"
    let csv = "Child,Grade,Parent,Phone,Email,Church,PickUp,Allergies,Special Notes\n";
    currentRoster.forEach(d => {
        csv += `"${d.firstName} ${d.lastName}","${d.grade}","${d.parentName}","${d.phone}","${d.email}","${d.homeChurch}","${d.pickupNames}","${d.medicalNotes}","${d.specialNotes}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'VBS_Roster_2026.csv');
    a.click();
};

// ... (Rest of fetch and delete functions) ...
