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
import { log } from 'console';

@Component({
  selector: 'ph-tabs-camera',
  templateUrl: './tabs-camera.component.html',
  styleUrls: ['./tabs-camera.component.less'],
})
export class TabCameraComponent implements OnInit, OnChanges {
  @ViewChild('phImage') phImage: any;
  pageIndex = 0;
  isChoose = 'danger-add';
  codeValueList = codeValueComponent;
  dangerManageDeadline: any;
  objectData:any = {
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
    departId: '',
    departName: '',
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
  customObjectData:any = {
    // hazardDangerType: '',
    // dangerLevel: '',
    // dangerSrc: '',
    // dangerDesc: '',
    // dangerManageType: '',
    // dangerReason: '',
    // // dangerManageDeadline: '',
    // deviceId: '',
    // deviceName: '',
    // unitId: '',
    // unitName: '',
    // liablePerson: '',
    // liablePersonId: '',
    // dangerImg: '',
    // controlMeasures: '',
    // dangerName: '',
    // registrantId: '',
    // registrant: '',
    // hazardCode:'',
    // dangerState: '',
    // liableDept: '',
    // liableDeptName: '',
    // userId: '',
    // checkHelper: ''
  };

  selectData:any = {
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
    this.userData = this.storage.get('userMsg');
    this.objectData.registrantId = this.userData.userName;
    this.objectData.registrant = this.userData.loginName;
    // this.objectData.dangerImg = this.checkService.getGuid();
    this.objectData.liableDept = this.userData.departmentId;
    this.objectData.liableDeptName = this.userData.department;
    this.objectData.userId = this.userData.loginName;
    const data = moment(new Date()).format('YYYY-MM-DD');
    this.dangerManageDeadline = new Date(data.replace(/-/g, '/'));
    this.initSelect();
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
    if (!this.isNull(this.objectData.liablePerson)) {
      error = error + '整改人不能是空.';
    }
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
  chooseData(event: any, type: string): void {
    this.isChoose = 'danger-add';
    if (JSON.stringify(event) !== '{}') {
      if(type === 'choose-device'){
        this.objectData.deviceName = event.name;
        this.objectData.deviceId = event.code;
        this.objectData.hazardCode = event.hazardCode;
      }
      if(type === 'choose-unit'){
        this.objectData.unitName = event.name;
        this.objectData.unitId = event.code;
        this.objectData.hazardCode = event.hazardCode;
      }
      if(type === 'choose-department'){
        this.objectData.liablePerson = event.code;
        this.objectData.liablePersonId = event.name;
        this.customObjectData.checkHelper = event.code;
        this.customObjectData.checkHelperName = event.name;
      }
    }
  }

  onTabClick(item: any): void {
    this.pageIndex = item.index;
    if (this.pageIndex === 0) {
      this.objectData = {};
      this.selectData = {}
    } else {
      this.customObjectData = {};
    }
  }

  initSelect() {
    this.getCodeValue('getCodeset', {}, {codeset:'nhushe.fx.dangerLevel'}, 'dangerLevel');
    this.getCodeValue('getFactoryInfo', {}, {userId: this.userData.loginName}, 'factoryInfo');
    this.getCodeValue('getDangerCategory', {}, {userId: this.userData.loginName,typeLevel: '1',parentType: ''}, 'dangerFirstCategory');
    this.getCodeValue('getCodeset', {}, {codeset:'nhushe.fx.dangerManageType'}, 'dangerManageType');
  }



//自定义隐患填报
  showPicker1(code: string, key: string): void {
    this._picker.showPicker(
      { value: [], data: this.getSelect(code) },
      result => {
        this.selectData[key] = result[0];
        if(key === 'factoryId') {
          if(this.customObjectData[key] !== this.getResult1(code, result[0])) {
            this.customObjectData[key] = this.getResult1(code, result[0]);
            this.selectData.areaId = '';
            this.getCodeValue('getAreaInfo', {}, {userId: this.userData.loginName,factoryId: this.customObjectData.factoryId}, 'areaInfo');
          }
        } else if(key === 'areaId') {
          if(this.customObjectData[key] !== this.getResult1(code, result[0])) {
            this.customObjectData[key] = this.getResult1(code, result[0]);
            this.customObjectData.examinePerson = this.getResult1(code, result[0], 'itemPerson');
          }
        } else if(key === 'dangerFirstCategory') {
          if(this.customObjectData[key] !== this.getResult1(code, result[0])) {
            this.customObjectData[key] = this.getResult1(code, result[0]);
            this.selectData.dangerSecondCategory = '';
            this.customObjectData.typeDesc = '';
            this.customObjectData.dangerCauseReason = '';
            this.codeValueList['dangerCauseReason'] = [];
            this.getCodeValue('getDangerCategory', {}, {userId: this.userData.loginName,typeLevel: '2',parentType: this.customObjectData.dangerFirstCategory}, 'dangerSecondCategory');
          }
        } else if (key === 'dangerSecondCategory') {
          if(this.customObjectData[key] !== this.getResult1(code, result[0])) {
            this.customObjectData[key] = this.getResult1(code, result[0]);
            this.customObjectData.typeDesc = this.getResult1(code, result[0], 'itemDes');
            this.customObjectData.dangerCauseReason = '';
            this.getCodeValue('getCauseReason', {}, {userId: this.userData.loginName,dangerTypeNo:this.customObjectData.dangerSecondCategory}, 'dangerCauseReason');
          }
        } else {
          this.customObjectData[key] = this.getResult1(code, result[0]);
        }
      }
    );
  }

  async getCodeValue(path, value, param ,code) {
    let name = '';
    if (!this.isNull(this.codeValueList[code]) || this.codeValueList[code].length < 1 || code === 'areaInfo' || code === 'dangerSecondCategory' || code === 'dangerCauseReason') {
      const codeValue = await this.http.post(path, param);
      if (codeValue.code === 200) {
        this.codeValueList[code] = this.getSelectList(codeValue.data);
      }
    }
    for (const key of this.codeValueList[code]) {
      if (value === key.itemCode) {
        name = key.itemCname;
      }
    }
    return name;
  }

  getSelectList(data) {
    const results = [];
    data.forEach(item => {
      if(this.isNull(item.value)) {
        results.push({itemCode: item.value, itemCname: item.label});
      } else if(this.isNull(item.factoryId) && this.isNull(item.factoryName)) { // 所属工厂
        results.push({itemCode: item.factoryId, itemCname: item.factoryName});
      } else if(this.isNull(item.areaId)) { // 所属区域
        results.push({itemCode: item.areaId, itemCname: item.areaName, itemPerson: item.helpPerson});
      } else if(this.isNull(item.typeName)) { // 隐患分类
        results.push({itemCode: item.id, itemCname: item.typeName, itemDes: item.typeDesc});
      } else { // 形成原因
        results.push({itemCode: item.id, itemCname: item.causeReason});
      }

    });
    return results;
  }
  getResult1(code: string, value: string, flag?) {
    for (const key of this.codeValueList[code]) {
      if (key['itemCname'] === value) {
        return flag ? key[flag] : key['itemCode'];
      }
    }
    return '';
  }

  check1() {
    let error = '';
    if (!this.isNull(this.customObjectData.dangerName)) {
      error = error + '隐患名称不能是空.';
    }
    // if (!this.isNull(this.customObjectData.hazardDangerType)) {
    //   error = error + '隐患类型不能是空.';
    // }
    if (!this.isNull(this.customObjectData.dangerLevel)) {
      error = error + '隐患等级不能是空.';
    }
    // if (!this.isNull(this.customObjectData.dangerSrc)) {
    //   error = error + '隐患来源不能是空.';
    // }
    if (!this.isNull(this.customObjectData.dangerDesc)) {
      error = error + '隐患描述不能是空.';
    }
    if (!this.isNull(this.customObjectData.dangerManageType)) {
      error = error + '治理类型不能是空.';
    }
    // if (!this.isNull(this.customObjectData.dangerReason)) {
    //   error = error + '形成原因不能是空.';
    // }
    if (!this.isNull(this.customObjectData.dangerControlMeasures)) {
      error = error + '建议整改措施不能是空.';
    }
    // if (!this.isNull(this.customObjectData.dangerManageDeadline)) {
    //   error = error + '计划完成时间不能是空.';
    // }
    // if (!this.isNull(this.customObjectData.liablePerson)) {
    //   error = error + '整改人不能是空.';
    // }
    if (error === '') {
      return true;
    } else {
      this.checkService.commonToast(error);
      return false;
    }
  }
  async customSaveData(object: any) {
      if (this.fileList.length > 0) {
        object.dangerImg = await this.fileUpload();
      }
      this.loadingService.loading(true);
      await this.http.post('saveAutoDanger', object).then((res: any) => {
        if (res.code === 200) {
          this.loadingService.loading(false);
          this.checkService.commonToast('提交成功');
        } else {
          this.loadingService.loading(false);
          this.checkService.commonToast(res.msg);
        }
      });
  }

  timestampToTime() {
    // 创建Date对象
     var date = new Date();
 
     // 获取年、月、日、小时、分钟、秒
     var year = date.getFullYear();
     var month = date.getMonth() + 1; // 月份从0开始，所以要加1
     var day = date.getDate();
     var hour = date.getHours();
     var minute = date.getMinutes();
     var second = date.getSeconds();
 
     // 格式化输出
     var current_time = year + "-" + (month < 10 ? "0" + month : month)
      + "-" + (day < 10 ? "0" + day : day) + " " + (hour < 10 ? "0" + hour : hour)
       + ":" + (minute < 10 ? "0" + minute : minute) + ":" +
        (second < 10 ? "0" + second : second);
        return current_time;
 }


   customSetObject() {
    this.userData = this.storage.get('userMsg');
    const object = this.customObjectData;
    object.dangerCauseReason = this.getCheckValue('dangerCauseReason');
    object.liablePerson = 'PanDong';
    if (this.isNull(object.dangerManageDeadline)) {
      object.dangerManageDeadline = moment(object.dangerManageDeadline).format('YYYY-MM-DD');
    }
    object.userId = this.userData.loginName;
    object.registrant = this.userData.loginName;
    object.taskId = '';
    object.checkRecordId = '';
    object.tableId = '';
    object.planId = '';
    object.dangerState = '2'; //表示已提交
    object.registTime = this.timestampToTime();
    return object;
  }

  getCheckValue(code) {
    const listValue = [];
    const list = this.codeValueList[code];
    let index = 1;
    for (const key of list) {
      if (key.checked) {
          listValue.push(key.itemCode);
      }
    }
    return listValue.join(',');
}

customOnSave(){
  if (this.check1()) {
    const object = this.customSetObject();
    this.customSaveData(object);
  }
}
}
