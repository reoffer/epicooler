document.addEventListener('DOMContentLoaded', function() {
    const stickyAd = document.querySelector('.sticky');
    const asideContainerRight = window.innerWidth - stickyAd.getBoundingClientRect().right;
    if (!CSS.supports('position: sticky')) {
        const stickyAdTop = stickyAd.getBoundingClientRect().top;

        window.addEventListener('scroll', function() {
            if (window.scrollY > stickyAdTop) {
                stickyAd.style.position = 'fixed';
                stickyAd.style.top = '0';
                stickyAd.style.right = asideContainerRight + 'px';
            } else {
                stickyAd.style.position = 'static';
                stickyAd.style.right = '0';
            }
        });
    }
});