class TypingSpeedTester {
    constructor() {
        this.textSamples = [
            "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
            "In the heart of every winter, there is a quivering spring, and behind the veil of each night, there waits a smiling dawn.",
            "Technology has become an integral part of our daily lives, transforming the way we communicate, work, and learn.",
            "The art of programming requires patience, logic, and creativity. It is a skill that combines problem-solving with technical knowledge.",
            "Reading books opens doors to new worlds and perspectives, allowing us to explore ideas and experiences beyond our own.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts in the journey of life.",
            "The beauty of nature lies in its simplicity and complexity, offering endless inspiration for those who take time to observe.",
            "Learning a new language expands your horizons and connects you with different cultures around the world.",
        ];
        
        this.currentText = '';
        this.startTime = null;
        this.endTime = null;
        this.timerInterval = null;
        this.timeLeft = 60;
        this.isTestActive = false;
        this.typedCharacters = 0;
        this.errors = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.resetTest();
    }
    
    initializeElements() {
        this.textDisplay = document.getElementById('textDisplay');
        this.textInput = document.getElementById('textInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.timeElement = document.getElementById('time');
        this.wpmElement = document.getElementById('wpm');
        this.accuracyElement = document.getElementById('accuracy');
        this.resultsDiv = document.getElementById('results');
        this.finalWpmElement = document.getElementById('finalWpm');
        this.finalAccuracyElement = document.getElementById('finalAccuracy');
        this.charactersTypedElement = document.getElementById('charactersTyped');
        this.totalErrorsElement = document.getElementById('totalErrors');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.resetBtn.addEventListener('click', () => this.resetTest());
        this.textInput.addEventListener('input', () => this.handleInput());
        this.textInput.addEventListener('paste', (e) => e.preventDefault());
    }
    
    startTest() {
        this.isTestActive = true;
        this.startTime = Date.now();
        this.timeLeft = 60;
        this.typedCharacters = 0;
        this.errors = 0;
        
        this.textInput.disabled = false;
        this.textInput.value = '';
        this.textInput.focus();
        this.startBtn.disabled = true;
        this.resultsDiv.style.display = 'none';
        
        this.startTimer();
        this.updateDisplay();
    }
    
    resetTest() {
        this.isTestActive = false;
        this.startTime = null;
        this.endTime = null;
        this.timeLeft = 60;
        this.typedCharacters = 0;
        this.errors = 0;
        
        this.textInput.disabled = true;
        this.textInput.value = '';
        this.startBtn.disabled = false;
        this.resultsDiv.style.display = 'none';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.generateNewText();
        this.updateStats();
        this.updateDisplay();
    }
    
    generateNewText() {
        const randomIndex = Math.floor(Math.random() * this.textSamples.length);
        this.currentText = this.textSamples[randomIndex];
        this.displayText();
    }
    
    displayText() {
        const inputValue = this.textInput.value;
        let html = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const char = this.currentText[i];
            
            if (i < inputValue.length) {
                if (inputValue[i] === char) {
                    html += `<span class="correct">${char}</span>`;
                } else {
                    html += `<span class="incorrect">${char}</span>`;
                }
            } else if (i === inputValue.length) {
                html += `<span class="current">${char}</span>`;
            } else {
                html += char;
            }
        }
        
        this.textDisplay.innerHTML = html;
    }
    
    handleInput() {
        if (!this.isTestActive) return;
        
        const inputValue = this.textInput.value;
        this.typedCharacters = inputValue.length;
        
        // Count errors
        this.errors = 0;
        for (let i = 0; i < inputValue.length; i++) {
            if (i < this.currentText.length && inputValue[i] !== this.currentText[i]) {
                this.errors++;
            }
        }
        
        this.updateDisplay();
        this.updateStats();
        
        // Check if test is complete
        if (inputValue === this.currentText) {
            this.endTest();
        }
        
        // Prevent typing beyond the text length
        if (inputValue.length > this.currentText.length) {
            this.textInput.value = inputValue.substring(0, this.currentText.length);
        }
    }
    
    updateDisplay() {
        this.displayText();
    }
    
    updateStats() {
        // Update time
        this.timeElement.textContent = `${this.timeLeft}s`;
        
        // Calculate WPM
        const timeElapsed = this.isTestActive ? (Date.now() - this.startTime) / 1000 / 60 : 0;
        const wordsTyped = this.typedCharacters / 5; // Standard: 5 characters = 1 word
        const wpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        this.wpmElement.textContent = wpm;
        
        // Calculate accuracy
        const accuracy = this.typedCharacters > 0 ? 
            Math.round(((this.typedCharacters - this.errors) / this.typedCharacters) * 100) : 100;
        this.accuracyElement.textContent = `${accuracy}%`;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateStats();
            
            if (this.timeLeft <= 0) {
                this.endTest();
            }
        }, 1000);
    }
    
    endTest() {
        this.isTestActive = false;
        this.endTime = Date.now();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.textInput.disabled = true;
        this.startBtn.disabled = false;
        
        this.showResults();
    }
    
    showResults() {
        const timeElapsed = (this.endTime - this.startTime) / 1000 / 60;
        const wordsTyped = this.typedCharacters / 5;
        const wpm = Math.round(wordsTyped / timeElapsed);
        const accuracy = this.typedCharacters > 0 ? 
            Math.round(((this.typedCharacters - this.errors) / this.typedCharacters) * 100) : 100;
        
        this.finalWpmElement.textContent = wpm;
        this.finalAccuracyElement.textContent = `${accuracy}%`;
        this.charactersTypedElement.textContent = this.typedCharacters;
        this.totalErrorsElement.textContent = this.errors;
        
        this.resultsDiv.style.display = 'block';
        
        // Scroll to results
        this.resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the typing speed tester when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TypingSpeedTester();
});