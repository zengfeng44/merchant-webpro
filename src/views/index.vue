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
			.ivu-form{
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
			<Form :model="merchantForm" :label-width="80">
				<FormItem label="消费金额：">
					<Input prefix="logo-yen" type="number" v-model="merchantForm.amount" size="large" placeholder="请输入您的消费金额"></Input>
				</FormItem>
			</Form>
			<div class="hbl-member">
				<Card :bordered="false">
					<p slot="title">花伴礼会员专享</p>
					<div class="show-discount">
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
				merchantForm: {
					amount: '',
					score: '0.00'
				}
			}
		},
		mounted: function(){
			let mersn = this.$route.query.mersn;
			let merchant_name = decodeURIComponent(this.$route.query.mchname);
			merchant_name ? merchant_name : this.merchant_name;
			this.$util.title(merchant_name);

			this.initMerchantInfo(mersn, merchant_name);
		},
		watch: {
			merchantForm: {
				handler(val, oldVal){
					this.merchantForm.score = Number(val.amount)
				},
				deep: true
			}
		},
        methods: {
			initMerchantInfo(mersn, merchant_name) {
				if (mersn == null){
					this.$Modal.error({
						title: "提示",
						content: "获取商家信息失败！"
					});
					return false;
				}

				this.mersn = mersn;
				this.merchant_name = merchant_name;
			},
			handleWechatPay(){
				this.$axios.post('merchant/index/wepay', {}).then(function(resp){
					let res = resp.data;
					if (res.code == 0){
						window.location.href = res.result.wechat_pay;
					}
				});
			},
			handleCheckOrder(){
				let that	=	this;
				let mersn	=	this.mersn;
				let amount	=	this.merchantForm.amount;

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

				that.$axios.post('merchant/allinpay/wappay', {
					mersn: mersn,
					trxamt: amount
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