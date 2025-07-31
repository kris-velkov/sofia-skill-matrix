import toast from "react-hot-toast";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): void => {
  console.error(defaultMessage, error);

  if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(defaultMessage);
  }
};

export const handleApiSuccess = (message: string): void => {
  toast.success(message);
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage: string
): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, errorMessage);
    return null;
  }
};

export const withSuccessHandling = async <T>(
  apiCall: () => Promise<T>,
  successMessage: string,
  errorMessage: string
): Promise<T | null> => {
  try {
    const result = await apiCall();
    handleApiSuccess(successMessage);
    return result;
  } catch (error) {
    handleApiError(error, errorMessage);
    return null;
  }
};

export const createAsyncHandler = <T extends unknown[]>(
  handler: (...args: T) => Promise<void>,
  errorMessage: string
) => {
  return async (...args: T) => {
    try {
      await handler(...args);
    } catch (error) {
      handleApiError(error, errorMessage);
    }
  };
};
