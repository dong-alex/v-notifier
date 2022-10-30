export interface User {
  name: string;
  phone: string;
  pendingPay?: boolean | null;
  paid?: boolean | null;
}