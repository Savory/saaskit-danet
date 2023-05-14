import { HttpContext, Logger, NextFunction } from 'danet/mod.ts';

const logger = new Logger('Logger');

export const loggerMiddleware = async (
  ctx: HttpContext,
  next: NextFunction,
) => {
  logger.log(`${ctx.request.method} - ${ctx.request.url.pathname}`);
  await next();
};
