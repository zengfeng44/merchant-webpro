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
			.pay_info{
				.pay_title{
					text-align: center;
				}
			}

			.show-discount{
				p{
					margin-bottom: 10px;
				}
			}

			.tips-money{
				color: #ff0000;
				font-size: 24px;
			}

			.qrcode_info{
				background-color: #ffffff;
				margin-top:20px;
				img{
					width: 100%;
				}
				.qr_title{
					padding:8px 3px;
					font-size: 14px;
					text-align: center;
					border-bottom: 1px dashed #9ea7b4;
					margin-bottom: 10px;
					font-weight: bold;
				}
			}
		}
    }
</style>
<template>
    <section class="container">
		<div class="pg-body">
			<div class="pay_info">
				<Card :bordered="false">
					<h2 slot="title" class="pay_title">恭喜，付款成功！</h2>
					<div class="show-discount">
						<p>您本次消费获得 <span class="tips-money">{{product_score}}</span> 花伴礼礼品值。</p>
						<p>微信小程序搜一搜<strong>「花伴礼」</strong>，兑换精美礼品！</p>
					</div>
				</Card>
			</div>
			<div class="qrcode_info">
				<p slot="title" class="qr_title">微信内长按识别小程序码，快速打开花伴礼小程序！</p>
				<img src="../images/xcx_qrcode.png" />
			</div>
		</div>
    </section>
</template>
<script>
    export default {
		data() {
			return {
				product_score: 0
			}
		},
		mounted: function(){
			let prod_amt = this.$route.query.prod_amt;
			this.product_score	=	prod_amt;
		},
        methods: {
			
        }
    }
</script>