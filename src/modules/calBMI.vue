<template>
  <div>
    <el-row>
      身高:
      <el-input-number size="mini"
                       class="ml10 mr10"
                       v-model="height"></el-input-number>
      厘米(cm)
    </el-row>
    <el-row class="mt5">
      体重:
      <el-input-number size="mini"
                       class="ml10"
                       v-model="weight"></el-input-number>
      <el-select v-model="unit"
                 class="ml10"
                 size="mini"
                 style="width:120px"
                 @change="changeUnit">
        <el-option v-for="item in unitOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </el-row>
    <table class="birthDetail">
      <tr>
        <td width="47px">身高:</td>
        <td>
          {{height}}cm
        </td>
      </tr>
      <tr>
        <td>体重:</td>
        <td>{{getWeightKg()}}千克</td>
      </tr>
      <tr>
        <td colspan="2"
            style="padding-left:50px">{{getWeightKg()}}公斤</td>
      </tr>
      <tr>
        <td colspan="2"
            style="padding-left:50px">{{getWeightJin()}}斤</td>
      </tr>
      <tr>
        <td colspan="2"
            style="padding-left:50px">{{getWeightLb()}}磅</td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      weight: 60,
      height: 170,
      // 'kg'表示公斤或千克，jin表示斤，lb表示磅
      unit: 'kg',
      unitOptions: [
        {
          label: '千克 / 公斤',
          value: 'kg'
        },
        {
          label: '斤',
          value: 'jin'
        },
        {
          label: '磅',
          value: 'lb'
        }
      ],
      unitKey: 'CAL_BMI_UNIT',
      lbKg: 0.45359237,// 1lb === 0.45359237kg

      BMI: [
        {
          max: 15,
          info: '非常严重的体重不足'
        },
        {
          max: 16,
          info: '严重体重不足'
        },
        {
          max: 18.5,
          info: '过轻'
        },
        {
          max: 25,
          info: '体重正常'
        },
        {
          max: 30,
          info: '过重'
        },
        {
          max: 35,
          info: '肥胖'
        },
        {
          max: 40,
          info: '严重肥胖'
        },
        {
          max: Infinity,
          info: '非常严重的肥胖'
        },
      ]
    }
  },
  methods: {
    // 获取当前用于计算的单位，若不合法或无历史记录则默认为kg
    initUnit () {
      this.unit = null;
      if (window.localStorage) {
        this.unit = localStorage.getItem(this.unitKey);
      }
      if (this.unitOptions.map(obj => { return obj.value }).indexOf(this.unit) === -1) {
        this.changeUnit('kg');
      }
    },
    changeUnit (val) {
      this.unit = val;
      localStorage.setItem(this.unitKey, val);
    },
    getWeightKg () {
      // 将当前体重转换成kg
      let ans;
      if (this.unit === 'jin') {
        ans = this.weight / 2;
      } else if (this.unit === 'lb') {
        ans = this.weight * this.lbKg;
      } else {
        ans = this.weight;
      }
      return Math.round(ans * 100) / 100;
    },
    getWeightJin () {
      let ans;
      if (this.unit === 'kg') {
        ans = this.weight * 2;
      } else if (this.unit === 'lb') {
        ans = this.weight * this.lbKg * 2;
      } else {
        ans = this.weight;
      }
      return Math.round(ans * 100) / 100;
    },
    getWeightLb () {
      let ans;
      if (this.unit === 'kg') {
        ans = this.weight / this.lbKg;
      } else if (this.unit === 'jin') {
        ans = this.weight / this.lbKg / 2;
      } else {
        ans = this.weight;
      }
      return Math.round(ans * 100) / 100;
    },
    getBMI () {
      let weightkg = this.getWeightKg();
      let BMI = weightkg / Math.pow(this.height, 2);
      let levelIndex;
      for (let i in this.BMI) {
        if (BMI < this.BMI[i].max) {
          levelIndex = i;
        }
      }
      return {
        BMI: BMI,
        level: levelIndex,
      }
    }
  },
  created () {
    this.initUnit();
  }
}
</script>
<style scoped>
table {
  margin-top: 20px;
  margin-left: -2px;
}
table tr {
  height: 27px;
}
table td {
  vertical-align: middle;
  line-height: 27px;
}
.right {
  text-align: right;
}
</style>