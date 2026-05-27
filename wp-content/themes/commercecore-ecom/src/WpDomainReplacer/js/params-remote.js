function getCookieReplacer(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookiePart = parts.pop();
        return cookiePart ? cookiePart.split(';').shift() : null;
    }
    return null;
}

function addAffParamToCtaLinksReplacer() {
    if (!window.affiliate || !window.entry_url || !domain_replacer) return;

    const replaceTo = domain_replacer.replace_to;

    const PARAMS_CONFIG = [{
            key: 'tabId',
            cookieKey: 'cc_param_tabId',
            urlKey: 'tabId'
        },
        {
            key: 'newsbreak_cid',
            cookieKey: 'cc_param_newsbreak_cid',
            urlKey: 'newsbreak_cid'
        },
        {
            key: 'core_gclid',
            cookieKey: 'cc_param_core_gclid',
            urlKey: 'gclid'
        },
        {
            key: 'core_gbraid',
            cookieKey: 'cc_param_core_gbraid',
            urlKey: 'gbraid'
        },
        {
            key: 'core_wbraid',
            cookieKey: 'cc_param_core_wbraid',
            urlKey: 'wbraid'
        },
        {
            key: 'tracking_id',
            cookieKey: 'cc_param_tracking_id',
            urlKey: 'tracking_id'
        },
        {
            key: '_raclid',
            cookieKey: 'cc_param__raclid',
            urlKey: '_raclid'
        },
        {
            key: 'caid',
            cookieKey: 'cc_param_caid',
            urlKey: 'caid'
        },
        {
            key: 'performclickID',
            cookieKey: 'cc_param_performclickID',
            urlKey: 'performclickID'
        },
        {
            key: 'adclid',
            cookieKey: 'cc_param_adclid',
            urlKey: 'adclid'
        },
        {
            key: 'transaction_id',
            cookieKey: 'cc_param_transaction_id',
            urlKey: 'transaction_id'
        },
        {
            key: 'campaignid',
            cookieKey: 'cc_param_campaignid',
            urlKey: 'campaignid'
        },
        {
            key: 'pi_clickid',
            cookieKey: 'cc_param_pi_clickid',
            urlKey: 'pi_clickid'
        },
        {
            key: 'pi_companyid',
            cookieKey: 'cc_param_pi_companyid',
            urlKey: 'pi_companyid'
        },
        {
            key: 'obclid',
            cookieKey: 'cc_param_obclid',
            urlKey: 'obclid'
        },
        {
            key: 'rc_uuid',
            cookieKey: 'cc_param_rc_uuid',
            urlKey: 'rc_uuid'
        },
    ];

    let cookieParamString = '';

    PARAMS_CONFIG.forEach((config) => {
        const urlValue = new URLSearchParams(window.location.search).get(config.urlKey);
        const cookieValue = getCookieReplacer(config.cookieKey);
        const finalValue = urlValue || cookieValue;

        if (finalValue) {
            cookieParamString = cookieParamString + '&' + config.key + '=' + finalValue;
        }
    });

    if (window.EF) {
        const cc_ef_getCookie = (cname) => {
            var name = cname + '=';
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return '';
        };

        let args = {
            offer_id: 'oid',
            affiliate_id: 'affid2',
            sub1: 'sub1',
            sub2: 'sub2',
            sub3: 'sub3',
            sub4: 'sub4',
            sub5: 'sub5',
            uid: 'uid',
            source_id: 'source_id',
            transaction_id: 'transaction_id',
        };

        let args2 = {
            offer_id: 'guoid',
            affiliate_id: 'guaffid',
        };

        for (let i in args) {
            if (args[i]) {
                let efValue = cc_ef_getCookie('ef_' + i);

                if (efValue) {
                    cookieParamString = cookieParamString + '&' + args[i] + '=' + efValue;
                }
            }
        }

        for (let i in args2) {
            if (args2[i]) {
                let efValueGu = cc_ef_getCookie('ef_gu_' + i);

                if (efValueGu) {
                    cookieParamString = cookieParamString + '&' + args2[i] + '=' + efValueGu;
                }
            }
        }
    }

    const allLinks = Array.from(document.getElementsByTagName('a'));

    allLinks.forEach((link) => {
        let url = link.getAttribute('href') ? .trim() || '';

        if (url.indexOf(replaceTo) !== -1 && url.indexOf('legal') === -1) {
            let separator = url.indexOf('?') !== -1 ? '&' : '?';

            if (url.indexOf('aff') === -1 && url.indexOf('entryUrl') === -1) {
                url += separator + 'aff=' + window.btoa(window.affiliate) + '&entryUrl=' + window.btoa(window.entry_url);
                separator = '&';
            }

            if (url.indexOf('affOverwrite') == -1 && window.affiliateOverwrite) {
                url += separator + 'affOverwrite=' + window.btoa(window.affiliateOverwrite);
                separator = '&';
            }

            url += separator + 'postId=remote' + cookieParamString;
            link.setAttribute('href', url);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure aff.js has run and set window tracking params
    if (typeof window.runAffiliateTagging === 'function') {
        window.runAffiliateTagging();
    }

    addAffParamToCtaLinksReplacer();
});