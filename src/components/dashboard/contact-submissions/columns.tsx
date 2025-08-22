import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ContactSubmission } from "@/lib/actions/contact.action";

export const columns: ColumnDef<ContactSubmission>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusValue = String(row.getValue("status"));
      const variantMap = {
        unread: "destructive",
        "in-progress": "secondary",
        resolved: "default"
      } as const;
      const variant = variantMap[statusValue as keyof typeof variantMap] ?? "default";
      
      return <Badge variant={variant}>{String(status)}</Badge>
    }
  },
  {
    accessorKey: "submissionDate",
    header: "Submitted",
    cell: ({ row }) => {
      return new Date(row.getValue("submissionDate")).toLocaleDateString()
    }
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return <span className="line-clamp-2">{row.getValue("message")}</span>
    }
  }
]