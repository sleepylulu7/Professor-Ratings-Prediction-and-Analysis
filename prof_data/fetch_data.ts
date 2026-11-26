import { RateMyProfessor } from "rate-my-professor-api-ts";

let UNI_LIST = [
    "University of Toronto at Scarborough", 
    "University of Toronto at Missisauga",
    "University of Toronto - St. George Campus",
    "Toronto Metropolitan University",
    "York University",
    "McMaster University",
    "Western University",
    "University of Waterloo",
    "Carleton University",
    "Queen's University"
];

// accepts only 1 parameter
// which is the name of the college of interest
async function main() {
   const rmp_instance = new RateMyProfessor("University of Toronto at Scarborough");

    // let list_of_professors = await rmp_instance.get_professor_list();
    // // console.log(list_of_professors);
    // let list_of_professors_saved = await rmp_instance.get_professor_list_and_save("prof_list.json");
    let prof_list = []

    for (let uni in UNI_LIST){
        const rmp_instance = new RateMyProfessor("University of Toronto at Scarborough");
        prof_list.push(await rmp_instance.get_professor_list());
    }
    let prof_json = JSON.stringify(prof_list)
    console.log(prof_json);
    // console.log
    return prof_json;
    // rmp_instance.set_professor_name("Irene Huang");
    // console.log(await rmp_instance.get_professor_info());
};

main();

