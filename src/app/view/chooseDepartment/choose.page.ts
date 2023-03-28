/*
 * @Author: 九阳
 * @Date: 2022-08-01 13:01:40
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-10 10:40:55
 */
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Component, OnDestroy, OnChanges, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';

@Component({
  selector: 'ph-choose-department',
  templateUrl: './choose.page.html',
  styleUrls: ['./choose.page.scss'],
})
export class ChooseDepartmentPage implements OnInit, OnChanges {

  @Input() isUse = 'danger-add';
  @Output() isUseChange = new EventEmitter();
  @Output() chooseData = new EventEmitter();
  private otherPage: any;

  deptId = '';
  peopleList = [];
  // 列表 数据
  public clauseData: any = [];
  constructor(
    private router: Router,
    public http: HttpService,
    private checkService: CheckService,
    private route: ActivatedRoute,
    private storage: LocalStorageStore,
  ) {
   
    this.otherPage = this.route.snapshot.queryParams;
  }


  ngOnInit() {
    
  }
  onInput(value: boolean): void {
    // 触发输出事件-输出数据
    this.isUseChange.emit(value);
  }

  ngOnChanges(): void {
    const userData: any = this.storage.get('userMsg');
    this.getList(userData.loginName);
  }

  getList(loginName: string): void {
    this.http.post('queryDep', { userId: loginName }).then((res: any) => {
      if (res.code === 200) {
        this.clauseData = res.data;
      }
    });
  }
  onQueryPeople(item: any): void {

    this.http.post('queryMendUser', { deptId: item.label }).then((res: any) => {
      if (res.code === 200) {
        this.deptId = item.label;
        this.peopleList = res.data;
      }
    });
  }

  goBackFunc(item: any): void {
    const object = {
      code: item.loginName,
      name: item.text,
    };
    this.isUse = 'danger-add';
    this.isUseChange.emit('danger-add');
    this.chooseData.emit(object);
  }

  titleBack(): void {
    this.isUse = 'danger-add';
    this.isUseChange.emit('danger-add');
    // this.router.navigate([this.otherPage.type], {
    //   queryParams: {
    //     type: this.otherPage.type,
    //     objectReview: this.otherPage.objectReview,
    //     data: JSON.stringify(data),
    //     objectData: this.otherPage.objectData,
    //   }
    // });
  }
}
