/* Creative Dentistry — interactions */
(function(){
  'use strict';

  /* sticky nav shadow */
  var nav = document.querySelector('.nav');
  function onScroll(){
    if(window.scrollY > 12) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* mobile menu */
  var menu = document.getElementById('mobileMenu');
  var burger = document.getElementById('burger');
  function openMenu(){menu.classList.add('open');document.body.style.overflow='hidden';}
  function closeMenu(){menu.classList.remove('open');document.body.style.overflow='';}
  if(burger) burger.addEventListener('click', openMenu);
  document.querySelectorAll('[data-mm-close]').forEach(function(el){el.addEventListener('click', closeMenu);});
  menu && menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click', closeMenu);});

  /* reveal on scroll — visibility is GUARANTEED (never depends on a transition completing) */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function hardShow(el){            // jump straight to end-state, no transition clock needed
    el.classList.add('in');
    el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
  }
  function softShow(el){           // play the fade where the context actually paints…
    if(el.classList.contains('in')) return;
    el.classList.add('in');
    setTimeout(function(){ hardShow(el); }, 850);  // …but guarantee end-state shortly after
  }
  function revealInView(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function(el){
      if(el.style.opacity === '1') return;
      var r = el.getBoundingClientRect();
      if(r.top < vh * 0.95) hardShow(el);   // anything in view shows instantly + guaranteed
    });
  }
  function revealAll(){ reveals.forEach(hardShow); }

  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ softShow(e.target); io.unobserve(e.target); } });
    },{threshold:.08, rootMargin:'0px 0px -6% 0px'});
    reveals.forEach(function(el){io.observe(el);});
    revealInView();                          // in-view (hero etc.) visible immediately
    requestAnimationFrame(revealInView);
    window.addEventListener('scroll', revealInView, {passive:true});
    window.addEventListener('load', revealInView);
    setTimeout(revealInView, 300);
    setTimeout(revealAll, 1400);             // last-resort: everything visible regardless
  } else {
    revealAll();
  }

  /* booking modal */
  var root = document.getElementById('bookModal');
  var form = document.getElementById('bookForm');
  var bodyForm = document.getElementById('bookFormBody');
  var bodyDone = document.getElementById('bookDone');
  var lastFocus = null;

  function openModal(prefill){
    lastFocus = document.activeElement;
    root.classList.add('open');
    document.body.style.overflow='hidden';
    bodyForm.style.display='';
    bodyDone.style.display='none';
    if(prefill && form.elements['service']){ form.elements['service'].value = prefill; }
    setTimeout(function(){ var f=form.querySelector('input'); f && f.focus(); }, 360);
  }
  function closeModal(){
    root.classList.remove('open');
    document.body.style.overflow='';
    lastFocus && lastFocus.focus();
  }
  document.querySelectorAll('[data-book]').forEach(function(b){
    b.addEventListener('click', function(e){
      e.preventDefault();
      openModal(b.getAttribute('data-book') || '');
      closeMenu();
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function(b){b.addEventListener('click', closeModal);});
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && root.classList.contains('open')) closeModal(); });

  /* validation */
  function setErr(name, on){
    var field = form.querySelector('[data-field="'+name+'"]');
    if(field) field.classList.toggle('err', on);
  }
  form && form.addEventListener('submit', function(e){
    e.preventDefault();
    var ok = true;
    ['name','phone','email'].forEach(function(n){
      var v = (form.elements[n].value||'').trim();
      var bad = !v || (n==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) || (n==='phone' && v.replace(/\D/g,'').length<7);
      setErr(n, bad);
      if(bad) ok=false;
    });
    if(!ok) return;
    var who = (form.elements['name'].value||'').trim().split(' ')[0];
    document.getElementById('doneName').textContent = who ? (', '+who) : '';
    bodyForm.style.display='none';
    bodyDone.style.display='';
    form.reset();
  });

  /* current year */
  var y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();
})();
