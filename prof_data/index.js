import { RateMyProfessor } from "rate-my-professor-api-ts";
// accepts only 1 parameter
// which is the name of the college of interest
(async function main() {
    const rmp_instance = new RateMyProfessor("University of Toronto at Scarborough");
    // let list_of_professors = await rmp_instance.get_professor_list();
    // // console.log(list_of_professors);
    let list_of_professors_saved = await rmp_instance.get_professor_list_and_save("prof_list.json");
    // rmp_instance.set_professor_name("Irene Huang");
    // console.log(await rmp_instance.get_professor_info());
})();
