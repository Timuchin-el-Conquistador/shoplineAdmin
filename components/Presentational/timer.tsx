import { useEffect, useRef, useState } from "react";

import { formatMMSSTime } from "@/utils/timer";

export default function Timer(props: { sendAsMissedCall: () => void, time:number }) {



  useEffect(() => {

    setTimeout(() => {
      props.sendAsMissedCall();
    }, 1000 *60 *3)

  }, []);

  return (
    <div className="mt-2 text-sm text-gray-500">
      Waiting since {formatMMSSTime(props.time)}
    </div>
  );
}
