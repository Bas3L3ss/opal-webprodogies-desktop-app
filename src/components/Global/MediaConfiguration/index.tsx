import { SourceDeviceStateProps } from "@/hooks/useMediaResources";
import { useStudioSettings } from "@/hooks/useStudioSettings";
import { Loader } from "../Loader";
import { Headphones, Monitor, Settings, Settings2 } from "lucide-react";

type Props = {
  user: {
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

    id: string;

    email: string;

    firstName: string | null;

    lastName: string | null;

    createdAt: Date;

    clerkid: string;
  } | null;

  state: SourceDeviceStateProps;
};

const MediaConfiguration = ({ state, user }: Props) => {
  const activeScreen = state.displays?.find(
    (screen) => screen.id === user?.studio?.screen
  );

  const activeAudio = state.audioInputs?.find(
    (device) => device.deviceId === user?.studio?.mic
  );
  const { isPending, onPreset, register } = useStudioSettings(
    user!.id,
    user?.studio?.screen || state.displays?.[0].id,
    user?.studio?.mic || state.audioInputs?.[0].deviceId,
    user?.studio?.preset,
    user?.subscription?.plan
  );

  return (
    <form className="flex h-full relative w-full  flex-col gap-y-5">
      {isPending && (
        <div className="fixed z-50 w-full top-0 left-0 right-0 bottom-0 rounded-2xl h-full bg-black/80 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="flex gap-5 justify-center items-center">
        <Monitor fill="#575655" color="#575655" size={36} />
        <select
          {...register("screen")}
          className="outline-none cursor-pointer px5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.displays?.map((display, key) => {
            return (
              <option
                value={display.id}
                selected={activeScreen && activeScreen.id == display.id}
                className="bg-[#171717] cursor-pointer"
                key={key}
              >
                {display.name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex gap-5 justify-center items-center">
        <Headphones color="#575655" size={36} />
        <select
          {...register("audio")}
          className="outline-none cursor-pointer px5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          {state.audioInputs?.map((device, key) => {
            return (
              <option
                value={device.deviceId}
                selected={
                  activeAudio && activeAudio.deviceId == device.deviceId
                }
                className="bg-[#171717] cursor-pointer"
                key={key}
              >
                {device.label}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex gap-5 justify-center items-center">
        <Settings2 color="#575655" size={36} />
        <select
          {...register("preset")}
          className="outline-none cursor-pointer px5 py-2 rounded-xl border-2 text-white border-[#575655] bg-transparent w-full"
        >
          <option
            value="HD"
            className="bg-[#171717] cursor-pointer"
            disabled={user?.subscription?.plan === "FREE"}
            selected={onPreset === "HD" || user?.studio?.preset === "HD"}
          >
            1080p
            {user?.subscription?.plan == "FREE" && "(Upgrade to PRO plan)"}
          </option>
          <option
            value="SD"
            selected={onPreset === "SD" || user?.studio?.preset === "SD"}
            className="bg-[#171717] cursor-pointer"
          >
            720p
          </option>
        </select>
      </div>
    </form>
  );
};

export default MediaConfiguration;
