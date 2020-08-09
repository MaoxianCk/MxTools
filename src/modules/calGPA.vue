<template>
  <div>
    <el-row type="flex"
            justify="center">
      <el-col>
        <div style="min-width:420px;padding:10px">
          <el-button type="primary"
                     v-model="inputText"
                     size="mini"
                     @click="handleInput">快速导入</el-button>
          <el-table :data="scoreData"
                    :border="false">
            <el-table-column type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column prop="score"
                             label="分数"
                             width="120">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.score"
                          size="mini"
                          width="50"
                          @keyup.native="checkScore(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="credit"
                             label="学分"
                             width="140">
              <template slot-scope="scope">
                <el-input-number size="mini"
                                 v-model.number="scope.row.credit"
                                 :min="1"
                                 :max="30"
                                 @keyup.native="scope.row.score=scope.row.score.replace(/\D/g,'')"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="scope">
                <i class="el-icon-remove-outline"
                   style="font-size: 22px;margin-top:3px;cursor: pointer;"
                   @click="removeRow(scope.$index)"></i>
              </template>
            </el-table-column>
            <div slot="append"
                 @click="addRow()"
                 style="text-align: center;line-height: 42px;cursor: pointer;">
              <i class="el-icon-circle-plus-outline"
                 style="font-size: 18px;margin-top:3px;">增加一行</i>
            </div>
          </el-table>
        </div>
      </el-col>
      <el-col :span="24">
        <div>
          <div class="mt10">
            <div>
              <p>
                标准加权计算 : <strong>{{ scoreRes.average }}</strong> / 100
                <el-tooltip content="∑(成绩*学分)÷∑学分"
                            placement="top">
                  <i class="ml10 el-icon-info" />
                </el-tooltip>
              </p>
              <p>
                北大GPA : <strong>{{ scoreRes.GPA }}</strong> / 4.0
                <el-tooltip content="∑(单科绩点*学分)÷∑学分"
                            placement="top">
                  <i class="ml10 el-icon-info" />
                </el-tooltip>
              </p>
            </div>
          </div>
        </div>
        <div class="gpaDetail mt10">
          <table class="score">
            <caption>北大GPA算法</caption>
            <tr>
              <td>成绩</td>
              <td>学分</td>
            </tr>
            <tr v-for="(item,index) in pekingGpaRe"
                :key="index">
              <td>[{{pekingScoreSplitRe[index]}},{{pekingScoreSplitRe[index+1]+1}}]</td>
              <td>{{item}}</td>
            </tr>
          </table>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="switchInput"
               :before-close="handleClose"
               width="85%"
               title="快速导入">
      <el-row v-if="$store.state.screenWidth<992"
              class="mb10">
        <el-col>
          <!-- 1 -->
          <div class="input-title">粘贴成绩文本
            <el-button type="warning"
                       style="margin-top:5px;margin-bottom:5px;margin-left:5px;"
                       size="mini"
                       @click="inputText=''">清空</el-button>
          </div>
          <el-input type="textarea"
                    v-model="inputText"
                    :placeholder="inputExample"
                    :autosize="{ minRows: 10}">
          </el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12"
                v-if="$store.state.screenWidth>=992">
          <!-- 1 -->
          <div class="input-title">粘贴成绩文本
            <el-button type="warning"
                       style="margin-top:5px;margin-bottom:5px;margin-left:5px;"
                       size="mini"
                       @click="inputText=''">清空</el-button>
          </div>
          <el-input type="textarea"
                    v-model="inputText"
                    :placeholder="inputExample"
                    :autosize="{ minRows: 10}">
          </el-input>
        </el-col>

        <el-col :span="$store.state.screenWidth>=992?12:24">
          <div class="input-title">矫正选区</div>
          <!-- 2 -->
          <el-table border
                    style="width:100%"
                    v-if="inputlock"
                    :key="inputKey"
                    :data="inputData.inputSrcData"
                    id="mounth">
            <el-table-column v-for="(item, index) in inputData.inputSrcData[0]"
                             min-width="150"
                             :key="index">
              <template slot="header">
                <el-select v-model="inputData.inputTableSelect[index]"
                           @change="selectChange(index);"
                           style="width:100%"
                           size="mini">
                  <el-option label="-"
                             :value="0" />
                  <el-option label="学分"
                             :value="1" />
                  <el-option label="成绩"
                             :value="2" />
                </el-select>
              </template>
              <template slot-scope="scope">
                {{inputData.inputSrcData[scope.$index][index]}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="switchInput = false">取 消</el-button>
        <el-button type="primary"
                   @click="handleInputConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      scoreData: [
        {
          score: null,
          credit: 2
        }
      ],
      average: 0,
      GPA: 0,
      sumCredit: 0,
      pekingScoreSplit: [0, 59, 63, 67, 71, 74, 77, 81, 84, 89, 100],
      pekingGpa: [0, 1.0, 1.5, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0],
      pekingScoreSplitRe: [100, 89, 84, 81, 77, 74, 71, 67, 63, 59, -1],
      pekingGpaRe: [4.0, 3.7, 3.3, 3.0, 2.7, 2.3, 2.0, 1.5, 1.0, 0],

      switchInput: false,
      inputText: '',
      inputData: {
        inputSrcData: [],
        inputTableSelect: []
      },
      inputCreditIndex: null,
      inputScoreIndex: null,
      inputlock: true,
      inputKey: 0,
      inputExample:
        "目前仅支持以tab为分隔符划分列。例子如下:\n" +
        "1	高等数学	2	100		正常		\n" +
        "2	程序设计	2	100		正常		\n" +
        "3	线性代数	2	100		正常		\n" +
        "4	操作系统	2	100		正常		\n" +
        "5	Linux 操作系统	1	100		正常		\n"
    };
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => { });
    },
    handleInputConfirm () {
      if (this.inputScoreIndex == null && this.inputCreditIndex == null) {
        this.$message.error('未选择成绩或学分列');
        return;
      }
      this.scoreData = [];
      for (let line of this.inputData.inputSrcData) {
        let score = this.inputScoreIndex == null ? null : parseInt(line[this.inputScoreIndex]);
        let credit = this.inputCreditIndex == null ? null : parseInt(line[this.inputCreditIndex]);
        if (!isNaN(score) && !isNaN(credit)) {
          this.scoreData.push({
            score: isNaN(score) ? null : score,
            credit: isNaN(credit) ? null : credit
          })
        }
      }
      this.switchInput = false;
    },
    selectChange (index) {
      console.log(index)
      for (let i in this.inputData.inputTableSelect) {
        if (i != index && this.inputData.inputTableSelect[i] == this.inputData.inputTableSelect[index]) {
          this.inputData.inputTableSelect[i] = 0;
        }
        this.inputCreditIndex = null;
        this.inputScoreIndex = null;
        if (this.inputData.inputTableSelect[i] == 1) {
          this.inputCreditIndex = i;
        }
        if (this.inputData.inputTableSelect[i] == 2) {
          this.inputScoreIndex = i;
        }
      }
      // 通过修改key值，强制重新渲染table
      this.inputKey = (this.inputKey + 1) % 7;
    },
    dealText () {
      this.inputData = {
        inputSrcData: [],
        inputTableSelect: []
      };
      let lines = this.inputText.trim().split('\n');
      let sums = []
      for (let line of lines) {
        let lineItem = line.trim().split(/\t+/);
        // console.log(lineItem);
        this.inputData.inputSrcData.push(lineItem);
        for (let i in lineItem) {
          // console.log(i + ' ' + sums.length)
          if (i == sums.length) {
            sums.push(0);
            this.inputData.inputTableSelect.push(0);
          }
          sums[i] += parseFloat(lineItem[i]);
        }
      }
      // 猜测学分列和成绩列
      // console.log(sums)
      this.inputScoreIndex = 0;
      this.inputCreditIndex = 0;
      let flagScore = false;
      let flagCredit = false;
      for (let i in sums) {
        // // 求和方式过滤序号列
        // if (sums[i] == (1 + this.inputData.inputSrcData.length) * this.inputData.inputSrcData.length / 2) {
        //   sums[i] = NaN
        // }
        // sums[i] = sums[i] / this.inputData.inputSrcData.length
        // 最小值为学分，最大值为分数
        if (!isNaN(sums[i]) && sums[i] >= sums[this.inputScoreIndex]) {
          this.inputScoreIndex = i;
          flagScore = true;
        }
        if (!isNaN(sums[i]) && sums[i] <= sums[this.inputCreditIndex]) {
          this.inputCreditIndex = i;
          flagCredit = true;
        }
      }
      if (flagCredit) {
        this.inputData.inputTableSelect[this.inputCreditIndex] = 1;
      } else {
        this.inputCreditIndex = null;
      }
      if (flagScore) {
        this.inputData.inputTableSelect[this.inputScoreIndex] = 2;
      } else {
        this.inputScoreIndex = null;
      }
      // console.log(sums + ' ' + this.inputCreditIndex + ' ' + this.inputScoreIndex)
    },
    handleInput () {
      this.switchInput = true;
    },
    addRow () {
      this.scoreData.push({
        score: null,
        credit: 2,
      });
    },
    removeRow (index) {
      this.scoreData.splice(index, 1);
    },
    cal () {
      this.average = 0;
      this.GPA = 0;
      this.sumCredit = 0;
      for (let item of this.scoreData) {
        if (item.score || item.credit !== 0) {
          if (item.credit !== 0 && !item.score) {
            item.score = 0;
          }
          this.sumCredit += item.credit;
          //标准加权
          this.average += item.score * item.credit;

          //北大gpa
          this.GPA += item.credit * this.getPekingGPA(item.score);
        }
      }
      this.average = this.sumCredit ? parseFloat((this.average / this.sumCredit).toFixed(6)) : 0;
      this.GPA = this.sumCredit ? parseFloat((this.GPA / this.sumCredit).toFixed(3)) : 0;
    },
    //北大GPA算法
    getPekingGPA (score) {
      if (score == 0) {
        return 0;
      }
      return this.pekingGpa[this.pekingScoreSplit.findIndex(el => el >= score) - 1];
    },
    checkScore (row) {
      if (row.score > 100) {
        row.score = 100;
        this.$message.warning('分数范围[0,100]')
      }
      row.score = parseInt(row.score.toString().replace(/\D/g, ''));
    },
  },
  created () {
    
  },
  computed: {
    scoreRes () {
      this.cal();
      return {
        average: this.average,
        GPA: this.GPA
      }
    }
  },
  watch: {
    inputText () {
      this.dealText();
    }
  }
}
</script>
<style scoped>
.score {
  line-height: 20px;
}
.gpaDetail {
  margin-top: 50px;
  font-size: 14px;
}
.gpaDetail table {
  width: 120px;
}
.gpaDetail caption {
  font-weight: 600;
}
#app td {
  border: 0;
}
table {
  line-height: 12px;
}
.info {
  font-size: 12px;
  color: #909399;
}

.input-title {
  height: 50px;
  font-size: 14px;
}
</style>