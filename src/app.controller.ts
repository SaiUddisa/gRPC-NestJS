import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/hi")
  getHello(): string {
    return this.appService.getHello();
  }
  @Get()
  async sendHomeHtml(@Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'public', 'index.html'); 
    
        
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading the file');
      }
      res.header('Content-Type', 'text/html');
      res.send(data);
    });
  }
}
