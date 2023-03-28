/*
 * @Author: 九阳
 * @Date: 2022-08-01 09:40:37
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-01 16:53:36
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
@Component({
  selector: 'ph-investigate-detail',
  templateUrl: './investigate-detail.component.html',
  styleUrls: ['./investigate-detail.component.less'],
})
export class InvestigateDetailComponent implements OnInit, OnDestroy {

  codeValueList = {
    'shyf.taskState': [ // 治理类型
      {
        itemCode: '1',
        itemCname: '待排查'
      },
      {
        itemCode: '2',
        itemCname: '已排查'
      },
      {
        itemCode: '3',
        itemCname: '超期未排查'
      },
    ]
  };
  objectData: any = {
    hazardName: '测试', // 装置名称
    hazardCode: '0', // 装置编号
    eventName: '宝信软件', // 事件名称
    riskMeasureName: '12', // 措施名称
    riskUnitName: '从生产商菜市场错错错错错错错错错', // 单元名称
    // 排查周期分为两部分
    checkCycleName: '1', // 巡检周期
    leftTime: '周', // 排查剩余时间
    troubleshootContent: '', // 排查内容
    state: '0', // 任务状态
  };
  userData: any = {
    userName: '',
    loginName: '',
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService
  ) {
  }

  ngOnInit() {
    let details: any;
    this.userData = this.storage.get('userMsg');
    this.route.queryParams.subscribe((params) => {
      details = JSON.parse(JSON.stringify(params));
    });
    this.objectData = details;
  }

  titleBack(): void {
    window.history.go(-1);
  }

  getCodeValue(value: string, code: string): string {
    let name = '';
    for (const key of this.codeValueList[code]) {
      if (value === key.itemCode) {
        name = key.itemCname;
      }
    }
    return name;
  }
  ngOnDestroy(): void {
  }

  autopayStyle = {
    'margin-left': '12px',
    padding: '0 3px',
    'background-color': '#fff',
    'border-radius': '2px',
    color: '#f19736',
    border: '1px solid #f19736'
  };
  autopayStyle1 = {
    'margin-left': '12px',
    padding: '0 3px',
    'background-color': '#fff',
    'border-radius': '2px',
    color: '#188CFF',
    border: '1px solid #188CFF'
  };
  autopayStyle2 = {
    'margin-left': '12px',
    padding: '0 3px',
    'background-color': '#fff',
    'border-radius': '2px',
    color: '#00CC12',
    border: '1px solid #00CC12'
  };
}
