class MeterMeet {
    constructor() {
        // DOM Elements - Basic inputs
        this.attendeesInput = document.getElementById('attendees');
        this.hourlyRateInput = document.getElementById('hourlyRate');
        this.durationInput = document.getElementById('duration');
        this.overheadInput = document.getElementById('overhead');
        this.overheadRange = document.getElementById('overheadRange');
        this.alertThresholdInput = document.getElementById('alertThreshold');
        
        // DOM Elements - New UI elements
        this.themeToggle = document.getElementById('themeToggle');
        this.currencySelect = document.getElementById('currencySelect');
        this.avgRateBtn = document.getElementById('avgRateBtn');
        this.individualRateBtn = document.getElementById('individualRateBtn');
        this.averageRateGroup = document.getElementById('averageRateGroup');
        this.individualRatesGroup = document.getElementById('individualRatesGroup');
        this.individualRatesContainer = document.getElementById('individualRatesContainer');
        
        // DOM Elements - Displays
        this.totalCostDisplay = document.getElementById('totalCost');
        this.costPerMinuteDisplay = document.getElementById('costPerMinute');
        this.costPerSecondDisplay = document.getElementById('costPerSecond');
        this.costPerSecondLive = document.getElementById('costPerSecondLive');
        
        // DOM Elements - Timer
        this.timerDisplay = document.getElementById('timerDisplay');
        this.timerCostDisplay = document.getElementById('timerCost');
        this.progressFill = document.getElementById('progressFill');
        
        // DOM Elements - Controls
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.exportBtn = document.getElementById('exportBtn');
        
        // DOM Elements - Alerts
        this.alertContainer = document.getElementById('alertContainer');
        this.alert = document.getElementById('alert');
        this.alertMessage = document.getElementById('alertMessage');
        this.alertClose = document.getElementById('alertClose');
        
        // Application state
        this.state = {
            // Timer state
            timer: {
                isRunning: false,
                isPaused: false,
                startTime: null,
                pausedTime: 0,
                elapsedTime: 0,
                intervalId: null
            },
            
            // UI state
            ui: {
                theme: 'auto',
                currency: 'USD',
                rateMode: 'average', // 'average' or 'individual'
                lastCostMilestone: 0,
                alertShown: false
            },
            
            // Meeting configuration
            meeting: {
                attendees: 5,
                rates: [75], // Array to support individual rates
                duration: 60,
                overhead: 20,
                alertThreshold: 500
            }
        };
        
        // Currency configurations
        this.currencies = {
            USD: { symbol: '$', locale: 'en-US' },
            EUR: { symbol: '€', locale: 'de-DE' },
            GBP: { symbol: '£', locale: 'en-GB' },
            QAR: { symbol: 'ر.ق', locale: 'ar-QA' },
            TND: { symbol: 'د.ت', locale: 'ar-TN' },
            CAD: { symbol: 'C$', locale: 'en-CA' },
            AUD: { symbol: 'A$', locale: 'en-AU' },
            JPY: { symbol: '¥', locale: 'ja-JP' },
            CHF: { symbol: 'Fr', locale: 'de-CH' }
        };
        
        // Meeting presets
        this.presets = {
            standup: {
                name: 'Daily Standup',
                attendees: 8,
                rates: [65],
                duration: 15,
                overhead: 25,
                alertThreshold: 300
            },
            planning: {
                name: 'Sprint Planning',
                attendees: 6,
                rates: [85],
                duration: 120,
                overhead: 30,
                alertThreshold: 800
            },
            allhands: {
                name: 'All Hands',
                attendees: 50,
                rates: [75],
                duration: 60,
                overhead: 35,
                alertThreshold: 3000
            }
        };
        
        this.init();
    }
    
