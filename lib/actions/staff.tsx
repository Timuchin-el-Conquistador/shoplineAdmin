"use server";

import { verifySession } from "../dal";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { redirect } from "next/navigation";

import { fakeBackend } from "../axios";

export async function createUserAction(
  email: string,
  password: string,
  name: string,
  phoneNumber: string,
  role: string,
  location: string
) {
  "use server";
  try {
    if (!email || !password || !name || !phoneNumber || !role || !location) {
      return {
        status: "FAILED",
        message:
          "one or more required fields were left empty and must be filled in before you can submit the form",
      };
    }
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/staff`;
    const response: { message: string } = await fakeBackend.post(path, {
      name,
      password,
      email,
      phoneNumber,
      role,
      location,
    });

    revalidatePath("/staff");
    revalidatePath("/staff/new");

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateUserAction(
  userId: string,
  email: string,
  password: string,
  name: string,
  phoneNumber: string,
  role: string,
  location: string
) {
  "use server";
  try {
    if (!email || !password || !name || !phoneNumber || !role || !location) {
      return {
        status: "FAILED",
        message:
          "one or more required fields were left empty and must be filled in before you can submit the form",
      };
    }
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/staff/${userId}`;

    const response: { message: string } = await fakeBackend.put(path, {
      name,
      email,
      password,
      phoneNumber,
      role,
      location,
    });

    revalidatePath("/staff");
    revalidatePath(`/staff/edit/${userId}`);

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function removeUserAction(userId: string) {
  "user server";
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/staff/${userId}`;
    const response: { message: string } = await fakeBackend.delete(path);

    revalidatePath("/staff");
    revalidatePath(`/staff/edit/${userId}`);

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function retrieveUser(userId: string) {
  try {
    noStore();

    const session = await verifySession();
    if (!session) return redirect("/users/sign_in");
    const path = `api/v1/user/${session.email}/staff/${userId}`;
    const response: { message: string; user: any } = await fakeBackend.get(
      path
    );
    return response.user;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export async function retrieveUsersAction() {
  try {
    noStore();

    const session = await verifySession();
    if (!session) return redirect("/users/sign_in");
    const path = `api/v1/user/${session.email}/staff`;
    const response: { message: string; staff: any[] } = await fakeBackend.get(
      path
    );
    return { status: "OK", message: response.message, staff: response.staff };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
      staff: [],
    };
  }
}
