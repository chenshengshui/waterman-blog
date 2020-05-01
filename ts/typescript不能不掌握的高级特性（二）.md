## 引言

在[上一篇](https://juejin.im/post/5ea6f044f265da7bf240e7ae)我重点讲述了 ts 的交叉类型，本期将结合实例重点讲述 ts 中的一些高级操作符。本篇文章略长，笔者之前的文章都略短，作为男人还是要好好学习，文章还是长点好。

本期涉及的操作符如下：

- keyof
- in
- infer 关键字
- Parameters
- ReturnType
- InstanceType
- ConstructorParameters
- ThisParameterType
- OmitThisParameter

本篇文章适合有一定基础的 ts 开发，如果你完全没有用过，请先到官网学习[官方文档](https://www.typescriptlang.org/docs/home.html)，
![](https://user-gold-cdn.xitu.io/2020/4/29/171c5eb8b8c9f3c7?w=300&h=184&f=png&s=45150)

通过上述操作符的学习，希望能达到以下效果：

- 不再为大佬写的 ts 定义而苦恼了
- 看源码定义不再吃力了
- 自己的 ts 代码更加智能，不再是满屏的 any 了。

下面我将结合具体实栗向大家讲述 ts 中的高级操作符。

## keyof

### 定义

<font color="red">keyof</font>与<font color="red">Object.keys</font>略有相似，只是 keyof 是取 interface 的键，而且 keyof 取到键后会保存为联合类型。

```typescript
interface iUserInfo {
  name: string;
  age: number;
}
type keys = keyof iUserInfo;
```

![](https://user-gold-cdn.xitu.io/2020/4/29/171c66845cb5de88?w=992&h=406&f=png&s=59503)

### keyof 的简单栗子

我们有这样一个需求，实现一个函数 getValue 取得对象的 value。在未接触 keyof 时，我们一般会这样写：

```typescript
function getValue(o: object, key: string) {
  return o[key];
}
const obj1 = { name: '张三', age: 18 };
const name = getValue(obj1, 'name');
```

但是，这样写就丧失了 ts 的优势：

- 无法确定返回值类型
- 无法对 key 进行约束，可能会犯拼写的错误

这时我们可以使用 keyof 来增强 getValue 函数的类型功能。

![](https://user-gold-cdn.xitu.io/2020/4/30/171c98ff68cd2fe9?w=2242&h=634&f=png&s=115136)
使用 keyof 后我们可以看到，可以完整的提示可以输入的值，当拼写错误时也会有清晰的提示。
![](https://user-gold-cdn.xitu.io/2020/4/30/171c991595999ba7?w=2228&h=436&f=png&s=140862)

```typescript
function getValue<T extends Object, K extends keyof T>(o: T, key: K): T[K] {
  return o[key];
}

const obj1 = { name: '张三', age: 18 };
const a = getValue(obj1, 'hh');
```

## in

<font color="red">in</font>用于取联合类型的值。主要用于数组和对象的构造。

```typescript
type name = 'firstName' | 'lastName';
type TName = {
  [key in name]: string;
};
```

![](https://user-gold-cdn.xitu.io/2020/4/30/171c9c043cb3ef14?w=1122&h=598&f=png&s=77122)

```javascript
const data1 = [
  {
    a1: 'a',
    b1: 'b',
    c1: 'c',
    d1: 'd',
  },
];

const data2 = [
  {
    a2: 'a',
    b2: 'b',
  },
];
```

<font color="red">但切记不要用于 interface，否则会出错</font>

![](https://user-gold-cdn.xitu.io/2020/4/30/171c9c1e2cec4742?w=1122&h=598&f=png&s=77122)

## infer

先看官方解释：

> Within the extends clause of a conditional type, it is now possible to have infer declarations that introduce a type variable to be inferred. Such inferred type variables may be referenced in the true branch of the conditional type. It is possible to have multiple infer locations for the same type variable.

翻译过来就是：

> 现在在有条件类型的 extends 子语句中，允许出现 infer 声明，<font color="red">它会引入一个待推断的类型变量</font>。 这个推断的类型变量可以在有条件类型的 true 分支中被引用。 允许出现多个同类型变量的 infer。

初步看来，这个 ts 关键字限制比较多，也是笔者觉得比较难理解的，但是它对我们获取一些比较复杂的类型特别有用。使用过程中需要注意以下几个**关键点**：

- 只能出现在有条件类型的 extends 子语句中；
- 出现 infer 声明，会引入一个待推断的类型变量；
- 推断的类型变量可以在有条件类型的 true 分支中被引用；
- 允许出现多个同类型变量的 infer

要彻底理解这个关键词的使用必须结合一些实例。

### infer 实例

#### 使用 infer 获取函数参数 Parameters

比如我们这里定义了一个函数类型 TArea，现在要实现将函数的参数类型取出来，我们该怎么做呢？

```typescript
type TArea = (width: number, height: number) => number;
type params = Parameters<TArea>;
```

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb6cb585cbd9e?w=1482&h=326&f=png&s=66084)

其实 <font color="red">Parameters 方法 ts 已内置</font>，源码如下：

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```

我们仔细研读一下以上源码，发现遵循我们上面所说的 infer 满足的四个特点：

- 只能出现在有条件类型的 extends 子语句中；
- 出现 infer 声明，会引入一个待推断的类型变量；
- 推断的类型变量可以在有条件类型的 true 分支中被引用；
- 允许出现多个同类型变量的 infer

这里再啰嗦几句，因为我们要获取函数参数，所以传递的参数必须是个函数，所以有
`T extends (...args: any) => any`，由于我们要获取的是函数参数的类型，所以 infer 出现在了函数参数位置。

同理获取函数返回值的方法就呼之欲出了，如果还是写不出来，当我没说。

#### 使用 infer 获取函数返回值 ReturnType

<font color="red">ReturnType 方法 ts 已内置</font>

```typescript
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
```

再看一下图，不要说我骗你！

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb7ef2132139e?w=506&h=508&f=png&s=178705)

![](https://user-gold-cdn.xitu.io/2020/4/30/171cb7e26fe3a853?w=1464&h=482&f=png&s=84395)

了不得了，infer 真是太强大了，下面我们继续看 infer 如何获取一个类实例的类型。

#### 获取实例类型 InstanceType

```typescript
type InstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any;
```

偷偷告诉你，聪明的 ts 官方也内置了这个工具。

![](https://user-gold-cdn.xitu.io/2020/5/1/171cdb9465d443fb?w=2576&h=940&f=png&s=162066)

#### 获取构造函数类型 ConstructorParameters

该方法 ts 已内置我们看一下源码

```typescript
type ConstructorParameters<
  T extends new (...args: any) => any
> = T extends new (...args: infer P) => any ? P : never;
```

我们可以这样使用它
![](https://user-gold-cdn.xitu.io/2020/5/1/171cdbae2dc1d827?w=1708&h=700&f=png&s=111237)

#### 获取参数 this 参数 ThisParameterType

```typescript
type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown;
```

![](https://user-gold-cdn.xitu.io/2020/5/1/171ce06b97b2bf6a?w=1646&h=494&f=png&s=108319)

#### 剔除 this 参数 OmitThisParameter

实现效果如下，大家可以自己手动实现一下，这可以很好的训练一下 infer 的使用。
![](https://user-gold-cdn.xitu.io/2020/5/1/171ce16a812283c9?w=1364&h=402&f=png&s=82988)
官方源码如下：

```typescript
type OmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T;
```

我们可以这样理解：如果传递的函数不包含 this 参数，则直接返回。以下语法用于判断是否包含 this 参数

```
unknown extends ThisParameterType<T>
```

## 总结

我们重点讲述了 ts 中 keyof 和 infer 的高级用法，下面以两个思考题结束本篇文章，具体答案会在下篇文章揭晓。

### 思考题 1

这是一道 leetcode 的 ts[笔试题](https://github.com/LeetCode-OpenSource/hire/blob/master/typescript_zh.md)，原题目略长，就不直接贴出来了，这里简化一下：

```typescript
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

### 思考题二

```
// 有原数组如下
const data1 = [
  {
    a1: 'a',
    b1: 'b',
    c1: 'c'
  }
];
// 实现一个函数 transformData ，传递一个keyMap后，结果返回经过keyMap转换后的数组

const A2 = transformData(data1, { a1: 'a2' }); // 返回 [{a2: 'a'}]
const A2 = transformData(data1, { a1: 'a2',b2: 'b1' }); // 返回 [{a2: 'a', b2: 'b']

// 要求用ts完成，必须有完善类型推断，不能出现any
```

> @Author: WaterMan

> @Blog: [WaterMan 的个人博客](https://chenshengshui.github.io/waterman-blog/#/)
