(function() {
    let conversionTriggered = false;
    let conversionRunning = false;

    if (!params.eventId) {
        return;
    }

    const cookieName = params.eventId.cookie;

    const cookieValue = getCookie(cookieName);
    if (cookieValue) {
        return;
    }

    const tryMakeConversion = async () => {
        if (conversionTriggered || conversionRunning) return;
        conversionRunning = true;

        try {
            const EF = window.EF;
            if (!EF || typeof EF.urlParameter !== 'function') return;

            const offerId = EF.urlParameter('oid');
            const transactionId = EF.urlParameter('transaction_id');
            if (!offerId || !transactionId) return;

            if (EF.customParamProvider instanceof Promise) {
                await EF.customParamProvider;
            }
            EF.customParamProvider = null;

            const conversion = await EF.conversion({
                offer_id: offerId,
                tracking_domain: 'https://www.csszp8trk.com',
                adv_event_id: params.eventId.id,
                transaction_id: transactionId,
            });

            const txId = conversion ? .transaction_id;
            const convId = conversion ? .conversion_id;

            if (txId && convId) {
                conversionTriggered = true;
                setCookie(cookieName, true);
                observer.disconnect();
            }
        } catch (err) {
            console.error('Conversion error:', err);
        } finally {
            conversionRunning = false;
        }
    };

    const observer = new MutationObserver(() => tryMakeConversion());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    tryMakeConversion();
})();

function setCookie(name, value, days = 1, path = '/') {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}`;
}

function getCookie(name) {
    const cookies = document.cookie.split('; ').map((c) => c.split('='));
    for (const [key, value] of cookies) {
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}