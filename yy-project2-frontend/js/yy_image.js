/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 图像识别页面逻辑：上传图片并调用 /api/image/describe
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_api_url = yy_api_base + '/api/image/describe';

  const yy_drop_el = document.getElementById('yy_image_drop');
  const yy_drop_inner = document.getElementById('yy_image_drop_inner');
  const yy_file_el = document.getElementById('yy_image_file');
  const yy_preview_el = document.getElementById('yy_image_preview');
  const yy_filename_el = document.getElementById('yy_image_filename');
  const yy_describe_el = document.getElementById('yy_image_describe');
  const yy_tip_el = document.getElementById('yy_image_tip');
  const yy_result_el = document.getElementById('yy_image_result');
  const yy_badge_el = document.getElementById('yy_image_badge');
  const yy_meta_el = document.getElementById('yy_image_meta');
  const yy_link_el = document.getElementById('yy_image_api_link');

  if (!yy_drop_el || !yy_file_el || !yy_describe_el || !yy_result_el) return;

  if (yy_link_el) {
    yy_link_el.textContent = yy_api_url;
    yy_link_el.href = yy_api_url;
  }

  const yy_allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  let yy_current_file = null;
  let yy_preview_url = '';
  let yy_busy = false;

  function yy_set_badge(yy_text, yy_state) {
    if (!yy_badge_el) return;
    yy_badge_el.textContent = yy_text;
    yy_badge_el.classList.toggle('yy_is_loading', yy_state === 'loading');
    yy_badge_el.classList.toggle('yy_is_error', yy_state === 'error');
  }

  function yy_set_tip(yy_text, yy_is_error) {
    if (!yy_tip_el) return;
    yy_tip_el.textContent = yy_text;
    yy_tip_el.classList.toggle('yy_image_tip_error', !!yy_is_error);
  }

  function yy_reset_tip() {
    yy_set_tip('图片仅用于本次识别请求，不会保存到服务器', false);
  }

  function yy_select_file(yy_file) {
    if (!yy_file) return;

    const yy_type_ok =
      yy_allowed_types.indexOf(yy_file.type) !== -1 || /\.(jpe?g|png|webp|gif)$/i.test(yy_file.name);
    if (!yy_type_ok) {
      yy_set_tip('不支持的图片格式，请选择 jpg / png / webp / gif', true);
      return;
    }

    if (yy_file.size > 10 * 1024 * 1024) {
      yy_set_tip('图片超过 10MB，请压缩后再上传', true);
      return;
    }

    yy_current_file = yy_file;

    if (yy_preview_url) URL.revokeObjectURL(yy_preview_url);
    yy_preview_url = URL.createObjectURL(yy_file);
    yy_preview_el.src = yy_preview_url;
    yy_preview_el.classList.add('yy_is_visible');
    if (yy_drop_inner) yy_drop_inner.style.display = 'none';

    yy_filename_el.textContent = yy_file.name + ' · ' + (yy_file.size / 1024).toFixed(1) + ' KB';
    yy_describe_el.disabled = false;
    yy_reset_tip();
    yy_set_badge('待识别', '');
  }

  async function yy_describe() {
    if (!yy_current_file || yy_busy) return;

    yy_busy = true;
    yy_describe_el.disabled = true;
    yy_describe_el.textContent = '识别中...';
    yy_set_badge('识别中', 'loading');
    yy_set_tip('正在上传图片并请求视觉模型...', false);
    yy_result_el.innerHTML = '<p class="yy_image_result_placeholder">正在识别，请稍候...</p>';
    if (yy_meta_el) yy_meta_el.textContent = '';

    const yy_form = new FormData();
    yy_form.append('image', yy_current_file);

    try {
      const yy_response = await fetch(yy_api_url, { method: 'POST', body: yy_form });
      const yy_result = await yy_response.json();
      console.log('图像识别接口返回：', yy_result);

      if (yy_result.code === 0 && yy_result.data && yy_result.data.description) {
        yy_result_el.innerHTML = '';
        const yy_desc = document.createElement('div');
        yy_desc.className = 'yy_image_description';
        yy_desc.textContent = yy_result.data.description;
        yy_result_el.appendChild(yy_desc);

        if (yy_meta_el) {
          yy_meta_el.textContent = '模型：' + yy_result.data.model + ' · 服务商：' + yy_result.data.provider;
        }
        yy_set_badge('识别成功', '');
        yy_set_tip('识别完成，可重新选择图片再次识别', false);
      } else {
        console.error('图像识别失败：', yy_result.msg);
        yy_result_el.innerHTML = '';
        const yy_error = document.createElement('p');
        yy_error.className = 'yy_image_result_placeholder';
        yy_error.textContent = '识别失败：' + (yy_result.msg || '未知错误');
        yy_result_el.appendChild(yy_error);
        yy_set_badge('识别失败', 'error');
        yy_set_tip(yy_result.msg || '识别失败，请稍后重试', true);
      }
    } catch (yy_error) {
      console.error('图像识别请求异常：', yy_error);
      yy_result_el.innerHTML = '';
      const yy_error_el = document.createElement('p');
      yy_error_el.className = 'yy_image_result_placeholder';
      yy_error_el.textContent = '请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）';
      yy_result_el.appendChild(yy_error_el);
      yy_set_badge('请求异常', 'error');
      yy_set_tip('请求异常，请检查后端服务是否已启动', true);
    } finally {
      yy_busy = false;
      yy_describe_el.disabled = false;
      yy_describe_el.textContent = '开始识别';
    }
  }

  yy_drop_el.addEventListener('click', function (yy_event) {
    if (yy_event.target === yy_file_el) return;
    yy_file_el.click();
  });

  yy_file_el.addEventListener('change', function () {
    if (yy_file_el.files && yy_file_el.files.length) {
      yy_select_file(yy_file_el.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(function (yy_event_name) {
    yy_drop_el.addEventListener(yy_event_name, function (yy_event) {
      yy_event.preventDefault();
      yy_drop_el.classList.add('yy_is_dragover');
    });
  });

  ['dragleave', 'drop'].forEach(function (yy_event_name) {
    yy_drop_el.addEventListener(yy_event_name, function (yy_event) {
      yy_event.preventDefault();
      yy_drop_el.classList.remove('yy_is_dragover');
    });
  });

  yy_drop_el.addEventListener('drop', function (yy_event) {
    const yy_files = yy_event.dataTransfer && yy_event.dataTransfer.files;
    if (yy_files && yy_files.length) {
      yy_select_file(yy_files[0]);
    }
  });

  yy_describe_el.addEventListener('click', yy_describe);
})();
