import { Response } from "https://deno.land/std@0.50.0/http/server.ts";
import { Status } from "https://deno.land/std@0.50.0/http/http_status.ts";

export const text = (body: string, status: number = Status.OK): Response => {
  return {
    headers: new Headers(),
    status,
    body,
  };
};

export const json = (val: any, status: number = Status.OK): Response => {
  let res = text(JSON.stringify(val), status);
  res.headers?.set("Content-Type", "application/json");
  return res;
};
