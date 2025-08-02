export type ReservationType = "full" | "first_half" | "last_half";

export interface Reservation {
  student_id: string;
  sheet_number: number;
  type: ReservationType;
  date: string;
}

export type Student = {
  $id: string;
  name: string;
  slot: "full_time" | "first_half" | "last_half";
  sheetNumber: number;
  phone?: string;
  father_name: string,
  address: string,
  is_active: boolean;
};

export interface Sheet {
  sheetNumber: number;
  status: "free" | "first_half" | "last_half" | "full_time";
  fullTimeName?: string;
  firstHalfName?: string;
  lastHalfName?: string;
  is_active?: boolean;
}
