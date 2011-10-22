var gpMsg = com.ginpen.gpMsg;

var defaultDuration = gpMsg.DEFAULT.duration;
gpMsg.DEFAULT.duration = 100;

module('units', {
  setup: function() {
  },
  teardown: function() {
    if (gpMsg.$container) {
      gpMsg.$container.remove();
      gpMsg.$container = null;
    }
  }
});

test('general', function() {
  ok(com.ginpen.gpMsg, 'com.ginpen.gpMsg');
  ok($.gpMsg, 'jQuery.gpMsg');

  /*
  var $el = $('<div />');
  ok($el.gpMsg, 'jQuery.gpMsg');
  equal($el.gpMsg(), $el, 'return value');
  */
});

test('build message', function() {
  var text = '<b>text</b> ' + (new Date().getTime());
  var $el = gpMsg._buildMessage(text);
  ok($el.hasClass('gpmsg-message'), 'build');
  equal($el.children('.gpmsg-close').length, 1, 'build');
  equal($el.text(), $el.children('.gpmsg-close').text() + text, 'build');

  var $el = gpMsg._buildMessage('<em>msg</em>', { html: true });
  $el.children('.gpmsg-close').remove();
  equal($el.text(), 'msg', 'html');
  ok($el.children()[0].tagName.toLowerCase(), 'em', 'html');

  var $el = gpMsg._buildMessage('msg', { classes: 'hoge fuga' });
  ok($el.hasClass('gpmsg-message'), 'classes');
  ok($el.hasClass('hoge'), 'classes');
  ok($el.hasClass('fuga'), 'classes');
});

test('check html mode', function() {
  ok(!gpMsg._isHtml(), 'default');
  ok(!gpMsg._isHtml({}), 'default');
  ok(gpMsg._isHtml({ html: true }), 'true');
  ok(!gpMsg._isHtml({ html: false }), 'false');
});

test('bind to close', 1, function() {
  var $el = $('<div />');
  var $close = $('<span class="gpmsg-close" />')
    .appendTo($el);

  gpMsg._bindToClose($el, {
    hide: function($message) {
      start();
      ok(true, 'click to close');
    }
  });
  $close.click();
});

test('get parent', function() {
  var $el = gpMsg._getParent();
  equal($el[0], gpMsg.$container[0], 'default');

  var $container = $('<div />');
  var $el = gpMsg._getParent({ parent: $container });
  equal($el[0], $container[0], 'specified');
});

test('create container', function() {
  ok(!gpMsg.$container, 'before creating');
  equal($('#gpmsg-container').length, 0, 'before creating');

  gpMsg._createContainer();
  ok(gpMsg.$container, 'after creating');
  equal($('#gpmsg-container').length, 1, 'after creating');
  equal($('body > #gpmsg-container').length, 1, 'after creating');
});

test('has container', function() {
  ok(!gpMsg._hasContainer(), 'not initialized');
  ok(!gpMsg.$container, null, 'not initialized');
  gpMsg._createContainer();
  ok(gpMsg._hasContainer(), 'initialized');
  ok(gpMsg.$container, 'initialized');
});

test('push message', function() {
  var $msg1 = gpMsg.pushMessage('msg1');
  $msg1.children('.gpmsg-close').remove();
  equal($msg1.text(), 'msg1', 'creating');
  var $msg2 = gpMsg.pushMessage('msg2');
  $msg2.children('.gpmsg-close').remove();
  equal(gpMsg.$container.children().length, 2, 'push');
  equal(gpMsg.$container.children().eq(0).text(), 'msg2', 'default direction');
  equal(gpMsg.$container.children().eq(1).text(), 'msg1', 'default direction');

  gpMsg.clean();

  var $msg1 = gpMsg.pushMessage('msg1');
  $msg1.children('.gpmsg-close').remove();
  var $msg2 = gpMsg.pushMessage('msg2', { direction: 'after' });
  $msg2.children('.gpmsg-close').remove();
  equal(gpMsg.$container.children().length, 2, 'push');
  equal(gpMsg.$container.children().eq(0).text(), 'msg1', 'after');
  equal(gpMsg.$container.children().eq(1).text(), 'msg2', 'after');

  gpMsg.clean();

  var $container = $('<div />');
  equal($container.children().length, 0, 'parent');
  gpMsg.pushMessage('msg1', { parent: $container });
  equal($container.children().length, 1, 'parent');
  equal(gpMsg.$container.children().length, 0, 'parent');
});

