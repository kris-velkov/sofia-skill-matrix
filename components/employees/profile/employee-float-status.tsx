"use server";

import { fetchFloatUserInfo } from "@/app/actions/float-actions";
import { Badge } from "@/components/ui/badge";
import { Ban, CheckCircle } from "lucide-react";

interface Props {
  floatId: string;
}

export async function FloatUserStatusBadge({ floatId }: Props) {
  const { isBooked, found, message } = await fetchFloatUserInfo(floatId);

  // If user is not found in Float, show appropriate message
  if (!found) {
    return (
      <Badge
        variant="secondary"
        className="bg-gray-100 text-gray-700 mt-2 px-4 py-1 shadow"
      >
        <Ban className="w-4 h-4 mr-2" />
        Not found in Float
      </Badge>
    );
  }

  // If user is found, show booking status
  return isBooked ? (
    <Badge
      variant="secondary"
      className="bg-red-100 text-red-900 mt-2 px-4 py-1 shadow"
    >
      <Ban className="w-4 h-4 mr-2" />
      Busy next 2 months
    </Badge>
  ) : (
    <Badge
      variant="secondary"
      className="bg-green-200 text-green-900 mt-2 px-4 py-1 shadow"
    >
      <CheckCircle className="w-4 h-4 mr-2" />
      Free next 2 months
    </Badge>
  );
}
