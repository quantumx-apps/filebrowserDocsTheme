/* Template Name: LotusLabs Docs
   Author: Colin Wilson
   E-mail: colin@aigis.uk
   Created: October 2022
   Version: 1.0.0
   File Description: Main JS file of the docs template
*/


/*********************************/
/*         INDEX                 */
/*================================
 *     01.  Toggle Menus         *
 *     02.  Active Menu          *
 *     03.  Clickable Menu       *
 *     04.  Back to top          *
 *     05.  DD Menu              *
 *     06.  Active Sidebar Menu  *
 *     07.  ScrollSpy            *
 ================================*/


// Menu
// Toggle menu
function toggleMenu() {
    document.getElementById('isToggle').classList.toggle('open');
    var isOpen = document.getElementById('navigation')
    if (isOpen.style.display === "block") {
        isOpen.style.display = "none";
    } else {
        isOpen.style.display = "block";
    }
};

// Menu Active
function getClosest(elem, selector) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { }
                return i > -1;
            };
    }

    // Get the closest matching element
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;

};

function activateMenu() {
    var menuItems = document.getElementsByClassName("sub-menu-item");
    if (menuItems) {

        var matchingMenuItem = null;
        for (var idx = 0; idx < menuItems.length; idx++) {
            if (menuItems[idx].href === window.location.href) {
                matchingMenuItem = menuItems[idx];
            }
        }

        if (matchingMenuItem) {
            matchingMenuItem.classList.add('active');
            var immediateParent = getClosest(matchingMenuItem, 'li');
            if (immediateParent) {
                immediateParent.classList.add('active');
            }

            var parent = getClosest(matchingMenuItem, '.parent-menu-item');
            if (parent) {
                parent.classList.add('active');
                var parentMenuitem = parent.querySelector('.menu-item');
                if (parentMenuitem) {
                    parentMenuitem.classList.add('active');
                }
                var parentOfParent = getClosest(parent, '.parent-parent-menu-item');
                if (parentOfParent) {
                    parentOfParent.classList.add('active');
                }
            } else {
                var parentOfParent = getClosest(matchingMenuItem, '.parent-parent-menu-item');
                if (parentOfParent) {
                    parentOfParent.classList.add('active');
                }
            }
        }
    }
}


// Sidebar Menu
function activateSidebarMenu() {
    var current = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
    if (current !== "" && document.getElementById("sidebar")) {
        var menuItems = document.querySelectorAll('#sidebar button');
        for (var i = 0, len = menuItems.length; i < len; i++) {
            if (menuItems[i].getAttribute("href").indexOf(current) !== -1) {
                menuItems[i].parentElement.className += " active";
                if (menuItems[i].closest(".sidebar-submenu")) {
                    menuItems[i].closest(".sidebar-submenu").classList.add("d-block");
                }
                if (menuItems[i].closest(".sidebar-dropdown")) {
                    menuItems[i].closest(".sidebar-dropdown").classList.add("active");
                }
            }
        }
    }
}

