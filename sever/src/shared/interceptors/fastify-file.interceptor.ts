import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import FastifyMulter from 'fastify-multer';
import { StorageEngine } from 'fastify-multer/lib/interfaces';
import { type Multer, type Options } from 'multer';
import { Observable } from 'rxjs';

export function FastifyFileInterceptor(
  fieldName: string,
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  localOptions: Omit<Options, 'storage'> & {
    storage: StorageEngine;
  },
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: Multer;

    constructor(
      @Optional()
      @Inject('MULTER_MODULE_OPTIONS')
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) => {
        const requestHandler = this.multer.single(fieldName);
        requestHandler(ctx.getRequest(), ctx.getResponse(), (err: any) => {
          if (err) {
            if (err instanceof Error) {
              return reject(err);
            } else {
              return reject(new Error(err?.message || String(err)));
            }
          }
          resolve();
        });
      });

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
