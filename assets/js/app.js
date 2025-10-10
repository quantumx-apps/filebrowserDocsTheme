// Menu sticky
function windowScroll() {
    const navbar = document.getElementById("topnav");
    if(navbar!=null){
        if (
            document.body.scrollTop >= 50 ||
            document.documentElement.scrollTop >= 50
        ) {
            navbar.classList.add("nav-sticky");
        } else {
            navbar.classList.remove("nav-sticky");
        }
    }
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
})

// Toggle menu with localStorage persistence
function toggleMenu() {
    const toggleButton = document.getElementById('isToggle');
    const navigation = document.getElementById('navigation');

    if (!toggleButton || !navigation) return;

    toggleButton.classList.toggle('open');

    if (navigation.style.display === "block") {
        navigation.style.display = "none";
        localStorage.setItem('menu-disabled', 'true');
    } else {
        navigation.style.display = "block";
        localStorage.removeItem('menu-disabled'); // Remove key when enabled (default)
    }
}

// Initialize menu state from localStorage
function initMenuState() {
    const navigation = document.getElementById('navigation');
    const toggleButton = document.getElementById('isToggle');
    
    if (!navigation || !toggleButton) return;
    
    const isMenuDisabled = localStorage.getItem('menu-disabled') === 'true';
    
    // Set menu state based on localStorage
    if (isMenuDisabled) {
        // User previously disabled menu - keep it disabled
        navigation.style.display = "none";
        toggleButton.classList.remove('open');
    } else {
        // Default state - ensure menu is open
        navigation.style.display = "block";
        toggleButton.classList.add('open');
    }
}

// Initialize menu state when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMenuState();
});