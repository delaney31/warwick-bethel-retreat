import { NextResponse } from "next/server";
import { constructStripeEvent, handleCheckoutSessionCompleted } from "@/lib/stripe/webhook";

export const runtime = "nodejs";

/** Stripe requires the raw body for signature verification — do not parse as JSON first. */
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  let event;
  try {
    const payload = await request.text();
    event = constructStripeEvent(payload, signature);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed.";
    console.error("[stripe webhook] signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const result = await handleCheckoutSessionCompleted(session);
        console.info("[stripe webhook]", event.type, result);
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[stripe webhook]", event.type, err);
    const message = err instanceof Error ? err.message : "Webhook handler failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
