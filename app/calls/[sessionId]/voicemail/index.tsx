"use client";

import "@/styles/calls/index.scss";
import "@/styles/calls/recording.scss";

import CallSessionShell from "../call-session-shell";

import { useEffect, useState } from "react";

import { AudioLoadingSkeletonPulse } from "@/components/Loaders/pulse";

type PageProps = {
  callId: string;
  retrieveVoicemail: (callId: string) => Promise<{
    status: number;
    message: string;
    voicemailUrl:string|null
  }>;
};

function Voicemail(props: PageProps) {
  const [voicemailUrl, setVoicemailUrl] = useState<string>();

  const [loading, setLoadingState] = useState(false);
  useEffect(() => {
    async function retrieveCallRecordId(callId: string) {
      setLoadingState(true);
      const response = await props.retrieveVoicemail(callId);
      if (response.status == 200) {
        setVoicemailUrl(response.voicemailUrl!);

      }
      setLoadingState(false);
    }

    retrieveCallRecordId(props.callId);
  }, [props.callId, props.retrieveVoicemail]);

  return (
    <CallSessionShell callId={props.callId} activeTab="voicemail">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Voice mail</h3>

        <div id="recording" className="mt-4">
          {loading && <AudioLoadingSkeletonPulse />}
          {!loading && voicemailUrl && (
            <audio
              controls
              className="w-full"
              onError={() => {
                setVoicemailUrl("");
              }}
            >
              <source src={voicemailUrl} type="audio/mp3" /> Your browser does not
              support the audio element.
            </audio>
          )}
          {!loading && !voicemailUrl && (
            <div className="dotted-container text-gray-400">No Audio Records</div>
          )}
        </div>
      </div>
    </CallSessionShell>
  );
}

export default Voicemail;
