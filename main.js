/* Рендер карточек проектов + анимации появления. Редактировать не нужно. */

(function () {
  "use strict";

  var LINK_LABELS = {
    demo: "Демо ↗",
    repo: "Код ↗",
    case: "Кейс ↗",
    site: "Сайт ↗",
    store: "Chrome Web Store ↗",
    page: "Страница проекта ↗"
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderSlot() {
    var card = el("article", "project project--slot reveal");
    card.appendChild(el("p", "project__slotmark", "Свободный слот"));
    card.appendChild(el("h3", "project__title", "Место под проект"));
    card.appendChild(el("p", "project__hint", "Описание появится здесь — заполняется в projects.js"));
    return card;
  }

  function renderProject(p) {
    var card = el("article", "project reveal");

    var top = el("div", "project__top");
    top.appendChild(el("span", "project__type", p.type || ""));
    top.appendChild(el("span", "project__year", p.year || ""));
    card.appendChild(top);

    card.appendChild(el("h3", "project__title", p.title));

    if (p.tagline) card.appendChild(el("p", "project__tagline", p.tagline));

    if (p.points && p.points.length) {
      var ul = el("ul", "project__points");
      p.points.forEach(function (point) { ul.appendChild(el("li", null, point)); });
      card.appendChild(ul);
    }

    if (p.stack && p.stack.length) {
      var chips = el("ul", "chips");
      p.stack.forEach(function (tech) { chips.appendChild(el("li", null, tech)); });
      card.appendChild(chips);
    }

    if (p.role) card.appendChild(el("p", "project__role", p.role));

    if (p.links) {
      var box = el("div", "project__links");
      Object.keys(p.links).forEach(function (key) {
        var href = p.links[key];
        if (!href) return;
        var a = el("a", null, LINK_LABELS[key] || key);
        a.href = href;
        if (href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
        box.appendChild(a);
      });
      if (box.children.length) card.appendChild(box);
    }

    return card;
  }

  var grid = document.getElementById("projects-grid");
  var list = window.PROJECTS || [];

  if (grid) {
    if (!list.length) {
      for (var i = 0; i < 3; i++) grid.appendChild(renderSlot());
    } else {
      list.forEach(function (p) {
        grid.appendChild(p && p.slot ? renderSlot() : renderProject(p));
      });
    }
  }

  /* Незаполненные ⟨плейсхолдеры⟩ — на экране видны, из печати и PDF убираются */
  document.querySelectorAll(".project p, .project li, .project__year").forEach(function (n) {
    if (n.textContent.indexOf("⟨") !== -1) n.classList.add("todo");
  });

  /* Появление блоков при скролле */
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (n) { n.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* Тонкая линия под шапкой после скролла */
  var nav = document.querySelector(".nav");
  var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 12); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
