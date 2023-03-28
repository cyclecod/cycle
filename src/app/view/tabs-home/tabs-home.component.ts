/*
 * @Author: 九阳
 * @Date: 2022-07-28 09:56:07
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-11 10:13:31
 */
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-tabs-home',
  templateUrl: './tabs-home.component.html',
  styleUrls: ['./tabs-home.component.less'],
})
export class TabHomeComponent implements OnInit, OnChanges {

  @Input() tabsHome = 0;
  taskObject: any = {
    taskListNum: '1', // 待排查任务数量
    expireTaskNum: '1', // 超期未排查任务数量
    dangerListNum: '1', // 待整改隐患
    expireDangerNum: '1', // 超期未整改隐患
    adjustPercent: '10%', // 隐患整改率
  };
  customObject: any = {
    taskListNum: '1', // 待排查任务数量
    doTaskNum: '1', // 已排查任务数量
    expireDangerNum: '1', // 超期未整改隐患
    delayDangerNum: '1', // 延期审核隐患
  };
  userData: any;
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService,
  ) {
    this.userData = this.storage.get('userMsg');
  }

  ngOnInit(): void {
    this.getcustomTask(this.userData.loginName);
  }
  ngOnChanges(): void {
    if (this.tabsHome !== undefined && this.tabsHome === 0) {
      this.getMyTask(this.userData.loginName);
    }
  }

  getMyTask(loginName: string) {
    this.loadingService.loading(true);
    this.http.post('getTaskDangerNum', { userId: loginName }).then((res: any) => {
      if (res.code === 200) {
        if (res.data !== null && res.data !== undefined && res.data.length > 0) {
          this.taskObject = res.data[0];
          this.loadingService.loading(false);
        }
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }

  getcustomTask(loginName: string) {
    this.loadingService.loading(true);
    this.http.post('getAutoTaskDangerNum', { userId: loginName }).then((res: any) => {
      if (res.code === 200) {
        if (res.data !== null && res.data !== undefined && res.data.length > 0) {
          this.customObject = res.data[0];
          this.loadingService.loading(false);
        }
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }

  onRoute(path: string, value: any): void {
    if (value !== undefined && value !== null && value > 0) {
      this.router.navigate([path]);
    }
  }
}
