const getErrorMessage = (error) => {
  if (!error.response) {
    return "Unable to connect to the server. Please check your internet connection.";
  }

  const status = error.response.status;

  const messages = {
    400: "Invalid request. Please check your input.",
    401: "Invalid email or password. Please try again.",
    403: "You don't have permission to perform this action.",
    404: "Requested resource not found.",
    409: "This email is already registered. Please log in.",
    422: "Please check your details and try again.",
    429: "Too many attempts. Please try again later.",
    500: "Internal server error. Please try again later.",
    502: "Server is temporarily unavailable.",
    503: "Service is unavailable. Please try again later.",
  };

  return messages[status] || "Something went wrong. Please try again.";
};

export default getErrorMessage;