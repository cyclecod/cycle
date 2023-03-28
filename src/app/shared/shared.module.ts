/*
 * @Author: 九阳
 * @Date: 2022-07-26 14:32:53
 * @LastEditors: 九阳
 * @LastEditTime: 2022-10-24 16:02:48
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { NgZorroAntdMobileModule } from 'ng-zorro-antd-mobile';

import { ImagePicker } from '../components/image-picker/image-picker';
import { Scaner } from '../components/scaner/scaner';
import { MlGrayBarComponent } from '../components/ml-gray-bar/ml-gray-bar.component';
// import { WebviewDirective } from './directives/';

import { DebounceClickDirective } from '../directive/debounce-click.directive';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PHLoginComponent } from '../view/login/login.component';
import { TabBarComponent } from '../view/tabs/tabs.component';
import { TabHomeComponent } from '../view/tabs-home/tabs-home.component';
import { TabAboutComponent } from '../view/tabs-about/tabs-about.component';
import { TabDeviceComponent } from '../view/tabs-device/tabs-device.component';
import { TabYHComponent } from '../view/tabs-yh/tabs-yh.component';
import { TabCameraComponent } from '../view/tabs-camera/tabs-camera.component';
import { InvestigateComponent } from '../view/investigate/investigate.component';
import { InvestigateDetailComponent } from '../view/investigate-detail/investigate-detail.component';
import { DangerDetailComponent } from '../view/danger-detail/danger-detail.component';
import { DangerReviewComponent } from '../view/danger-review/danger-review.component';
import { ChooseDepartmentPage } from '../view/chooseDepartment/choose.page';
import { DangerAddComponent } from '../view/danger-add/danger-add.component';
import { ChooseDeviceComponent } from '../view/choose-device/choose-device.page';
import { ChooseUnitComponent } from '../view/choose-unit/choose-unit.page';
import { DangerListComponent } from '../view/danger-list/danger-list.page';
import { DiscoverDangerListComponent } from '../view/discover-danger-list/discover-danger-list.page';
import { ExpireDangerListComponent } from '../view/expire-danger-list/expire-danger-list.page';
import { TaskListComponent } from '../view/task-list/task-list.page';
import { ExpireTaskListComponent } from '../view/expire-task-list/expire-task-list.page';
import { DangerProcessComponent } from '../view/danger-process/danger-process.component'
import { DangerAcceptComponent } from '../view/danger-accept/danger-accept.component'
import {CustomTaskListComponent} from '../view/custom-task-list/custom-task-list.page'
import {CustomAbnormalComponent} from '../view/custom-abnormal/custom-abnormal.page'

import {
  StringLengthPipe,
  DateTimePipe, DateFormatPipe,
  SmallCodeValuePipe
} from '../pipi/default.pipi';

const PipeComponent = [
  StringLengthPipe,
  DateTimePipe,
  DateFormatPipe,
  SmallCodeValuePipe,
];

const components = [
  ImagePicker,
  Scaner,
  MlGrayBarComponent,
];

@NgModule({
  declarations: [PHLoginComponent,
    TabBarComponent,
    TabHomeComponent,
    TabAboutComponent,
    TabDeviceComponent,
    TabYHComponent,
    TabCameraComponent,
    InvestigateComponent,
    DebounceClickDirective,
    InvestigateDetailComponent,
    DangerDetailComponent,
    DangerReviewComponent,
    ChooseDepartmentPage,
    ChooseDeviceComponent,
    ChooseUnitComponent,
    ...PipeComponent,
    ...components,
    DangerAddComponent,
    DangerListComponent,
    DiscoverDangerListComponent,
    ExpireDangerListComponent,
    TaskListComponent,
    ExpireTaskListComponent,
    DangerProcessComponent,
    DangerAcceptComponent,
    CustomTaskListComponent,
    CustomAbnormalComponent
  ],
  imports: [CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdMobileModule],
  exports: [TranslateModule,
    FormsModule,
    TabHomeComponent,
    TabAboutComponent,
    TabDeviceComponent,
    TabYHComponent,
    TabCameraComponent,
    ChooseDepartmentPage,
    ChooseDeviceComponent,
    ChooseUnitComponent,
    ...components
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
