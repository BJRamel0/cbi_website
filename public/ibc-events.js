document.addEventListener("DOMContentLoaded", function() {
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

    let currentIndex = 0;
    let itemsPerPage = 3; // Number of items to display per page
    let eventsData = []; // Array to store event data

    // Function to determine the number of items to display per page based on screen width
    function setItemsPerPage() {
        if (window.innerWidth >= 1300) {
            itemsPerPage = 3; // Display 3 items per page on screens wider than 1000px
        } else if (window.innerWidth < 1300 && window.innerWidth >= 875) {
            itemsPerPage = 2; // Display 2 item per page on screens between 700px and 1300px
        } else {
            itemsPerPage = 1; // Display 1 items per page on screens narrower than 700px
        }
    }

    // Function to fetch event data from JSON file
    async function fetchEventData() {
        try {
            const response = await fetch('../ibcevents.json'); // Assuming the JSON file is named ibcevents.json
            if (!response.ok) {
                throw new Error('Failed to fetch event data');
            }
            eventsData = await response.json();
            renderEvents();
            createCarouselDots(); // Call createCarouselDots after fetching data
        } catch (error) {
            console.error(error);
        }
    }

    // Function to create event rectangles
    function createEventRectangle(event) {
        const eventRectangle = document.createElement('div');
        eventRectangle.classList.add('w3-col', 's12', 'm6', 'l4'); // Adjust classes for responsiveness
        eventRectangle.innerHTML = `
            <div class="custom-event-rectangle">
                <div class="custom-event-details">
                    <h3>${event.name}</h3>
                </div>
                <div class="custom-event-image" style="background-image: url('${event.image}');" alt="${event.alt}"></div>
                <div class="custom-event-info">
                    <p>${event.organization}</p>
                    <p>${event.when}</p>
                </div>
            </div>
        `;
        return eventRectangle;
    }

    // Function to render events based on currentIndex
    function renderEvents() {
        const eventsContainer = document.querySelector('.w3-row-padding');
        eventsContainer.innerHTML = ''; // Clear existing content
        const endIndex = Math.min(currentIndex + itemsPerPage, eventsData.length);
        for (let i = currentIndex; i < endIndex; i++) {
            eventsContainer.appendChild(createEventRectangle(eventsData[i]));
        }
    }

    // Function to handle click on next button
    function nextButtonHandler() {
        currentIndex += itemsPerPage;
        if (currentIndex >= eventsData.length) {
            currentIndex = 0;
        }
        renderEvents();
        updateCarouselDots(); // Call updateCarouselDots after moving to next page
    }

    // Function to handle click on previous button
    function prevButtonHandler() {
        currentIndex -= itemsPerPage;
        if (currentIndex < 0) {
            currentIndex = Math.max(0, Math.floor((eventsData.length - 1) / itemsPerPage) * itemsPerPage);
        }
        renderEvents();
        updateCarouselDots(); // Call updateCarouselDots after moving to previous page
    }

    // Event listener for next button
    document.getElementById('nextButton').addEventListener('click', nextButtonHandler);

    // Event listener for previous button
    document.getElementById('prevButton').addEventListener('click', prevButtonHandler);

    // Fetch event data when DOM content is loaded
    fetchEventData();

    // Update itemsPerPage on window resize
    window.addEventListener('resize', function() {
        setItemsPerPage();
        renderEvents();
        createCarouselDots(); // Recreate dots on window resize
    });

    // Initialize itemsPerPage
    setItemsPerPage();
    renderEvents();
    createCarouselDots(); // Create dots initially

    // Change button color when window width is less than 390px
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 430) {
            document.getElementById('nextButton').style.color = 'white';
            document.getElementById('prevButton').style.color = 'white';
        } else {
            document.getElementById('nextButton').style.color = '#333'; // Reset to default color
            document.getElementById('prevButton').style.color = '#333'; // Reset to default color
        }
    });

    // Function to create carousel dots
    function createCarouselDots() {
        const dotsContainer = document.querySelector('.carousel-dots');
        dotsContainer.innerHTML = ''; // Clear existing dots

        for (let i = 0; i < Math.ceil(eventsData.length / itemsPerPage); i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === currentIndex / itemsPerPage) {
                dot.classList.add('active'); // Set the current page dot as active
            }
            dot.addEventListener('click', () => {
                currentIndex = i * itemsPerPage;
                renderEvents();
                updateCarouselDots();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Function to update carousel dots
    function updateCarouselDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex / itemsPerPage) {
                dot.classList.add('active'); // Set the current page dot as active
            } else {
                dot.classList.remove('active'); // Remove active class from other dots
            }
        });
    }

    // Touch event handling
    let touchStartX = 0;
    let touchEndX = 0;

    // Function to handle touch start event
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
    }

    // Function to handle touch move event
    function handleTouchMove(event) {
        touchEndX = event.touches[0].clientX;
    }

    // Function to handle touch end event and determine swipe direction
    function handleTouchEnd() {
        const threshold = 50; // Minimum distance for swipe gesture

        // Calculate swipe distance
        const swipeDistance = touchEndX - touchStartX;

        // Check if the swipe distance is greater than the threshold
        if (Math.abs(swipeDistance) > threshold) {
            if (swipeDistance < 0) {
                nextButtonHandler(); // Swipe left, move to next page
            } else {
                prevButtonHandler(); // Swipe right, move to previous page
            }
        }
    }

    // Add touch event listeners to document
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

});
