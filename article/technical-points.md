# 技术要点

本站的实现对我而言是一次较为完整的学习与实践，出于喜欢总结的习惯，对本站所用到技术相关内容进行简单的记录，存档意味比较重，啰嗦枯燥之处望海涵。

## JavaScript

### TweenMax.js

**TweenMax.js** 提供了丰富的缓动动画效果，具有较高的性能与非常好的兼容性。本站在绝大部分元素的以下属性的变化上，都使用了 TweenMax.js 进行动画处理以求达到流畅的视觉效果体验：

- 元素大小
- 元素的空间属性
- 颜色变化
- 透明度改变

使用最多的是`TweenMax.to()`函数，其能接受`paused`参数将动画保存下来，然后对保存的函数调用`play()`与`reverse()`方法实现动画的正向/逆向播放。

但是这个`reverse()`虽然大大简化了代码，使代码更加漂亮，也给我带来了不小的 bug 问题（主要是动画相互冲突的 overwrite 问题），非常令人纠结。

<br>

### 通用部件

本站一些代码相对而言具有普适性，能够进行参考并修改以移植到其他的网页中：

- 光标
- 滚动
  - 平滑滚动
  - 渐变滚动
- 视差
  - 视差滚动
  - 视差浮动
- 3D 透视
- 进度条

#### 光标

光标代码是我写的最大的一个 js 文件，未压缩时达到了`22kB`的大小。其大致流程是：

绑定页面内的光标元素组 -> 设置相关属性 -> 生成动画 -> 为不同元素的事件绑定相应的动画

为了设计光标的交互效果改了不少的版本，更麻烦的是鼠标这种掌握在用户手中的元素很容易产生许许多多的 bug，调教好它是我花费时间最久的一个部分。

> 如果出现了 bug，千万要告诉我 TAT 我尽力修

#### 滚动

滚动效果方面分为了平滑滚动、渐变滚动和视差滚动三个部分，分别负责不同的效果。

其中，平滑滚动的实现是将整个页面的所有内容作为一个元素包裹起来并且不予 body 元素绑定，即浏览器窗口滚动时，并不会造成页面的滚动，从而屏蔽默认的滚动效果。再用代码实现平滑的滚动效果，让页面接收到滚动事件时执行相应的缓动动画。

渐变滚动指的是页面的第二部分——“about”部分，文字的渐入与渐出效果，通过监听当前文段在窗口坐标系下的坐标改变透明度实现。

#### 视差

视差滚动则对于特定的元素监听滚动的距离，将其乘以对应的倍率即可。简单的元素可以使用 CSS 的`perspective`属性实现，但是如果元素稍微复杂一点、超出了一层的父子关系，则使用 JavaScript 计算对应的`transform`值来实现更加合适。

视差浮动是对鼠标窗口坐标的监听，改变不同元素的空间坐标，增强元素的空间感（仅运用在第一部分（主标题）和背景中）。

#### 3D 透视

3D 透视指的是 My Works 部分有关鼠标于 work 方块的交互。首先实现的是基本类，允许 work 方块根据鼠标与其的相对坐标进行三维空间上的旋转，同时有z轴方向上的位移，以在旋转中能够产生透视感；再写专门的类去对应不同的 work 方块，增加它们之间不同的交互特性，给用户更加新奇的交互感。

#### 进度条

进度条在这里承担了进度条的外观和滚动条的功能，所以在交互逻辑上需要在一般的滚动条基础上做改进。假设根据鼠标按下的位置划分为“在进度条已达到位置”和“进度条未达到位置”，则：

- “点击”（鼠标按下后无移动即抬起），会跳转到对应的页面位置，无论其点击的位置是进度条已到达位置还是未到达位置。
- “拖拽”则分两种情况：
  - 如果是尚未达到的进度位置，则先跳转至鼠标按下位置所对应的页面位置，然后再允许用户拖动进度条；
  - 如果按下的位置是进度条已达到的进度位置，则表现为滚动条的交互逻辑：不跳转页面位置，允许用户拖动当前的进度条以当前位置为起始点上下移动。

<br>

### 专用部件

还有部分代码是专门针对该页面编写的代码，仅有参考价值：

- Contact 部分
  - 内容与按钮栏的联动
  - 点击/长按复制功能

这部分中主要是按钮与非兄弟父子关系的元素进行绑定并提供复制粘贴、跳转链接功能，这个部分原本为第二部分，属于刚开始写页面就在实现的部分，所以写的代码比较稚嫩，留下了不少适配的坑。后来使用`class`语法进行了重写，并放置于页面的最后一个部分。

<br>

## CSS

作为偏向于视觉设计的网页，CSS 相关的代码也不比 JavaScript 要少。不过更多的都是排版相关的基础问题，碰到了只要解决后总结好基本下次变得更加熟练。

- SCSS 预处理器
- 动画
  - transition / translate / scale / rotate / opactiy
  - animation / keyframe
  - 复杂动画交给 JavaScript
- 性能
  - translate3d / will-change
- var 变量
- fix-blend-mode

### SCSS 预处理器

