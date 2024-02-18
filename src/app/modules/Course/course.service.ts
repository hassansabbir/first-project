import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course } from "./course.model";

const createCourseIntoDb = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourseFromDb = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDb = async (id: string) => {
  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course"
  );
  return result;
};

const deleteCourseFromDb = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    }
  );
  return result;
};
const updateCourseIntoDb = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;

  const updatedBasicCourseInfo = await Course.findByIdAndUpdate(
    id,
    courseRemainingData,
    {
      new: true,
      runValidators: true,
    }
  );

  //check if there is any pre requisite courses to update

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    //filter out the deleted fields
    const allDeletedPreRequisites = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);

    const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $pull: {
        preRequisiteCourses: { course: { $in: allDeletedPreRequisites } },
      },
    });

    //filter out the new fields

    const newPreRequisites = preRequisiteCourses?.filter(
      (el) => el.course && !el.isDeleted
    );

    const newPreRequisiteCourses = await Course.findByIdAndUpdate(id, {
      $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
    });
  }

  const result = await Course.findById(id).populate(
    "preRequisiteCourses.course"
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDb,
  getAllCourseFromDb,
  getSingleCourseFromDb,
  deleteCourseFromDb,
  updateCourseIntoDb,
};