// Sidebar state management with localStorage
function initSidebarState() {
    const pageWrapper = document.getElementsByClassName("page-wrapper")[0];
    const closeSidebar = document.getElementById("close-sidebar");
    
    console.log('🔍 Sidebar Debug - initSidebarState called');
    console.log('pageWrapper:', pageWrapper);
    console.log('closeSidebar:', closeSidebar);
    
    if (!pageWrapper || !closeSidebar) {
        console.log('❌ Missing elements, returning early');
        return;
    }
    
    // Get saved sidebar state from localStorage (default: enabled)
    const savedState = localStorage.getItem('sidebar-disabled');
    const isSidebarDisabled = savedState === 'true';
    
    console.log('📦 localStorage sidebar-disabled:', savedState);
    console.log('🔍 isSidebarDisabled:', isSidebarDisabled);
    console.log('🎯 Initial pageWrapper classes:', pageWrapper.className);
    
    // Set sidebar state based on localStorage
    if (isSidebarDisabled) {
        // User previously disabled sidebar - remove toggled class to hide sidebar
        pageWrapper.classList.remove("toggled");
        console.log('🔒 Applied disabled state from localStorage, classes now:', pageWrapper.className);
    } else {
        // Default state - ensure sidebar is enabled (keep toggled class)
        pageWrapper.classList.add("toggled");
        console.log('🔓 Applied enabled state (default), classes now:', pageWrapper.className);
    }
    
    // Add click listener to toggle sidebar and save state
    closeSidebar.addEventListener("click", function () {
        console.log('🖱️ Sidebar toggle clicked');
        console.log('Before toggle - classes:', pageWrapper.className);
        
        pageWrapper.classList.toggle("toggled");
        
        console.log('After toggle - classes:', pageWrapper.className);
        
        // Save current state to localStorage (store disabled state)
        const isCurrentlyDisabled = !pageWrapper.classList.contains("toggled");
        console.log('isCurrentlyDisabled:', isCurrentlyDisabled);
        
        if (isCurrentlyDisabled) {
            localStorage.setItem('sidebar-disabled', 'true');
            console.log('💾 Saved disabled state to localStorage');
        } else {
            localStorage.removeItem('sidebar-disabled'); // Remove key when enabled (default)
            console.log('🗑️ Removed disabled state from localStorage');
        }
    });
}

// Initialize sidebar state when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSidebarState();
});

// Close Sidebar (mobile)
if (!window.matchMedia('(min-width: 1024px)').matches) {
    if (document.getElementById("close-sidebar")) {
        const closeSidebar = document.getElementById("close-sidebar");
        const sidebar = document.getElementById("sidebar");
        const pageWrapper = document.getElementsByClassName("page-wrapper")[0];
        const sidebarMenuLinks = Array.from(document.querySelectorAll(".sidebar-root-link,.sidebar-nested-link"));

        // Function to close sidebar and save state
        function closeSidebarAndSave() {
            pageWrapper.classList.remove("toggled");
            localStorage.setItem('sidebar-disabled', 'true');
        }

        // Close sidebar by clicking outside
        document.addEventListener('click', function(elem) {
            if (!closeSidebar.contains(elem.target) && !sidebar.contains(elem.target))
                closeSidebarAndSave();
        });

        // Close sidebar immediately when clicking sidebar menu item
        sidebarMenuLinks.forEach(menuLink => {
            menuLink.addEventListener("click", function () {
                closeSidebarAndSave();
            });
        });
    }
}

// Clickable Menu
if (document.getElementById("navigation")) {
    var elements = document.getElementById("navigation").getElementsByTagName("a");
    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = function (elem) {
            if (elem.target.getAttribute("href") === "javascript:void(0)") {
                var submenu = elem.target.nextElementSibling.nextElementSibling;
                submenu.classList.toggle('open');
            }
        }
    }
}

if (document.getElementById("sidebar")) {
    var elements = document.getElementById("sidebar").getElementsByTagName("button");
    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = function (elem) {
            // if(elem.target !== document.querySelectorAll("li.sidebar-dropdown.active > a")[0]){
            //     document.querySelectorAll("li.sidebar-dropdown.active")[0]?.classList?.toggle("active");
            //     document.querySelectorAll("div.sidebar-submenu.d-block")[0]?.classList?.toggle("d-block");
            // }
            // if(elem.target.getAttribute("href") === "javascript:void(0)") {
            elem.target.parentElement.classList.toggle("active");
            elem.target.nextElementSibling.classList.toggle("d-block");
            // }
        }
    }
}

// Menu sticky
function windowScroll() {
    var navbar = document.getElementById("topnav");
    if (navbar === null) {

    } else if (document.body.scrollTop >= 50 ||
        document.documentElement.scrollTop >= 50) {
        navbar.classList.add("nav-sticky");
    } else {
        navbar.classList.remove("nav-sticky");
    }
}

