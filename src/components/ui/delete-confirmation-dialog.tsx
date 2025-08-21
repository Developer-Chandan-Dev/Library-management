// components/ui/delete-confirmation-dialog.tsx
"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (permanentDelete: boolean) => void;
  itemName: string;
  isLoading?: boolean;
};

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  
  const [permanentDelete, setPermanentDelete] = React.useState(false);

  const handleConfirm = () => {
    onConfirm(permanentDelete);
    setPermanentDelete(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            This will {permanentDelete 
              ? "permanently delete" 
              : "move to trash"
            } {itemName}'s record. 
            {!permanentDelete && " You can restore them later."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="permanent-delete" 
            checked={permanentDelete}
            onCheckedChange={() => setPermanentDelete(!permanentDelete)}
            disabled={isLoading}
          />
          <Label htmlFor="permanent-delete">
            Permanent Delete (cannot be undone)
          </Label>
        </div>
        
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {permanentDelete ? "Delete Permanently" : "Move to Trash"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}