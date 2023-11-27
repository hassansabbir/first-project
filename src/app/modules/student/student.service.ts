import { Student } from "../student.model";
import { TStudent } from "./student.interface";

const createStudentIntoDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(studentData);

  const student = new Student(studentData); //create an instance

  if (await student.isUserExist(studentData.id)) {
    throw new Error("User already exists!");
  }

  const result = await student.save(); //build in instance method
  return result;
};

const getAllStudentsFromDb = async () => {
  const result = await Student.find();
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
};
