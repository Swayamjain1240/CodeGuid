export const parseErrorMessage = (error) => {

  if (typeof error === "string") return error;

  if (error?.message) return error.message;

  if (error?.response?.data?.error) return error.response.data.error;

  if (error?.response?.data?.message) return error.response.data.message;
  
  return "An unexpected error occurred. Please try again.";
};