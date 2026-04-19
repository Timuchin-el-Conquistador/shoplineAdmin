"use server";

import { verifySession } from "../dal";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

import { redirect } from "next/navigation";

import { fakeBackend } from "../axios";

export async function createLocationAction(
  storeId: string,
  email: string,
  name: string,
  phoneNumber: string,
  address: string
) {
  "use server";
  try {
    if (!storeId || !email || !name || !phoneNumber || !address) {
      return {
        status: "FAILED",
        message:
          "one or more required fields were left empty and must be filled in before you can submit the form",
      };
    }
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/locations`;
    const response: { message: string } = await fakeBackend.post(path, {
      storeId,
      name,
      email,
      phoneNumber,
      address,
    });

    revalidatePath("/locations");
    revalidatePath("/locations/new");

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function updateLocationAction(
  locationId: string,
  storeId: string,
  email: string,
  name: string,
  phoneNumber: string,
  address: string
) {
  "use server";
  try {
    if (!storeId || !email || !name || !phoneNumber || !address) {
      return {
        status: "FAILED",
        message:
          "one or more required fields were left empty and must be filled in before you can submit the form",
      };
    }
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/locations/${locationId}`;

    const response: { message: string } = await fakeBackend.put(path, {
      storeId,
      name,
      email,
      phoneNumber,
      address,
    });

    revalidatePath("/locations");
    revalidatePath(`/locations/edit/${locationId}`);

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function removeLocationAction(locationId: string) {
  "user server";
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/locations/${locationId}`;
    const response: { message: string } = await fakeBackend.delete(path);

    revalidatePath("/locations");
    revalidatePath(`/locations/edit/${locationId}`);

    return { status: "OK", message: response.message };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function retrieveLocationsAction() {
  "use server";
  try {
    noStore();

    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/locations`;
    const response: { message: string; locations: any[] } =
      await fakeBackend.get(path);
    return {
      status: "OK",
      message: response.message,
      locations: response.locations,
    };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
      locations: [],
    };
  }
}

export async function retrieveLocation(locationId: string) {
  try {
    noStore();

    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");
    const path = `api/v1/user/${session.email}/locations/${locationId}`;
    const response: { message: string; location: any } = await fakeBackend.get(
      path
    );
    return response.location;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}

export async function retrieveOnlineStoresAction() {
  "use server";
  try {
    noStore();

    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");

    const path = `api/v1/user/${session.email}/stores`;
    const response: { message: string; stores: any[] } =
      await fakeBackend.get(path);

    return {
      status: "OK",
      message: response.message,
      stores: response.stores,
    };
  } catch (error) {
    return {
      status: "FAILED",
      message: error instanceof Error ? error.message : String(error),
      stores: [],
    };
  }
}

export async function retrieveKPI() {
  try {
    const session = await verifySession();

    if (!session) return redirect("/users/sign_in");
    const path = `api/v1/user/${session.email}/analytics/kpi`;
    const response: {
      message: string;
      summary: {
        locations: number;
        staff: number;
        visitors: number;
        sessions: number;
      };
      retailsSessions: {
        _id: string;
        visitor: string;
        location: string;
        staff: string;
        status: string;
        date: string;
        link: string;
      }[];
      monthlyVisitors: number[][];
      locations: string[];
      // Optional dashboard dataset fields provided by backend
      topMetrics?: any[];
      topPerformingRetailLinks?: any[];
      regionData?: any[];
      recentRecommendations?: any[];
      recentTransactions?: any[];
      barChartData?: any;
      lineChartData?: any;
      doughnutData?: any;
    } = await fakeBackend.get(path);
    return response;
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error));
  }
}
