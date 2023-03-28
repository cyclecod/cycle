import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListComponent implements OnInit, OnChanges {
  @ViewChild('deviceScan') deviceScan: any;
  @Input() device = 1;
  scan = false;

  state = {
    refreshState: {
      currentState: 'deactivate',
      drag: false
    },
    direction: '',
    endReachedRefresh: false,
  };
  dtPullToRefreshStyle = { height: '100 %' };
  listObject = [
    // {
    //   hazardName: '测试',
    //   troubleshootContent: '测试测试测试测试',
    //   riskUnitName: '测试测试',
    //   checkCycleName: '测试测试',
    //   state: '0',
    // }
  ];
  total = 0;
  index = 1;
  pageQuery = {
    page: 1,
    limit: 10,
    queryParams: {
      userId: '',
    },
  };

  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    const userData: any = this.storage.get('userMsg');
    this.pageQuery.queryParams.userId = userData.loginName;
    this.getList(this.pageQuery);
  }
  ngOnChanges(): void {
  }
  scanDevice(): void {
    if (this.scan) {
      if (this.deviceScan) {
        this.deviceScan.fullStop();
      }
    }
    this.scan = true;
  }
  onScanData(event: any): void {
    this.scan = false;
    if (event.data !== undefined) {
      const object = JSON.parse(event.data);
      this.deviceScan.fullStop();
      this.router.navigate(['risk-investigate'], { queryParams: object });
    } else {
      this.checkService.commonToast('获取扫描信息失败，请重新扫码！');
    }
  }

  /**
  * 下拉刷新
  */
  pullToRefresh(event: any): void {
    this.pageQuery.page = 1;
    this.listObject = [];
    this.getList(this.pageQuery);
  }

  onClick(): void {
    if (this.total !== this.listObject.length) {
      this.index++;
      this.pageQuery.page = this.index;
      this.getList(this.pageQuery);
    } else {
      this.index = 1;
    }
  }


  async getList(query: any) {
    this.loadingService.loading(true);
    await this.http.post('getNotDoTaskList', query).then((res: any) => {
      if (res.code === 200) {
        for (const key of res.data) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          key.leftTimeName = '剩余:' + key.leftTime;
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          key.checkCycleName = key.checkCycle + key.checkCycleUnit;
          this.listObject.push(key);
        }
        this.total = res.total;
        this.loadingService.loading(false);
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }

  // 我的发现
  checkDevice(event) {
    this.router.navigate(['risk-investigate-detail'], { queryParams: event });
  }

  titleBack(): void {
    history.go(-1);
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
