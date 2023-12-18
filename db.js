let db;
let openRequest = indexedDB.open("mydatabase", 2);
openRequest.addEventListener("success", () => {
  console.log("db successfully opened");
  db = openRequest.result;
});
openRequest.addEventListener("error", (error) => {
  console.log("db contains error");
  // console.log(error);
});
openRequest.addEventListener("upgradeneeded", () => {
  console.log("db upgradeneeded");
  db = openRequest.result;
  // key path jayega apki object store pe jo data hai
  db.createObjectStore("videos", { keyPath: "id" });
  db.createObjectStore("image", { keyPath: "id" });
});

// the very first time you open your db ,your version was 1 so,it need to be upgraded
// 1->open a database
// 2->object creation{
//     1->sql->tables
//     2->mongodb->collection
//     3->indexeDB->object
// }
// 3->make transaction{transaction-->all_success or all_fail}
