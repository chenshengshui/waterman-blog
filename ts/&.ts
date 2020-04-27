interface iName {
  firstName: string;
  lastName: string;
}

interface iBaseInfo {
  sex: 'male' | 'female';
  age: number;
}

type iUserInfo = iName & iBaseInfo;
const user: iUserInfo = {
  firstName: 'Jack',
  lastName: 'Ma',
  sex: 'male',
  age: 40,
};

type AllType = 'a' | 'b' | 'c';
function handleValue(val: AllType) {
  switch (val) {
    case 'a':
      // val 在这里是 'a'
      break;
    case 'b':
      // val 在这里是 'b'
      break;
    default:
      // val 在这里是 never
      const exhaustiveCheck: never = val;
      break;
  }
}
