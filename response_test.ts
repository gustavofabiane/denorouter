import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Status } from "https://deno.land/std@0.50.0/http/http_status.ts";
import { json } from "./response.ts";

Deno.test("test json response", () => {
  const resp = json({ hello: "world!" });
  assertEquals(resp.status, Status.OK);
  assertEquals(resp.body, '{"hello":"world!"}');
  assertEquals(resp.headers?.get("Content-Type"), "application/json");
});

Deno.test("test json response with status", () => {
  const resp = json({ hello: "world!" }, Status.BadGateway);
  assertEquals(resp.status, Status.BadGateway);
});
