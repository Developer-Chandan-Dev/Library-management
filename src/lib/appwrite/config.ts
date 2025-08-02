export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
  sheetsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_SHEETS_COLLECTION_ID!,
  studentsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID!,
  bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
  magicUrlRedirect: process.env.NEXT_PUBLIC_APPWRITE_MAGIC_URL_REDIRECT!,
  adminTeamId: process.env.NEXT_PUBLIC_ADMIN_TEAM_ID!,
  // collectionId: 'your_collection_id',
  apiKey: process.env.NEXT_APPWRITE_API_KEY!,
};
