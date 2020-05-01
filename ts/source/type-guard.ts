interface Bird {
  fly();
  layEggs();
}

interface Fish {
  swim();
  layEggs();
}

let a: Fish | Bird;

function isFish(pet: Fish | Bird): pet is Fish {
  return (<Fish>pet).swim !== undefined;
}
