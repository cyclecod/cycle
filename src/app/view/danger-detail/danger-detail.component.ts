/*
 * @Author: 九阳
 * @Date: 2022-08-01 09:40:37
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-09 16:34:45
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService, FILE_URL } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
@Component({
  selector: 'ph-danger-detail',
  templateUrl: './danger-detail.component.html',
  styleUrls: ['./danger-detail.component.less'],
})
export class DangerDetailComponent implements OnInit, OnDestroy {

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
    ],
    'shyf.dangerState': [ // 整改状态
      {
        itemCode: '0',
        itemCname: '整改中'
      },
      {
        itemCode: '1',
        itemCname: '待验收'
      },
      {
        itemCode: '9',
        itemCname: '已验收'
      },
    ]
  };
  objectData: any = {
    hazardDangerTypeName: '', // 隐患类型
    dangerLevelName: '0', // 隐患等级
    dangerSrcName: '宝信软件', // 隐患来源
    dangerDesc: '12', // 隐患描述
    dangerManageTypeName: '从生产商菜市场错错错错错错错错错', // 治理类型
    // 排查周期分为两部分
    dangerReason: '1', // 形成原因
    dangerManageDeadline: '周', // 计划完成时间
    registrant: '', // 整改人名称
    // state: '0', // 任务状态
  };
  userData: any = {
    userName: '',
    loginName: '',
  };
  fileList: any = [];
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
    details.hazardDangerTypeName = this.getCodeValue(details.hazardDangerType, 'shyf.hazardDangerType');
    details.dangerLevelName = this.getCodeValue(details.dangerLevel, 'shyf.dangerLevel');
    details.dangerSrcName = this.getCodeValue(details.dangerSrc, 'shyf.dangerSrc');
    details.dangerManageTypeName = this.getCodeValue(details.dangerManageType, 'shyf.dangerManageType');
    this.objectData = details;
    this.getImage(details.dangerImg);

  }

  titleBack(): void {
    window.history.go(-1);
  }

  getImage(dangerImg: any): void {
    if (this.isNull(dangerImg)) {
      const list = dangerImg.split(',');
      for (const key of list) {
        const object: any = {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          url: FILE_URL + key,
        };
        this.fileList.push(object);
      }
    }
  }

  isNull(value: any): boolean {
    if (value !== null && value !== undefined && value !== '') {
      return true;
    }
    return false;
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
