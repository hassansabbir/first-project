import { Student } from "./student.model";

const getAllStudentsFromDb = async () => {
  const result = await Student.find().populate("admissionSemester").populate({
    path: "academicDepartment",
    populate: "academicFaculty",
  });
  return result;
};
const getSingleStudentsFromDb = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate("admissionSemester")
    .populate({
      path: "academicDepartment",
      populate: "academicFaculty",
    });
  return result;
};

const deleteStudentsFromDb = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  deleteStudentsFromDb,
};
