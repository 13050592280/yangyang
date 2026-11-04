/**
 * 通用 Tab 选项卡组件（可复用）
 * 作者：杨阳
 * 建立时间：2026-11-04
 * 使用大模型：DeepSeek-V4.1-Flash
 * 功能名称：Tab 选项卡切换
 *
 * 用法：页面中被 .yy_tabs 包裹的一组件选项卡与面板会自动初始化，
 * 容器上的 data-yy_tabs="索引" 指定默认选中项，索引缺省为 0。
 */
(function () {
    'use strict';

    // 功能：清除指定容器内所有选项卡的选中状态，并隐藏全部内容面板
    function yy_clearTabState(yy_container) {
        var yy_tabs = yy_container.querySelectorAll('.yy_tabs__tab');
        var yy_panels = yy_container.querySelectorAll('.yy_tabs__panel');
        var yy_i;

        for (yy_i = 0; yy_i < yy_tabs.length; yy_i++) {
            yy_tabs[yy_i].classList.remove('yy_is-active');
            yy_tabs[yy_i].setAttribute('aria-selected', 'false');
            yy_tabs[yy_i].setAttribute('tabindex', '-1');
        }

        for (yy_i = 0; yy_i < yy_panels.length; yy_i++) {
            yy_panels[yy_i].classList.remove('yy_is-active');
            yy_panels[yy_i].setAttribute('hidden', 'hidden');
        }
    }

    // 功能：设置被点击选项卡为选中状态，并显示它 data-yy_tab 对应的内容面板
    function yy_setTabActive(yy_container, yy_tab) {
        var yy_key = yy_tab.getAttribute('data-yy_tab');
        var yy_panel = yy_container.querySelector('[data-yy_tab-panel="' + yy_key + '"]');

        yy_tab.classList.add('yy_is-active');
        yy_tab.setAttribute('aria-selected', 'true');
        yy_tab.setAttribute('tabindex', '0');

        if (yy_panel) {
            yy_panel.classList.add('yy_is-active');
            yy_panel.removeAttribute('hidden');
        }
    }

    // 功能：按容器配置的索引激活默认选项卡，索引非法时回退到第一项
    function yy_activeDefault(yy_container) {
        var yy_tabs = yy_container.querySelectorAll('.yy_tabs__tab');
        var yy_index = parseInt(yy_container.getAttribute('data-yy_tabs'), 10);

        if (!yy_tabs.length) {
            return;
        }
        if (isNaN(yy_index) || yy_index < 0 || yy_index >= yy_tabs.length) {
            yy_index = 0;
        }

        yy_clearTabState(yy_container);
        yy_setTabActive(yy_container, yy_tabs[yy_index]);
    }

    // 功能：从点击目标向上查找选项卡按钮，兼容不支持 closest 的环境
    function yy_findTab(yy_nav, yy_target) {
        while (yy_target && yy_target !== yy_nav) {
            if (yy_target.classList && yy_target.classList.contains('yy_tabs__tab')) {
                return yy_target;
            }
            yy_target = yy_target.parentNode;
        }
        return null;
    }

    // 功能：为单个 .yy_tabs 容器绑定点击监听，先清除全部选中状态再设置当前项
    function yy_bindTabs(yy_container) {
        var yy_nav = yy_container.querySelector('.yy_tabs__nav');

        if (!yy_nav || yy_nav.getAttribute('data-yy_tabs-bound') === 'true') {
            return;
        }
        yy_nav.setAttribute('data-yy_tabs-bound', 'true');

        yy_nav.addEventListener('click', function (yy_event) {
            var yy_tab = yy_findTab(yy_nav, yy_event.target);

            if (!yy_tab || yy_tab.classList.contains('yy_is-active')) {
                return;
            }

            yy_clearTabState(yy_container);
            yy_setTabActive(yy_container, yy_tab);
        });

        yy_activeDefault(yy_container);
        yy_nav.removeAttribute('aria-busy');
    }

    // 功能：初始化页面中所有 .yy_tabs 容器，使组件可在同一页面多处复用
    function yy_initTabs(yy_scope) {
        var yy_containers = (yy_scope || document).querySelectorAll('.yy_tabs');
        var yy_i;

        for (yy_i = 0; yy_i < yy_containers.length; yy_i++) {
            yy_bindTabs(yy_containers[yy_i]);
        }
    }

    // 功能：DOM 解析完成后自动初始化页面里的全部选项卡容器
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            yy_initTabs(document);
        });
    } else {
        yy_initTabs(document);
    }

    window.yy_initTabs = yy_initTabs;
})();
