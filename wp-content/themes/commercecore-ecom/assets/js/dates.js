class CcDate {
    constructor(locale) {
        this.locale = locale;

        if (!this.toLocaleDateStringSupportsLocales()) {
            console.log(
                '%cDates: %cBrowser does not support international locales',
                'color:red;font-weight:bold;',
                'color:initial;font-weight:initial;'
            );
            this.locale = 'en-US';
        }
    }

    toLocaleDateStringSupportsLocales() {
        return typeof Intl === 'object' && !!Intl && typeof Intl.DateTimeFormat === 'function';
    }

    render() {
        const today = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        const optionsShort = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        const elements = document.querySelectorAll(`[data-days-ago]`);

        for (let i = 0; i < elements.length; ++i) {
            const dateCopy = new Date(today);
            const daysAgo = elements[i].dataset.daysAgo;
            const date = dateCopy.setDate(dateCopy.getDate() - daysAgo);
            elements[i].innerHTML = new Date(date).toLocaleString(this.locale, options);
        }

        const elementsShort = document.querySelectorAll(`[data-days-ago-short]`);

        for (let i = 0; i < elementsShort.length; ++i) {
            const dateCopy = new Date(today);
            const daysAgo = elementsShort[i].dataset.daysAgoShort;
            const date = dateCopy.setDate(dateCopy.getDate() - daysAgo);
            elementsShort[i].innerHTML = new Date(date).toLocaleString(this.locale, optionsShort);
        }
    }
}

window.addEventListener('load', () => {
    const userLocale = options.locale;
    const ccDateInstance = new CcDate(userLocale);
    ccDateInstance.render();
});