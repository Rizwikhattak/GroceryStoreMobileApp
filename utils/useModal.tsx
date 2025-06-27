import { useState } from "react";

export interface ModalState {
  isVisible: boolean;
  title?: string;
  message?: string;
  type?: "success" | "error" | "warning" | "info" | "confirmation";
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>({
    isVisible: false,
  });

  const showModal = (config: Omit<ModalState, "isVisible">) => {
    setModalState({
      ...config,
      isVisible: true,
    });
  };

  const hideModal = () => {
    setModalState((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const showSuccess = (
    title: string,
    message?: string,
    primaryButtonText?: string,

    onPress?: () => void
  ) => {
    showModal({
      type: "success",
      title,
      message,
      primaryButtonText: primaryButtonText,
      onPrimaryPress: onPress,
    });
  };

  const showError = (
    title: string,
    message?: string,
    primaryButtonText?: string,
    onPress?: () => void
  ) => {
    showModal({
      type: "error",
      title,
      message,
      primaryButtonText: primaryButtonText,
      onPrimaryPress: onPress,
    });
  };

  const showWarning = (
    title: string,
    message?: string,
    primaryButtonText?: string,
    onConfirm?: () => void
  ) => {
    showModal({
      type: "warning",
      title,
      message,
      primaryButtonText: primaryButtonText,
      secondaryButtonText: "Cancel",
      onPrimaryPress: onConfirm,
    });
  };

  const showConfirmation = (
    title: string,
    message?: string,
    primaryButtonText?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => {
    showModal({
      type: "confirmation",
      title,
      message,
      primaryButtonText: primaryButtonText,
      secondaryButtonText: "Cancel",
      onPrimaryPress: onConfirm,
      onSecondaryPress: onCancel,
    });
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
  };
};
//  <CustomModal
//         isVisible={modalState.isVisible}
//         onClose={hideModal}
//         title={modalState.title}
//         message={modalState.message}
//         type={modalState.type}
//         primaryButtonText={modalState.primaryButtonText}
//         secondaryButtonText={modalState.secondaryButtonText}
//         onPrimaryPress={modalState.onPrimaryPress}
//         onSecondaryPress={modalState.onSecondaryPress}
//         animationType="slide"
//         size="medium"
//       />
