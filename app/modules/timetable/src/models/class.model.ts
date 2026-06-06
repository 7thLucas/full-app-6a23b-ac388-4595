import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@modelOptions({
  schemaOptions: {
    collection: "tbl_classes",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
})
export class ClassEntry extends TimeStamps {
  @prop({ type: String, required: true })
  subjectName!: string;

  @prop({ type: String, required: true, enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] })
  day!: string;

  @prop({ type: String, required: true })
  startTime!: string; // HH:MM format

  @prop({ type: String, required: false })
  endTime?: string; // HH:MM format

  @prop({ type: String, required: false })
  room?: string;

  @prop({ type: String, required: false })
  location?: string;

  @prop({ type: String, required: false })
  colorHex?: string;

  @prop({ type: Boolean, required: false, default: true })
  remindersEnabled?: boolean;

  @prop({ type: String, required: false })
  notes?: string;
}

export const ClassModel = getModelForClass(ClassEntry);
