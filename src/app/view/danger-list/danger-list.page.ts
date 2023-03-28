/*
 * @Author: 九阳
 * @Date: 2022-07-28 14:15:07
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 11:44:10
 */
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-danger-list',
  templateUrl: './danger-list.page.html',
  styleUrls: ['./danger-list.page.scss'],
})
export class DangerListComponent implements OnInit, OnChanges {
  state = {
    refreshState: {
      currentState: 'deactivate',
      drag: false
    },
    direction: '',
    endReachedRefresh: false,
  };
  dtPullToRefreshStyle = { height: '100 %' };
  codeValueList = {
    'shyf.dangerSrc': [ // 隐患来源
      {
        itemCode: '1',
        itemCname: '日常排查'
      },
      {
        itemCode: '2',
        itemCname: '综合性排查'
      },
      {
        itemCode: '3',
        itemCname: '专业性排查'
      },
      {
        itemCode: '4',
        itemCname: '季节性排查'
      },
      {
        itemCode: '5',
        itemCname: '重点时段及节假日前排查'
      },
      {
        itemCode: '6',
        itemCname: '事故类比排查'
      },
      {
        itemCode: '7',
        itemCname: '复产复工前排查'
      },
      {
        itemCode: '8',
        itemCname: '外聘专家诊断式排查'
      },
      {
        itemCode: '9',
        itemCname: '管控措施实效'
      },
      {
        itemCode: '10',
        itemCname: '其他'
      },
    ],
    'shyf.dangerLevel': [ // 隐患等级
      {
        itemCode: '1',
        itemCname: '一般隐患'
      },
      {
        itemCode: '2',
        itemCname: '重大隐患'
      },
    ],
    'shyf.hazardDangerType': [ // 隐患类型
      {
        itemCode: '1',
        itemCname: '安全'
      },
      {
        itemCode: '2',
        itemCname: '工艺'
      },
      {
        itemCode: '3',
        itemCname: '电气'
      },
      {
        itemCode: '4',
        itemCname: '仪表'
      },
      {
        itemCode: '5',
        itemCname: '消防'
      },
      {
        itemCode: '6',
        itemCname: '总图'
      },
      {
        itemCode: '7',
        itemCname: '设备'
      },
      {
        itemCode: '8',
        itemCname: '其他'
      },
    ],
    'shyf.dangerManageType': [ // 治理类型
      {
        itemCode: '0',
        itemCname: '即查即改'
      },
      {
        itemCode: '1',
        itemCname: '限期整改'
      },
    ]
  };
  // 我的整改
  listObject: any = [
    // {
    //   dangerName: '测试',
    //   dangerDesc: '测试测试测试测试',
    //   dangerName: '测试测试',
    //   hazardDangerTypeName: '测试测试',
    //   dangerState: '0',
    // }
  ];

  total = 0;
  index = 1;
  pageQuery = {
    page: 1,
    limit: 10,
    queryParams: {
      userId: '',
    },
  };
  userData: any = {
    userName: '',
    loginName: '',
  };
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.userData = this.storage.get('userMsg');
    this.pageQuery.queryParams.userId = this.userData.loginName;
    this.getList(this.pageQuery);
  }
  ngOnChanges() {
    
  }


  async getList(query: any) {
    this.loadingService.loading(true);
    await this.http.post('getNotDoDangerList', query).then(async (res: any) => {
      if (res.code === 200) {
        for (const key of res.data) {
          key.hazardDangerTypeName = await this.getCodeValue(key.hazardDangerType, 'shyf.hazardDangerType');
          this.listObject.push(key);
        }
        
        this.loadingService.loading(false);
        this.total = res.total;
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }

  /**
  * 下拉刷新
  */
  pullToRefresh(event: any): void {
    this.pageQuery.page = 1;
    this.getList(this.pageQuery);
  }

  onClick(): void {
    if (this.total !== this.listObject.length) {
      this.index++;
      this.pageQuery.page = this.index;
      this.getList(this.pageQuery);
    } else {
      this.index = 1;
    }
  }

  async getCodeValue(value, code) {
    let name = '';
    if (this.codeValueList[code].length < 1) {
      const codeValue = await this.http.post('getCodeset', { codeset: code });
      if (codeValue.code === 200) {
        this.codeValueList[code] = codeValue.data;
      }
    }
    for (const key of this.codeValueList[code]) {
      if (value === key.itemCode) {
        name = key.itemCname;
      }
    }
    return name;
  }


  //  我的整改
  checkYH(event: any) : void {
    // 待审核
    if (event.dangerState === '-1') {
      this.router.navigate(['risk-danger-process'], { queryParams: event });
    }
    // 待整改
    if (event.dangerState === '0') {
      this.router.navigate(['risk-danger-review'], { queryParams: event });
    }
    // 待验收
    if (event.dangerState === '1') {
      this.router.navigate(['risk-danger-accept'], { queryParams: event });
    }
    // 关闭、验收
    if (event.dangerState === '6' || event.dangerState === '9') {
      this.router.navigate(['risk-danger-detail'], { queryParams: event });
    }
  }
  titleBack(): void {
    history.go(-1);
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
