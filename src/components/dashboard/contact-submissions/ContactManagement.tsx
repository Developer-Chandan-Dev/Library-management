"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/contact-submissions/columns";
import { getContactSubmissions } from "@/lib/actions/contact.action";
import { Contact } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactManagement = () => {
  const [contactRecords, setContactRecords] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContactRecords = async () => {
    try {
      setLoading(true);
      const response = await getContactSubmissions();
      if (response.success && response.data) {
        const docs = response.data as unknown as Contact[];
        setContactRecords(docs || []);
      } else {
        toast.error(response.message || "Failed to fetch contact records");
      }
    } catch (error) {
      console.error("Error fetching contact records:", error);
      toast.error("Failed to fetch contact records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactRecords();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={contactRecords}
          refreshData={fetchContactRecords}
          isLoading={loading}
          searchableColumns={[
            {
              id: "email",
              placeholder: "Search email...",
            },
            {
              id: "name",
              placeholder: "Search name...",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default ContactManagement;
