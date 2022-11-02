const fs = require("fs");
const superAgent = require("superagent");

//using superagent to get random dogs images through api

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superAgent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message);
      console.log(res.body.message);

      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("random image created as save successfully");
      });
    });

  // using promise then method
  superAgent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .then((res) => {
      console.log(res.body.message);
      fs.writeFile("dog-img.txt", res.body.message, (err) => {
        if (err) return console.log(err.message);
        console.log("random image created as save successfully");
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
});

// using async and await
// const createNewDog = async () => {
//   try {
//     const file = fs.readFile(`${__dirname}/dog2.txt`);
//     const result = await file
//     console.log(result);

//     const res = await superAgent.get(
//       `https://dog.ceo/api/breed/${result}/images/random`
//     );
//     console.log(res.body.message);

//     const create = await writeFilePro("create-dog.txt", res.body.message);
//     console.log("new dog created successfully");
//   } catch (err) {
//     console.log(err.message  );
//   }
// };

// createNewDog();
