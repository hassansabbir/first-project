/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string | undefined;
  lastName: string;
};

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  password: string;
  gender: "male" | "female" | "other";
  dateOfBirth?: Date | undefined;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string | undefined;
  isDeleted: boolean;
};

//for creating static

export interface StudentModel extends Model<TStudent> {
  isUserExist: (id: string) => Promise<TStudent | null>;
}

//for creating instance
// export type StudentMethods = {
//   isUserExist(id: string): Promise<TStudent | null>;
// };

// export type StudentModel = Model<
//   TStudent,
//   Record<string, never>,
//   StudentMethods
// >;
