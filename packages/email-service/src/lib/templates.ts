import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';



export function compileEmailTemplate(fileName: string, context: Record<string, any> = {}): Promise<string> {
    try {
        const templateDir = path.join(__dirname, '../templates');
        const templatePath = path.join(templateDir, `${fileName}.mjml`);

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        const mjmlContent = fs.readFileSync(templatePath, 'utf-8');

        const template = Handlebars.compile(mjmlContent);
        const compiledMjml = template(context);

        const { html } = mjml2html(compiledMjml, {
            validationLevel: 'soft'
        });
        return html;

    }
    catch (error) {
        console.error('Error compiling template:', error);
        throw error;
    }
}

