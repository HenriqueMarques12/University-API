import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TemplateService {
  private templateCache = new Map<string, string>();

  async render(templateName: string, data: Record<string, any>): Promise<string> {
    let template = this.templateCache.get(templateName);
    
    if (!template) {
      const templatePath = path.join(process.cwd(), 'src', 'views', `${templateName}.template.html`);
      
      try {
        template = await fs.promises.readFile(templatePath, 'utf8');
        this.templateCache.set(templateName, template);
      } catch (error) {
        console.error(`Erro ao carregar template ${templateName}:`, error);
        throw new Error(`Template "${templateName}" não encontrado: ${error.message}`);
      }
    }
    
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? data[key] : match;
    });
  }
}
