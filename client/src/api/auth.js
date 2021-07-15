import request from "./request";

export const signUp = ({ email, name, password }) =>
  request.post("/auth/signup", { email, name, password });

export const login = ({ email, password }) =>
  request.post("/auth/login", { email, password });

export const logout = () => request.get("/auth/logout");

export const verify = () => request.get("/auth/verify");

export const activateAccount = ({ email, token }) =>
  request.post("/auth/activation", { email, token });

export const resendActivation = ({ email }) =>
  request.post("/auth/resend-activation", { email });

export const forgotPassword = ({ email }) =>
  request.post("/auth/forgot-password", { email });

export const resetPassword = ({ email, password, token }) =>
  request.post("/auth/reset-password", { email, password, token });
