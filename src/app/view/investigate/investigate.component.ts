/*
 * @Author: 九阳
 * @Date: 2022-07-26 15:05:17
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-11 12:12:12
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-investigate',
  templateUrl: './investigate.component.html',
  styleUrls: ['./investigate.component.less'],
})
export class InvestigateComponent implements OnInit, OnDestroy {

  pageQuery = {
    page: 1,
    limit: 99,
    queryParams: {
      hazardCode: '',
      unitId: '',
      userId: ''
    },
  };
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
  objectData: any = [
    //   {
    //   hazardName: '测试', // 装置名称
    //   taskState: '0', // 任务状态
    //   riskUnitName: '宝信软件', // 单元名称
    //   leftTime: '12', // 任务剩余时间
    //   troubleshootContent: '从生产商菜市场错错错错错错错错错', // 任务内容
    //   // 排查周期分为两部分
    //   checkCycle: '1',
    //   checkCycleUnit: '周',
    // }
  ];
  userData: any = {
    userName: '',
    loginName: '',
  };
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    let details: any;
    this.userData = this.storage.get('userMsg');
    this.route.queryParams.subscribe((params) => {
      details = JSON.parse(JSON.stringify(params));
    });
    this.pageQuery.queryParams.hazardCode = details.hazardCode;
    this.pageQuery.queryParams.unitId = details.unitId;
    this.pageQuery.queryParams.userId = this.userData.loginName;
    this.getList(this.pageQuery);
  }

  async getList(query) {
    this.loadingService.loading(true);
    await this.http.post('getTaskListByRQ', query).then((res: any) => {
      if (res.code === 200) {
        this.objectData = res.data;
        this.loadingService.loading(false);
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }
  // 正常
  async onNormal(object: any) {
    const data = {
      id: this.checkService.getGuid(),
      checkTaskId: object.id,
      userId: this.userData.loginName,
      checkTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      checkStatus: '0',
    };
    this.loadingService.loading(true);
    await this.http.post('sureTask', data).then((res: any) => {
      if (res.code === 200) {
        this.loadingService.loading(false);
        this.getList(this.pageQuery);
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });

  }

  // 异常
  onAbnormal(object: any) {
    const ids = this.checkService.getGuid();
    const data = {
      id: ids,
      checkTaskId: object.id,
      userId: this.userData.loginName,
      checkTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      checkStatus: '1',
    };
    object.checkRecordId = ids;
    const list = {
      sureTask: JSON.stringify(data),
      params: JSON.stringify(object),
    };
    this.router.navigate(['./risk-danger-add'], { queryParams: list });
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
}
