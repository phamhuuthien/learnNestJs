import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... Method: ${req.method}, URL: ${req.url}`); 
    const startTime = Date.now();
    res.on('finish', () => {
      const endTime = Date.now(); 
      console.log(`Response... Status: ${res.statusCode}, Time: ${endTime - startTime}ms`);
    }); 
    next();
  }
}
