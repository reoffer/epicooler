document.addEventListener("DOMContentLoaded", () => {
    const dateEls = document.querySelectorAll(".current-date");

    const currentDate = new Date();
    const locale = window.localeSettings ? .locale || "en-US";
    const formattedDate = new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(currentDate);

    dateEls.forEach((el) => (el.innerText = formattedDate));
});