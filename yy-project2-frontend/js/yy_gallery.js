/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-20 | 大模型：Tencent Hunyuan Hy
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_api_url = yy_api_base + '/api/gallery';
  const yy_grid_el = document.getElementById('yy_gallery_grid');
  const yy_loading_el = document.getElementById('yy_loading');
  const yy_count_el = document.getElementById('yy_api_count');
  const yy_error_el = document.getElementById('yy_error_tip');
  const yy_link_el = document.getElementById('yy_api_link');

  if (!yy_grid_el) return;

  if (yy_link_el) {
    yy_link_el.textContent = yy_api_url;
    yy_link_el.href = yy_api_url;
  }

  function yy_placeholder(yy_title) {
    const yy_safe = String(yy_title || '图文').replace(/[<>&"']/g, '');
    const yy_svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#1b3a4a"/><stop offset="100%" stop-color="#2a2a5e"/>' +
      '</linearGradient></defs>' +
      '<rect width="600" height="400" fill="url(#g)"/>' +
      '<text x="300" y="205" fill="#8fe6d2" font-size="30" font-family="sans-serif" text-anchor="middle">暂无图片</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(yy_svg);
  }

  function yy_on_img_error(yy_img, yy_title) {
    yy_img.onerror = null;
    yy_img.src = yy_placeholder(yy_title);
  }

  function yy_format_time(yy_time) {
    if (!yy_time) return '';
    return String(yy_time).replace('T', ' ').slice(0, 19);
  }

  function yy_render_list(yy_items) {
    yy_grid_el.innerHTML = '';
    yy_items.forEach(function (yy_item) {
      const yy_card = document.createElement('article');
      yy_card.className = 'yy_gallery_item';

      const yy_img_wrap = document.createElement('div');
      yy_img_wrap.className = 'yy_gallery_img_wrap';
      const yy_img = document.createElement('img');
      yy_img.className = 'yy_gallery_img';
      yy_img.alt = yy_item.yy_title;
      yy_img.loading = 'lazy';
      yy_img.onerror = function () {
        yy_on_img_error(yy_img, yy_item.yy_title);
      };
      yy_img.src = yy_item.yy_img_url || yy_placeholder(yy_item.yy_title);
      yy_img_wrap.appendChild(yy_img);

      const yy_body = document.createElement('div');
      yy_body.className = 'yy_gallery_body';

      const yy_category = document.createElement('span');
      yy_category.className = 'yy_gallery_category';
      yy_category.textContent = yy_item.yy_category;

      const yy_title = document.createElement('h3');
      yy_title.className = 'yy_gallery_title';
      yy_title.textContent = yy_item.yy_title;

      const yy_desc = document.createElement('p');
      yy_desc.className = 'yy_gallery_desc';
      yy_desc.textContent = yy_item.yy_description || '';

      const yy_time = document.createElement('div');
      yy_time.className = 'yy_gallery_time';
      yy_time.textContent = yy_format_time(yy_item.yy_create_time);

      yy_body.appendChild(yy_category);
      yy_body.appendChild(yy_title);
      yy_body.appendChild(yy_desc);
      yy_body.appendChild(yy_time);

      yy_card.appendChild(yy_img_wrap);
      yy_card.appendChild(yy_body);
      yy_grid_el.appendChild(yy_card);
    });
  }

  async function yy_load_gallery() {
    if (yy_loading_el) yy_loading_el.style.display = 'block';
    if (yy_error_el) yy_error_el.classList.remove('yy_is_visible');

    try {
      const yy_response = await fetch(yy_api_url);
      const yy_result = await yy_response.json();
      console.log('服务器返回数据：', yy_result);

      if (yy_result.code === 0) {
        yy_render_list(yy_result.data.list);
        if (yy_count_el) yy_count_el.textContent = '共 ' + yy_result.data.total + ' 条图文';
      } else {
        console.error('获取图文失败：', yy_result.msg);
        if (yy_error_el) {
          yy_error_el.textContent = '加载失败：' + yy_result.msg;
          yy_error_el.classList.add('yy_is_visible');
        }
        if (yy_count_el) yy_count_el.textContent = '加载失败';
      }
    } catch (yy_error) {
      console.error('请求异常：', yy_error);
      if (yy_error_el) {
        yy_error_el.textContent = '请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）';
        yy_error_el.classList.add('yy_is_visible');
      }
      if (yy_count_el) yy_count_el.textContent = '加载失败';
    } finally {
      if (yy_loading_el) yy_loading_el.style.display = 'none';
    }
  }

  yy_load_gallery();
})();
