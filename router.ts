import {
  ServerRequest,
  Response,
} from "https://deno.land/std@0.50.0/http/server.ts";

const routeRegex = /:([A-z-_]+)/g;
const matchRegexPatternGroup = "(?<$1>[A-z0-9_-]+)";

export interface RouteHandler {
  (r: ServerRequest, args: any): Response;
}

export interface Route {
  method: string;
  pattern: string;
  handler: RouteHandler;
  args?: any;
  regex?: RegExp;
}

const mountRoute = (route: Route): Route => {
  const pattern = route.pattern.replace(routeRegex, matchRegexPatternGroup);
  route.regex = new RegExp(`^${pattern}`, "g");
  return route;
};

const matchRoute = (route: Route, url: string): Route | null => {
  if (!route.regex) return null;
  const regexp = new RegExp(route.regex.source);
  if (regexp.test(url)) {
    route.args = regexp.exec(url)?.groups || {};
    return route;
  }
  return null;
};

export class Router {
  private routes: Map<string, Route[]> = new Map<string, Route[]>();

  dispatch = (req: ServerRequest): Route | undefined => {
    const routes = this.routes.get(req.method);
    if (routes) {
      return routes.find((r) => matchRoute(r, req.url));
    }
  };

  add = (r: Route) => {
    if (!this.routes.has(r.method)) {
      this.routes.set(r.method, []);
    }
    this.routes.get(r.method)?.push(mountRoute(r));
    return this;
  };

  get = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "GET",
      pattern,
      handler,
    });
  };

  head = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "HEAD",
      pattern,
      handler,
    });
  };

  post = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "POST",
      pattern,
      handler,
    });
  };

  put = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "PUT",
      pattern,
      handler,
    });
  };

  patch = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "PATCH",
      pattern,
      handler,
    });
  };

  delete = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "DELETE",
      pattern,
      handler,
    });
  };

  options = (pattern: string, handler: RouteHandler) => {
    return this.add({
      method: "OPTIONS",
      pattern,
      handler,
    });
  };
}

export const router = () => {
  return new Router();
};
