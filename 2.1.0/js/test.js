

(function(){

	var _slef = {};

	_slef.pageInit = function(){
		_slef.menuAllInit();
	}

	_slef.menuAllInit = function(){
		$('.dropdown-menu-selector').on('click',function(){
			$(this).toggleClass('open');
		});
	}

	$(document).ready(function(){
		_slef.pageInit();
	});

}())