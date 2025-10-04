class MeterMeet {
    constructor() {
        // DOM Elements
        this.attendeesInput = document.getElementById('attendees');
        this.hourlyRateInput = document.getElementById('hourlyRate');
        this.durationInput = document.getElementById('duration');
        this.overheadInput = document.getElementById('overhead');
        this.alertThresholdInput = document.getElementById('alertThreshold');
        
        this.totalCostDisplay = document.getElementById('totalCost');
        this.costPerMinuteDisplay = document.getElementById('costPerMinute');
        this.costPerSecondDisplay = document.getElementById('costPerSecond');
        
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerCostDisplay = document.getElementById('timerCost');
        
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.alertContainer = document.getElementById('alertContainer');
        this.alert = document.getElementById('alert');
        this.alertMessage = document.getElementById('alertMessage');
        this.alertClose = document.getElementById('alertClose');
        
        // Timer state
        this.timerState = {
            isRunning: false,
            isPaused: false,
            startTime: null,
            pausedTime: 0,
            elapsedTime: 0,
            intervalId: null
        };
        
        // Alert state
        this.alertShown = false;
        
        this.init();
    }
    
    init() {
        // Add event listeners for real-time calculations
        this.attendeesInput.addEventListener('input', () => this.calculateCosts());
        this.hourlyRateInput.addEventListener('input', () => this.calculateCosts());
        this.durationInput.addEventListener('input', () => this.calculateCosts());
        this.overheadInput.addEventListener('input', () => this.calculateCosts());
        this.alertThresholdInput.addEventListener('input', () => this.calculateCosts());
        
        // Timer controls
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        
        // Alert close
        this.alertClose.addEventListener('click', () => this.hideAlert());
        
        // Initial calculation
        this.calculateCosts();
        this.updateTimerDisplay();
        
        // Auto-hide alert after 10 seconds
        this.autoHideAlert();
    }
    
    calculateCosts() {
        const attendees = parseInt(this.attendeesInput.value) || 0;
        const hourlyRate = parseFloat(this.hourlyRateInput.value) || 0;
        const duration = parseInt(this.durationInput.value) || 0;
        const overhead = parseFloat(this.overheadInput.value) || 0;
        
        // Calculate base cost
        const baseCostPerMinute = (attendees * hourlyRate) / 60;
        const baseCostPerSecond = baseCostPerMinute / 60;
        
        // Apply overhead
        const overheadMultiplier = 1 + (overhead / 100);
        const costPerMinute = baseCostPerMinute * overheadMultiplier;
        const costPerSecond = baseCostPerSecond * overheadMultiplier;
        const totalCost = costPerMinute * duration;
        
        // Update displays
        this.updateDisplay(this.totalCostDisplay, totalCost);
        this.updateDisplay(this.costPerMinuteDisplay, costPerMinute);
        this.updateDisplay(this.costPerSecondDisplay, costPerSecond);
        
        // Check alert threshold
        this.checkAlertThreshold(totalCost);
        
        // Store current rates for timer
        this.currentCostPerSecond = costPerSecond;
        
        // Update timer cost if running
        if (this.timerState.isRunning || this.timerState.elapsedTime > 0) {
            this.updateTimerCost();
        }
    }
    
    updateDisplay(element, value) {
        element.textContent = this.formatCurrency(value);
        
        // Add animation class for visual feedback
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, 300);
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return [hours, minutes, secs]
            .map(unit => unit.toString().padStart(2, '0'))
            .join(':');
    }
    
    startTimer() {
        if (this.timerState.isPaused) {
            // Resume from pause
            this.timerState.startTime = Date.now() - this.timerState.pausedTime;
            this.timerState.isPaused = false;
        } else {
            // Fresh start
            this.timerState.startTime = Date.now();
            this.timerState.pausedTime = 0;
            this.timerState.elapsedTime = 0;
        }
        
        this.timerState.isRunning = true;
        
        // Update button states
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        
        // Start the interval
        this.timerState.intervalId = setInterval(() => {
            this.updateTimer();
        }, 100); // Update every 100ms for smooth animation
        
        // Add visual feedback
        this.timerDisplay.parentElement.classList.add('pulse');
    }
    
    pauseTimer() {
        this.timerState.isRunning = false;
        this.timerState.isPaused = true;
        
        // Clear interval
        if (this.timerState.intervalId) {
            clearInterval(this.timerState.intervalId);
            this.timerState.intervalId = null;
        }
        
        // Store paused time
        this.timerState.pausedTime = this.timerState.elapsedTime;
        
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        // Remove visual feedback
        this.timerDisplay.parentElement.classList.remove('pulse');
    }
    
    resetTimer() {
        // Stop timer if running
        this.timerState.isRunning = false;
        this.timerState.isPaused = false;
        
        if (this.timerState.intervalId) {
            clearInterval(this.timerState.intervalId);
            this.timerState.intervalId = null;
        }
        
        // Reset all time values
        this.timerState.startTime = null;
        this.timerState.pausedTime = 0;
        this.timerState.elapsedTime = 0;
        
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        // Update displays
        this.updateTimerDisplay();
        this.updateTimerCost();
        
        // Remove visual feedback
        this.timerDisplay.parentElement.classList.remove('pulse');
        
        // Hide alert if cost is reset
        this.hideAlert();
        this.alertShown = false;
    }
    
    updateTimer() {
        if (!this.timerState.isRunning) return;
        
        this.timerState.elapsedTime = (Date.now() - this.timerState.startTime) / 1000;
        this.updateTimerDisplay();
        this.updateTimerCost();
        
        // Check alert threshold with current cost
        const currentCost = this.timerState.elapsedTime * (this.currentCostPerSecond || 0);
        this.checkAlertThreshold(currentCost, true);
    }
    
    updateTimerDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.timerState.elapsedTime);
    }
    
    updateTimerCost() {
        const cost = this.timerState.elapsedTime * (this.currentCostPerSecond || 0);
        this.timerCostDisplay.textContent = this.formatCurrency(cost);
    }
    
    checkAlertThreshold(cost, isTimer = false) {
        const threshold = parseFloat(this.alertThresholdInput.value) || 500;
        
        if (cost >= threshold && !this.alertShown) {
            this.showAlert(cost, threshold, isTimer);
        } else if (cost < threshold && this.alertShown) {
            this.hideAlert();
            this.alertShown = false;
        }
    }
    
    showAlert(cost, threshold, isTimer = false) {
        this.alertShown = true;
        
        const message = isTimer 
            ? `Meeting cost has reached ${this.formatCurrency(cost)} (threshold: ${this.formatCurrency(threshold)})`
            : `Estimated meeting cost ${this.formatCurrency(cost)} exceeds your threshold of ${this.formatCurrency(threshold)}`;
        
        this.alertMessage.textContent = message;
        this.alert.classList.add('show', 'danger');
        
        // Auto-hide after 10 seconds
        this.autoHideAlert();
        
        // Add sound effect (if browser supports it)
        this.playAlertSound();
    }
    
    hideAlert() {
        this.alert.classList.remove('show', 'danger');
        setTimeout(() => {
            this.alertShown = false;
        }, 300);
    }
    
    autoHideAlert() {
        // Clear any existing timeout
        if (this.alertTimeout) {
            clearTimeout(this.alertTimeout);
        }
        
        this.alertTimeout = setTimeout(() => {
            this.hideAlert();
        }, 10000); // 10 seconds
    }
    
    playAlertSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Fallback: no sound if Web Audio API is not supported
            console.log('Audio notification not supported');
        }
    }
    
    // Utility method to validate inputs
    validateInputs() {
        const attendees = parseInt(this.attendeesInput.value);
        const hourlyRate = parseFloat(this.hourlyRateInput.value);
        const duration = parseInt(this.durationInput.value);
        
        if (attendees < 1 || attendees > 100) {
            this.attendeesInput.value = Math.max(1, Math.min(100, attendees || 1));
        }
        
        if (hourlyRate < 0) {
            this.hourlyRateInput.value = Math.max(0, hourlyRate || 0);
        }
        
        if (duration < 1 || duration > 480) {
            this.durationInput.value = Math.max(1, Math.min(480, duration || 60));
        }
    }
    
    // Method to export/save current configuration
    exportConfiguration() {
        return {
            attendees: this.attendeesInput.value,
            hourlyRate: this.hourlyRateInput.value,
            duration: this.durationInput.value,
            overhead: this.overheadInput.value,
            alertThreshold: this.alertThresholdInput.value,
            timestamp: new Date().toISOString()
        };
    }
    
    // Method to import/load configuration
    importConfiguration(config) {
        if (config.attendees) this.attendeesInput.value = config.attendees;
        if (config.hourlyRate) this.hourlyRateInput.value = config.hourlyRate;
        if (config.duration) this.durationInput.value = config.duration;
        if (config.overhead) this.overheadInput.value = config.overhead;
        if (config.alertThreshold) this.alertThresholdInput.value = config.alertThreshold;
        
        this.calculateCosts();
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields
    
    switch(e.key) {
        case ' ':
        case 'Enter':
            e.preventDefault();
            if (meterMeet.timerState.isRunning) {
                meterMeet.pauseTimer();
            } else {
                meterMeet.startTimer();
            }
            break;
        case 'Escape':
        case 'r':
        case 'R':
            e.preventDefault();
            meterMeet.resetTimer();
            break;
    }
});

