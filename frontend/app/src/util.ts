export const showError : (message ?: string, color ? : string) => {
  message : string;
  duration: number;
  color: string;
  position: 'top' | 'middle' | 'bottom';
} = (message = "Something went wrong!") => ({
            message: message,
            duration: 3000,
            color: 'danger',
            position: 'bottom',
});