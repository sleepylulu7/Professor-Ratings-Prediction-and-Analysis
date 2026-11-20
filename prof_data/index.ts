import { RateMyProfessor } from "rate-my-professor-api-ts";

// accepts only 1 parameter
// which is the name of the college of interest
(async function main() {
   const rmp_instance = new RateMyProfessor("University of Toronto at Scarborough");

   // one asynchronous method helps retrieve information reagrding college

   // method takes in a boolean
   // if boolean is set to true, similar matching named college info will be returned
   // if boolean is set to false, only, the specific college will be returned
   //
//    let college_info = await rmp_instance.get_college_info(false);
//    let college_info_all = await rmp_instance.get_college_info(true);

    // let list_of_professors = await rmp_instance.get_professor_list();
    // // console.log(list_of_professors);
    // let list_of_professors_saved = await rmp_instance.get_professor_list_and_save("prof_list.json");

    rmp_instance.set_professor_name("Irene Huang");
    console.log(await rmp_instance.get_professor_info());
   
    // uncomment the lines below to see the response
   // JSON.stringify(serializableData, null, 2);
    // console.log(college_info_all);

    // const fs = require('fs');

    // Convert the Map into a plain object so JSON.stringify doesn't empty it
    // const serializableData = {
    //     college_info,
    //     college_info_all,
    // department_map: Object.fromEntries(college_info_all.department_map)
    // };

    // console.log(JSON.stringify(serializableData, null, 2));
})();

