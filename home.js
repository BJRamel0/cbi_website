//home.js

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

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
});
