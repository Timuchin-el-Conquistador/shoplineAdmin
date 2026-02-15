"use server";

import { redirect } from "next/navigation";

import { fakeBackend } from "../axios";
import { verifySession } from "../dal";

type RetrieveCrmDataOptions = {
  page?: number;
  limit?: number;
};

export async function retrieveCrmData({ page = 1, limit = 10 }: RetrieveCrmDataOptions = {}) {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10;
    const query = new URLSearchParams({
      page: String(safePage),
      limit: String(safeLimit),
    }).toString();
    const path = `api/v1/user/${session.email}/crm/visitors?${query}`;
    const response =
      await fakeBackend.get(path);

    return response;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export async function retrieveCrmVisitor(visitorEmail: string) {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/crm/visitors/email/${visitorEmail}`;
    const response: { message: string; visitor: unknown } =
      await fakeBackend.get(path);

    return response.visitor;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export async function retrieveCrmOfflineSessions(visitorEmail: string) {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/crm/visitors/email/${visitorEmail}/offline-sessions`;
    const response = await fakeBackend.get(path);

    return response;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
