import { Client, Account, Databases, Storage, Teams } from "node-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const teams = new Teams(client);
export const APPWRITE_REDIRECT_URL = process.env.NEXT_PUBLIC_APPWRITE_MAGIC_URL_REDIRECT!;
export const ADMIN_TEAM_ID = process.env.NEXT_PUBLIC_ADMIN_TEAM_ID!;
export default client;