// Save configuration to localStorage on page unload
window.addEventListener('beforeunload', () => {
    if (typeof meterMeet !== 'undefined') {
        const config = meterMeet.exportConfiguration();
        localStorage.setItem('meterMeetConfig', JSON.stringify(config));
    }
});

// Load configuration from localStorage on page load
window.addEventListener('load', () => {
    const savedConfig = localStorage.getItem('meterMeetConfig');
    if (savedConfig && typeof meterMeet !== 'undefined') {
        try {
            const config = JSON.parse(savedConfig);
            // Only load if it's from today (to prevent stale data)
            const configDate = new Date(config.timestamp);
            const today = new Date();
            if (configDate.toDateString() === today.toDateString()) {
                meterMeet.importConfiguration(config);
            }
        } catch (error) {
            console.log('Could not load saved configuration');
        }
    }
});

// Initialize the application
let meterMeet;
document.addEventListener('DOMContentLoaded', () => {
    meterMeet = new MeterMeet();
    
    // Add keyboard shortcuts info to the page (optional)
    console.log('MeterMeet Keyboard Shortcuts:');
    console.log('- Space/Enter: Start/Pause timer');
    console.log('- Escape/R: Reset timer');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Only register if service worker file exists
        fetch('/sw.js').then(() => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }).catch(() => {
            // Service worker file doesn't exist, skip registration
        });
    });
}

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MeterMeet;
}