在本项目中我第一次尝试 SCSS 语法来编写 CSS 代码，实际上非常容易上手，简单阅读完文档并做好[完整的笔记](http://docs.ceynri.cn/notes/css/sass.html)后，编写 CSS 确实要方便许多。

### 动画

**动画**方面，就是`transition`渐变效果与 CSS3 新出的`animation`属性相配合，多加使用后简单的 CSS 代码也能写出很棒的动画，即便是在普通的网站中，使用它们也能够在小细节上给用户好感。

不过，复杂动画使用 CSS3 可能就不一定合适了，这主要看是否属于 CSS 的强项领域中，否则遇到兼容性等问题还是没有办法的事情，毕竟其不是编程语言，具有一定的限制。

### 性能

如果遇到了**性能**问题，CSS 黑科技`translate3d`和`will-change`作为最后的手段说不定能帮你一忙。

在现代浏览器中，遇到 3D 变换会启用 GPU 进行硬件加速，而`translate3d`是非常具有代表性的 3D 变换，所以在一些 2D 动画较多的地方使用它代替`translate`有可能能够对性能有所帮助。

`will-change`则是在 CSS 代码中提前告知浏览器，某些属性可能会发生动画效果，促使浏览器积极地调用硬件加速去优化它，但这个属性是最后的手段，并不应该随便使用。

### var 变量

CSS3 新引入的 **var 变量**也是一个不错的玩意，常用的是将颜色定义为 CSS3 变量，便于使用 JS 替换该变量值，达到一键更换主题配色的效果，无需到处更改各种元素的颜色属性值。

### fix-blend-mode

页面的反色效果使用的是`fix-blend-mode: exclusion`实现的，这属性很酷，我很喜欢，点名表扬一下。

> 还有`filter`也是可以很酷的属性，但在本页面中没有什么使用（用了`drop-shadow`），有视觉效果需求的话`filter`属性是非常值得了解的对象。

<br>

## HTML

作为一门标记语言，HTML 是每个程序员的基本功了。

- Emmet 语法
- HTML5 语义化标签

### Emmet 语法

Emmet 是一种提供自动补全的语法。举个简单的例子，我们可以输入`!`，然后输入<kbd>Tab</kbd>键，即可自动补全以下内容：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    
</body>
</html>
```

再比如：

```html
table>.row>.elem+.elem
```

按下<kbd>tab</kbd>键，我们可以得到：

```html
<table>
  <tr class="row">
    <td class="elem"></td>
    <td class="elem"></td>
  </tr>
</table>
```

> 如果对 Emmet 语法有兴趣，可以看看这篇我写的 [Emmet 笔记](http://docs.ceynri.cn/notes/html/emmet.html)

### 语义化标签

语义化是 HTML5 的重点之一，这部分我也是一边学习、一边通过别人的优秀代码中了解到不同的语义化标签，人尽皆知的`<section>`、`<header>`、`<nav>`等常用标签就不介绍了（[HTML5 结构元素介绍](http://docs.ceynri.cn/notes/html/h5-structure-tag.html) 一文可以通过实例帮助区分这些标签的作用），我还了解到下面几个标签：

- `<main>`
- `<time>`
- `<figure>`

挺有意思，这不仅是增加了机器可读性，这些语义化标签更会让我觉得自己的代码非常的漂亮（其实还是很菜）

<br>

## 移动端

移动端适配的要诀就是：删得越多，需要适配的东西就越少（x）

- 适配
  - 自适应
  - 响应式
- 性能

### 适配

说到适配，基本都是围绕着“自适应布局”和“响应式页面”两个概念来进行，毕竟重新开发一个页面专门用于移动端的成本相对而言是比较高的。

自适应布局，一般而言是使用`Flex`弹性布局与`Grid`栅格布局来实现，它们在尺寸的变化上具有连贯性，可以随着页面的尺寸变化通过压缩空白间距、自动换行等方式发生连续的排版变化。但是自适应是有极限的，从 PC 端到手机端这种尺寸与比例的巨大变化，一般而言“响应式设计”更加切合该问题。

响应式界面借助的是 CSS 的媒体查询特性，对不同的媒体以及屏幕尺寸应用不同的 CSS 样式。这个功能很强大，很多适配都是这么做的，某些不要的元素可以`display: none`隐藏掉，又可以把某些只在手机端的元素`display`出来。缺点就是它是阶段性的、离散的，需要设置多个断点来适配多种不同的尺寸。

所以这两个技术相辅相成，才能实现较好的单份页面多终端适配。

光有排版适配是不行的，还需要调整元素与文本的尺寸。常见的`rem`布局原本是个不错的主意，但在选择的时候我纠结地决定使用`vh`与`vw`来实现，媒体查询时则用`em`来调整字体大小，只能说各有所长。因为这方面经验不足，我也不确定使用`rem`方案会不会有更好的适配效果。

### 性能

坦白说，一开始适配都是用的 chrome 浏览器模拟手机端进行的，这导致我写了不少代码之后，等到网站上线服务器了，在手机上才发现我添加的动画与效果实在太多，导致移动端性能捉襟见肘。

于是乎只好包含泪水送走那些代码，在移动端禁用一些 js 脚本，甚至连 My Works 里我很喜欢的 CSS3 飞行员动画也要禁止了，页面访问才变得流畅起来。所以我只好在郁闷中开玩笑地总结道：“把发生性能问题的东西禁用掉就没有性能问题了。”

<br>

## 网站

还有一些零碎的配置，顺嘴提一下：

- 资源
  - 网络字体 GoogleFonts
  - 开源图标 IconFonts
  - 图片挂载与压缩 sm.ms
- 服务器
  - 阿里云
  - 域名
  - 备案
- google analytics

字体一开始是从服务器中获取的，结果中文字体动辄`10MB`的大小严重影响了页面的加载访问，且单单使用英文字体也要考虑版权问题。没经验的我一开始是打算尽量猜测用户电脑自带的字体按在我页面中的实际显示效果排个序作为我的`font-family`，后来想起伟大的 GoogleFonts，非常简单易用地挑选到了我想要的字体，而且不用担心版权问题，点赞👍

阿里的 IconFonts 也是类似的，提供海量的图标，甚至给我用作为光标样式，很好用👍

图片当然可以存储在服务器端，不过懒得管理的我直接上传到 sm.ms 然后引用图片，也很好用，同时节约了服务器带宽。

网站流量分析用的谷歌家的 Google Analytics，不太会用图个乐呵。

<br>