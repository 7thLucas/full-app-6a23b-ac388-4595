/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "App Tagline",
      maxLength: 120,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "dashboardGreeting",
      type: "string",
      required: false,
      label: "Dashboard Greeting Text",
      maxLength: 100,
    },
    {
      fieldName: "motivationalQuotes",
      type: "array",
      required: false,
      label: "Motivational Quotes (Word of the Day)",
      item: {
        type: "object",
        fields: [
          { fieldName: "quote", type: "string", required: true, label: "Quote" },
          { fieldName: "author", type: "string", required: false, label: "Author / Source" },
        ],
      },
    },
    {
      fieldName: "enableReminders",
      type: "boolean",
      required: false,
      label: "Enable Smart Class Reminders",
    },
    {
      fieldName: "reminderLeadTimes",
      type: "object",
      required: false,
      label: "Reminder Lead Times (minutes)",
      fields: [
        { fieldName: "first", type: "number", required: false, label: "First Reminder (minutes before)" },
        { fieldName: "second", type: "number", required: false, label: "Second Reminder (minutes before)" },
      ],
    },
    {
      fieldName: "studyTimerPresets",
      type: "array",
      required: false,
      label: "Study Timer Presets (minutes)",
      item: { type: "number", required: true },
    },
    {
      fieldName: "subjectColors",
      type: "array",
      required: false,
      label: "Subject Color Palette",
      item: { type: "color", required: true },
    },
  ],
};
