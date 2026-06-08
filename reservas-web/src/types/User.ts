export interface User {
  fullName: string;
  email: string;
  role: "ADMIN" | "CLIENT" | "EMPLOYEE";
  token: string;
}