    init() {
        // Initialize theme
        this.initializeTheme();
        
        // Add event listeners for real-time calculations
        this.attendeesInput.addEventListener('input', () => this.handleAttendeesChange());
        this.hourlyRateInput.addEventListener('input', () => this.calculateCosts());
        this.durationInput.addEventListener('input', () => this.calculateCosts());
        this.overheadInput.addEventListener('input', () => this.syncOverheadInputs('number'));
        this.overheadRange.addEventListener('input', () => this.syncOverheadInputs('range'));
        this.alertThresholdInput.addEventListener('input', () => this.calculateCosts());
        
        // New UI event listeners
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.currencySelect.addEventListener('change', () => this.changeCurrency());
        this.avgRateBtn.addEventListener('click', () => this.switchRateMode('average'));
        this.individualRateBtn.addEventListener('click', () => this.switchRateMode('individual'));
        
        // Input increment/decrement buttons
        this.setupInputButtons();
        
        // Preset buttons
        this.setupPresetButtons();
        
        // Timer controls
        this.startBtn.addEventListener('click', () => this.startTimer());
        this.pauseBtn.addEventListener('click', () => this.pauseTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.exportBtn.addEventListener('click', () => this.exportData());
        
        // Alert close
        this.alertClose.addEventListener('click', () => this.hideAlert());
        
        // Load saved configuration
        this.loadConfiguration();
        
        // Generate initial individual rates if needed
        this.generateIndividualRates();
        
        // Initial calculation
        this.calculateCosts();
        this.updateTimerDisplay();
        this.updateCurrencyDisplay();
    }
    
    calculateCosts() {
        const attendees = parseInt(this.attendeesInput.value) || 0;
        const duration = parseInt(this.durationInput.value) || 0;
        const overhead = parseFloat(this.overheadInput.value) || 0;
        
        let totalHourlyRate = 0;
        
        // Calculate total hourly rate based on mode
        if (this.state.ui.rateMode === 'average') {
            const hourlyRate = parseFloat(this.hourlyRateInput.value) || 0;
            totalHourlyRate = attendees * hourlyRate;
        } else {
            // Individual rates mode
            const individualRateInputs = this.individualRatesContainer.querySelectorAll('input');
            individualRateInputs.forEach(input => {
                totalHourlyRate += parseFloat(input.value) || 0;
            });
        }
        
        // Calculate base cost
        const baseCostPerMinute = totalHourlyRate / 60;
        const baseCostPerSecond = baseCostPerMinute / 60;
        
        // Apply overhead
        const overheadMultiplier = 1 + (overhead / 100);
        const costPerMinute = baseCostPerMinute * overheadMultiplier;
        const costPerSecond = baseCostPerSecond * overheadMultiplier;
        const totalCost = costPerMinute * duration;
        
        // Update displays with animation
        this.updateDisplay(this.totalCostDisplay, totalCost);
        this.updateDisplay(this.costPerMinuteDisplay, costPerMinute);
        this.updateDisplay(this.costPerSecondDisplay, costPerSecond);
        
        if (this.costPerSecondLive) {
            this.costPerSecondLive.textContent = this.formatCurrency(costPerSecond);
        }
        
        // Check for cost milestones (pulse animation every $100)
        this.checkCostMilestone(totalCost);
        
        // Check alert threshold
        this.checkAlertThreshold(totalCost);
        
        // Store current rates for timer
        this.currentCostPerSecond = costPerSecond;
        this.currentTotalCost = totalCost;
        
        // Update timer cost if running
        if (this.state.timer.isRunning || this.state.timer.elapsedTime > 0) {
            this.updateTimerCost();
            this.updateProgressBar();
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
    
    // Theme Management
    initializeTheme() {
        const savedTheme = localStorage.getItem('meterMeetTheme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme(systemTheme);
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('meterMeetTheme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.state.ui.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle icon
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        
        localStorage.setItem('meterMeetTheme', theme);
    }
    
    toggleTheme() {
        const newTheme = this.state.ui.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add bounce animation
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 150);
    }
    
    // Currency Management
    changeCurrency() {
        this.state.ui.currency = this.currencySelect.value;
        this.updateCurrencyDisplay();
        this.calculateCosts();
        this.saveConfiguration();
    }
    
    updateCurrencyDisplay() {
        const currency = this.currencies[this.state.ui.currency];
        const symbols = document.querySelectorAll('.currency-symbol');
        symbols.forEach(symbol => {
            symbol.textContent = currency.symbol;
        });
    }
    
    // Rate Mode Management
    switchRateMode(mode) {
        this.state.ui.rateMode = mode;
        
        // Update button states
        this.avgRateBtn.classList.toggle('active', mode === 'average');
        this.individualRateBtn.classList.toggle('active', mode === 'individual');
        
        // Show/hide appropriate sections
        this.averageRateGroup.style.display = mode === 'average' ? 'flex' : 'none';
        this.individualRatesGroup.style.display = mode === 'individual' ? 'flex' : 'none';
        
        if (mode === 'individual') {
            this.generateIndividualRates();
        }
        
        this.calculateCosts();
        this.saveConfiguration();
    }
    
    // Individual Rates Management
    generateIndividualRates() {
        const attendees = parseInt(this.attendeesInput.value) || 0;
        const averageRate = parseFloat(this.hourlyRateInput.value) || 75;
        
        this.individualRatesContainer.innerHTML = '';
        
        for (let i = 0; i < attendees; i++) {
            const rateDiv = document.createElement('div');
            rateDiv.className = 'individual-rate';
            rateDiv.innerHTML = `
                <div class="attendee-number">${i + 1}</div>
                <input 
                    type="number" 
                    value="${averageRate}" 
                    min="1" 
                    step="0.01"
                    data-attendee="${i}"
                    placeholder="Hourly rate"
                >
            `;
            
            const input = rateDiv.querySelector('input');
            input.addEventListener('input', () => this.calculateCosts());
            
            this.individualRatesContainer.appendChild(rateDiv);
        }
    }
    
    // Input Management
    handleAttendeesChange() {
        const attendees = parseInt(this.attendeesInput.value) || 0;
        
        // Validate range
        if (attendees < 1) this.attendeesInput.value = 1;
        if (attendees > 100) this.attendeesInput.value = 100;
        
        // Update individual rates if in individual mode
        if (this.state.ui.rateMode === 'individual') {
            this.generateIndividualRates();
        }
        
        this.calculateCosts();
    }
    
    syncOverheadInputs(source) {
        if (source === 'range') {
            this.overheadInput.value = this.overheadRange.value;
        } else {
            this.overheadRange.value = this.overheadInput.value;
        }
        this.calculateCosts();
    }
    
    setupInputButtons() {
        document.querySelectorAll('.input-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                const input = document.getElementById(target);
                const isIncrement = btn.classList.contains('increment');
                const currentValue = parseFloat(input.value) || 0;
                const step = parseFloat(input.step) || 1;
                
                if (isIncrement) {
                    input.value = Math.min(currentValue + step, parseFloat(input.max) || Infinity);
                } else {
                    input.value = Math.max(currentValue - step, parseFloat(input.min) || 0);
                }
                
                input.dispatchEvent(new Event('input'));
                
                // Visual feedback
                btn.style.transform = 'scale(0.9)';
                setTimeout(() => btn.style.transform = '', 100);
            });
        });
    }
    
    // Preset Management
    setupPresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetKey = btn.dataset.preset;
                this.applyPreset(presetKey);
                
                // Visual feedback
                btn.classList.add('shimmer');
                setTimeout(() => btn.classList.remove('shimmer'), 1000);
            });
        });
    }
    
    applyPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (!preset) return;
        
        this.attendeesInput.value = preset.attendees;
        this.hourlyRateInput.value = preset.rates[0];
        this.durationInput.value = preset.duration;
        this.overheadInput.value = preset.overhead;
        this.overheadRange.value = preset.overhead;
        this.alertThresholdInput.value = preset.alertThreshold;
        
        // If in individual mode, regenerate rates
        if (this.state.ui.rateMode === 'individual') {
            this.generateIndividualRates();
        }
        
        this.calculateCosts();
        this.saveConfiguration();
        
        // Show notification
        this.showNotification(`Applied ${preset.name} preset`, 'success');
    }
    
    // Animation and Visual Effects
    checkCostMilestone(cost) {
        const milestone = Math.floor(cost / 100) * 100;
        
        if (milestone > this.state.ui.lastCostMilestone && milestone > 0) {
            this.state.ui.lastCostMilestone = milestone;
            
            // Trigger pulse animation on total cost
            this.totalCostDisplay.parentElement.classList.add('pulse-animation');
            setTimeout(() => {
                this.totalCostDisplay.parentElement.classList.remove('pulse-animation');
            }, 600);
            
            // Update progress milestones
            this.updateProgressMilestones(cost);
            
            // Play milestone sound
            this.playMilestoneSound();
        }
    }
    
    updateProgressMilestones(currentCost) {
        const milestones = document.querySelectorAll('.milestone');
        milestones.forEach(milestone => {
            const cost = parseFloat(milestone.dataset.cost);
            if (currentCost >= cost) {
                milestone.classList.add('reached');
            } else {
                milestone.classList.remove('reached');
            }
        });
    }
    
    updateProgressBar() {
        if (!this.progressFill) return;
        
        const currentCost = this.state.timer.elapsedTime * (this.currentCostPerSecond || 0);
        const threshold = parseFloat(this.alertThresholdInput.value) || 500;
        const progress = Math.min((currentCost / threshold) * 100, 100);
        
        this.progressFill.style.width = `${progress}%`;
        
        // Change color based on progress
        if (progress >= 100) {
            this.progressFill.style.background = 'var(--danger-gradient)';
        } else if (progress >= 75) {
            this.progressFill.style.background = 'var(--warning-gradient)';
        } else {
            this.progressFill.style.background = 'var(--success-gradient)';
        }
    }
    
    playMilestoneSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Pleasant milestone sound (major chord)
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Milestone audio not supported');
        }
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-primary);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-lg);
            padding: var(--space-3) var(--space-4);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: var(--space-3);
            max-width: 300px;
            backdrop-filter: blur(var(--blur-sm));
            animation: slideInBounce 0.5s ease-out;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: var(--text-secondary);
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }
    
    formatCurrency(amount) {
        const currency = this.currencies[this.state.ui.currency];
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: this.state.ui.currency,
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
        if (this.state.timer.isPaused) {
            // Resume from pause
            this.state.timer.startTime = Date.now() - this.state.timer.pausedTime;
            this.state.timer.isPaused = false;
        } else {
            // Fresh start
            this.state.timer.startTime = Date.now();
            this.state.timer.pausedTime = 0;
            this.state.timer.elapsedTime = 0;
            this.state.ui.lastCostMilestone = 0; // Reset milestone tracking
        }
        
        this.state.timer.isRunning = true;
        
        // Update button states with icons
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.startBtn.querySelector('.btn-icon').textContent = '▶️';
        this.pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        
        // Start the interval
        this.state.timer.intervalId = setInterval(() => {
            this.updateTimer();
        }, 100); // Update every 100ms for smooth animation
        
        // Add visual feedback
        this.timerDisplay.classList.add('timer-pulse');
        this.showNotification('Timer started', 'success');
    }
    
    pauseTimer() {
        this.state.timer.isRunning = false;
        this.state.timer.isPaused = true;
        
        // Clear interval
        if (this.state.timer.intervalId) {
            clearInterval(this.state.timer.intervalId);
            this.state.timer.intervalId = null;
        }
        
        // Store paused time
        this.state.timer.pausedTime = this.state.timer.elapsedTime;
        
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.querySelector('.btn-icon').textContent = '▶️';
        this.pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        
        // Remove visual feedback
        this.timerDisplay.classList.remove('timer-pulse');
        this.showNotification('Timer paused', 'info');
    }
    
    resetTimer() {
        // Stop timer if running
        this.state.timer.isRunning = false;
        this.state.timer.isPaused = false;
        
        if (this.state.timer.intervalId) {
            clearInterval(this.state.timer.intervalId);
            this.state.timer.intervalId = null;
        }
        
        // Reset all time values
        this.state.timer.startTime = null;
        this.state.timer.pausedTime = 0;
        this.state.timer.elapsedTime = 0;
        this.state.ui.lastCostMilestone = 0;
        
        // Update button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.startBtn.querySelector('.btn-icon').textContent = '▶️';
        this.pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        
        // Update displays
        this.updateTimerDisplay();
        this.updateTimerCost();
        this.updateProgressBar();
        
        // Reset milestones
        document.querySelectorAll('.milestone').forEach(m => m.classList.remove('reached'));
        
        // Remove visual feedback
        this.timerDisplay.classList.remove('timer-pulse');
        
        // Hide alert if cost is reset
        this.hideAlert();
        this.state.ui.alertShown = false;
        
        this.showNotification('Timer reset', 'info');
    }
    
    updateTimer() {
        if (!this.state.timer.isRunning) return;
        
        this.state.timer.elapsedTime = (Date.now() - this.state.timer.startTime) / 1000;
        this.updateTimerDisplay();
        this.updateTimerCost();
        this.updateProgressBar();
        
        // Check alert threshold with current cost
        const currentCost = this.state.timer.elapsedTime * (this.currentCostPerSecond || 0);
        this.checkAlertThreshold(currentCost, true);
        
        // Check for cost milestones during timer
        this.checkCostMilestone(currentCost);
    }
    
    updateTimerDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.state.timer.elapsedTime);
    }
    
    updateTimerCost() {
        const cost = this.state.timer.elapsedTime * (this.currentCostPerSecond || 0);
        this.timerCostDisplay.textContent = this.formatCurrency(cost);
    }
    
    checkAlertThreshold(cost, isTimer = false) {
        const threshold = parseFloat(this.alertThresholdInput.value) || 500;
        
        if (cost >= threshold && !this.state.ui.alertShown) {
            this.showAlert(cost, threshold, isTimer);
        } else if (cost < threshold && this.state.ui.alertShown) {
            this.hideAlert();
            this.state.ui.alertShown = false;
        }
    }
    
    showAlert(cost, threshold, isTimer = false) {
        this.state.ui.alertShown = true;
        
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
            this.state.ui.alertShown = false;
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
    
    // Data Export
    exportData() {
        const meetingData = {
            configuration: {
                attendees: parseInt(this.attendeesInput.value),
                rateMode: this.state.ui.rateMode,
                averageRate: parseFloat(this.hourlyRateInput.value),
                individualRates: this.getIndividualRates(),
                duration: parseInt(this.durationInput.value),
                overhead: parseFloat(this.overheadInput.value),
                alertThreshold: parseFloat(this.alertThresholdInput.value),
                currency: this.state.ui.currency
            },
            calculations: {
                totalCost: this.currentTotalCost || 0,
                costPerMinute: (this.currentCostPerSecond || 0) * 60,
                costPerSecond: this.currentCostPerSecond || 0
            },
            session: {
                elapsedTime: this.state.timer.elapsedTime,
                currentCost: this.state.timer.elapsedTime * (this.currentCostPerSecond || 0),
                isRunning: this.state.timer.isRunning
            },
            metadata: {
                exportDate: new Date().toISOString(),
                theme: this.state.ui.theme
            }
        };
        
        this.downloadJSON(meetingData, `meeting-cost-${new Date().toISOString().split('T')[0]}.json`);
        this.showNotification('Meeting data exported', 'success');
    }
    
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    getIndividualRates() {
        if (this.state.ui.rateMode !== 'individual') return [];
        
        const rates = [];
        const inputs = this.individualRatesContainer.querySelectorAll('input');
        inputs.forEach(input => {
            rates.push(parseFloat(input.value) || 0);
        });
        return rates;
    }
    
    // Configuration Management
    saveConfiguration() {
        const config = {
            meeting: {
                attendees: this.attendeesInput.value,
                hourlyRate: this.hourlyRateInput.value,
                duration: this.durationInput.value,
                overhead: this.overheadInput.value,
                alertThreshold: this.alertThresholdInput.value,
                individualRates: this.getIndividualRates()
            },
            ui: {
                theme: this.state.ui.theme,
                currency: this.state.ui.currency,
                rateMode: this.state.ui.rateMode
            },
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('meterMeetConfig', JSON.stringify(config));
    }
    
    loadConfiguration() {
        const savedConfig = localStorage.getItem('meterMeetConfig');
        if (!savedConfig) return;
        
        try {
            const config = JSON.parse(savedConfig);
            
            // Load UI preferences
            if (config.ui) {
                if (config.ui.theme) {
                    this.setTheme(config.ui.theme);
                }
                if (config.ui.currency) {
                    this.state.ui.currency = config.ui.currency;
                    this.currencySelect.value = config.ui.currency;
                }
                if (config.ui.rateMode) {
                    this.switchRateMode(config.ui.rateMode);
                }
            }
            
            // Load meeting configuration
            if (config.meeting) {
                if (config.meeting.attendees) this.attendeesInput.value = config.meeting.attendees;
                if (config.meeting.hourlyRate) this.hourlyRateInput.value = config.meeting.hourlyRate;
                if (config.meeting.duration) this.durationInput.value = config.meeting.duration;
                if (config.meeting.overhead) {
                    this.overheadInput.value = config.meeting.overhead;
                    this.overheadRange.value = config.meeting.overhead;
                }
                if (config.meeting.alertThreshold) this.alertThresholdInput.value = config.meeting.alertThreshold;
            }
            
        } catch (error) {
            console.log('Could not load saved configuration:', error);
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
        meterMeet.saveConfiguration();
    }
});

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch(e.key.toLowerCase()) {
        case ' ':
        case 'enter':
            e.preventDefault();
            if (meterMeet.state.timer.isRunning) {
                meterMeet.pauseTimer();
            } else {
                meterMeet.startTimer();
            }
            break;
        case 'escape':
        case 'r':
            e.preventDefault();
            meterMeet.resetTimer();
            break;
        case 't':
            e.preventDefault();
            meterMeet.toggleTheme();
            break;
        case 'e':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                meterMeet.exportData();
            }
            break;
        case '1':
            meterMeet.applyPreset('standup');
            break;
        case '2':
            meterMeet.applyPreset('planning');
            break;
        case '3':
            meterMeet.applyPreset('allhands');
            break;
    }
});

// Initialize the application
let meterMeet;
document.addEventListener('DOMContentLoaded', () => {
    meterMeet = new MeterMeet();
    
    // Add keyboard shortcuts info to the page (optional)
    console.log('MeterMeet Enhanced - Keyboard Shortcuts:');
    console.log('- Space/Enter: Start/Pause timer');
    console.log('- Escape/R: Reset timer');
    console.log('- T: Toggle theme');
    console.log('- Ctrl+E: Export data');
    console.log('- 1: Apply Daily Standup preset');
    console.log('- 2: Apply Sprint Planning preset');
    console.log('- 3: Apply All Hands preset');
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