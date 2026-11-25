/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-20 | 大模型：Tencent Hunyuan Hy
 */
(function () {
  const yy_canvas = document.getElementById('yy_canvas');
  if (!yy_canvas) return;

  const yy_ctx = yy_canvas.getContext('2d');
  const yy_points = [];
  const yy_pointer = { x: -1000, y: -1000 };
  const yy_config = {
    count: 90,
    linkDistance: 140,
    pointRadius: 1.8,
    speed: 0.35,
    pointColor: 'rgba(120, 232, 210, 0.85)',
    lineColor: 'rgba(110, 190, 220, 0.18)'
  };

  let yy_width = 0;
  let yy_height = 0;
  let yy_animationId = null;

  function yy_resize() {
    yy_width = yy_canvas.width = window.innerWidth;
    yy_height = yy_canvas.height = window.innerHeight;
  }

  function yy_createPoints() {
    yy_points.length = 0;
    const yy_total = Math.min(yy_config.count, Math.floor((yy_width * yy_height) / 14000));
    for (let yy_i = 0; yy_i < yy_total; yy_i++) {
      yy_points.push({
        x: Math.random() * yy_width,
        y: Math.random() * yy_height,
        vx: (Math.random() - 0.5) * yy_config.speed,
        vy: (Math.random() - 0.5) * yy_config.speed
      });
    }
  }

  function yy_movePoints() {
    yy_points.forEach(function (yy_point) {
      yy_point.x += yy_point.vx;
      yy_point.y += yy_point.vy;
      if (yy_point.x < 0 || yy_point.x > yy_width) yy_point.vx *= -1;
      if (yy_point.y < 0 || yy_point.y > yy_height) yy_point.vy *= -1;

      const yy_dx = yy_point.x - yy_pointer.x;
      const yy_dy = yy_point.y - yy_pointer.y;
      const yy_dist = Math.sqrt(yy_dx * yy_dx + yy_dy * yy_dy);
      if (yy_dist < 110 && yy_dist > 0) {
        yy_point.x += (yy_dx / yy_dist) * 0.6;
        yy_point.y += (yy_dy / yy_dist) * 0.6;
      }
    });
  }

  function yy_drawLines() {
    for (let yy_i = 0; yy_i < yy_points.length; yy_i++) {
      for (let yy_j = yy_i + 1; yy_j < yy_points.length; yy_j++) {
        const yy_a = yy_points[yy_i];
        const yy_b = yy_points[yy_j];
        const yy_dx = yy_a.x - yy_b.x;
        const yy_dy = yy_a.y - yy_b.y;
        const yy_dist = Math.sqrt(yy_dx * yy_dx + yy_dy * yy_dy);
        if (yy_dist < yy_config.linkDistance) {
          yy_ctx.strokeStyle = yy_config.lineColor;
          yy_ctx.lineWidth = 1;
          yy_ctx.beginPath();
          yy_ctx.moveTo(yy_a.x, yy_a.y);
          yy_ctx.lineTo(yy_b.x, yy_b.y);
          yy_ctx.stroke();
        }
      }
    }
  }

  function yy_drawPoints() {
    yy_ctx.fillStyle = yy_config.pointColor;
    yy_points.forEach(function (yy_point) {
      yy_ctx.beginPath();
      yy_ctx.arc(yy_point.x, yy_point.y, yy_config.pointRadius, 0, Math.PI * 2);
      yy_ctx.fill();
    });
  }

  function yy_animate() {
    yy_ctx.clearRect(0, 0, yy_width, yy_height);
    yy_movePoints();
    yy_drawLines();
    yy_drawPoints();
    yy_animationId = requestAnimationFrame(yy_animate);
  }

  function yy_init() {
    yy_resize();
    yy_createPoints();
    yy_animate();
  }

  window.addEventListener('resize', function () {
    yy_resize();
    yy_createPoints();
  });

  window.addEventListener('mousemove', function (yy_event) {
    yy_pointer.x = yy_event.clientX;
    yy_pointer.y = yy_event.clientY;
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (yy_animationId) cancelAnimationFrame(yy_animationId);
    } else {
      yy_animate();
    }
  });

  yy_init();
})();
