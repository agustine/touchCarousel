/*
 * touchCarousel
 * https://github.com/Administrator/jquery.touchCarousel
 *
 * Copyright (c) 2013 叶晓毅
 * Licensed under the MIT license.
 */


(function (factory) {
  "use strict";
  // if (typeof define === 'function' && define.amd) {
  //   // AMD. Register as an anonymous module.
  //   define(['jquery'], factory);
  // } else {
  //   // Browser globals
  factory(jQuery);
  // }
}(function ($) {
  "use strict";
  /**
   * 遮罩层jquery对象
   * @type {jQuery object}
   */
  var $overlay = $('<div>');

  /**
   * 滑动区域jquery对象
   * @type {jQuery object}
   */
  var $slider = $('<div>');

  /**
   * PC端显示上一张图标
   * @type {[jQuery object]}
   */
  var $prevBtn = $('<a class="prev-btn"></a>');

  /**
   * PC端显示下一张图标
   * @type {[jQuery object]}
   */
  var $nextBtn = $('<a class="next-btn"></a>');

  /**
   * 默认选项配置
   * @type {Object}
   */
  var _defaultOptions = {
    items: [], // 初始图片列表 ｛imageUrl: '', imageAlt: ''｝
    firstIndex: 0, // 初始显示的第几张图片
    overlayBackground: 'rgba(0,0,0,0.8)', // 遮盖层背景style属性"background"设置值，可直接从css文件中修改
    zIndex: 100000, // 遮盖层背景style属性"z-index"设置值，可直接从css文件中修改
    urlAttrName: 'image-url', // 初始使用选择器获取dom加载图片对象，对应的图片路径定义的属性
    altAttrName: 'image-alt', // 初始使用选择器获取dom加载图片对象，对应的alt定义的属性
    loadingGif: 'images/preloader.gif', // loading gif 图路径
    cycle: false, // 是否循环
    dataKey: 'imgData',
    /**
     * 初始化后的回调方法
     * @param  {Object} carousel 插件初始化的对象
     * @return {[type]}          [description]
     */
    // init: function(carousel) {},
    init: function(){},
    /**
     * 翻页后的回调方法
     * @param  {Object}  carousel   插件初始化的对象
     * @param  {Boolean} is_forword 是否向前翻
     * @return {[type]}             [description]
     */
    // flipOver: function(carousel, is_forword) {},
    flipOver: function(){},
    /**
     * 关闭后的回调方法
     * @param  {Object} carousel 插件初始化的对象
     * @return {[type]}          [description]
     */
    // close: function(carousel) {},
    close: function(){},
    /**
     * 翻页是发现没有下一页/上一页的回调方法
     * @param  {Object}  carousel   插件初始化的对象
     * @param  {Boolean} is_forword 是否向前翻
     * @return {[type]}             [description]
     */
    // nomore: function(carousel, is_forword) {}
    nomore: function(){}
  };

   $.fn.touchCarousel = function (options) {

    var $this = $(this);
    var _options = $.extend(_defaultOptions, options);
    var _currentNode = null;
    var _active = false;
    var _self = null;
    var _className = {
      overlay: 'tc-overlay',
      slider: 'tc-slider',
      imgBox: 'tc-img-box'
    };

    /**
     * 遮罩层css
     * @type {Object}
     */
    var _overlayCss = {
      'background': _options.overlayBackground,
      'z-index': _options.zIndex
    };

    /**
     * 图片容器css
     * @type {Object}
     */
    var _imgBoxCss = {
      'background': 'url("' + _options.loadingGif + '") no-repeat center center #DDDDDD'
    };

    /**
     * 轮播的图片列表，数据结构为一个双向链表
     * @type {LinkedList}
     */
    var _items = new LinkedList();

    /**
     * 在图片列表后面添加新的图片对象集合
     * @param  {[Array or Object]} items [description]
     * @return {[type]}       [description]
     */
    var _appendItems = function (items) {
      // 参数为null或者未定义，返回
      if(items === null || items === undefined){
        return;
      }
      // 参数为非数组对象，直接添加到链表尾部
      if(!Array.isArray(items)){
        _items.add(items);
        return;
      }
      // 参数为数组，逐个添加到链表尾部
      $.each(items, function (index, item) {
        _items.add(item);
      });
      return;
    };

    /**
     * 在图片列表前面添加新的图片对象集合
     * @param  {[Array or Object]} items [description]
     * @return {[type]}       [description]
     */
    var _prependItems = function (items) {
      // 参数为null或者未定义，返回
      if(items === null || items === undefined){
        return;
      }
      // 参数为非数组对象，直接添加到链表尾部
      if(!Array.isArray(items)){
        _items.add(items);
        return;
      }
      // 参数为数组，以参数clone一个新的数组，否则reverse()方法会让数组翻转
      var itemTemp = $.map(items, function (item) {
        return item;
      });
      // 翻转数组，逐个添加到链表头部
      $.each(itemTemp.reverse(), function (index, item) {
        _items.insertBefore(_items.getHead().getValue(), item);
      });
      return;
    };

    /**
     * 重置图片的max-width及max-height，以适应屏幕大小
     * @param  {jQuery or HTMLDom} elm [description]
     * @return {[type]}     [description]
     */
    var _imgSize = function (elm) {
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

      $(elm).css({
        "max-width": width,
        "max-height": height
      });
    };

    /**
     * 向前播放到图片链表的末尾或者向后播放到图片链表的开始的图片摇摆动作
     * @param  {Boolean} is_left 是否向前播放
     * @return {[type]}          [description]
     */
    var _spring = function (is_left) {
      var shift = is_left ? '30px' : '-30px';
      $slider.animate({
        'margin-left': shift
      }, 150, 'linear', function () {
        $slider.animate({
          'margin-left': 0
        }, 150, 'linear');
      });
      return;
    };

    /**
     * 构造一张图片的dom的jquery对象
     * @param  {Object} obj 图片对象
     * @return {jQuery Object}     图片dom的jquery对象
     */
    var _makeImgBox = function (obj) {
      // 构造dom
      var imgBox = $('<div>').addClass(_className.imgBox);
      if (obj === null) { // 如果参数为null返回一个空的div
        return imgBox.attr('image-url', '');
      }
      imgBox.attr('image-url', obj.imageUrl);
      var thisOverlay = $('<div>').addClass('tc-img-overlay').css(_imgBoxCss);
      imgBox.append(thisOverlay);
      var img = $('<img>').data(_options.dataKey, obj).attr('alt', obj.imageAlt).attr('src', obj.imageUrl);
      thisOverlay.append(img);

      // 重置图片的max-width及max-height，以适应屏幕大小
      _imgSize(img);

      

      return imgBox;
    };

    /**
     * 当前图片定位到某一张图
     * @param  {Object} node 需要翻到的链表节点对象
     * @return {[type]}      [description]
     */
    var _goToPage = function (node) {
      // 参数为null或者未定义，则取链表头部作为当前节点，否则取参数为当前节点
      _currentNode = node || _items.getHead();

      // 以当前节点Prev、当前节点、当前节点的Next构造数据
      var sliderLeft = '-100%',
        left = _currentNode.getPrevious(),
        right = _currentNode.getNext();
      if (_options.cycle) {
        left = left || _items.getTail();
        right = right || _items.getHead();
      }
      var threeDomObj = [left, _currentNode, right];

      // 以产生的数组构造dom，放入slider容器
      $slider.empty().css('left', sliderLeft);
      $.each(threeDomObj, function (index, item) {
        _makeImgBox(item == null ? null : item.getValue()).appendTo($slider);
      });

      return;
    };
    /**
     * 显示遮罩层激活插件
     * @param  {[type]} node 当前节点
     * @return {[type]}      [description]
     */
    var _showOverlay = function (node) {
      // 查看是否已激活
      if (_active) {
        return false;
      }

      // 显示遮罩层
      $overlay.show();

      // 100毫秒后显示初来,以便有足够的时间搭建dom，css中设置了1秒的渐显
      setTimeout(function () {
        $overlay.css('opacity', 1);
      }, 100);

      // 去到当前节点
      _goToPage(node);

      // 修改状态为已激活
      _active = true;
    };

    /**
     * 隐藏掉插件，销毁dom
     * @return {[type]} [description]
     */
    var _hideOverlay = function () {
      // 查看是否是未激活状态
      if (!_active) {
        return false;
      }

      // 隐藏掉dom
      $overlay.hide();

      // 修改状态为已激活
      _active = false;

      // 销毁dom
      $('.placeholder').empty();
      $slider.empty();
      $overlay.remove();

      // 执行close回调
      _options.close(_self);

      // 修改状态为未激活
      _active = false;

      _self = null;

      return;
    };

    /**
     * 初始化插件
     * @return {[type]} [description]
     */
    var _init = function () {
      var self = _self;
      // 数据加载
      if (_options.items && _options.items.length > 0) { // 从初始选项中加载
        $.each(_options.items, function (index, item) {
          _items.add(item);
        });
      } else { // 从dom中加载
        $($this).each(function () {
          _items.add({
            'imageUrl': $(this).attr(_options.urlAttrName),
            'imageAlt': $(this).attr(_options.altAttrName)
          });
        });
      }

      // 设置基本样式
      $overlay.css(_overlayCss);
      $slider.addClass(_className.slider);
      $overlay.addClass(_className.overlay).append($slider);
      $('body').append($overlay);

      // 激活插件
      _showOverlay(_items.get(_options.firstIndex));

      // 执行init回调
      _options.init(self);

      // 非触屏下使用左右屏幕点击翻页
      if (!("ontouchstart" in window)) {
        $overlay.append($prevBtn).append($nextBtn);

        $prevBtn.click(function (e) {
          e.preventDefault();
          self.prev();
        });

        $nextBtn.click(function (e) {
          e.preventDefault();
          self.next();
        });
      }

      // 在浏览器resize（手机横竖屏转换）时，重置图片的max-width及max-height，以适应屏幕大小
      // 手机的chrome浏览器某些版本在横竖屏转换时，max-width及max-height 100% 设置会
      $(window).resize(function () {
        _imgSize($('.tc-img-box img'));
      });

      return;
    };
    var _currentPos = function () {
      return _currentNode.getPos();
    };
    var _length = function () {
      return _items.getSize();
    };
    var _showNext = function (spring) {
      spring = spring === undefined ? true : spring;
      _currentNode = _currentNode.getNext();
      var nextNode = null;
      var nextValue = null;
      if (_options.cycle) {
        _currentNode = _currentNode || _items.getHead();
        nextNode = nextNode || _items.getHead();
      }
      if (_currentNode != null) {
        nextNode = _currentNode.getNext();
        $($slider.find('.tc-img-box').get(0)).remove();
        nextValue = nextNode == null ? null : nextNode.getValue();
        $slider.append(_makeImgBox(nextValue));

        _options.flipOver(_self, true);
      } else {
        if (spring) {
          _spring(false);
        }
        _options.nomore(_self, true);
        _currentNode = _items.getTail();
      }
    };

    var _showPrevious = function (spring) {
      spring = spring === undefined ? true : spring;
      _currentNode = _currentNode.getPrevious();
      var prevNode = null;
      var prevValue = null;
      if (_options.cycle) {
        _currentNode = _currentNode || _items.getTail();
        prevNode = prevNode || _items.getTail();
      }
      if (_currentNode != null) {
        prevNode = _currentNode.getPrevious();
        $($slider.find('.tc-img-box').get(2)).remove();
        prevValue = prevNode == null ? null : prevNode.getValue();
        $slider.prepend(_makeImgBox(prevValue));

        _options.flipOver(_self, false);
      } else {
        if (spring) {
          _spring(true);
        }
        _options.nomore(_self, false);
        _currentNode = _items.getHead();
      }
    };

    var _clear = function () {
      _items = new LinkedList();
      _currentNode = null;
    };

    $('body').on('touchstart', '.tc-slider', function (e) {
      var touch = e.originalEvent,
        startX = touch.changedTouches[0].pageX;
      $slider.on('touchmove', function (e) {
        e.preventDefault();
        touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        if (touch.pageX - startX > 10) {
          $slider.off('touchmove');
          _showPrevious();
        } else if (touch.pageX - startX < -10) {
          $slider.off('touchmove');
          _showNext();
        }
      });
      return true;
    }).on('touchend', function () {
      $slider.off('touchmove');
    });

    _self = {
      init: _init,
      next: _showNext,
      prev: _showPrevious,
      currentPos: _currentPos,
      length: _length,
      appendItems: _appendItems,
      prependItems: _prependItems,
      close: _hideOverlay,
      clear: _clear,
      currentNode: function () {
        return _currentNode;
      }
    };
    return _self;
  };
}));