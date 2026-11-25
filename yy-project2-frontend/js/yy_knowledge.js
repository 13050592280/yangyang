/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 知识库管理 + 基于知识库问答页面逻辑
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_list_url = yy_api_base + '/api/knowledge/list';
  const yy_upload_url = yy_api_base + '/api/knowledge/upload';
  const yy_chat_url = yy_api_base + '/api/knowledge/chat';

  const yy_file_el = document.getElementById('yy_knowledge_file');
  const yy_upload_btn = document.getElementById('yy_knowledge_upload_btn');
  const yy_upload_tip = document.getElementById('yy_knowledge_upload_tip');
  const yy_count_el = document.getElementById('yy_knowledge_count');
  const yy_list_el = document.getElementById('yy_knowledge_list');

  const yy_messages_el = document.getElementById('yy_knowledge_messages');
  const yy_input_el = document.getElementById('yy_knowledge_input');
  const yy_send_el = document.getElementById('yy_knowledge_send');
  const yy_clear_el = document.getElementById('yy_knowledge_clear');
  const yy_provider_el = document.getElementById('yy_knowledge_provider');
  const yy_status_el = document.getElementById('yy_knowledge_status_text');
  const yy_tip_el = document.getElementById('yy_knowledge_tip');
  const yy_suggest_el = document.getElementById('yy_knowledge_suggest');
  const yy_api_link_el = document.getElementById('yy_knowledge_api_link');

  if (!yy_messages_el || !yy_input_el || !yy_send_el) return;

  if (yy_api_link_el) {
    yy_api_link_el.textContent = yy_list_url;
    yy_api_link_el.href = yy_list_url;
  }

  const yy_welcome_text =
    '你好，我是知识库智能客服。请先在左侧上传知识库文件，我会基于文件内容回答问题；资料中没有的内容我会如实说明。';

  const yy_provider_meta = {
    siliconflow: { label: '硅基流动', model: 'deepseek-ai/DeepSeek-V4-Flash' },
    qiniu: { label: '七牛云', model: 'qiniu/conatus-free' }
  };

  let yy_history = [];
  let yy_busy = false;

  function yy_current_provider() {
    return yy_provider_el ? yy_provider_el.value : 'siliconflow';
  }

  function yy_provider_info() {
    return yy_provider_meta[yy_current_provider()] || yy_provider_meta.siliconflow;
  }

  function yy_sync_provider_ui() {
    if (yy_status_el) yy_status_el.textContent = yy_provider_info().label + '大模型 · 在线';
    yy_reset_tip();
  }

  function yy_reset_tip() {
    if (!yy_tip_el) return;
    yy_tip_el.textContent = '回答仅依据已上传的知识库内容，当前服务商：' + yy_provider_info().label;
    yy_tip_el.classList.remove('yy_ai_tip_error');
  }

  function yy_set_tip(yy_text, yy_is_error) {
    if (!yy_tip_el) return;
    yy_tip_el.textContent = yy_text;
    yy_tip_el.classList.toggle('yy_ai_tip_error', !!yy_is_error);
  }

  function yy_set_upload_tip(yy_text, yy_is_error) {
    if (!yy_upload_tip) return;
    yy_upload_tip.textContent = yy_text;
    yy_upload_tip.classList.toggle('yy_knowledge_upload_tip_error', !!yy_is_error);
  }

  function yy_format_size(yy_bytes) {
    if (!yy_bytes) return '0 B';
    if (yy_bytes < 1024) return yy_bytes + ' B';
    if (yy_bytes < 1024 * 1024) return (yy_bytes / 1024).toFixed(1) + ' KB';
    return (yy_bytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  function yy_format_time(yy_time) {
    if (!yy_time) return '';
    return String(yy_time).replace('T', ' ').slice(0, 19);
  }

  /* ---------- 知识库列表 ---------- */
  function yy_render_list(yy_items) {
    if (!yy_list_el) return;
    yy_list_el.innerHTML = '';

    if (!yy_items || !yy_items.length) {
      const yy_empty = document.createElement('p');
      yy_empty.className = 'yy_knowledge_empty';
      yy_empty.textContent = '暂无知识库文件，请先上传';
      yy_list_el.appendChild(yy_empty);
      if (yy_count_el) yy_count_el.textContent = '共 0 个文件';
      return;
    }

    if (yy_count_el) yy_count_el.textContent = '共 ' + yy_items.length + ' 个文件';

    yy_items.forEach(function (yy_item) {
      const yy_row = document.createElement('div');
      yy_row.className = 'yy_knowledge_item';

      const yy_body = document.createElement('div');
      yy_body.className = 'yy_knowledge_item_body';

      const yy_name = document.createElement('div');
      yy_name.className = 'yy_knowledge_item_name';
      yy_name.textContent = yy_item.yy_name;

      const yy_meta = document.createElement('div');
      yy_meta.className = 'yy_knowledge_item_meta';
      yy_meta.textContent =
        String(yy_item.yy_ext || '').replace('.', '').toUpperCase() +
        ' · ' +
        yy_format_size(yy_item.yy_size) +
        ' · ' +
        yy_item.yy_chunk_count +
        ' 个分片 · ' +
        yy_format_time(yy_item.yy_create_time);

      yy_body.appendChild(yy_name);
      yy_body.appendChild(yy_meta);

      const yy_del = document.createElement('button');
      yy_del.className = 'yy_knowledge_del';
      yy_del.type = 'button';
      yy_del.dataset.id = yy_item.yy_id;
      yy_del.textContent = '删除';

      yy_row.appendChild(yy_body);
      yy_row.appendChild(yy_del);
      yy_list_el.appendChild(yy_row);
    });
  }

  async function yy_load_list() {
    try {
      const yy_response = await fetch(yy_list_url);
      const yy_result = await yy_response.json();
      console.log('知识库列表接口返回：', yy_result);

      if (yy_result.code === 0) {
        yy_render_list(yy_result.data.list);
      } else {
        if (yy_count_el) yy_count_el.textContent = '加载失败';
        if (yy_list_el) {
          yy_list_el.innerHTML = '<p class="yy_knowledge_empty">加载失败：' + yy_result.msg + '</p>';
        }
      }
    } catch (yy_error) {
      console.error('获取知识库列表异常：', yy_error);
      if (yy_count_el) yy_count_el.textContent = '加载失败';
      if (yy_list_el) {
        yy_list_el.innerHTML =
          '<p class="yy_knowledge_empty">请求异常：请先双击运行根目录 start_backend.bat 启动后端服务</p>';
      }
    }
  }

  /* ---------- 上传 ---------- */
  async function yy_upload_file() {
    if (!yy_file_el || !yy_file_el.files || !yy_file_el.files.length) {
      yy_set_upload_tip('请先选择一个文件', true);
      return;
    }

    const yy_file = yy_file_el.files[0];
    if (yy_file.size > 20 * 1024 * 1024) {
      yy_set_upload_tip('文件超过 20MB，请压缩或拆分后再上传', true);
      return;
    }

    const yy_form = new FormData();
    yy_form.append('file', yy_file);

    yy_upload_btn.disabled = true;
    yy_upload_btn.textContent = '解析中';
    yy_set_upload_tip('正在上传并解析《' + yy_file.name + '》...', false);

    try {
      const yy_response = await fetch(yy_upload_url, { method: 'POST', body: yy_form });
      const yy_result = await yy_response.json();
      console.log('知识库上传接口返回：', yy_result);

      if (yy_result.code === 0) {
        yy_set_upload_tip(
          '《' + yy_result.data.name + '》解析成功：' + yy_result.data.chunk_count + ' 个分片',
          false
        );
        yy_file_el.value = '';
        await yy_load_list();
      } else {
        yy_set_upload_tip('上传失败：' + yy_result.msg, true);
      }
    } catch (yy_error) {
      console.error('上传知识库文件异常：', yy_error);
      yy_set_upload_tip('上传异常：请检查后端服务是否已启动（端口 8323）', true);
    } finally {
      yy_upload_btn.disabled = false;
      yy_upload_btn.textContent = '上传并解析';
    }
  }

  /* ---------- 删除 ---------- */
  async function yy_delete_file(yy_id) {
    if (!window.confirm('确定要删除这个知识库文件及其分片吗？')) return;

    try {
      const yy_response = await fetch(yy_list_url.replace('/list', '/' + encodeURIComponent(yy_id)), {
        method: 'DELETE'
      });
      const yy_result = await yy_response.json();
      console.log('删除知识库接口返回：', yy_result);

      if (yy_result.code === 0) {
        await yy_load_list();
      } else {
        window.alert('删除失败：' + yy_result.msg);
      }
    } catch (yy_error) {
      console.error('删除知识库文件异常：', yy_error);
      window.alert('删除异常，请检查后端服务是否已启动');
    }
  }

  /* ---------- 问答 ---------- */
  function yy_scroll_bottom() {
    yy_messages_el.scrollTop = yy_messages_el.scrollHeight;
  }

  function yy_append_bubble(yy_role, yy_text, yy_refs, yy_is_error) {
    const yy_row = document.createElement('div');
    yy_row.className = 'yy_ai_row ' + (yy_role === 'user' ? 'yy_ai_row_user' : 'yy_ai_row_bot');

    const yy_bubble = document.createElement('div');
    yy_bubble.className = 'yy_ai_bubble ' + (yy_role === 'user' ? 'yy_ai_bubble_user' : 'yy_ai_bubble_bot');
    if (yy_is_error) yy_bubble.classList.add('yy_ai_bubble_error');
    yy_bubble.textContent = yy_text;

    if (yy_refs && yy_refs.length) {
      const yy_refs_wrap = document.createElement('div');
      yy_refs_wrap.className = 'yy_knowledge_refs';
      yy_refs.forEach(function (yy_ref) {
        const yy_chip = document.createElement('span');
        yy_chip.className = 'yy_knowledge_ref';
        yy_chip.textContent = '《' + yy_ref.name + '》· 第 ' + (yy_ref.chunk_index + 1) + ' 段';
        yy_refs_wrap.appendChild(yy_chip);
      });
      yy_bubble.appendChild(yy_refs_wrap);
    }

    yy_row.appendChild(yy_bubble);
    yy_messages_el.appendChild(yy_row);
    yy_scroll_bottom();
  }

  function yy_show_typing() {
    const yy_row = document.createElement('div');
    yy_row.className = 'yy_ai_row yy_ai_row_bot';
    yy_row.id = 'yy_knowledge_typing';

    const yy_bubble = document.createElement('div');
    yy_bubble.className = 'yy_ai_bubble yy_ai_bubble_bot yy_ai_typing';
    yy_bubble.innerHTML = '<span></span><span></span><span></span>';

    yy_row.appendChild(yy_bubble);
    yy_messages_el.appendChild(yy_row);
    yy_scroll_bottom();
  }

  function yy_hide_typing() {
    const yy_typing = document.getElementById('yy_knowledge_typing');
    if (yy_typing) yy_typing.remove();
  }

  function yy_set_busy(yy_value) {
    yy_busy = yy_value;
    yy_send_el.disabled = yy_value;
    yy_send_el.textContent = yy_value ? '检索中' : '发送';
    yy_input_el.disabled = yy_value;
  }

  function yy_auto_resize() {
    yy_input_el.style.height = 'auto';
    yy_input_el.style.height = Math.min(yy_input_el.scrollHeight, 140) + 'px';
  }

  async function yy_send() {
    const yy_text = yy_input_el.value.trim();
    if (!yy_text || yy_busy) return;

    yy_input_el.value = '';
    yy_auto_resize();
    yy_append_bubble('user', yy_text);
    yy_history.push({ role: 'user', content: yy_text });

    yy_set_busy(true);
    yy_reset_tip();
    yy_show_typing();

    try {
      const yy_response = await fetch(yy_chat_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: yy_history, provider: yy_current_provider() })
      });
      const yy_result = await yy_response.json();
      console.log('知识库问答接口返回：', yy_result);

      yy_hide_typing();

      if (yy_result.code === 0 && yy_result.data && yy_result.data.reply) {
        yy_history.push({ role: 'assistant', content: yy_result.data.reply });
        yy_append_bubble('assistant', yy_result.data.reply, yy_result.data.references);
        if (yy_result.data.model) {
          yy_set_tip('当前模型：' + yy_result.data.model + ' · 引用 ' + (yy_result.data.references || []).length + ' 段知识库内容', false);
        }
      } else {
        console.error('知识库问答失败：', yy_result.msg);
        yy_history.pop();
        yy_append_bubble('assistant', '抱歉，暂时无法回答：' + (yy_result.msg || '未知错误'), null, true);
        yy_set_tip('问答失败：' + (yy_result.msg || '未知错误'), true);
      }
    } catch (yy_error) {
      console.error('知识库问答请求异常：', yy_error);
      yy_hide_typing();
      yy_history.pop();
      yy_append_bubble('assistant', '请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）', null, true);
      yy_set_tip('请求异常，请检查后端服务是否已启动', true);
    } finally {
      yy_set_busy(false);
      yy_input_el.focus();
    }
  }

  function yy_clear_chat() {
    if (yy_busy) return;
    yy_history = [];
    yy_messages_el.innerHTML = '';
    yy_append_bubble('assistant', yy_welcome_text);
    yy_reset_tip();
    yy_input_el.focus();
  }

  /* ---------- 事件绑定 ---------- */
  if (yy_upload_btn) yy_upload_btn.addEventListener('click', yy_upload_file);

  if (yy_list_el) {
    yy_list_el.addEventListener('click', function (yy_event) {
      const yy_target = yy_event.target.closest('.yy_knowledge_del');
      if (!yy_target) return;
      yy_delete_file(yy_target.dataset.id);
    });
  }

  yy_send_el.addEventListener('click', yy_send);

  yy_input_el.addEventListener('keydown', function (yy_event) {
    if (yy_event.key === 'Enter' && !yy_event.shiftKey) {
      yy_event.preventDefault();
      yy_send();
    }
  });

  yy_input_el.addEventListener('input', yy_auto_resize);
  yy_clear_el.addEventListener('click', yy_clear_chat);

  if (yy_provider_el) {
    yy_provider_el.addEventListener('change', function () {
      yy_sync_provider_ui();
    });
  }

  if (yy_suggest_el) {
    yy_suggest_el.addEventListener('click', function (yy_event) {
      const yy_target = yy_event.target.closest('.yy_ai_suggest_item');
      if (!yy_target || yy_busy) return;
      yy_input_el.value = yy_target.textContent.trim();
      yy_auto_resize();
      yy_send();
    });
  }

  yy_sync_provider_ui();
  yy_load_list();
})();
