// Main application module using IIFE pattern for encapsulation
const App = (function () {
    // Cache DOM elements
    const DOM = {};

    const encodedData = {
        'cGhvbmVEYXRh': 'KzQxJTIwNzglMjA2NDklMjA3OSUyMDQ1',
        'ZW1haWxEYXRh': 'dGFtYXMuZGFydmFzQGdtYWlsLmNvbQ==',
        'YWRkcmVzc0RhdGE=': 'ODEzNCUyMEFkbGlzd2lsJTJDJTIwU3dpdHplcmxhbmQ='
    };

    // Initialize the application
    function init() {
        // Cache frequently accessed DOM elements
        cacheDOM();

        // Initialize all modules
        AnimationModule.init();
        UIModule.init();
        EventsModule.init();
    }

    // Cache all DOM elements that will be accessed frequently
    function cacheDOM() {
        DOM.body = document.body;
        DOM.container = document.querySelector('.container');
        DOM.menuToggle = document.querySelector('.mobile-menu-toggle');
        DOM.mainNav = document.querySelector('.main-nav');
        DOM.menuOverlay = document.querySelector('.menu-overlay');
        DOM.menuClose = document.querySelector('.mobile-menu-close');
        DOM.navLinks = document.querySelectorAll('.main-nav a');
        DOM.scrollToTopBtn = document.getElementById('scroll-to-top');
        DOM.skillLists = document.querySelectorAll('.skill-list');
        DOM.sections = document.querySelectorAll('section[id]');
        DOM.mainSections = document.querySelectorAll('.main-section');
        DOM.toggleIcons = document.querySelectorAll('.toggle-data');
        DOM.hiddenDataElements = document.querySelectorAll('.hidden-data');
    }

    // Animation Module - Handles all GSAP animations
    const AnimationModule = (function () {
        function init() {
            initializeAnimations();
        }

        function initializeAnimations() {
            // Register ScrollTrigger plugin
            gsap.registerPlugin(ScrollTrigger);

            // Set initial state for all elements to be animated
            gsap.set('.animate-element', {
                opacity: 0,
                y: 30
            });

            // Create a master timeline for coordinating all animations
            const masterTimeline = gsap.timeline();

            // Animate header with a special effect
            masterTimeline
                .to('header', {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                })
                .from('header h1', {
                    opacity: 0,
                    y: -20,
                    duration: 0.7,
                    ease: 'back.out(1.7)'
                }, '-=0.5')
                .from('header .subtitle', {
                    opacity: 0,
                    y: -10,
                    duration: 0.7,
                    ease: 'power2.out'
                }, '-=0.4');

            // Create sidebar timeline
            const sidebarTimeline = gsap.timeline();

            // Animate sidebar elements with staggered effect
            const sidebarElements = [
                '.contact-info',
                '.sidebar h2:nth-of-type(1)',
                '.sidebar .skill-list:nth-of-type(1)',
                '.sidebar h2:nth-of-type(2)',
                '.sidebar .skill-list:nth-of-type(2)',
                '.sidebar h2:nth-of-type(3)',
                '.sidebar .skill-list:nth-of-type(3)',
                '.sidebar h2:nth-of-type(4)',
                '.sidebar p'
            ];

            sidebarElements.forEach((element, index) => {
                sidebarTimeline.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                }, index * 0.15); // Stagger the animations
            });

            // Create main content timeline
            const mainContentTimeline = gsap.timeline();

            // Animate main content sections without scroll trigger
            DOM.mainSections.forEach((section, index) => {
                // Animate the section container
                mainContentTimeline.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                }, index * 0.15); // Stagger the animations

                // Animate the title and content with a slight delay
                const title = section.querySelector('.main-title');
                const paragraphs = section.querySelectorAll('p');
                const otherElements = section.querySelectorAll('.job, .education-item');

                if (title) {
                    mainContentTimeline.from(title, {
                        opacity: 0,
                        y: -15,
                        duration: 0.5,
                        ease: 'back.out(1.4)'
                    }, `-=${0.3 + index * 0.15}`);
                }

                if (paragraphs.length) {
                    mainContentTimeline.from(paragraphs, {
                        opacity: 0,
                        y: 20,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power2.out'
                    }, `-=${0.2 + index * 0.15}`);
                }

                if (otherElements.length) {
                    mainContentTimeline.from(otherElements, {
                        opacity: 0,
                        y: 15,
                        duration: 0.5,
                        stagger: 0.1,
                        ease: 'power1.out'
                    }, `-=${0.2 + index * 0.15}`);
                }
            });

            // Add special animation for skill list items
            const skillItems = document.querySelectorAll('.skill-list li');
            skillItems.forEach((item, index) => {
                const parentList = item.parentElement;
                const listIndex = Array.from(DOM.skillLists).indexOf(parentList);

                gsap.from(item, {
                    opacity: 0,
                    x: -20,
                    duration: 0.4,
                    ease: 'power1.out',
                    delay: 1.2 + (listIndex * 0.2) + (index * 0.05) // Stagger based on list and item position
                });
            });

            // Add sidebar and main content timelines to master timeline to run in parallel
            masterTimeline.add([sidebarTimeline, mainContentTimeline], 0.8);
        }

        return {
            init
        };
    })();

    // UI Module - Handles UI-related functionality
    const UIModule = (function () {
        function init() {
            initializePreviewText();
            initializeScrollToTop();
            initializeSmoothScrolling();
            initializeMobileMenu();
        }

        function initializePreviewText() {
            // Set dots for hidden data
            DOM.hiddenDataElements.forEach(element => {
                element.textContent = '•••••••••';
            });
        }

        function initializeScrollToTop() {
            // Show button when user scrolls down 300px from the top
            window.addEventListener('scroll', function () {
                if (window.pageYOffset > 300) {
                    DOM.scrollToTopBtn.classList.add('visible');
                } else {
                    DOM.scrollToTopBtn.classList.remove('visible');
                }
            });

            // Scroll to top when button is clicked
            DOM.scrollToTopBtn.addEventListener('click', function () {
                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        function initializeSmoothScrolling() {
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Get the target section id from the href
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                        // Close mobile menu if it's open
                        if (window.innerWidth <= 768) {
                            DOM.menuToggle.classList.remove('active');
                            DOM.mainNav.classList.remove('open');
                            DOM.menuOverlay.classList.remove('open');
                            DOM.body.classList.remove('menu-open');
                        }

                        // Get the target section's position
                        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;

                        // Add offset for header
                        const headerOffset = window.innerWidth <= 768 ? 60 : 20;
                        const offsetPosition = targetPosition - headerOffset;

                        // Smooth scroll to the target section
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        // Add active class to the clicked link
                        DOM.navLinks.forEach(link => link.classList.remove('active'));
                        this.classList.add('active');
                    }
                });
            });

            // Update active link on scroll - using throttled scroll event
            let scrollTimeout;
            window.addEventListener('scroll', function () {
                if (!scrollTimeout) {
                    scrollTimeout = setTimeout(function () {
                        updateActiveNavLink();
                        scrollTimeout = null;
                    }, 100); // Throttle to run at most every 100ms
                }
            });
        }

        function updateActiveNavLink() {
            let currentSection = '';

            DOM.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const scrollPosition = window.pageYOffset;
                const headerOffset = window.innerWidth <= 768 ? 60 : 20;

                if (scrollPosition >= sectionTop - headerOffset - 100) {
                    currentSection = '#' + section.getAttribute('id');
                }
            });

            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentSection) {
                    link.classList.add('active');
                }
            });
        }

        function initializeMobileMenu() {
            // Helper function to close the mobile menu
            function closeMobileMenu() {
                DOM.menuToggle.classList.remove('active');
                DOM.mainNav.classList.remove('open');
                DOM.body.classList.remove('menu-open');

                // Update ARIA attributes
                DOM.menuToggle.setAttribute('aria-expanded', 'false');

                // Hide menu overlay
                if (DOM.menuOverlay) {
                    DOM.menuOverlay.style.display = 'none';
                }
            }

            // Toggle menu when hamburger is clicked
            DOM.menuToggle.addEventListener('click', function (e) {
                // Prevent event from propagating to container
                e.stopPropagation();

                this.classList.toggle('active');
                DOM.mainNav.classList.toggle('open');

                // Add class to body to prevent scrolling
                DOM.body.classList.toggle('menu-open');

                // Update ARIA attributes
                const isExpanded = DOM.mainNav.classList.contains('open');
                DOM.menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');

                // Toggle menu overlay
                if (DOM.menuOverlay) {
                    DOM.menuOverlay.style.display = DOM.body.classList.contains('menu-open') ? 'block' : 'none';
                }

                // Optional: force a repaint to fix potential rendering issues
                DOM.mainNav.style.opacity = '0.99';
                setTimeout(() => {
                    DOM.mainNav.style.opacity = '1';
                }, 10);
            });

            // Prevent clicks on the navigation menu from propagating to the container
            DOM.mainNav.addEventListener('click', function (e) {
                e.stopPropagation();
            });

            // Close menu when close button is clicked
            DOM.menuClose.addEventListener('click', function () {
                closeMobileMenu();
            });

            // Close menu when a nav link is clicked
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', function () {
                    closeMobileMenu();
                });
            });

            // Close menu when clicking on the container while menu is open
            DOM.container.addEventListener('click', function (e) {
                // Don't close if the click was on the menu toggle button or its children
                if (e.target === DOM.menuToggle || DOM.menuToggle.contains(e.target)) {
                    return;
                }

                if (DOM.body.classList.contains('menu-open')) {
                    closeMobileMenu();
                }
            });

            // Close menu when clicking on the overlay
            if (DOM.menuOverlay) {
                DOM.menuOverlay.addEventListener('click', function () {
                    closeMobileMenu();
                });
            }
        }

        return {
            init
        };
    })();

    // Modal Module - Handles modal-related functionality
    const ModalModule = (function () {
        // Function to toggle data visibility with modal
        function toggleData(elementId, dataKey, iconElement) {
            // Decode the data - first base64 decode, then decode URI component
            const encodedValue = encodedData[dataKey];
            let decodedValue = atob(encodedValue);
            decodedValue = decodeURIComponent(decodedValue);

            // Get the label for the modal title
            const label = document.querySelector(`[data-target="${elementId}"]`).parentElement.querySelector('strong').textContent;

            // Show modal with the decoded value
            showModal(label, decodedValue, iconElement);

            // Change icon to eye-slash temporarily
            iconElement.classList.remove('fa-eye');
            iconElement.classList.add('fa-eye-slash');

            // Update ARIA attributes
            iconElement.setAttribute('aria-pressed', 'true');
            iconElement.setAttribute('aria-label', `Hide ${label.toLowerCase()}`);

            // Store the current icon element in a data attribute on the modal for later reference
            const modal = document.querySelector('.contact-modal');
            if (modal) {
                modal.setAttribute('data-icon-element', elementId);
            }
        }

        // Function to show modal
        function showModal(title, content, triggerElement) {
            // Save the element that had focus before opening the modal
            const previouslyFocusedElement = document.activeElement;

            // Remove any existing modal
            closeModal();

            // Create modal elements
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'contact-modal';
            modalOverlay.setAttribute('role', 'dialog');
            modalOverlay.setAttribute('aria-modal', 'true');
            modalOverlay.setAttribute('aria-labelledby', 'modal-title');
            modalOverlay.setAttribute('data-previously-focused', previouslyFocusedElement ? previouslyFocusedElement.id || 'body' : 'body');

            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';

            const modalHeader = document.createElement('div');
            modalHeader.className = 'modal-header';

            const modalTitle = document.createElement('h3');
            modalTitle.textContent = title;
            modalTitle.id = 'modal-title';

            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.setAttribute('aria-label', 'Close modal');
            closeButton.addEventListener('click', closeModal);

            const modalBody = document.createElement('div');
            modalBody.className = 'modal-body';
            modalBody.textContent = content;
            modalBody.id = 'modal-content';
            modalBody.setAttribute('tabindex', '0');

            // Assemble modal
            modalHeader.appendChild(modalTitle);
            modalHeader.appendChild(closeButton);
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(modalBody);
            modalOverlay.appendChild(modalContent);

            // Add to DOM
            DOM.body.appendChild(modalOverlay);

            // Set up focus trap for the modal
            setupFocusTrap(modalOverlay);

            // Add animation class after a small delay to trigger animation
            setTimeout(() => {
                modalContent.classList.add('show');
                // Focus the close button after the modal is shown
                closeButton.focus();
            }, 10);
        }

        // Function to set up focus trap for modal
        function setupFocusTrap(modalElement) {
            const focusableElements = modalElement.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                // Add event listener to keep focus within the modal
                modalElement.addEventListener('keydown', function (e) {
                    if (e.key === 'Tab') {
                        // If shift + tab and focus is on first element, move to last element
                        if (e.shiftKey && document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                        // If tab and focus is on last element, move to first element
                        else if (!e.shiftKey && document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                });
            }
        }

        // Function to close modal
        function closeModal() {
            const modal = document.querySelector('.contact-modal');
            if (modal) {
                const modalContent = modal.querySelector('.modal-content');
                modalContent.classList.remove('show');

                // Reset the icon when modal is closed
                const iconElementId = modal.getAttribute('data-icon-element');
                if (iconElementId) {
                    const iconElement = document.querySelector(`[data-target="${iconElementId}"]`);
                    if (iconElement) {
                        iconElement.classList.remove('fa-eye-slash');
                        iconElement.classList.add('fa-eye');

                        // Update ARIA attributes
                        iconElement.setAttribute('aria-pressed', 'false');
                        const label = iconElement.parentElement.querySelector('strong').textContent;
                        iconElement.setAttribute('aria-label', `Show ${label.toLowerCase()}`);
                    }
                }

                // Get the element that had focus before the modal was opened
                const previouslyFocusedId = modal.getAttribute('data-previously-focused');
                const previouslyFocusedElement = previouslyFocusedId && previouslyFocusedId !== 'body'
                    ? document.getElementById(previouslyFocusedId)
                    : null;

                // Remove modal after animation completes
                setTimeout(() => {
                    DOM.body.removeChild(modal);

                    // Restore focus to the element that had focus before the modal was opened
                    if (previouslyFocusedElement) {
                        previouslyFocusedElement.focus();
                    }
                }, 300);
            }
        }

        return {
            toggleData,
            closeModal
        };
    })();

    // Events Module - Handles event listeners
    const EventsModule = (function () {
        function init() {
            setupToggleDataEvents();
            setupSkillItemsEvents();
            setupModalEvents();
        }

        function setupToggleDataEvents() {
            // Using event delegation for toggle data icons
            const sidebar = document.querySelector('.sidebar');

            if (sidebar) {
                sidebar.addEventListener('click', function (e) {
                    // Check if the clicked element is a toggle data icon or its parent
                    const toggleIcon = e.target.closest('.toggle-data');

                    if (toggleIcon) {
                        const targetId = toggleIcon.getAttribute('data-target');
                        const dataKey = toggleIcon.getAttribute('data-key');
                        ModalModule.toggleData(targetId, dataKey, toggleIcon);
                    }
                });

                // Add keyboard event listener for accessibility
                sidebar.addEventListener('keydown', function (e) {
                    const toggleIcon = e.target.closest('.toggle-data');

                    if (toggleIcon && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        const targetId = toggleIcon.getAttribute('data-target');
                        const dataKey = toggleIcon.getAttribute('data-key');
                        ModalModule.toggleData(targetId, dataKey, toggleIcon);
                    }
                });
            }
        }

        function setupSkillItemsEvents() {
            // Using event delegation for skill items
            DOM.skillLists.forEach(skillList => {
                skillList.addEventListener('mouseover', function (e) {
                    if (e.target.tagName === 'LI') {
                        e.target.style.color = '#3498db';
                    }
                });

                skillList.addEventListener('mouseout', function (e) {
                    if (e.target.tagName === 'LI') {
                        e.target.style.color = 'white';
                    }
                });
            });
        }

        function setupModalEvents() {
            // Close modal when clicking outside or on close button
            document.addEventListener('click', function (event) {
                const modal = document.querySelector('.contact-modal');
                const closeBtn = document.querySelector('.modal-close');

                // Only process if we have a modal and the click is on the modal background (not its content) or close button
                if (modal && (event.target === modal || event.target === closeBtn)) {
                    ModalModule.closeModal();
                }
            });

            // Close modal with escape key
            document.addEventListener('keydown', function (event) {
                if (event.key === 'Escape') {
                    ModalModule.closeModal();
                }
            });
        }

        return {
            init
        };
    })();

    // Return public methods
    return {
        init
    };
})();

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    App.init();
});
