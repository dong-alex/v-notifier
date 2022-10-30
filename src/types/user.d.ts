export interface User {
  name: string;
  phone: string;
  pendingPay?: boolean;
  paid?: boolean;
}