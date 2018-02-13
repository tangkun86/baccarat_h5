var game = {
	// 玩家序号
	order: 0,
	// 游戏阶段
	stage: 0,
	// 模拟玩家姓名
	names: ['张三', '李四', 'tom', 'bob', 'lucy', 'nick', '王五', '张顺', '刘强', '吴尧', '郭德纲', '诸葛亮'],
	// 牌的种类
	category: ['红桃', '黑桃', '方块', '梅花'],
	// 牌的点数
	point: ['3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A', '2'],
	// 各种牌的组合
	cards: [],
	// 随机生成的牌
	randomNum: [],
	// 牌的位置
	backgroundPosition: [{
		'value': '2',
		'posX': '0rem'
	},
	{
		'value': '3',
		'posX': '-1.2rem'
	},
	{
		'value': '4',
		'posX': '-2.37rem'
	},
	{
		'value': '5',
		'posX': '-3.54rem'
	},
	{
		'value': '6',
		'posX': '-4.74rem'
	},
	{
		'value': '7',
		'posX': '-5.94rem'
	},
	{
		'value': '8',
		'posX': '-7.12rem'
	},
	{
		'value': '9',
		'posX': '-8.3rem'
	},
	{
		'value': '0',
		'posX': '-9.5rem'
	},
	{
		'value': 'J',
		'posX': '-10.7rem'
	},
	{
		'value': 'Q',
		'posX': '-11.89rem'
	},
	{
		'value': 'K',
		'posX': '-13.07rem'
	},
	{
		'value': 'A',
		'posX': '-14.24rem'
	}],
	// 游戏初始化模块
	init: function() {
		// 加载左边的用户头像
		for (let i = 0; i < 6; i++) {
			$(".user_pic").eq(i).css({
				left: '0.3rem',
				top: Number((0.41 + i * 1.62).toFixed(2)) + 'rem'
			});
			$(".user_txt").eq(i).css({
				left: '0.3rem',
				top: Number((1.45 + i * 1.62).toFixed(2)) + 'rem'
			});
		}
		// 加载右边的用户头像
		for (let i = 0; i < 6; i++) {
			$(".user_pic").eq(i + 6).css({
				left: '6.27rem',
				top: Number((0.41 + i * 1.62).toFixed(2)) + 'rem'
			});
			$(".user_txt").eq(i + 6).css({
				left: '6.27rem',
				top: Number((1.45 + i * 1.62).toFixed(2)) + 'rem'
			});
		}
		// 执行游戏
		this.start(); 
	},
	// 开始游戏模块
	start: function() {
		// 执行玩家进入房间功能
		this.enterRoom();
		// 执行查看玩家的盈利信息功能   
		this.checkUsers();  
	},
	// 玩家加入房间模块
	enterRoom: function() {
		var timer = setInterval(() => {
			$(".user_txt").eq(this.order).text(this.names[this.order]);
			this.order++;
			if (this.order === 12) {
				// 准备阶段
				this.stage = 1;
				$(".tips_txt").text('准备');
				clearInterval(timer);
				// 下注阶段
				$(".tips_txt").text('押注');
				$('.clip').fadeIn('slow');
				// 执行下注模块
				this.stake();
			}
		}, 50);
	},
	// 查看玩家盈利信息模块
	checkUsers: function() {
		$(".user_pic").on('click', function() {
			var index = $(this).data('index');
			// 显示头像右侧标记
			$(".user_selected").css('display', 'none').eq(index).css('display', 'block');
			// 计分板数据替换
			$(".board").fadeOut().fadeIn();
		});
	},
	// 发牌过程模块
	deal: function() {
		// 生成牌堆
		for (var i = 0; i < 52; i++) {
			var pukeBox = $("<div></div>");
			pukeBox.addClass("pukes");
			pukeBox.attr('data-id', i);
			pukeBox.css({
				left: Number((1.5 + i / 400).toFixed(2)) + 'rem',
				top: Number((2.5 + i / 400).toFixed(2)) + 'rem',
			});
			$(".mid_circle").append(pukeBox);
			$(".mid_circle_txt1").css({
				left: '1rem',
				top: '0.6rem',
				transition: 'all 1s'
			});
			$(".mid_circle_txt2").css({
				right: '1rem',
				top: '0.6rem',
				transition: 'all 1s'
			});
			$(".mid_circle_txt3").css({
				left: '0.8rem',
				top: '3.2rem',
				transition: 'all 1s'
			});
			$(".mid_circle_txt4").css({
				right: '0.8rem',
				top: '3.2rem',
				transition: 'all 1s'
			});
		}
		// 开始发牌(先发闲家)
		var index = 51;
		var timer = setInterval(() => {
			if (index === 51) {
				$('.pukes').eq(51).css({
					transform: 'translateX(1.1rem) translateY(-1.56rem)',
					transition: 'all 1s'
				});
			} else if (index === 50) {
				$('.pukes').eq(50).css({
					transform: 'translateX(-1.3rem) translateY(-1.56rem)',
					transition: 'all 1s'
				});
			}  else if (index === 49) {
				$('.pukes').eq(49).css({
					transform: 'translateX(0.7rem) translateY(-1.56rem)',
					transition: 'all 1s',
					'z-index': 20
				});
			} else if (index === 48) {
				$('.pukes').eq(48).css({
					transform: 'translateX(-0.9rem) translateY(-1.56rem)',
					transition: 'all 1s',
					'z-index': 20
				});
			}
			index--;
			if (index < 48) {
				clearInterval(timer);
				// 牌堆消失，更改提示为开牌阶段
				setTimeout(() => {
					for (var i = 0; i < 48; i++) {
						$('.pukes').eq(i).css('display', 'none');
					}
					$('.tips_txt').text('开牌');
				}, 1000);
				// 牌的点数与类型组合生成3副牌(156张)
				for (var i = 0; i < 4; i++) {
					var card = $('<div></div>');
					card.addClass('card');
					$(".mid_circle").append(card);
				}
				for (var i in game.category) {			
					for (var j in game.point) {
						game.cards.push(game.category[i] + game.point[j])
					}
				}
				game.cards = [...game.cards, ...game.cards, ...game.cards];
				// 随机生成4张牌
				var cardCount = 0
				while (cardCount <= 3) {
					var randIndex = Math.floor(Math.random() * 156);
					if (game.randomNum.indexOf(game.cards[randIndex]) === -1) {
						// 获取牌的类型
						let key = game.cards[randIndex].slice(0, 2);
						// 获取牌的大小  
						let val = game.cards[randIndex].slice(-1); 
						// 不同类型牌的路径   
						let url = '';   
						switch(key) {
							case '红桃':
								url = 'hearts';
								break;
							case '黑桃':
								url = 'spades';
								break;
							case '方块':
								url = 'diamonds';
								break;
							case '梅花':
								url = 'clubs';
								break;
						}
						$.each(game.backgroundPosition, function(index, obj) {
							if (val == obj.value) {
								$('.card').eq(cardCount).css({
									background: 'url(img/' + url + '.png) no-repeat ' + obj.posX + ' 0rem',
									// 移动端雪碧图自适应，需将背景图宽度和高度设为原图尺寸
									backgroundSize: '15.39rem 1.7rem'
								}); 
							}
						});
						game.randomNum.push(game.cards[randIndex]);
						cardCount++;
					}
				}
				// 翻转背面
				/*$('.pukes').css({
					transition: 'all 1s',
					transform: 'rotateY(180deg)',
					transformStyle: 'preserve-3d'
				});*/
				// 设置生成4张牌的位置
				$('.card').eq(0).css({
					left: '0.37rem',
					top: '1.48rem'
				});
				$('.card').eq(1).css({
					left: '0.76rem',
					top: '1.48rem'
				});
				$('.card').eq(2).css({
					left: '2.36rem',
					top: '1.48rem'
				});
				$('.card').eq(3).css({
					left: '2.8rem',
					top: '1.48rem'
				});
				// 倒计时3s开牌
				setTimeout(() => {
					// 隐藏背面
					$('.pukes').fadeOut('fast');
					// 显示正面
					$('.card').fadeIn('slow');
				}, 3000);
				console.log(game.randomNum);
			}
		}, 1000);
	},
	// 押注
	stake: function() {	
		var count = 0,       // 记录下注的次数
			lastType = 0;    // 记录上一次选择的筹码类型
		// 选择筹码类型以及押注的数量
		$('.clip').on('click', '.clip_ball', function() {
			var type = $(this).data('type'),
				money = $(this).data('money'),
				sum = Number($('.clip_txt').eq(type).text());
			if (count <= 9) {    // 最多下注10次
				if (count === 0) {
					lastType = type  // 上一次选择的筹码类型
					$('.clip_box').css('display', 'none').eq(type).css('display', 'block');
					count++;
				} else {
					if (lastType != type) {
						lastType = type;
						count = 1;
						$('.clip_box').css('display', 'none').eq(type).css('display', 'block');
						$('.clip_txt').eq(type).text(money);
					} else {
						count++;
						sum += money;
						$('.clip_txt').eq(type).text(sum);
					}
				}	
			} else {    
				if (lastType != type) {   // 满10次切换筹码类型
					lastType = type;
					count = 1;
					$('.clip_box').css('display', 'none').eq(type).css('display', 'block');
					$('.clip_txt').eq(type).text(money);
				} else {    // 最多押注10次
					alert('亲，最多押注10次哦!');
				}
			}
		});
		// 选择押注区域
		$('.choose_area').on('click', '.choose_txt', function() {
			if (count != 0) {   // 必须先选择筹码才能押注
				var which = $(this).data('which');
				switch(which) {
					case '庄':
						if (lastType === 0) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-3.2rem) translateY(-0.8rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 1) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-4rem) translateY(-0.8rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 2) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-4.7rem) translateY(-0.8rem)',
								transition: 'all 1s'
							});
						}
						break;
					case '和':
						if (lastType === 0) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-2rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 1) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-3rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 2) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-3.6rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						}
						break;
					case '对':
						if (lastType === 0) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-0.6rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 1) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-1.4rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 2) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-2.4rem) translateY(-1.5rem)',
								transition: 'all 1s'
							});
						}
						break;
					case '闲':
						if (lastType === 0) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(0.4rem) translateY(-0.9rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 1) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-0.6rem) translateY(-0.9rem)',
								transition: 'all 1s'
							});
						} else if (lastType === 2) {
							$('.clip_box').eq(lastType).css({
								transform: 'translateX(-1.4rem) translateY(-0.9rem)',
								transition: 'all 1s'
							});
						}
						break;
				}
				count = 0;
				// 进入发牌阶段
				setTimeout(() => {
					// 得分面板显示
					$('.board').show();
					// 筹码消失
					$('.clip').hide();
					// 提示为发牌
					$('.tips_txt').text('发牌');
					// 开始发牌
					game.deal();
				}, 2000);
			}
		});
	}
}
game.init();