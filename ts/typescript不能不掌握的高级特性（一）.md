![](https://user-gold-cdn.xitu.io/2020/4/27/171bc3985ae27b04?w=2000&h=1105&f=png&s=733313)

## 定义

官方对交叉类型的解析一如既往的官方！！！

> 交叉类型是将多个类型合并为一个类型。 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。 例如， Person & Serializable & Loggable 同时是 Person 和 Serializable 和 Loggable。 就是说这个类型的对象同时拥有了这三种类型的成员。

## 举个栗子

iUserInfo 类型对象将拥有 iName 和 iBaseInfo 两个类型的所有成员。

```typescript
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
```

## 类型成员冲突处理

当类型存在冲突的时候，成员之间会继续合并，比如：

```typescript
interface iProps1 {
  size: string;
}
interface iProps2 {
  size: number;
}
type iProps = iProps1 & iProps2;
let props: iProps = {
  size: 'ddd',
};
```

合并后 iProps 将如下：

```typescript
type iProps = {
  size: string & number;
};
```

显然，string & number 这种类型是不存在的，所以等价于

```typescript
type iProps = {
  size: never;
};
```

所以编辑器报红，就很容易解析了。

![](https://user-gold-cdn.xitu.io/2020/4/27/171bc3595daad571?w=1894&h=586&f=png&s=122732)

我们这里定义了 never 类型，never 类型是什么呢？

## never 类型

下面看官方文档的解析

> never 类型表示的是那些永不存在的值的类型。 例如， never 类型是那些总是会抛出异常或根本就不会有返回值的函数表达式或箭头函数表达式的返回值类型； 变量也可能是 never 类型，当它们被永不为真的类型保护所约束时。
> never 类型是任何类型的子类型，也可以赋值给任何类型；然而，没有类型是 never 的子类型或可以赋值给 never 类型（除了 never 本身之外）。 即使 any 也不可以赋值给 never。

初步看来，貌似没有用！之前我也一度是这么认为的，其实它的作用还是很大的！
举个栗子，当你有一个联合类型:

```typescript
type AllType = 'a' | 'b';
```

在 switch 当中判断 type，TS 是可以收窄类型的 (discriminated union)：

```typescript
function handleValue(val: AllType) {
  switch (val) {
    case 'a':
      // val 在这里收窄为 'a'
      break;
    case 'b':
      // val 在这里收窄为 'b'
      break;
    default:
      // val 在这里收窄为 never
      const exhaustiveCheck: never = val;
      break;
  }
}
```

注意在 default 里面我们把被收窄为 never 的 val 赋值给一个显式声明为 never 的变量。如果一切逻辑正确，那么这里应该能够编译通过。
但是假如后来有一天你修改了 AllType 的类型：

```typescript
type AllType = 'a' | 'b' | 'c';
```

如果忘记了在 handleValue 里面加上针对 'c' 的处理逻辑，这个时候在 default 里面 val 会被收窄为 'c'，导致无法赋值给 never，产生一个错误。

![](https://user-gold-cdn.xitu.io/2020/4/27/171bc3671d62df18?w=1476&h=892&f=png&s=177317)
所以通过这个办法，你可以确保 handleValue 总是穷尽了所有 AllType 的可能类型。

> @Author: WaterMan

> @Blog: [WaterMan 的个人博客](https://chenshengshui.github.io/waterman-blog/#/)
