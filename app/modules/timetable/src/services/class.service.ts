import { ClassModel } from "../models/class.model";

export interface CreateClassDto {
  subjectName: string;
  day: string;
  startTime: string;
  endTime?: string;
  room?: string;
  location?: string;
  colorHex?: string;
  remindersEnabled?: boolean;
  notes?: string;
}

export interface UpdateClassDto extends Partial<CreateClassDto> {}

export class ClassService {
  async getAllClasses() {
    return ClassModel.find().sort({ day: 1, startTime: 1 }).lean().exec();
  }

  async getClassById(id: string) {
    return ClassModel.findById(id).lean().exec();
  }

  async createClass(data: CreateClassDto) {
    const entry = new ClassModel(data);
    return entry.save();
  }

  async updateClass(id: string, data: UpdateClassDto) {
    return ClassModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
  }

  async deleteClass(id: string) {
    return ClassModel.findByIdAndDelete(id).lean().exec();
  }

  async getClassesByDay(day: string) {
    return ClassModel.find({ day }).sort({ startTime: 1 }).lean().exec();
  }
}

export const classService = new ClassService();
