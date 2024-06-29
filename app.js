document.addEventListener('DOMContentLoaded', () => {
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
