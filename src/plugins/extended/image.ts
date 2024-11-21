import type { Plugin } from '@pdfme/common';
import { image as component } from '@pdfme/schemas';
import type { ExtendedSchema } from './schemaUtils';
import { createPDFRender, createUIRender, extendSchema } from './schemaUtils';

const extendedImage = (
  fieldKeyOptions: { label: string; options: { label: string; value: string }[] }[],
  fieldFormatOptions: { label: string; value: string }[]
) => {
  const defaultSchema: ExtendedSchema = {
    ...component.propPanel.defaultSchema,
    type: 'extendedImage',
  };

  const schemaFunction = extendSchema(component.propPanel.schema, fieldKeyOptions, fieldFormatOptions);

  const propPanel = {
    defaultSchema,
    schema: schemaFunction,
    widgets: component.propPanel.widgets,
  };

  const extendedSchema: Plugin<ExtendedSchema> = {
    pdf: createPDFRender(component),
    ui: createUIRender(component),
    propPanel,
    icon: component.icon,
  };

  return extendedSchema;
};

export { extendedImage };
