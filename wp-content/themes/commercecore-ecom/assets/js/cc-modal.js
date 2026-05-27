function createModal() {
    const modal = document.createElement('div');
    modal.className = 'jquery-modal blocker current';
    modal.id = 'pageModal';
    modal.style.opacity = '1';
    modal.style.display = 'flex';
    modal.style.transition = '.5s opacity';
    const baseUrl = object_name.templateUrl;
    const logo = object_name.global_logo || `${baseUrl}/assets/images/icons/logo.svg`;
    modal.innerHTML = `<div class="spinner" style="position: absolute"><div class="spin"><div></div></div></div>

    <div class="modal legal-page-modal" style="display: inline-block; opacity: 0;">
    <section class="legal-page-logoExitWrapper">
      <section class="legal-page-logoExit">
      <img class="legal-page-logoExit__image" src="${logo}"/>
      <a class="close-icon" rel="modal:close">
        <img src="${baseUrl}/assets/images/icons/cross.svg" class="close-image" alt="Close Window">
      </a>
    </section>
    </section>
 
      <section class="legal-page-title"></section>
    <section class="legal-page-contentWrapper">
      <section class="legal-page-contentInnerWrapper">
        <section class="legal-page-content">
        
        </section>
      </section>
    </section>

    </div>`;

    document.body.prepend(modal);

    document.addEventListener('click', (event) => {
        const classList = event.target.classList;
        if (
            classList.contains('blocker') ||
            classList.contains('close-image') ||
            classList.contains('legal-page-contentWrapper') ||
            classList.contains('legal-page-modal')
        ) {
            closeModal(modal);
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'Escape') {
            closeModal(modal);
        }
    });

    return modal;
}

function closeModal(modal) {
    const modalContent = document.querySelector('.modal');
    const modalSpinner = document.querySelector('.spinner');

    modalContent.style.opacity = 0;
    modalSpinner.style.opacity = 0;
    modal.style.opacity = 0;
    setTimeout(() => {
        modal.style.display = 'none';
    }, 500);
    document.body.style.overflow = 'visible';
}

async function openPageInModalWindow(event) {
    event.preventDefault();
    const clickedElement = event.target;
    const link = clickedElement.tagName.toLowerCase() === 'img' ? clickedElement.closest('a') : clickedElement;
    if (!link) return;

    const slug = link.dataset.slug || (link.href ? link.href.split('/')[4] : null);
    if (!slug) return;

    const shouldOpenModal = checkShouldOpenModal(slug);

    if (!shouldOpenModal) {
        if (shouldOpenInNewWindow()) {
            window.open(link.href, '_blank');
        } else {
            window.location.href = link.href;
        }
        return;
    }

    const modal = document.getElementById('pageModal') || createModal();
    modal.classList.add('blocker');
    modal.classList.add('current');
    modal.style.display = 'flex';
    modal.style.opacity = 1;
    const modalContent = document.querySelector('.modal');
    const modalSpinner = document.querySelector('.spinner');
    modalSpinner.style.opacity = 1;

    const title = modal.querySelector('.legal-page-title');
    const content = modal.querySelector('.legal-page-content');

    title.textContent = 'Loading...';
    content.innerHTML = 'Loading...';

    document.body.style.overflow = 'hidden';

    try {
        const response = await fetch(`/wp-json/cc-theme/v1/legal?slug=${slug}`);
        const data = await response.json();
        title.textContent = data.post_title;
        content.innerHTML = data.post_content;
        modalContent.style.opacity = 1;
        modalContent.style.overflow = 'visible';
        modalSpinner.style.opacity = 0;
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error fetching modal content:', error);
    }
}

function checkShouldOpenModal(slug) {
    const sizeChartRegex = /^size-chart/i;
    const toggleModal = object_name.toggle_modal;
    const postType = object_name.post_type;

    const modalPostTypes = [
        'product_page',
        'article',
        'listicle_page',
        'pre_landing_page',
        'video_page',
        'checkout',
        'upsell',
        'thankyou',
        'review_page',
        'home_page',
        'pagelanders',
        'hybridlander',
    ];

    // Always open in modal for specific slugs
    if (sizeChartRegex.test(slug)) {
        return true;
    }

    // Check toggle and post type conditions
    return !!(toggleModal && modalPostTypes.includes(postType));
}

