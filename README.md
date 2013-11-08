# Touchcarousel
touchCarousel 一个用于图片轮播的jquery插件，可以动态的在图片列表的前后添加图片数据 


## 使用


```html
<script type="text/javascript" src="../libs/jquery/jquery.js"></script>
<script type="text/javascript" src="../libs/LinkedList/LinkedList.min.js"></script>
<script type="text/javascript" src="touchCarousel.js"></script>
<script type="text/javascript">
  (function(){
    var carousel = $([]).touchCarousel({
      items:[ // 初始图片列表 ｛imageUrl: '', imageAlt: ''｝，当然可以有其他属性
        {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33831_417536.jpg', imageAlt:'pic1'},
        {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33832_403567.jpg', imageAlt:'pic2'},
        {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33833_907600.jpg', imageAlt:'pic3'},
        {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33834_230596.jpg', imageAlt:'pic4'},
        {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_42/44886_816409_982758.jpg', imageAlt:'pic5'}
      ],
      firstIndex: 0, // 初始显示的第几张图片
      zIndex: 100000, // 遮盖层背景style属性"z-index"设置值，可直接从css文件中修改
      loadingGif: 'preloader.gif', // loading gif 图路径
      cycle: false, // 是否循环
      dataKey: 'imgData', // 图片的数据会被使用$.fn.data(key, value)的方式保存在图片的img element上，包括除了imageUrl，imageAlt以便在点击图片或者轮播到图片是，能够取到图片信息
      /**
       * 翻页后的回调方法
       * @param  {Object}  carousel   插件初始化的对象
       * @param  {Boolean} is_forword 是否向前翻
       * @return {[type]}             [description]
       */
      flipOver: function(thisCarousel, is_forword){ 
        if(is_forword && (thisCarousel.length() - thisCarousel.currentPos()) == 2){ // 右边还有1张图
          // thisCarousel.appendItems([
          //   {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33831_417536.jpg?'},
          //   {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33832_403567.jpg?'}
          // ]);
        }
        else if (!is_forword && (thisCarousel.currentPos() == 1)){ // 左边还有一张图
          // carousel.prependItems([
          //   {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_43/453_33834_230596.jpg?'},
          //   {imageUrl:'http://www.sinaimg.cn/dy/slidenews/5_img/2013_42/44886_816409_982758.jpg?'}
          // ]);
        }
      },
      /**
       * 初始化后的回调方法
       * @param  {Object} carousel 插件初始化的对象
       * @return {[type]}          [description]
       */
      init: function(thisCarousel){

      },
      /**
       * 关闭后的回调方法
       * @param  {Object} carousel 插件初始化的对象
       * @return {[type]}          [description]
       */
      close: function(thisCarousel){

      },
      /**
       * 翻页是发现没有下一页/上一页的回调方法
       * @param  {Object}  carousel   插件初始化的对象
       * @param  {Boolean} is_forword 是否向前翻
       * @return {[type]}             [description]
       */
      nomore : function(thisCarousel, is_forword){
        // if(is_forword){
        //   alert('right');
        // }
        // else{
        //   alert('left');
        // }
      }

    });
    
    // 初始化并显示
    carousel.init();
    // 播放到下一张，参数为bool值，是否在没有下一张图时，使图片左右摇摆一下，让使用知道没有下一张图
    carousel.next(true);
    // 播放到上一张，参数为bool值，是否在没有上一张图时，使图片左右摇摆一下，让使用知道没有上一张图
    carousel.prev(true);
    // 返回插件当前播放的图在现有图片中的位置
    carousel.currentPos();
    // 返回当前图片总数
    carousel.length();
    // 在图片队列后面添加新的图片，参数为数组（多张）或者object（单张）
    carousel.appendItems(items);
    // 在图片队列前面添加新的图片，参数为数组（多张）或者object（单张）
    carousel.prependItems();
    // 关闭并注销插件
    carousel.close();
    // 返回当前图片的数据节点（类型参考 [https://github.com/agustine/structurejs] 中LinkedList类中的Node）
    carousel.currentNode();
    
  })();
</script>
```


