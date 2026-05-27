document.addEventListener("DOMContentLoaded", (event) => {
    const maincta = document.querySelector(".wp-block-cc-cta-block");
    const floatingCta = document.getElementById("floating-cta");

    const mainCtaLink = maincta.querySelector("a");
    if (mainCtaLink) {
        mainCtaLink.setAttribute("data-testid", "main-button");
    }

    const floatingCtaLink = floatingCta.querySelector("a");
    if (floatingCtaLink) {
        floatingCtaLink.setAttribute("data-testid", "cta-floater");
    }

    function isTopEdgeInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function isBottomEdgeInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.bottom >= 0 &&
            rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function updateFloatingCta() {
        if (isTopEdgeInViewport(maincta)) {
            floatingCta.classList.remove("show");
            floatingCta.classList.remove("sticky-cta");
        } else if (isBottomEdgeInViewport(maincta)) {
            floatingCta.classList.add("show");
            floatingCta.classList.add("sticky-cta");
        }
    }

    const mediaQuery = window.matchMedia("(max-width: 919px)");

    function handleMediaChange(e) {
        if (e.matches) {
            window.addEventListener("scroll", updateFloatingCta);
        } else {
            window.removeEventListener("scroll", updateFloatingCta);
            floatingCta.classList.add("hidden");
        }
    }

    mediaQuery.addEventListener("change", handleMediaChange);
    handleMediaChange(mediaQuery);
});