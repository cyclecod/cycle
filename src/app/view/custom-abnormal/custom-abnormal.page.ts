/*
 * @Author: 九阳
 * @Date: 2022-07-28 14:15:07
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 11:53:57
 */
import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
import { PickerService, PickerRef } from 'ng-zorro-antd-mobile';
import { LoadingService } from '../../service/loading.service';
import { codeValueComponent } from '../../data/static-data.component';

@Component({
  selector: 'ph-custom-camera',
  templateUrl: './custom-abnormal.page.html',
  styleUrls: ['./custom-abnormal.page.less'],
})
export class CustomAbnormalComponent implements OnInit, OnChanges {
  @ViewChild('phImage') phImage: any;
  isChoose = 'danger-add';
  codeValueList = codeValueComponent;
  dangerManageDeadline: any;
  
  objectData = {
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
    liablePerson: '',
    liablePersonId: '',
    dangerImg: '',
    controlMeasures: '',
    dangerName: '',
    registrantId: '',
    registrant: '',
    hazardCode:'',
    dangerState: '',
    liableDept: '',
    liableDeptName: '',
    userId: '',
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
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private _picker: PickerService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {

    this.router.routerState.root.queryParams.subscribe(params =>{
        console.log(params.id);
    })
    
    this.userData = this.storage.get('userMsg');
    this.objectData.registrantId = this.userData.userName;
    this.objectData.registrant = this.userData.loginName;
    // this.objectData.dangerImg = this.checkService.getGuid();
    this.objectData.liableDept = this.userData.departmentId;
    this.objectData.liableDeptName = this.userData.department;
    this.objectData.userId = this.userData.loginName;
    const data = moment(new Date()).format('YYYY-MM-DD');
    this.dangerManageDeadline = new Date(data.replace(/-/g, '/'));
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
  isNull(value) {
    if (value !== null && value !== undefined && value !== '') {
      return true;
    }
    return false;
  }
  ngOnChanges() {

  }


  onSave() {
    if (this.check()) {
      const object = this.setObject();
      this.saveData(object);
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
  async saveData(object: any) {
    if (this.fileList.length > 0) {
      object.dangerImg = await this.fileUpload();
    }
    this.loadingService.loading(true);
    await this.http.post('saveDanger', object).then((res: any) => {
      if (res.code === 200) {
        this.loadingService.loading(false);
        this.checkService.commonToast('保存成功');
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }
  setObject() {
    const object = this.objectData;
    object.liablePerson = 'PanDong';
    if (this.isNull(object.dangerManageDeadline)) {
      object.dangerManageDeadline = moment(object.dangerManageDeadline).format('YYYY-MM-DD');
    }
    object.dangerState = '-1';
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
    // if (!this.isNull(this.objectData.liablePerson)) {
    //   error = error + '整改人不能是空.';
    // }
    if (error === '') {
      return true;
    } else {
      this.checkService.commonToast(error);
      return false;
    }
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

  returnBack(type: string): void {
    this.isChoose = type;
  }

}
