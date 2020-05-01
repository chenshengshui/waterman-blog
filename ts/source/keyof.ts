function transformData<T extends string, K extends string, P>(
  arr: { [key in T]: P }[],
  keyMap: Partial<{ [key in T]: K }>
): { [key in K]: P }[] {
  return arr.map((obj) => {
    let temp = {} as { [key in K]: P };
    for (let key in obj) {
      if (keyMap[key]) {
        temp[keyMap[key]] = obj[key];
      }
    }
    return temp;
  });
}

const data1 = [
  {
    a1: 'a',
    b1: 'b',
    c1: 'c'
  }
]

const A2 = transformData(data1, { a1: 'a2' ，});

// type Records<K extends keyof any, T> = {
//   [P in K]: T;
// };

// // function transformData<X extends string, Y extends string, T>(
// //   arr: Record<X, T>[],
// //   keyMap: Partial<Record<X, Y>>
// // ): Partial<Record<Y, T>>[] {
// //   return arr.map((obj) => {
// //     const temp: Partial<Record<Y, T>> = {};
// //     for (let key in obj) {
// //       if (keyMap[key]) {
// //         temp[keyMap[key]] = obj[key];
// //       }
// //     }
// //     return temp;
// //   });
// // }

type Partials<T extends {}> = {
  [key in keyof T]?: T[key];
};

interface UserInfo {
  name: string;
  age: number;
}

// type Parameters<T extends (...args: any) => any> = T extends (
//   ...args: infer P
// ) => any
//   ? P
//   : never;
type TArea = (width: number, height: number) => number;

type params = Parameters<TArea>;

type returnType = ReturnType<TArea>;

interface Cat {
  name: string;
  run: () => void;
}

class School {
  name: string;
  uid: string;

  constructor(name: string) {
    this.name = name;
  }
}
type constructorParams = ConstructorParameters<typeof School>;

function add(this: number, b: string) {
  return this + Number(b);
}

type returnNumber = ThisType<typeof add>;
