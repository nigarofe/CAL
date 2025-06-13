async function loadComponent(url, placeholderId) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
    } catch (error) {
        console.error(`Failed to load component ${url}:`, error);
        document.getElementById(placeholderId).innerHTML = `<p class="text-danger">Error loading component: ${url}</p>`;
    }
}

let questionsTableMini, questionsTableMiniTh, questionsTableMiniBody, questionsTable;

const metricRadios = [
    { id: 'metric-question_number', order_by: 'question_number' },
    { id: 'metric-pmgx', order_by: 'potential_memory_gain_multiplier' },
    { id: 'metric-pmgd', order_by: 'potential_memory_gain_in_days' },
    { id: 'metric-lami', order_by: 'latest_memory_interval' },
    { id: 'metric-dsla', order_by: 'days_since_last_attempt' }
];

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('components/toast.html', 'toast-container-placeholder').then(() => {
        showToast('Welcome!', 'This is a sample toast message.', 'Just now');
    });
    loadComponent('components/sticky-navbar.html', 'navbar-container').then(() => {

        metricRadios.forEach(radio => {
            const el = document.getElementById(radio.id);
            if (el) {
                el.addEventListener('change', function () {
                    reloadPage();
                });
            }
        });
    });
    loadComponent('components/add-question-form.html', 'add-question-form-container');
    loadComponent('components/questions-table-mini.html', 'questions-table-mini-container').then(() => {
        questionsTableMini = document.getElementById('questionsTableMini');
        questionsTableMiniTh = document.getElementById('questionsTableMiniTh');
        questionsTableMiniBody = document.getElementById('questionsTableMiniBody');
    });
    loadComponent('components/questions-table.html', 'questions-table-container').then(() => {
        questionsTable = document.getElementById('questionsTable');
    });

    const questionCreationform = document.getElementById('add-question-form-container');

    questionCreationform.addEventListener('submit', () => {
        const discipline = document.getElementById('discipline').value;
        const source = document.getElementById('source').value;
        const description = document.getElementById('description').value;

        postQuestion(discipline, source, description);
    });

    const observer = new MutationObserver(() => {
        const el_autohide = document.querySelector('.autohide');
        if (el_autohide) {
            let last_scroll_top = 0;
            window.addEventListener('scroll', function () {
                let scroll_top = window.scrollY;
                if (scroll_top < last_scroll_top) {
                    el_autohide.classList.remove('scrolled-down');
                    el_autohide.classList.add('scrolled-up');
                } else {
                    el_autohide.classList.remove('scrolled-up');
                    el_autohide.classList.add('scrolled-down');
                }
                last_scroll_top = scroll_top;
            });
            observer.disconnect();
        }
    });
    observer.observe(document.getElementById('navbar-container'), { childList: true });
});

function showToast(toastTitle, toastMessage, toastTime) {
    const toastLiveExample = document.getElementById('liveToast');
    if (!toastLiveExample) return; // Exit if toast element is not present
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

    const toastTitleElem = document.getElementById('toastTitle');
    const toastMessageElem = document.getElementById('toastMessage');
    const toastTimeElem = document.getElementById('toastTime');
    if (toastTitleElem) toastTitleElem.innerHTML = toastTitle;
    if (toastMessageElem) toastMessageElem.innerHTML = toastMessage;
    if (toastTimeElem) toastTimeElem.innerHTML = toastTime;

    toastBootstrap.show();
}