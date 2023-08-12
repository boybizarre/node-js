const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);
    });
  });
};

const writeFilePromise = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (err) => {
      if (err) reject('I could not write into that file');
      resolve('Success');
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const resultPromise1 = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const resultPromise2 = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const resultPromise3 = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([
      resultPromise1,
      resultPromise2,
      resultPromise3,
    ]);
    const imgs = all.map((res) => res.body.message);

    await writeFilePromise('dog-img.txt', imgs.join('\n'));
    console.log('Random dog image saved to file');
    
  } catch (err) {
    console.log(err);
    throw err;
  }

  return '2: Ready 🐶';
};

(async () => {
  try {
    console.log('1: Will get dog pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dog pics');
  } catch (err) {
    console.log('Error!!!');
  }
})();

// console.log('1: Will get dog pics');
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3: Done getting dog pics');
//   })
//   .catch((err) => {
//     console.log('ERROR!!!');
//   });

// promise chaining
// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body);
//     return writeFilePromise('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
