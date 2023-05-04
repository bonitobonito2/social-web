const mod = (a, b) => {
  return new Promise((resolve, reject) => {
    if (b == 0) {
      // Rejected (error)
      reject("Modulo zero is not allowed");
    } else {
      // Resolved (Success)
      resolve(a % b);
    }
  });
};

// 5 mod 2 will give result 1
async function _5mod2() {
  try {
    const res = await mod(5, 2);
    console.log(`The result of division is ${res}`);
  } catch (err) {
    console.log(err);
  }
}
_5mod2();

// 5 mod 0 will give error
async function _5mod0() {
  try {
    const res = await mod(5, 0);
    console.log(`The result of division is ${res}`);
  } catch (err) {
    console.log(err);
  }
}
_5mod0();
