class User {
  name: string;
  address: string;
  age: number;
  constructor(name: string, address: string, age: number) {
    this.name = name;
    this.address = address;
    this.age = age;
  }
  public sayHello() {
    alert('hello from' + this.name);
  }
}
type userType = InstanceType<typeof User>;
type notNeverType = {
  [key in keyof userType]: userType[key] extends infer S ? S : never;
}[keyof userType];

type GetUnionPropertiesWithoutNeverOfT<
  T extends new (...args: any[]) => any
> = T extends new (...args: any[]) => infer U
  ? {
      [K in keyof U]: U[K] extends infer S ? S : never;
    }[keyof U]
  : never;
type TypeOfUserWithoutNever = GetUnionPropertiesWithoutNeverOfT<typeof User>;

type a = Partial<TypeOfUserWithoutNever>;

interface iOptionUser {
  name?: string;
  age?: number;
}

type iName = Pick<iOptionUser, 'age' | 'name'>;

interface iCat {
  name: string;
  age: number;
  color: string;
}

interface iAge {
  age: number;
}

type extractA = Extract<'a' | 'b' | 'c', 'a'>;

type A = Record<keyof iCat, string>;

type iAnimalCommonProps = Pick<iCat, 'name' | 'age'>;

interface iUser {
  name: string;
  age: number;
  firstName: string;
  lastName: string;
  location: string;
}

type Omit2<T, K extends keyof T> = {
  [key in K]: T[key];
};

interface initInterface<T, U> {
  count: number;
  message: string;
  asyncMethod(input: Promise<T>): Promise<Action<U>>;
  syncMethod(action: Action<T>): Action<U>;
}

interface Action<T> {
  payload?: T;
  type: string;
}

type RemoveNonFunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type PickFunction<T> = Pick<T, RemoveNonFunctionProps<T>>;
type TransformMethod<T> = T extends (
  input: Promise<infer U>
) => Promise<Action<infer S>>
  ? (input: U) => Action<S>
  : T extends (action: Action<infer U>) => Action<infer S>
  ? (action: U) => Action<S>
  : never;
type ConnectAll<T> = {
  [K in keyof T]: TransformMethod<T[K]>;
};
type Connect<T> = ConnectAll<PickFunction<T>>;

type connectedInterface = Connect<initInterface<string, number>>;
