// 存储玩家金币至本地localstorage
window.localStorage.setItem('total', 20000);
window.localStorage.setItem('origin', 20000);
var game = {
	// 玩家序号
	order: 0,
	// 游戏阶段
	stage: 0,  
	// 补几张牌
	number: 0,
	// 模拟玩家姓名
	names: ['张三', '李四', 'tom', 'bob', 'lucy', 'nick', '王五', '张顺', '刘强', '吴尧', '郭德纲', '诸葛亮'],
	/* 牌的种类
	  * hearts: 红桃
	  * spades: 黑桃
	  * diamonds: 方块
	  * clubs: 梅花
	*/
	category: ['hearts', 'spades', 'diamonds', 'clubs'],   
	// 牌的点数
	point: ['3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K', 'A', '2'],
	// 各种牌的组合
	cards: [],
	// 随机生成的牌
	randomNum: [],
	// 庄家总的点数
	bankerPoints: 0, 
	// 闲家总的点数
	playerPoints: 0,
	// 押注的筹码
	chip: [0, 0, 0, 0],
	// 押庄的赔率
	bankerOdds: 2,
	// 押闲的赔率
	playerOdds: 2,
	// 押和的赔率
	equalOdds: 8,
	// 押对的赔率
	twoOdds: 16,
	// 押庄标识
	bankerFlag: false,
	// 押闲标识
	playerFlag: false,
	// 押和标识
	equalFlag: false,
	// 押对标识
	twoFlag: false,
	// 是否有对子
	isTwo: false,
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
		var timer = setInterval(function() {
			$(".user_txt").eq(game.order).text(game.names[game.order]);
			game.order++;
			if (game.order === 12) {
				// 准备阶段
				game.stage = 1;
				$(".tips_txt").text('准备');
				clearInterval(timer);
				// 下注阶段
				$(".tips_txt").text('押注');
				$('.clip').fadeIn('slow');
				// 执行下注模块
				game.stake();
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
				transition: 'all 0.5s'
			});
			$(".mid_circle_txt2").css({
				right: '1rem',
				top: '0.6rem',
				transition: 'all 0.5s'
			});
			$(".mid_circle_txt3").css({
				left: '0.8rem',
				top: '3.2rem',
				transition: 'all 0.5s'
			});
			$(".mid_circle_txt4").css({
				right: '0.8rem',
				top: '3.2rem',
				transition: 'all 0.5s'
			});
		}
		// 开始发牌(先发闲家)
		var index = 51;
		var timer = setInterval(function() {
			if (index === 51) {
				$('.pukes').eq(51).css({
					transform: 'translateX(1.1rem) translateY(-1.56rem)',
					transition: 'all 0.5s'
				});
			} else if (index === 50) {
				$('.pukes').eq(50).css({
					transform: 'translateX(-1.3rem) translateY(-1.56rem)',
					transition: 'all 0.5s'
				});
			}  else if (index === 49) {
				$('.pukes').eq(49).css({
					transform: 'translateX(0.7rem) translateY(-1.56rem)',
					transition: 'all 0.5s',
					'z-index': 20
				});
			} else if (index === 48) {
				$('.pukes').eq(48).css({
					transform: 'translateX(-0.9rem) translateY(-1.56rem)',
					transition: 'all 0.5s',
					'z-index': 20
				});
			}
			index--;
			if (index < 48) {
				clearInterval(timer);
				// 牌堆消失，更改提示为开牌阶段
				setTimeout(function() {
					for (var i = 0; i < 48; i++) {
						$('.pukes').eq(i).css('display', 'none');
					}
					$('.tips_txt').text('开牌');
				}, 1000);
				// 牌的点数与类型组合生成3副牌(156张)
				for (var i = 0; i < 6; i++) {
					var card = $('<div></div>');
					card.addClass('card');
					if (i < 4) {
						card.addClass('origin');
					} else {
						card.addClass('add');
					}
					$(".mid_circle").append(card);
				}
				for (var i in game.category) {			
					for (var j in game.point) {
						game.cards.push(game.category[i] + game.point[j])
					}
				}
				game.cards = [...game.cards, ...game.cards, ...game.cards];
				// 随机生成6张牌
				var cardCount = 0;
				while (cardCount <= 5) {
					var randIndex = Math.floor(Math.random() * 156);
					if (game.randomNum.indexOf(game.cards[randIndex]) === -1) {
						// 获取牌的类型
						let url = game.cards[randIndex].slice(0, -1);
						// 获取牌的大小  
						let val = game.cards[randIndex].slice(-1); 
						var point = 0;
						// 得到牌的点数
						switch(val) {
							case 'A': 
								point = 1;
								break;
							case '2':
								point = 2;
								break;
							case '3':
								point = 3;
								break;
							case '4':
								point = 4;
								break;
							case '5':
								point = 5;
								break;
							case '6':
								point = 6;
								break;
							case '7':
								point = 7;
								break;
							case '8':
								point = 8;
								break;
							case '9':
								point = 9;
								break;
							default:
								point = 0;
								break;
						}
						// 不同类型牌的路径   
						$.each(game.backgroundPosition, function(index, obj) {
							if (val == obj.value) {
								$('.card').eq(cardCount).css({
									background: 'url(img/' + url + '.png) no-repeat ' + obj.posX + ' 0rem',
									// 移动端雪碧图自适应，需将背景图宽度和高度设为原图尺寸
									backgroundSize: '15.39rem 1.7rem'
								}); 
								// 保存每张牌的点数
								$('.card').eq(cardCount).data('points', point);
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
				setTimeout(function() {
					// 隐藏背面
					$('.pukes').fadeOut('fast');
					// 显示正面
					$('.origin').fadeIn('slow');
					// 算牌
					game.compare();
				}, 3000);
				console.log(game.randomNum);
			}
		}, 500);
	},
	// 押注
	stake: function() {	
		var choose = false,   // 是否选择筹码
				change = false,   // 是否切换类型
				self_change = [true, true, true, true],
				stakeFlag = false,// 押注是否完成
				lastType = 0,     // 上一次筹码类型
				count = 0,        // 切换次数
				type = 0,         // 筹码的类型
				money = 0,        // 筹码的大小
				sum = [0, 0, 0, 0] // 记录各种押注的累加和
				total = Number(window.localStorage.getItem('total')),  // 获取玩家本金 
		// 选择筹码类型
		$('.clip').on('click', '.clip_ball', function() {
			// 获取筹码大小
			money = $(this).data('money'),
			// 获取筹码类型
			type = $(this).data('type');
			if (count === 0) {
				lastType = type;
			} else {
				if (lastType !== type) {
					// 改变为true
					change = true;
					self_change = [true, true, true, true];
					lastType = type;
				} else {
					change = false;
				}
			}
			count++;
			// 其他筹码设置正常大小
			$('.clip_ball').css({
				transform: 'scale(1.0)',
			});
			// 选中筹码变大
			$('.clip_ball').eq(type).css({
				transform: 'scale(1.2)',
				transition: 'all 0.2s'
			});
			// 已选择筹码
			choose = true;
		});
		// 选择押注区域
		$('.choose_area').on('click', '.choose_txt', function() {
			// 记录押注的筹码
			// game.chip = Number($('.clip_txt').eq(lastType).text());
			if (choose === true) {   // 必须先选择筹码才能押注
				var which = $(this).data('which'); // 下注的区域
				switch(which) {
					case '庄':
						// 若切换了类型，之前筹码的累加和归零
						if (change && self_change[0]) {
							// 退还本金
							total += sum[0];
							sum[0] = 0;
							self_change[0] = false;
						} else {
							sum[0] = Number($('.clip_box1 span').text());
						}
						sum[0] += money;
						$('.clip_box1 img').attr('src', 'img/chip_' + type + '.png');
						$('.clip_box1 span').text(sum[0]);
						$('.banker_use').text(sum[0]);
						game.chip[0] = sum[0];
						game.bankerFlag = true;
						break;
					case '和':
						// 若切换了类型，之前筹码的累加和归零
						if (change && self_change[1]) {
							total += sum[1];
							sum[1] = 0;
							self_change[1] = false;
						} else {
							sum[1] = Number($('.clip_box2 span').text());
						}
						sum[1] += money;
						$('.clip_box2 img').attr('src', 'img/chip_' + type + '.png');
						$('.clip_box2 span').text(sum[1]);
						$('.equal_use').text(sum[1]);
						game.chip[1] = sum[1];
						game.equalFlag = true;
						break;
					case '对':
						// 若切换了类型，之前筹码的累加和归零
						if (change && self_change[2]) {
							total += sum[2];
							sum[2] = 0;
							self_change[2] = false;
						} else {
							sum[2] = Number($('.clip_box3 span').text());
						}
						sum[2] += money;
						$('.clip_box3 img').attr('src', 'img/chip_' + type + '.png');
						$('.clip_box3 span').text(sum[2]);
						$('.two_use').text(sum[2]);
						game.chip[2] = sum[2];
						game.twoFlag = true;
						break;
					case '闲':
						// 若切换了类型，之前筹码的累加和归零
						if (change && self_change[3]) {
							total += sum[3];
							sum[3] = 0;
							self_change[3] = false;
						} else {
							sum[3] = Number($('.clip_box4 span').text());
						}
						sum[3] += money;
						$('.clip_box4 img').attr('src', 'img/chip_' + type + '.png');
						$('.clip_box4 span').text(sum[3]);
						$('.player_use').text(sum[3]);
						game.chip[3] = sum[3];
						game.playerFlag = true;
						break;
				}
				total -= money;
				if (total < 0) {
					alert('亲, 余额不足，请及时充值!');
				} else {
					$('.money_txt').text(total);
				}
			}
			stakeFlag = true;
		});
		// 点击发牌
		$('.tips').on('click', function() {
			if (stakeFlag === true) {
				// 保存本金
				window.localStorage.setItem('total', total);
				// 得分面板显示
				$('.board').show();
				// 筹码消失
				$('.clip').hide();
				// 提示为发牌
				$('.tips_txt').text('发牌');
				// 开始发牌
				game.deal();
				// 发牌事件解绑
				$(this).unbind('click');
				// 下注事件解绑
				$('.choose_area').unbind('click');
			}
		});
	},
	// 比较牌的点数
	compare: function() {
		// 获取庄家的点数和
		game.bankerPoints = ($('.card').eq(0).data('points') + $('.card').eq(1).data('points')) % 10,
		game.playerPoints = ($('.card').eq(2).data('points') + $('.card').eq(3).data('points')) % 10;
		console.log(game.bankerPoints, game.playerPoints);
		if (game.playerPoints === 8 || game.playerPoints === 9 || game.bankerPoints === 8 || game.bankerPoints === 9) {
			// 若庄闲出现8, 9点, 直接定胜负
			setTimeout(function() {
				game.settlement();
			}, 2000);
		} else if (game.playerPoints === 6 || game.playerPoints === 7) {
			// 闲家不补牌
			// 若闲家点数为6, 闲家补牌为6, 7, 庄家不补
			setTimeout(function() {
				$('.tips_txt').text('博牌');
				// 获取闲家的补牌点数
				var pointTemp = $('.card').eq(5).data('points');
				if (pointTemp === 1 || pointTemp === 2 || pointTemp === 3 || pointTemp === 8 || pointTemp === 9 || pointTemp === 0 || game.bankerPoints === 7) {
					// 庄闲均不补牌
					game.settlement();
				} else {
					// 庄家补牌
					// 0代表庄家补牌
					game.number = 0;
					game.increaseCard(); 
				}
			}, 2000);
		} else if (game.playerPoints === 0 || game.playerPoints === 1 || game.playerPoints === 2 || game.playerPoints === 3 || game.playerPoints === 4 || game.playerPoints === 5) {
			// 闲家补牌
			setTimeout(function() {
				$('.tips_txt').text('博牌');
				var pointTemp = $('.card').eq(5).data('points');
				console.log(pointTemp);
				if (pointTemp === 1 || pointTemp === 2 || pointTemp === 3 || pointTemp === 8 || pointTemp === 9 || pointTemp === 0 || game.bankerPoints === 7) {
					// 若闲家点数为1, 2, 3, 8, 9, 10, 庄家不补
					// 1代表闲家补牌
					game.number = 1;
				} else {
					// 补两张牌
					game.number = 2;
				}
				game.increaseCard();
			}, 2000);
		}
	},
	// 博牌(补牌)
	increaseCard: function() {
		// 牌堆出现
		for (var i = 0; i < 48; i++) {
			$('.pukes').eq(i).css('display', 'block');
		}
		// 补两张牌
		if (game.number === 2) {
			// 发牌动画
			var index = 2;
			var addTimer = setInterval(function() {
				if (index === 2) {
					$('.pukes').eq(47).css({
						transform: 'translateX(1.54rem) translateY(-1.48rem) scale(1.08)',
						transition: 'all 0.5s',
						'z-index': 20
					});
				} else if (index === 1) {
					$('.pukes').eq(46).css({
						transform: 'translateX(-0.46rem) translateY(-1.48rem) scale(1.08)',
						transition: 'all 0.5s',
						'z-index': 20
					});
				}
				index--;
				if (index === 0) {
					// 牌堆消失
					setTimeout(function() {
						for (var i = 0; i < 46; i++) {
							$('.pukes').eq(i).css('display', 'none');
						}
					}, 1000);
					// 两张补牌的位置
					$('.card').eq(4).css({
						left: '1.1rem',
						top: '1.48rem'
					});
					$('.card').eq(5).css({
						left: '3.2rem',
						top: '1.48rem'
					});
					clearInterval(addTimer);
				}
			}, 500);
			// 开牌
			setTimeout(function() {
				$('.pukes').fadeOut('fast');
				$('.add').fadeIn('slow');
				game.bankerPoints = (game.bankerPoints + $('.card').eq(4).data('points')) % 10;
				game.playerPoints = (game.playerPoints + $('.card').eq(5).data('points')) % 10;
				console.log(game.bankerPoints, game.playerPoints);
				// 判断是否出现对子
				if (game.randomNum[0] === game.randomNum[1] || game.randomNum[4] === game.randomNum[0] || game.randomNum[4] === game.randomNum[1]) {
					game.isTwo = true;
				}
				if (game.randomNum[2] === game.randomNum[3] || game.randomNum[5] === game.randomNum[2] || game.randomNum[5] === game.randomNum[3]) {
					game.isTwo = true;
				}
				game.settlement();
			}, 3000);
		} else if (game.number === 0)	{
			// 庄家补一张牌
			// 发牌动画
			var addTimer = setInterval(function() {
				// 庄家补牌
				$('.pukes').eq(47).css({
					transform: 'translateX(-0.46rem) translateY(-1.48rem) scale(1.08)',
					transition: 'all 0.5s',
					'z-index': 20
				});
				// 开牌
				$('.card').eq(4).css({
					left: '3.2rem',
					top: '1.48rem'
				});
				clearInterval(addTimer);
			}, 500);
			setTimeout(function() {
				$('.pukes').fadeOut('fast');
				$('.add').eq(0).fadeIn('slow');
				game.bankerPoints = (game.bankerPoints + $('.card').eq(4).data('points')) % 10;
				console.log(game.bankerPoints, game.playerPoints);
				// 判断是否出现对子
				if (game.randomNum[0] === game.randomNum[1] || game.randomNum[4] === game.randomNum[0] || game.randomNum[4] === game.randomNum[1]) {
					game.isTwo = true;
				}
				if (game.randomNum[2] === game.randomNum[3]) {
					game.isTwo = true;
				}
				game.settlement();
			}, 3000);
		} else if (game.number === 1)	{
			// 闲家补一张牌
			// 发牌动画
			var addTimer = setInterval(function() {
				// 闲家补牌
				$('.pukes').eq(47).css({
					transform: 'translateX(1.54rem) translateY(-1.48rem) scale(1.08)',
					transition: 'all 0.5s',
					'z-index': 20
				});
				// 开牌
				$('.card').eq(5).css({
					left: '3.2rem',
					top: '1.48rem'
				});
				clearInterval(addTimer);
			}, 500);
			setTimeout(function() {
				$('.pukes').fadeOut('fast');
				$('.add').eq(1).fadeIn('slow');
				game.playerPoints = (game.playerPoints + $('.card').eq(5).data('points')) % 10;
				console.log(game.bankerPoints, game.playerPoints);
				// 判断是否出现对子
				if (game.randomNum[0] === game.randomNum[1]) {
					game.isTwo = true;
				}
				if (game.randomNum[2] === game.randomNum[3] || game.randomNum[5] === game.randomNum[2] || game.randomNum[5] === game.randomNum[3]) {
					game.isTwo = true;
				}
				game.settlement();
			}, 3000);
		}
	},
	// 游戏结算
	settlement: function() {
		// 最初的金钱
		var origin = Number(window.localStorage.getItem('origin'));
		// 现在的金钱
		var total = Number(window.localStorage.getItem('total'));
		// 盈亏的钱
		var diff = 0; 
		// 庄家点数大
		if (game.bankerPoints > game.playerPoints) {
			console.log('庄胜!');
			// 押了庄家
			if (game.bankerFlag === true) {
				total += game.bankerOdds * game.chip[0];
				$('.banker_change').text('+' + game.chip[0]);
			}
			// 押了闲家
			if (game.playerFlag === true) {
				$('.player_change').text('-' + game.chip[3]);
			}
			if (game.equalFlag === true) {
				$('.equal_change').text('-' + game.chip[1]);
			}
			if (game.twoFlag === true) {
				// 押了对子
				if (game.isTwo === true) {
					total += game.twoOdds * game.chip[2];
					$('.two_change').text('+' + game.chip[2]);
				} else {
					$('.two_change').text('-' + game.chip[2]);
				}
			}
		} else if (game.bankerPoints < game.playerPoints) {
			// 闲家点数大
			console.log('闲胜!');
			if (game.playerFlag === true) {
				total += game.playerOdds * game.chip[3];
				$('.player_change').text('+' + game.chip[3]);
			}
			if (game.bankerFlag === true) {
				$('.banker_change').text('-' + game.chip[0]);
			}
			if (game.equalFlag === true) {
				$('.equal_change').text('-' + game.chip[1]);
			}
			if (game.twoFlag === true) {
				// 押了对子
				if (game.isTwo === true) {
					total += game.twoOdds * game.chip[2];
					$('.two_change').text('+' + game.chip[2]);
				} else {
					$('.two_change').text('-' + game.chip[2]);
				}
			}
		} else if (game.bankerPoints === game.playerPoints) {
			// 相等的情况
			console.log('和!');
			if (game.equalFlag === true) {
				total += game.equalOdds * game.chip[1];
				$('.equal_change').text('+' + game.chip[1]);
			}
			if (game.playerFlag === true) {
				total += game.playerOdds * game.chip[3];
				$('.player_change').text('-' + game.chip[3]);
			}
			if (game.bankerFlag === true) {
				$('.banker_change').text('-' + game.chip[0]);
			}
			if (game.twoFlag === true) {
				// 押了对子
				if (game.isTwo === true) {
					total += game.twoOdds * game.chip[2];
					$('.two_change').text('+' + game.chip[2]);
				} else {
					$('.two_change').text('-' + game.chip[2]);
				}
			}
		}
		diff = total - origin;
		console.log(origin, total);
		if (diff >= 0) {
			// 金钱增加
			$('.odds').text(game.playerOdds);
			$('.change').text('+' + diff);
			// 创建胜利的动画
			setTimeout(function() {
				var vectory = $('<img class="vectory" src="img/胜利.gif" alt="胜利动画">');
				$('body').append(vectory);
				vectory.css('display', 'block');
			}, 3000);
		} else if (diff < 0) {
			// 金币减少
			$('.odds').text(game.bankerOdds);
			$('.change').text(diff);
			// 创建的失败的动画
			setTimeout(function() {
				var defeat = $('<img class="defeat" src="img/失败.gif" alt="失败动画">');
				$('body').append(defeat);
				defeat.css('display', 'block');
			}, 3000);
		}
		// 改变结算面板
		$('.total').text(total);
		// 动画消失，弹出结算板
		setTimeout(function() {
			$('.vectory').css('display', 'none');
			$('.defeat').css('display', 'none');
			$('.mask').css('display', 'block');
			$('.account_board').fadeIn();
			// 改变本金
			$('.money_txt').text(total);
			// 保存本金
			window.localStorage.setItem('total', total);
			window.localStorage.setItem('origin', total);
			// 点击结算面板继续游戏
			$('.account_board').on('click', function() {
				$('.mask').hide();
				$('.account_board').hide();
				$('.clip').show();
				game.delCards();
				game.start(); 
			});
		}, 5000);
	},
	// 回收管理
	delCards: function() {
		// 回收牌
		$('.pukes').remove();
		$('.card').remove();
		// 押注清零
		$('.clip_box img').attr('src', 'img/chip_origin.png');
		$('.clip_box span').text(0);
		// 隐藏计分板
		$('.board').hide();
		// 筹码值复位
		$('.tips_txt').text('押注');
		// 筹码大小还原
		$('.clip_ball').css({
			transform: 'scale(1.0)',
		});
		// 清除动画
		$('.defeat').remove();
		$('.vectory').remove();
		// 清除随机生成的牌
		game.cards = []; 
		game.randomNum = [];
		game.order = 0; 
		game.stage = 0; 
		game.number = 0;  
		game.bankerPoints = 0;
		game.playerPoints = 0;
		game.chip = [0, 0, 0, 0];  
		game.bankerFlag = false;
		game.playerFlag = false;  
		game.equalFlag = false 
		game.twoFlag = false;
		game.isTwo = false;
	}
}
game.init();