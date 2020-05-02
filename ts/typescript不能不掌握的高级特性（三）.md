## 引言

在[上一篇](https://juejin.im/post/5ea7b861e51d454d8f3636b9)我重点讲述了 ts 的 keyof、in 以及 infer。本期将结合一道笔试题重点讲述 ts 的一些其他内置操作符 。

本期涉及的操作符如下：

- Partial<T>
- Required<T>
- Readonly<T>
- Pick<T,K extends keyof T>
- Record<K extends keyof any, T>
- Exclude<T,U>
- Extract<T,U>
- Omit<T, K extends keyof any>

首先还是先讲述一下 ts 中的这些高级操作符，如果都已经掌握了，可以直接跳到末尾的手撕笔试题。[手撕笔试题](#手撕笔试题)

## Partial<T>

Partial 将属性变为可选属性。举个栗子，iUser 这个接口 name 和 age 是必须的，但是同时又有另一个接口 iOptionUser,接口属性完全一样，只是里面的 name 和 age 是可选的。比较笨的方法当然是手动再写一个。

```typescript
interface iUser {
  name: string;
  age: number;
}
interface iOptionUser {
  name?: string;
  age?: number;
}
```

其实，我们可以看到的是，iOptionUser 只是在属性后添加一个?接口。我们可以简单实现如下（<font color="red">该方法已内置</font>）

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

![](https://user-gold-cdn.xitu.io/2020/5/2/171d2b958a160237?w=1380&h=634&f=png&s=88197)

## Required<T>

Required 和 Partial 方法正好相反，是将属性变成必须。方法同样非常简单，可以这样实现（<font color="red">该方法已内置</font>）

```typescript
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

效果如下：

![](https://user-gold-cdn.xitu.io/2020/5/2/171d2bcf97ace964?w=1152&h=680&f=png&s=85386)

### Readonly<T>

Readonly 是将属性变成只读。方法同样非常简单，可以这样实现（<font color="red">该方法已内置</font>）

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

效果如下：

![](https://user-gold-cdn.xitu.io/2020/5/2/171d2c313fee52ab?w=1230&h=656&f=png&s=106621)

### Pick<T,K extends keyof T>

Pick 顾名思义，就是把一些属性挑选出来。效果如下：

![](https://user-gold-cdn.xitu.io/2020/5/2/171d2c8e42fb9eaf?w=1450&h=726&f=png&s=105096)

大家可以思考一下怎么实现，官方源码如下：

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### Record<K extends keyof any, T>

Record 用于创建一个具有同类型属性值的对象。

```typescript
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

### Exclude<T,U>

从类型 T 中剔除所有可以赋值给 U 的属性，然后构造一个类型。<font color="red">主要用于联合类型</font>。

![](https://user-gold-cdn.xitu.io/2020/5/2/171d31556501782c?w=1256&h=296&f=png&s=41408)

官方源码如下：

```typescript
type Exclude<T, U> = T extends U ? never : T;
```

### Extract<T,U>

功能与 Exclude 相反

![](https://user-gold-cdn.xitu.io/2020/5/2/171d331948e0d8c8?w=1292&h=260&f=png&s=38227)

```typescript
type Extract<T, U> = T extends U ? T : never;
```

### Omit<T, K extends keyof any>

主要用于剔除 interface 中的部分属性。
比如接口 iUser 包含 name、age、firstName、lastName、location 属性，而接口 iUser2 不包含 location 属性，我们可以使用前面提到的 Pick 实现，但这样会比较复杂，所以有了 Omit 操作符。

```
interface iUser {
    name: string;
    age: number;
    firstName: string;
    lastName: string;
    location: string;
}
interface iUser2 {
    name: string;
    age: number;
    firstName: string;
    lastName: string;
}
```

效果如下：
![](https://user-gold-cdn.xitu.io/2020/5/2/171d337eaae2f6fd?w=1332&h=966&f=png&s=137481)

Omit 源码如下：

```typescript
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

## 手撕笔试题

<a id="手撕笔试题"></a>

这是一道 leetcode 的 [ts 笔试题](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)，原题目略长，就不直接贴出来了，这里简化一下：

```
// 假设有一个这样的类型：
interface initInterface {
  count: number;
  message: string;
  asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>;
  syncMethod<T, U>(action: Action<T>): Action<U>;
}
// 在经过 Connect 函数之后，返回值类型为

type Result {
  asyncMethod<T, U>(input: T): Action<U>;
  syncMethod<T, U>(action: T): Action<U>;
}
// 其中 Action<T> 的定义为：
interface Action<T> {
  payload?: T
  type: string
}
// 现在要求写出Connect的函数类型定义。

```

首先我们需要明白这个题义，这里是需要我们把 initInterface 里的非函数属性去除，并且函数签名发生了变化。

1. 第一步：获取函数属性

```typescript
type RemoveNonFunctionProps<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProps = RemoveNonFunctionProps<initInterface>;
```

![](https://user-gold-cdn.xitu.io/2020/5/2/171d351d4e9b9c4d?w=1594&h=518&f=png&s=106780)

2. 将只包含函数属性的类型 Pick 出来

```typescript
type PickFunction<T> = Pick<T, RemoveNonFunctionProps<T>>;
type iFunctionInterface = PickFunction<initInterface>;
```

![](https://user-gold-cdn.xitu.io/2020/5/2/171d35be29c922d1?w=2080&h=614&f=jpeg&s=134426) 3.接下来就是函数转换的过程，这里需要用到我[上篇博文](https://juejin.im/post/5ea7b861e51d454d8f3636b9)提到的 infer。

我们对比一下，转换前后的函数签名,发现只是去除了参数和返回结果的 Promsie。

```
type asyncMethod<T, U> = (input: Promise<T>) => Promise<Action<U>>;
type transformAsyncMethod<T,U> = (input: T) => Action<U>;
```

我们使用 infer 可以这样做

```typescript
type TransformASyncMethod<T> = T extends (
  input: Promise<infer U>
) => Promise<Action<infer S>>
  ? (input: U) => Action<S>
  : never;
```

![](https://user-gold-cdn.xitu.io/2020/5/2/171d3741e44eedd7?w=2050&h=536&f=png&s=146632)

同理我们看一下方法二，转换前后：

```
type syncMethod<T, U> = (action: Action<T>) => Action<U>;
type transformSyncMethod<T, U> = (action: T) => Action<U>;
```

我们依旧使用 infer

```typescript
type TransformSyncMethod<T> = T extends (
  action: Action<infer U>
) => Action<infer S>
  ? (action: U) => Action<S>
  : never;
```

![](https://user-gold-cdn.xitu.io/2020/5/2/171d376668b16f01?w=2050&h=536&f=png&s=146632)

所以转换函数可以这样写：

```
type TransformMethod<T> = T extends (
  input: Promise<infer U>
) => Promise<Action<infer S>>
  ? (input: U) => Action<S>
  : T extends (action: Action<infer U>) => Action<infer S>
  ? (action: U) => Action<S>
  : never;
```

4.整合
前三步，我们已经有了完整的思路，现在就是把 Connect 类型定义整合起来。

```typescript
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
```

本次就到这里了，下面是我个人的微信公众号。

![](https://user-gold-cdn.xitu.io/2020/5/2/171d39009e33cac4?w=344&h=344&f=jpeg&s=9132)

> @Author: WaterMan
