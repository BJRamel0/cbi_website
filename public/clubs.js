// Function to fetch and populate club information
async function populateClubs() {
    try {
        const response = await fetch('../clubInformation.json');
        const clubs = await response.json();
        const clubInfoContainer = document.getElementById('clubInformation');
        const searchInput = document.getElementById('clubSearch');
        const filterOptions = document.getElementById('filterOptions');
        const filterDropdown = document.getElementById('filterDropdown'); // Added
        const majorOptions = document.querySelectorAll('#majorCategory input[type="checkbox"]');
        const sizeOptions = document.querySelectorAll('#sizeCategory input[type="checkbox"]');
        const exclusiveOptions = document.querySelectorAll('#exclusiveCategory input[type="checkbox"]');

        // Function to clear club information from the container
        function clearClubInfo() {
            clubInfoContainer.innerHTML = '';
        }

        // Function to filter clubs based on search query, size, exclusivity, and majors
        function filterClubs(query) {
            clearClubInfo(); // Clear existing club information
            try {
                const filteredClubs = clubs.filter(club => {
                    const nameMatch = club.name.toLowerCase().includes((query || '').toLowerCase());
                    const exclusiveMatch = !exclusiveOptions[0].checked || club.exclusive.toLowerCase() === 'yes';
                    const anyMajorSelected = Array.from(majorOptions).some(option => option.checked);
        
                    // Apply major filter if any major option is selected
                    const majorMatch = !anyMajorSelected || Array.from(majorOptions).some(option => {
                        if (option.checked) {
                            const selectedMajor = option.value.toLowerCase();
                            const clubMajors = club.majors.toLowerCase().split(', ');
                            return clubMajors.includes(selectedMajor);
                        }
                        return false; // If option is not checked, it's not a filter criterion
                    });
        
                    const anySizeSelected = Array.from(sizeOptions).some(option => option.checked);
                    const sizeMatch = !anySizeSelected || Array.from(sizeOptions).some(option => option.checked && club.size.toLowerCase() === option.value);
        
                    return nameMatch && exclusiveMatch && majorMatch && sizeMatch;
                });
        
                // Populate HTML with filtered clubs
                filteredClubs.forEach(club => {
                    const container = document.createElement('div');
                    container.classList.add('organization-section');
                    container.innerHTML = `
                        <div class="container">
                            <div class="organization-info">
                                <div class="organization-image">
                                    <img src="${club.image}" alt="${club.alt}">
                                </div>
                                <div class="organization-details">
                                    <h2>${club.name}</h2>
                                    <div class="social-media-buttons">
                                        <a href="${club.website}" target="_blank">Website</a>
                                        <a href="${club.instagram}" target="_blank">Instagram</a>
                                    </div>
                                    <p>${club.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    clubInfoContainer.appendChild(container);
                });
            } catch (error) {
                console.error('Error filtering clubs:', error);
            }
        }
        

    // Attach event listener to search input for live filtering
    searchInput.addEventListener('input', () => {
        filterClubs(searchInput.value);
    });


    // Function to handle filter button clicks
    function handleFilterChange() {
        // Apply filters
        filterClubs(searchInput.value);
    }

    // Function to toggle display of filter options
    function toggleFilterOptions() {
        filterOptions.classList.toggle('show'); // Toggle the 'show' class

        // Toggle display of sub-dropdowns when clicking on the main filter
        const subDropdowns = document.querySelectorAll('.sub-dropdown');
        subDropdowns.forEach(subDropdown => {
            subDropdown.classList.toggle('show'); // Toggle the 'show' class for sub-dropdowns
        });
    }

    // Attach event listeners to filter options
    filterDropdown.addEventListener('click', toggleFilterOptions); // Updated

    // Attach event listeners to category labels to toggle options visibility
    document.querySelectorAll('.filter-category').forEach(category => {
        const label = category.querySelector('span');
        const subDropdown = category.querySelector('.sub-dropdown');
        label.addEventListener('click', function() {
            subDropdown.style.display = subDropdown.style.display === 'block' ? 'none' : 'block'; // Toggle display
        });
    });

    // Attach event listeners to checkboxes to trigger filtering
    document.querySelectorAll('.size-checkbox, .exclusive-checkbox, .major-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });

    // Populate clubs initially
    filterClubs('');

    } catch (error) {
        console.error('Error fetching club information:', error);
    }
}

// Call the function to populate clubs when the page loads
window.onload = populateClubs;
