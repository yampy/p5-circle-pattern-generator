import { menuState } from '../../core/state';
import { saveCurrentPreset } from '../sidebar/presetSidebar';

export function hideMenus() {
  const presetSidebar = document.getElementById('preset-sidebar');
  const presetToggle = document.getElementById('preset-toggle');
  const paramsMenu = document.getElementById('params-menu');
  const paramsToggle = document.getElementById('params-toggle');

  if (presetSidebar && presetToggle && paramsMenu && paramsToggle) {
    // プリセットサイドバーを非表示
    menuState.isPresetSidebarVisible = false;
    presetSidebar.style.transform = 'translateX(-100%)';
    presetToggle.style.transform = 'rotate(0deg)';

    // パラメーターメニューを非表示
    menuState.isParamsMenuVisible = false;
    paramsMenu.style.transform = 'translateX(100%)';
    paramsToggle.style.transform = 'rotate(0deg)';
  }
}

export function initializeMenuControls() {
  const presetSidebar = document.getElementById('preset-sidebar');
  const presetToggle = document.getElementById('preset-toggle');
  const paramsMenu = document.getElementById('params-menu');
  const paramsToggle = document.getElementById('params-toggle');
  const canvasContainer = document.getElementById('canvas-container');
  const saveButton = document.getElementById('save-button');

  // パラメータメニューの位置調整
  if (paramsMenu) {
    paramsMenu.style.marginTop = '60px';  // トップメニューの高さ分を確保
  }

  if (presetSidebar && presetToggle && paramsMenu && paramsToggle) {
    // プリセットサイドバーの制御
    presetToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuState.isPresetSidebarVisible = !menuState.isPresetSidebarVisible;
      presetSidebar.style.transform = menuState.isPresetSidebarVisible ? 'translateX(0)' : 'translateX(-100%)';
      presetToggle.style.transform = menuState.isPresetSidebarVisible ? 'rotate(180deg)' : 'rotate(0deg)';
    });

    // パラメーターメニューの制御
    paramsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuState.isParamsMenuVisible = !menuState.isParamsMenuVisible;
      paramsMenu.style.transform = menuState.isParamsMenuVisible ? 'translateX(0)' : 'translateX(100%)';
      paramsToggle.style.transform = menuState.isParamsMenuVisible ? 'rotate(-180deg)' : 'rotate(0deg)';
    });

    // メニュー自体のクリックイベントの伝播を停止
    presetSidebar.addEventListener('click', (e) => e.stopPropagation());
    paramsMenu.addEventListener('click', (e) => e.stopPropagation());

    // キャンバスコンテナのクリックでメニューを閉じる
    if (canvasContainer) {
      canvasContainer.addEventListener('click', (e) => {
        if (menuState.isPresetSidebarVisible || menuState.isParamsMenuVisible) {
          e.stopPropagation();
          hideMenus();
        }
      });
    }

    // Save ボタンの機能を実装
    if (saveButton) {
      // クリックとタッチイベントの両方に対応
      const saveHandler = (e: Event) => {
        e.preventDefault();  // デフォルトの動作を防止
        e.stopPropagation();
        saveCurrentPreset();
      };

      saveButton.addEventListener('click', saveHandler);
      saveButton.addEventListener('touchend', saveHandler);
      
      // タッチデバイスでのゴーストクリック防止
      saveButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
      });
    }

    // ドキュメント全体のクリックでメニューを閉じる
    document.addEventListener('click', () => {
      if (menuState.isPresetSidebarVisible || menuState.isParamsMenuVisible) {
        hideMenus();
      }
    });
  }
} 