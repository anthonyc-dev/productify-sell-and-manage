import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";

// the best way to implement this is by using webhooks
function useUserSync() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const {
    mutate: syncUserMutation,
    isPending,
    isSuccess,
  } = useMutation({ mutationFn: syncUser });

  useEffect(() => {
    if (isSignedIn && user && !isPending) {
      // Prioritize Google profile image if available
      const googleAccount = user.externalAccounts.find(
        (acc) => acc.provider === "google",
      );
      const bestImageUrl = googleAccount?.imageUrl || user.imageUrl;

      syncUserMutation({
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName || user.firstName,
        imageUrl: bestImageUrl,
      });
    }
  }, [
    isSignedIn,
    user?.fullName,
    user?.primaryEmailAddress?.emailAddress,
    user?.imageUrl,
    syncUserMutation,
    isPending,
  ]);

  return { isSynced: isSuccess };
}

export default useUserSync;
