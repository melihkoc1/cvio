import type { CVData, GeneratedContent } from '../../types';
import { ModernTemplate } from './ModernTemplate';
import { ClassicTemplate } from './ClassicTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';

interface Props {
  data: CVData;
  content: GeneratedContent;
  template?: string;
  watermark?: boolean;
}

export function CVRenderer({ data, content, template, watermark = false }: Props) {
  const t = template || data.preferences.template;
  switch (t) {
    case 'classic':      return <ClassicTemplate      data={data} content={content} watermark={watermark} />;
    case 'professional': return <ProfessionalTemplate data={data} content={content} watermark={watermark} />;
    default:             return <ModernTemplate       data={data} content={content} watermark={watermark} />;
  }
}
