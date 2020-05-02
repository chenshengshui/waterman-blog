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

function transformData2<X extends string, Y extends string, T>(
  arr: Record<X, T>[],
  keyMap: Partial<Record<X, Y>>
): Partial<Record<Y, T>>[] {
  return arr.map((obj) => {
    const temp: Partial<Record<Y, T>> = {};
    for (let key in obj) {
      if (keyMap[key]) {
        temp[keyMap[key]] = obj[key];
      }
    }
    return temp;
  });
}
