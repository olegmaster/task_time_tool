document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const toggleTimerBtn = document.getElementById('toggleTimerBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const entriesList = document.getElementById('entriesList');
    let timer = null;
    let seconds = 0;
    let startTime = null;
    let running = false;

    // Load existing entries from local storage
    const loadEntries = () => {
        const entries = JSON.parse(localStorage.getItem('timeEntries')) || [];
        // Reverse the array to display the most recent entry first
        entriesList.innerHTML = entries.reverse().map(entry =>
            `<li>${entry.description} - ${entry.category} - Duration: ${entry.duration} - Start: ${entry.startTime} - End: ${entry.endTime}</li>`
        ).join('');
    }

    // Update timer display
    const updateDisplay = () => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
    }

    // Start or stop the timer
    toggleTimerBtn.addEventListener('click', () => {
        if (!running) {
            running = true;
            toggleTimerBtn.textContent = 'Stop Timer';
            startTime = new Date().toLocaleTimeString();
            timer = setInterval(() => {
                seconds++;
                updateDisplay();
            }, 1000);
        } else {
            running = false;
            toggleTimerBtn.textContent = 'Start Timer';
            clearInterval(timer);
            const endTime = new Date().toLocaleTimeString();

            // Save the entry to local storage
            const entries = JSON.parse(localStorage.getItem('timeEntries')) || [];
            entries.push({
                description: taskInput.value,
                category: categoryInput.value,
                duration: timerDisplay.textContent,
                startTime: startTime,
                endTime: endTime
            });
            localStorage.setItem('timeEntries', JSON.stringify(entries));
            loadEntries();

            // Reset inputs and timer
            taskInput.value = '';
            categoryInput.value = '';
            seconds = 0;
            updateDisplay();
        }
    });

    // Initially load entries
    loadEntries();
});