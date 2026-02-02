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