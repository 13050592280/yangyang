/**
 * 姓名：【杨阳】 | 学号：【24002120323】 | 时间：2026-11-20 | 大模型：Tencent Hunyuan Hy
 */
(function () {
  const yy_api_base = window.location.protocol === 'file:' ? 'http://localhost:8323' : '';
  const yy_form = document.getElementById('yy_db_form');
  const yy_username = document.getElementById('yy_db_username');
  const yy_password = document.getElementById('yy_db_password');
  const yy_submit = document.getElementById('yy_db_submit');
  const yy_result = document.getElementById('yy_db_result');

  if (!yy_form || !yy_result) return;

  function yy_show_result(yy_message, yy_is_success) {
    yy_result.textContent = yy_message;
    yy_result.className = 'yy_result yy_is_visible ' + (yy_is_success ? 'yy_is_success' : 'yy_is_error');
  }

  yy_form.addEventListener('submit', async function (yy_event) {
    yy_event.preventDefault();

    const yy_credentials = {
      username: yy_username.value.trim(),
      password: yy_password.value
    };

    if (!yy_credentials.username || !yy_credentials.password) {
      yy_show_result('请填写用户名和密码', false);
      return;
    }

    yy_submit.disabled = true;
    yy_show_result('正在连接数据库...', true);

    try {
      const yy_response = await fetch(yy_api_base + '/api/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(yy_credentials)
      });
      const yy_data = await yy_response.json();
      console.log('服务器返回数据：', yy_data);

      if (yy_data.code === 0) {
        yy_show_result('连接成功：' + yy_data.msg + '（主机：' + yy_data.data.host + '）', true);
      } else {
        console.error('数据库连接错误：', yy_data.msg);
        yy_show_result('连接失败：' + yy_data.msg, false);
      }
    } catch (yy_error) {
      console.error('请求异常：', yy_error);
      yy_show_result('请求异常：请先双击运行根目录 start_backend.bat 启动后端服务（端口 8323）', false);
    } finally {
      yy_submit.disabled = false;
    }
  });
})();
