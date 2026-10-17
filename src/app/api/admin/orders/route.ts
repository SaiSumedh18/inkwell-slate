import { timingSafeEqual } from "node:crypto";
import { listOrders } from "@/lib/server/orders";
import { StoreNotConfiguredError } from "@/lib/server/store";

/** All orders, newest first. Requires `Authorization: Bearer <ADMIN_PASSWORD>`. */
export async function GET(request: Request) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return Response.json(
      { error: "The dashboard is turned off. Set ADMIN_PASSWORD to turn it on." },
      { status: 503 },
    );
  }

  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!safeEqual(given, password)) {
    return Response.json({ error: "That password isn’t right." }, { status: 401 });
  }

  try {
    return Response.json({ orders: await listOrders() });
  } catch (err) {
    if (err instanceof StoreNotConfiguredError) {
      return Response.json({ error: err.message }, { status: 503 });
    }
    console.error(err);
    return Response.json({ error: "Couldn’t load orders. Try again." }, { status: 500 });
  }
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
