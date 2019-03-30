theme.wishlist = (function (){
  var $wishlistButton = $('.js-btn-wishlist'),
      $wishlistCount = $('.js-wishlist-count'),
      $wishlistContainer = $('.js-wishlist-content'),
      wishlistRemoveButton = '.js-remove-wishlist',
      wishlistObject = JSON.parse(localStorage.getItem('localWishlist')) || [];
  notifyWishList = new window.Notify();
  notifyWishList.settings = {
    notifyActiveClass: 'notification--wishlist notification--active',
    closeTimer: 1200
  };
  $($wishlistButton).on('click',function (e) {
    e.preventDefault();
    updateWishlist(this);
  });

  $(document).on('click',wishlistRemoveButton,function(){
    var productHandle = $(this).data('handle');
    //update Object
    wishlistObject.splice(wishlistObject.indexOf(productHandle), 1);
    localStorage.setItem('localWishlist', JSON.stringify(wishlistObject)); 
    // Remove element
    $(this).closest('.wishlist-item').remove();
    //count
    $wishlistCount.text(wishlistObject.length);
    //Notify
    notifyWishList.open(false,theme.strings.wishlistNotifyRemoved,true);
    if (wishlistObject.length === 0) {
      $wishlistContainer.html('<div class="col-md-12 text-center"><div class="alert alert-danger">'+ theme.strings.wishlistNoResult + '</div></div>');
    }
  });

  loadWishlist();

  function updateWishlist(self) {
    var productHandle = $(self).data('handle'),
        notifyText = '';
    var isAdded = $.inArray(productHandle,wishlistObject) !== -1 ? true:false;
    if (isAdded) {
      wishlistObject.splice(wishlistObject.indexOf(productHandle), 1);
      $(self).text(theme.strings.wishlistText);
      notifyText = theme.strings.wishlistNotifyRemoved;
    }else{
      wishlistObject.push(productHandle);
      $(self).text(theme.strings.wishlistRemove);
      notifyText = theme.strings.wishlistNotifyAdded;
    }
    localStorage.setItem('localWishlist', JSON.stringify(wishlistObject)); 
    notifyWishList.open(false,notifyText,true);
    $wishlistCount.text(wishlistObject.length);
  };

  function loadWishlist(){
    $wishlistContainer.html('');
    //page wishlist
    if (wishlistObject.length > 0){
      for (var i = 0; i < wishlistObject.length; i++) { 
        var productHandle = wishlistObject[i];
        Shopify.getProduct(productHandle,function(product){
          var htmlProduct = '';
          var productPrice = product.price_varies? 'from ' + theme.Currency.formatMoney(product.price_min, theme.moneyFormat) : theme.Currency.formatMoney(product.price, theme.moneyFormat);
          var productComparePrice = product.compare_at_price_min !== 0? theme.Currency.formatMoney(product.compare_at_price_min, theme.moneyFormat) : '';
          htmlProduct += '<div class="wishlist-item col-md-3 col-sm-4 col-xs-6">';
          htmlProduct += '	<a href="'+ product.url +'">';
          htmlProduct += '		<img src="'+ product.featured_image +'"/>';
          htmlProduct += '		<h5 >'+ product.title +'</h5>';
          htmlProduct += '	</a>';
          htmlProduct += '	<span> '+ productPrice +'</span>';
          htmlProduct += '	<s>'+ productComparePrice +'</s>';
          htmlProduct += '<div><button class="btn js-remove-wishlist" data-handle="'+product.handle+'">Remove</button></div>';
          htmlProduct += '</div>';
          $wishlistContainer.append(htmlProduct);
          Currency.convertAll(shopCurrency, jQuery('#currencies a.selected').attr('data-currency'));
        });
      }
    }else{
      $wishlistContainer.html('<div class="col-md-12 text-center"><div class="alert alert-danger">'+ theme.strings.wishlistNoResult + '</div></div>');
    }

    //count items
    $wishlistCount.text(wishlistObject.length);

    //button text
    $('.js-btn-wishlist').each(function(){
      var productHandle = $(this).data('handle');
      var htmlText = $.inArray(productHandle,wishlistObject) !== -1 ? theme.strings.wishlistRemove : theme.strings.wishlistText;
      $(this).text(htmlText);
    });
  }
})()
