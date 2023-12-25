import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { academicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDb = async (payload: TAcademicSemester) => {
  //checking if the semester code is valid.

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid Semester Code");
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDb = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleAcademicSemesterFromDb = async (id: string) => {
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAcademicSemesterIntoDb = async (
  id: string,
  payload: Partial<TAcademicSemester>
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameCodeMapper[payload.name] !== payload.code
  ) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Invalid Semester Code, try again."
    );
  }

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDb,
  getAllAcademicSemestersFromDb,
  getSingleAcademicSemesterFromDb,
  updateAcademicSemesterIntoDb,
};
