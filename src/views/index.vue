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
			<Form :model="merchantForm" :label-width="80" class="consum-form">
				<FormItem label="消费金额：">
					<Input prefix="logo-yen" type="number" v-model="merchantForm.amount" size="large" @on-change="handleCalcGift" placeholder="请输入您的消费金额"></Input>
				</FormItem>
			</Form>
			<div class="hbl-member">
				<Card :bordered="false">
					<p slot="title">花伴礼会员专享</p>
					<div class="show-discount">
						<Form :model="merchantForm">
							<FormItem>
								<Input type="tel" v-model="merchantForm.mobile" @on-change="checkMobile" placeholder="请输入您的手机号码登录/注册花伴礼会员"></Input>
							</FormItem>
							<Row v-if="check_member == 'show'">
								<Col span="14">
									<FormItem>
										<Input type="tel" v-model="merchantForm.smscode" placeholder="手机短信验证码"></Input>
									</FormItem>
								</Col>
								<Col span="8" offset="2">
									<FormItem>
										<Button type="primary" @click="handleSendSmscode" v-bind:disabled="sendsms_data.state">{{sendsms_data.button_text}}</Button>
									</FormItem>
								</Col>
							</Row>
						</Form>
						<Divider dashed />
						<label>礼品值：</label>
						<span>{{merchantForm.score}}</span>
						<p class="hbl-tips">* 花伴礼会员在该商家消费的每笔金额都可获得礼品值！</p>
					</div>
				</Card>
			</div>
			<div class="formBtn">
				<Button type="primary" size="large" shape="circle" long @click="handleCheckOrder">确认付款</Button>
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
				check_member: '',	// checked：已注册的会员, show：未注册的会员
				merchantForm: {
					member_id: 0,
					mobile: '',
					smscode: '',
					amount: '',
					score: '0.00'
				},
				sendsms_data: {
					count_time: 10,
					state: false,
					button_text: "发送短信验证码",
				}
			}
		},
		mounted: function(){
			let mersn = this.$route.query.mersn;
			let merchant_name = decodeURIComponent(this.$route.query.mchname);
			let gift_rate = this.$route.query.gift_rate;
			
			merchant_name	=	merchant_name ? merchant_name : this.merchant_name;
			gift_rate		=	gift_rate ? gift_rate : 1;
			
			this.$util.title(merchant_name);
			this.initMerchantInfo(mersn, merchant_name, gift_rate);
		},
        methods: {
			initMerchantInfo(mersn, merchant_name, gift_rate) {
				if (mersn == null){
					this.$Modal.error({
						title: "提示",
						content: "获取商家信息失败！"
					});
					return false;
				}

				this.mersn = mersn;
				this.merchant_name = merchant_name;
				this.gift_rate = gift_rate;
			},
			checkMobile () {
				let that = this;
				let mobile = that.merchantForm.mobile;
				if (mobile.length == 11){
					that.$axios.post('merchant/index/checkMember', {
						mobile: mobile,
					}).then(function(resp){
						let res = resp.data;
						if (res.code == 2001){
							that.check_member	=	'show';
						}else if (res.code == 0) {
							that.check_member	=	'checked';
							that.merchantForm.member_id	=	res.result.member_id;
						}
					});
				}
			},
			handleSendSmscode () {
				let that = this;
				let mobile = that.merchantForm.mobile;

				if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
					that.$Message.error('手机号码有误，请重新填写！');
					return false; 
				}

				that.$axios.post('merchant/index/sendSmscode', {
					mobile: mobile
				}).then(function(resp){
					let res = resp.data;
					if (res.code == 0) {
						that.$Message.success("短信验证码发送成功！");
						that.sendsms_data.state = true;
						let clock = window.setInterval(() => {
							that.sendsms_data.count_time--;
							that.sendsms_data.button_text = that.sendsms_data.count_time + 's后重新发送';
							
							if (that.sendsms_data.count_time <= 0){
								window.clearInterval(clock);
								that.sendsms_data.state = false;
								that.sendsms_data.button_text = "发送短信验证码";
								that.sendsms_data.count_time = 90;
							}
						}, 1000);
					} else {
						that.$Message.error(res.message);
					}
				});
			},
			handleCalcGift () {
				let amount		=	this.merchantForm.amount;
				let gift_rate	=	this.gift_rate;
				let gift_score	=	Number(amount * gift_rate).toFixed(2);
				
				this.merchantForm.score = gift_score;
			},
			handleCheckOrder(){
				let that	=	this;
				let mersn	=	this.mersn;
				let amount	=	this.merchantForm.amount;
				let mobile	=	this.merchantForm.mobile;
				let smscode	=	this.merchantForm.smscode;

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
						content: "消费金额不正确！"
					});
					return false;
				}

				if (!mobile){
					that.$Modal.info({
						title: "提示",
						content: "请填写您的手机号码，用于获取花伴礼会员礼品值！"
					});
					return false; 
				}else if(!(/^1[3456789]\d{9}$/.test(mobile))){ 
					that.$Modal.error({
						title: "提示",
						content: "手机号码有误，请重新填写！"
					});
					return false; 
				}

				if (that.check_member == 'show' && !smscode){
					that.$Modal.error({
						title: "提示",
						content: "请输入您收到的短信验证码！"
					});
					return false; 
				}

				that.$axios.post('merchant/allinpay/wappay', {
					mersn: mersn,
					trxamt: amount,
					mobile: mobile,
					smscode: smscode
				}).then(function(resp){
					let res = resp.data;
					if (res.code == 0) {
						const div = document.createElement('div');
						div.innerHTML = res.result;
						document.body.appendChild(div);
						document.forms['allinpay_form'].submit();
					} else {
						that.$Modal.error({
							title: "提示",
							content: res.message
						});
					}
				});
			}
        }
    }
</script>