window.addEventListener('scroll', (ev) => {
    ev.preventDefault();
    windowScroll();
})

// back-to-top
var mybutton = document.getElementById("back-to-top");

function scrollFunction() {
    if (mybutton != null) {
        // Get the scrollable container (content-docs-wrapper)
        const scrollContainer = document.querySelector('.content-docs-wrapper');
        const scrollPosition = scrollContainer ? scrollContainer.scrollTop : (document.body.scrollTop || document.documentElement.scrollTop);

        if (scrollPosition > 500) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
}

// Set up scroll listeners for both window and content-docs-wrapper
window.onscroll = function () {
    scrollFunction();
};

// Also listen to content-docs-wrapper scroll events
document.addEventListener('DOMContentLoaded', function() {
    const scrollContainer = document.querySelector('.content-docs-wrapper');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', scrollFunction);
    }
});

function topFunction() {
    // Try to scroll the content-docs-wrapper container first
    const scrollContainer = document.querySelector('.content-docs-wrapper');
    if (scrollContainer) {
        scrollContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } else {
        // Fallback to window scroll
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
}

// dd-menu
if (document.getElementsByClassName("dd-menu")) {
    var ddmenu = document.getElementsByClassName("dd-menu");
    for (var i = 0, len = ddmenu.length; i < len; i++) {
        ddmenu[i].onclick = function (elem) {
            elem.stopPropagation();
        }
    }
}

// Active Sidebar
(function () {
    var current = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
    if (current === "") return;
    var menuItems = document.querySelectorAll('.sidebar-nav a');
    for (var i = 0, len = menuItems.length; i < len; i++) {
        if (menuItems[i].getAttribute("href").indexOf(current) !== -1) {
            menuItems[i].parentElement.className += " active";
        }
    }
})();

// Last Modified Date of current page (relative time format)
if (document.getElementById("relativetime")) {
    dayjs.extend(window.dayjs_plugin_relativeTime);
    const modId = document.getElementById('relativetime');
    let modAgo = dayjs(modId.getAttribute('data-authdate')).fromNow();
    document.getElementById("relativetime").innerHTML = modAgo;
};

// Initialize Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

/**
 * Sanitize and encode all HTML in a user-submitted string
 * https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {String} str  The user-submitted string
 * @return {String} str  The sanitized string
 */
var sanitizeHTML = function (str) {
	return str.replace(/[^\w. ]/gi, function (c) {
		return '&#' + c.charCodeAt(0) + ';';
	});
};

// Table of Contents Scroll Spy
function initTocScrollSpy() {
    const tocLinks = document.querySelectorAll('#toc a, #toc-mobile a, #TableOfContents a');
    const sections = [];

    // Get all sections that have corresponding TOC links
    tocLinks.forEach((link) => {
        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            const section = document.getElementById(id);

            if (section) {
                sections.push({
                    id: id,
                    element: section,
                    link: link
                });
            }
        }
    });

    if (sections.length === 0) {
        return;
    }

    // Function to scroll TOC item into view
    function scrollTocItemIntoView(activeLink) {
        const tocContainer = document.querySelector('.docs-toc');
        if (!tocContainer) return;

        // Simple approach: scroll to position the link with some offset
        const linkOffsetTop = activeLink.offsetTop;
        const offset = 120; // 120px offset to position link lower (7.5em)
        const targetScrollTop = Math.max(0, linkOffsetTop - offset);

        // Only scroll if the link is not already visible
        const containerRect = tocContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        // Check if link is above or below the visible area
        const isAboveView = linkRect.top < containerRect.top;
        const isBelowView = linkRect.bottom > containerRect.bottom ;

        if (isAboveView || isBelowView) {
            tocContainer.scrollTo({
                top: targetScrollTop,
                behavior: 'smooth'
            });
        }
    }

    function updateActiveTocLink() {
        let current = '';

        // Get the scrollable container (content-docs-wrapper)
        const scrollContainer = document.querySelector('.content-docs-wrapper');
        const scrollPosition = scrollContainer ? scrollContainer.scrollTop : window.scrollY;

        // Convert 10em to pixels dynamically based on the current font size
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const offsetPixels = fontSize * 10; // 10em offset
        const adjustedScrollPosition = scrollPosition + offsetPixels;

        // Find the section currently in view with improved detection
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const rect = section.element.getBoundingClientRect();

            // Calculate element position relative to the scroll container
            const elementTop = scrollContainer ?
                rect.top + scrollContainer.scrollTop :
                rect.top + window.scrollY;

            // Check if the adjusted scroll position has reached this section
            if (adjustedScrollPosition >= elementTop) {
                current = section.id;
                break;
            }
        }

        // Update active states
        sections.forEach(section => {
            if (section.id === current) {
                section.link.classList.add('active');

                // Scroll the active TOC item into view
                scrollTocItemIntoView(section.link);
            } else {
                section.link.classList.remove('active');
            }
        });
    }

    // Initial call
    updateActiveTocLink();

    // Listen for scroll events
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveTocLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    // Get the scrollable container and add event listener to it
    const scrollContainer = document.querySelector('.content-docs-wrapper');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', requestTick);
    } else {
        window.addEventListener('scroll', requestTick);
    }
}

