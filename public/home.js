document.addEventListener("DOMContentLoaded", function() {
    // Select the carrot image
    const carrotImg = document.getElementById('carrot-img');

    // Add click event listener to the carrot image
    carrotImg.addEventListener('click', () => {
        // Get the img_0654 element
        const img0654 = document.querySelector('.mySlides');
        // Calculate the vertical position to scroll to (bottom of img_0654)
        const scrollToY = img0654.offsetTop + img0654.offsetHeight;

        // Calculate the current vertical position of the window
        const startY = window.pageYOffset || document.documentElement.scrollTop;

        // Calculate the distance to scroll
        const distance = scrollToY - startY;

        // Duration of the scroll animation in milliseconds
        const duration = 1000; // 1 second

        // Start time of the animation
        let startTime;

        // Function to perform the scroll animation
        function scrollAnimation(currentTime) {
            // Set the start time if not already set
            if (!startTime) {
                startTime = currentTime;
            }

            // Calculate the time elapsed since the start of the animation
            const timeElapsed = currentTime - startTime;

            // Calculate the next position to scroll to using easing function (e.g., easeInOutQuad)
            const nextPosition = easeInOutQuad(timeElapsed, startY, distance, duration);

            // Scroll to the next position
            window.scrollTo(0, nextPosition);

            // Continue the animation until duration is reached
            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        // Easing function for smooth scroll animation (e.g., easeInOutQuad)
        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        // Start the scroll animation
        requestAnimationFrame(scrollAnimation);
    });

    const img = document.querySelector('.mySlides');
    const offset = img.offsetHeight;

    // Function to handle scroll event
    function handleScroll() {
        if (window.pageYOffset > offset) {
            img.classList.add('image-scrolled');
        } else {
            img.classList.remove('image-scrolled');
        }
    }

    // Select the events dropdown button and content
    const eventsDropdownBtn = document.getElementById('eventsDropdown');
    const eventsDropdownContent = document.getElementById('eventsDropdownContent');

    // Function to toggle display of events dropdown content
    function toggleEventsDropdown() {
        eventsDropdownContent.classList.toggle('show');
    }

    // Event listener for events dropdown button
    eventsDropdownBtn.addEventListener('click', toggleEventsDropdown);

    // Event listener to close the dropdown when clicking outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.events-dropdown')) {
            if (eventsDropdownContent.classList.contains('show')) {
                eventsDropdownContent.classList.remove('show');
            }
        }
    });

    // Event listener for dropdown options
    document.querySelectorAll('#eventsDropdownContent a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default behavior
            const href = this.getAttribute('href'); // Get href attribute
            window.location.href = href; // Navigate to the URL
        });
    });

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
});
