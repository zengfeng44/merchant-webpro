<style scoped lang="less">
    .container{
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
		background: #eeeeee;
		padding: 5px;
		header{
			text-align: center;
			h1 {
				padding:10px 5px 3px 5px;
				border-bottom:1px solid #e0e0e0;
			}
		}
		.pg-body{
			.consum-form{
				background: #fff;
				overflow: hidden;
				padding:49px 5px 25px 5px;
			}
			.hbl-member{
				margin-top:20px;
				.show-discount{
					span{
						float:right;
						color: #ed4014;
						padding-right: 20px;
					}
				}
				.hbl-tips{
					margin-top:10px;
					color:#9ea7b4;
					font-size: 12px;
				}
			}
			.formBtn{
				margin-top:20px;
				padding: 5px;
			}
		}
    }
</style>
<template>
    <section class="container">
		<header>
			<h1>{{merchant_name}}</h1>
		</header>
		<div class="pg-body">
			<div class="hbl-member">
				<Card :bordered="false">
					<p slot="title">赠送花伴礼礼品值</p>
					<div class="show-discount">
						<Form :model="merchantForm" :label-width="80">
							<FormItem label="消费金额：">
								<Input type="number" v-model="merchantForm.amount" size="large" @on-change="calcPresentGift" placeholder="请输入会员消费金额"></Input>
							</FormItem>
							<FormItem label="手机号码：">
								<Input type="tel" v-model="merchantForm.mobile" placeholder="请输入会员的手机号码"></Input>
							</FormItem>
						</Form>
						<Divider dashed />
						<p class="hbl-tips">* 微信小程序搜一搜「花伴礼」，前往礼品商城兑换精美礼品！</p>
						<div class="mt-10 text-right">
							<label>赠送礼品值：</label>
							<span style="color:#5cadff;">{{merchantForm.gift_score}}</span>
						</div>
						<div class="mt-10 text-right">
							<label>支付金额：</label>
							<span>¥ {{merchantForm.total_amount}}</span>
						</div>
					</div>
				</Card>
			</div>
			<div class="formBtn">
				<Button type="primary" size="large" shape="circle" long @click="handlePresentGift">确认赠送</Button>
			</div>
		</div>
    </section>
</template>
<script>
    export default {
		data() {
			return {
				mersn : 0,
				merchant_name: '花伴礼',
				gift_rate: 1,
				pay_rate: 0.16,
				merchantForm: {
					amount: '',
					mobile: '',
					gift_score: 0,
					total_amount: 0.00
				},
			}
		},
		components	:	{
		},
		mounted: function(){
			let params	=	{
				mersn	:	this.$route.query.mersn,
				merchant_name : decodeURIComponent(this.$route.query.mchname),
				gift_rate 	:	this.gift_rate	?	this.gift_rate	:	this.$route.query.gift_rate,
				pay_rate	:	this.pay_rate	?	this.pay_rate	:	this.$route.query.pay_rate
			}

			this.initMerchantInfo(params);
		},
        methods: {
			initMerchantInfo(options) {
				if (options.mersn == null){
					this.$Modal.error({
						title: "提示",
						content: "获取商家信息失败！"
					});
					return false;
				}

				this.mersn = options.mersn;
				this.merchant_name = options.merchant_name;
				this.gift_rate = options.gift_rate;
				this.pay_rate = options.pay_rate;


			},
			handlePresentGift () {
				let that	=	this;
				let mersn	=	that.mersn;
				let amount	=	that.merchantForm.amount;
				let mobile	=	that.merchantForm.mobile;

				if (mersn <= 0){
					that.$Modal.error({
						title: "提示",
						content: "获取商家信息失败！"
					});
					return false;
				}

				if (amount <= 0) {
					that.$Modal.error({
						title: "提示",
						content: "输入的消费金额不正确！"
					});
					return false;
				}

				if (!mobile){
					that.$Modal.info({
						title: "提示",
						content: "请填写赠送的会员手机号码！"
					});
					return false; 
				}else if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
					that.$Modal.error({
						title: "提示",
						content: "手机号码有误，请重新填写！"
					});
					return false; 
				}

				// 缓存支付信息
				let merchant_name	=	encodeURIComponent(that.merchant_name);
				let pay_data	=	{
					mersn: mersn,
					merchant_name: merchant_name,
					trxamt: amount,
					mobile: mobile,
					payment_type: 'MPPAY',
					gift_rate: that.gift_rate,
					pay_rate: that.pay_rate
				}
				localStorage.setItem("pay_data", JSON.stringify(pay_data));
				
				window.location.href = "https://merchant.jfhycn.com/web/Wechat/authOpenid";
			},
			calcPresentGift () {
				let amount		=	this.merchantForm.amount;
				let gift_rate	=	this.gift_rate;
				let pay_rate	=	this.pay_rate;

				let gift_score	=	Number(amount * gift_rate).toFixed(2);
				let total_amount = Number(amount * 0.16).toFixed(2);
				this.merchantForm.gift_score = gift_score;
				this.merchantForm.total_amount = total_amount;
			},
			onBridgeReady (wechat_data) {
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
			}
        }
    }
</script>