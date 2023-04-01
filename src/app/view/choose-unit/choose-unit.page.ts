import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';
import { LoadingService } from '../../service/loading.service';

@Component({
  selector: 'ph-choose-unit',
  templateUrl: './choose-unit.page.html',
  styleUrls: ['./choose-unit.page.scss'],
})
export class ChooseUnitComponent implements OnInit, OnChanges {
  @Input() deviceBasicId = '';
  @Input() isUse = 'danger-add';
  @Output() isUseChange = new EventEmitter();
  @Output() chooseData = new EventEmitter();
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
  ];
  total = 0;
  index = 1;
  pageQuery = {
    page: 1,
    limit: 20,
    queryParams: {
      deviceBasicId: '',
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

  }
  ngOnChanges(): void {
    if (this.deviceBasicId) {
      this.pageQuery.queryParams.deviceBasicId = this.deviceBasicId;
      this.getList(this.pageQuery);
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
    await this.http.post('getUnit', query).then((res: any) => {
      if (res.code === 200) {
        this.listObject = res.data;
        this.total = res.total;
        this.loadingService.loading(false);
      } else {
        this.loadingService.loading(false);
        this.checkService.commonToast(res.msg);
      }
    });
  }

  // 我的发现
  checkDevice(event: any) {
    const object = {
      code: event.id,
      name: event.unitName,
      hazardCode: event.hazardCode
    };
    this.isUse = 'danger-add';
    this.isUseChange.emit('danger-add');
    this.chooseData.emit(object);
  }

  titleBack(): void {
    this.isUse = 'danger-add';
    this.isUseChange.emit('danger-add');
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
