/*
 * @Author: 九阳
 * @Date: 2022-08-01 09:40:37
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 11:53:53
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
import { PickerService, PickerRef } from 'ng-zorro-antd-mobile';
import { LoadingService } from '../../service/loading.service';
import { codeValueComponent } from '../../data/static-data.component';

@Component({
  selector: 'ph-danger-add',
  templateUrl: './danger-add.component.html',
  styleUrls: ['./danger-add.component.less'],
})
export class DangerAddComponent implements OnInit {
  @ViewChild('phImage') phImage: any;
  isChoose = 'danger-add';
  codeValueList = codeValueComponent;
  dangerManageDeadline: any;
  objectData = {
    dangerName: '',
    hazardDangerType: '',
    dangerLevel: '',
    dangerSrc: '',
    dangerDesc: '',
    dangerManageType: '',
    dangerReason: '',
    dangerManageDeadline: '',
    deviceId: '',
    deviceName: '',
    unitId: '',
    unitName: '',
    registrantId: '',
    registrant: '',
    dangerImg: '', //
    liablePerson: '',
    liablePersonId: '',
    controlMeasures: '',
    hazardName: '',
    hazardCode: '',
    riskMeasureId: '',
    riskMeasureName: '',
    checkRecordId: '',
    userId: '',
    liableDept: '',
    liableDeptName: '',
    dangerState: '',
  };
  selectData = {
    hazardDangerType: '',
    dangerLevel: '',
    dangerSrc: '',
    dangerManageType: '',
  };
  userData: any = {
    userName: '',
    loginName: '',
    departmentId: '',
    department: '',
  };
  fileList = [];
  sureTask: any; // 排查记录
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
    this.userData = this.storage.get('userMsg');
    let details: any;
    this.route.queryParams.subscribe((params) => {
      this.sureTask = JSON.parse(params.sureTask);
      details = JSON.parse(params.params);
    });
    this.initAdd(details);
  }

  initAdd(details: any) {
    this.objectData.hazardCode = details.hazardCode;
    this.objectData.deviceName = details.deviceName;
    this.objectData.deviceId = details.deviceId;
    this.objectData.unitName = details.unitName;
    this.objectData.unitId = details.unitId;

    this.objectData.checkRecordId = details.checkRecordId;
    this.objectData.riskMeasureId = details.riskMeasureId;
    this.objectData.riskMeasureName = details.riskMeasureName;

    this.objectData.registrant = this.userData.loginName;
    this.objectData.userId = this.userData.loginName;
    this.objectData.liableDept = this.userData.departmentId;
    this.objectData.liableDeptName = this.userData.department;
    const data = moment(new Date()).format('YYYY-MM-DD');
    this.dangerManageDeadline = new Date(data.replace(/-/g, '/'));
    this.objectData.dangerManageDeadline = data;
  }

  getTime(value: string): string {
    if (this.isNull(value)) {
      const val = JSON.parse(JSON.stringify(value))
      const data = moment(val).format('YYYY-MM-DD');
      this.objectData.dangerManageDeadline = data;
      return data;
    }
    return '';
  }
  isNull(value: any) {
    if (value !== null && value !== undefined && value !== '') {
      return true;
    }
    return false;
  }
  ngOnChanges() {

  }


  onSave(): void {
    if (this.check()) {
      const object = this.setObject();
      this.saveData(object);
    }
  }

  async saveData(object) {
    if (this.fileList.length > 0) {
      object.dangerImg = await this.fileUpload();
    }
    this.loadingService.loading(true);
    // 生成排查记录
    await this.http.post('sureTask', this.sureTask).then(async (res1: any) => {
      if (res1.code === 200) {
        // 生成排查隐患记录
        await this.http.post('saveDanger', object).then((res: any) => {
          if (res.code === 200) {
            this.loadingService.loading(false);
            this.checkService.commonToast('保存成功');
            this.titleBack();
          } else {
            this.loadingService.loading(false);
            this.checkService.commonToast(res.msg);
          }
        });
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res1.msg);
      }
    });
  }
  setObject() {
    const object = this.objectData;
    if (this.isNull(object.dangerManageDeadline)) {
      object.dangerManageDeadline = moment(object.dangerManageDeadline).format('YYYY-MM-DD');
    }
    object.dangerState = '-1';
    object.liablePerson = 'PanDong';
    return object;
  }

  check() {
    let error = '';
    if (!this.isNull(this.objectData.dangerName)) {
      error = error + '隐患名称不能是空.';
    }
    if (!this.isNull(this.objectData.hazardDangerType)) {
      error = error + '隐患类型不能是空.';
    }
    if (!this.isNull(this.objectData.dangerLevel)) {
      error = error + '隐患等级不能是空.';
    }
    if (!this.isNull(this.objectData.dangerSrc)) {
      error = error + '隐患来源不能是空.';
    }
    if (!this.isNull(this.objectData.dangerDesc)) {
      error = error + '隐患描述不能是空.';
    }
    if (!this.isNull(this.objectData.dangerManageType)) {
      error = error + '治理类型不能是空.';
    }
    if (!this.isNull(this.objectData.dangerReason)) {
      error = error + '形成原因不能是空.';
    }
    if (!this.isNull(this.objectData.controlMeasures)) {
      error = error + '管控措施不能是空.';
    }
    if (!this.isNull(this.objectData.dangerManageDeadline)) {
      error = error + '计划完成时间不能是空.';
    }
    if (error === '') {
      return true;
    } else {
      this.checkService.commonToast(error);
      return false;
    }
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
  getSelect(code: string): any {
    const data = [];
    const list = this.codeValueList[code];
    for (const key of list) {
      data.push(key['itemCname']);
    }
    return data;
  }
  getResult(code: string, value: string) {
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
        this.selectData[key] = result[0];
        this.objectData[key] = this.getResult(code, result[0]);
      }
    );
  }

  // returnBack(type: string): void {
  //   this.isChoose = type;
  // }
  // chooseData(event: any): void {
  //   this.isChoose = 'danger-add';
  //   if (JSON.stringify(event) !== '{}') {
  //     this.objectData.liablePerson = event.code;
  //     this.objectData.liablePersonId = event.name;
  //   }
  // }

  titleBack(): void {
    history.go(-1);
  }
}
