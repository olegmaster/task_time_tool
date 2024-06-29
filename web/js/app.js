document.addEventListener('DOMContentLoaded', () => {

    fetch('/site/read-time-track-data', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data2 => {
            console.log(data2);
            let data = JSON.parse(data2);
            console.log(data);
            if ('lastUpdate' in data) {
                let serverLastUpdate = new Date(data.lastUpdate);
                let localLastUpdate = new Date(localStorage.getItem('lastUpdate'));

                // Check if server's lastUpdate is newer than local's lastUpdate
                if (serverLastUpdate > localLastUpdate) {
                    // If so, update localStorage with server data
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                    });

                    // And reload the page
                    console.log('updated')
                    //location.reload();
                }

            }
        })
        .catch((error) => {
            console.error('Fatal Error');
            document.body.innerHTML = '';
        });

    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const toggleTimerBtn = document.getElementById('toggleTimerBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const entriesList = document.getElementById('entriesList');
    let timer = null;
    let elapsedSeconds = 0;

    function updateDisplay() {
        const hrs = Math.floor(elapsedSeconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((elapsedSeconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }

    function loadState() {
        const savedState = JSON.parse(localStorage.getItem('timerState'));
        if (savedState && savedState.running) {
            taskInput.value = savedState.description;
            categoryInput.value = savedState.category;
            const now = new Date();
            const start = new Date(savedState.startTime);
            elapsedSeconds = Math.floor((now - start) / 1000);
            startTimer();
        }
    }

    function saveState() {
        const state = {
            startTime: new Date().toISOString(),
            description: taskInput.value,
            category: categoryInput.value,
            running: true
        };
        localStorage.setItem('timerState', JSON.stringify(state));
    }

    function clearState() {
        localStorage.removeItem('timerState');
    }

    function startTimer() {
        timer = setInterval(() => {
            elapsedSeconds++;
            updateDisplay();
        }, 1000);
        toggleTimerBtn.textContent = 'Stop Timer';
        const savedState = JSON.parse(localStorage.getItem('timerState'));
        if(!savedState) {
            saveState();
        }
    }

    function stopTimer() {
        clearInterval(timer);
        timer = undefined;
        const timerState = JSON.parse(localStorage.getItem('timerState'));
        const entry = {
            description: taskInput.value,
            category: categoryInput.value,
            duration: timerDisplay.textContent,
            startTime: JSON.parse(localStorage.getItem('timerState')).startTime,
            endTime: new Date().toISOString()
        };
        const entries = JSON.parse(localStorage.getItem('timeEntries')) || [];
        entries.push(entry);
        localStorage.setItem('timeEntries', JSON.stringify(entries));
        loadEntries();
        clearState();
        resetForm();
    }

    function resetForm() {
        taskInput.value = '';
        categoryInput.value = '';
        elapsedSeconds = 0;
        updateDisplay();
        toggleTimerBtn.textContent = 'Start Timer';
    }

    function loadEntries() {
        const entries = JSON.parse(localStorage.getItem('timeEntries')) || [];
        // Reverse the array to show the most recent entries first
        entries.reverse();
        entriesList.innerHTML = entries.map(entry =>
            `<li>${entry.description} - ${entry.category} - ${entry.duration} - From: ${new Date(entry.startTime).toLocaleTimeString()} To: ${new Date(entry.endTime).toLocaleTimeString()}</li>`
        ).join('');
    }


    toggleTimerBtn.addEventListener('click', () => {
        if (!timer) {
            startTimer();
        } else {
            stopTimer();
        }
    });

    loadState();
    loadEntries();
});

document.getElementById("toggleTimerBtn").addEventListener("click", function() {
    let storageObj = {};

    // Iterate over each item in storage
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);

        storageObj[key] = value;
    }

    localStorage.setItem('lastUpdate', new Date().toISOString());

    let jsonData = JSON.stringify(storageObj);

    // Get CSRF token from meta tags
    let csrfToken = getCSRFToken();

    fetch('/site/save-time-track-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken // Send CSRF token in the header
        },
        body: JSON.stringify({
            time_track_data: jsonData
        }),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
});

// Function to get CSRF token from cookies
function getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
}