// Initialize TOC scroll spy when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTocScrollSpy();

    // Handle hash-based scroll (used for both startup and TOC clicks)
    function scrollToHash(hash, delay = 0) {
        if (!hash) return;

        const targetElement = document.querySelector(hash);
        if (targetElement) {
            const scrollFunction = () => {
                const scrollContainer = document.querySelector('.content-docs-wrapper');
                // Convert 12em to pixels dynamically (2em higher than TOC detection)
                const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
                const headerOffset = fontSize * 6; // 12em offset (scrolls higher)

                if (scrollContainer) {
                    const elementTop = targetElement.getBoundingClientRect().top + scrollContainer.scrollTop;
                    scrollContainer.scrollTo({
                        top: elementTop - headerOffset,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback to window scroll
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Adjust for header
                    window.scrollBy(0, -headerOffset);
                }
            };

            if (delay > 0) {
                setTimeout(scrollFunction, delay);
            } else {
                scrollFunction();
            }
        }
    }

    // Handle hash-based scroll on startup
    function handleHashScroll() {
        const hash = window.location.hash;
        if (hash) {
            scrollToHash(hash, 100); // Small delay for page load
        }
    }

    // Intercept TOC link clicks to update hash and trigger scroll
    function handleTocClicks() {
        const tocLinks = document.querySelectorAll('#toc a, #toc-mobile a, #TableOfContents a');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault(); // Prevent default anchor behavior
                    
                    // Update the URL hash
                    window.history.pushState(null, null, href);
                    
                    // Trigger our custom scroll function
                    scrollToHash(href);
                }
            });
        });
    }

    // Intercept all anchor link clicks in the content area
    function handleAnchorClicks() {
        const contentArea = document.querySelector('.main-content');
        if (!contentArea) return;
        
        contentArea.addEventListener('click', function(e) {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault(); // Prevent default anchor behavior
                    
                    // Update the URL hash
                    window.history.pushState(null, null, href);
                    
                    // Trigger our custom scroll function
                    scrollToHash(href);
                }
            }
        });
    }

    // Run hash scroll on page load
    handleHashScroll();
    
    // Set up TOC click handlers
    handleTocClicks();
    
    // Set up anchor link click handlers
    handleAnchorClicks();

    // Test function to manually test TOC styling
    window.testTocStyling = function() {
        const tocLinks = document.querySelectorAll('#toc a, #toc-mobile a, #TableOfContents a');

        tocLinks.forEach((link, index) => {
            link.classList.add('active');
            setTimeout(() => {
                link.classList.remove('active');
            }, 2000);
        });
    };
});