test('clean', function() {
  gpMsg._createContainer();
  gpMsg.pushMessage('msg');
  equal(gpMsg.$container.children().length, 1, 'before cleaning');
  gpMsg.clean();
  equal(gpMsg.$container.children().length, 0, 'clean');
});

test('get duration', function() {
  var val = gpMsg._getDuration();
  ok(val, 'default');
  equal(val, gpMsg.DEFAULT.duration, 'default');

  var val = gpMsg._getDuration({ duration: 123.456 });
  equal(val, 123, 'specified and not decimal');

  var val = gpMsg._getDuration({});
  equal(val, gpMsg.DEFAULT.duration, 'no value');

  var val = gpMsg._getDuration({ duration: 'x' });
  equal(val, gpMsg.DEFAULT.duration, 'NaN');
});

test('remove message later', function() {
  var $container = $('<div />');
  var $el = $('<div />').appendTo($container);
  equal($container.children().length, 1, 'before removing');
  var val = gpMsg._removeMessageLater($el);
  ok(val, 'remove');
  stop(gpMsg.DEFAULT.duration + 1000);
  (function() {
    if ($container.children().length < 1) {
      ok(true, 'removed');
      start();

      $container.remove();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

test('remove message later (specified)', function() {
  var $container = $('<div />');
  var $el = $('<div />').appendTo($container);
  equal($container.children().length, 1, 'before');

  var val = gpMsg._removeMessageLater($el, { duration: 100 });
  ok(val, 'remove');
  stop(200);
  (function() {
    if ($container.children().length < 1) {
      ok(true, 'removed');
      start();

      $container.remove();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

test('remove message later (function)', function() {
  var $container = $('<div />');
  var $el = $('<div />').appendTo($container);

  gpMsg._removeMessageLater($el, {
    hide: function($message) {
      $message.remove();
      ok(true, 'hide');
      start();
    }
  });
  stop(gpMsg.DEFAULT.duration + 1000);
});

test('do not remove message', function() {
  var $container = $('<div />');
  var $el = $('<div />').appendTo($container);
  equal($container.children().length, 1, 'before removing');

  var val = gpMsg._removeMessageLater($el, { duration: 0 });
  ok(!val, 'not remove');
  stop(gpMsg.DEFAULT.duration + 1000);
  var startTime = new Date();
  (function() {
    if (new Date() - startTime > 1000) {
      equal($container.children().length, 1, 'not removed');
      start();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

// --------------------------------

module("jQuery interfaces");

test('push message', 7, function() {
  equal($('body > #gpmsg-container').length, 0, 'before pushing');
  var $el2;
  var $el = $.gpMsg('msg1', {
    show: function($message, $parent) {
      $el2 = $message;
      equal($parent[0], gpMsg.$container[0], 'show');
      $parent.append($message);
    }
  });
  equal($el2[0], $el[0], 'show');
  equal($('body > #gpmsg-container')[0], gpMsg.$container[0], 'default');
  equal($el.parent()[0], gpMsg.$container[0], 'default');
  equal($el.text(), $el.children('.gpmsg-close').text()+'msg1', 'default');
  stop(gpMsg.DEFAULT.duration + 1000);
  var $container = gpMsg.$container;  // prevent null reference when time out.
  (function() {
    if ($container.children().length < 1) {
      ok(true, 'default');
      start();
    }
    else {
      setTimeout(arguments.callee, 10);
    }
  }());
});

test('function', 2, function() {
  $.gpMsg('msg1', {
    show: function($message, $parent) {
      $parent.append($message);
      ok(true, 'show');
    },
    hide: function($message) {
      $message.remove();
      ok(true, 'hide');
      start();
    }
  });
  stop();
});
