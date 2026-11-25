/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-25 | 大模型：DeepSeek-V4.1-Flash
 * 智能问答页面逻辑 · 调用后端 /api/ai/chat（硅基流动大模型）
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_api_url = yy_api_base + '/api/ai/chat';

  const yy_messages_el = document.getElementById('yy_ai_messages');
  const yy_input_el = document.getElementById('yy_ai_input');
  const yy_send_el = document.getElementById('yy_ai_send');
  const yy_clear_el = document.getElementById('yy_ai_clear');
  const yy_suggest_el = document.getElementById('yy_ai_suggest');
  const yy_tip_el = document.getElementById('yy_ai_tip');
  const yy_link_el = document.getElementById('yy_api_link');
  const yy_provider_el = document.getElementById('yy_ai_provider');
  const yy_status_el = document.getElementById('yy_ai_status_text');
  const yy_model_tag_el = document.getElementById('yy_ai_model_tag');

  if (!yy_messages_el || !yy_input_el || !yy_send_el) return;

  if (yy_link_el) {
    yy_link_el.textContent = yy_api_url;
    yy_link_el.href = yy_api_url;
  }

  const yy_welcome_text =
    '你好呀，我是中华美食街的在线客服「小味」~ 营业时间、招牌菜、配送范围都可以问我；其他问题可以在对话框留言，我会转交人工客服。';
  let yy_history = [];
  let yy_busy = false;

  const yy_provider_meta = {
    siliconflow: { label: '硅基流动', model: 'deepseek-ai/DeepSeek-V4-Flash' },
    qiniu: { label: '七牛云', model: 'qiniu/conatus-free' }
  };

  function yy_current_provider() {
    return yy_provider_el ? yy_provider_el.value : 'siliconflow';
  }

  function yy_provider_info() {
    return yy_provider_meta[yy_current_provider()] || yy_provider_meta.siliconflow;
  }

  function yy_sync_provider_ui() {
    const yy_meta = yy_provider_info();
    if (yy_status_el) yy_status_el.textContent = yy_meta.label + '大模型 · 在线';
    if (yy_model_tag_el) yy_model_tag_el.textContent = '模型 ' + yy_meta.model;
  }

  function yy_scroll_bottom() {
    yy_messages_el.scrollTop = yy_messages_el.scrollHeight;
  }

  function yy_append_bubble(yy_role, yy_text, yy_is_error) {
    const yy_row = document.createElement('div');
    yy_row.className = 'yy_ai_row ' + (yy_role === 'user' ? 'yy_ai_row_user' : 'yy_ai_row_bot');

    const yy_bubble = document.createElement('div');
    yy_bubble.className = 'yy_ai_bubble ' + (yy_role === 'user' ? 'yy_ai_bubble_user' : 'yy_ai_bubble_bot');
    if (yy_is_error) yy_bubble.classList.add('yy_ai_bubble_error');
    yy_bubble.textContent = yy_text;

    yy_row.appendChild(yy_bubble);
    yy_messages_el.appendChild(yy_row);
    yy_scroll_bottom();
    return yy_row;
  }

  function yy_show_typing() {
    const yy_row = document.createElement('div');
    yy_row.className = 'yy_ai_row yy_ai_row_bot';
    yy_row.id = 'yy_ai_typing';

    const yy_bubble = document.createElement('div');
    yy_bubble.className = 'yy_ai_bubble yy_ai_bubble_bot yy_ai_typing';
    yy_bubble.innerHTML = '<span></span><span></span><span></span>';

    yy_row.appendChild(yy_bubble);
    yy_messages_el.appendChild(yy_row);
    yy_scroll_bottom();
  }

  function yy_hide_typing() {
    const yy_typing = document.getElementById('yy_ai_typing');
    if (yy_typing) yy_typing.remove();
  }

  function yy_set_busy(yy_value) {
    yy_busy = yy_value;
    yy_send_el.disabled = yy_value;
    yy_send_el.textContent = yy_value ? '回复中' : '发送';
    yy_input_el.disabled = yy_value;
  }

  function yy_set_tip(yy_text, yy_is_error) {
    if (!yy_tip_el) return;
    yy_tip_el.textContent = yy_text;
    yy_tip_el.classList.toggle('yy_ai_tip_error', !!yy_is_error);
  }

  function yy_reset_tip() {
    yy_set_tip('仅回答营业时间、招牌菜、配送范围三类问题，当前服务商：' + yy_provider_info().label, false);
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
      const yy_response = await fetch(yy_api_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: yy_history, provider: yy_current_provider() })
      });
      const yy_result = await yy_response.json();
      console.log('AI 接口返回数据：', yy_result);

      yy_hide_typing();

      if (yy_result.code === 0 && yy_result.data && yy_result.data.reply) {
        yy_history.push({ role: 'assistant', content: yy_result.data.reply });
        yy_append_bubble('assistant', yy_result.data.reply);
        if (yy_result.data.model) {
          yy_set_tip('当前模型：' + yy_result.data.model, false);
          if (yy_model_tag_el) yy_model_tag_el.textContent = '模型 ' + yy_result.data.model;
        }
      } else {
        console.error('AI 回复失败：', yy_result.msg);
        yy_history.pop();
        yy_append_bubble('assistant', '抱歉，回复失败了：' + (yy_result.msg || '未知错误'), true);
        yy_set_tip('接口调用失败：' + (yy_result.msg || '未知错误'), true);
      }
    } catch (yy_error) {
      console.error('请求异常：', yy_error);
      yy_hide_typing();
      yy_history.pop();
      yy_append_bubble('assistant', '请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）', true);
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
      yy_reset_tip();
    });
  }

  yy_sync_provider_ui();

  if (yy_suggest_el) {
    yy_suggest_el.addEventListener('click', function (yy_event) {
      const yy_target = yy_event.target.closest('.yy_ai_suggest_item');
      if (!yy_target || yy_busy) return;
      yy_input_el.value = yy_target.textContent.trim();
      yy_auto_resize();
      yy_send();
    });
  }
})();
