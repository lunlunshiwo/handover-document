# 生命历程图项目

## 项目内容  

* 本次项目的内网地址为[http://10.60.7.6/OMMIS/main?xwl=ide](http://10.60.7.6/OMMIS/main?xwl=ide)，应用地点为山大心脑血管健康重大专项，项目组组长岳义虎，协助人王晓，登录账号为账号：lll，密码：123456。
* 本次项目基于[vue](https://cn.vuejs.org/)和jq框架，其中，vue框架承担了大部分的交互和数据渲染功能的实现，jq框架仅仅用于完成ajax交互（此处可以使用 **wb.request**代替）。
* 本次项目主体内容是时间轴，源代码在本文件夹的 **timeline.html**,这份源码是在后续工作中改错了，无法还原时使用的，建议不要自行修改，后果自负。

## 项目思路

* 本次项目主体为一个时间刻度尺上，可以随着鼠标滚轮滚动放大缩小，鼠标滚轮的参数为**zoomNumber**，初始值为 **1**，最大值为 **30**，使用vue的 **watch**已做最大最小值处理。

* 本次项目可以使用鼠标拖动刻度尺进行左右拖动，使用了鼠标事件 **mousedown**、**mousemove**、**mouseup**（适配移动端时使用了 **touchstart**、**touchmov**e、**touchend**），当 **mousedown**（**touchstart**）事件触发时开始记录鼠标滑动的位置，与 **mousemove**（**touchmove**）移动的距离发生比较，计算鼠标移动的范围。此时使用了配合 **zoomNumber**这个参数计算标尺的偏移量。本次项目主要使用了css3中的属性[transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)，望认真参考MDN文档。

* 由于开始构建时间轴组件时，思路为将130年的每一天都展示到页面中，但忘记可能存在的dom节点过多导致页面变卡的情况的产生（事实也是如此，使用svg也很卡，逐放弃）。后来在想到了一个基于vue的数据驱动视图的思想的动态刷新展示的年月日的办法，即不做展示的年月日仅仅显示最大的dom节点，也就是年，做展示的年份根据 **zoomNumber**的不同展示年月或者年日（当 **zoomNumber**大于8时显示年月日）。

* 偏移量和显示的关系，众所周知，每一年的天数大多为365天，每四年中有一年为366天。我一开始使用一个函数生成了一个130年的时间对象，所有的数据处理和展示都是基于这个对象的。我设置的每一天的div的宽度为 **1px*zoomNumber**，因此一次类推月，年也是天数乘以 **zoomNuber**，一次当鼠标滚轮滚动时可以是指呈整数倍自然增长。同时，作为判断显示当前展示的年份的偏移量也会 **zoomNuber**，同时，为了保证前方和后方不会出现空挡，我在这个展示的年份两边各增加了两年，使之左划右移不会出现空白（当显示到天的时候由于每一年的div长度很长，因此前后各设置一年）。

* 此处为 **数据处理**部分。后台传过来的数据为我和王晓商量的原因，99.99%的情况下的不会出现问题，时间轴上的问题只是他数据设置的不严谨导致的。话接上条，我通过自己写了一个函数一开始先生成一个130年的时间对象。然后再分别再月的层次中加入了本月的状态和看病的事件，在天的级别加入了当天的状态和事件（用于精确到天的时候的展示）。以上的状态和事件的展示思路相同，使用了div+css+定位的方式根据日期定位到月份的不同的地方（百分比），发生在同一天的事情也会根据数组的index的不用上下排列，前后日期事件的z-index是根据日期的大小排列的，当鼠标点击时，z-index会变成最大值，用以展示在定位的最上方。

* 下面的点击按钮是和王晓商量好的接口和跳转方式。

* 最下方的展示是完全由html+css完成的，当前状态的背景大小为`100%/60px`，其余的为`80%/45px`。闪烁的部分使用了css3的[animation](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)和[text-shadow](https://developer.mozilla.org/zh-CN/docs/Web/CSS/text-shadow)。

## 项目的预期

* 项目有的css和style绑定我没有使用vue的[computed计算属性](https://cn.vuejs.org/v2/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7)，最正确的方法应该是使用computed计算属性进行return，包括data的正确方式应该是使用data函数加return。这样做的原因是由于webbuild无法识别es6语法，导致使用这种方法进行折衷。

*  组件问题，在其中很多div应该被封装成组件去操作，但是因为webbuild的某些特性，这样不太方便，而且这个项目过大，导致组件嵌套可能很深，我不敢去尝试，如想查看组件封装的方法，可参考我给刘洋部门做的关于血液中心的项目的组件部分（因为了解到你没用过关于vue-cli的相关，建议阅读一下我那个血液中心项目的组件封装的代码）。

* 以上两个问题只是不建议读者在使用vue时这样写，不需要更改。 
