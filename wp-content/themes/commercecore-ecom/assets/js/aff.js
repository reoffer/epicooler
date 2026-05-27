(function() {
    function getCookie(key, defaultValue = null) {
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [cookieKey, cookieValue] = cookie.split('=');
            acc[decodeURIComponent(cookieKey)] = decodeURIComponent(cookieValue);
            return acc;
        }, {});

        return cookies.hasOwnProperty(key) ? cookies[key] : defaultValue;
    }

    function setCookie(key, value, expirationInSeconds, path = '/') {
        const expires = new Date(Date.now() + expirationInSeconds * 1000).toUTCString();
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path=${path}`;
    }

    function encodeAffiliateParams(affiliate, entryUrl, affiliateOverwrite) {
        return {
            aff: window.btoa(affiliate),
            entryUrl: window.btoa(entryUrl),
            affiliateOverwrite: window.btoa(affiliateOverwrite),
        };
    }

    function isValidUrl(url) {
        return (
            typeof url === 'string' &&
            url.includes(location.hostname) &&
            !url.includes('legal') &&
            !url.includes('wp-login') &&
            !url.includes('wp-admin')
        );
    }

    function appendAffiliateParams(url, {
        aff,
        entryUrl,
        affiliateOverwrite
    }) {
        // Skip if params already exist
        if (url.includes('aff=') || url.includes('entryUrl=')) return url;

        const separator = url.includes('?') ? '&' : '?';

        const affOverwritePart =
            affiliateOverwrite != null && affiliateOverwrite !== '' && !url.includes('affOverwrite=') ?
            `&affOverwrite=${encodeURIComponent(affiliateOverwrite)}` :
            '';

        return `${url}${separator}aff=${encodeURIComponent(aff)}${affOverwritePart}&entryUrl=${encodeURIComponent(
			entryUrl
		)}`;
    }

    function addAffiliateParamToLinks() {
        if (!window.affiliate) return;

        const links = [...document.getElementsByTagName('a')];
        const encodedAffiliate = encodeAffiliateParams(window.affiliate, window.entry_url, window.affiliateOverwrite);

        links.forEach((link) => {
            let url = link.getAttribute('href') ? .trim();

            if (!isValidUrl(url)) return;

            link.setAttribute('href', appendAffiliateParams(url, encodedAffiliate));
        });
    }

    function decodeQueryParam(param) {
        const value = new URLSearchParams(location.search).get(param);

        if (!value) {
            return null;
        }

        let decoded = value;
        try {
            decoded = window.atob(decodeURIComponent(value));
        } catch (e) {
            return null; // not base64
        }

        try {
            return decodeURIComponent(decoded);
        } catch (e) {
            return decoded;
        }
    }

    function initEntryUrl() {
        const entryUrlFromCookie = getCookie('entrypoint_url');
        const entryUrlFromParams = decodeQueryParam('entryUrl');

        window.entry_url = entryUrlFromCookie || entryUrlFromParams || location.pathname;

        if (!entryUrlFromCookie) {
            setCookie('entrypoint_url', window.entry_url, 60 * 25); // 25 minutes
        }
    }

    function initAffiliateTag() {
        const {
            direct,
            productPack
        } = info;

        const currentAffCookie = getCookie('affiliate_tag');
        const affFromParams = decodeQueryParam('aff');
        const affiliateOverwrite = decodeQueryParam('affOverwrite') ? ? null;
        window.affiliate = productPack || affFromParams || currentAffCookie || direct;

        if (productPack !== affFromParams && !affiliateOverwrite) {
            window.affiliateOverwrite = affFromParams;
            setCookie('affiliate_overwrite', window.affiliateOverwrite, 86400 * 30);
        }

        if (affiliateOverwrite !== null) {
            window.affiliateOverwrite = affiliateOverwrite;
            setCookie('affiliate_overwrite', window.affiliateOverwrite, 86400 * 30);
        }

        setCookie('affiliate_tag', window.affiliate, 86400 * 30); // 30 days
    }

    function runAffiliateTagging() {
        initEntryUrl();
        initAffiliateTag();
        addAffiliateParamToLinks();
    }

    if (!window.deferAffiliateAutoRun) {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            runAffiliateTagging();
        } else {
            document.addEventListener('DOMContentLoaded', runAffiliateTagging);
        }
    }

    window.runAffiliateTagging = runAffiliateTagging;
})();