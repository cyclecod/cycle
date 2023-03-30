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
  // dangerManageDeadline: any;
  
  objectData: any = {
    hazardDangerType: '',
    dangerLevel: '',
    dangerSrc: '',
    dangerDesc: '',
    dangerManageType: '',
    dangerReason: '',
    // dangerManageDeadline: '',
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
    checkHelper: ''
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

  async ngOnInit() {

    await this.router.routerState.root.queryParams.subscribe(params =>{
        console.log(params);
        this.objectData = JSON.parse(JSON.stringify(params));
    })
    this.objectData.checkHelper = this.objectData.checkParterName;
    // this.objectData.planId = this.objectData.planName;
    this.userData = this.storage.get('userMsg');
    // this.objectData.registrantId = this.userData.userName;
    this.objectData.registrant = this.userData.userName;
    // this.objectData.dangerImg = this.checkService.getGuid();
    // this.objectData.liableDept = this.userData.departmentId;
    // this.objectData.liableDeptName = this.userData.department;
    this.objectData.userId = this.userData.loginName;
    this.objectData.registTime = moment(new Date()).format('YYYY-MM-DD');
    // this.dangerManageDeadline = new Date(data.replace(/-/g, '/'));
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
    const data = {
      id : this.generateUUID(),
      checkTaskId: this.objectData.id,
      userId: object.userId,
      checkTime: moment(new Date()).format('YYYY-MM-DD'),
      checkStatus: '1'
    }
    const result = await this.http.post('sureAutoTask', data);
    if (result.code === 200) {
      if (this.fileList.length > 0) {
        object.dangerImg = await this.fileUpload();
      }
      // object.dangerImg = '11111111111111111111'
      object.taskId = this.generateUUID();
      object.checkRecordId = data.id;
      this.loadingService.loading(true);
      await this.http.post('saveAutoDanger', object).then((res: any) => {
        if (res.code === 200) {
          this.loadingService.loading(false);
          this.checkService.commonToast('提交成功');
          this.titleBack();
        } else {
          this.loadingService.loading(false);
          this.checkService.commonToast(res.msg);
        }
      });
    } else {
      this.checkService.commonToast(result.msg);
    }
  }
  setObject() {
    const object = this.objectData;
    object.dangerCauseReason = this.getCheckValue('dangerCauseReason');
    // object.liablePerson = 'PanDong';
    // if (this.isNull(object.dangerManageDeadline)) {
    //   object.dangerManageDeadline = moment(object.dangerManageDeadline).format('YYYY-MM-DD');
    // }
    object.dangerState = '2'; //表示已提交
    return object;
  }

  check() {
    let error = '';
    if (!this.isNull(this.objectData.dangerName)) {
      error = error + '隐患名称不能是空.';
    }
    // if (!this.isNull(this.objectData.hazardDangerType)) {
    //   error = error + '隐患类型不能是空.';
    // }
    if (!this.isNull(this.objectData.dangerLevel)) {
      error = error + '隐患等级不能是空.';
    }
    // if (!this.isNull(this.objectData.dangerSrc)) {
    //   error = error + '隐患来源不能是空.';
    // }
    if (!this.isNull(this.objectData.dangerDesc)) {
      error = error + '隐患描述不能是空.';
    }
    if (!this.isNull(this.objectData.dangerManageType)) {
      error = error + '治理类型不能是空.';
    }
    // if (!this.isNull(this.objectData.dangerReason)) {
    //   error = error + '形成原因不能是空.';
    // }
    if (!this.isNull(this.objectData.dangerControlMeasures)) {
      error = error + '建议整改措施不能是空.';
    }
    // if (!this.isNull(this.objectData.dangerManageDeadline)) {
    //   error = error + '计划完成时间不能是空.';
    // }
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
  getResult(code: string, value: string, flag?) {
    for (const key of this.codeValueList[code]) {
      if (key['itemCname'] === value) {
        return flag ? key[flag] : key['itemCode'];
      }
    }
    return '';
  }

  getDes(code: string, value: string) {
    for (const key of this.codeValueList[code]) {
      if (key['itemCname'] === value) {
        return key['itemDes'];
      }
    }
    return '';
  }

  showPicker(code: string, key: string): void {
    this._picker.showPicker(
      { value: [], data: this.getSelect(code) },
      result => {
        this.selectData[key] = result[0];
        if(key === 'factoryId') {
          if(this.objectData[key] !== this.getResult(code, result[0])) {
            this.objectData[key] = this.getResult(code, result[0]);
            this.selectData.areaId = '';
            this.getCodeValue('getAreaInfo', {}, {userId: this.userData.loginName,factoryId: this.objectData.factoryId}, 'areaInfo');
          }
        } else if(key === 'areaId') {
          if(this.objectData[key] !== this.getResult(code, result[0])) {
            this.objectData[key] = this.getResult(code, result[0]);
            this.objectData.examinePerson = this.getResult(code, result[0], 'itemPerson');
          }
        } else if(key === 'dangerFirstCategory') {
          if(this.objectData[key] !== this.getResult(code, result[0])) {
            this.objectData[key] = this.getResult(code, result[0]);
            this.selectData.dangerSecondCategory = '';
            this.objectData.typeDesc = '';
            this.objectData.dangerCauseReason = '';
            this.codeValueList['dangerCauseReason'] = [];
            this.getCodeValue('getDangerCategory', {}, {userId: this.userData.loginName,typeLevel: '2',parentType: this.objectData.dangerFirstCategory}, 'dangerSecondCategory');
          }
        } else if (key === 'dangerSecondCategory') {
          if(this.objectData[key] !== this.getResult(code, result[0])) {
            this.objectData[key] = this.getResult(code, result[0]);
            this.objectData.typeDesc = this.getResult(code, result[0], 'itemDes');
            this.objectData.dangerCauseReason = '';
            this.getCodeValue('getCauseReason', {}, {userId: this.userData.loginName,dangerTypeNo:this.objectData.dangerSecondCategory}, 'dangerCauseReason');
          }
        } else {
          this.objectData[key] = this.getResult(code, result[0]);
        }
      }
    );
  }

  returnBack(type: string): void {
    this.isChoose = type;
  }

  titleBack(): void {
    history.go(-1);
  }

  generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
     d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = (d + Math.random() * 16) % 16 | 0;
     d = Math.floor(d / 16);
     return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
   }


  /** 
   * 获取选择内容
   * getCodeset codeset:nhushe.fx.dangerLevel 隐患等级
   * getFactoryInfo userId:'' 所属工厂
   * getAreaInfo factoryId:'',userId:'' 所属区域
   * getDangerCategory parentType:'',typeLevel:'',userId:'' 隐患分类
   * getCauseReason dangerTypeNo:'',userId:'' 形成原因
   * 
  */

  initSelect() {
    this.getCodeValue('getCodeset', {}, {codeset:'nhushe.fx.dangerLevel'}, 'dangerLevel');
    this.getCodeValue('getFactoryInfo', {}, {userId: this.userData.loginName}, 'factoryInfo');
    this.getCodeValue('getDangerCategory', {}, {userId: this.userData.loginName,typeLevel: '1',parentType: ''}, 'dangerFirstCategory');
    this.getCodeValue('getCodeset', {}, {codeset:'nhushe.fx.dangerManageType'}, 'dangerManageType');
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

  // 数据数据处理
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

}