function shouldOpenInNewWindow() {
    return object_name.target_blank;
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (event) => {
        const link = event.target.closest('a[href*=legal]');
        if (link) {
            openPageInModalWindow(event).catch((error) => {
                console.error('Error opening modal window:', error);
                // Optional: show an error message to the user
            });
        }
    });

    if (shouldOpenInNewWindow()) {
        document.querySelectorAll('a[href*=legal]').forEach((link) => {
            link.setAttribute('target', '_blank');
        });
    }

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      .legal-page-logoExitWrapper{width:100%;background-color:#fff}.legal-page-logoExit{background-color:#fff;display:flex;justify-content:space-between;align-items:center;max-width:920px;width:100%;padding:14px 24px;margin:0 auto}.legal-page-logoExit__image{width:180px;height:auto}.legal-page-title{background-color:#333;font-family:Poppins,sans-serif;font-size:32px;font-weight:500;line-height:40px;padding:14px 24px;text-align:center;color:#fff}.legal-page-contentWrapper{width:100%;background-color:#f2f2f2}.legal-page-contentInnerWrapper{background-color:#f2f2f2;padding:24px 24px;margin:0 auto;max-width:920px}.legal-page-content{background-color:#fff;-webkit-box-shadow:0 .5rem 1rem rgba(0,0,0,.15);box-shadow:0 .5rem 1rem rgba(0,0,0,.15);max-width:100%;padding:40px;margin:0 auto}@media screen and (max-width:767px){.legal-page-logoExit{padding:16px}.legal-page-logoExit__image{width:105px;height:20px}.legal-page-title{font-size:24px;line-height:32px;padding:8px 0}.legal-page-contentInnerWrapper{padding:0}.legal-page-content{padding:16px}.legal-page-contentWrapper{padding:25px 15px}}.legal-page-modal{max-width:100%;width:100%;z-index:99999999;padding:0;height:100%;background:#f2f2f2;border-radius:0;box-shadow:none;text-align:initial;position:relative}.legal-page-content h1{font-family:Roboto,sans-serif;font-size:24px;font-weight:700;line-height:32px;color:#333;text-transform:capitalize}.legal-page-content h2{font-family:Roboto,sans-serif;font-size:20px;font-weight:700;line-height:24px;color:#333}.legal-page-content h3{font-family:Roboto,sans-serif;font-size:16px;font-weight:700;line-height:24px;color:#333}.legal-page-content li a,.legal-page-content p a{color:#0017e9}.legal-page-content p a{font-family:Roboto,sans-serif;font-size:16px;font-weight:400;line-height:24px;margin:16px 0}.legal-page-content p strong strong{font-family:Roboto,sans-serif;font-size:16px;font-weight:700;line-height:24px;color:#333}.legal-page-content p{font-family:Roboto,sans-serif;font-size:16px;font-weight:400;line-height:24px;margin:16px 0;color:#4f4f4f}.legal-page-content p:first-of-type{margin-top:0}.legal-page-content p strong{font-weight:700}.legal-page-content ol{counter-reset:main;list-style-type:none;padding:0;font-family:Roboto,sans-serif;font-size:16px;font-weight:700;line-height:24px;color:#333}.legal-page-content ol li{counter-increment:main;margin-bottom:16px}.legal-page-content li::before{content:counter(main) ". ";font-weight:700}.legal-page-content li ol{padding:0;counter-reset:item;list-style-type:none;font-family:Roboto,sans-serif;font-size:16px;font-weight:400;line-height:24px;color:#4f4f4f}.legal-page-content li ol li:not(:last-of-type){margin-bottom:8px}.legal-page-content li ol>li{counter-increment:sub}.legal-page-content li ol li{margin-top:8px}.legal-page-content li ol>li::before{content:counter(main) "." counter(sub) " "}.legal-page-content .wp-block-image img{width:100%}@media screen and (max-width:767px){.legal-page-content li ol>li::before{font-weight:700}}.legal-page-content li ol>li{content:counter(main) "." counter(sub) " "}.legal-page-content ol li ol li ol>li{counter-increment:sub-sub}.legal-page-content ol li ol li ol>li::before{content:counter(main) "." counter(sub) "." counter(sub-sub) ". "}.wp-block-table table tbody{margin-top:8px;overflow-x:scroll}.wp-block-table table tbody tr{display:grid;grid-template-columns:repeat(4,1fr)}.wp-block-table table tbody tr{display:grid;grid-template-columns:repeat(4,1fr)}@media screen and (max-width:767px){.wp-block-table table{display:block;overflow:scroll;overflow-x:auto}.wp-block-table table tbody tr{display:block}.wp-block-table table tbody tr td{min-width:200px}}.wp-block-table table tbody tr{border:1px solid #828282;font-family:Roboto,sans-serif;font-size:14px;font-weight:400;line-height:20px;color:#4f4f4f}.wp-block-table table tbody tr:first-of-type{background-color:#e0e0e0;font-weight:700}.wp-block-table table tbody tr td{border:none;padding:10px 12px;border-right:1px solid #828282}.wp-block-table table tbody tr td:last-of-type{border-right:none}.wp-block-table table tbody tr:not(:first-of-type){border-top:none}.blocker{position:fixed;top:0;right:0;bottom:0;left:0;width:100%;height:100%;overflow:auto;padding:0;box-sizing:border-box;background-color:rgba(0,0,0,.75);text-align:center}.modal a.close-modal{position:absolute}.blocker{z-index:99999998}.legal-page-modal .close-icon{transition:transform .3s;z-index:1;cursor:pointer;width:40px;height:40px}.legal-page-modal .close-icon img{height:100%}.legal-page-modal .close-icon:hover{transform:rotate(90deg);transform-origin:center}.current{display:flex;align-items:center;justify-content:center}.spin{display:inline-block;position:relative;width:50px;height:50px}.spin div{width:100%;height:100%;border:7px solid rgba(255,255,255,.5);border-bottom:7px solid #fff;border-radius:50%;position:relative;transform:rotate(130deg);animation:1s linear infinite spin;opacity:1}.spin div:nth-child(2){animation-delay:-.5s}@keyframes spin{0%{transform:rotate(130deg)}100%{transform:rotate(490deg)}}
    `;

    document.head.appendChild(styleTag);
});