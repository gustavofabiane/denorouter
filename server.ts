import {
  listenAndServe,
  listenAndServeTLS,
  ServerRequest,
  Response,
} from "https://deno.land/std@0.50.0/http/server.ts";
import { Status } from "https://deno.land/std@0.50.0/http/http_status.ts";
import { Router, RouteHandler } from "./router.ts";
import { json } from "./response.ts";

export interface Settings {
  hostname: string;
  port: number;
  certFile?: string;
  keyFile?: string;
}

const defaultSettings: Settings = {
  hostname: "127.0.0.1",
  port: 8000,
};

export class Server {
  constructor(
    private settings: Settings,
    private router: Router,
  ) {
  }

  listen = async () => {
    const { hostname, port } = this.settings;
    console.info(`Listening HTTP at http://${hostname}:${port} ...`);
    return listenAndServe({
      hostname,
      port,
    }, this.handle);
  };

  listenTLS = async () => {
    const { hostname, port, certFile, keyFile } = this.settings;
    if (!certFile || !keyFile) {
      throw "TLS ceritificate and key files are required";
    }
    console.info(`Listening HTTPS at https://${hostname}:${port}...`);
    return listenAndServeTLS({
      hostname,
      port,
      certFile,
      keyFile,
    }, this.handle);
  };

  handle = (req: ServerRequest) => {
    let res: Response = {};
    try {
      const route = this.router.dispatch(req);
      res = route ? route.handler(req, route.args) : json({
        message: "resource not found",
      }, Status.NotFound);
    } catch (e) {
      res = json({ error: e }, Status.InternalServerError);
    }
    console.info(new Date().toISOString(), req.method, req.url, res.status);
    req.respond(res);
  };

  get = (pattern: string, handler: RouteHandler) =>
    this.router.get(pattern, handler);
  head = (pattern: string, handler: RouteHandler) =>
    this.router.head(pattern, handler);
  put = (pattern: string, handler: RouteHandler) =>
    this.router.put(pattern, handler);
  patch = (pattern: string, handler: RouteHandler) =>
    this.router.patch(pattern, handler);
  delete = (pattern: string, handler: RouteHandler) =>
    this.router.delete(pattern, handler);
  options = (pattern: string, handler: RouteHandler) =>
    this.router.options(pattern, handler);
}

export const server = (
  settings: Settings = defaultSettings,
  router: Router = new Router(),
): Server => {
  return new Server(settings, router);
};
