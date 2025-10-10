//ScrollSpy - via https://github.com/kimyvgy/simple-scrollspy
window.onload = function () {
    // Get the scrollable container (content-docs-wrapper) or use window
    const scrollContainer = document.querySelector('.content-docs-wrapper');
    
    scrollSpy('toc', {
        sectionClass: 'h1,h2,h3,h4',
        //   menuActiveTarget: 'href',
        offset: 100, // 100px offset to account for header
        scrollContainer: scrollContainer, // Use the content wrapper as scroll container
        // smooth scroll
        // smoothScroll: true,
        //   smoothScrollBehavior: function(element) {
        //     console.log('run "smoothScrollBehavior"...', element)
        //     element.scrollIntoView({ behavior: 'smooth' })
        //   }
    })
}