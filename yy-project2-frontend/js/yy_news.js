/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-20 | 大模型：Tencent Hunyuan Hy
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_api_url = yy_api_base + '/api/news/list';
  const yy_list_el = document.getElementById('yy_news_list');
  const yy_loading_el = document.getElementById('yy_loading');
  const yy_count_el = document.getElementById('yy_api_count');
  const yy_error_el = document.getElementById('yy_error_tip');
  const yy_link_el = document.getElementById('yy_api_link');

  if (!yy_list_el) return;

  if (yy_link_el) {
    yy_link_el.textContent = yy_api_url;
    yy_link_el.href = yy_api_url;
  }

  function yy_format_time(yy_time) {
    if (!yy_time) return '';
    return String(yy_time).replace('T', ' ').slice(0, 19);
  }

  function yy_render_list(yy_items) {
    yy_list_el.innerHTML = '';
    yy_items.forEach(function (yy_item) {
      const yy_card = document.createElement('article');
      yy_card.className = 'yy_news_item';

      const yy_top = document.createElement('div');
      yy_top.className = 'yy_news_top';
      const yy_category = document.createElement('span');
      yy_category.className = 'yy_news_category';
      yy_category.textContent = yy_item.yy_category;
      const yy_id = document.createElement('span');
      yy_id.className = 'yy_news_id';
      yy_id.textContent = '#' + yy_item.yy_id;
      yy_top.appendChild(yy_category);
      yy_top.appendChild(yy_id);

      const yy_title = document.createElement('h3');
      yy_title.className = 'yy_news_title';
      yy_title.textContent = yy_item.yy_title;

      const yy_summary = document.createElement('p');
      yy_summary.className = 'yy_news_summary';
      yy_summary.textContent = yy_item.yy_summary || '';

      const yy_meta = document.createElement('div');
      yy_meta.className = 'yy_news_meta';
      const yy_source = document.createElement('span');
      yy_source.className = 'yy_news_source';
      yy_source.textContent = '来源：' + yy_item.yy_source;
      const yy_time = document.createElement('span');
      yy_time.textContent = yy_format_time(yy_item.yy_publish_time);
      const yy_views = document.createElement('span');
      yy_views.textContent = '浏览 ' + yy_item.yy_views;
      yy_meta.appendChild(yy_source);
      yy_meta.appendChild(yy_time);
      yy_meta.appendChild(yy_views);

      yy_card.appendChild(yy_top);
      yy_card.appendChild(yy_title);
      yy_card.appendChild(yy_summary);
      yy_card.appendChild(yy_meta);
      yy_list_el.appendChild(yy_card);
    });
  }

  async function yy_load_news() {
    if (yy_loading_el) yy_loading_el.style.display = 'block';
    if (yy_error_el) yy_error_el.classList.remove('yy_is_visible');

    try {
      const yy_response = await fetch(yy_api_url);
      const yy_result = await yy_response.json();
      console.log('服务器返回数据：', yy_result);

      if (yy_result.code === 0) {
        yy_render_list(yy_result.data.list);
        if (yy_count_el) yy_count_el.textContent = '共 ' + yy_result.data.total + ' 条新闻';
      } else {
        console.error('获取新闻失败：', yy_result.msg);
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

  yy_load_news();
})();
