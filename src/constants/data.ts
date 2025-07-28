import { Sheet, Student } from "@/types";

export const dummyStudents: Student[] = [
  {
    id: "s1",
    name: "Ankit Sharma",
    slot: "full_time",
    sheetNumber: 1,
    phone: "+1 (555) 123-4567",
  },
  {
    id: "s2",
    name: "Riya Verma",
    slot: "first_half",
    sheetNumber: 2,
    phone: "+1 (555) 987-6543",
  },
  {
    id: "s3",
    name: "Karan Mehta",
    slot: "last_half",
    sheetNumber: 2,
  },
  {
    id: "s4",
    name: "Neha Gupta",
    slot: "full_time",
    sheetNumber: 3,
    phone: "+1 (555) 246-8101",
  },
  {
    id: "s5",
    name: "Amit Singh",
    slot: "first_half",
    sheetNumber: 4,
  },
  {
    id: "s6",
    name: "Priya Tiwari",
    slot: "last_half",
    sheetNumber: 4,
    phone: "+1 (555) 369-1214",
  },
  {
    id: "s7",
    name: "Rohit Yadav",
    slot: "first_half",
    sheetNumber: 5,
  },
  {
    id: "s8",
    name: "Sneha Chauhan",
    slot: "full_time",
    sheetNumber: 6,
    phone: "+1 (555) 481-6325",
  },
  {
    id: "s9",
    name: "Deepak Kumar",
    slot: "last_half",
    sheetNumber: 5,
    phone: "+1 (555) 481-6325",
  },
  {
    id: "s10",
    name: "Ayesha Khan",
    slot: "first_half",
    sheetNumber: 7,
    phone: "+1 (555) 481-6325",
  },
];

export const dummySheets: Sheet[] = [
  { sheetNumber: 1, status: "full_time", fullTimeName: "Ankit Sharma" },
  {
    sheetNumber: 2,
    status: "full_time",
    firstHalfName: "Riya Verma",
    lastHalfName: "Karan Mehta",
  },
  { sheetNumber: 3, status: "full_time", fullTimeName: "Neha Gupta" },
  {
    sheetNumber: 4,
    status: "full_time",
    firstHalfName: "Amit Singh",
    lastHalfName: "Priya Tiwari",
  },
  {
    sheetNumber: 5,
    status: "full_time",
    firstHalfName: "Rohit Yadav",
    lastHalfName: "Deepak Kumar",
  },
  { sheetNumber: 6, status: "full_time", fullTimeName: "Sneha Chauhan" },
  { sheetNumber: 7, status: "first_half", firstHalfName: "Ayesha Khan" },
];
