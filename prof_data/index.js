import { RateMyProfessor } from "rate-my-professor-api-ts";
import { mode, average } from "./util.js";
import * as fs from "fs";

const numeric_grades = {
    "A+": 95, "A": 87, "A-": 83,
    "B+": 78, "B": 74.5, "B-": 71,
    "C+": 68, "C": 64.5, "C-": 61,
    "D+": 58, "D": 54.5, "D-": 51
}

const years = {"A": 1, "B": 2, "C": 3, "D": 4}

function get_gender(ratings) {
    const comments = ratings.map(rating => rating.comment)
    let male = comments.filter(comment => ([" he ", " him ", " his "].some(pronoun => comment.includes(pronoun)))).length;
    let female = comments.filter(comment => ([" she ", " her "].some(pronoun => comment.includes(pronoun)))).length;
    if (male > female) return "M";
    if (male < female) return "F";
    return "unknown";
}

function get_year(ratings) {
    const classes = ratings.map(rating => rating.class);

    var total = 0;
    var divisor = 0;
    for (const c of classes) {
        if (c.length == 6) {
            // Handle corse codes like CSCC11
            if (c[3] in years) {
                total += years[c[3]];
            }
            // Handle corse codes like CSC311
            else {
                try {
                    total += +(c[3])
                }
                catch {
                    continue;
                }
            }
            divisor += 1;
        }
    }
    if (divisor === 0) return "unknown";
    return total / divisor;
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
        gender: get_gender(ratings),
        year: get_year(ratings),

        // Important Features
        avg_grade: average(ratings.map(rating => numeric_grades[rating.student_grade]).filter(val => val)),
        attendance_required: mode(ratings.map(rating => rating.attendance_status)) == "mandatory" ? 1 : 0,
        textbook_required: mode(ratings.map(rating => rating.textbook_use > 0)) ? 1 : 0,
        online: mode(ratings.map(rating => rating.is_online)) ? 1 : 0,
        difficulty: average(ratings.map(rating => rating.difficulty_rating)),
        clarity: average(ratings.map(rating => rating.clarity_rating)),
        group_projects: has_tag(ratings, "Group projects"),
        pop_quizzes: has_tag(ratings, "Beware of pop quizzes"),
        homework_heavy: has_tag(ratings, "Lots of homework"),
        lecture_heavy: has_tag(ratings, "Lecture heavy"),
        test_heavy: has_tag(ratings, "Test heavy"),
        accessible: has_tag(ratings, "Accessible outside class"),
        gives_feedback: has_tag(ratings, "Gives good feedback"),

        // Target Variables
        avg_rating: prof_info.avgRating,
        avg_wta: prof_info.wouldTakeAgainPercent
    }
};

async function map_features() {

};


// accepts only 1 parameter
// which is the name of the college of interest
(async function main() {
    const rmp_instance = new RateMyProfessor("University of Toronto at Scarborough");
    let list_of_professors = await rmp_instance.get_professor_list();

    //let list_of_professors_saved = await rmp_instance.get_professor_list_and_save("prof_list.json");

    //console.log(list_of_professors_saved)

    const list_of_ratings = {};
    for (const prof of list_of_professors) {
        list_of_ratings[prof.name] = await collect_features(rmp_instance, prof.name);
    }

    // list_of_ratings["Irene Huang"] = await collect_features(rmp_instance, "Irene Huang")

    // console.log(list_of_ratings)

    fs.writeFile("ratings_by_prof.json", JSON.stringify(list_of_ratings), (err) => {
        if (err) {
            console.error(`Error with saving data : ${err}`);
        }
        console.log("File created and saved data successfully!");
    });

    

    
    //rmp_instance.set_professor_name("Irene Huang");
    //console.log(await rmp_instance.get_comments_by_professor());

    //await rmp_instance.get_comments_by_professor_and_save("ratings_list.json");
})();
