import { ClerkLoading, SignedIn, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Loader } from "../Loader";
import { fetchUserProfile } from "@/lib/utils";
import { useMediaResources } from "@/hooks/useMediaResources";
import MediaConfiguration from "../MediaConfiguration";

const Widget = () => {
  const [profile, setProfile] = useState<{
    status: number;
    user:
      | ({
          subscription: {
            plan: "PRO" | "FREE";
          } | null;
          studio: {
            id: string;
            screen: string | null;
            mic: string | null;
            preset: "HD" | "SD";
            userId: string | null;
          } | null;
        } & {
          id: string;
          email: string;
          firstName: string | null;
          lastName: string | null;
          createdAt: Date;
          clerkid: string;
        })
      | null;
  } | null>(null);

  const { user } = useUser();
  const { state, fetchMediaResources } = useMediaResources();

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id).then((p) => setProfile(p));
      fetchMediaResources();
    }
  }, [user, fetchMediaResources]);

  return (
    <div className="p-5">
      <ClerkLoading>
        <div className="h-full flex justify-center items-center">
          <Loader />
        </div>
      </ClerkLoading>
      <SignedIn>
        {profile ? (
          <MediaConfiguration state={state} user={profile.user} />
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <Loader className="text-white" />
          </div>
        )}
      </SignedIn>
    </div>
  );
};

export default Widget;
