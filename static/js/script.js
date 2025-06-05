document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('prediction-form');
    const inputs = form.querySelectorAll('input[type="number"]');
    const submitBtn = form.querySelector('.submit-btn');

    // Loading screen functionality
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.querySelector('.container');

    // Initially hide main content
    mainContent.style.visibility = 'hidden';
    mainContent.style.opacity = '0';

    // Hide loading screen after a few seconds and show main content
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Allow transition to finish before hiding completely
        loadingScreen.addEventListener('transitionend', () => {
            loadingScreen.style.display = 'none';
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
        }, { once: true });
    }, 3000); // 3000 milliseconds = 3 seconds

    // Add floating animation to header
    const header = document.querySelector('header');
    let headerY = 0;
    let headerDirection = 1;
    
    function animateHeader() {
        headerY += 0.1 * headerDirection;
        if (headerY > 5) headerDirection = -1;
        if (headerY < -5) headerDirection = 1;
        header.style.transform = `translateY(${headerY}px)`;
        requestAnimationFrame(animateHeader);
    }
    animateHeader();

    // Add input validation and formatting with animations
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value < 0) {
                this.value = 0;
                shakeElement(this);
            } else if (value > 10) {
                this.value = 10;
                shakeElement(this);
            } else if (value >= 0 && value <= 10) {
                 // Remove shake animation if value is valid after being invalid
                 this.style.animation = '';
            }
        });

        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.parentElement.style.transform = 'translateY(-5px)';
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.parentElement.style.transform = 'translateY(0)';
            if (!this.value) {
                this.parentElement.classList.remove('has-value');
            } else {
                this.parentElement.classList.add('has-value');
            }
        });
    });

    // Add form submission animation
    form.addEventListener('submit', function(e) {
        submitBtn.classList.add('loading');
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        submitBtn.appendChild(ripple);
        
        // Re-enable button after 2 seconds if there's an error
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            if(ripple.parentElement) {
                ripple.parentElement.removeChild(ripple);
            }
        }, 2000);
    });

    // Add smooth scrolling to results with parallax
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Animate confidence bars with a wave effect
        const confidenceBars = document.querySelectorAll('.confidence-fill');
        confidenceBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
                // Remove previous animation to allow re-triggering
                bar.style.animation = 'none';
                // Trigger reflow to restart animation
                bar.offsetHeight;
                bar.style.animation = `wave 1s ease-in-out ${index * 0.2}s`;
            }, 100);
        });
    }

    // Add parallax effect to background
    window.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
    });

    // Helper function for shake animation
    function shakeElement(element) {
        element.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        // Remove animation after it finishes so it can be triggered again
        element.addEventListener('animationend', () => {
            element.style.animation = '';
        }, { once: true });
    }

    // Add hover effect to result cards
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add typing effect to title
    const title = document.querySelector('h1');
    const originalText = title.textContent;
    title.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();
}); 
