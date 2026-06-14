(function() {
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.navbar nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var isOpen = nav.classList.toggle('open');
    btn.textContent = isOpen ? '⊗ MENU' : '⊕ MENU';
  });

  nav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      btn.textContent = '⊕ MENU';
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar')) {
      nav.classList.remove('open');
      btn.textContent = '⊕ MENU';
    }
  });
})();
