theme.compare = (function (){
  var $compareButton = $('.js-btn-compare'),
      $compareCount = $('.js-compare-count'),
      $compareContainer = $('.js-compare-content'),
      compareRemoveButton = '.js-remove-compare',
      compareObject = JSON.parse(localStorage.getItem('localCompare')) || [];
  notifyCompare = new window.Notify();
  notifyCompare.settings = {
    notifyActiveClass: 'notification--compare notification--active',
    closeTimer: 1200
  };
  $($compareButton).on('click',function (e) {
    e.preventDefault();
    updateCompare(this);
    loadCompare();
  });

  $(document).on('click',compareRemoveButton,function(){
    $('#NotificationError').removeClass('notification--max');
    var productHandle = $(this).data('handle');
    compareObject.splice(compareObject.indexOf(productHandle), 1);
    localStorage.setItem('localCompare', JSON.stringify(compareObject)); 
    loadCompare();
  });

  loadCompare();

  function updateCompare(self) {
    var productHandle = $(self).data('handle'),
        notifyText = '';
    var isAdded = $.inArray(productHandle,compareObject) !== -1 ? true:false;
    $('#NotificationError').removeClass('notification--max');
    if (isAdded) {
      compareObject.splice(compareObject.indexOf(productHandle), 1);
      $(self).text(theme.strings.compareText);
      notifyText = theme.strings.compareNotifyRemoved;
    }else{
      if (compareObject.length === 4){
        $('#NotificationError').addClass('notification--max');
        notifyText = theme.strings.compareNotifyMaximum;
      }else{
        compareObject.push(productHandle);
        $(self).text(theme.strings.compareRemove);
        notifyText = theme.strings.compareNotifyAdded;
      }
    }
    localStorage.setItem('localCompare', JSON.stringify(compareObject)); 
    notifyCompare.open(false,notifyText,true);
    $compareCount.text(compareObject.length);
  };

  function loadCompare(){
    var compareGrid;
    $compareContainer.html('');
    //page compare
    if (compareObject.length > 0){
      compareGrid = compareObject.length === 1? 'col-md-6 col-sm-6' : 'col';
      for (var i = 0; i < compareObject.length; i++) { 
        var productHandle = compareObject[i];
        Shopify.getProduct(productHandle,function(product){
          var htmlProduct = '';
          var productPrice = product.price_varies? 'from ' + theme.Currency.formatMoney(product.price_min, theme.moneyFormat) : theme.Currency.formatMoney(product.price, theme.moneyFormat);
          var productComparePrice = product.compare_at_price_min !== 0? theme.Currency.formatMoney(product.compare_at_price_min, theme.moneyFormat) : '';
          htmlProduct += '<div class="compare-item '+compareGrid+' col-xs-6">';
          htmlProduct += '	<a href="'+ product.url +'">';
          htmlProduct += '		<img src="'+ product.featured_image +'"/>';
          htmlProduct += '		<h5 >'+ product.title +'</h5>';
          htmlProduct += '	</a>';
          htmlProduct += '	<span> '+ productPrice +'</span>';
          htmlProduct += '	<s>'+ productComparePrice +'</s>';
          htmlProduct += '<div><button class="btn js-remove-compare" data-handle="'+product.handle+'">Remove</button></div>';
          htmlProduct += '</div>';
          $compareContainer.append(htmlProduct);
          Currency.convertAll(shopCurrency, jQuery('#currencies a.selected').attr('data-currency'));
        });
      }
    }else{
      $compareContainer.html('<div class="col-md-12 text-center"><div class="alert alert-danger">'+ theme.strings.compareNoResult + '</div></div>');
    }

    //count items
    $compareCount.text(compareObject.length);

    //button text
    $('.js-btn-compare').each(function(){
      var productHandle = $(this).data('handle');
      var htmlText = $.inArray(productHandle,compareObject) !== -1 ? theme.strings.compareRemove : theme.strings.compareText;
      $(this).text(htmlText);
    });
  }
})()