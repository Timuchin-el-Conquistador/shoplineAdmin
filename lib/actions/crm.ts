"use server";

import { redirect } from "next/navigation";

import { fakeBackend } from "../axios";
import { verifySession } from "../dal";

export async function retrieveCrmData() {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/crm/visitors`;
    const response =
      await fakeBackend.get(path);

    return response;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export async function retrieveCrmVisitor(visitorId: string) {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/crm/visitors/${visitorId}`;
    const response: { message: string; visitor: unknown } =
      await fakeBackend.get(path);

    return response.visitor;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
