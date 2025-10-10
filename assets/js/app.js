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

    console.log('🔍 Menu Debug - initMenuState called');
    console.log('navigation:', navigation);
    console.log('toggleButton:', toggleButton);

    if (!navigation || !toggleButton) {
        console.log('❌ Missing menu elements, returning early');
        return;
    }

    const savedState = localStorage.getItem('menu-disabled');
    const isMenuDisabled = savedState === 'true';

    console.log('📦 localStorage menu-disabled:', savedState);
    console.log('🔍 isMenuDisabled:', isMenuDisabled);
    console.log('🎯 Initial navigation display:', navigation.style.display);
    console.log('🎯 Initial toggleButton classes:', toggleButton.className);

    // Set menu state based on localStorage
    if (isMenuDisabled) {
        // User previously disabled menu - keep it disabled
        navigation.style.display = "none";
        toggleButton.classList.remove('open');
        console.log('🔒 Applied disabled state from localStorage');
        console.log('📱 Final navigation display:', navigation.style.display);
        console.log('📱 Final toggleButton classes:', toggleButton.className);
    } else {
        // Default state - ensure menu is open
        navigation.style.display = "block";
        toggleButton.classList.add('open');
        console.log('🔓 Applied enabled state (default)');
        console.log('📱 Final navigation display:', navigation.style.display);
        console.log('📱 Final toggleButton classes:', toggleButton.className);
    }
}

// Initialize menu state when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMenuState();
});