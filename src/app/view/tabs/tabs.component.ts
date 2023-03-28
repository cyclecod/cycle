/*
 * @Author: 九阳
 * @Date: 2022-07-27 09:37:18
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-01 14:39:05
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';

@Component({
  selector: 'ph-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.less'],
})
export class TabBarComponent implements OnInit {
  hidden: any = false;
  fullScreen: any = false;
  selectedIndex: any = 0;

  taskObject = {
    taskListNum: '0', // 待排查任务数量
    expireTaskNum: '0', // 超期未排查任务数量
    dangerListNum: '0', // 待整改隐患
    expireDangerNum: '0', // 超期未整改隐患
    adjustPercent: '0%', // 隐患整改率
  };
  userData: any;
  fileList = [];
  fileId = '';
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService
  ) {
    this.userData = this.storage.get('userMsg');

  }

  ngOnInit() {
    const index = this.storage.get('selectedIndex');
    if (index !== undefined && index !== null && JSON.stringify(index) !== '{}') {
      this.selectedIndex = index;
    }
  }

  getMyTask(loginName: string) {
    this.http.post('getTaskDangerNum', { userId: loginName }).then((res: any) => {
      if (res.code === 200) {
        if (res.data !== null && res.data !== undefined && res.data.length > 0) {
          this.taskObject = res.data[0];
        }
      } else {
        this.checkService.commonToast(res.msg);
      }
    });
  }
  // 退出
  loginOut() {
    this.http.get('logout').then(res => {
      this.storage.clear();
      this.router.navigate(['./login']);
    });
  }

  tabBarTabOnPress(pressParam: any) {
    this.selectedIndex = pressParam.index;
    this.storage.set('selectedIndex', pressParam.index);
  }
}
