/*
 * @Author: 九阳
 * @Date: 2022-08-01 17:09:49
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-01 17:16:39
 */
import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from '../../service/loading.service';
@Component({
  selector: 'ml-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less'],
})
export class LoadingComponent implements OnInit {

  public showLoading: any = false; //是否显示loading
  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.getLoding().subscribe(loading => {
      this.showLoading = loading;
    });
  }
}