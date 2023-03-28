/*
 * @Author: 九阳
 * @Date: 2022-08-01 09:40:37
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 15:58:12
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService, FILE_URL } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
import { PickerService, PickerRef } from 'ng-zorro-antd-mobile';
import { LoadingService } from '../../service/loading.service';
import { codeValueComponent } from '../../data/static-data.component';

@Component({
  selector: 'ph-danger-accept',
  templateUrl: './danger-accept.component.html',
  styleUrls: ['./danger-accept.component.less'],
})
export class DangerAcceptComponent implements OnInit, OnDestroy {
  @ViewChild('phImage') phImage: any;
  codeValueList = codeValueComponent;
  objectData: any = {
    hazardDangerTypeName: '', // 隐患类型
    dangerLevelName: '', // 隐患等级
    dangerSrcName: '', // 隐患来源
    dangerDesc: '', // 隐患描述
    dangerManageTypeName: '', // 治理类型
    // 排查周期分为两部分
    dangerReason: '', // 形成原因
    dangerManageDeadline: '', // 计划完成时间
    registrant: '', // 整改人名称
  };
  objectReview = {
    reviewContent: '',
    dangerState: '9', // 整改中
    dangerStateName: '已验收',
    dangerId: '',
    mendUserId: '',
  };
  userData: any = {
    userName: '',
    loginName: '',
  };
  listData: any = [
    // {
    //   dangerId: '', //  隐患编号
    //   registrant: '张三', // 登记人
    //   registTime: '2021-12-12 10:25:45', // 登记时间
    //   mendPerson: '张三', // 整改人
    //   mendTime: '2021-12-12 10:25:45', // 整改时间
    //   mendDesc: '治理描述'  // 治理描述
    // }
  ];
  fileList = [];
  dangerImgList: any = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private _picker: PickerService,
    private loadingService: LoadingService

  ) {
  }

  ngOnInit() {
    let details: any;
    this.userData = this.storage.get('userMsg');
    this.route.queryParams.subscribe((params) => {
      details = JSON.parse(JSON.stringify(params));
    });
    this.initAdd(details);
  }

  initAdd(details: any): void {
    details.hazardDangerTypeName = this.getCodeValue(details.hazardDangerType, 'shyf.hazardDangerType');
    details.dangerLevelName = this.getCodeValue(details.dangerLevel, 'shyf.dangerLevel');
    details.dangerSrcName = this.getCodeValue(details.dangerSrc, 'shyf.dangerSrc');
    details.dangerManageTypeName = this.getCodeValue(details.dangerManageType, 'shyf.dangerManageType');
    this.objectData = details;
    this.objectReview.dangerId = details.id;
    this.objectReview.mendUserId = this.userData.loginName;
    this.getImage(details.dangerImg);
  }


  titleBack(): void {
    history.go(-1);
  }
  getImage(dangerImg: any): void {
    if (this.isNull(dangerImg)) {
      const list = dangerImg.split(',');
      for (const key of list) {
        const object: any = {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          url: FILE_URL + key,
        };
        this.dangerImgList.push(object);
      }
    }
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


  getSelect(code: string): any {
    const data = [];
    const list = this.codeValueList[code];
    for (const key of list) {
      data.push(key['itemCname']);
    }
    return data;
  }
  getResult(code: string, value: string): string {
    for (const key of this.codeValueList[code]) {
      if (key['itemCname'] === value) {
        return key['itemCode'];
      }
    }
    return '';
  }

  showPicker(code: string, key: string): void {
    this._picker.showPicker(
      { value: [], data: this.getSelect(code) },
      result => {
        this.objectReview[key + 'Name'] = result[0];
        this.objectReview[key] = this.getResult(code, result[0]);
      }
    );
  }

  onSave(): void {
    if (this.check()) {
      const object = this.setObject();
      this.saveData(object);
    }
  }

  async saveData(object) {
    if (this.fileList.length > 0) {
      object.dangerImgAfter = await this.fileUpload();
    }
    this.loadingService.loading(true);
    await this.http.post('acceptDanger', object).then((res: any) => {
      if (res.code === 200) {
        this.loadingService.loading(false);
        this.checkService.commonToast('保存成功', 500);
        this.titleBack();
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }
  setObject(): any {
    const object = this.objectReview;
    return object;
  }

  async fileUpload() {
    let fileIds = '';
    await this.phImage.uploadImage(this.fileList, 'eventUpload?docTag=dangerFile');
    const list = [];
    for (const key of this.fileList) {
      if (this.isNull(key.id)) {
        list.push(key.id);
      } else {
        return;
      }
    }
    fileIds = list.join(',');
    return fileIds;
  }
  check() : boolean {
    let error = '';
    if (!this.isNull(this.objectReview.dangerState)) {
      error = error + '隐患状态不能是空.';
    }
    if (!this.isNull(this.objectReview.reviewContent)) {
      error = error + '验收意见不能是空.';
    }
    if (error === '') {
      return true;
    } else {
      this.checkService.commonToast(error);
      return false;
    }
  }
  isNull(value: any): boolean {
    if (value !== null && value !== undefined && value !== '') {
      return true;
    }
    return false;
  }

  async getList(id: string) {
    await this.http.post('getDanger', { dangerId: id }).then((res: any) => {
      if (res.code === 200) {
        this.listData = res.data;
      } else {
        this.checkService.commonToast(res.msg);
      }
    });
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
