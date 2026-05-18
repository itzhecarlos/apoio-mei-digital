document.getElementById('year').textContent = new Date().getFullYear();

const faqs = Array.from(document.querySelectorAll('details'));
faqs.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    faqs.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

const disclaimerModal = document.getElementById('disclaimerModal');
const disclaimerModalClose = document.getElementById('disclaimerModalClose');
const disclaimerModalAcknowledge = document.getElementById('disclaimerModalAcknowledge');
const disclaimerStorageKey = 'apoiomei-disclaimer-seen';

const closeDisclaimerModal = () => {
  if (!disclaimerModal) return;
  disclaimerModal.classList.remove('is-open');
  disclaimerModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  localStorage.setItem(disclaimerStorageKey, 'true');
};

const openDisclaimerModal = () => {
  if (!disclaimerModal) return;
  disclaimerModal.classList.add('is-open');
  disclaimerModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

if (disclaimerModal && !localStorage.getItem(disclaimerStorageKey)) {
  openDisclaimerModal();
}

[disclaimerModalClose, disclaimerModalAcknowledge].forEach((button) => {
  if (!button) return;
  button.addEventListener('click', closeDisclaimerModal);
});

if (disclaimerModal) {
  disclaimerModal.addEventListener('click', (event) => {
    if (event.target === disclaimerModal) {
      closeDisclaimerModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && disclaimerModal.classList.contains('is-open')) {
      closeDisclaimerModal();
    }
  });
}
