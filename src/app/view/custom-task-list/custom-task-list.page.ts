import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'cs-task-list',
  templateUrl: './custom-task-list.page.html',
  styleUrls: ['./custom-task-list.page.scss'],
})
export class CustomTaskListComponent implements OnInit, OnChanges {
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
    //   planName: '测试',
    //   taskState: '测试测试测试测试',
    //   leftTimeName:'测试测试',
    //   checkCycleName: '测试测试',
    //   checkContent: '测试测试'
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
  // scanDevice(): void {
  //   if (this.scan) {
  //     if (this.deviceScan) {
  //       this.deviceScan.fullStop();
  //     }
  //   }
  //   this.scan = true;
  // }
  // onScanData(event: any): void {
  //   this.scan = false;
  //   if (event.data !== undefined) {
  //     const object = JSON.parse(event.data);
  //     this.deviceScan.fullStop();
  //     this.router.navigate(['risk-investigate'], { queryParams: object });
  //   } else {
  //     this.checkService.commonToast('获取扫描信息失败，请重新扫码！');
  //   }
  // }

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
    await this.http.post('getAutoNotDoTaskList', query).then((res: any) => {
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

  async normal(event) {
    this.loadingService.loading(true);
    console.log(event);
    const userData: any = this.storage.get('userMsg');
    const date = {
      id : this.generateUUID(),
      checkTaskId:event.id,
      userId:userData.loginName,
      checkTime:this.timestampToTime(),
      checkStatus:'0'
    }
    await this.http.post('sureAutoTask', date ).then((res: any) => {
      if (res.code === 200) {
        this.loadingService.loading(false);
        this.checkService.commonToast('保存成功');
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
    this.router.navigate(['tabs'], { queryParams: event });
  }

  // 我的发现
  checkDevice(event) {
    this.router.navigate(['custom-abnormal'], { queryParams: event});
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
