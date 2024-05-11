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
});