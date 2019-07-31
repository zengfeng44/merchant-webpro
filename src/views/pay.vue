<style scoped lang="less">
    .container{
        width: 100%;
		height:100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
		background: #eeeeee;
		padding: 5px;
    }
</style>
<template>
    <section class="container">
		<div>
			<!--
let pay_data	=	{
					mersn: mersn,
					merchant_name: merchant_name,
					trxamt: amount,
					mobile: mobile,
					payment_type: 'MPPAY',
					gift_rate: that.gift_rate,
					pay_rate: that.pay_rate
				}

			-->
			<p>{{pay_data.mersn}}</p>
			<p>{{pay_data.merchant_name}}</p>
			<p>{{pay_data.trxamt}}</p>
			<p>{{pay_data.mobile}}</p>
			<p>{{pay_data.payment_type}}</p>
			<p>{{pay_data.gift_rate}}</p>
			<p>{{pay_data.pay_rate}}</p>
			<div>
				{{message}}
			</div>
		</div>
		<Modal
			v-model="TipsModal.disTips"
			title="付款提示"
			okText="我已完成支付"
			cancelText="取消"
			:maskClosable="TipsModal.maskClosable"
			@on-ok="handleFinshed"
			@on-cancel="handleHelp">
			<p>请在打开的微信支付中完成付款，支付完成前请不要关闭该窗口！</p>
		</Modal>
    </section>
</template>
<script>
    export default {
		data() {
			return {
				message: "",
				TipsModal : {
					maskClosable : false,
					disTips : true,
				},
				pay_data : {},
				wechat_data: {}
			}
		},
		mounted: function(){
			let pay_data	=	localStorage.getItem("pay_data");
			pay_data		=	JSON.parse(pay_data);
			
			let openid		=	this.$route.query.openid;
			pay_data.openid	=	openid;
			this.pay_data	=	pay_data;

			this.startWechatPay();
		},
        methods: {
			startWechatPay() {
				let that = this;
				that.$axios.post('merchant/allinpay/wechatpay', that.pay_data).then(function(resp){
					let res = resp.data;
					that.wechat_data = res.result;

					if (res.code == 1004) {
						if (typeof WeixinJSBridge == "undefined"){
							if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
							}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
							}
						}else{
							that.onBridgeReady();
						}
					} else {
						that.$Modal.error({
							title: "提示",
							content: res.message
						});
					}
				});
			},
			onBridgeReady () {
				let wechat_data = this.wechat_data;
				alert("Wechat Data: " + JSON.stringify(wechat_data));
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId" : wechat_data.appId,
						"timeStamp" : wechat_data.timeStamp,
						"nonceStr" : wechat_data.nonceStr,
						"package" : wechat_data.package,
						"signType" : wechat_data.signType,
						"paySign" : wechat_data.paySign
					},
					function(res){
						if(res.err_msg == "get_brand_wcpay_request:ok" ){
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
						}
					}
				); 
			},
			handleFinshed () {
				window.location.href = "https://merchant.jfhycn.com/web/merchant/presentGift?mersn=" + this.pay_data.mersn;
			},
			handleHelp () {
				window.location.href = "https://merchant.jfhycn.com/web/merchant/presentGift?mersn=" + this.pay_data.mersn;
			}
        }
    }
</script>