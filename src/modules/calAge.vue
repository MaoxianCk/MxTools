<template>
  <div>
    出生日期
    <el-date-picker v-model="bornDate"
                    size="mini"
                    placeholder="点击选择出生日期"
                    default-value="1990"></el-date-picker>
    <transition name="el-fade-in-linear"
                :duration="5000">
      <div v-show="bornDate!=null">
        <table class="birthDetail">
          <tr>
            <td>农历:</td>
            <td>
              <span v-show="bornCal.gzDay!=null">
                {{bornCal.lYear}}年 {{bornCal.IMonthCn}} {{bornCal.IDayCn}}
                ({{bornCal.gzDay}}年 {{bornCal.gzMonth}}月 {{bornCal.gzDay}}日)
              </span>
            </td>
          </tr>
          <tr>
            <td>周岁:</td>
            <td>{{bornAge}}</td>
          </tr>
          <tr>
            <td>虚岁:</td>
            <td>{{bornNominalAge}}</td>
          </tr>
          <tr>
            <td>属相:</td>
            <td>
              <span style="display:inline-block;">
                {{bornCal.Animal}}
              </span>
              <i v-if="bornCal.Animal">
                <img style="width:24px;vertical-align:middle;margin-left:7px;"
                     :src="require('@/assets/img/animals12/'+bornCal.Animal+'.png')" />
              </i>
            </td>
          </tr>
          <tr>
            <td>星座:</td>
            <td>
              <span style="display:inline-block;">
                {{bornCal.astro}}
              </span>
              <i v-if="bornCal.astro">
                <img style="width:24px;vertical-align:middle;margin-left:7px;"
                     :src="require('@/assets/img/constellation/'+bornCal.astro+'.png')" />
              </i>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              你已经活了{{bornDayCnt}}天，
              度过了人生{{Math.round(bornDayCnt/(100*365)*1000)/10}}%的日子
            </td>
          </tr>
        </table>
        <!-- 10x10方块 -->
        <div>
          <div v-for="i in 10"
               :key="i"
               class="bk-row">
            <div v-for="j in 10"
                 :key="j"
                 class="bk-block">
              <div class="bk-render"
                   v-if="(i-1)*10+j!=bornAge"
                   :class="{'bk-fill':(i-1)*10+j<bornAge}" />
              <div class="bk-render"
                   v-else
                   :style="bkHalfCss" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import moment from 'moment';
import { calendar } from '@/assets/js/calender.js';
export default {
  data () {
    return {
      nowTab: 0,
      bornDate: null,
      bornAge: null,
      bornNominalAge: null,
      bornDayCnt: null,
      bornCal: {
        IDayCn: null,
        IMonthCn: null,
        astro: null,
        cDay: null,
        cMonth: null,
        cYear: null,
        gzDay: null,
        gzMonth: null,
        gzYear: null,
        lYear: null
      },
      // 今年已经过去多少天的百分比
      bkHalf: 0,
      bkHalfCss: null,
    }
  },
  methods: {

  },
  watch: {
    bornDate () {
      let now = moment();
      let born = moment(this.bornDate);
      this.bornCal = calendar.solar2lunar(born.year(), born.month() + 1, born.date());
      this.bornAge = now.diff(born, 'year');
      this.bornDayCnt = now.diff(born, 'days');

      //   this.bornNominalAge = this.bornAge + 1;
      this.bornNominalAge = now.year() - born.year();
      let bornLunar1 = calendar.lunar2solar(born.year(), 1, 1);
      if (born.dayOfYear() < moment(bornLunar1.date, 'YYYY-MM-DD').dayOfYear()) {
        this.bornNominalAge++;
      }
      if (now.dayOfYear() > moment(bornLunar1.date, 'YYYY-MM-DD').dayOfYear()) {
        this.bornNominalAge++;
      }

      // 今年已经过去多少天的百分比
      this.bkHalf =
        100
        -
        Math.round(
          (moment().dayOfYear())
          /
          (moment([now.year()]).isLeapYear() ? 365 : 366)
          * 100
        );

      let t = { background: 'linear-gradient(0deg, rgb(219, 219, 219) ' + this.bkHalf + '%, #00631e ' + this.bkHalf + '%)' }
      this.bkHalfCss = t;
      console.log(this.bkHalfCss)
    }
  }
}
</script>
<style scoped>
.birthDetail tr {
  height: 37px;
}
.birthDetail td {
  vertical-align: middle;
  line-height: 27px;
}
.bk-row {
  margin: 0;
  padding: 0;
}
.bk-block {
  display: inline-block;
  width: 27px;
  height: 27px;
  background-color: rgb(219, 219, 219);
  margin: 5px;
  border-radius: 5px;
  overflow: hidden;
}
.bk-render {
  width: 100%;
  height: 100%;
}
.bk-fill {
  background-color: rgb(0, 99, 30);
}
</style>