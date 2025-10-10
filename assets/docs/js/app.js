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

if (document.getElementById("close-sidebar")) {
    document.getElementById("close-sidebar").addEventListener("click", function () {
        document.getElementsByClassName("page-wrapper")[0].classList.toggle("toggled");
    });
}

// Close Sidebar (mobile)
if (!window.matchMedia('(min-width: 1024px)').matches) {
    if (document.getElementById("close-sidebar")) {
        const closeSidebar = document.getElementById("close-sidebar");
        const sidebar = document.getElementById("sidebar");
        const sidebarMenuLinks = Array.from(document.querySelectorAll(".sidebar-root-link,.sidebar-nested-link"));
        // Close sidebar by clicking outside
        document.addEventListener('click', function(elem) {
            if (!closeSidebar.contains(elem.target) && !sidebar.contains(elem.target))
                document.getElementsByClassName("page-wrapper")[0].classList.add("toggled");
        });
        // Close sidebar immediately when clicking sidebar menu item
        sidebarMenuLinks.forEach(menuLink => {
            menuLink.addEventListener("click", function () {
              document.getElementsByClassName("page-wrapper")[0].classList.add("toggled");
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
window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (mybutton != null) {
        if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
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
    console.log('🔍 Initializing TOC Scroll Spy...');
    
    const tocLinks = document.querySelectorAll('#toc a, #toc-mobile a, #TableOfContents a');
    console.log('📋 Found TOC links:', tocLinks.length);
    
    const sections = [];
    
    // Get all sections that have corresponding TOC links
    tocLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        console.log(`🔗 TOC Link ${index}:`, href);
        
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            const section = document.getElementById(id);
            console.log(`🎯 Looking for section with id "${id}":`, section ? 'Found' : 'Not found');
            
            if (section) {
                sections.push({
                    id: id,
                    element: section,
                    link: link
                });
            }
        }
    });
    
    console.log('📊 Total sections found:', sections.length);
    console.log('📝 Sections:', sections.map(s => s.id));
    
    if (sections.length === 0) {
        console.log('❌ No sections found, exiting TOC scroll spy');
        return;
    }
    
    // Function to scroll TOC item into view
    function scrollTocItemIntoView(activeLink) {
        // Find the actual scrollable TOC container (.docs-toc)
        const tocContainer = activeLink.closest('.docs-toc');
        if (!tocContainer) {
            console.log('❌ TOC container not found');
            return;
        }
        
        console.log('📦 Found TOC container:', tocContainer);
        
        const containerRect = tocContainer.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        
        console.log('📏 Container rect:', containerRect);
        console.log('📏 Link rect:', linkRect);
        
        // Check if the link is outside the visible area of the TOC container
        const isAboveView = linkRect.top < containerRect.top;
        const isBelowView = linkRect.bottom > containerRect.bottom;
        
        console.log('👀 Link visibility - Above:', isAboveView, 'Below:', isBelowView);
        
        if (isAboveView || isBelowView) {
            // Calculate the scroll position to center the active link in the TOC container
            const containerScrollTop = tocContainer.scrollTop;
            const linkOffsetTop = activeLink.offsetTop;
            const containerHeight = tocContainer.clientHeight;
            const linkHeight = activeLink.offsetHeight;
            
            // Center the link in the container
            const targetScrollTop = linkOffsetTop - (containerHeight / 2) + (linkHeight / 2);
            
            console.log('🎯 Scroll calculation:', {
                containerScrollTop,
                linkOffsetTop,
                containerHeight,
                linkHeight,
                targetScrollTop
            });
            
            // Smooth scroll to the target position
            tocContainer.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth'
            });
            
            console.log(`📜 Scrolling TOC to show: ${activeLink.textContent.trim()}`);
        } else {
            console.log('✅ Link already in view, no scrolling needed');
        }
    }
    
    function updateActiveTocLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100; // Offset for better UX
        
        console.log('📏 Scroll position:', scrollPosition);
        
        // Find the section currently in view
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const rect = section.element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            
            console.log(`📍 Section "${section.id}": top=${elementTop}, scroll=${scrollPosition}, inView=${scrollPosition >= elementTop}`);
            
            if (scrollPosition >= elementTop) {
                current = section.id;
                break;
            }
        }
        
        console.log('🎯 Current active section:', current);
        
        // Update active states
        sections.forEach(section => {
            if (section.id === current) {
                console.log(`✅ Activating section: ${section.id}`);
                section.link.classList.add('active');
                
                // Scroll the active TOC item into view
                scrollTocItemIntoView(section.link);
            } else {
                section.link.classList.remove('active');
            }
        });
    }
    
    // Initial call
    console.log('🚀 Running initial TOC update...');
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
    
    console.log('👂 Adding scroll event listener...');
    window.addEventListener('scroll', requestTick);
}

// Initialize TOC scroll spy when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTocScrollSpy();
    
    // Test function to manually test TOC styling
    window.testTocStyling = function() {
        console.log('🧪 Testing TOC styling...');
        const tocLinks = document.querySelectorAll('#toc a, #toc-mobile a, #TableOfContents a');
        console.log('Found TOC links for testing:', tocLinks.length);
        
        tocLinks.forEach((link, index) => {
            console.log(`Testing link ${index}:`, link.textContent.trim());
            link.classList.add('active');
            setTimeout(() => {
                link.classList.remove('active');
                console.log(`Removed active class from link ${index}`);
            }, 2000);
        });
    };
    
    console.log('💡 You can test TOC styling by running: testTocStyling()');
});