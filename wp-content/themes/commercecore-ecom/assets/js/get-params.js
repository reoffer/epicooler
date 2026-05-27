// Function to get the value of a query parameter by name
function cc_getQueryParam(name) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get(name);
}

function cc_setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
}

function cc_getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function cc_storeGetParams() {
    const PARAMS_CONFIG = [{
            key: 'gclid',
            cookieKey: 'cc_param_core_gclid',
            encode: false
        },
        {
            key: 'wbraid',
            cookieKey: 'cc_param_core_wbraid',
            encode: false
        },
        {
            key: 'gbraid',
            cookieKey: 'cc_param_core_gbraid',
            encode: false
        },
        {
            key: 'core_wbraid',
            cookieKey: 'cc_param_core_wbraid',
            encode: false
        },
        {
            key: 'core_gbraid',
            cookieKey: 'cc_param_core_gbraid',
            encode: false
        },
        {
            key: 'core_gclid',
            cookieKey: 'cc_param_core_gclid',
            encode: false
        },
        {
            key: 'tracking_id',
            cookieKey: 'cc_param_tracking_id',
            encode: false
        },
        {
            key: 'cid',
            cookieKey: 'cc_param_cid',
            encode: false
        },
        {
            key: 'c3',
            cookieKey: 'cc_param_c3',
            encode: false
        },
        {
            key: 'tabId',
            cookieKey: 'cc_param_tabId',
            encode: false
        },
        {
            key: 'pp_sandbox',
            cookieKey: 'cc_param_pp_sandbox',
            encode: false
        },
        {
            key: 'network-aff',
            cookieKey: 'cc_param_network-aff',
            encode: false
        },
        {
            key: 'newsbreak_cid',
            cookieKey: 'cc_param_newsbreak_cid',
            encode: false
        },
        {
            key: '_raclid',
            cookieKey: 'cc_param__raclid',
            encode: false
        },
        {
            key: 'caid',
            cookieKey: 'cc_param_caid',
            encode: false
        },
        {
            key: 'performclickID',
            cookieKey: 'cc_param_performclickID',
            encode: false
        },
        {
            key: 'adclid',
            cookieKey: 'cc_param_adclid',
            encode: false
        },
        {
            key: 'transaction_id',
            cookieKey: 'cc_param_transaction_id',
            encode: false
        },
        {
            key: 'campaignid',
            cookieKey: 'cc_param_campaignid',
            encode: false
        },
        {
            key: 'pi_clickid',
            cookieKey: 'cc_param_pi_clickid',
            encode: false
        },
        {
            key: 'pi_companyid',
            cookieKey: 'cc_param_pi_companyid',
            encode: false
        },
        {
            key: 'obclid',
            cookieKey: 'cc_param_obclid',
            encode: false
        },
        {
            key: 'rc_uuid',
            cookieKey: 'cc_param_rc_uuid',
            encode: false
        },
    ];

    PARAMS_CONFIG.forEach((config) => {
        const value = cc_getQueryParam(config.key);
        if (value) {
            const finalValue = config.encode ? encodeURIComponent(value) : value;
            cc_setCookie(config.cookieKey, finalValue, 30);
        }
    });
}

function cc_fireWebhookToStape(purchaseEvent) {
    const googleClickIds = ['gclid', 'wbraid', 'gbraid'];

    googleClickIds.forEach((value) => {
        const cookieName = 'cc_param_' + value;
        const cookieValue = cc_getCookie(cookieName);
        if (cookieValue) {
            const data = {
                [value]: cookieValue,
                event_name: 'server_conversion',
                order: purchaseEvent.ecommerce,
            };

            const endPoint = '/wp-json/checkout/v1/order/post-conversion';

            fetch(endPoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((data) => {
                    cc_setCookie(cookieName, null, 0);
                })
                .catch((error) => {
                    console.error('Error sending Google IDs:', error);
                })
                .finally(() => {
                    return true;
                });
        }
    });
}

window.addEventListener('DOMContentLoaded', cc_storeGetParams);