export const baseURL = "http://localhost:8080";

const SummaryApi = {
  signUp: {
    url: "/api/user/sign-up",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgotPassword: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  verifyOTP: {
    url: "/api/user/verify-forgot-password",
    method: "put",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
};

export default SummaryApi;
