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
  father_name: string,
  address: string,
  is_active?: boolean;
};

export interface Sheet {
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

