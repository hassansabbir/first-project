import { Schema, model } from "mongoose";
import validator from "validator";
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentModel,
  TUserName,
} from "./student.interface";

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    maxlength: [20, "Name must be in 20 characters"],
    trim: true,
    required: [true, "First name is required. Please enter a first name"],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: "{VALUE} is not in capitalized format ",
    },
  },
  middleName: { type: String },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Last name is required. Please enter a last name"],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not valid",
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, "fathers name is required. Please enter fathers name"],
  },
  fatherOccupation: {
    type: String,
    required: [
      true,
      "fatherOccupation is required. Please enter fatherOccupation",
    ],
  },
  fatherContactNo: {
    type: String,
    required: [
      true,
      "fatherContactNo is required. Please enter fatherContactNo",
    ],
  },
  motherName: {
    type: String,
    required: [true, "motherName is required. Please enter motherName"],
  },
  motherOccupation: {
    type: String,
    required: [
      true,
      "motherOccupation is required. Please enter motherOccupation",
    ],
  },
  motherContactNo: {
    type: String,
    required: [
      true,
      "motherOccupation is required. Please enter motherOccupation",
    ],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, "name is required. Please enter name"],
  },
  occupation: {
    type: String,
    required: [true, "occupation is required. Please enter occupation"],
  },
  contactNo: {
    type: String,
    required: [true, "contactNo is required. Please enter contactNo"],
  },
  address: {
    type: String,
    required: [true, "address is required. Please enter address"],
  },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: true, unique: true },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User Id is required."],
      unique: true,
      ref: "User",
    },
    name: {
      type: userNameSchema,
      required: [true, "name is required. Please enter name"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message:
          "{VALUE} is not valid. The gender can only be one of the following: 'male', 'female', 'other'",
      },
      required: [true, "is required. Please enter"],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, "email is required. Please enter email"],
      unique: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "{VALUE} is not a valid email address",
      },
    },
    contactNo: {
      type: String,
      required: [true, "contactNo is required. Please enter contactNo"],
    },
    emergencyContactNo: {
      type: String,
      required: [
        true,
        "emergencyContactNo is required. Please enter emergencyContactNo",
      ],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    presentAddress: {
      type: String,
      required: [
        true,
        "presentAddress is required. Please enter presentAddress",
      ],
    },
    permanentAddress: {
      type: String,
      required: [
        true,
        "permanentAddress is required. Please enter permanentAddress",
      ],
    },
    guardian: {
      type: guardianSchema,
      required: [true, "guardian is required. Please enter guardian"],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, "localGuardian is required. Please enter localGuardian"],
    },
    profileImg: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: "AcademicSemester",
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: "AcademicDepartment",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

//virtual
studentSchema.virtual("fullName").get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

//query middleware

studentSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//creating a custom static method

studentSchema.statics.isUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
