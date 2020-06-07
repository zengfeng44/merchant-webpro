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
		<div>&nbsp;</div>
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
				pay_data : {}
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
					let wechat_data = res.result;

					if (res.code == 1004) {
						if (typeof WeixinJSBridge == "undefined"){
							if( document.addEventListener ){
								document.addEventListener('WeixinJSBridgeReady', function(){
									that.onBridgeReady(wechat_data);
								}, false);
							}else if (document.attachEvent){
								document.attachEvent('WeixinJSBridgeReady', function(){
									that.onBridgeReady(wechat_data);
								});
								document.attachEvent('onWeixinJSBridgeReady', function(){
									that.onBridgeReady(wechat_data);
								});
							}
						}else{
							that.onBridgeReady(wechat_data);
						}
					} else {
						that.$Modal.error({
							title: "提示",
							content: res.message
						});
					}
				});
			},
			onBridgeReady (wechat_data) {
				let that = this;
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
							window.location.href = "https://merchant.jfhycn.com/web/merchant/presentGift?mersn=" + that.pay_data.mersn;
						} else {
							that.$Modal.info({
								title: "付款提示",
								content: "您已取消付款！",
								onOk: function(){
									window.location.href = "https://merchant.jfhycn.com/web/merchant/presentGift?mersn=" + that.pay_data.mersn;
								}
							});
						}
					}
				); 
			}
        }
    }
</script>