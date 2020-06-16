## [博客传送门](https://andy-tk.github.io/)

![](https://raw.githubusercontent.com/Andy-TK/Andy-TK.github.io/master/img/blog_home.jpg)

## 使用

* 开始
    * [开始](#开始)
	* [撰写博文](#撰写博文)
* 组件
	* [侧边栏](#侧边栏)
	* [关于我](#mini-about-me)
	* [推荐标签](#featured-tags)
	* [好友链接](#friends)
	* [HTML5 演示文档布局](#keynote-layout)
	* [评论](#comment)
	* [网站分析](#analytics)
	* [Latex支持](#latex支持)
* 其他
	* [自定义](#customization)
	* [标题底图](#header-image)
	* [搜索展示标题-头文件](#seo-title)
* [知识共享声明](#文章内容添加知识共享声明)
* [致谢](#致谢)
* [License](#License)
### 开始

通过修改 `_config.yml`文件来自定义自己的博客:

```
# Site settings
title: Andy's Blog                   # 你的博客网站标题
SEOTitle: Andy's Blog        # SEO 标题
description: "Hello World"	   	   # 随便说点，描述一下

# SNS settings
github_username: AlbertHG     # 你的github账号

# Build settings
# paginate: 10              # 一页你准备放几篇文章
```

Jekyll官方网站还有很多的参数可以调，比如设置文章的链接形式...网址在这里：[Jekyll - Official Site](http://jekyllrb.com/) 中文版的在这里：[Jekyll中文](http://jekyllcn.com/).

### 撰写博文

要发表的文章一般以 **Markdown** 的格式放在这里`_posts/`。

yaml 头文件长这样:

```
---
layout:     post
title:      Hello World
subtitle:   This is subtitle
date:       2018-04-11
author:     Andy
header-img: img/HelloWorld.jpg
catalog:      true
tags:
    - Blog
    - Page
---

```

### 侧边栏

在 `_config.yml`文件里面的`Sidebar settings`。

```
# Sidebar settings
sidebar: true  #添加侧边栏
sidebar-about-description: "简单的描述一下你自己"
sidebar-avatar: /img/avatar-by.jpg     #你的大头贴，请使用绝对地址.注意：名字区分大小写！后缀名也是
```

侧边栏是响应式布局的，当屏幕尺寸小于992px的时候，侧边栏就会移动到底部。具体请见bootstrap栅格系统 <http://v3.bootcss.com/css/>


### Mini About Me

Mini-About-Me 这个模块将在你的头像下面，展示你所有的社交账号。这个也是响应式布局，当屏幕变小时候，会将其移动到页面底部，只不过会稍微有点小变化，具体请看代码。

### Featured Tags

看到这个网站 [Medium](http://medium.com) 的推荐标签非常的炫酷，所以我将他加了进来。
这个模块现在是独立的，可以呈现在所有页面，包括主页和发表的每一篇文章标题的头上。

```
# Featured Tags
featured-tags: true  
featured-condition-size: 1     # A tag will be featured if the size of it is more than this condition value
```

唯一需要注意的是`featured-condition-size`: 如果一个标签的 SIZE，也就是使用该标签的文章数大于上面设定的条件值，这个标签就会在首页上被推荐。

内部有一个条件模板 `{% if tag[1].size > {{site.featured-condition-size}} %}` 是用来做筛选过滤的.

### Social-media Account

在下面输入的社交账号，没有的添加的不会显示在侧边框中。

	# SNS settings
	RSS: false
	zhihu_username:     username
	facebook_username:  username
	github_username:    username
	# weibo_username:   username

### Friends

好友链接部分。这会在全部页面显示。

设置是在 `_config.yml`文件里面的`Friends`那块。

```
friends: [
    {
        title: "Baidu",
        href: "https://www.baidu.com"
    },{
        title: "Google",
        href: "https://www.google.com"
    }
]
```


### Keynote Layout

HTML5幻灯片的排版：

![](https://camo.githubusercontent.com/f30347a118171820b46befdf77e7b7c53a5641a9/687474703a2f2f6875616e677875616e2e6d652f696d672f626c6f672d6b65796e6f74652e6a7067)

这部分是用于占用html格式的幻灯片的，一般用到的是 Reveal.js, Impress.js, Slides, Prezi 等等.我认为一个现代化的博客怎么能少了放html幻灯的功能呢~

其主要原理是添加一个 `iframe`，在里面加入外部链接。你可以直接写到头文件里面去，详情请见下面的yaml头文件的写法。

```
---
layout:     keynote
iframe:     "http://huangxuan.me/js-module-7day/"
---
```

iframe在不同的设备中，将会自动的调整大小。保留内边距是为了让手机用户可以向下滑动，以及添加更多的内容。


### Comment

博客加入了 [Gitalk](https://gitalk.github.io/) 评论系统，[支持 Markdwon 语法](https://guides.github.com/features/mastering-markdown/)。Coooooooooooooool

#### Gitalk

优点：界面干净简洁，利用 Github issue API 做的评论插件，使用 Github 帐号进行登录和评论，最喜欢的支持 Markdown 语法，对于程序员来说真是太 cool 了。

缺点：配置比较繁琐，每篇文章的评论都需要初始化。

### Analytics

网站分析使用Google Analytics。去官方网站注册，然后将返回的code贴在下面：

```
# Google Analytics
ga_track_id: 'UA-49627206-1'            # 你用Google账号去注册一个就会给你一个这样的id
ga_domain: auto			# 默认的是 auto
```

### Latex支持

在`_include/head.html`文件下添加：

```html
<!-- 直接引入MathJax，使用Tex-MML-AM_HTLMorMML配置文件
    1. 整行公式自动编号；
    2. 将两个单美元符号$中间的内容看作行内数学公式（若文本内容中美元符号出现频率较高，建议禁用这一脚本）
    3. 从mathjax官网挂载脚本。
    -->

    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({ TeX: { equationNumbers: { autoNumber: "all" } } });
    </script>
    <script type="text/x-mathjax-config">
        MathJax.Hub.Config({tex2jax: {
             inlineMath: [ ['$','$'], ["\\(","\\)"] ],
             processEscapes: true
           }
         });
    </script>

    <script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML" type="text/javascript">
    </script>
```

### Customization

可以去自定义这个模板的 Code。

**可以理解为在 `_include/` 和 `_layouts/`文件夹下的代码（这里是整个界面布局的地方），可以使用 Jekyll 使用的模版引擎 [Liquid](https://github.com/Shopify/liquid/wiki)的语法直接修改/添加代码，来进行自定义界面！**

### Header Image

博客每页的标题底图是可以自己选的，看看几篇示例post你就知道如何设置了。

标题底图的选取完全是看个人的审美了。每一篇文章可以有不同的底图，你想放什么就放什么，重点是宽度要够。

但是需要注意的是本模板的标题是**白色**的，所以背景色要设置为**灰色**或者**黑色**，总之深色系就对了。当然你还可以自定义修改字体颜色，总之，用github pages就是可以完全的个性定制自己的博客。

### SEO Title

我的博客标题是 **“Andy's Blog”** 但是我想要在搜索的时候显示 **Andy's Blog** ，这个就需要 SEO Title 来定义了。

 SEO Title 就是定义了<head><title>标题</title></head>这个里面的东西，可以自行修改的。

## 文章内容添加知识共享声明

在`_layouts/post.html`的`{{content}}`下方添加以下信息：

```html
<blockquote style="margin:2em 0 0;padding:.5em 1em;border-left:3px solid #f44336;background-color:#f5f5f5;list-style:none">
	<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
		<img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
	</a>
	本作品采用
	<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
		知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议
	</a>进行许可。欢迎转载，并请注明来自：<a href="https://alberthg.github.io/">黄钢的博客</a>
	同时保持文章内容的完整和以上声明信息！
</blockquote>
```

## 致谢

1. 原始模板来自 [Hux](https://github.com/Huxpro/huxpro.github.io), 感谢。
2. 本站模板是从 [qiubaiying](https://github.com/qiubaiying/qiubaiying.github.io) folk 的，感谢。
2. 感谢 Jekyll、Github Pages 和 Bootstrap!

## License

遵循 MIT 许可证。有关详细,请参阅 [LICENSE](https://github.com/qiubaiying/qiubaiying.github.io/blob/master/LICENSE)。