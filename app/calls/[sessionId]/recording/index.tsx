"use client";

import "@/styles/calls/index.scss";
import "@/styles/calls/recording.scss";

import CallSessionShell from "../call-session-shell";

import { useEffect, useState } from "react";

import { AudioLoadingSkeletonPulse } from "@/components/Loaders/pulse";

type PageProps = {
  callId: string;
  retrieveAudioRecordUrlAction: (callId: string) => Promise<{
    status: number;
    message: string;
    recordUrl: string | null;
    transcriptionUrl: string | null;
  }>;
};

function Recording(props: PageProps) {
  const [recordUrl, setRecordUrl] = useState<string>();
  const [transcriptionUrl, setTranscriptionUrl] = useState<string>();
  const [loading, setLoadingState] = useState(false);
  useEffect(() => {
    async function retrieveCallRecordId(callId: string) {
      setLoadingState(true);
      const response = await props.retrieveAudioRecordUrlAction(callId);
      if (response.status == 200) {
        setRecordUrl(response.recordUrl ?? "");
        setTranscriptionUrl(response.transcriptionUrl ?? "");
      }
      setLoadingState(false);
    }

    retrieveCallRecordId(props.callId);
  }, [props.callId, props.retrieveAudioRecordUrlAction]);

  return (
    <CallSessionShell callId={props.callId} activeTab="recording">
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-900">Recording</h3>

        <div id="recording" className="mt-4">
          {loading && <AudioLoadingSkeletonPulse />}
          {!loading && recordUrl && (
            <audio
              controls
              className="w-full"
              onError={() => {
                setRecordUrl("");
              }}
            >
              <source src={recordUrl} type="audio/mp3" /> Your browser does not
              support the audio element.
            </audio>
          )}
          {!loading && !recordUrl && (
            <div className="dotted-container text-gray-400">No Audio Records</div>
          )}

          {transcriptionUrl && (
            <div id="transcription" className="mt-6">
              <div className="dotted-container text-gray-400">
                <a download={props.callId + "-transcription.json"} href={transcriptionUrl}>
                  Download Transcription
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </CallSessionShell>
  );
}

export default Recording;
