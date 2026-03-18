"use client";

import { useAuth } from "@/contexts/AuthContext";
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
import { useRouter } from "next/navigation";

interface LoginRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const LoginRequiredPopup = ({
  isOpen,
  onClose,
  title = "You are not logged in",
  description = "Please sign in to like, comment or reply to discussions.",
}: LoginRequiredPopupProps) => {
  const router = useRouter();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-3xl border-none shadow-2xl max-w-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-medium text-[#3c2a34]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 flex gap-3">
          <AlertDialogCancel className="flex-1 rounded-2xl border-warm-200 text-gray-500 hover:bg-warm-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => router.push("/signup")}
            className="flex-1 rounded-2xl bg-[#3c2a34] hover:bg-[#3c2a34]/90 text-white border-none"
          >
            Sign in now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
