/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-20 | 大模型：Tencent Hunyuan Hy
 * 首页专属动态效果
 */
(function () {
  const yy_canvas = document.getElementById('yy_petal_canvas');
  if (!yy_canvas) return;

  const yy_ctx = yy_canvas.getContext('2d');
  const yy_petals = [];
  const yy_palette = ['#ffb9a3', '#ffd98e', '#7fd4c1', '#8fc7ed', '#b9a7e3'];
  const yy_pointer = { x: -1000, y: -1000 };
  let yy_width = 0;
  let yy_height = 0;
  let yy_raf = null;

  function yy_resize() {
    yy_width = yy_canvas.width = window.innerWidth;
    yy_height = yy_canvas.height = window.innerHeight;
  }

  function yy_create_petal() {
    return {
      x: Math.random() * yy_width,
      y: Math.random() * yy_height - yy_height,
      r: 3 + Math.random() * 6,
      vy: 0.35 + Math.random() * 0.7,
      vx: (Math.random() - 0.5) * 0.5,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: 0.012 + Math.random() * 0.022,
      color: yy_palette[Math.floor(Math.random() * yy_palette.length)],
      alpha: 0.35 + Math.random() * 0.4,
      shape: Math.random() > 0.5 ? 'circle' : 'petal'
    };
  }

  function yy_init_petals() {
    yy_petals.length = 0;
    const yy_count = Math.min(70, Math.floor((yy_width * yy_height) / 16000));
    for (let yy_i = 0; yy_i < yy_count; yy_i++) {
      yy_petals.push(yy_create_petal());
    }
  }

  function yy_draw_petal(yy_p) {
    yy_ctx.save();
    yy_ctx.globalAlpha = yy_p.alpha;
    yy_ctx.fillStyle = yy_p.color;
    yy_ctx.shadowColor = yy_p.color;
    yy_ctx.shadowBlur = 8;
    yy_ctx.beginPath();
    if (yy_p.shape === 'circle') {
      yy_ctx.arc(yy_p.x, yy_p.y, yy_p.r, 0, Math.PI * 2);
    } else {
      yy_ctx.ellipse(yy_p.x, yy_p.y, yy_p.r, yy_p.r * 0.55, yy_p.swing, 0, Math.PI * 2);
    }
    yy_ctx.fill();
    yy_ctx.restore();
  }

  function yy_animate() {
    yy_ctx.clearRect(0, 0, yy_width, yy_height);
    yy_petals.forEach(function (yy_p) {
      yy_p.y += yy_p.vy;
      yy_p.swing += yy_p.swingSpeed;
      yy_p.x += yy_p.vx + Math.sin(yy_p.swing) * 0.5;

      const yy_dx = yy_p.x - yy_pointer.x;
      const yy_dy = yy_p.y - yy_pointer.y;
      const yy_dist = Math.sqrt(yy_dx * yy_dx + yy_dy * yy_dy);
      if (yy_dist < 90 && yy_dist > 0) {
        yy_p.x += (yy_dx / yy_dist) * 1.2;
        yy_p.y += (yy_dy / yy_dist) * 1.2;
      }

      if (yy_p.y > yy_height + 20) {
        yy_p.y = -20;
        yy_p.x = Math.random() * yy_width;
      }
      if (yy_p.x < -20) yy_p.x = yy_width + 20;
      if (yy_p.x > yy_width + 20) yy_p.x = -20;

      yy_draw_petal(yy_p);
    });
    yy_raf = requestAnimationFrame(yy_animate);
  }

  window.addEventListener('resize', function () {
    yy_resize();
    yy_init_petals();
  });

  window.addEventListener('mousemove', function (yy_event) {
    yy_pointer.x = yy_event.clientX;
    yy_pointer.y = yy_event.clientY;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (yy_raf) cancelAnimationFrame(yy_raf);
    } else {
      yy_animate();
    }
  });

  yy_resize();
  yy_init_petals();
  yy_animate();
})();

(function () {
  const yy_cards = document.querySelectorAll('.yy_nav_card');
  if (!yy_cards.length) return;

  const yy_observer = new IntersectionObserver(function (yy_entries) {
    yy_entries.forEach(function (yy_entry) {
      if (yy_entry.isIntersecting) {
        const yy_delay = Number(yy_entry.target.dataset.yyDelay || 0);
        setTimeout(function () {
          yy_entry.target.classList.add('yy_in');
        }, yy_delay);
        yy_observer.unobserve(yy_entry.target);
      }
    });
  }, { threshold: 0.15 });

  yy_cards.forEach(function (yy_card) {
    yy_observer.observe(yy_card);

    yy_card.addEventListener('mousemove', function (yy_event) {
      const yy_rect = yy_card.getBoundingClientRect();
      const yy_x = (yy_event.clientX - yy_rect.left) / yy_rect.width - 0.5;
      const yy_y = (yy_event.clientY - yy_rect.top) / yy_rect.height - 0.5;
      yy_card.style.transform =
        'perspective(800px) rotateY(' + (yy_x * 10) + 'deg) rotateX(' + (-yy_y * 10) + 'deg) translateY(-12px) scale(1.03)';
    });

    yy_card.addEventListener('mouseleave', function () {
      yy_card.style.transform = '';
    });
  });
})();

(function () {
  const yy_title = document.querySelector('.yy_hero_title');
  if (!yy_title) return;

  const yy_text = yy_title.dataset.yyText || '';
  const yy_accent = yy_title.dataset.yyAccent || '';
  yy_title.innerHTML = '';

  Array.from(yy_text).forEach(function (yy_char, yy_i) {
    const yy_span = document.createElement('span');
    yy_span.className = 'yy_word';
    if (yy_accent && yy_i >= yy_text.indexOf(yy_accent)) {
      yy_span.classList.add('yy_word_accent');
    }
    yy_span.textContent = yy_char === ' ' ? '\u00a0' : yy_char;
    yy_span.style.animationDelay = (0.25 + yy_i * 0.055) + 's';
    yy_title.appendChild(yy_span);
  });
})();

(function () {
  const yy_nums = document.querySelectorAll('.yy_stat_num[data-yy-count]');
  if (!yy_nums.length) return;

  const yy_counterObserver = new IntersectionObserver(function (yy_entries) {
    yy_entries.forEach(function (yy_entry) {
      if (yy_entry.isIntersecting) {
        const yy_el = yy_entry.target;
        const yy_target = Number(yy_el.dataset.yyCount);
        const yy_duration = 1200;
        const yy_start = performance.now();
        const yy_suffix = yy_el.dataset.yySuffix || '';

        function yy_step(yy_now) {
          const yy_progress = Math.min((yy_now - yy_start) / yy_duration, 1);
          const yy_eased = 1 - Math.pow(1 - yy_progress, 3);
          yy_el.textContent = Math.round(yy_target * yy_eased) + yy_suffix;
          if (yy_progress < 1) {
            requestAnimationFrame(yy_step);
          }
        }
        requestAnimationFrame(yy_step);
        yy_counterObserver.unobserve(yy_el);
      }
    });
  }, { threshold: 0.5 });

  yy_nums.forEach(function (yy_num) {
    yy_counterObserver.observe(yy_num);
  });
})();
