export type ReservationType = "full" | "first_half" | "last_half";

export interface Reservation {
  student_id: string;
  sheet_number: number;
  type: ReservationType;
  date: string;
}

export type Student = {
  $id?: string | undefined;
  name: string;
  slot: "full_time" | "first_half" | "last_half";
  sheetNumber: number;
  phone?: string;
  father_name: string;
  address: string;
  is_active?: boolean;
  join_date: string;
  email?: string;
};

export interface Sheet {
  $id?: string | undefined;
  sheetNumber: number;
  status: "free" | "full" | "half";
  fullTimeName?: string;
  firstHalfName?: string;
  lastHalfName?: string;
  is_active?: boolean;
}

export interface User {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: [];
  $sequence: number;
  $updatedAt: string;
  accountId: string;
  avatarId: string;
  email: string;
  fullName: string;
}

export interface Reservation {
  $id?: string | undefined;
  studentId: string;
  studentName: string;
  sheetNumber: number;
  slot: "full_time" | "first_half" | "last_half";
  startDate: string;
  endDate: string;
  reservationDate: string;
  status: "active" | "completed" | "cancelled";
}

export interface Attendance{
  $id?: string | undefined;
  studentId: string;
  studentName: string;
  date: string;
  entryTime: string;
  exitTime: string;
  duration: number;
}

export interface Payment {
  $id?: string | undefined;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "online" | "other";
  status: "pending" | "paid" | "overdue";
  paymentDate: string;
  receiptNumber: string;
}

export interface PaymentHistory {
  id?: string | undefined;
  paymentId: string;
  amount: number;
  paymentDate: string;
  receiptNumber: string;
}
export interface Contact {
  $id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  status: "readed" | "unread";
}
