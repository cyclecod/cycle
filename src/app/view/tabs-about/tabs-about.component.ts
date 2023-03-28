/*
 * @Author: 九阳
 * @Date: 2022-07-28 10:03:08
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-22 09:45:40
 */
import { Component, Input, OnInit, OnChanges} from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../service/http.service';
import { LocalStorageStore } from '../../service/local-storage.service';
import { CheckService } from '../../service/check.service';

@Component({
  selector: 'ph-tabs-about',
  templateUrl: './tabs-about.component.html',
  styleUrls: ['./tabs-about.component.less'],
})
export class TabAboutComponent implements OnInit, OnChanges {
  @Input() userObject: any;
  
  userData: any = {
    loginName: '',
    userName: '',
  };
  constructor(
    private router: Router,
    private http: HttpService,
    private storage: LocalStorageStore,
    private checkService: CheckService
  ) {
  }

  ngOnInit() {
  }
  ngOnChanges() {
    if(this.userObject !== undefined) {
      this.userData = this.userObject;
    }
  }
  // 退出
  loginOut() {
    this.http.get('logout').then(res => {
      this.storage.clear();
      this.router.navigate(['./login']);
    });
  } 
}
