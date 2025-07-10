/// <reference types="vite/client" />

// Добавьте этот интерфейс
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: object;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color: string;
    secondary_bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  onEvent(eventType: 'themeChanged' | 'viewportChanged', eventHandler: () => void): void;
  offEvent(eventType: 'themeChanged' | 'viewportChanged', eventHandler: () => void): void;
  // ... и другие методы
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}