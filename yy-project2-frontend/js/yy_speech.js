/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 语音识别页面逻辑：上传音频并调用 /api/speech/recognize
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_api_url = yy_api_base + '/api/speech/recognize';

  const yy_drop_el = document.getElementById('yy_speech_drop');
  const yy_drop_inner = document.getElementById('yy_speech_drop_inner');
  const yy_input_el = document.getElementById('yy_speech_input');
  const yy_player_el = document.getElementById('yy_speech_player');
  const yy_filename_el = document.getElementById('yy_speech_filename');
  const yy_btn_el = document.getElementById('yy_speech_btn');
  const yy_tip_el = document.getElementById('yy_speech_tip');
  const yy_result_el = document.getElementById('yy_speech_result');
  const yy_badge_el = document.getElementById('yy_speech_badge');
  const yy_meta_el = document.getElementById('yy_speech_meta');
  const yy_copy_el = document.getElementById('yy_speech_copy');
  const yy_link_el = document.getElementById('yy_speech_api_link');

  if (!yy_drop_el || !yy_input_el || !yy_btn_el || !yy_result_el) return;

  if (yy_link_el) {
    yy_link_el.textContent = yy_api_url;
    yy_link_el.href = yy_api_url;
  }

  const yy_allowed_ext = /\.(wav|mp3|m4a|aac|ogg|webm|amr)$/i;
  let yy_current_file = null;
  let yy_audio_url = '';
  let yy_busy = false;
  let yy_result_text = '';

  function yy_set_badge(yy_text, yy_state) {
    if (!yy_badge_el) return;
    yy_badge_el.textContent = yy_text;
    yy_badge_el.classList.toggle('yy_is_loading', yy_state === 'loading');
    yy_badge_el.classList.toggle('yy_is_error', yy_state === 'error');
  }

  function yy_set_tip(yy_text, yy_is_error) {
    if (!yy_tip_el) return;
    yy_tip_el.textContent = yy_text;
    yy_tip_el.classList.toggle('yy_speech_tip_error', !!yy_is_error);
  }

  function yy_reset_tip() {
    yy_set_tip('音频仅用于本次识别请求，不会保存到服务器', false);
  }

  function yy_select_file(yy_file) {
    if (!yy_file) return;

    if (!yy_allowed_ext.test(yy_file.name)) {
      yy_set_tip('不支持的音频格式，请选择 wav / mp3 / m4a / aac / ogg / webm / amr', true);
      return;
    }

    if (yy_file.size > 20 * 1024 * 1024) {
      yy_set_tip('音频超过 20MB，请压缩或截取后再上传', true);
      return;
    }

    yy_current_file = yy_file;

    if (yy_audio_url) URL.revokeObjectURL(yy_audio_url);
    yy_audio_url = URL.createObjectURL(yy_file);
    yy_player_el.src = yy_audio_url;
    yy_player_el.classList.add('yy_is_visible');
    if (yy_drop_inner) yy_drop_inner.style.display = 'none';
    yy_drop_el.classList.add('yy_has_audio');

    yy_filename_el.textContent = yy_file.name + ' · ' + (yy_file.size / 1024).toFixed(1) + ' KB';
    yy_btn_el.disabled = false;
    yy_reset_tip();
    yy_set_badge('待识别', '');
  }

  async function yy_recognize() {
    if (!yy_current_file || yy_busy) return;

    yy_busy = true;
    yy_btn_el.disabled = true;
    yy_btn_el.textContent = '识别中...';
    yy_set_badge('识别中', 'loading');
    yy_set_tip('正在上传音频并请求语音识别模型...', false);
    yy_result_el.innerHTML = '<p class="yy_speech_result_placeholder">正在识别，请稍候...</p>';
    if (yy_meta_el) yy_meta_el.textContent = '';
    if (yy_copy_el) yy_copy_el.disabled = true;

    const yy_form = new FormData();
    yy_form.append('audio', yy_current_file);

    try {
      const yy_response = await fetch(yy_api_url, { method: 'POST', body: yy_form });
      const yy_result = await yy_response.json();
      console.log('语音识别接口返回：', yy_result);

      if (yy_result.code === 0 && yy_result.data && yy_result.data.text) {
        yy_result_text = yy_result.data.text;
        yy_result_el.innerHTML = '';
        const yy_text_el = document.createElement('div');
        yy_text_el.className = 'yy_speech_text';
        yy_text_el.textContent = yy_result_text;
        yy_result_el.appendChild(yy_text_el);

        if (yy_meta_el) {
          const yy_duration = yy_result.data.duration ? ' · 音频时长 ' + yy_result.data.duration + ' 秒' : '';
          yy_meta_el.textContent = '模型：' + yy_result.data.model + yy_duration;
        }
        if (yy_copy_el) yy_copy_el.disabled = false;
        yy_set_badge('识别成功', '');
        yy_set_tip('识别完成，可复制文字或更换音频再次识别', false);
      } else {
        console.error('语音识别失败：', yy_result.msg);
        yy_result_el.innerHTML = '';
        const yy_error_el = document.createElement('p');
        yy_error_el.className = 'yy_speech_result_placeholder';
        yy_error_el.textContent = '识别失败：' + (yy_result.msg || '未知错误');
        yy_result_el.appendChild(yy_error_el);
        yy_set_badge('识别失败', 'error');
        yy_set_tip(yy_result.msg || '识别失败，请稍后重试', true);
      }
    } catch (yy_error) {
      console.error('语音识别请求异常：', yy_error);
      yy_result_el.innerHTML = '';
      const yy_error_el = document.createElement('p');
      yy_error_el.className = 'yy_speech_result_placeholder';
      yy_error_el.textContent = '请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）';
      yy_result_el.appendChild(yy_error_el);
      yy_set_badge('请求异常', 'error');
      yy_set_tip('请求异常，请检查后端服务是否已启动', true);
    } finally {
      yy_busy = false;
      yy_btn_el.disabled = false;
      yy_btn_el.textContent = '开始识别';
    }
  }

  function yy_copy_text() {
    if (!yy_result_text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(yy_result_text).then(function () {
        yy_set_tip('识别文字已复制到剪贴板', false);
      }).catch(function () {
        yy_set_tip('复制失败，请手动选择文字复制', true);
      });
    } else {
      yy_set_tip('当前浏览器不支持自动复制，请手动选择文字复制', true);
    }
  }

  yy_drop_el.addEventListener('click', function (yy_event) {
    if (yy_event.target === yy_input_el || yy_event.target === yy_player_el) return;
    yy_input_el.click();
  });

  yy_input_el.addEventListener('change', function () {
    if (yy_input_el.files && yy_input_el.files.length) {
      yy_select_file(yy_input_el.files[0]);
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

  yy_btn_el.addEventListener('click', yy_recognize);
  if (yy_copy_el) yy_copy_el.addEventListener('click', yy_copy_text);
})();
