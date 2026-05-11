import CourseHighlight from "../models/CourseHighlights.js";

//GET COURSES (POPULAR OR ALL)
export const getCourseHighlights = async(req, res) => {
    try {
        const { all } = req.query;

        let filter = {};

        if (!all) {
            filter.isPopular = true;
        }

        const courses = await CourseHighlight.find(filter)
            .select(
                "title slug description duration isPopular iconName colorGradient bgImage subtitle stats features technologies syllabus careerOpportunities prerequisites"
            )
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: courses,
        });
    } catch (error) {
        console.error("getCourseHighlights Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//GET SINGLE COURSE BY SLUG
export const getCourseBySlug = async(req, res) => {
    try {
        const course = await CourseHighlight.findOne({
            slug: req.params.slug,
        }).lean();

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: course,
        });
    } catch (error) {
        console.error("getCourseBySlug Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//  UPSERT COURSE (CREATE / UPDATE) FULL FIX
export const upsertCourseHighlight = async(req, res) => {
    try {
        const {
            title,
            slug,
            description,
            iconName,
            colorGradient,
            duration,
            isPopular,

            // IMPORTANT (ALL EXTRA FIELDS)
            bgImage,
            subtitle,
            stats,
            features,
            technologies,
            syllabus,
            careerOpportunities,
            prerequisites,
        } = req.body;

        if (!title || !slug || !description || !iconName || !colorGradient) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing",
            });
        }

        const existing = await CourseHighlight.findOne({ slug });

        const duplicateTitle = await CourseHighlight.findOne({
            title,
            slug: { $ne: slug },
        });

        if (duplicateTitle) {
            return res.status(400).json({
                success: false,
                message: "Title already exists",
            });
        }

        let savedCourse;

        if (existing) {
            //  UPDATE ALL FIELDS
            savedCourse = await CourseHighlight.findOneAndUpdate({ slug }, {
                title,
                slug,
                description,
                iconName,
                colorGradient,
                duration,
                isPopular,

                bgImage,
                subtitle,
                stats,
                features,
                technologies,
                syllabus,
                careerOpportunities,
                prerequisites,
            }, { new: true, runValidators: true });
        } else {
            //  CREATE WITH FULL DATA
            savedCourse = await CourseHighlight.create({
                title,
                slug,
                description,
                iconName,
                colorGradient,
                duration,
                isPopular,

                bgImage,
                subtitle,
                stats,
                features,
                technologies,
                syllabus,
                careerOpportunities,
                prerequisites,
            });
        }

        return res.status(200).json({
            success: true,
            message: existing ? "Course updated" : "Course created",
            data: savedCourse,
        });
    } catch (error) {
        console.error("upsertCourseHighlight Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//UPDATE COURSE
export const updateCourseHighlight = async(req, res) => {
    try {
        const updatedCourse =
            await CourseHighlight.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    new: true,
                    runValidators: true,
                }
            );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};



//DELETE COURSE
export const deleteCourseHighlight = async(req, res) => {
    try {
        const deleted = await CourseHighlight.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Deleted successfully",
        });
    } catch (error) {
        console.error("deleteCourseHighlight Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};