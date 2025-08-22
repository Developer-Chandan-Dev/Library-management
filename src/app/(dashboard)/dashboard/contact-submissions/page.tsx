import ContactManagement from "@/components/dashboard/contact-submissions/ContactManagement";
export default async function ContactSubmissionsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contact</h1>
        <p className="text-muted-foreground">Track contact</p>
      </div>
      <ContactManagement />
    </div>
  );
}
