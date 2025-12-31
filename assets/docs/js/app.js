/* Template Name: LotusLabs Docs
   Author: Colin Wilson
   E-mail: colin@aigis.uk
   Created: October 2022
   Version: 1.0.0
   File Description: Main JS file of the docs template
*/

// Configuration
const SCROLL_HEADER_OFFSET_EM = 4; // Header offset in em units (adjust this to change scroll offset from top)

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

// Simplified Sidebar Management
// Desktop (≥1200px): Sidebar shown by default, toggleable with localStorage persistence
// Mobile (<1200px): Sidebar hidden by default, temporarily toggleable (no persistence)
//
// CSS behavior: "toggled" class = VISIBLE on desktop, HIDDEN on mobile

function initSidebarState() {
    const pageWrapper = document.getElementsByClassName("page-wrapper")[0];
    const closeSidebar = document.getElementById("close-sidebar");
    const sidebar = document.getElementById("sidebar");

    if (!pageWrapper || !closeSidebar) return;

    const isDesktop = () => window.matchMedia('(min-width: 1200px)').matches;

    // Initialize sidebar state based on screen size
    function setInitialState() {
        if (isDesktop()) {
            // Desktop: Check localStorage (default: shown with "toggled" class)
            const sidebarHidden = localStorage.getItem('sidebar-hidden') === 'true';
            if (sidebarHidden) {
                pageWrapper.classList.remove("toggled"); // Remove = hidden on desktop
            } else {
                pageWrapper.classList.add("toggled"); // Add = visible on desktop
            }
        } else {
            // Mobile: Always start hidden (add "toggled" = hidden on mobile)
            pageWrapper.classList.add("toggled");
        }
    }

    // Set initial state on load
    setInitialState();

    // Handle window resize to adjust sidebar behavior
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            setInitialState();
        }, 250);
    });

    // Toggle sidebar on button click
    closeSidebar.addEventListener("click", function (e) {
        e.stopPropagation(); // Prevent triggering outside click handler
        pageWrapper.classList.toggle("toggled");

        // Only save state on desktop
        if (isDesktop()) {
            const isHidden = !pageWrapper.classList.contains("toggled");
            if (isHidden) {
                localStorage.setItem('sidebar-hidden', 'true');
            } else {
                localStorage.removeItem('sidebar-hidden');
            }
        }
    });

    // Mobile-only: Close sidebar when clicking outside
    if (!isDesktop()) {
        document.addEventListener('click', function(e) {
            const isOutsideClick = !closeSidebar.contains(e.target) &&
                                  sidebar && !sidebar.contains(e.target);

            // On mobile, NOT having "toggled" means sidebar is visible, so add it to hide
            if (isOutsideClick && !pageWrapper.classList.contains("toggled")) {
                pageWrapper.classList.add("toggled");
            }
        });

        // Mobile-only: Close sidebar when clicking any menu link
        const sidebarMenuLinks = document.querySelectorAll(".sidebar-root-link, .sidebar-nested-link");
        sidebarMenuLinks.forEach(menuLink => {
            menuLink.addEventListener("click", function () {
                pageWrapper.classList.add("toggled"); // Add = hidden on mobile
            });
        });
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSidebarState();
});

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
            elem.target.parentElement.classList.toggle("active");
            elem.target.nextElementSibling.classList.toggle("d-block");
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
    if (window.__pendingHash) {
        const scrollContainer = document.querySelector('.content-docs-wrapper');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    }

    initTocScrollSpy();

    // Handle hash-based scroll (used for both startup and TOC clicks)
    function scrollToHash(hash, delay = 0, isInitialLoad = false) {
        if (!hash) return;

        const targetElement = document.querySelector(hash);
        if (!targetElement) return;

        const scrollFunction = () => {
            const scrollContainer = document.querySelector('.content-docs-wrapper');
            const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const headerOffset = fontSize * SCROLL_HEADER_OFFSET_EM;

            if (scrollContainer) {
                if (isInitialLoad && scrollContainer.scrollTop > 0) {
                    // Browser already scrolled - adjust from current position
                    requestAnimationFrame(() => {
                        const containerRect = scrollContainer.getBoundingClientRect();
                        const elementRect = targetElement.getBoundingClientRect();
                        const elementAbsoluteTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top);
                        scrollContainer.scrollTo({
                            top: Math.max(0, elementAbsoluteTop - headerOffset),
                            behavior: 'smooth'
                        });
                    });
                } else {
                    // Calculate from current scroll position
                    requestAnimationFrame(() => {
                        if (isInitialLoad) {
                            const containerRect = scrollContainer.getBoundingClientRect();
                            const elementRect = targetElement.getBoundingClientRect();
                            const elementTop = elementRect.top - containerRect.top;
                            scrollContainer.scrollTo({
                                top: Math.max(0, elementTop - headerOffset),
                                behavior: 'smooth'
                            });
                        } else {
                            const elementTop = targetElement.getBoundingClientRect().top + scrollContainer.scrollTop;
                            scrollContainer.scrollTo({
                                top: Math.max(0, elementTop - headerOffset),
                                behavior: 'smooth'
                            });
                        }
                    });
                }
            } else {
                // Fallback to window scroll
                if (isInitialLoad && window.scrollY > 0) {
                    requestAnimationFrame(() => {
                        const elementRect = targetElement.getBoundingClientRect();
                        const elementAbsoluteTop = window.scrollY + elementRect.top;
                        window.scrollTo({
                            top: Math.max(0, elementAbsoluteTop - headerOffset),
                            behavior: 'smooth'
                        });
                    });
                } else {
                    requestAnimationFrame(() => {
                        const elementRect = targetElement.getBoundingClientRect();
                        const elementTop = window.scrollY + elementRect.top;
                        window.scrollTo({
                            top: Math.max(0, elementTop - headerOffset),
                            behavior: 'smooth'
                        });
                    });
                }
            }
        };

        if (delay > 0) {
            setTimeout(scrollFunction, delay);
        } else {
            scrollFunction();
        }
    }

    // Handle hash-based scroll on startup
    function handleHashScroll() {
        const hash = window.__pendingHash || window.location.hash;
        if (hash) {
            if (window.__pendingHash && window.location.hash !== hash) {
                window.history.replaceState(null, null, window.location.href + hash);
                delete window.__pendingHash;
            }

            const performScroll = () => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        scrollToHash(hash, 0, true);
                    });
                });
            };

            if (document.readyState === 'complete') {
                performScroll();
            } else {
                window.addEventListener('load', performScroll, { once: true });
            }
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

    // Code snippet copy functionality
    function initCodeSnippetCopy() {
        const copyButtons = document.querySelectorAll('.code-clipboard__button[data-code-snippet]');
        
        copyButtons.forEach(button => {
            let resetTimeout = null;
            
            button.addEventListener('click', function() {
                const codeSnippet = this.closest('.code-snippet');
                if (!codeSnippet) return;
                
                // Clear any existing timeout to prevent stuck "Copied!" state
                if (resetTimeout) {
                    clearTimeout(resetTimeout);
                    resetTimeout = null;
                }
                
                // Find the actual code element (not the line numbers)
                // The actual code is in the second column (last lntd) or has a language class/data-lang
                let codeElement = codeSnippet.querySelector('.lntd:last-child code');
                
                // Fallback: look for code with language class or data-lang attribute
                if (!codeElement) {
                    codeElement = codeSnippet.querySelector('code[class*="language-"], code[data-lang]');
                }
                
                // Last fallback: get any code element
                if (!codeElement) {
                    codeElement = codeSnippet.querySelector('code');
                }
                
                if (!codeElement) return;
                
                // Extract text content from the code element
                // Get all text nodes, excluding line number links
                let text = '';
                
                // Try to get lines from .line elements first (preserves blank lines correctly)
                const lineElements = codeElement.querySelectorAll('.line');
                if (lineElements.length > 0) {
                    const lines = [];
                    lineElements.forEach((lineEl) => {
                        // Get the .cl span content within this line
                        const clSpan = lineEl.querySelector('.cl');
                        if (clSpan) {
                            let lineText = clSpan.textContent || clSpan.innerText;
                            // Remove trailing newlines/whitespace but preserve leading spaces (indentation)
                            lineText = lineText.replace(/\s+$/g, '');
                            lines.push(lineText);
                        } else {
                            // If no .cl span, check if line is empty (blank line)
                            const lineText = lineEl.textContent || lineEl.innerText;
                            if (lineText.trim() === '') {
                                lines.push('');
                            }
                        }
                    });
                    // Join lines with single newline
                    text = lines.join('\n');
                } else {
                    // Fallback: use .cl spans directly
                    const codeLines = codeElement.querySelectorAll('.cl');
                    if (codeLines.length > 0) {
                        const lines = [];
                        codeLines.forEach((line) => {
                            let lineText = line.textContent || line.innerText;
                            // Remove trailing whitespace but preserve leading spaces
                            lineText = lineText.replace(/\s+$/g, '');
                            lines.push(lineText);
                        });
                        text = lines.join('\n');
                    } else {
                        // Last fallback: get all text content and clean it
                        text = codeElement.textContent || codeElement.innerText;
                        // Remove line number patterns (numbers at start of lines)
                        text = text.replace(/^\s*\d+\s*/gm, '');
                        // Remove multiple consecutive blank lines (keep single blank lines, remove triple+)
                        text = text.replace(/\n{3,}/g, '\n\n');
                        // Clean up any remaining issues and trim
                        text = text.trim();
                    }
                }
                
                // Get the text span and original text
                const textSpan = this.querySelector('span');
                const originalText = textSpan.textContent;
                
                // Copy to clipboard
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(() => {
                        // Show feedback
                        textSpan.textContent = 'Copied!';
                        
                        // Clear any existing timeout and set a new one
                        if (resetTimeout) {
                            clearTimeout(resetTimeout);
                        }
                        resetTimeout = setTimeout(() => {
                            textSpan.textContent = originalText;
                            resetTimeout = null;
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.select();
                    
                    try {
                        document.execCommand('copy');
                        textSpan.textContent = 'Copied!';
                        
                        // Clear any existing timeout and set a new one
                        if (resetTimeout) {
                            clearTimeout(resetTimeout);
                        }
                        resetTimeout = setTimeout(() => {
                            textSpan.textContent = originalText;
                            resetTimeout = null;
                        }, 2000);
                    } catch (err) {
                        console.error('Fallback copy failed: ', err);
                    }
                    
                    document.body.removeChild(textArea);
                }
            });
        });
    }

    // Initialize code snippet copy on page load
    initCodeSnippetCopy();

    // Code line highlighting functionality
    function initCodeLineHighlighting() {
        // Handle line number link clicks
        const lineLinks = document.querySelectorAll('.lnlinks');
        lineLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#hl-')) {
                    // Don't prevent default - let the hash change happen
                    // The hashchange event will handle highlighting
                    setTimeout(() => {
                        highlightCodeLine(href.substring(1));
                    }, 100);
                }
            });
        });

        // Handle hash on page load and changes
        function checkHashAndHighlight() {
            const hash = window.location.hash;
            if (hash && hash.startsWith('#hl-')) {
                // Small delay to ensure DOM is ready
                setTimeout(() => {
                    highlightCodeLine(hash.substring(1));
                }, 100);
            } else {
                // Clear highlights if hash doesn't match
                clearCodeLineHighlights();
            }
        }

        // Check hash on initial load (after a delay to ensure DOM is ready)
        setTimeout(() => {
            checkHashAndHighlight();
        }, 300);

        // Listen for hash changes
        window.addEventListener('hashchange', function() {
            checkHashAndHighlight();
        });
    }

    function highlightCodeLine(lineId) {
        // Clear any existing highlights first
        clearCodeLineHighlights();

        // Find the line element
        const lineElement = document.getElementById(lineId);
        if (!lineElement) return;

        // Find the parent line container - could be .line or tr (for table layout)
        let lineContainer = lineElement.closest('.line');
        if (!lineContainer) {
            // If not found, try finding the table row
            const lntSpan = lineElement.closest('.lnt');
            if (lntSpan) {
                const tableRow = lntSpan.closest('tr');
                if (tableRow) {
                    lineContainer = tableRow;
                }
            }
        }

        if (lineContainer) {
            lineContainer.classList.add('chroma-line-highlighted');
            
            // Scroll the line into view with offset for header
            const scrollContainer = document.querySelector('.content-docs-wrapper');
            if (scrollContainer) {
                const containerRect = scrollContainer.getBoundingClientRect();
                const elementRect = lineContainer.getBoundingClientRect();
                const elementTop = scrollContainer.scrollTop + (elementRect.top - containerRect.top);
                const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
                const headerOffset = fontSize * SCROLL_HEADER_OFFSET_EM;
                
                scrollContainer.scrollTo({
                    top: Math.max(0, elementTop - headerOffset),
                    behavior: 'smooth'
                });
            } else {
                // Fallback to standard scrollIntoView
                lineContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    function clearCodeLineHighlights() {
        const highlighted = document.querySelectorAll('.chroma-line-highlighted');
        highlighted.forEach(el => {
            el.classList.remove('chroma-line-highlighted');
        });
    }

    // Initialize code line highlighting
    initCodeLineHighlighting();
});