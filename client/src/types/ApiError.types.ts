export interface ApiErrorProps {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
}
