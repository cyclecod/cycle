import { HttpService } from '../../service/http.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PickerService, PickerRef } from 'ng-zorro-antd-mobile';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { ToastService, ModalService } from 'ng-zorro-antd-mobile';

@Component({
  selector: 'ph-image',
  templateUrl: './image-picker.html',
  styleUrls: ['./image-picker.less'],
})
export class ImagePicker implements OnInit, OnChanges {
  mediaStream: MediaStream;
  imgShow = false;
  // @Input() fileId: string;
  @Input() isEdit = false;
  @Input() fileList: any = [];
  @Output() fileListChange = new EventEmitter();
  constructor(
    private http: HttpService,
    private _toast: ToastService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    // 附件id 是否存在
    // this.fileList = [];
  }

  async ngOnChanges() {

  }

  fileChange(event: any): void {
    if (event['operationType'] === 'add') {
      // const files = this.dataURLtoFile(event['files'][event['index']]['url'], this.getUUID());
      // event['files'][0]['file'] = files;
      // this.fileList.push(event);
      // console.log(this.fileList);
    }
    if (event['operationType'] === 'remove') {
      // this.deleteImage(file);
      console.log(this.fileList);
    }
    this.fileListChange.emit(this.fileList);
    if (this.fileList.length > 0) {
      const fileName = this.getUUID();
      const files = this.dataURLtoFile(this.fileList[0]['url'], fileName);
      console.log(files);
    }
  }

  async uploadImage(fileList: any, path: string) {
    for (const file of fileList) {
      const fileName = this.getUUID();
      const files = this.dataURLtoFile(file['url'], fileName);
      const formData = new FormData();
      formData.append('file', files);
      await this.http.upload(path, formData, files.name).toPromise().then((data: any) => {
        if (data.body.code === 200) {
          file.id = data.body.data
        }
      });
    }
  }

  deleteImage(file: any): void {
    for (const url of file['list']) {
      if (!this.getEventFile(file['fileList'], url['recId'])) {
        // this.http.delete('file/' + url['recId']).then();
      }
    }
    // this.http.get('fileList/' + file['fileUrl']).then(
    //     (fileData: any) => {
    //         if (Number(fileData['resultCode']) === 0) {
    //             for (const key of this.fileList) {
    //                 if (key['fileType'] === file['fileType']) {
    //                     for (const url of fileData['data']) {
    //                         this.http.delete('file/' + url['recId']).then();
    //                     }
    //                 }
    //             }
    //         }
    //     });
  }

  /**
   * 判断删除的文件是否是当前附件信息
   */
  getEventFile(event: any, fileId: any): boolean {
    for (const key of event) {
      if (key['recId'] === fileId) {
        return true;
      }
    }
    return false;

  }



  imageClick(event: any): void {
    console.log(event);
  }

  dataURLtoFile(base64, fileName): any {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    fileName = fileName + '.' + mime.split('/')[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName, { type: mime });
  }


  getNotNull(value: any): boolean {
    if (value && value !== '') {
      return true;
    }
    return false;
  }

  getUUID(): string {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now();
    }
    const uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  getUserMedia(message) {
    this.imgShow = true;
    this._modal.alert('拍照', message, [
      {
        text: '取消', onPress: () => {
          this.imgShow = false;
          this.closeCamera();
        },
      },
      {
        text: '拍照', onPress: () => {
          this.takepicture();
          this.imgShow = false;
          this.closeCamera();
        },
      }
    ]);
    this.afterOpen();
  }

  /**关闭摄像头 */
  closeCamera() {
    this.mediaStream.getTracks().forEach(track => track.stop());
  }

  /**照相 */
  takepicture(): void {
    const canvas = document.querySelector('canvas');
    const video = document.querySelector('video');
    const context = canvas.getContext('2d');
    canvas.width = 560;
    canvas.height = 540;
    /**
     * 在画布上定位图像，并规定图像的宽度和高度
     * 参数1:图像来源
     * 参数2: 在画布上放置图像的 x 坐标位置。
     * 参数3: 在画布上放置图像的 y 坐标位置。
     * 参数4: 图像的宽
     * 参数5: 图像的高
     */
    context.drawImage(video, 0, 0, 560, 540);
    // data就是拍出照片的base64
    const data = canvas.toDataURL('image/png');
    const img = {
      orientation: 1,
      type: 'img',
      url: data
    };
    const dataList:any = JSON.parse(JSON.stringify(this.fileList));
    dataList.push(img)
    this.fileList = dataList;
  }
  afterOpen() {
    // 选择最接近360x540的分辨率
    const constraints = { video: { width: 560, height: 540 } };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(mediaStream => {
        this.mediaStream = mediaStream;
        // console.log(mediaStream);
        // var video = document.querySelector('video');
        const video: any = document.getElementById('video');
        video.srcObject = this.mediaStream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
      })
      .catch((err: any) => {
        console.log(err);
      }); // 最后一定要检查错误。
  }
}
