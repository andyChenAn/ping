# ping
之前看到大神朴灵的github上关于搭建web服务器的代码，自己也想学习一下。了解通过nodejs是如何搭建web服务器。

web服务器：我们可以分为静态web服务器和动态web服务器。

静态web服务器：其实就是通过请求路径来访问服务器上的静态资源。这个静态资源一般指的就是一个文件，比如是我们访问一个网站的首页，那么服务器就会找到存放在它上面的首页的资源返回给客户端，如果我们访问一个企业介绍页，那么服务器就会找到存放在它上面的企业介绍页的资源返回给客户端，静态web服务器返回的静态页面一般只是用于页面展示。静态web服务器一般主要用于一些不会经常改变的页面，比如公司的官网等。

动态web服务器：其实一般就是通过修改数据库来让页面展示不同的信息，页面的展示会随着用户的操作动态的发生变化，当然修改数据库来展示不同页面信息只是一方面。还有包括通过设置cookie，session来进行追踪用户信息，动态页面并不是独立存在于服务器上的一个网页文件，而是通过用户请求，服务器返回一个完整的页面。

通过上面对静态web服务器和动态web服务器的理解，我们可以看出，当我们请求静态web服务器上的页面时，其实就是将存在在服务器上的这个完整的资源文件返回给客户端，而动态web服务器，则是当用户请求时，服务器才返回一个完整的页面，同时动态web服务器还可以与用户进行更多的交互。

### Session技术:
session技术主要用户追踪用户，因为http协议是无状态协议，当关闭页面后，再打开页面，http是不会记住之前是谁访问的。所以我们可以通过session技术来实现或者cookie技术。session主要是保存在服务器上。

#### session技术实现原理：
当浏览器访问服务器时，程序需要为客户端的请求创建一个session的时候，首先服务器会检查这个客户端是否包含session标识，如果存在session标识，那么表示客户端之前已经创建了session，服务器直接通过这个session表示去查找并使用这个session，如果客户端不包含session标识，那么服务器会为客户端创建一个session并生成一个与之关联的session标识，session标识的值既不会重复，也没有规律（一般通过时间戳加上随机数来实现），而这个session标识将通过cookie的形式由服务器返回给客户端，客户端会保存这个cookie，这样下次再打开页面的时候，客户端会将cookie发送给服务器，服务器再去检查客户端是否包含session标识。
