"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  deleteBooking,
  getBookings,
  updateBooking,
  updateGuest,
} from "./data-service";
import { redirect } from "next/navigation";

export async function createReservation(bookingData, formData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  if (!numGuests) throw new Error("You must choose the number of guests!");

  if (!bookingData.startDate) return;

  const newBooking = {
    ...bookingData,
    numGuests,
    observations,
    guestId: session.user.guestId,
    status: "unconfirmed",
    isPaid: false,
    extrasPrice: 0,
    hasBreakfast: false,
  };

  await createBooking(newBooking);

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou")
}

export async function updateReservation(formData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const userBookings = await getBookings(session.user.guestId);

  if (!userBookings.find((booking) => booking.id === id))
    throw new Error("You are trying to modify booking that you don't have");

  const reservationId = formData.get("reservationId");
  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations").slice(0, 1000);

  await updateBooking(+reservationId, { numGuests, observations });
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${reservationId}`);
  redirect("/account/reservations");
}

export async function deleteReservation(id) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const userBookings = await getBookings(session.user.guestId);

  if (!userBookings.find((booking) => booking.id === id))
    throw new Error("You are trying to delete booking that you don't have");

  await deleteBooking(id);
  revalidatePath("/account/reservations");
}

export async function updateProfile(formData) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in");

  const nationalIDNumber = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const regex = /^[a-zA-Z0-9]{6,12}$/;

  if (!regex.test(nationalIDNumber)) throw new Error("Please provide a valid nationalID");

  const updateData = {
    nationality,
    countryFlag,
    nationalIDNumber,
  };

  await updateGuest(session.user.guestId, updateData);

  revalidatePath("/account/profile");
}

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
