import Toast from "react-native-toast-message";

// ToastHelper remains the same
export interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  position?: "top" | "bottom";
}

export class ToastHelper {
  static showSuccess(options: ToastOptions) {
    Toast.show({
      type: "success",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: options.position || "top",
      topOffset: 60,
    });
  }

  static showError(options: ToastOptions) {
    Toast.show({
      type: "error",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 4000,
      position: options.position || "top",
      topOffset: 60,
    });
  }

  static showWarning(options: ToastOptions) {
    Toast.show({
      type: "warning",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 3500,
      position: options.position || "top",
      topOffset: 60,
    });
  }

  static showInfo(options: ToastOptions) {
    Toast.show({
      type: "info",
      text1: options.title,
      text2: options.message,
      visibilityTime: options.duration || 3000,
      position: options.position || "top",
      topOffset: 60,
    });
  }

  static hide() {
    Toast.hide();
  }
}
