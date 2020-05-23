# Deno Router

A simple router to build APIs with Deno, built on top of the Deno's standard HTTP library.

## Usage

Use `server()` to initialize and register routes and the 'response' module to generate the response.

```javascript
import { server } from "https://raw.githubusercontent.com/gustavofabiane/denorouter/master/server.ts"
import { json } from "https://raw.githubusercontent.com/gustavofabiane/denorouter/master/response.ts"

const app = server()
app.get("/hello/:name", (req, { name }) => json({
    hello: `${name}!`
}))

await app.listen()
```