import { RateMyProfessor } from "rate-my-professor-api-ts";
import { mode, average } from "./util.js";
import * as fs from "fs";

const numeric_grades = {
    "A+": 95, "A": 87, "A-": 83,
    "B+": 78, "B": 74.5, "B-": 71,
    "C+": 68, "C": 64.5, "C-": 61,
    "D+": 58, "D": 54.5, "D-": 51
}

const YEARS = {
    "A": 1, "B": 2, "C": 3, "D": 4,
    "1": 1, "2": 2, "3": 3, "4": 4
}

function get_gender(ratings) {
    const comments = ratings.map(rating => rating.comment)
    let male = comments.filter(comment => ([" he ", " him ", " his "].some(pronoun => comment.includes(pronoun)))).length;
    let female = comments.filter(comment => ([" she ", " her "].some(pronoun => comment.includes(pronoun)))).length;
    if (male > female) return "M";
    if (male < female) return "F";
}

/* Convert a course code to the course level (year) */
function code_to_year(course_code) {
    var match = course_code.match(/[A-Za-z]{2,6}[\s\+-]*([A-D1-7])\d{2,3}/);
    if (match != null) {
        return YEARS[match[1]];
    }

}

function get_year(ratings) {
    const classes = ratings.map(rating => rating.class);

    var max = null;
    const counts = {};
    for (const course_code of classes) {
        var year = code_to_year(course_code);
        if (year == null) continue;
        counts[year] = (counts[year] ?? 0) + 1;
        if (counts[year] > (counts[max] ?? 0)) max = year;
    }
    return max;
}

function has_tag(ratings, tag) {
    return ratings.some(rating => rating.rating_tags.includes(tag))
}

async function collect_features(rmp_instance, prof_name) {
    rmp_instance.set_professor_name(prof_name);
    
    const prof_info = await rmp_instance.get_professor_info()
    const ratings = await rmp_instance.get_comments_by_professor();

    return {
        // Fixed Features
        department: prof_info.department,
        college: prof_info.school.name,
        gender: get_gender(ratings) ?? "unknown",
        year: get_year(ratings) ?? "unknown",

        // Important Features
        avg_grade: average(ratings.map(rating => numeric_grades[rating.student_grade]).filter(val => val)),
        attendance_required: mode(ratings.map(rating => rating.attendance_status)) == "mandatory" ? 1 : 0,
        textbook_required: mode(ratings.map(rating => rating.textbook_use > 0)) ? 1 : 0,
        online: mode(ratings.map(rating => rating.is_online)) ? 1 : 0,
        difficulty: average(ratings.map(rating => rating.difficulty_rating)),
        //clarity: average(ratings.map(rating => rating.clarity_rating)),
        group_projects: has_tag(ratings, "Group projects"),
        pop_quizzes: has_tag(ratings, "Beware of pop quizzes"),
        homework_heavy: has_tag(ratings, "Lots of homework"),
        lecture_heavy: has_tag(ratings, "Lecture heavy"),
        test_heavy: has_tag(ratings, "Test heavy"),
        accessible: has_tag(ratings, "Accessible outside class"),
        gives_feedback: has_tag(ratings, "Gives good feedback"),

        // Data scaling parameters
        reviews: ratings.length,

        // Target Variables
        avg_rating: prof_info.avgRating ?? "unknown", // this value is required
        avg_wta: prof_info.wouldTakeAgainPercent ?? 70 // default to near average would take again percentage (68.7384)
    }
};

// Return true if the datapoint should be removed
function filter_datapoint(professor) {
    if (!(professor.reviews > 0)) return true;
    if (professor.avg_rating == "unknown") return true;
    return false;
}


async function get_ratings_at(rmp_instance, university, list_of_ratings, limit=10000) {
    rmp_instance.set_college(university)
    let list_of_professors = await rmp_instance.get_professor_list();

    for (const prof of list_of_professors) {
        if (--limit<0) break;
        const features = await collect_features(rmp_instance, prof.name);
        if (filter_datapoint(features)) continue;
        list_of_ratings[prof.name] = features
    }
}


(async function main() {

    // populate prof_data/prof_list.json
    // let list_of_professors_saved = await rmp_instance.get_professor_list_and_save("prof_list.json");
    // console.log(list_of_professors_saved)

    // consle.log(await collect_features(rmp_instance, "Irene Huang"))

    const rmp_instance = new RateMyProfessor();

    const list_of_ratings = {};
    await get_ratings_at(rmp_instance, "University of Toronto at Scarborough", list_of_ratings)
    // console.log(list_of_ratings)

    fs.writeFile("prof_data/ratings_by_prof.json", JSON.stringify(list_of_ratings), (err) => {
        if (err) {
            console.error(`Error with saving data : ${err}`);
        }
        console.log("File created and saved data successfully!");
    });
})();
