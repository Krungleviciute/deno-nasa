//@ts-nocheck
import { Application, send, log } from "./deps.ts";
import api from "./api.ts";

const app = new Application();

const PORT = 8000;

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

app.addEventListener("error", (event) => {
  log.error(event.error);
});

//error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = "Internal Server Error";
    throw err;
  }
});

//ctx => context of the current application
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  log.info(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

app.use(async (ctx, next) => {
  const start = Date.now(); //number in miliseconds
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

app.use(api.routes());
app.use(api.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  console.log(filePath)
  const fileWhitelist = [
    "/index.html",
    "/javascripts/script.js",
    "/images/favicon.png",
    "/stylesheets/style.css",
    "/videos/space.mp4",
  ];
  if (fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, { root: `${Deno.cwd()}/public` });
  }
});

//to check wether our module is being executed as a program
if (import.meta.main) {
  log.info(`Starting server in port ${PORT}...`);
  await app.listen({
    port: PORT,
  });
}
