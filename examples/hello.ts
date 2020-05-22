import { server } from "../server.ts";
import { json } from "../response.ts";

const app = server();
app
  .get(
    "/hello/:name",
    (req: any, args: any) => json({ hello: `${args.name}!` }),
  );

await app.listen();
