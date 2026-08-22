const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navLinks.classList.toggle('open');
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const state = {};
function renderReceipt() {
  const list = $('#receiptList');
  list.innerHTML = '';
  let total = 0, any = false;
  Object.values(state).forEach(items => items.forEach(({name, price}) => {
    any = true; total += price;
    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><span>$${price.toFixed(2)}</span>`;
    list.appendChild(li);
  }));
  if (!any) list.innerHTML = '<li class="empty"><span>Elige tu ramen...</span><span>--</span></li>';
  $('#totalPrice').textContent = '$' + total.toFixed(2);
}

$$('.chips').forEach(group => {
  const g = group.dataset.group;
  state[g] = [];

  group.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;

    const multi = group.dataset.multi === 'true';
    const yaEstabaActivo = chip.classList.contains('on');

    if (!multi) {
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('on'));
      yaEstabaActivo ? chip.classList.remove('on') : chip.classList.add('on');
    } else {
      chip.classList.toggle('on');
    }

    state[g] = [...group.querySelectorAll('.chip.on')].map(c => ({
      name: c.textContent.replace(/\+?[\d.]+$|incluido/g, '').trim(),
      price: +c.dataset.price
    }));

    renderReceipt();
  });
});

let toastTimer;
$('#orderBtn').addEventListener('click', () => {
  $('#toastMsg').textContent = `Pedido enviado. Total ${$('#totalPrice').textContent}. Listo en ~12 minutos.`;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3200);
});

$('#year').textContent = new Date().getFullYear();