import { useEffect, useState } from "react";
import { useZodForm } from "./useZodForm";
import { updateStudioSettingsSchema } from "@/schema/studio-settings.schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateStudioSettings } from "@/lib/utils";

export const useStudioSettings = (
  id: string,
  screen?: string | null,
  audio?: string | null,
  preset?: "HD" | "SD",
  plan?: "PRO" | "FREE"
) => {
  const [onPreset, setOnPreset] = useState<"HD" | "SD" | undefined>();
  const { register, watch } = useZodForm(updateStudioSettingsSchema, {
    screen: screen!,
    audio: audio!,
    preset: preset,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["update-studio"],
    mutationFn: (data: {
      screen: string;
      id: string;
      preset: "HD" | "SD";
      audio: string;
    }) => {
      return updateStudioSettings(
        data.id,
        data.screen,
        data.audio,
        data.preset
      );
    },
    onSuccess: (data) => {
      return toast(data.status === 200 ? "Success" : "Error", {
        description: data.message,
      });
    },
  });

  useEffect(() => {
    if (screen && audio) {
      window.ipcRenderer.send("media-sources", {
        screen,
        id,
        audio,
        preset,
        plan,
      });
    }
  }, [screen, audio]);

  useEffect(() => {
    const subscribe = watch((values) => {
      setOnPreset(values.preset);
      mutate({
        screen: values.screen!,
        audio: values.audio!,
        preset: values.preset!,
        id,
      });
      window.ipcRenderer.send("media-sources", {
        screen: values.screen,
        id,
        audio: values.audio,
        preset: values.preset,
        plan,
      });
    });
    return () => subscribe.unsubscribe();
  }, [watch]);
  return { register, isPending, onPreset };
};
