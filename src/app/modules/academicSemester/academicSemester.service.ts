import { TAcademicSemesterCode } from "./academicSemester.interface";
import { academicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDb = async (payload: TAcademicSemesterCode) => {
  const result = await academicSemester.create(payload);
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDb,
};
