// ... (keep the firebaseConfig and login logic the same as before)

async function fetchExplorers() {
    const explorerList = document.getElementById('explorerList');
    const countDisplay = document.getElementById('totalCount');
    
    try {
        const querySnapshot = await getDocs(collection(db, "registrations"));
        document.getElementById('loading').style.display = 'none';
        explorerList.innerHTML = ""; 
        countDisplay.textContent = querySnapshot.size;

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const id = docSnap.id;
            const li = document.createElement('li');
            li.style.cssText = "display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:12px 0;";
            
            li.innerHTML = `
                <div style="flex-grow: 1; padding-right: 15px;">
                    <strong>${data.lastName}, ${data.firstName}</strong> (Grade: ${data.grade})<br>
                    <span style="font-size: 0.9em; color: #666;">
                        Parent: ${data.parentName || 'N/A'}<br>
                        Church: ${data.homeChurch || 'None'} | Phone: ${data.phone}
                    </span>
                </div>
                <button onclick="window.deleteEntry('${id}')" 
                        style="background:#e74c3c; color:white; border:none; padding:8px 0; cursor:pointer; border-radius:4px; width: 80px; min-width: 80px; text-align: center; font-weight: bold;">
                    Delete
                </button>
            `;
            explorerList.appendChild(li);
        });
    } catch (e) {
        document.getElementById('err').textContent = "Database Error.";
    }
}
