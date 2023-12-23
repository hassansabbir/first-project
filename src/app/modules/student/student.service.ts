import mongoose from "mongoose";
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import httpStatus from "http-status";
import { TStudent } from "./student.interface";

const getAllStudentsFromDb = async (query: Record<string, unknown>) => {
  console.log("base query", query);
  const queryObj = { ...query };

  let searchTerm = "";

  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: ["email", "name.firstName", "presentAddress"].map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  //filtering
  const excludeFields = ["searchTerm"];

  excludeFields.forEach((el) => delete queryObj[el]);

  const result = await searchQuery
    .find(queryObj)
    .populate("admissionSemester")
    .populate({
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

const updateStudentIntoDb = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteStudentsFromDb = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to delete student");
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const StudentServices = {
  getAllStudentsFromDb,
  getSingleStudentsFromDb,
  updateStudentIntoDb,
  deleteStudentsFromDb,
};
