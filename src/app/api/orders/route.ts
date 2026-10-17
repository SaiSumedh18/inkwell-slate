import { ValidationError, createOrder, findOrder, parseOrderRequest } from "@/lib/server/orders";
import { StoreNotConfiguredError } from "@/lib/server/store";

/** Place an order. Prices are recalculated on the server from the product catalogue. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send the order as JSON." }, { status: 400 });
  }

  try {
    const order = await createOrder(parseOrderRequest(body));
    return Response.json({ order }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Look up an order by number and the email it was placed with. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const number = params.get("number") ?? "";
  const email = params.get("email") ?? "";
  if (!number || !email) {
    return Response.json({ error: "Enter your order number and email." }, { status: 400 });
  }
  try {
    const order = await findOrder(number, email);
    if (!order) {
      return Response.json(
        { error: "No order matches that number and email. Check both and try again." },
        { status: 404 },
      );
    }
    return Response.json({ order });
  } catch (err) {
    return errorResponse(err);
  }
}

function errorResponse(err: unknown) {
  if (err instanceof ValidationError) {
    return Response.json({ error: err.message, fields: err.fields }, { status: 422 });
  }
  if (err instanceof StoreNotConfiguredError) {
    return Response.json({ error: err.message }, { status: 503 });
  }
  console.error(err);
  return Response.json(
    { error: "Something went wrong on our side. Your order was not placed; try again." },
    { status: 500 },
  );
}
