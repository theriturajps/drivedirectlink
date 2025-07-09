// DriveDirectLink - Enhanced JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const driveLinkInput = document.getElementById('driveLink');
    const convertBtn = document.getElementById('convertBtn');
    const resultSection = document.getElementById('result');
    const directLinkInput = document.getElementById('directLink');
    const copyBtn = document.getElementById('copyBtn');
    const errorDiv = document.getElementById('error');
    const errorText = document.getElementById('errorText');
    const faqItems = document.querySelectorAll('.faq-item');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    // Initialize
    initializeApp();

    function initializeApp() {
        setupEventListeners();
        setupSmoothScrolling();
        setupFAQAccordion();
        setupMobileMenu();
        setupScrollEffects();
        setupAnimations();
        trackUserInteractions();
    }

    function setupEventListeners() {
        // Convert button click
        convertBtn.addEventListener('click', handleConvert);
        
        // Enter key press in input
        driveLinkInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleConvert();
            }
        });

        // Copy button click
        copyBtn.addEventListener('click', handleCopy);

        // Input validation and effects
        driveLinkInput.addEventListener('input', handleInputChange);
        driveLinkInput.addEventListener('focus', handleInputFocus);
        driveLinkInput.addEventListener('blur', handleInputBlur);
    }

    function handleConvert() {
        const driveLink = driveLinkInput.value.trim();
        
        if (!driveLink) {
            showError('Please enter a Google Drive link');
            return;
        }

        if (!isValidGoogleDriveLink(driveLink)) {
            showError('Invalid Google Drive link format. Please enter a valid sharing link.');
            return;
        }

        // Show loading state
        setLoadingState(true);
        
        // Simulate processing time for better UX
        setTimeout(() => {
            try {
                const directLink = convertToDirectLink(driveLink);
                showResult(directLink);
                trackConversion('success');
                showSuccessAnimation();
            } catch (error) {
                showError(error.message);
                trackConversion('error', error.message);
            } finally {
                setLoadingState(false);
            }
        }, 1200);
    }

    function isValidGoogleDriveLink(link) {
        const driveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)\/view(\?usp=sharing)?$/;
        return driveRegex.test(link);
    }

    function convertToDirectLink(driveLink) {
        try {
            const match = driveLink.match(/\/file\/d\/([a-zA-Z0-9-_]+)\//);
            
            if (!match || !match[1]) {
                throw new Error('Could not extract file ID from the link');
            }
            
            const fileId = match[1];
            const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
            
            return directLink;
        } catch (error) {
            throw new Error('Failed to convert the link. Please check if the link is valid.');
        }
    }

    function showResult(directLink) {
        hideError();
        directLinkInput.value = directLink;
        
        // Animate result appearance
        resultSection.style.display = 'block';
        resultSection.style.opacity = '0';
        resultSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultSection.style.opacity = '1';
            resultSection.style.transform = 'translateY(0)';
        }, 100);
        
        // Smooth scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }

    function handleCopy() {
        if (!directLinkInput.value) return;
        
        navigator.clipboard.writeText(directLinkInput.value).then(() => {
            // Show success feedback
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Copied!</span>
            `;
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copied');
            }, 2000);
            
            trackUserAction('copy_link');
            showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            directLinkInput.select();
            document.execCommand('copy');
            showNotification('Link copied to clipboard!', 'success');
        });
    }

    function showError(message) {
        errorText.textContent = message;
        errorDiv.style.display = 'flex';
        resultSection.style.display = 'none';
        
        // Animate error appearance
        errorDiv.style.opacity = '0';
        errorDiv.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            errorDiv.style.opacity = '1';
            errorDiv.style.transform = 'translateY(0)';
        }, 100);
    }

    function hideError() {
        errorDiv.style.display = 'none';
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            convertBtn.classList.add('loading');
        } else {
            convertBtn.disabled = false;
            convertBtn.classList.remove('loading');
        }
    }

    function handleInputChange() {
        const value = driveLinkInput.value.trim();
        hideError();
        
        if (value && !isValidGoogleDriveLink(value)) {
            driveLinkInput.style.borderColor = 'var(--error-color)';
        } else {
            driveLinkInput.style.borderColor = 'var(--border-color)';
        }
    }

    function handleInputFocus() {
        driveLinkInput.parentElement.classList.add('focused');
    }

    function handleInputBlur() {
        driveLinkInput.parentElement.classList.remove('focused');
    }

    function setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to target
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function setupFAQAccordion() {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    function setupMobileMenu() {
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                // Mobile menu functionality can be added here
                console.log('Mobile menu clicked');
            });
        }
    }

    function setupScrollEffects() {
        // Update navigation highlighting based on scroll position
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });

        // Parallax effect for background elements
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.bg-particles');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    function setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-card, .step-card, .faq-item');
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    function showSuccessAnimation() {
        // Create success particle effect
        createParticleEffect();
    }

    function createParticleEffect() {
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--success-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            
            document.body.appendChild(particle);
            particles.push(particle);
            
            // Animate particle
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 100 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0, y = 0;
            let opacity = 1;
            
            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02;
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            requestAnimationFrame(animate);
        }
    }

    function trackUserInteractions() {
        // Track page views
        trackPageView();
        
        // Track button clicks
        convertBtn.addEventListener('click', () => trackUserAction('convert_clicked'));
        copyBtn.addEventListener('click', () => trackUserAction('copy_clicked'));
        
        // Track navigation
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                trackUserAction('nav_clicked', link.textContent);
            });
        });
    }

    function trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'DriveDirectLink - Google Drive Direct Download Link Converter',
                page_location: window.location.href
            });
        }
    }

    function trackUserAction(action, label = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: 'user_interaction',
                event_label: label,
                value: 1
            });
        }
    }

    function trackConversion(status, error = '') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                event_category: 'link_conversion',
                event_label: status,
                value: status === 'success' ? 1 : 0,
                error_message: error
            });
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--accent-primary)'
        };
        
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100px);
            transition: var(--transition-smooth);
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Utility functions for footer links
    window.reportIssue = function() {
        const subject = encodeURIComponent('DriveDirectLink - Issue Report');
        const body = encodeURIComponent('Please describe the issue you encountered:\n\n');
        window.open(`mailto:support@drivedirectlink.com?subject=${subject}&body=${body}`);
    };

    window.provideFeedback = function() {
        const subject = encodeURIComponent('DriveDirectLink - Feedback');
        const body = encodeURIComponent('Please share your feedback:\n\n');
        window.open(`mailto:support@drivedirectlink.com?subject=${subject}&body=${body}`);
    };

    window.showPrivacyPolicy = function() {
        const modal = createModal('Privacy Policy', `
            <div class="modal-section">
                <h3>Privacy Policy</h3>
                <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h4>Data Collection</h4>
                <p>DriveDirectLink processes Google Drive links locally in your browser. No data is sent to external servers or stored anywhere.</p>
                
                <h4>Cookies</h4>
                <p>We do not use cookies or store any personal information on your device.</p>
                
                <h4>Analytics</h4>
                <p>We may use anonymous analytics to improve our service, but no personal data is collected.</p>
                
                <h4>Contact</h4>
                <p>For questions about this privacy policy, contact us at privacy@drivedirectlink.com</p>
            </div>
        `);
        document.body.appendChild(modal);
    };

    window.showTerms = function() {
        const modal = createModal('Terms of Service', `
            <div class="modal-section">
                <h3>Terms of Service</h3>
                <p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>
                
                <h4>Acceptance of Terms</h4>
                <p>By using DriveDirectLink, you agree to these terms of service.</p>
                
                <h4>Service Description</h4>
                <p>DriveDirectLink converts Google Drive sharing links to direct download links for easier file access.</p>
                
                <h4>Limitations</h4>
                <p>This service is provided "as is" without warranties. Use at your own risk.</p>
                
                <h4>Changes</h4>
                <p>We may update these terms at any time. Continued use constitutes acceptance of new terms.</p>
            </div>
        `);
        document.body.appendChild(modal);
    };

    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button onclick="this.closest('.modal-overlay').parentElement.remove()" class="modal-close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                padding: 2rem;
                backdrop-filter: blur(10px);
            }
            .modal-content {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-lg);
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-lg);
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-lg);
                border-bottom: 1px solid var(--border-color);
            }
            .modal-header h2 {
                margin: 0;
                color: var(--text-primary);
                font-size: var(--font-size-2xl);
            }
            .modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: var(--spacing-xs);
                border-radius: var(--radius-sm);
                transition: var(--transition-fast);
            }
            .modal-close:hover {
                background: var(--border-color);
                color: var(--text-primary);
            }
            .modal-body {
                padding: var(--spacing-lg);
                color: var(--text-secondary);
                line-height: 1.6;
            }
            .modal-section h3, .modal-section h4 {
                color: var(--text-primary);
                margin-top: var(--spacing-lg);
                margin-bottom: var(--spacing-sm);
            }
            .modal-section h3:first-child {
                margin-top: 0;
            }
            .modal-section p {
                margin-bottom: var(--spacing-sm);
            }
        `;
        
        modal.appendChild(style);
        return modal;
    }

    // Performance optimization: Intersection Observer for animations
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        // Observe elements for scroll animations
        document.querySelectorAll('.feature-card, .step-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'var(--transition-slow)';
            animationObserver.observe(el);
        });
    }

    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});