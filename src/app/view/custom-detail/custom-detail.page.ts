/*
 * @Author: 九阳
 * @Date: 2022-08-01 09:40:37
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-09 16:34:45
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService, FILE_URL } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import * as moment from 'moment';
import { LoadingService } from 'app/service/loading.service';
@Component({
  selector: 'ph-custom-detail',
  templateUrl: './custom-detail.page.html',
  styleUrls: ['./custom-detail.page.less'],
})
export class CustomDetailComponent implements OnInit, OnDestroy {
  @ViewChild('phImage') phImage: any;
  codeValueList = {
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
  };
  


  objectData: any = {
    id: '',
    dangerState: '4', //隐患状态
    reviewContent: '', //整改意见
    dangerLevel: '0', //隐患级别
    userId: '',//当前登录用户编号
    dangerImgAfter: '',//整改完成图片



    // hazardDangerTypeName: '', // 隐患类型
    // // dangerLevelName: '0', // 隐患等级
    // dangerSrcName: '宝信软件', // 隐患来源
    // dangerDesc: '12', // 隐患描述
    // // dangerManageTypeName: '从生产商菜市场错错错错错错错错错', // 治理类型
    // // 排查周期分为两部分
    // dangerReason: '1', // 形成原因
    // dangerManageDeadline: '周', // 计划完成时间
    // registrant: '', // 整改人名称
    // state: '0', // 任务状态
  };

  userData: any = {
    userName: '',
    loginName: '',
  };
  fileList: any = [];
  fileList1 = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService
  ) {
  }

  async ngOnInit() {
    let details: any;
    this.userData = this.storage.get('userMsg');
    this.route.queryParams.subscribe(async (params) => {
      details = JSON.parse(JSON.stringify(params));
    });
    this.objectData = details;
    await this.initSelect(this.objectData);
    // this.objectData.planName = '排查类型排查类型排查类型排查类型排查类型排查类型排查类型排查类型排查类型';
    // this.objectData.dangerCauseReason = '730517d6b7f54d71a12f546c8281cc53,d04c992499934989899b31158a25d607';
    await this.getCName();
    this.getImage(details.dangerImg);
    this.userData = this.storage.get('userMsg');
    this.objectData.userId = this.userData.loginName;
  }

  getCName() {
    // this.objectData.dangerLevel = '1';
    this.objectData.dangerLevelName = this.getCodeValue(this.objectData.dangerLevel, 'dangerLevel');
    // this.objectData.factoryId = '4ac5dae4-ff49-6bc5-7360-1349c886a3e7';
    this.objectData.factoryName = this.getCodeValue(this.objectData.factoryId, 'factoryInfo');
    // this.objectData.areaId = 'af5065ea-0739-46f0-5af8-79a5ac32df2d';
    this.objectData.areaName = this.getCodeValue(this.objectData.areaId, 'areaInfo');
    // this.objectData.dangerFirstCategory = '11544829d0514250bd664c50f485ae3e';
    this.objectData.dangerFirstCategoryName = this.getCodeValue(this.objectData.dangerFirstCategory, 'dangerFirstCategory');
    // this.objectData.dangerSecondCategory = '6260a386bbc8488c9881508fee9a9f82';
    this.objectData.dangerSecondCategoryName = this.getCodeValue(this.objectData.dangerSecondCategory, 'dangerSecondCategory');
    this.objectData.typeDesc = this.getCodeValue(this.objectData.dangerSecondCategory, 'dangerSecondCategory', 'itemDes');
    this.objectData.dangerCauseReasonName = this.getCodeValue(this.objectData.dangerCauseReason, 'dangerCauseReason');
    this.objectData.dangerManageTypeName = this.getCodeValue(this.objectData.dangerManageType, 'dangerManageType');
    
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

  getCodeValue(value: string, code: string, flag?): string {
    // let name = '';
    // for (const key of this.codeValueList[code]) {
    //   if (value === key.itemCode) {
    //     name = flag ? key[flag] : key.itemCname;
    //   }
    // }
    // return name;


    if (this.isNull(value)) {
      const listValue = [];
      if (value.indexOf(',') === -1) {
          for (const key of this.codeValueList[code]) {
              if (key.itemCode === value) {
                  const data = flag ? key[flag] : key.itemCname;
                  listValue.push(data);
              }
          }
      } else {
          const list = value.split(',');
          let index = 1;
          for (const key of list) {
              for (const key1 of this.codeValueList[code]) {
                if (key1.itemCode === key) {
                    const data = flag ? key1[flag] : key1.itemCname;
                    listValue.push(data);
                }
              }
              index++;
          }
      }
      return listValue.join(',');
    }
    return '';
  }
  ngOnDestroy(): void {
  }

  async initSelect(data) {
    await this.getCodeList('getCodeset', {codeset:'nhushe.fx.dangerLevel'}, 'dangerLevel');
    await this.getCodeList('getFactoryInfo', {userId: this.userData.loginName}, 'factoryInfo');
    await this.getCodeList('getAreaInfo', {userId: this.userData.loginName,factoryId: data.factoryId}, 'areaInfo');
    // await this.getCodeList('getAreaInfo', {userId: this.userData.loginName,factoryId: '4ac5dae4-ff49-6bc5-7360-1349c886a3e7'}, 'areaInfo');
    await this.getCodeList('getDangerCategory', {userId: this.userData.loginName,typeLevel: '1',parentType: ''}, 'dangerFirstCategory');
    await this.getCodeList('getDangerCategory', {userId: this.userData.loginName,typeLevel: '2',parentType: this.objectData.dangerFirstCategory}, 'dangerSecondCategory');
    // await this.getCodeList('getDangerCategory', {userId: this.userData.loginName,typeLevel: '2',parentType: '11544829d0514250bd664c50f485ae3e'}, 'dangerSecondCategory');
    await this.getCodeList('getCauseReason', {userId: this.userData.loginName,dangerTypeNo:data.dangerSecondCategory}, 'dangerCauseReason');
    // await this.getCodeList('getCauseReason', {userId: this.userData.loginName,dangerTypeNo:'6260a386bbc8488c9881508fee9a9f82'}, 'dangerCauseReason');
    await this.getCodeList('getCodeset', {codeset:'nhushe.fx.dangerManageType'}, 'dangerManageType');
  }

  async getCodeList(path, param ,code) {
    const codeValue = await this.http.post(path, param);
      if (codeValue.code === 200) {
        this.codeValueList[code] = this.getSelectList(codeValue.data);
      }
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

  async fileUpload() {
    let fileIds = '';
    await this.phImage.uploadImage(this.fileList1, 'eventUpload?docTag=dangerFile');
    const list = [];
    for (const key of this.fileList1) {
      if (this.isNull(key.id)) {
        list.push(key.id);
      } else {
        return;
      }
    }
    fileIds = list.join(',');
    return fileIds;
  }

  onSave() {
    if (this.check()) {
      this.saveData(this.objectData);
    }
  }

  check() {
    let error = '';
    if (!this.isNull(this.objectData.reviewContent)) {
      error = error + '整改意见不能是空.';
    }
    // if (!this.isNull(this.objectData.reviewContent)) {
    //   error = error + '整改意见不能是空.';
    // }
    if (error === '') {
      return true;
    } else {
      this.checkService.commonToast(error);
      return false;
    }
  }

  async saveData(object: any) {
      this.userData = this.storage.get('userMsg');
      if (this.fileList1.length > 0) {
        object.dangerImgAfter = await this.fileUpload();
      }
      const data = {
        id : object.id,
        dangerState: '4',
        reviewContent: object.reviewContent,
        userId: this.userData.loginName,
        dangerLevel: object.dangerLevel,
        dangerImgAfter: object.dangerImgAfter
      }
      this.loadingService.loading(true);
      console.log(data);
      
      // await this.http.post('mendDanger', data).then((res: any) => {
      //   if (res.code === 200) {
      //     this.loadingService.loading(false);
      //     this.checkService.commonToast('保存成功');
      //     this.titleBack();
      //   } else {
      //     this.loadingService.loading(false);
      //     this.checkService.commonToast(res.msg);
      //   }
      // });
  
  }

}
