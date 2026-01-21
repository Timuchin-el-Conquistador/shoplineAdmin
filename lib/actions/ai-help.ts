"use server";

import { redirect } from "next/navigation";

import { fakeBackend } from "../axios";

import { verifySession } from "../dal";

export async function messageAi(topic: string, question: string): Promise<string | Error> {
  "use server";
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");
    const path = `api/v1/user/${session.email}/ai/question`;

    const response: { message: string; explanation: string } =
      await fakeBackend.post(path, { topic, question })

    return response.explanation;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
