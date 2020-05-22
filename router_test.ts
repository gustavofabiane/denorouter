import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { ServerRequest } from "https://deno.land/std@0.50.0/http/server.ts";
import { router } from "./router.ts";
import { json } from "./response.ts";

const testPath = "/hello/john/doe";
const testWrongPath = "/wrong/john/doe";
const testRouteDeclaration = {
  method: "GET",
  pattern: "/hello/:name/:other",
  handler: () => json({ "hello": "world!" }),
  args: {},
};

Deno.test("does not match route", () => {
  const req: ServerRequest = new ServerRequest();
  req.method = "GET";
  req.url = testWrongPath;

  const route = router().add(testRouteDeclaration).dispatch(req);
  assertEquals(route, undefined);
});

Deno.test("match route", () => {
  const req: ServerRequest = new ServerRequest();
  req.method = "GET";
  req.url = testPath;

  const route = router().add(testRouteDeclaration).dispatch(req);
  assertNotEquals(route, undefined);
  assertEquals(
    route?.regex,
    /^\/hello\/(?<name>[A-z0-9_-]+)\/(?<other>[A-z0-9_-]+)/g,
  );
});
