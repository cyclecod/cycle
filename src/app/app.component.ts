/*
 * @Author: 九阳
 * @Date: 2022-07-26 14:32:53
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-29 08:36:23
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { ElectronService } from './service/electron.service';
import { HttpService } from './service/http.service';
import { ModalService } from 'ng-zorro-antd-mobile';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  wp_download = 'https://ydbg.yjglj.shanghai.gov.cn:8088/nhuyy/webapp/'; 
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private http: HttpService,
    private _modal: ModalService
  ) {
    this.translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit(): void {
    const packages: any = require("../../package.json");
    this.getVersion(packages.version);
  }
  getVersion(versions: string): void {
    const method = this.wp_download + 'getApkLastVersion';
    this.http.getVersion(method, { type: 3 }).then(res => {
      if (res.code === 200) {
        if (res.data.length > 0) {
          const versionNumber = res.data[0].versionNumber;
          if (this.checkVersion(versionNumber, versions)) {
            this.alert();
          }
        }
      }
      if (res.code === 449) {
        this.getVersion(versions);
      }
    });
  }
  alert():void {
    this._modal.alert('版本更新', '检测到新版本，是否下载更新？', [
      { text: "取消", onPress: () => console.log('cancel') },
      {
        text: '确定',
        onPress: () =>{
          window.open(this.wp_download + 'getApkStream?type=3');
        },
        style: {
          color: '#ffffff',
          background: '#188CFF'
        }
      }
    ]);
  }
  /**
    * @param curV 更新版本
    * @param reqV 本地版本
    */
  checkVersion(curV: any, reqV: any): boolean {
    const arr1 = curV.toString().split('.');
    const arr2 = reqV.toString().split('.');
    // 将两个版本号拆成数字
    const minL = Math.min(arr1.length, arr2.length);
    let pos = 0; // 当前比较位
    let diff = 0; // 当前为位比较是否相等
    let flag = false;
    // 逐个比较如果当前位相等则继续比较下一位
    while (pos < minL) {
      diff = Number(arr1[pos]) - Number(arr2[pos]);
      if (diff === 0) {
        pos++;
        continue;
      } else if (diff > 0) {
        flag = true;
        break;
      } else {
        flag = false;
        break;
      }
    }
    return flag;
  }
}
