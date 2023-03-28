/*
 * @Author: 九阳
 * @Date: 2022-08-01 10:37:36
 * @LastEditors: 九阳
 * @LastEditTime: 2022-08-01 17:17:36
 */
import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'ml-gray-bar',
  templateUrl: './ml-gray-bar.component.html',
  styleUrls: ['./ml-gray-bar.component.less'],
})
export class MlGrayBarComponent implements OnInit {

  @Input() data: any = '';

  constructor() { }

  ngOnInit() {
  }

}
