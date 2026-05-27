(function() {
    if (EF) {
        if (EF.urlParameter('guaffid') || !EF.urlParameter('affid2')) {
            return;
        }

        const getCookie = (cname) => {
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

        const setCookie = (cname, cvalue, exh) => {
            if (!cvalue) {
                return;
            }

            const d = new Date();
            d.setTime(d.getTime() + exh * 60 * 60 * 1000);
            let expires = 'expires=' + d.toUTCString();
            document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
        };

        let args = {
            offer_id: EF.urlParameter('oid'),
            affiliate_id: EF.urlParameter('affid2'),
            sub1: EF.urlParameter('sub1'),
            sub2: EF.urlParameter('sub2'),
            sub3: EF.urlParameter('sub3'),
            sub4: EF.urlParameter('sub4'),
            sub5: EF.urlParameter('sub5'),
            uid: EF.urlParameter('uid'),
            source_id: EF.urlParameter('source_id'),
            transaction_id: EF.urlParameter('_ef_transaction_id') ||
                EF.urlParameter('transaction_id') ||
                getCookie('ef_transaction_id'),
        };

        let parsedArgs = {};

        for (let i in args) {
            if (args[i]) {
                parsedArgs[i] = args[i];
                setCookie('ef_' + i, args[i], 24);
            }
        }

        const callbackPromise = (createdTransactionId) => {
            if (createdTransactionId && typeof createdTransactionId === 'string') {
                setCookie('ef_transaction_id', createdTransactionId, 24);

                Array.from(document.getElementsByTagName('a')).forEach((link) => {
                    let url = link.getAttribute('href') ? .trim() || '';

                    if (
                        url.indexOf('postId=remote') !== -1 &&
                        url.indexOf('legal') === -1 &&
                        url.indexOf('transaction_id') === -1
                    ) {
                        let separator = url.indexOf('?') !== -1 ? '&' : '?';

                        url += separator + 'transaction_id=' + createdTransactionId;
                        link.setAttribute('href', url);
                    }
                });

                const url = new URL(window.location);
                url.searchParams.set('transaction_id', createdTransactionId);
                window.history.pushState(null, '', url.toString());
            }
        };

        parsedArgs.tracking_domain = 'https://www.csszp8trk.com';

        if (!args.transaction_id) {
            EF.click(parsedArgs).then(callbackPromise);
        } else {
            callbackPromise(args.transaction_id);
        }
    }
})();